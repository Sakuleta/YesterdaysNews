import axios from 'axios';
// Removed XML parser as ja/ar/zh support is fully disabled
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateUtils from './DateUtils';
import { API } from '../utils/constants';
import Constants from 'expo-constants';
import i18n from '../i18n';

/**
 * Service class for fetching historical events from multiple APIs
 */
class HistoricalEventsAPI {
  static WIKIPEDIA_BASE_URL = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';
  static API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1/historicalevents'; // Working alternative
  static MUFFINLABS_BASE_URL = 'https://history.muffinlabs.com/date'; // MuffinLabs Today in History API
  static CACHE_PREFIX = 'historical_events_';
  // Removed external endpoints and RSS_SOURCES
  static inFlightRequests = new Map(); // cacheKey -> Promise
  static circuit = new Map(); // sourceKey -> { state: 'closed'|'open'|'half', lastFailure: number, openUntil: number }
  static rateLimiter = { lastTs: 0, minIntervalMs: 300 }; // simple global throttle
  static currentEpoch = 0; // Increment on language change to invalidate old responses
  static abortControllers = new Map(); // cacheKey -> AbortController

  /**
   * Fetch historical events for current date from all sources
   * @returns {Promise<Array>} Array of historical events
   */
  static async getEventsForToday() {
    const { month, day } = DateUtils.getCurrentDateForAPI();
    if (__DEV__) console.log('Getting events for today:', month, day);
    return this.getEventsForDate(month, day);
  }

  /**
   * Force refresh - clear cache and fetch fresh data from all sources
   * @returns {Promise<Array>} Array of historical events
   */
  static async forceRefreshToday() {
    const { month, day } = DateUtils.getCurrentDateForAPI();
    const currentLang = i18n.language || 'en';
    const cacheKey = `${currentLang}-${month}-${day}`;
    
    // Check if we're offline - if so, don't clear cache, just return cached data
    try {
      // Simple network check
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 3000 
      });
      if (!response.ok) throw new Error('Network unavailable');
    } catch (error) {
      // We're offline, return cached data if available
      if (__DEV__) console.log('Offline detected, returning cached data for force refresh');
      const cachedEvents = await this.getCachedEvents(cacheKey, true); // ignore expiry
      if (cachedEvents && cachedEvents.length > 0) {
        return cachedEvents;
      }
      // No cached data available offline
      return [];
    }
    
    // We're online, proceed with normal force refresh
    try {
      const fullCacheKey = `${this.CACHE_PREFIX}${cacheKey}`;
      await AsyncStorage.removeItem(fullCacheKey);
      if (__DEV__) console.log('Cleared cache for:', cacheKey);
      
      // Wait a bit to ensure cache clear is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear any existing abort controllers for this key
      if (this.abortControllers.has(cacheKey)) {
        this.abortControllers.get(cacheKey).abort();
        this.abortControllers.delete(cacheKey);
      }
      
      // Clear any in-flight requests for this key
      if (this.inFlightRequests.has(cacheKey)) {
        this.inFlightRequests.delete(cacheKey);
      }
      
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
    
    // Now fetch fresh data
    return this.getEventsForDate(month, day);
  }

  /**
   * Fetch historical events for specific date from all sources
   * @param {string} month 
   * @param {string} day 
   * @returns {Promise<Array>} Array of historical events
   */
  static async getEventsForDate(month, day) {
    const currentLang = i18n.language || 'en';
    const normalizedKey = this.normalizeCacheKey(`${currentLang}-${month}-${day}`);
    const cacheKey = normalizedKey;

    // Abort any existing request for this cache key
    if (this.abortControllers.has(cacheKey)) {
      this.abortControllers.get(cacheKey).abort();
      this.abortControllers.delete(cacheKey);
    }

    // Simple request coalescing to avoid duplicate concurrent fetches
    if (this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey);
    }

    // Simple global throttle to reduce burst when user taps rapidly
    const now = Date.now();
    const delta = now - this.rateLimiter.lastTs;
    if (delta < this.rateLimiter.minIntervalMs) {
      await new Promise(r => setTimeout(r, this.rateLimiter.minIntervalMs - delta));
    }
    this.rateLimiter.lastTs = Date.now();
    
    try {
      // Check cache first
      const cachedEvents = await this.getCachedEvents(cacheKey);
      if (cachedEvents) {
        console.log('Returning cached events for', cacheKey);
        return cachedEvents;
      }

      // Fetch only localized content for the current language
      if (__DEV__) console.log('Fetching localized events for', cacheKey);
      const requestEpoch = this.currentEpoch;
      
      // Create abort controller for this specific request
      const abortController = new AbortController();
      this.abortControllers.set(cacheKey, abortController);
      
      const promise = this.fetchLocalizedNews(month, day, requestEpoch)
        .then(async (localizedEvents) => {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            if (__DEV__) console.log('Request was aborted, returning empty array');
            return [];
          }
          
          // Discard if stale epoch
          if (requestEpoch !== this.currentEpoch) {
            if (__DEV__) console.log('Response from old epoch, discarding');
            return [];
          }

          if (__DEV__) console.log(`Localized events for ${i18n.language}: ${localizedEvents.length} events`);

          let combinedEvents = localizedEvents;
          if (combinedEvents.length === 0) {
            if (__DEV__) console.log('No localized events, trying fallback sources');
            const fallbackEvents = await this.fetchFallbackEvents(month, day);
            combinedEvents = fallbackEvents;
          }

          // Only cache non-empty successful results
          if (combinedEvents && combinedEvents.length > 0) {
            await this.setCachedEvents(cacheKey, combinedEvents);
          }

          if (__DEV__) console.log(`Final result: ${combinedEvents.length} events for ${cacheKey}`);
          return combinedEvents;
        })
        .catch(async (error) => {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            if (__DEV__) console.log('Request was aborted during error handling');
            return [];
          }
          
          // If localized news fails, try fallback sources
          if (__DEV__) console.log('Localized news failed, trying fallback sources');
          try {
            const fallbackEvents = await this.fetchFallbackEvents(month, day);
            if (fallbackEvents && fallbackEvents.length > 0) {
              // Cache fallback results
              await this.setCachedEvents(cacheKey, fallbackEvents);
              return fallbackEvents;
            }
          } catch (fallbackError) {
            if (__DEV__) console.error('Fallback sources also failed:', fallbackError);
          }
          
          // Return empty array if all sources fail
          return [];
        })
        .finally(() => {
          // Clean up
          this.inFlightRequests.delete(cacheKey);
          this.abortControllers.delete(cacheKey);
        });

      this.inFlightRequests.set(cacheKey, promise);
      return promise;
    } catch (error) {
      console.error('Error fetching historical events:', error);
      
      // Try to return cached events even if expired
      const cachedEvents = await this.getCachedEvents(cacheKey, true);
      if (cachedEvents) {
        if (__DEV__) console.log('Returning expired cached events due to API error');
        return cachedEvents;
      }
      
      // Try fallback sources as last resort
      try {
        if (__DEV__) console.log('Trying fallback sources as last resort');
        const fallbackEvents = await this.fetchFallbackEvents(month, day);
        if (fallbackEvents && fallbackEvents.length > 0) {
          return fallbackEvents;
        }
      } catch (fallbackError) {
        if (__DEV__) console.error('All sources failed:', fallbackError);
      }
      
      throw new Error(this.getErrorMessage(error));
    }
  }

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
        title: this.extractTitle(event.text),
        description: event.text,
        category: this.categorizeEvent(event.text),
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
        title: this.extractTitle(event.event),
        description: event.event,
        category: this.categorizeEvent(event.event),
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
        title: this.extractTitle(event.text),
        description: event.text,
        category: this.categorizeEvent(event.text),
        links: [],
        source: 'MuffinLabs'
      }))
      .filter(event => !isNaN(event.year)) // Filter out events with invalid years
      .slice(0, 60); // Get more events from MuffinLabs
  }

  /**
   * Extract title from event text
   * @param {string} text - Full event text
   * @returns {string} Extracted title
   */
  static extractTitle(text) {
    // Handle null or undefined text
    if (!text || typeof text !== 'string') {
      return 'Untitled Event';
    }
    
    const sentences = text.split('.');
    let title = sentences[0] || text;
    
    if (title.length > 100) {
      const parts = title.split(' – ');
      title = parts[0] || title;
    }
    
    return title.length > 120 ? title.substring(0, 117) + '...' : title;
  }

  /**
   * Categorize event based on text content
   * @param {string} text - Event text
   * @returns {string} Event category
   */
  static categorizeEvent(text) {
    // Handle null or undefined text
    if (!text || typeof text !== 'string') {
      return 'event';
    }
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('born') || lowerText.includes('birth')) {
      return 'birth';
    } else if (lowerText.includes('died') || lowerText.includes('death') || lowerText.includes('executed')) {
      return 'death';
    } else if (lowerText.includes('war') || lowerText.includes('battle') || lowerText.includes('invasion')) {
      return 'war';
    } else if (lowerText.includes('discover') || lowerText.includes('invention') || lowerText.includes('patent')) {
      return 'discovery';
    } else if (lowerText.includes('earthquake') || lowerText.includes('volcano') || lowerText.includes('disaster')) {
      return 'disaster';
    } else if (lowerText.includes('king') || lowerText.includes('queen') || lowerText.includes('emperor') || lowerText.includes('crowned')) {
      return 'politics';
    } else if (lowerText.includes('treaty') || lowerText.includes('independence') || lowerText.includes('revolution')) {
      return 'politics';
    }
    
    return 'event';
  }

  /**
   * Combine, deduplicate, score and curate events for balanced feed
   * - Ensures diversity across eras (ancient → modern)
   * - Caps dense decades so one era doesn't dominate
   * - Ranks events by an interest score (recency, category, richness, source diversity)
   * @param {Array} localizedEvents - Events from localized sources
   * @param {Array} apiNinjasEvents - Events from API Ninjas
   * @param {Array} muffinLabsEvents - Events from MuffinLabs
   * @returns {Array} Curated events list
   */
  static combineAndDeduplicateEvents(localizedEvents, apiNinjasEvents, muffinLabsEvents) {
    try {
      const LIMIT = 60;
      const PER_DECADE_CAP = 3; // avoid clusters from the same decade

      // Filter out any null or undefined sources
      const validSources = [localizedEvents, apiNinjasEvents, muffinLabsEvents].filter(source => Array.isArray(source));
      const allEvents = [].concat(...validSources);
      
      // Filter out any invalid events
      const validEvents = allEvents.filter(event => 
        event && 
        event.year && 
        event.title && 
        typeof event.year === 'number' && 
        !isNaN(event.year) &&
        typeof event.title === 'string' &&
        event.title.trim().length > 0
      );
      
      // Deduplicate (title/year + fuzzy title)
      const uniqueEvents = [];
      const seenTitles = new Set();
      const seenYearTitle = new Set();

      for (const event of validEvents) {
        const normalizedTitle = event.title.toLowerCase().trim();
        const key = `${event.year}-${normalizedTitle}`;
        if (seenYearTitle.has(key)) continue;

        let duplicate = false;
        for (const t of seenTitles) {
          if (this.isSimilarTitle(normalizedTitle, t)) {
            duplicate = true;
            break;
          }
        }
        if (duplicate) continue;
        
        seenYearTitle.add(key);
        seenTitles.add(normalizedTitle);
        uniqueEvents.push(event);
      }

      // Score events for interest
      const scored = uniqueEvents.map(e => ({
        ...e,
        _score: this.scoreEventInterest(e)
      }));

      // Group by eras and decide targets
      const byEra = new Map();
      for (const e of scored) {
        const era = this.getEraForYear(e.year);
        if (!byEra.has(era)) byEra.set(era, []);
        byEra.get(era).push(e);
      }
      for (const [, list] of byEra) list.sort((a, b) => b._score - a._score);

      const targets = this.getEraTargets(LIMIT, byEra);

      // Select with per-decade cap inside each era
      const selected = [];
      const decadeCounters = new Map();

      const pickFromEra = (era, count) => {
        const list = byEra.get(era) || [];
        for (const ev of list) {
          if (selected.length >= LIMIT) break;
          if (count <= 0) break;
          const decade = Math.floor(ev.year / 10) * 10;
          const dKey = `${era}-${decade}`;
          const dCount = decadeCounters.get(dKey) || 0;
          if (dCount >= PER_DECADE_CAP) continue;
          // Avoid near-duplicate same-year titles already chosen
          const already = selected.find(s => s.year === ev.year && this.isSimilarTitle(s.title.toLowerCase(), ev.title.toLowerCase()));
          if (already) continue;

          selected.push(ev);
          decadeCounters.set(dKey, dCount + 1);
          count--;
        }
        return count;
      };

      // Primary pass by target allocations
      for (const [era, target] of targets) {
        pickFromEra(era, target);
      }

      // Secondary pass: fill remaining slots by global score with decade cap
      if (selected.length < LIMIT) {
        const remaining = scored
          .filter(e => !selected.includes(e))
          .sort((a, b) => b._score - a._score);
        for (const ev of remaining) {
          if (selected.length >= LIMIT) break;
          const era = this.getEraForYear(ev.year);
          const decade = Math.floor(ev.year / 10) * 10;
          const dKey = `${era}-${decade}`;
          const dCount = decadeCounters.get(dKey) || 0;
          if (dCount >= PER_DECADE_CAP) continue;
          const already = selected.find(s => s.year === ev.year && this.isSimilarTitle(s.title.toLowerCase(), ev.title.toLowerCase()));
          if (already) continue;
          selected.push(ev);
          decadeCounters.set(dKey, dCount + 1);
        }
      }

      // Final ordering: newest first; tie-break on score then title
      const finalList = selected
        .sort((a, b) => (b.year - a.year) || (b._score - a._score) || a.title.localeCompare(b.title))
        .map(({ _score, ...rest }) => rest); // strip score

      const eraCounts = finalList.reduce((acc, e) => {
        const era = this.getEraForYear(e.year);
        acc[era] = (acc[era] || 0) + 1;
        return acc;
      }, {});
      console.log('Era distribution:', eraCounts);

      return finalList;
    } catch (error) {
      console.error('Error combining and deduplicating events:', error);
      return [];
    }
  }

  /**
   * Compute an interest score for an event
   * - Recency gets a mild boost (but not dominant)
   * - Category weights (war/discovery/politics/etc.)
   * - Richness: description length and presence of links
   * - Source diversity bonus for non-Wikipedia sources
   */
  static scoreEventInterest(event) {
    const currentYear = new Date().getFullYear();
    const yearDelta = Math.max(0, currentYear - event.year);

    // Recency: newer gets slightly higher, capped
    const recencyScore = 1 - Math.min(yearDelta / 500, 1); // between 0 and 1

    const categoryWeights = {
      war: 1.0,
      discovery: 0.9,
      politics: 0.85,
      death: 0.5,
      birth: 0.4,
      event: 0.8
    };
    const categoryScore = categoryWeights[event.category] || 0.7;

    const descriptionScore = Math.min(((event.description || '').length) / 280, 1); // up to 1
    const linksScore = Math.min((event.links || []).length / 3, 1); // up to 1

    const sourceBonus = event.source === 'API Ninjas' ? 0.15 : event.source === 'MuffinLabs' ? 0.1 : 0;

    // Weighted sum, final between ~0 and ~4
    return (recencyScore * 0.6) + (categoryScore * 1.2) + (descriptionScore * 0.6) + (linksScore * 0.3) + sourceBonus;
  }

  /**
   * Map year to broad eras for balanced sampling
   */
  static getEraForYear(year) {
    if (year < 500) return 'ancient';
    if (year < 1500) return 'medieval';
    if (year < 1800) return 'early_modern';
    if (year < 1900) return 'nineteenth';
    if (year < 2000) return 'twentieth';
    return 'twenty_first';
  }

  /**
   * Decide target counts per era based on availability and a base template
   */
  static getEraTargets(limit, byEra) {
    // Base template totals ~60
    const base = new Map([
      ['ancient', 5],
      ['medieval', 8],
      ['early_modern', 10],
      ['nineteenth', 12],
      ['twentieth', 17],
      ['twenty_first', 8],
    ]);

    // Scale if limit != 60
    const baseTotal = Array.from(base.values()).reduce((a, b) => a + b, 0);
    const scale = limit / baseTotal;
    for (const [k, v] of base) base.set(k, Math.max(1, Math.floor(v * scale)));

    // Clamp by availability and collect deficits
    let total = 0;
    const deficits = [];
    for (const [era, target] of base) {
      const available = (byEra.get(era) || []).length;
      const capped = Math.min(target, available);
      base.set(era, capped);
      total += capped;
      if (capped < target) deficits.push({ era, missing: target - capped });
    }

    // If we still have room, distribute to eras with surplus proportionally by their availability
    if (total < limit) {
      const surplusPool = limit - total;
      const surplusEras = Array.from(byEra.entries())
        .map(([era, list]) => ({ era, available: list.length - (base.get(era) || 0) }))
        .filter(x => x.available > 0)
        .sort((a, b) => b.available - a.available);

      let remaining = surplusPool;
      for (const s of surplusEras) {
        if (remaining <= 0) break;
        const add = Math.min(s.available, Math.ceil(remaining / surplusEras.length));
        base.set(s.era, (base.get(s.era) || 0) + add);
        remaining -= add;
      }
    }

    return base;
  }

  /**
   * Check if two titles are similar (for better deduplication)
   * @param {string} title1 - First title
   * @param {string} title2 - Second title
   * @returns {boolean} True if titles are similar
   */
  static isSimilarTitle(title1, title2) {
    if (!title1 || !title2) return false;
    
    // Remove common words and punctuation for comparison
    const cleanTitle1 = title1.replace(/[^\w\s]/g, '').toLowerCase();
    const cleanTitle2 = title2.replace(/[^\w\s]/g, '').toLowerCase();
    
    // Split into words
    const words1 = cleanTitle1.split(/\s+/).filter(word => word.length > 2);
    const words2 = cleanTitle2.split(/\s+/).filter(word => word.length > 2);
    
    // Calculate similarity score
    let commonWords = 0;
    for (const word of words1) {
      if (words2.includes(word)) {
        commonWords++;
      }
    }
    
    // If more than 70% of words are common, consider them similar
    const similarityThreshold = 0.7;
    const maxWords = Math.max(words1.length, words2.length);
    
    return maxWords > 0 && (commonWords / maxWords) > similarityThreshold;
  }

  /**
   * Get cached events for a date
   * @param {string} dateKey - Date key (MM-DD format)
   * @param {boolean} ignoreExpiry - Whether to ignore cache expiry
   * @returns {Promise<Array|null>} Cached events or null
   */
  static async getCachedEvents(dateKey, ignoreExpiry = false) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${dateKey}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }
      
      const parsedCache = JSON.parse(cached);
      
      if (!ignoreExpiry && !DateUtils.isCacheValid(parsedCache.timestamp)) {
        if (__DEV__) console.log('Cache expired for', dateKey);
        return null;
      }
      
      if (__DEV__) console.log('Returning cached events for', dateKey);
      return parsedCache.events;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Cache events for a date
   * @param {string} dateKey - Date key (MM-DD format)
   * @param {Array} events - Events to cache
   */
  static async setCachedEvents(dateKey, events) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${dateKey}`;
      const cacheData = {
        timestamp: Date.now(),
        events: events
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      if (__DEV__) console.log('Cached events for', dateKey);
    } catch (error) {
      console.error('Error caching events:', error);
    }
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

  /**
   * Clear cache for specific language when switching
   */
  static async clearLanguageCache(oldLang = null) {
    try {
      // Check if we're offline - if so, don't clear cache aggressively
      let isOffline = false;
      try {
        const response = await fetch('https://www.google.com', { 
          method: 'HEAD',
          timeout: 3000 
        });
        if (!response.ok) throw new Error('Network unavailable');
      } catch (error) {
        isOffline = true;
        if (__DEV__) console.log('Offline detected during language change, preserving cache');
      }
      
      // Increment epoch to invalidate all pending requests
      this.currentEpoch++;
      
      // Abort all pending requests
      for (const [cacheKey, controller] of this.abortControllers) {
        controller.abort();
      }
      this.abortControllers.clear();
      
      // Clear in-flight requests
      this.inFlightRequests.clear();
      
      // Wait a bit to ensure all aborts are processed
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // If offline, don't clear any cache - preserve all cached data
      if (isOffline) {
        if (__DEV__) console.log('Offline detected - preserving all cache during language change');
        return; // Don't clear any cache when offline
      }
      
      // Online: proceed with normal cache clearing
      const allKeys = await AsyncStorage.getAllKeys();
      let cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      // If old language specified, only clear that language's cache
      if (oldLang) {
        cacheKeys = cacheKeys.filter(key => key.includes(`-${oldLang}-`));
      }
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        if (__DEV__) console.log(`Cleared ${cacheKeys.length} cache entries for language: ${oldLang || 'all'}`);
      }
      
      // Wait a bit more to ensure cache clear is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error clearing language cache:', error);
    }
  }

  /**
   * Fetch fallback events when localized sources fail
   */
  static async fetchFallbackEvents(month, day) {
    try {
      const currentLang = i18n.language || 'en';
      
      // For all languages, try API Ninjas and MuffinLabs as fallbacks
      if (__DEV__) console.log('Fetching fallback events from API Ninjas and MuffinLabs');
      
      const [apiNinjasEvents, muffinLabsEvents] = await Promise.all([
        this.fetchApiNinjasEvents(month, day),
        this.fetchMuffinLabsEvents(month, day)
      ]);
      
      // Combine fallback events
      const allEvents = [...(apiNinjasEvents || []), ...(muffinLabsEvents || [])];
      
      if (allEvents.length > 0) {
        if (__DEV__) console.log(`Fallback sources returned ${allEvents.length} events`);
        return this.combineAndDeduplicateEvents(allEvents, [], []);
      }
      
      // If still no events, try English Wikipedia as ultimate fallback
      if (currentLang !== 'en') {
        if (__DEV__) console.log('Trying English Wikipedia as ultimate fallback');
        try {
          const englishEvents = await this.fetchWikipediaEvents(month, day, this.currentEpoch, 'en');
          if (englishEvents && englishEvents.length > 0) {
            if (__DEV__) console.log(`English Wikipedia fallback returned ${englishEvents.length} events`);
            return englishEvents;
          }
        } catch (wikiError) {
          if (__DEV__) console.error('English Wikipedia fallback also failed:', wikiError);
        }
      }
      
      return [];
    } catch (error) {
      if (__DEV__) console.error('Error fetching fallback events:', error);
      return [];
    }
  }

  /**
   * Fetch localized news from multiple sources based on language
   */
  static async fetchLocalizedNews(month, day, currentEpoch) {
    try {
      const currentLang = i18n.language || 'en';
      
      // Temporarily disable ja/ar/zh completely
      if (['ja', 'ar', 'zh'].includes(currentLang)) {
        if (__DEV__) console.log(`Language ${currentLang} disabled. Falling back to en.`);
        return [];
      }

      // Try Wikipedia API first
      let events = await this.fetchWikipediaEvents(month, day, currentEpoch);
      
      // If Wikipedia fails or returns no events, try fallback sources
      if (!events || events.length === 0) {
        if (__DEV__) console.log('Wikipedia API failed or returned no events, trying fallback sources');
        
        // For non-English languages, try English Wikipedia as fallback
        if (currentLang !== 'en') {
          if (__DEV__) console.log('Trying English Wikipedia as fallback');
          const fallbackEvents = await this.fetchWikipediaEvents(month, day, currentEpoch, 'en');
          if (fallbackEvents && fallbackEvents.length > 0) {
            if (__DEV__) console.log(`English fallback returned ${fallbackEvents.length} events`);
            return fallbackEvents;
          }
        }
        
        // Try API Ninjas and MuffinLabs as additional fallbacks
        if (__DEV__) console.log('Trying API Ninjas and MuffinLabs as fallbacks');
        const [apiNinjasEvents, muffinLabsEvents] = await Promise.all([
          this.fetchApiNinjasEvents(month, day),
          this.fetchMuffinLabsEvents(month, day)
        ]);
        
        // Combine fallback events
        const allFallbackEvents = [...(apiNinjasEvents || []), ...(muffinLabsEvents || [])];
        if (allFallbackEvents.length > 0) {
          if (__DEV__) console.log(`Fallback sources returned ${allFallbackEvents.length} events`);
          return allFallbackEvents;
        }
      }
      
      return events || [];
    } catch (error) {
      // Don't show error for aborted requests
      if (error.name === 'AbortError') {
        if (__DEV__) console.log('Localized news request was aborted');
        return [];
      }
      if (__DEV__) console.error('Error fetching localized news:', error);
      
      // Try to get events from fallback sources even if localized news fails
      try {
        if (__DEV__) console.log('Trying fallback sources after localized news error');
        const fallbackEvents = await this.fetchFallbackEvents(month, day);
        return fallbackEvents || [];
      } catch (fallbackError) {
        if (__DEV__) console.error('Fallback sources also failed:', fallbackError);
        return [];
      }
    }
  }


  // Circuit breaker helpers
  static canRequest(sourceKey) {
    const entry = this.circuit.get(sourceKey);
    if (!entry) return true;
    if (entry.state === 'open' && Date.now() < entry.openUntil) return false;
    if (entry.state === 'open' && Date.now() >= entry.openUntil) {
      // move to half-open
      this.circuit.set(sourceKey, { state: 'half', lastFailure: entry.lastFailure, openUntil: 0 });
      return true;
    }
    return true;
  }
  static recordFailure(sourceKey) {
    const now = Date.now();
    const backoffMs = 60000; // 60s open window
    this.circuit.set(sourceKey, { state: 'open', lastFailure: now, openUntil: now + backoffMs });
  }
  static recordSuccess(sourceKey) {
    this.circuit.set(sourceKey, { state: 'closed', lastFailure: 0, openUntil: 0 });
  }

  // Normalize cache key to use Latin digits and hyphenated MM-DD
  static normalizeCacheKey(key) {
    const arabicIndic = '٠١٢٣٤٥٦٧٨٩';
    const easternArabic = '۰۱۲۳۴۵۶۷۸۹';
    const mapDigit = (ch) => {
      const i1 = arabicIndic.indexOf(ch);
      if (i1 >= 0) return String(i1);
      const i2 = easternArabic.indexOf(ch);
      if (i2 >= 0) return String(i2);
      return ch;
    };
    return key.split('').map(mapDigit).join('');
  }

  /**
   * Clear old cache entries (keep last 30 days)
   */
  static async clearOldCache() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      const keysToRemove = [];
      
      for (const key of cacheKeys) {
        try {
          const cached = await AsyncStorage.getItem(key);
          if (cached) {
            const parsedCache = JSON.parse(cached);
            const daysDiff = (Date.now() - parsedCache.timestamp) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > 30) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // If we can't parse the cache, remove it
          keysToRemove.push(key);
        }
      }
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        if (__DEV__) console.log(`Cleared ${keysToRemove.length} old cache entries`);
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  static getErrorMessage(error) {
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      return 'No internet connection. Please check your network and try again.';
    } else if (error.code === 'TIMEOUT') {
      return 'Request timed out. Please try again.';
    } else if (error.response && error.response.status >= 500) {
      return 'Service temporarily unavailable. Please try again later.';
    } else if (error.response && error.response.status === 404) {
      return 'No historical events found for this date.';
    } else if (error.response && error.response.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    } else if (error.message && error.message.includes('API error response')) {
      return 'Historical events service is temporarily unavailable. Please try again later.';
    } else {
      return 'Unable to load historical events. Please try again.';
    }
  }
}

export default HistoricalEventsAPI;