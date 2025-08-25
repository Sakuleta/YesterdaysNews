import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, ANIMATIONS } from '../utils/constants';
import { useTranslation } from 'react-i18next';

/**
 * Modern LoadingSpinner Component
 * Displays animated loading indicator with contemporary styling
 */
const LoadingSpinner = ({ 
  message,
  size = 'large',
  showIcon = true,
  style 
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: ANIMATIONS.spring.tension,
        friction: ANIMATIONS.spring.friction,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: ANIMATIONS.slow,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: ANIMATIONS.slow,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Modern gradient background */}
        <LinearGradient
          colors={[COLORS.surface, COLORS.surfaceSecondary]}
          style={styles.contentBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {showIcon && (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name="history" 
                size={LAYOUT.iconSizeLarge} 
                color={COLORS.primary} 
              />
            </View>
          </Animated.View>
        )}
        
        <View style={styles.spinnerContainer}>
          <ActivityIndicator 
            size={size} 
            color={COLORS.primary} 
          />
        </View>
        
        <Text style={styles.message}>{message || t('loading.message')}</Text>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t('loading.status')}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * Compact LoadingSpinner for smaller spaces
 */
export const CompactLoadingSpinner = ({ message, style }) => {
  return (
    <View style={[styles.compactContainer, style]}>
      <View style={styles.compactSpinnerContainer}>
        <ActivityIndicator 
          size="small" 
          color={COLORS.primary} 
        />
      </View>
      {message && (
        <Text style={styles.compactMessage}>{message}</Text>
      )}
    </View>
  );
};

/**
 * Inline LoadingSpinner for use within other components
 */
export const InlineLoadingSpinner = ({ message = 'Loading...', style }) => {
  return (
    <View style={[styles.inlineContainer, style]}>
      <View style={styles.inlineSpinnerContainer}>
        <ActivityIndicator 
          size="small" 
          color={COLORS.primary} 
        />
      </View>
      <Text style={styles.inlineMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  
  content: {
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    position: 'relative',
  },
  
  contentBackground: {
    position: 'absolute',
    top: -SPACING.lg,
    left: -SPACING.lg,
    right: -SPACING.lg,
    bottom: -SPACING.lg,
    borderRadius: LAYOUT.cardBorderRadius,
  },
  
  iconContainer: {
    backgroundColor: COLORS.primary + '15',
    padding: SPACING.lg,
    borderRadius: LAYOUT.borderRadiusLarge,
    marginBottom: SPACING.lg,
  },
  
  spinnerContainer: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  
  message: {
    ...TYPOGRAPHY.headlineSmall,
    textAlign: 'center',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: LAYOUT.borderRadius,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: SPACING.sm,
  },
  
  statusText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  
  // Compact version styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  
  compactSpinnerContainer: {
    marginRight: SPACING.sm,
  },
  
  compactMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
  },
  
  // Inline version styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  
  inlineSpinnerContainer: {
    marginRight: SPACING.sm,
  },
  
  inlineMessage: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});

export default LoadingSpinner;