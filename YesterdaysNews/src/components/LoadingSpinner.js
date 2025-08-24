import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, ANIMATIONS } from '../utils/constants';

/**
 * LoadingSpinner Component
 * Displays loading indicator with optional message
 */
const LoadingSpinner = ({ 
  message = 'Loading historical events...', 
  size = 'large',
  showIcon = true,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {showIcon && (
          <MaterialIcons 
            name="history" 
            size={32} 
            color={COLORS.primary} 
            style={styles.icon}
          />
        )}
        
        <ActivityIndicator 
          size={size} 
          color={COLORS.primary} 
          style={styles.spinner}
        />
        
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.dotsContainer}>
          <Text style={styles.dots}>📚 Searching through history...</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Compact LoadingSpinner for smaller spaces
 */
export const CompactLoadingSpinner = ({ message, style }) => {
  return (
    <View style={[styles.compactContainer, style]}>
      <ActivityIndicator 
        size="small" 
        color={COLORS.primary} 
        style={styles.compactSpinner}
      />
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
      <ActivityIndicator 
        size="small" 
        color={COLORS.primary} 
      />
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
    paddingHorizontal: LAYOUT.screenPadding,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    marginBottom: SPACING.md,
    opacity: 0.8,
  },
  spinner: {
    marginBottom: SPACING.lg,
  },
  message: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  dotsContainer: {
    marginTop: SPACING.sm,
  },
  dots: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Compact version styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPadding,
  },
  compactSpinner: {
    marginRight: SPACING.sm,
  },
  compactMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  
  // Inline version styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  inlineMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
});

export default LoadingSpinner;