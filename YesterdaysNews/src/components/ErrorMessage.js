import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, SHADOWS } from '../utils/constants';

/**
 * ErrorMessage Component
 * Displays error messages with retry functionality and appropriate icons
 */
const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry,
  retryText = 'Try Again',
  showIcon = true,
  type = 'error', // 'error', 'network', 'empty'
  style 
}) => {
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
        return COLORS.textLight;
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

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {showIcon && (
          <MaterialIcons 
            name={getIconName()} 
            size={48} 
            color={getIconColor()} 
            style={styles.icon}
          />
        )}
        
        <Text style={styles.title}>{getTitle()}</Text>
        
        <Text style={styles.message}>{message}</Text>
        
        {onRetry && (
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name="refresh" 
              size={20} 
              color={COLORS.cardBackground} 
              style={styles.retryIcon}
            />
            <Text style={styles.retryText}>{retryText}</Text>
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
              • Check your internet connection{'\n'}
              • Make sure you're connected to WiFi or mobile data{'\n'}
              • Try again in a moment
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * Inline ErrorMessage for smaller spaces
 */
export const InlineErrorMessage = ({ message, onRetry, style }) => {
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
          <Text style={styles.inlineRetryText}>Retry</Text>
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
    paddingHorizontal: LAYOUT.screenPadding,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  title: {
    ...TYPOGRAPHY.header,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.textDark,
  },
  message: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: LAYOUT.borderRadius,
    ...SHADOWS.card,
    minHeight: LAYOUT.touchableMinHeight,
  },
  retryIcon: {
    marginRight: SPACING.sm,
  },
  retryText: {
    color: COLORS.cardBackground,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyStateInfo: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyStateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  networkInfo: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  networkInfoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    lineHeight: 18,
  },

  // Inline styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: LAYOUT.screenPadding,
  },
  inlineIcon: {
    marginRight: SPACING.sm,
  },
  inlineMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  inlineRetry: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  inlineRetryText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Card styles
  cardContainer: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: LAYOUT.screenPadding,
    marginVertical: LAYOUT.cardMargin,
    borderRadius: LAYOUT.cardBorderRadius,
    borderWidth: 1,
    borderColor: COLORS.error,
    ...SHADOWS.card,
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
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardRetry: {
    alignSelf: 'flex-start',
  },
  cardRetryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ErrorMessage;