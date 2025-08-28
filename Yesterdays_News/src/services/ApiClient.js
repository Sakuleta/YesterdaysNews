import axios from 'axios';
import { API } from '../utils/constants';
import { withErrorHandling, logError } from '../utils/errorHandling';

/**
 * ApiClient - Base HTTP client for all API requests
 * Handles common HTTP operations with error handling and retries
 */
class ApiClient {
  constructor(baseURL = '') {
    this.client = axios.create({
      baseURL,
      timeout: API?.timeout || 8000,
      headers: {
        'User-Agent': 'YesterdaysNews/1.0 (https://example.com/contact)',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for request/response
   */
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp for request tracking
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => {
        logError(error, 'ApiClient.request');
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful requests in development
        if (__DEV__) {
          const duration = Date.now() - response.config.metadata.startTime;
          console.log(`[ApiClient] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
        }
        return response;
      },
      (error) => {
        logError(error, 'ApiClient.response');
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make GET request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  async get(url, config = {}) {
    return withErrorHandling(
      () => this.client.get(url, config),
      {
        showAlert: false,
        onError: (error) => {
          console.error(`GET ${url} failed:`, error.message);
        }
      }
    );
  }

  /**
   * Make POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  async post(url, data = {}, config = {}) {
    return withErrorHandling(
      () => this.client.post(url, data, config),
      {
        showAlert: false,
        onError: (error) => {
          console.error(`POST ${url} failed:`, error.message);
        }
      }
    );
  }

  /**
   * Make PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  async put(url, data = {}, config = {}) {
    return withErrorHandling(
      () => this.client.put(url, data, config),
      {
        showAlert: false,
        onError: (error) => {
          console.error(`PUT ${url} failed:`, error.message);
        }
      }
    );
  }

  /**
   * Make DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  async delete(url, config = {}) {
    return withErrorHandling(
      () => this.client.delete(url, config),
      {
        showAlert: false,
        onError: (error) => {
          console.error(`DELETE ${url} failed:`, error.message);
        }
      }
    );
  }

  /**
   * Set authorization header
   * @param {string} token - Authorization token
   */
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Set base URL
   * @param {string} baseURL - Base URL for requests
   */
  setBaseURL(baseURL) {
    this.client.defaults.baseURL = baseURL;
  }

  /**
   * Set default headers
   * @param {Object} headers - Headers to set
   */
  setDefaultHeaders(headers) {
    Object.assign(this.client.defaults.headers.common, headers);
  }

  /**
   * Get current client instance
   * @returns {AxiosInstance} Axios client instance
   */
  getClient() {
    return this.client;
  }

  /**
   * Check if client is online (simple connectivity test)
   * @returns {Promise<boolean>} True if online
   */
  async isOnline() {
    try {
      await this.client.head('https://www.google.com', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

// Create default instance
const defaultClient = new ApiClient();

export default ApiClient;
export { defaultClient };
