import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Performance Monitor - Tracks app startup time and memory usage
 */
class PerformanceMonitor {
  static startTime = null;
  static metrics = {
    coldStart: null,
    warmStart: null,
    hotStart: null,
    memoryUsage: [],
    renderTimes: []
  };

  /**
   * Start timing app launch
   */
  static startTiming() {
    this.startTime = Date.now();
    if (__DEV__) {
      console.log('🚀 App launch started at:', new Date().toISOString());
    }
  }

  /**
   * Record app fully loaded
   */
  static recordAppLoaded() {
    if (!this.startTime) return;
    
    const loadTime = Date.now() - this.startTime;
    this.metrics.coldStart = loadTime;
    
    if (__DEV__) {
      console.log(`✅ App fully loaded in ${loadTime}ms`);
    }
    
    // Store metrics for analysis
    this.storeMetrics('coldStart', loadTime);
  }

  /**
   * Record component render time
   */
  static recordRenderTime(componentName, renderTime) {
    this.metrics.renderTimes.push({
      component: componentName,
      time: renderTime,
      timestamp: Date.now()
    });

    // Removed console log for cleaner output
    // if (__DEV__) {
    //   console.log(`🎨 ${componentName} rendered in ${renderTime}ms`);
    // }
  }



  /**
   * Get current memory usage (Android only)
   */
  static async getMemoryUsage() {
    if (Platform.OS !== 'android') {
      return { error: 'Memory monitoring only available on Android' };
    }

    try {
      // This would require native module for accurate memory reading
      // For now, we'll use a simplified approach
      const memoryInfo = {
        timestamp: Date.now(),
        estimated: 'Memory monitoring requires native implementation'
      };
      
      this.metrics.memoryUsage.push(memoryInfo);
      return memoryInfo;
    } catch (error) {
      console.error('Error getting memory usage:', error);
      return { error: error.message };
    }
  }

  /**
   * Store performance metrics
   */
  static async storeMetrics(type, value) {
    try {
      const key = `perf_${type}`;
      const existing = await AsyncStorage.getItem(key);
      const data = existing ? JSON.parse(existing) : [];
      
      data.push({
        timestamp: Date.now(),
        value: value,
        platform: Platform.OS,
        version: '1.0.0'
      });
      
      // Keep only last 50 measurements
      if (data.length > 50) {
        data.splice(0, data.length - 50);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error storing performance metrics:', error);
    }
  }

  /**
   * Get stored performance metrics
   */
  static async getStoredMetrics(type) {
    try {
      const key = `perf_${type}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stored metrics:', error);
      return [];
    }
  }

  /**
   * Get performance summary
   */
  static getPerformanceSummary() {
    const summary = {
      coldStart: this.metrics.coldStart,
      renderTimes: this.metrics.renderTimes,
      memoryUsage: this.metrics.memoryUsage,
      timestamp: Date.now()
    };
    
    if (__DEV__) {
      console.log('📊 Performance Summary:', summary);
    }
    
    return summary;
  }

  /**
   * Clear all metrics
   */
  static clearMetrics() {
    this.metrics = {
      coldStart: null,
      warmStart: null,
      hotStart: null,
      memoryUsage: [],
      renderTimes: []
    };
    this.startTime = null;
  }
}

export default PerformanceMonitor;
