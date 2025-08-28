import { useEffect, useRef } from 'react';
import PerformanceMonitor from '../utils/PerformanceMonitor';

/**
 * Custom hook for performance monitoring
 * Handles render time tracking and performance metrics
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStartTime = useRef(Date.now());

  // Track render performance
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    PerformanceMonitor.recordRenderTime(componentName, renderTime);
  }, [componentName]);

  const recordMetric = (type, data) => {
    // Custom metric recording can be implemented here
    if (__DEV__) {
      console.log(`📊 Metric: ${type}`, data);
    }
  };

  const recordAppLoaded = () => {
    PerformanceMonitor.recordAppLoaded();
  };

  const startTiming = () => {
    PerformanceMonitor.startTiming();
  };

  return {
    recordMetric,
    recordAppLoaded,
    startTiming
  };
};

export default usePerformanceMonitor;
