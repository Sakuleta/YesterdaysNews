import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View,
  SafeAreaView 
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Components
import NewspaperMasthead from '../components/NewspaperMasthead';
import DateHeader from '../components/DateHeader';
import EventCard from '../components/EventCard';
// Lazy-load heavy modal on demand to reduce initial bundle size
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Services
import HistoricalEventsAPI from '../services/HistoricalEventsAPI';

// Utils
import { COLORS, SPACING } from '../utils/constants';
import { formatErrorMessage } from '../utils/helpers';
import PerformanceMonitor from '../utils/PerformanceMonitor';

/**
 * HomeScreen Component - Vintage Edition
 * Main screen displaying a chronological list of historical events.
 */
const HomeScreen = () => {
  const { i18n } = useTranslation();
  
  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageChanging, setLanguageChanging] = useState(false);
  const [MagnifyingGlassModal, setMagnifyingGlassModal] = useState(null);

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

  /**
   * Handle event card press to open the modal
   */
  const handleEventPress = useCallback((event) => {
    setSelectedEvent(event);
    // Load modal component on first demand, then show
    if (!MagnifyingGlassModal) {
      import('../components/MagnifyingGlassModal').then((mod) => {
        setMagnifyingGlassModal(() => mod.default);
        setModalVisible(true);
      }).catch((e) => {
        console.error('Failed to load MagnifyingGlassModal', e);
      });
    } else {
      setModalVisible(true);
    }
  }, [MagnifyingGlassModal]);

  /**
   * Close the event detail modal
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    // Delay clearing the event to allow the modal to animate out smoothly
    setTimeout(() => setSelectedEvent(null), 300);
  }, []);

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

  const renderListHeader = useCallback(() => (
    <>
      <NewspaperMasthead onLanguageChange={(newLang) => {
        // Language changed, reload events
        console.log('Language changing to:', newLang);
        setLanguageChanging(true); // Show skeleton immediately
        setError(null);
        setEvents([]); // Clear old events to force refresh
        // Do not trigger load here; effect on i18n.language will handle fetching
      }} />
      <DateHeader eventsCount={events.length} refreshTrigger={refreshing ? Date.now() : 0} />
    </>
  ), [events.length, loadEvents, refreshing]);

  const renderListEmpty = useCallback(() => {
    // Show skeleton loading when language is changing
    if (languageChanging) {
      return <LoadingSkeleton count={8} />;
    }
    // Only show loading spinner for initial load, not for language changes
    if (loading && events.length === 0) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <ErrorMessage
          message={error.message}
          type={error.type}
          onRetry={() => {
            // Force refresh when retrying from error state
            setError(null);
            setEvents([]);
            loadEvents(true);
          }}
        />
      );
    }
    return null;
  }, [loading, error, loadEvents, events.length, languageChanging]);

  const keyExtractor = useCallback((item, index) => {
    // Create a more unique key to avoid duplicates
    const baseKey = item.id || item.title || `event-${index}`;
    const year = item.year || 'unknown';
    const lang = i18n.language || 'en';
    // Avoid using index in key to reduce churn and re-renders
    return `${lang}-${year}-${baseKey}`;
  }, [i18n.language]);

  const ITEM_HEIGHT = 180; // Updated card height for better accuracy
  const getItemLayout = useCallback((_, index) => ({ 
    length: ITEM_HEIGHT, 
    offset: ITEM_HEIGHT * index, 
    index 
  }), []);

  // Prevent unnecessary item re-renders by only updating when relevant fields change
  const shouldItemUpdate = useCallback((prev, next) => {
    const a = prev.item;
    const b = next.item;
    return (
      a.id !== b.id ||
      a.year !== b.year ||
      a.title !== b.title ||
      a.description !== b.description ||
      a.category !== b.category
    );
  }, []);

  // Footer component for proper spacing at the end
  const renderListFooter = useCallback(() => (
    <View style={styles.listFooter} />
  ), []);

  // FlatList ref for scroll control
  const flatListRef = useRef(null);

  const renderItem = useCallback(({ item }) => (
    <EventCard event={item} onPress={handleEventPress} />
  ), [handleEventPress]);

  // Scroll performance monitoring
  const handleScrollBeginDrag = useCallback(() => {
    PerformanceMonitor.recordScrollMetrics({
      type: 'scroll_begin',
      duration: 0
    });
  }, []);

  const handleScrollEndDrag = useCallback((event) => {
    PerformanceMonitor.recordScrollMetrics({
      type: 'scroll_end',
      duration: Date.now(),
      velocity: event.nativeEvent.velocity?.y || 0
    });
  }, []);

  // Handle scroll momentum end for performance monitoring only
  const handleMomentumScrollEnd = useCallback((event) => {
    PerformanceMonitor.recordScrollMetrics({
      type: 'momentum_end',
      duration: Date.now(),
      contentOffset: event.nativeEvent.contentOffset.y
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        key={`list-${i18n.language}-${languageChanging ? 'changing' : 'ready'}`}
        data={languageChanging ? [] : events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        shouldItemUpdate={shouldItemUpdate}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        windowSize={10}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        getItemLayout={getItemLayout}
        legacyImplementation={false}
        disableVirtualization={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollIndicatorInsets={{ right: 1 }}
        contentInsetAdjustmentBehavior="automatic"
      />
      
      {MagnifyingGlassModal ? (
        <MagnifyingGlassModal
          visible={modalVisible}
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 0, // Remove padding since we have footer
  },
  listFooter: {
    height: 50, // decreased space at the end for better fast scroll handling
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
