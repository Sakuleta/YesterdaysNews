import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateUtils from './DateUtils';

/**
 * Service class for fetching historical events from Wikipedia API
 */
class HistoricalEventsAPI {
  static BASE_URL = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';
  static CACHE_PREFIX = 'historical_events_';

  /**
   * Fetch historical events for current date
   * @returns {Promise<Array>} Array of historical events
   */
  static async getEventsForToday() {
    const { month, day } = DateUtils.getCurrentDateForAPI();
    console.log('Getting events for today:', month, day);
    return this.getEventsForDate(month, day);
  }

  /**
   * Force refresh - clear cache and fetch fresh data
   * @returns {Promise<Array>} Array of historical events
   */
  static async forceRefreshToday() {
    const { month, day } = DateUtils.getCurrentDateForAPI();
    const cacheKey = `${month}-${day}`;
    
    // Clear cache for today
    try {
      const fullCacheKey = `${this.CACHE_PREFIX}${cacheKey}`;
      await AsyncStorage.removeItem(fullCacheKey);
      console.log('Cleared cache for:', cacheKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
    
    return this.getEventsForDate(month, day);
  }

  /**
   * Fetch historical events for specific date
   * @param {string} month - Month (MM format)
   * @param {string} day - Day (DD format)
   * @returns {Promise<Array>} Array of historical events
   */
  static async getEventsForDate(month, day) {
    const cacheKey = `${month}-${day}`;
    
    try {
      // Check cache first
      const cachedEvents = await this.getCachedEvents(cacheKey);
      if (cachedEvents) {
        console.log('Returning cached events for', cacheKey);
        return cachedEvents;
      }

      // Fetch from API
      console.log('Fetching events from API for', cacheKey);
      const url = `${this.BASE_URL}/events/${parseInt(month)}/${parseInt(day)}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'YesterdaysNews/1.0 (https://example.com/contact)'
        }
      });

      if (!response.data || !response.data.events) {
        throw new Error('Invalid API response format');
      }

      // Transform and filter events
      const transformedEvents = this.transformEvents(response.data.events);
      
      // Cache the events
      await this.setCachedEvents(cacheKey, transformedEvents);
      
      return transformedEvents;
    } catch (error) {
      console.error('Error fetching historical events:', error);
      
      // Try to return cached events even if expired
      const cachedEvents = await this.getCachedEvents(cacheKey, true);
      if (cachedEvents) {
        console.log('Returning expired cached events due to API error');
        return cachedEvents;
      }
      
      throw new Error(this.getErrorMessage(error));
    }
  }

  /**
   * Transform raw API events into app format
   * @param {Array} events - Raw events from API
   * @returns {Array} Transformed events
   */
  static transformEvents(events) {
    return events
      .filter(event => event.year && event.text)
      .slice(0, 20) // Limit to 20 events for performance
      .map(event => ({
        id: `${event.year}-${event.text.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '')}`,
        year: event.year,
        title: this.extractTitle(event.text),
        description: event.text,
        category: this.categorizeEvent(event.text),
        links: event.pages ? event.pages.map(page => ({
          title: page.title,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
        })) : []
      }))
      .sort((a, b) => a.year - b.year);
  }

  /**
   * Extract title from event text
   * @param {string} text - Full event text
   * @returns {string} Extracted title
   */
  static extractTitle(text) {
    // Try to extract a meaningful title from the first part of the text
    const sentences = text.split('.');
    let title = sentences[0];
    
    // If title is too long, try to get the main subject
    if (title.length > 100) {
      const parts = title.split(' – ');
      title = parts[0];
    }
    
    return title.length > 120 ? title.substring(0, 117) + '...' : title;
  }

  /**
   * Categorize event based on text content
   * @param {string} text - Event text
   * @returns {string} Event category
   */
  static categorizeEvent(text) {
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
      
      // Check if cache is still valid
      if (!ignoreExpiry && !DateUtils.isCacheValid(parsedCache.timestamp)) {
        console.log('Cache expired for', dateKey);
        return null;
      }
      
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
      console.log('Cached events for', dateKey);
    } catch (error) {
      console.error('Error caching events:', error);
    }
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
        console.log(`Cleared ${keysToRemove.length} old cache entries`);
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
    } else {
      return 'Unable to load historical events. Please try again.';
    }
  }
}

export default HistoricalEventsAPI;