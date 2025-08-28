import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';

/**
 * Common Style Templates
 * Reusable style patterns used across components
 */

// Card styles - Used in EventCard, Modal, etc.
export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginHorizontal: LAYOUT.pageMargin,
    marginVertical: SPACING.sm,
    borderRadius: LAYOUT.cardBorderRadius,
    padding: LAYOUT.cardPadding,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

// Button styles - Used across different components
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...TYPOGRAPHY.labelMedium,
    fontFamily: 'Lato_700Bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  close: {
    padding: SPACING.sm,
  },
});

// Text styles - Common text patterns
export const textStyles = StyleSheet.create({
  headline: {
    ...TYPOGRAPHY.headlineLarge,
    textAlign: 'center',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  title: {
    ...TYPOGRAPHY.headlineSmall,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  body: {
    ...TYPOGRAPHY.bodyMedium,
    fontFamily: 'Lato_400Regular',
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  label: {
    ...TYPOGRAPHY.labelSmall,
    fontFamily: 'Lato_700Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  category: {
    ...TYPOGRAPHY.labelMedium,
    fontFamily: 'Lato_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  year: {
    ...TYPOGRAPHY.eventYear,
    fontFamily: 'Lato_700Bold',
    color: COLORS.textSecondary,
  },
});

// Layout styles - Common layout patterns
export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPaddingHorizontal,
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: SPACING.xs,
  },
  spacer: {
    height: SPACING.xl,
  },
});

// Modal styles - Common modal patterns
export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.screenPaddingHorizontal,
  },
  container: {
    width: '95%',
    maxWidth: 450,
    height: '90%',
    maxHeight: 750,
    borderRadius: LAYOUT.cardBorderRadius,
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: LAYOUT.cardBorderRadius,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flex: 1,
    padding: LAYOUT.cardPadding,
    paddingTop: SPACING.lg,
  },
});

export default {
  cardStyles,
  buttonStyles,
  textStyles,
  layoutStyles,
  modalStyles,
};
