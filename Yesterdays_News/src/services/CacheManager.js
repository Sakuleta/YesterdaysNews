import AsyncStorage from '@react-native-async-storage/async-storage';
import DateUtils from './DateUtils';

/**
 * CacheManager - Handles all caching operations for historical events
 * Follows Single Responsibility Principle - only handles caching logic
 */
class CacheManager {
  static CACHE_PREFIX = 'historical_events_';

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
   * Clear cache for specific language when switching
   * @param {string} oldLang - Previous language
   */
  static async clearLanguageCache(oldLang = null) {
    try {
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
    } catch (error) {
      console.error('Error clearing language cache:', error);
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
        if (__DEV__) console.log(`Cleared ${keysToRemove.length} old cache entries`);
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }

  /**
   * Clear cache for specific date
   * @param {string} dateKey - Date key to clear
   */
  static async clearDateCache(dateKey) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${dateKey}`;
      await AsyncStorage.removeItem(cacheKey);
      if (__DEV__) console.log('Cleared cache for:', dateKey);
    } catch (error) {
      console.error('Error clearing date cache:', error);
    }
  }

  /**
   * Get all cache keys for debugging
   * @returns {Promise<Array>} Array of cache keys
   */
  static async getAllCacheKeys() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
    } catch (error) {
      console.error('Error getting cache keys:', error);
      return [];
    }
  }

  /**
   * Get cache stats for monitoring
   * @returns {Promise<Object>} Cache statistics
   */
  static async getCacheStats() {
    try {
      const cacheKeys = await this.getAllCacheKeys();
      let totalEntries = 0;
      let totalSize = 0;
      let oldestEntry = null;
      let newestEntry = null;

      for (const key of cacheKeys) {
        try {
          const cached = await AsyncStorage.getItem(key);
          if (cached) {
            const parsedCache = JSON.parse(cached);
            totalEntries++;
            totalSize += cached.length;

            if (!oldestEntry || parsedCache.timestamp < oldestEntry) {
              oldestEntry = parsedCache.timestamp;
            }
            if (!newestEntry || parsedCache.timestamp > newestEntry) {
              newestEntry = parsedCache.timestamp;
            }
          }
        } catch (error) {
          // Skip invalid entries
        }
      }

      return {
        totalEntries,
        totalSize,
        oldestEntry: oldestEntry ? new Date(oldestEntry).toISOString() : null,
        newestEntry: newestEntry ? new Date(newestEntry).toISOString() : null
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }
}

export default CacheManager;
