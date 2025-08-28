import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * Handles selected event, modal visibility, and lazy loading
 */
export const useModalManager = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [MagnifyingGlassModal, setMagnifyingGlassModal] = useState(null);

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

  return {
    selectedEvent,
    modalVisible,
    MagnifyingGlassModal,
    handleEventPress,
    handleCloseModal
  };
};

export default useModalManager;
