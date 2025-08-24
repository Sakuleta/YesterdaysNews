import moment from 'moment';

/**
 * Utility class for date-related operations
 */
class DateUtils {
  /**
   * Get current date formatted for display
   * @returns {string} Formatted date string (e.g., "August 23, 2025")
   */
  static getCurrentDateFormatted() {
    return moment().format('MMMM DD, YYYY');
  }

  /**
   * Get current date as month/day for API calls
   * @returns {object} Object with month and day
   */
  static getCurrentDateForAPI() {
    const now = moment();
    return {
      month: now.format('MM'),
      day: now.format('DD')
    };
  }

  /**
   * Get cache key for current date
   * @returns {string} Cache key (e.g., "08-23")
   */
  static getCurrentDateCacheKey() {
    return moment().format('MM-DD');
  }

  /**
   * Get date cache key for any date
   * @param {Date|moment} date - Date to generate cache key for
   * @returns {string} Cache key
   */
  static getDateCacheKey(date) {
    return moment(date).format('MM-DD');
  }

  /**
   * Check if cached data is still valid (within 24 hours)
   * @param {number} timestamp - Timestamp when data was cached
   * @returns {boolean} True if cache is still valid
   */
  static isCacheValid(timestamp) {
    const now = moment();
    const cached = moment(timestamp);
    const hoursDiff = now.diff(cached, 'hours');
    return hoursDiff < 24;
  }

  /**
   * Get formatted year from number
   * @param {number} year - Year number
   * @returns {string} Formatted year (e.g., "79 AD", "1969")
   */
  static formatYear(year) {
    if (year < 0) {
      return `${Math.abs(year)} BC`;
    } else if (year < 1000) {
      return `${year} AD`;
    }
    return year.toString();
  }

  /**
   * Get day of week for current date
   * @returns {string} Day of week (e.g., "Friday")
   */
  static getCurrentDayOfWeek() {
    return moment().format('dddd');
  }
}

export default DateUtils;