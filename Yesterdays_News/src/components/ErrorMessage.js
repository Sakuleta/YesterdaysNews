import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, ANIMATIONS } from '../utils/constants';
import { useTranslation } from 'react-i18next';

/**
 * Modern ErrorMessage Component
 * Displays error messages with contemporary styling and smooth animations
 */
const ErrorMessage = ({ 
  message,
  onRetry,
  retryText,
  showIcon = true,
  type = 'error', // 'error', 'network', 'empty'
  style 
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATIONS.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getIconName = () => {
    switch (type) {
      case 'network':
        return 'wifi-off';
      case 'empty':
        return 'event-note';
      default:
        return 'error-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'network':
        return COLORS.warning;
      case 'empty':
        return COLORS.textSecondary;
      default:
        return COLORS.error;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'network':
        return 'No Internet Connection';
      case 'empty':
        return 'No Events Found';
      default:
        return 'Oops! Something went wrong';
    }
  };

  const getBackgroundColors = () => {
    switch (type) {
      case 'network':
        return [COLORS.warning + '10', COLORS.warning + '05'];
      case 'empty':
        return [COLORS.textTertiary + '10', COLORS.textTertiary + '05'];
      default:
        return [COLORS.error + '10', COLORS.error + '05'];
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          }
        ]}
      >
        {/* Modern gradient background */}
        <LinearGradient
          colors={getBackgroundColors()}
          style={styles.contentBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {showIcon && (
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={getIconName()} 
              size={LAYOUT.iconSizeLarge} 
              color={getIconColor()} 
            />
          </View>
        )}
        
        <Text style={styles.title}>{getTitle()}</Text>
        
        <Text style={styles.message}>{message}</Text>
        
        {onRetry && (
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              // Force refresh when retrying
              onRetry();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentLight]}
              style={styles.retryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons 
                name="refresh" 
                size={20} 
                color={COLORS.textInverse} 
                style={styles.retryIcon}
              />
              <Text style={styles.retryText}>{retryText || t('error.tryAgain')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {type === 'empty' && (
          <View style={styles.emptyStateInfo}>
            <Text style={styles.emptyStateText}>
              🗓️ Try checking another date or come back tomorrow for new historical events!
            </Text>
          </View>
        )}

        {type === 'network' && (
          <View style={styles.networkInfo}>
            <Text style={styles.networkInfoText}>
              {t('error.tips')}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

/**
 * Inline ErrorMessage for smaller spaces
 */
export const InlineErrorMessage = ({ message, onRetry, style }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.inlineContainer, style]}>
      <MaterialIcons 
        name="error-outline" 
        size={16} 
        color={COLORS.error} 
        style={styles.inlineIcon}
      />
      <Text style={styles.inlineMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.inlineRetry}>
          <Text style={styles.inlineRetryText}>{t('error.inlineRetry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Card-style ErrorMessage
 */
export const ErrorCard = ({ message, onRetry, style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.cardContent}>
        <MaterialIcons 
          name="error-outline" 
          size={24} 
          color={COLORS.error} 
          style={styles.cardIcon}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardMessage}>{message}</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.cardRetry}>
              <Text style={styles.cardRetryText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    padding: SPACING.lg,
    marginBottom: SPACING.sm, // Reduced from lg to sm to bring closer
  },
  
  title: {
    ...TYPOGRAPHY.headlineMedium,
    textAlign: 'center',
    marginBottom: SPACING.sm, // Reduced from md to sm to bring closer
    color: COLORS.textPrimary,
  },
  
  message: {
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  
  retryButton: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
    minHeight: LAYOUT.buttonHeight,
  },
  
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  
  retryIcon: {
    marginRight: SPACING.sm,
  },
  
  retryText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  
  emptyStateInfo: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  
  emptyStateText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  networkInfo: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
    },
  
  networkInfoText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Inline styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },
  
  inlineIcon: {
    marginRight: SPACING.sm,
  },
  
  inlineMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  
  inlineRetry: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  
  inlineRetryText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Card styles
  cardContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: LAYOUT.screenPaddingHorizontal,
    marginVertical: SPACING.md,
    borderRadius: LAYOUT.cardBorderRadius,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: LAYOUT.cardPadding,
  },
  
  cardIcon: {
    marginRight: SPACING.md,
  },
  
  cardTextContainer: {
    flex: 1,
  },
  
  cardMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  cardRetry: {
    alignSelf: 'flex-start',
  },
  
  cardRetryText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ErrorMessage;