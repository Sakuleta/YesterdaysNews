import axios from 'axios';
import Constants from 'expo-constants';
import { API } from '../utils/constants';
import EventProcessor from './EventProcessor';
import CircuitBreaker from './CircuitBreaker';
import i18n from '../i18n';

/**
 * ApiIntegrations - Handles all external API integrations
 * Follows Single Responsibility Principle - only handles API calls and data transformation
 */
class ApiIntegrations {
  static WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';
  static DDB_BASE_URL = 'https://api.deutsche-digitale-bibliothek.de/search';
  static currentEpoch = 0; // Increment on language change to invalidate old responses
  static abortControllers = new Map(); // cacheKey -> AbortController

  /**
   * Fetch events from Wikipedia API
   * @param {string} month
   * @param {string} day
   * @param {number} epoch
   * @param {string} forceLang - Optional language override for fallback scenarios
   * @returns {Promise<Array>}
   */
  static async fetchWikipediaEvents(month, day, epoch, forceLang = null) {
    try {
      // Check epoch before making request
      if (epoch !== this.currentEpoch) {
        if (__DEV__) console.log('Wikipedia request from old epoch, skipping');
        return [];
      }

      // Get current language and map to Wikipedia language codes
      const currentLang = forceLang || i18n.language || 'en';
      const langMap = {
        'tr': 'tr', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
        'pt': 'pt', 'ru': 'ru'
      };
      const wikiLang = langMap[currentLang] || 'en';

      const url = `https://${wikiLang}.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
      if (__DEV__) console.log('Fetching from Wikipedia API:', url);

      // Create abort controller for this request
      const abortController = new AbortController();
      const cacheKey = `${currentLang}-${month}-${day}`;
      this.abortControllers.set(cacheKey, abortController);

      const response = await this.withRetry(() => axios.get(url, {
        timeout: API?.timeout || 8000, // Reduced timeout for faster response
        signal: abortController.signal,
        headers: {
          'User-Agent': 'YesterdaysNews/1.0 (https://example.com/contact)',
          'Accept': 'application/json'
        }
      }));

      // Check if this response is from the current epoch
      if (epoch !== this.currentEpoch) {
        if (__DEV__) console.log('Wikipedia response from old epoch, discarding');
        return [];
      }

      if (!response.data || !response.data.events) {
        console.error('Invalid Wikipedia API response format');
        return [];
      }

      console.log(`Wikipedia API returned ${response.data.events.length} events`);
      return this.transformWikipediaEvents(response.data.events);
    } catch (error) {
      // Don't show error for aborted requests
      if (error.name === 'AbortError') {
        if (__DEV__) console.log('Wikipedia request was aborted');
        return [];
      }

      // Handle specific error types
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        console.error('Wikipedia API network error - will try fallback sources');
      } else if (error.response) {
        if (error.response.status === 429) {
          console.error('Wikipedia API rate limit exceeded');
        } else if (error.response.status >= 500) {
          console.error('Wikipedia API server error');
        } else if (error.response.status === 404) {
          console.error('Wikipedia API endpoint not found');
        }
      } else {
        console.error('Error fetching from Wikipedia API:', error.message);
      }

      return []; // Return empty array on error
    }
  }

  /**
   * Fetch events from Deutsche Digitale Bibliothek API
   * @param {string} month - Month (01-12)
   * @param {string} day - Day (01-31)
   * @returns {Promise<Array>}
   */
  static async fetchDeutscheDigitaleBibliothekEvents(month, day) {
    try {
      // Get current language for localized content
      const currentLang = i18n.language || 'de';

      // Create date query for "on this day" - try different approaches
      // First try simple query without date filter to test basic connectivity
      const dateQuery = `subtitle:*${month}${day}*`; // Search for MMDD pattern in subtitle

      // Add minimal search parameters to test basic functionality
      const params = new URLSearchParams({
        query: dateQuery,
        rows: '10', // Smaller number for testing
        // Removed facet and sort for now to test basic connectivity
      });

      // Check for API key in environment variables or constants
      const apiKey = process.env.EXPO_PUBLIC_DDB_API_KEY || process.env.DDB_API_KEY ||
                    Constants?.expoConfig?.extra?.ddbApiKey || Constants?.manifest?.extra?.ddbApiKey;

      if (__DEV__) {
        console.log('DDB API Key found:', !!apiKey);
        if (apiKey) console.log('API Key length:', apiKey.length);
      }

      // Build URL with API key as query parameter (required by DDB API)
      let url = `${this.DDB_BASE_URL}?${params.toString()}`;
      if (apiKey) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('oauth_consumer_key', apiKey);
        url = urlObj.toString();
      }

      if (__DEV__) console.log('Fetching from Deutsche Digitale Bibliothek API:', url);

      const headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; YesterdaysNews/1.0)',
        'Accept': 'application/json',
        'Accept-Language': 'de,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      };

      // Try without withRetry first to debug the issue
      if (__DEV__) console.log('Making direct axios request...');
      const response = await axios.get(url, {
        timeout: 10000, // Longer timeout
        headers: headers,
        validateStatus: function (status) {
          return status < 500; // Accept 4xx errors but not 5xx
        }
      });

      if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
        console.error('Invalid Deutsche Digitale Bibliothek API response format');
        return [];
      }

      console.log(`Deutsche Digitale Bibliothek API returned ${response.data.results.length} results`);
      return this.transformDeutscheDigitaleBibliothekEvents(response.data.results);
    } catch (error) {
      console.error('Error fetching from Deutsche Digitale Bibliothek API:', error.message);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        if (error.response.data) {
          console.error('Response data:', error.response.data);
        }

        if (error.response.status === 403) {
          console.error('Deutsche Digitale Bibliothek API access forbidden - check API key');
        } else if (error.response.status === 429) {
          console.error('Deutsche Digitale Bibliothek API rate limit exceeded');
        } else if (error.response.status >= 500) {
          console.error('Deutsche Digitale Bibliothek API server error');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }

      return []; // Return empty array on error
    }
  }

  /**
   * Transform raw Wikipedia API events into app format
   * @param {Array} events - Raw events from API
   * @returns {Array} Transformed events
   */
  static transformWikipediaEvents(events) {
    // Get current language to determine Wikipedia domain
    const currentLang = i18n.language || 'en';
    const langMap = {
      'tr': 'tr', 'es': 'es', 'fr': 'fr', 'de': 'de', 'it': 'it',
      'pt': 'pt', 'ru': 'ru'
    };
    const wikiLang = langMap[currentLang] || 'en';

    return events
      .filter(event => event.year && event.text)
      .map((event, index) => ({
        id: `wiki-${event.year}-${event.text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`, // Added index for uniqueness
        year: parseInt(event.year, 10),
        title: EventProcessor.extractTitle(event.text),
        description: event.text,
        category: EventProcessor.categorizeEvent(event.text),
        links: event.pages ? event.pages.map(page => ({
          title: page.title,
          url: `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
        })) : [],
        source: 'Wikipedia'
      }))
      .filter(event => !isNaN(event.year)) // Filter out events with invalid years
      // No limit - show all available Wikipedia events
  }

  /**
   * Transform raw Deutsche Digitale Bibliothek events into app format
   * @param {Array} results - Raw results from DDB API
   * @returns {Array} Transformed events
   */
  static transformDeutscheDigitaleBibliothekEvents(results) {
    if (__DEV__) {
      console.log('DDB Transform input:', results?.length || 0, 'results');
      if (results[0] && results[0].docs && results[0].docs[0]) {
        console.log('Sample doc fields:', Object.keys(results[0].docs[0]));
      }
    }

    return results
      .filter(result => result && result.docs && result.docs.length > 0)
      .map((result, index) => {
        const doc = result.docs[0]; // Take the first document from each result

        // Extract year from subtitle field (DDB stores date info in subtitle)
        let year = null;
        if (__DEV__) {
          console.log('Available fields in doc:', Object.keys(doc));
          console.log('Title field:', doc.title);
          console.log('Subtitle field:', doc.subtitle);
        }

        // Try to extract year from subtitle first
        if (doc.subtitle && typeof doc.subtitle === 'string') {
          // Look for 4-digit year patterns in subtitle
          const yearMatches = doc.subtitle.match(/\b(1[0-9]{3}|2[0-9]{3})\b/g);
          if (yearMatches && yearMatches.length > 0) {
            // Take the first year found
            year = parseInt(yearMatches[0], 10);
            if (__DEV__) console.log('Extracted year from subtitle:', year);
          }
        }

        // Fallback to time field if subtitle doesn't have year
        if (!year && doc.time && Array.isArray(doc.time)) {
          const timeValue = doc.time[0];
          if (typeof timeValue === 'string') {
            const yearMatch = timeValue.match(/^(\d{4})/);
            if (yearMatch) {
              year = parseInt(yearMatch[1], 10);
            }
          } else if (typeof timeValue === 'number') {
            year = timeValue;
          }
        }

        if (__DEV__) console.log('Extracted year:', year);

        // Extract title and description
        const title = doc.title ? doc.title[0] : 'Unbekannter Titel';
        const description = doc.description ? doc.description[0] : doc.title ? doc.title[0] : 'Keine Beschreibung verfügbar';

        // Create links if available
        const links = [];
        if (doc.id && doc.id[0]) {
          links.push({
            title: title,
            url: `https://www.deutsche-digitale-bibliothek.de/item/${doc.id[0]}`
          });
        }

        return {
          id: `ddb-${doc.id ? doc.id[0] : `unknown-${index}`}`,
          year: year || 0, // Use 0 if no year found, will be filtered out later
          title: EventProcessor.extractTitle(title),
          description: description,
          category: EventProcessor.categorizeEvent(description),
          links: links,
          source: 'Deutsche Digitale Bibliothek'
        };
      })
      .filter(event => event.year && !isNaN(event.year) && event.year > 0) // Filter out events without valid years
      // No limit - show all available Deutsche Digitale Bibliothek events
  }

  /**
   * Retry helper with exponential backoff for transient errors
   */
  static async withRetry(requestFn) {
    const attempts = Math.max(1, API?.retryAttempts ?? 2); // Reduced from 3 to 2
    const initial = API?.backoffInitial ?? 200; // Reduced from 400 to 200
    const factor = API?.backoffFactor ?? 1.5; // Reduced from 2 to 1.5
    const maxDelay = API?.backoffMax ?? 2000; // Reduced from 4000 to 2000
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await requestFn();
        return res;
      } catch (err) {
        lastError = err;
        const status = err?.response?.status;
        const retriable = !status || status >= 500 || status === 429;
        if (i === attempts - 1 || !retriable) break;
        const delay = Math.min(maxDelay, initial * Math.pow(factor, i));
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  }
}

export default ApiIntegrations;

