/**
 * Application-wide constants - Newspaper Theme
 */

// Newspaper color scheme
export const COLORS = {
  // Vintage newspaper colors
  paperBackground: '#f7f5f3',     // Aged paper background
  paperYellow: '#faf8f0',         // Yellowed paper
  inkBlack: '#2c2c2c',            // Newspaper ink black
  inkGray: '#4a4a4a',             // Lighter ink gray
  headlineBlack: '#1a1a1a',       // Deep black for headlines
  
  // Accent colors for categories
  politics: '#8b0000',            // Dark red for politics
  war: '#cc4125',                 // Red for war
  science: '#1f4e79',             // Navy blue for science
  disaster: '#d2691e',            // Orange for disasters
  birth: '#228b22',               // Forest green for births
  death: '#696969',               // Dim gray for deaths
  general: '#2f4f4f',             // Dark slate gray
  
  // UI elements
  border: '#d4af37',              // Gold border for accents
  shadow: '#00000020',            // Subtle shadows
  foldLine: '#c0c0c0',            // Paper fold lines
  vintage: '#8b4513',             // Brown vintage accents
  
  // Status colors
  error: '#cc4125',
  success: '#228b22',
  warning: '#d2691e',
};

// Newspaper Typography
export const TYPOGRAPHY = {
  // Masthead and headlines
  masthead: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.headlineBlack,
    fontFamily: 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.headlineBlack,
    fontFamily: 'serif',
    lineHeight: 32,
  },
  subheadline: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.inkBlack,
    fontFamily: 'serif',
    lineHeight: 24,
  },
  
  // Body text styles
  bodyText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.inkBlack,
    fontFamily: 'serif',
    lineHeight: 20,
    textAlign: 'justify',
  },
  columnText: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.inkBlack,
    fontFamily: 'serif',
    lineHeight: 18,
    textAlign: 'justify',
  },
  
  // Date and metadata
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.inkGray,
    fontFamily: 'serif',
  },
  byline: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.inkGray,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  
  // Section headers
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.headlineBlack,
    fontFamily: 'serif',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Legacy compatibility
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.headlineBlack,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.inkBlack,
  },
  eventDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.inkBlack,
    lineHeight: 20,
  },
  eventYear: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.inkGray,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.inkBlack,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.inkGray,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Newspaper Layout
export const LAYOUT = {
  // Page margins and spacing
  pageMargin: 20,
  columnGap: 16,
  sectionSpacing: 24,
  articleSpacing: 16,
  
  // Newspaper specific measurements
  mastheadHeight: 80,
  headerBorderWidth: 3,
  columnBorderWidth: 1,
  foldLineHeight: 2,
  
  // Touch targets
  touchableMinHeight: 44,
  iconSize: 24,
  
  // Border radius for modern touch
  borderRadius: 4,
  cardBorderRadius: 8,
  
  // Legacy compatibility
  screenPadding: 20,
  cardPadding: 16,
  cardMargin: 8,
};

// Newspaper Shadows and Effects
export const SHADOWS = {
  paperShadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  foldShadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  textShadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  // Legacy compatibility
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
};

// Category icons mapping
export const CATEGORY_ICONS = {
  birth: '👶',
  death: '⚰️',
  war: '⚔️',
  discovery: '🔬',
  disaster: '🌋',
  politics: '👑',
  event: '📅',
};

// Category colors (updated for newspaper theme)
export const CATEGORY_COLORS = {
  birth: COLORS.birth,
  death: COLORS.death,
  war: COLORS.war,
  discovery: COLORS.science,
  disaster: COLORS.disaster,
  politics: COLORS.politics,
  event: COLORS.general,
};

// Animation durations
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// API configuration
export const API = {
  timeout: 10000,
  retryAttempts: 3,
  cacheExpiryHours: 24,
  maxEventsPerDay: 20,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
  SHADOWS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  ANIMATIONS,
  API,
};