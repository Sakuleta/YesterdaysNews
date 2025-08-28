/**
 * Data Validation Utilities
 * Common validation patterns used across the application
 */

/**
 * Validate if a value is not null or undefined
 * @param {any} value - Value to check
 * @returns {boolean} True if value exists
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined;
};

/**
 * Validate if a string is not empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if string is not empty
 */
export const isValidString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

/**
 * Validate if a year is reasonable for historical events
 * @param {number} year - Year to validate
 * @returns {boolean} True if year is valid
 */
export const isValidHistoricalYear = (year) => {
  const currentYear = new Date().getFullYear();
  return typeof year === 'number' && year >= -3000 && year <= currentYear && !isNaN(year);
};

/**
 * Validate if an array has items
 * @param {Array} array - Array to check
 * @returns {boolean} True if array exists and has items
 */
export const isValidArray = (array) => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * Validate event object structure
 * @param {Object} event - Event object to validate
 * @returns {boolean} True if event is valid
 */
export const isValidEvent = (event) => {
  if (!event || typeof event !== 'object') return false;

  return (
    isValidString(event.title) &&
    isValidHistoricalYear(event.year) &&
    typeof event.year === 'number' &&
    !isNaN(event.year)
  );
};

/**
 * Validate events array
 * @param {Array} events - Events array to validate
 * @returns {Object} Validation result with valid events and errors
 */
export const validateEventsArray = (events) => {
  const validEvents = [];
  const errors = [];

  if (!Array.isArray(events)) {
    return {
      isValid: false,
      validEvents: [],
      errors: ['Events must be an array']
    };
  }

  events.forEach((event, index) => {
    if (isValidEvent(event)) {
      validEvents.push(event);
    } else {
      errors.push(`Event at index ${index} is invalid: ${JSON.stringify(event)}`);
    }
  });

  return {
    isValid: errors.length === 0,
    validEvents,
    errors
  };
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (!isValidString(input)) return '';

  // Remove potentially harmful characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract and validate domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string|null} Valid domain or null
 */
export const extractValidDomain = (url) => {
  try {
    if (!isValidUrl(url)) return null;
    const domain = new URL(url).hostname;
    return isValidString(domain) ? domain : null;
  } catch {
    return null;
  }
};

/**
 * Validate language code
 * @param {string} language - Language code to validate
 * @param {Array} allowedLanguages - Array of allowed language codes
 * @returns {boolean} True if language is valid
 */
export const isValidLanguage = (language, allowedLanguages = ['tr', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru']) => {
  return isValidString(language) && allowedLanguages.includes(language);
};

/**
 * Validate date format (MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date format is valid
 */
export const isValidDateFormat = (dateString) => {
  const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return dateRegex.test(dateString);
};

/**
 * Create validation result object
 * @param {boolean} isValid - Validation result
 * @param {string} message - Validation message
 * @param {any} data - Additional data
 * @returns {Object} Validation result
 */
export const createValidationResult = (isValid, message = '', data = null) => ({
  isValid,
  message,
  data
});

export default {
  isNotEmpty,
  isValidString,
  isValidHistoricalYear,
  isValidArray,
  isValidEvent,
  validateEventsArray,
  sanitizeString,
  isValidUrl,
  extractValidDomain,
  isValidLanguage,
  isValidDateFormat,
  createValidationResult,
};
