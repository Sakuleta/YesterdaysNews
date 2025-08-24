import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  Alert,
  StatusBar,
  SafeAreaView 
} from 'react-native';

// New newspaper components
import NewspaperMasthead from '../components/NewspaperMasthead';
import NewspaperPage, { NewspaperSection } from '../components/NewspaperPage';
import NewspaperArticleCard from '../components/NewspaperArticleCard';
import MagnifyingGlassModal from '../components/MagnifyingGlassModal';

// Legacy components (for loading states)
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Services
import HistoricalEventsAPI from '../services/HistoricalEventsAPI';

// Utils
import { COLORS, ANIMATIONS } from '../utils/constants';
import { formatErrorMessage } from '../utils/helpers';

/**
 * HomeScreen Component
 * Main screen displaying historical events for current date
 */
const HomeScreen = () => {
  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Categorized events for newspaper sections
  const [categorizedEvents, setCategorizedEvents] = useState({
    headline: null,
    politics: [],
    war: [],
    science: [],
    general: []
  });

  /**
   * Categorize events for newspaper sections
   */
  const categorizeEvents = useCallback((eventsData) => {
    const categorized = {
      headline: null,
      politics: [],
      war: [],
      science: [],
      general: []
    };
    
    eventsData.forEach(event => {
      // First event becomes headline if significant
      if (!categorized.headline && (event.category === 'politics' || event.category === 'war' || eventsData.indexOf(event) === 0)) {
        categorized.headline = event;
      } else {
        // Categorize by type
        switch (event.category) {
          case 'politics':
            categorized.politics.push(event);
            break;
          case 'war':
            categorized.war.push(event);
            break;
          case 'discovery':
            categorized.science.push(event);
            break;
          default:
            categorized.general.push(event);
        }
      }
    });
    
    setCategorizedEvents(categorized);
  }, []);

  /**
   * Load historical events from API
   */
  const loadEvents = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      // Clear old cache periodically and force refresh for today
      if (!isRefresh) {
        HistoricalEventsAPI.clearOldCache();
      }

      const eventsData = await HistoricalEventsAPI.forceRefreshToday();
      setEvents(eventsData);
      categorizeEvents(eventsData);
      
      if (eventsData.length === 0) {
        setError({
          type: 'empty',
          message: 'No historical events were found for today. This is unusual - please try refreshing!'
        });
      }
    } catch (err) {
      console.error('Error loading events:', err);
      const errorMessage = formatErrorMessage(err);
      
      setError({
        type: err.message.includes('internet') || err.message.includes('Network') ? 'network' : 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoad(false);
    }
  }, [categorizeEvents]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadEvents(true);
  }, [loadEvents]);

  /**
   * Handle retry button press
   */
  const handleRetry = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  /**
   * Handle event card press with magnifying glass effect
   */
  const handleEventPress = useCallback((event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  }, []);

  /**
   * Close magnifying glass modal
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300); // Wait for animation
  }, []);

  /**
   * Render newspaper sections with events
   */
  const renderNewspaperContent = useCallback(() => {
    if (loading && initialLoad) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return (
        <ErrorMessage
          message={error.message}
          type={error.type}
          onRetry={handleRetry}
        />
      );
    }

    return (
      <>
        {/* Headline Story */}
        {categorizedEvents.headline && (
          <NewspaperSection title="Today's Headline" icon="📰">
            <NewspaperArticleCard 
              event={categorizedEvents.headline} 
              isHeadline={true}
              onPress={handleEventPress}
            />
          </NewspaperSection>
        )}

        {/* Politics Section */}
        {categorizedEvents.politics.length > 0 && (
          <NewspaperSection title="Politics & Governance" icon="👑">
            {categorizedEvents.politics.map((event, index) => (
              <NewspaperArticleCard 
                key={`politics-${index}`}
                event={event} 
                onPress={handleEventPress}
              />
            ))}
          </NewspaperSection>
        )}

        {/* War & Conflicts Section */}
        {categorizedEvents.war.length > 0 && (
          <NewspaperSection title="Wars & Conflicts" icon="⚔️">
            {categorizedEvents.war.map((event, index) => (
              <NewspaperArticleCard 
                key={`war-${index}`}
                event={event} 
                onPress={handleEventPress}
              />
            ))}
          </NewspaperSection>
        )}

        {/* Science & Discovery Section */}
        {categorizedEvents.science.length > 0 && (
          <NewspaperSection title="Science & Discovery" icon="🔬">
            {categorizedEvents.science.map((event, index) => (
              <NewspaperArticleCard 
                key={`science-${index}`}
                event={event} 
                onPress={handleEventPress}
              />
            ))}
          </NewspaperSection>
        )}

        {/* General Events Section */}
        {categorizedEvents.general.length > 0 && (
          <NewspaperSection title="Other Notable Events" icon="📅">
            {categorizedEvents.general.map((event, index) => (
              <NewspaperArticleCard 
                key={`general-${index}`}
                event={event} 
                onPress={handleEventPress}
              />
            ))}
          </NewspaperSection>
        )}
      </>
    );
  }, [loading, initialLoad, error, categorizedEvents, handleEventPress, handleRetry]);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Auto-refresh at midnight (when date changes)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      console.log('Date changed, refreshing events...');
      loadEvents(true);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [loadEvents]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paperBackground} />
      
      <NewspaperPage>
        {/* Newspaper Masthead */}
        <NewspaperMasthead eventsCount={events.length} />
        
        {/* Newspaper Content */}
        {renderNewspaperContent()}
      </NewspaperPage>
      
      {/* Magnifying Glass Modal */}
      <MagnifyingGlassModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.paperBackground,
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default HomeScreen;