import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, LAYOUT } from '../utils/constants';

/**
 * Skeleton loading component for historical events
 * Shows placeholder cards while content is loading
 */
const LoadingSkeleton = ({ count = 6 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <View key={index} style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonYear} />
        <View style={styles.skeletonCategory} />
      </View>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonDescription} />
      <View style={[styles.skeletonDescription, { width: '60%' }]} />
      <View style={styles.skeletonFooter}>
        <View style={styles.skeletonSource} />
        <View style={styles.skeletonButton} />
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      {skeletons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LAYOUT.pageMargin,
    paddingTop: SPACING.md,
  },
  skeletonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  skeletonYear: {
    width: 60,
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  skeletonCategory: {
    width: 80,
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 8,
  },
  skeletonTitle: {
    width: '90%',
    height: 24,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  skeletonDescription: {
    width: '100%',
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  skeletonSource: {
    width: 100,
    height: 14,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  skeletonButton: {
    width: 80,
    height: 32,
    backgroundColor: COLORS.border,
    borderRadius: 16,
  },
});

export default LoadingSkeleton;
