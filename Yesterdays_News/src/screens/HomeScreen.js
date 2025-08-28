import React, { useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';

// Components
import EventCard from '../components/EventCard';

// Custom Hooks
import useEventsData from '../hooks/useEventsData';
import useModalManager from '../hooks/useModalManager';
import useFlatListConfig from '../hooks/useFlatListConfig';

// Utils
import { COLORS } from '../utils/constants';

/**
 * HomeScreen Component - Vintage Edition
 * Main screen displaying a chronological list of historical events.
 * Now modularized using custom hooks for better maintainability.
 */
const HomeScreen = () => {
  // Use custom hooks to manage different concerns
  const eventsData = useEventsData();
  const modalManager = useModalManager();
  const flatListConfig = useFlatListConfig(
    eventsData.events,
    eventsData.loading,
    eventsData.error,
    eventsData.languageChanging,
    eventsData.refreshing,
    eventsData.loadEvents,
    eventsData.handleRefresh
  );

  const renderItem = useCallback(({ item }) => (
    <EventCard event={item} onPress={modalManager.handleEventPress} />
  ), [modalManager.handleEventPress]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        renderItem={renderItem}
        {...flatListConfig.flatListConfig}
      />

      {modalManager.MagnifyingGlassModal ? (
        <modalManager.MagnifyingGlassModal
          visible={modalManager.modalVisible}
          event={modalManager.selectedEvent}
          onClose={modalManager.handleCloseModal}
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
});

export default HomeScreen;
