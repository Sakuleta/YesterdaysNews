/**
 * Application-wide constants - Modern Vintage Newspaper Theme
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';

// "Modern Vintage" color scheme using a Solarized Light palette
export const COLORS = {
  // Primary colors (Muted Blue)
  primary: '#268bd2',
  primaryLight: '#58a6dc',
  primaryDark: '#002b36',

  // Background colors (Sepia/Off-white)
  background: '#fdf6e3', // Solarized Light
  surface: '#fefcf5',
  surfaceSecondary: '#eee8d5', // Solarized Base2

  // Text colors
  textPrimary: '#002b36', // Solarized Base01
  textSecondary: '#586e75', // Solarized Base0
  textTertiary: '#93a1a1', // Solarized Base1
  textDisabled: '#cbd3d3', // Disabled text color
  textInverse: '#fdf6e3',

  // Accent colors
  accent: '#cb4b16', // Solarized Orange
  accentLight: '#d36736',
  success: '#859900', // Solarized Green
  warning: '#b58900', // Solarized Yellow
  error: '#dc322f', // Solarized Red

  // Category colors
  politics: '#dc322f', // Red
  war: '#cb4b16', // Orange
  science: '#268bd2', // Blue
  discovery: '#859900', // Green
  disaster: '#b58900', // Yellow
  birth: '#2aa198', // Cyan
  death: '#6c71c4', // Violet
  general: '#657b83', // Solarized Base00

  // Border and shadow colors
  border: '#eee8d5',
  borderDark: '#93a1a1',
  shadow: 'rgba(0, 43, 54, 0.1)',

  // Legacy compatibility (using new theme)
  paperBackground: '#fdf6e3',
  paperYellow: '#eee8d5',
  inkBlack: '#002b36',
  inkGray: '#586e75',
  headlineBlack: '#073642', // Solarized Base02
};

// Typography using classic fonts
export const TYPOGRAPHY = {
  // Display styles
  displayLarge: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.25,
    lineHeight: 36,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    letterSpacing: 0,
    lineHeight: 32,
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    letterSpacing: 0,
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    letterSpacing: 0,
    lineHeight: 24,
  },
  headlineSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    letterSpacing: 0,
    lineHeight: 22,
  },
  
  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
    fontFamily: 'Lato_400Regular',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
    fontFamily: 'Lato_400Regular',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textSecondary,
    fontFamily: 'Lato_400Regular',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  
  // Label styles
  labelLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Lato_700Bold',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Lato_700Bold',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    fontFamily: 'Lato_700Bold',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  
  // Legacy compatibility
  masthead: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32, // Reduced from 48 to fit mobile screens
    color: COLORS.headlineBlack,
    letterSpacing: 0.5, // Reduced letter spacing for better fit
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    color: COLORS.headlineBlack,
    lineHeight: 34,
  },
  subheadline: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
  bodyText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.inkBlack,
  },
  columnText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.inkBlack,
  },
  dateHeader: {
    fontFamily: 'Lato_700Bold, system-ui',
    fontSize: 14,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  byline: {
    fontFamily: 'Lato_400Regular_Italic',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  sectionHeader: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: COLORS.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomColor: COLORS.borderDark,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  header: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  eventTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  eventDescription: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  eventYear: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  body: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  caption: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textTertiary,
  },
};

// Spacing system (remains consistent)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12, // Adjusted for a tighter, classic layout
  lg: 20,
  xl: 28,
  xxl: 40,
  xxxl: 56,
};

// Layout system with a vintage feel
export const LAYOUT = {
  // Screen dimensions
  screenPadding: 16,
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 12,
  
  // Card dimensions
  cardPadding: 16,
  cardPaddingHorizontal: 16,
  cardPaddingVertical: 12,
  cardMargin: 10,
  cardBorderRadius: 4, // Sharper edges
  
  // Component dimensions
  buttonHeight: 44,
  inputHeight: 44,
  iconSize: 22,
  iconSizeLarge: 30,
  
  // Touch targets
  touchableMinHeight: 44,
  touchableMinWidth: 44,
  
  // Border radius
  borderRadius: 6,
  borderRadiusSmall: 3,
  borderRadiusLarge: 12,
  borderRadiusXLarge: 18,
  
  // Legacy compatibility
  pageMargin: 16,
  columnGap: 12,
  sectionSpacing: 20,
  articleSpacing: 12,
  mastheadHeight: 70,
  headerBorderWidth: 2,
  columnBorderWidth: 1,
  foldLineHeight: 1,
};

// Category icons using MaterialCommunityIcons
export const CATEGORY_ICONS = {
  birth: 'baby-carriage',
  death: 'grave-stone',
  war: 'sword-cross',
  discovery: 'flask-outline',
  disaster: 'fire',
  politics: 'gavel',
  event: 'calendar-star',
};

// Category colors (using the new palette)
export const CATEGORY_COLORS = {
  birth: COLORS.birth,
  death: COLORS.death,
  war: COLORS.war,
  discovery: COLORS.discovery,
  disaster: COLORS.disaster,
  politics: COLORS.politics,
  event: COLORS.general,
};

// Animation system (can be kept as is or adjusted)
export const ANIMATIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  spring: {
    tension: 100,
    friction: 8,
  },
};

// API configuration (remains the same)
export const API = {
  timeout: 10000,
  retryAttempts: 3,
  cacheExpiryHours: 24,
  maxEventsPerDay: 20,
  // Optional: backend proxy base URL for external APIs to keep keys private
  proxyBaseUrl: '',
  // Backoff configuration (ms)
  backoffInitial: 400,
  backoffFactor: 2,
  backoffMax: 4000,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  ANIMATIONS,
  API,
};