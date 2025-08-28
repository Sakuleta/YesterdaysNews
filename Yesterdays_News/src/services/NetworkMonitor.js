import NetInfo from '@react-native-community/netinfo';
import { logError } from '../utils/errorHandling';

/**
 * NetworkMonitor - Monitors network connectivity and provides network utilities
 * Follows Single Responsibility Principle - only handles network monitoring
 */
class NetworkMonitor {
  static listeners = new Set();
  static isOnline = true;
  static networkState = null;

  /**
   * Initialize network monitoring
   */
  static initialize() {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.handleNetworkChange(state);
    });

    // Store unsubscribe function for cleanup
    this.unsubscribe = unsubscribe;

    // Get initial network state
    this.checkInitialState();

    if (__DEV__) {
      console.log('[NetworkMonitor] Initialized');
    }
  }

  /**
   * Handle network state changes
   * @param {Object} state - Network state object
   */
  static handleNetworkChange(state) {
    const wasOnline = this.isOnline;
    this.networkState = state;
    this.isOnline = state.isConnected && state.isInternetReachable;

    // Log network changes in development
    if (__DEV__) {
      console.log('[NetworkMonitor] Network state changed:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOnline: this.isOnline
      });
    }

    // Notify listeners if online status changed
    if (wasOnline !== this.isOnline) {
      this.notifyListeners({
        isOnline: this.isOnline,
        wasOnline,
        state
      });
    }
  }

  /**
   * Check initial network state
   */
  static async checkInitialState() {
    try {
      const state = await NetInfo.fetch();
      this.handleNetworkChange(state);
    } catch (error) {
      logError(error, 'NetworkMonitor.checkInitialState', 'Failed to get initial network state');
    }
  }

  /**
   * Add network state change listener
   * @param {Function} listener - Listener function
   * @returns {Function} Unsubscribe function
   */
  static addListener(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Remove network state change listener
   * @param {Function} listener - Listener function to remove
   */
  static removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of network changes
   * @param {Object} data - Network change data
   */
  static notifyListeners(data) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        logError(error, 'NetworkMonitor.notifyListeners', 'Listener threw an error');
      }
    });
  }

  /**
   * Get current network status
   * @returns {boolean} True if online
   */
  static getIsOnline() {
    return this.isOnline;
  }

  /**
   * Get detailed network state
   * @returns {Object} Current network state
   */
  static getNetworkState() {
    return this.networkState;
  }

  /**
   * Check if device is connected to WiFi
   * @returns {boolean} True if connected to WiFi
   */
  static isWifi() {
    return this.networkState?.type === 'wifi';
  }

  /**
   * Check if device is connected to cellular network
   * @returns {boolean} True if connected to cellular
   */
  static isCellular() {
    return this.networkState?.type === 'cellular';
  }

  /**
   * Get network type
   * @returns {string} Network type
   */
  static getNetworkType() {
    return this.networkState?.type || 'unknown';
  }

  /**
   * Perform connectivity test
   * @param {string} url - URL to test connectivity (default: google.com)
   * @returns {Promise<boolean>} True if connectivity test passes
   */
  static async testConnectivity(url = 'https://www.google.com') {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      logError(error, 'NetworkMonitor.testConnectivity', `Connectivity test failed for ${url}`);
      return false;
    }
  }

  /**
   * Wait for network to become available
   * @param {number} timeout - Timeout in milliseconds (default: 30000)
   * @returns {Promise<boolean>} True if network became available within timeout
   */
  static async waitForConnection(timeout = 30000) {
    if (this.isOnline) {
      return true;
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      let resolved = false;

      const checkConnection = () => {
        if (this.isOnline) {
          resolved = true;
          resolve(true);
          return;
        }

        if (Date.now() - startTime >= timeout) {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
          return;
        }

        // Check again in 1 second
        setTimeout(checkConnection, 1000);
      };

      checkConnection();
    });
  }

  /**
   * Get network quality estimate
   * @returns {string} Network quality ('excellent', 'good', 'poor', 'offline')
   */
  static getNetworkQuality() {
    if (!this.isOnline) {
      return 'offline';
    }

    const state = this.networkState;

    if (!state) {
      return 'unknown';
    }

    // Estimate quality based on connection type and strength
    if (state.type === 'wifi') {
      return 'excellent';
    } else if (state.type === 'cellular') {
      // Could be enhanced with cellular strength info
      return 'good';
    } else {
      return 'poor';
    }
  }

  /**
   * Get network statistics
   * @returns {Object} Network statistics
   */
  static getStats() {
    return {
      isOnline: this.isOnline,
      networkType: this.getNetworkType(),
      quality: this.getNetworkQuality(),
      listenersCount: this.listeners.size,
      detailedState: this.networkState
    };
  }

  /**
   * Cleanup network monitoring
   */
  static cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    this.listeners.clear();

    if (__DEV__) {
      console.log('[NetworkMonitor] Cleaned up');
    }
  }
}

export default NetworkMonitor;
