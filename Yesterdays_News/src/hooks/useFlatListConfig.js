import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import NewspaperMasthead from '../components/NewspaperMasthead';
import DateHeader from '../components/DateHeader';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSkeleton from '../components/LoadingSkeleton';

/**
 * Custom hook for FlatList configuration and rendering logic
 */
export const useFlatListConfig = (events, loading, error, languageChanging, refreshing, loadEvents, handleRefresh, isLoading) => {
  const { i18n } = useTranslation();

  /**
   * Key extractor for FlatList items
   */
  const keyExtractor = useCallback((item, index) => {
    // Create a more unique key to avoid duplicates
    const baseKey = item.id || item.title || `event-${index}`;
    const year = item.year || 'unknown';
    const lang = i18n.language || 'en';
    // Avoid using index in key to reduce churn and re-renders
    return `${lang}-${year}-${baseKey}`;
  }, [i18n.language]);

  /**
   * Prevent unnecessary item re-renders by only updating when relevant fields change
   */
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

  /**
   * Render list header component
   */
  const renderListHeader = useCallback(() => (
    <>
      <NewspaperMasthead
        onLanguageChange={(newLang) => {
          // Language changed, reload events
          console.log('Language changing to:', newLang);
          // This will trigger the language change effect in useEventsData
        }}
        isLoading={isLoading}
      />
      <DateHeader eventsCount={events.length} refreshTrigger={refreshing ? Date.now() : 0} />
    </>
  ), [events.length, refreshing, isLoading]);

  /**
   * Render list empty component
   */
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
            loadEvents(true);
          }}
        />
      );
    }
    return null;
  }, [loading, error, loadEvents, events.length, languageChanging]);

  /**
   * Render list footer component for proper spacing
   */
  const renderListFooter = useCallback(() => (
    <View style={styles.listFooter} />
  ), []);

  /**
   * Memoized FlatList configuration
   */
  const flatListConfig = useMemo(() => ({
    data: languageChanging ? [] : events,
    keyExtractor,
    shouldItemUpdate,
    ListHeaderComponent: renderListHeader,
    ListEmptyComponent: renderListEmpty,
    ListFooterComponent: renderListFooter,
    refreshing,
    onRefresh: handleRefresh,
    contentContainerStyle: styles.listContent
  }), [
    languageChanging,
    events,
    keyExtractor,
    shouldItemUpdate,
    renderListHeader,
    renderListEmpty,
    renderListFooter,
    refreshing,
    handleRefresh
  ]);

  return {
    flatListConfig
  };
};

/**
 * Styles for FlatList components
 */
const styles = {
  listContent: {
    paddingBottom: 0, // Remove padding since we have footer
  },
  listFooter: {
    height: 50, // Space at the end for proper list termination
  },
};

export default useFlatListConfig;
