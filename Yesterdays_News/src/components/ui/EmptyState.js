import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../utils/constants';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';
import Button from './Button';

/**
 * EmptyState Component - Display empty state with icon, message and optional action
 *
 * @param {Object} props
 * @param {string} props.icon - MaterialIcon name
 * @param {string} props.title - Main message title
 * @param {string} props.message - Descriptive message
 * @param {string} props.actionText - Action button text
 * @param {Function} props.onAction - Action button press handler
 * @param {'small'|'medium'|'large'} props.size - Component size
 * @param {Object} props.style - Custom container styles
 * @param {boolean} props.fullScreen - Take full screen height
 */
const EmptyState = ({
  icon = 'info-outline',
  title = 'No Data',
  message,
  actionText,
  onAction,
  size = 'medium',
  style,
  fullScreen = false,
  ...props
}) => {
  // Use performance monitor
  usePerformanceMonitor('EmptyState');

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 80;
      default:
        return 56;
    }
  };

  const getTitleStyle = () => {
    switch (size) {
      case 'small':
        return styles.titleSmall;
      case 'large':
        return styles.titleLarge;
      default:
        return styles.titleMedium;
    }
  };

  const getMessageStyle = () => {
    switch (size) {
      case 'small':
        return styles.messageSmall;
      case 'large':
        return styles.messageLarge;
      default:
        return styles.messageMedium;
    }
  };

  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, styles[size]]}>
          <MaterialIcons
            name={icon}
            size={getIconSize()}
            color={COLORS.textTertiary}
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, getTitleStyle()]}>
          {title}
        </Text>

        {/* Message */}
        {message && (
          <Text style={[styles.message, getMessageStyle()]}>
            {message}
          </Text>
        )}

        {/* Action Button */}
        {actionText && onAction && (
          <Button
            title={actionText}
            onPress={onAction}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );
};

/**
 * Preset EmptyState components for common use cases
 */
export const EmptyStates = {
  NoData: (props) => (
    <EmptyState
      icon="info-outline"
      title="No Data Found"
      message="There are no items to display at the moment."
      {...props}
    />
  ),

  NoResults: (props) => (
    <EmptyState
      icon="search-off"
      title="No Results"
      message="No items match your search criteria."
      {...props}
    />
  ),

  NoEvents: (props) => (
    <EmptyState
      icon="event-note"
      title="No Historical Events"
      message="No historical events were found for this date."
      {...props}
    />
  ),

  Offline: (props) => (
    <EmptyState
      icon="wifi-off"
      title="You're Offline"
      message="Please check your internet connection and try again."
      actionText="Retry"
      {...props}
    />
  ),

  Error: (props) => (
    <EmptyState
      icon="error-outline"
      title="Something Went Wrong"
      message="An error occurred while loading the data."
      actionText="Try Again"
      {...props}
    />
  ),

  Loading: (props) => (
    <EmptyState
      icon="hourglass-empty"
      title="Loading..."
      message="Please wait while we load your content."
      {...props}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },

  fullScreen: {
    minHeight: '100%',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300,
  },

  // Icon containers
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LAYOUT.borderRadius,
    backgroundColor: COLORS.surfaceSecondary,
  },

  small: {
    width: 48,
    height: 48,
  },

  medium: {
    width: 72,
    height: 72,
  },

  large: {
    width: 96,
    height: 96,
  },

  // Title styles
  title: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  titleSmall: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.textPrimary,
  },

  titleMedium: {
    ...TYPOGRAPHY.headlineMedium,
    color: COLORS.textPrimary,
  },

  titleLarge: {
    ...TYPOGRAPHY.headlineLarge,
    color: COLORS.textPrimary,
  },

  // Message styles
  message: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  messageSmall: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  messageMedium: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },

  messageLarge: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },

  // Action button
  actionButton: {
    marginTop: SPACING.md,
  },
});

export default EmptyState;
