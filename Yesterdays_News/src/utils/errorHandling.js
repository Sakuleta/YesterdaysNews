import { Alert } from 'react-native';

/**
 * Error Handling Utilities
 * Common error handling patterns used across the application
 */

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
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
};

/**
 * Show error alert to user
 * @param {Error|string} error - Error object or message
 * @param {string} title - Alert title (optional)
 */
export const showErrorAlert = (error, title = 'Error') => {
  const message = typeof error === 'string' ? error : getErrorMessage(error);
  Alert.alert(title, message);
};

/**
 * Handle async operations with error handling
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Options for error handling
 * @returns {Promise<any>} Result of the async function
 */
export const withErrorHandling = async (asyncFn, options = {}) => {
  const {
    showAlert = true,
    alertTitle = 'Error',
    onError = null,
    defaultValue = null
  } = options;

  try {
    return await asyncFn();
  } catch (error) {
    console.error('Error in withErrorHandling:', error);

    if (showAlert) {
      showErrorAlert(error, alertTitle);
    }

    if (onError) {
      onError(error);
    }

    return defaultValue;
  }
};

/**
 * Validate API response format
 * @param {any} response - API response to validate
 * @param {string} expectedType - Expected type ('array', 'object')
 * @returns {boolean} True if response is valid
 */
export const isValidApiResponse = (response, expectedType = 'array') => {
  if (!response) return false;

  switch (expectedType) {
    case 'array':
      return Array.isArray(response);
    case 'object':
      return typeof response === 'object' && response !== null && !Array.isArray(response);
    default:
      return true;
  }
};

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @param {Error} originalError - Original error object
 * @returns {Object} Standardized error object
 */
export const createError = (message, type = 'error', originalError = null) => ({
  message,
  type,
  originalError,
  timestamp: Date.now()
});

/**
 * Log error with context information
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 * @param {Object} additionalInfo - Additional information to log
 */
export const logError = (error, context = '', additionalInfo = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    ...additionalInfo
  };

  console.error(`[${context}] Error:`, errorInfo);

  // In production, you might want to send this to an error tracking service
  // Example: errorTrackingService.captureError(error, errorInfo);
};

export default {
  getErrorMessage,
  showErrorAlert,
  withErrorHandling,
  isValidApiResponse,
  createError,
  logError,
};
