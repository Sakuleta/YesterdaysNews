import { isValidEvent, validateEventsArray, isValidDateFormat } from '../utils/validation';
import { withErrorHandling, logError } from '../utils/errorHandling';
import { defaultClient } from './ApiClient';

/**
 * EventService - Service for handling historical events operations
 * Provides high-level methods for event data management
 */
class EventService {
  constructor(apiClient = defaultClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetch events for a specific date
   * @param {string} month - Month (01-12)
   * @param {string} day - Day (01-31)
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of events
   */
  async fetchEventsForDate(month, day, options = {}) {
    const {
      language = 'en',
      forceRefresh = false,
      useCache = true
    } = options;

    // Validate date format
    if (!isValidDateFormat(`${month}-${day}`)) {
      throw new Error('Invalid date format. Expected MM-DD format.');
    }

    return withErrorHandling(
      async () => {
        const cacheKey = `${language}-${month}-${day}`;
        let events = [];

        // Try to get from cache first (if enabled)
        if (useCache && !forceRefresh) {
          try {
            const cachedData = await this.getCachedEvents(cacheKey);
            if (cachedData && cachedData.length > 0) {
              logError(null, 'EventService.fetchEventsForDate', 'Returning cached events');
              return cachedData;
            }
          } catch (cacheError) {
            logError(cacheError, 'EventService.fetchEventsForDate', 'Cache read failed');
          }
        }

        // Fetch from multiple sources
        const sources = await Promise.allSettled([
          this.fetchFromWikipedia(month, day, language),
          this.fetchFromApiNinjas(month, day, language),
          this.fetchFromMuffinLabs(month, day)
        ]);

        // Collect successful results
        sources.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            events = events.concat(result.value);
          } else {
            logError(result.reason, 'EventService.fetchEventsForDate', `Source ${index} failed`);
          }
        });

        // Process and validate events
        const validEvents = this.processEvents(events);

        // Cache the results
        if (useCache && validEvents.length > 0) {
          try {
            await this.cacheEvents(cacheKey, validEvents);
          } catch (cacheError) {
            logError(cacheError, 'EventService.fetchEventsForDate', 'Cache write failed');
          }
        }

        return validEvents;
      },
      {
        showAlert: true,
        alertTitle: 'Failed to Load Events',
        onError: (error) => {
          logError(error, 'EventService.fetchEventsForDate', 'Failed to fetch events');
        }
      }
    );
  }

  /**
   * Fetch events from Wikipedia API
   * @param {string} month - Month
   * @param {string} day - Day
   * @param {string} language - Language code
   * @returns {Promise<Array>} Array of events
   */
  async fetchFromWikipedia(month, day, language = 'en') {
    const url = `https://${language}.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

    try {
      const response = await this.apiClient.get(url);
      return this.transformWikipediaEvents(response.data.events || []);
    } catch (error) {
      logError(error, 'EventService.fetchFromWikipedia', `Failed to fetch from Wikipedia (${language})`);
      return [];
    }
  }

  /**
   * Fetch events from API Ninjas
   * @param {string} month - Month
   * @param {string} day - Day
   * @param {string} language - Language code
   * @returns {Promise<Array>} Array of events
   */
  async fetchFromApiNinjas(month, day, language = 'en') {
    const baseUrl = process.env.EXPO_PUBLIC_API_NINJAS_URL || 'https://api.api-ninjas.com/v1/historicalevents';
    const apiKey = process.env.EXPO_PUBLIC_API_NINJAS_KEY;

    if (!apiKey) {
      logError(null, 'EventService.fetchFromApiNinjas', 'API key not configured');
      return [];
    }

    const url = `${baseUrl}?month=${month}&day=${day}&language=${language}`;

    try {
      const response = await this.apiClient.get(url, {
        headers: { 'X-Api-Key': apiKey }
      });
      return this.transformApiNinjasEvents(response.data || []);
    } catch (error) {
      logError(error, 'EventService.fetchFromApiNinjas', 'Failed to fetch from API Ninjas');
      return [];
    }
  }

  /**
   * Fetch events from MuffinLabs
   * @param {string} month - Month
   * @param {string} day - Day
   * @returns {Promise<Array>} Array of events
   */
  async fetchFromMuffinLabs(month, day) {
    const baseUrl = 'https://history.muffinlabs.com/date';
    const url = `${baseUrl}/${month}/${day}`;

    try {
      const response = await this.apiClient.get(url);
      return this.transformMuffinLabsEvents(response.data?.data?.Events || []);
    } catch (error) {
      logError(error, 'EventService.fetchFromMuffinLabs', 'Failed to fetch from MuffinLabs');
      return [];
    }
  }

  /**
   * Process and validate events array
   * @param {Array} events - Raw events array
   * @returns {Array} Processed and validated events
   */
  processEvents(events) {
    if (!Array.isArray(events)) {
      return [];
    }

    const validation = validateEventsArray(events);

    if (!validation.isValid) {
      logError(null, 'EventService.processEvents', `Invalid events: ${validation.errors.join(', ')}`);
    }

    return validation.validEvents;
  }

  /**
   * Transform Wikipedia API response
   * @param {Array} events - Raw Wikipedia events
   * @returns {Array} Transformed events
   */
  transformWikipediaEvents(events) {
    return events
      .filter(event => event.year && event.text)
      .map((event, index) => ({
        id: `wiki-${event.year}-${event.text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
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
      .filter(event => !isNaN(event.year))
      .slice(0, 60);
  }

  /**
   * Transform API Ninjas response
   * @param {Array} events - Raw API Ninjas events
   * @returns {Array} Transformed events
   */
  transformApiNinjasEvents(events) {
    return events
      .filter(event => event.year && event.event)
      .map((event, index) => ({
        id: `api-ninjas-${event.year}-${event.event.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
        year: parseInt(event.year, 10),
        title: this.extractTitle(event.event),
        description: event.event,
        category: this.categorizeEvent(event.event),
        links: [],
        source: 'API Ninjas'
      }))
      .filter(event => !isNaN(event.year))
      .slice(0, 60);
  }

  /**
   * Transform MuffinLabs response
   * @param {Array} events - Raw MuffinLabs events
   * @returns {Array} Transformed events
   */
  transformMuffinLabsEvents(events) {
    return events
      .filter(event => event.year && event.text)
      .map((event, index) => ({
        id: `muffinlabs-${event.year}-${event.text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
        year: parseInt(event.year, 10),
        title: this.extractTitle(event.text),
        description: event.text,
        category: this.categorizeEvent(event.text),
        links: [],
        source: 'MuffinLabs'
      }))
      .filter(event => !isNaN(event.year))
      .slice(0, 60);
  }

  /**
   * Extract title from event text
   * @param {string} text - Full event text
   * @returns {string} Extracted title
   */
  extractTitle(text) {
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
  categorizeEvent(text) {
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
   * Cache events for a specific key
   * @param {string} key - Cache key
   * @param {Array} events - Events to cache
   */
  async cacheEvents(key, events) {
    // This would integrate with CacheManager
    // For now, just log the operation
    if (__DEV__) {
      console.log(`Caching ${events.length} events for key: ${key}`);
    }
  }

  /**
   * Get cached events for a specific key
   * @param {string} key - Cache key
   * @returns {Promise<Array|null>} Cached events or null
   */
  async getCachedEvents(key) {
    // This would integrate with CacheManager
    // For now, return null to force fresh fetch
    return null;
  }

  /**
   * Clear cache for a specific key
   * @param {string} key - Cache key
   */
  async clearCache(key) {
    if (__DEV__) {
      console.log(`Clearing cache for key: ${key}`);
    }
  }

  /**
   * Get service statistics
   * @returns {Object} Service statistics
   */
  getStats() {
    return {
      serviceName: 'EventService',
      supportedSources: ['Wikipedia', 'API Ninjas', 'MuffinLabs'],
      lastFetchTime: null, // Would track in production
      cacheHitRate: 0, // Would calculate in production
    };
  }
}

// Create default instance
const eventService = new EventService();

export default EventService;
export { eventService };
