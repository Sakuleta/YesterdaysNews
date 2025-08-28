import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import HistoricalEventsAPI from '../services/HistoricalEventsAPI';
import PerformanceMonitor from '../utils/PerformanceMonitor';
import { formatErrorMessage } from '../utils/helpers';

/**
 * Custom hook for managing events data
 * Handles loading, refreshing, language changes, and error states
 */
export const useEventsData = () => {
  const { i18n } = useTranslation();

  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [languageChanging, setLanguageChanging] = useState(false);

  const langDebounceRef = useRef(null);

  /**
   * Load historical events from API
   */
  const loadEvents = useCallback(async (isRefresh = false) => {
    try {
      // Only show loading for initial load, not for language changes
      if (!isRefresh) setLoading(true);
      setError(null);

      const eventsData = isRefresh
        ? await HistoricalEventsAPI.forceRefreshToday()
        : await HistoricalEventsAPI.getEventsForToday();

      setEvents(eventsData);

      // Record app fully loaded
      if (!isRefresh) {
        PerformanceMonitor.recordAppLoaded();
      }

      if (eventsData.length === 0) {
        setError({
          type: 'empty',
          message: 'No historical events were found for today. Please try refreshing!'
        });
      }
    } catch (err) {
      console.error('Error loading events:', err);
      const errorMessage = formatErrorMessage(err);
      setError({
        type: err.message.includes('Network') ? 'network' : 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLanguageChanging(false); // Clear language changing state
    }
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents(true);
  }, [loadEvents]);

  // Load events on initial component mount
  useEffect(() => {
    // Start performance monitoring
    PerformanceMonitor.startTiming();

    loadEvents();
  }, [loadEvents]);

  // Reload events when language changes
  useEffect(() => {
    if (i18n.language) {
      console.log('Language changed to:', i18n.language);
      // Show skeleton loading immediately
      setLanguageChanging(true);
      setError(null); // Clear any previous errors
      setEvents([]); // Clear old events to force refresh
      // Debounce the reload to avoid rapid re-triggers
      if (langDebounceRef.current) clearTimeout(langDebounceRef.current);
      langDebounceRef.current = setTimeout(() => {
        loadEvents(true);
      }, 250);
    }
    return () => {
      if (langDebounceRef.current) {
        clearTimeout(langDebounceRef.current);
        langDebounceRef.current = null;
      }
    };
  }, [i18n.language, loadEvents]);

  return {
    events,
    loading,
    refreshing,
    error,
    languageChanging,
    loadEvents,
    handleRefresh,
    setError,
    setEvents
  };
};

export default useEventsData;
