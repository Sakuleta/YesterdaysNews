import DateUtils from './DateUtils';
import CacheManager from './CacheManager';
import ApiIntegrations from './ApiIntegrations';
import EventProcessor from './EventProcessor';
import CircuitBreaker from './CircuitBreaker';
import i18n from '../i18n';

/**
 * HistoricalEventsAPI - Main orchestration service for historical events
 * Follows Single Responsibility Principle - orchestrates API calls and data flow
 * Delegates specific responsibilities to specialized modules
 */
class HistoricalEventsAPI {
  static inFlightRequests = new Map(); // cacheKey -> Promise
  static rateLimiter = { lastTs: 0, minIntervalMs: 300 }; // simple global throttle

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
      const cachedEvents = await CacheManager.getCachedEvents(cacheKey, true); // ignore expiry
      if (cachedEvents && cachedEvents.length > 0) {
        return cachedEvents;
      }
      // No cached data available offline
      return [];
    }

    // We're online, proceed with normal force refresh
    try {
      await CacheManager.clearDateCache(cacheKey);
      if (__DEV__) console.log('Cleared cache for:', cacheKey);

      // Clear any existing abort controllers for this key
      if (ApiIntegrations.abortControllers.has(cacheKey)) {
        ApiIntegrations.abortControllers.get(cacheKey).abort();
        ApiIntegrations.abortControllers.delete(cacheKey);
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
    const normalizedKey = EventProcessor.normalizeCacheKey(`${currentLang}-${month}-${day}`);
    const cacheKey = normalizedKey;

    // Abort any existing request for this cache key
    if (ApiIntegrations.abortControllers.has(cacheKey)) {
      ApiIntegrations.abortControllers.get(cacheKey).abort();
      ApiIntegrations.abortControllers.delete(cacheKey);
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
      const cachedEvents = await CacheManager.getCachedEvents(cacheKey);
      if (cachedEvents) {
        console.log('Returning cached events for', cacheKey);
        return cachedEvents;
      }

      // Fetch only localized content for the current language
      if (__DEV__) console.log('Fetching localized events for', cacheKey);
      const requestEpoch = ApiIntegrations.currentEpoch;

      // Create abort controller for this specific request
      const abortController = new AbortController();
      ApiIntegrations.abortControllers.set(cacheKey, abortController);

      const promise = this.fetchLocalizedNews(month, day, requestEpoch)
        .then(async (localizedEvents) => {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            if (__DEV__) console.log('Request was aborted, returning empty array');
            return [];
          }

          // Discard if stale epoch
          if (requestEpoch !== ApiIntegrations.currentEpoch) {
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
            await CacheManager.setCachedEvents(cacheKey, combinedEvents);
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
              await CacheManager.setCachedEvents(cacheKey, fallbackEvents);
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
          ApiIntegrations.abortControllers.delete(cacheKey);
        });

      this.inFlightRequests.set(cacheKey, promise);
      return promise;
    } catch (error) {
      console.error('Error fetching historical events:', error);

      // Try to return cached events even if expired
      const cachedEvents = await CacheManager.getCachedEvents(cacheKey, true);
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
   * Fetch localized news from multiple sources based on language
   */
  static async fetchLocalizedNews(month, day, currentEpoch) {
    try {
      const currentLang = i18n.language || 'en';

      // Try Wikipedia API first
      let events = await ApiIntegrations.fetchWikipediaEvents(month, day, currentEpoch);

      // Also try Deutsche Digitale Bibliothek for German language
      let ddbEvents = [];
      if (currentLang === 'de') {
        if (__DEV__) console.log('Trying Deutsche Digitale Bibliothek API for German language');
        ddbEvents = await ApiIntegrations.fetchDeutscheDigitaleBibliothekEvents(month, day);
        if (__DEV__) console.log(`DDB API returned ${ddbEvents.length} events`);
      }

      // If Wikipedia fails or returns no events, try fallback sources
      if (!events || events.length === 0) {
        if (__DEV__) console.log('Wikipedia API failed or returned no events, trying fallback sources');

        // For non-English languages, try English Wikipedia as fallback
        if (currentLang !== 'en') {
          if (__DEV__) console.log('Trying English Wikipedia as fallback');
          const fallbackEvents = await ApiIntegrations.fetchWikipediaEvents(month, day, currentEpoch, 'en');
          if (fallbackEvents && fallbackEvents.length > 0) {
            if (__DEV__) console.log(`English fallback returned ${fallbackEvents.length} events`);
            return fallbackEvents;
          }
        }

        // Try Deutsche Digitale Bibliothek as additional fallback
        if (__DEV__) console.log('Trying Deutsche Digitale Bibliothek as fallback');
        const ddbEvents = await ApiIntegrations.fetchDeutscheDigitaleBibliothekEvents(month, day);

        // Use DDB events as fallback
        if (ddbEvents && ddbEvents.length > 0) {
          if (__DEV__) console.log(`DDB fallback returned ${ddbEvents.length} events`);
          return ddbEvents;
        }

      }

      // Combine Wikipedia and DDB events if DDB returned any
      if (ddbEvents && ddbEvents.length > 0) {
        events = [...(events || []), ...ddbEvents];
        if (__DEV__) console.log(`Combined Wikipedia + DDB: ${events.length} total events`);
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

  /**
   * Fetch fallback events when localized sources fail
   */
  static async fetchFallbackEvents(month, day) {
    try {
      const currentLang = i18n.language || 'en';

      // For all languages, try Deutsche Digitale Bibliothek as fallback
      if (__DEV__) console.log('Fetching fallback events from Deutsche Digitale Bibliothek');

      const ddbEvents = await ApiIntegrations.fetchDeutscheDigitaleBibliothekEvents(month, day);

      // Use DDB events as fallback
      if (ddbEvents && ddbEvents.length > 0) {
        if (__DEV__) console.log(`DDB fallback returned ${ddbEvents.length} events`);
        return EventProcessor.combineAndDeduplicateEvents(ddbEvents, [], []);
      }



      // If still no events, try English Wikipedia as ultimate fallback
      if (currentLang !== 'en') {
        if (__DEV__) console.log('Trying English Wikipedia as ultimate fallback');
        try {
          const englishEvents = await ApiIntegrations.fetchWikipediaEvents(month, day, ApiIntegrations.currentEpoch, 'en');
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
   * Clear cache for specific language when switching
   */
  static async clearLanguageCache(oldLang = null) {
    await CacheManager.clearLanguageCache(oldLang);
    // Increment epoch to invalidate all pending requests
    ApiIntegrations.currentEpoch++;

    // Abort all pending requests
    for (const [cacheKey, controller] of ApiIntegrations.abortControllers) {
      controller.abort();
    }
    ApiIntegrations.abortControllers.clear();

    // Clear in-flight requests
    this.inFlightRequests.clear();
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