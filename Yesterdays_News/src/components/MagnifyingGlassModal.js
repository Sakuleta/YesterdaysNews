import React from 'react';
import {
  View,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, LAYOUT } from '../utils/constants';

// Custom Hooks
import useModalAnimations from '../hooks/useModalAnimations';

// Components
import ModalHeader from './ModalHeader';
import ArticleContent from './ArticleContent';
import LinksSection from './LinksSection';
import AttributionSection from './AttributionSection';

/**
 * Modern MagnifyingGlassModal Component
 * Shows detailed article view with contemporary styling and smooth animations
 * Now modularized using focused components and hooks
 */
const MagnifyingGlassModal = ({ visible, event, onClose }) => {
  // Use custom hook for animations
  const animations = useModalAnimations(visible);

  if (!event) return null;

  const {
    year,
    category = 'event',
    links = [],
    source,
  } = event;

  // Use primary color for category (simplified)
  const categoryColor = COLORS.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: animations.fadeAnim,
          },
        ]}
      >
        {/* Modern blur background */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.3)',
            'rgba(0, 0, 0, 0.6)',
            'rgba(0, 0, 0, 0.8)',
          ]}
          style={styles.blurBackground}
        />

        {/* Modal container */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: animations.scaleAnim }],
              opacity: animations.opacityAnim,
            },
          ]}
        >
          {/* Modern card background */}
          <LinearGradient
            colors={[COLORS.surface, COLORS.surfaceSecondary]}
            style={styles.cardBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Modal Header */}
          <ModalHeader onClose={onClose} />

          {/* Article content with animation */}
          <ScrollView
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollableContentContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <Animated.View
              style={[
                styles.articleContentWrapper,
                {
                  opacity: animations.contentOpacity,
                  transform: [{ translateY: animations.slideAnim }],
                },
              ]}
            >
              {/* Article Content */}
              <ArticleContent
                event={event}
                contentOpacity={animations.contentOpacity}
                slideAnim={animations.slideAnim}
              />

              {/* Links Section */}
              <LinksSection
                links={links}
                categoryColor={categoryColor}
                source={source}
              />

              {/* Attribution Section */}
              <AttributionSection source={source} />
              
              {/* Bottom spacer for better scrolling experience */}
              <View style={styles.bottomSpacer} />
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPaddingHorizontal,
  },

  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    width: '95%',
    maxWidth: 450,
    height: '90%',
    maxHeight: 750,
    borderRadius: LAYOUT.cardBorderRadius,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },

  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: LAYOUT.cardBorderRadius,
  },

  scrollableContent: {
    flex: 1,
  },

  scrollableContentContainer: {
    flexGrow: 1,
  },

  articleContentWrapper: {
    flex: 1,
  },

  bottomSpacer: {
    height: SPACING.lg,
  },
};

export default MagnifyingGlassModal;