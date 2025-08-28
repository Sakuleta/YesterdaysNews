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
  static API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1/historicalevents';
  static MUFFINLABS_BASE_URL = 'https://history.muffinlabs.com/date';
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
        'pt': 'pt', 'ru': 'ru', 'ar': 'ar', 'zh': 'zh', 'ja': 'ja'
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
   * Fetch events from API Ninjas Historical Events API
   * @param {string} month
   * @param {string} day
   * @returns {Promise<Array>}
   */
  static async fetchApiNinjasEvents(month, day) {
    try {
      // Get current language for localized news
      const currentLang = i18n.language || 'en';

      // Prefer backend proxy if provided to keep the key private
      const base = (API?.proxyBaseUrl && API.proxyBaseUrl.trim().length > 0)
        ? `${API.proxyBaseUrl.replace(/\/$/, '')}/historicalevents`
        : this.API_NINJAS_BASE_URL;

      // Add language parameter for better localization
      const url = `${base}?month=${month}&day=${day}&language=${currentLang}`;
      if (__DEV__) console.log('Fetching from API Ninjas:', url);

      const usingProxy = base !== this.API_NINJAS_BASE_URL;
      const envKey = process.env.EXPO_PUBLIC_API_NINJAS_KEY || process.env.API_NINJAS_KEY;
      const configKey = Constants?.expoConfig?.extra?.apiNinjasKey || Constants?.manifest?.extra?.apiNinjasKey;
      const apiKey = usingProxy ? '' : (envKey || configKey || '');

      const response = await this.withRetry(() => axios.get(url, {
        timeout: API?.timeout || 8000, // Reduced timeout for faster response
        headers: {
          'User-Agent': 'YesterdaysNews/1.0 (https://example.com/contact)',
          'Accept': 'application/json',
          ...(apiKey ? { 'X-Api-Key': apiKey } : {})
        }
      }));

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid API Ninjas response format');
        return [];
      }

      console.log(`API Ninjas returned ${response.data.length} events`);
      return this.transformApiNinjasEvents(response.data);
    } catch (error) {
      console.error('Error fetching from API Ninjas:', error.message);

      if (error.response) {
        if (error.response.status === 400) {
          console.error('API Ninjas bad request - check API key and parameters');
        } else if (error.response.status === 429) {
          console.error('API Ninjas rate limit exceeded');
        } else if (error.response.status >= 500) {
          console.error('API Ninjas server error');
        }
      }

      return []; // Return empty array on error
    }
  }

  /**
   * Fetch events from MuffinLabs Today in History API
   * @param {string} month
   * @param {string} day
   * @returns {Promise<Array>}
   */
  static async fetchMuffinLabsEvents(month, day) {
    try {
      // MuffinLabs API format: /date/{month}/{day}
      const url = `${this.MUFFINLABS_BASE_URL}/${month}/${day}`;
      if (__DEV__) console.log('Fetching from MuffinLabs API:', url);

      const response = await this.withRetry(() => axios.get(url, {
        timeout: API?.timeout || 8000, // Reduced timeout for faster response
        headers: {
          'User-Agent': 'YesterdaysNews/1.0 (https://example.com/contact)',
          'Accept': 'application/json'
        }
      }));

      if (!response.data || !response.data.data || !response.data.data.Events) {
        console.error('Invalid MuffinLabs API response format');
        return [];
      }

      console.log(`MuffinLabs API returned ${response.data.data.Events.length} events`);
      return this.transformMuffinLabsEvents(response.data.data.Events);
    } catch (error) {
      console.error('Error fetching from MuffinLabs API:', error.message);

      if (error.response) {
        if (error.response.status === 429) {
          console.error('MuffinLabs API rate limit exceeded');
        } else if (error.response.status >= 500) {
          console.error('MuffinLabs API server error');
        }
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
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
        })) : [],
        source: 'Wikipedia'
      }))
      .filter(event => !isNaN(event.year)) // Filter out events with invalid years
      .slice(0, 60); // Get more events from Wikipedia (increased from default)
  }

  /**
   * Transform raw API Ninjas events into app format
   * @param {Array} events - Raw events from API
   * @returns {Array} Transformed events
   */
  static transformApiNinjasEvents(events) {
    return events
      .filter(event => event.year && event.event)
      .map((event, index) => ({
        id: `api-ninjas-${event.year}-${event.event.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`, // Added index for uniqueness
        year: parseInt(event.year, 10),
        title: EventProcessor.extractTitle(event.event),
        description: event.event,
        category: EventProcessor.categorizeEvent(event.event),
        links: [],
        source: 'API Ninjas'
      }))
      .filter(event => !isNaN(event.year)) // Filter out events with invalid years
      .slice(0, 60); // Get more events from API Ninjas
  }

  /**
   * Transform raw MuffinLabs events into app format
   * @param {Array} events - Raw events from API
   * @returns {Array} Transformed events
   */
  static transformMuffinLabsEvents(events) {
    return events
      .filter(event => event.year && event.text)
      .map((event, index) => ({
        id: `muffinlabs-${event.year}-${event.text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`, // Added index for uniqueness
        year: parseInt(event.year, 10),
        title: EventProcessor.extractTitle(event.text),
        description: event.text,
        category: EventProcessor.categorizeEvent(event.text),
        links: [],
        source: 'MuffinLabs'
      }))
      .filter(event => !isNaN(event.year)) // Filter out events with invalid years
      .slice(0, 60); // Get more events from MuffinLabs
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
