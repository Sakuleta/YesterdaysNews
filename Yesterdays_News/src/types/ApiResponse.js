/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {any} data - Response data
 * @property {string|null} error - Error message if request failed
 * @property {Object} meta - Additional metadata
 * @property {number} meta.statusCode - HTTP status code
 * @property {string} meta.requestId - Unique request identifier
 * @property {number} meta.duration - Request duration in milliseconds
 * @property {string} meta.source - API source name
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Human-readable error message
 * @property {string} code - Error code
 * @property {number} statusCode - HTTP status code
 * @property {Object} details - Additional error details
 * @property {string} timestamp - Error timestamp
 */

/**
 * @typedef {Object} ApiRequestConfig
 * @property {string} url - Request URL
 * @property {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @property {Object} [headers] - Request headers
 * @property {any} [data] - Request body data
 * @property {Object} [params] - URL parameters
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {boolean} [withCredentials] - Whether to include credentials
 */

/**
 * @typedef {Object} ApiSource
 * @property {string} name - Source name
 * @property {string} baseUrl - Base URL for the source
 * @property {Object} config - Source-specific configuration
 * @property {boolean} enabled - Whether the source is enabled
 * @property {number} priority - Source priority (higher = more preferred)
 * @property {Object} rateLimit - Rate limiting configuration
 * @property {number} rateLimit.requests - Number of requests allowed
 * @property {number} rateLimit.period - Time period in milliseconds
 */

/**
 * @typedef {Object} CacheEntry
 * @property {any} data - Cached data
 * @property {number} timestamp - Cache timestamp
 * @property {number} ttl - Time to live in milliseconds
 * @property {string} key - Cache key
 * @property {Object} metadata - Additional cache metadata
 */

/**
 * @typedef {Object} NetworkState
 * @property {boolean} isConnected - Whether device is connected to internet
 * @property {boolean} isInternetReachable - Whether internet is reachable
 * @property {string} type - Network type (wifi, cellular, bluetooth, ethernet, wimax, vpn, other, none)
 * @property {Object} details - Network type specific details
 */

/**
 * API response status codes
 * @type {Object<string, number>}
 */
export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Common API error codes
 * @type {Object<string, string>}
 */
export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  PARSING_ERROR: 'PARSING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Creates a standardized API response object
 * @param {boolean} success - Whether the request was successful
 * @param {any} data - Response data
 * @param {string|null} error - Error message if request failed
 * @param {Object} meta - Additional metadata
 * @returns {ApiResponse} Standardized API response
 */
export const createApiResponse = (success = true, data = null, error = null, meta = {}) => {
  return {
    success,
    data,
    error,
    meta: {
      statusCode: success ? API_STATUS_CODES.OK : API_STATUS_CODES.INTERNAL_SERVER_ERROR,
      requestId: generateRequestId(),
      duration: 0,
      source: 'unknown',
      ...meta,
    },
  };
};

/**
 * Creates a standardized API error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {ApiError} Standardized API error
 */
export const createApiError = (message, code = API_ERROR_CODES.UNKNOWN_ERROR, statusCode = 500, details = {}) => {
  return {
    message,
    code,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validates if an object is a valid API response
 * @param {any} obj - Object to validate
 * @returns {obj is ApiResponse} True if object is a valid API response
 */
export const isValidApiResponse = (obj) => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.success === 'boolean' &&
    'meta' in obj &&
    typeof obj.meta === 'object'
  );
};

/**
 * Validates if an object is a valid API error
 * @param {any} obj - Object to validate
 * @returns {obj is ApiError} True if object is a valid API error
 */
export const isValidApiError = (obj) => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.message === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.statusCode === 'number'
  );
};

/**
 * Generates a unique request ID
 * @returns {string} Unique request identifier
 */
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates request duration
 * @param {number} startTime - Request start time
 * @returns {number} Duration in milliseconds
 */
export const calculateDuration = (startTime) => {
  return Date.now() - startTime;
};

/**
 * Determines if an error is retryable
 * @param {ApiError} error - Error to check
 * @returns {boolean} True if error is retryable
 */
export const isRetryableError = (error) => {
  if (!isValidApiError(error)) return false;

  const retryableCodes = [
    API_ERROR_CODES.NETWORK_ERROR,
    API_ERROR_CODES.TIMEOUT,
    API_ERROR_CODES.SERVER_ERROR,
    API_ERROR_CODES.SERVICE_UNAVAILABLE,
  ];

  const retryableStatusCodes = [
    API_STATUS_CODES.REQUEST_TIMEOUT,
    API_STATUS_CODES.TOO_MANY_REQUESTS,
    API_STATUS_CODES.INTERNAL_SERVER_ERROR,
    API_STATUS_CODES.BAD_GATEWAY,
    API_STATUS_CODES.SERVICE_UNAVAILABLE,
    API_STATUS_CODES.GATEWAY_TIMEOUT,
  ];

  return (
    retryableCodes.includes(error.code) ||
    retryableStatusCodes.includes(error.statusCode)
  );
};

/**
 * Gets user-friendly error message from API error
 * @param {ApiError} error - API error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!isValidApiError(error)) {
    return 'An unknown error occurred';
  }

  switch (error.code) {
    case API_ERROR_CODES.NETWORK_ERROR:
      return 'No internet connection. Please check your network and try again.';
    case API_ERROR_CODES.TIMEOUT:
      return 'Request timed out. Please try again.';
    case API_ERROR_CODES.NOT_FOUND:
      return 'The requested resource was not found.';
    case API_ERROR_CODES.AUTHENTICATION_ERROR:
      return 'Authentication failed. Please check your credentials.';
    case API_ERROR_CODES.AUTHORIZATION_ERROR:
      return 'You do not have permission to access this resource.';
    case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 'Too many requests. Please wait a moment and try again.';
    case API_ERROR_CODES.SERVER_ERROR:
    case API_ERROR_CODES.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return error.message || 'An error occurred while processing your request.';
  }
};

/**
 * Available API sources configuration
 * @type {Object<string, ApiSource>}
 */
export const API_SOURCES = {
  wikipedia: {
    name: 'Wikipedia',
    baseUrl: 'https://en.wikipedia.org/api/rest_v1/feed/onthisday',
    config: {
      language: 'en',
      format: 'json',
    },
    enabled: true,
    priority: 10,
    rateLimit: {
      requests: 100,
      period: 60000, // 1 minute
    },
  },

  deutscheDigitaleBibliothek: {
    name: 'Deutsche Digitale Bibliothek',
    baseUrl: 'https://api.deutsche-digitale-bibliothek.de/search',
    config: {
      language: 'de',
      format: 'json',
    },
    enabled: true,
    priority: 7,
    rateLimit: {
      requests: 50,
      period: 60000, // 1 minute
    },
  },
};

export default {
  API_STATUS_CODES,
  API_ERROR_CODES,
  API_SOURCES,
  createApiResponse,
  createApiError,
  isValidApiResponse,
  isValidApiError,
  generateRequestId,
  calculateDuration,
  isRetryableError,
  getErrorMessage,
};
