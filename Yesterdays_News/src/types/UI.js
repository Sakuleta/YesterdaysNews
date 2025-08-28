/**
 * @typedef {Object} ButtonProps
 * @property {string} title - Button text
 * @property {Function} [onPress] - Press handler
 * @property {'primary'|'secondary'|'outline'|'ghost'} [variant] - Button variant
 * @property {'small'|'medium'|'large'} [size] - Button size
 * @property {boolean} [loading] - Show loading indicator
 * @property {boolean} [disabled] - Disable button
 * @property {string} [icon] - Icon name (MaterialIcons)
 * @property {'left'|'right'} [iconPosition] - Icon position
 * @property {Object} [style] - Custom styles
 * @property {Object} [textStyle] - Custom text styles
 */

/**
 * @typedef {Object} LoadingIndicatorProps
 * @property {'small'|'medium'|'large'} [size] - Loading indicator size
 * @property {string} [message] - Loading message
 * @property {'spinner'|'pulse'|'dots'} [type] - Loading animation type
 * @property {Object} [style] - Custom container styles
 * @property {Object} [textStyle] - Custom text styles
 * @property {boolean} [overlay] - Show as overlay
 * @property {string} [color] - Custom color
 */

/**
 * @typedef {Object} EmptyStateProps
 * @property {string} [icon] - MaterialIcon name
 * @property {string} [title] - Main message title
 * @property {string} [message] - Descriptive message
 * @property {string} [actionText] - Action button text
 * @property {Function} [onAction] - Action button press handler
 * @property {'small'|'medium'|'large'} [size] - Component size
 * @property {Object} [style] - Custom container styles
 * @property {boolean} [fullScreen] - Take full screen height
 */

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to wrap
 * @property {Function} [fallback] - Custom fallback component
 * @property {Function} [onError] - Error callback
 * @property {Function} [onRetry] - Retry callback
 * @property {Function} [onReport] - Report callback
 * @property {boolean} [showDetails] - Show error details
 * @property {boolean} [showReportButton] - Show report button
 */

/**
 * @typedef {Object} EventCardProps
 * @property {import('./Event').Event} event - Event data
 * @property {Function} [onPress] - Press handler
 */

/**
 * @typedef {Object} EventCardHeaderProps
 * @property {number} year - Event year
 * @property {string} [category] - Event category
 */

/**
 * @typedef {Object} EventCardContentProps
 * @property {string} title - Event title
 * @property {string} [description] - Event description
 */

/**
 * @typedef {Object} EventCardFooterProps
 * @property {Function} [onPress] - Press handler
 */

/**
 * @typedef {Object} ModalHeaderProps
 * @property {Function} [onClose] - Close handler
 */

/**
 * @typedef {Object} ArticleContentProps
 * @property {import('./Event').Event} [event] - Event data
 * @property {import('react-native').Animated.Value} [contentOpacity] - Content opacity animation
 * @property {import('react-native').Animated.Value} [slideAnim] - Slide animation
 */

/**
 * @typedef {Object} LinksSectionProps
 * @property {Array<import('./Event').Link>} [links] - Related links
 * @property {string} [categoryColor] - Category color
 * @property {string} [source] - Event source
 */

/**
 * @typedef {Object} AttributionSectionProps
 * @property {string} [source] - Event source
 */

/**
 * @typedef {Object} MagnifyingGlassModalProps
 * @property {boolean} visible - Modal visibility
 * @property {import('./Event').Event} [event] - Event data
 * @property {Function} [onClose] - Close handler
 */

/**
 * @typedef {Object} NewspaperMastheadProps
 * @property {Function} [onLanguageChange] - Language change handler
 */

/**
 * @typedef {Object} DateHeaderProps
 * @property {string} [date] - Date string
 * @property {string} [formattedDate] - Formatted date string
 */

/**
 * @typedef {Object} LoadingSpinnerProps
 * @property {string} [message] - Loading message
 * @property {'small'|'medium'|'large'} [size] - Spinner size
 */

/**
 * @typedef {Object} ErrorMessageProps
 * @property {string} message - Error message
 * @property {Function} [onRetry] - Retry handler
 * @property {string} [retryText] - Retry button text
 */

/**
 * @typedef {Object} LoadingSkeletonProps
 * @property {number} [itemCount] - Number of skeleton items
 * @property {'event'|'article'} [type] - Skeleton type
 */

/**
 * @typedef {Object} StyleObject
 * @property {Object} [container] - Container styles
 * @property {Object} [text] - Text styles
 * @property {Object} [button] - Button styles
 * @property {Object} [icon] - Icon styles
 */

/**
 * Common UI component variants
 * @type {Object<string, string[]>}
 */
export const UI_VARIANTS = {
  BUTTON: ['primary', 'secondary', 'outline', 'ghost'],
  SIZE: ['small', 'medium', 'large'],
  LOADING_TYPE: ['spinner', 'pulse', 'dots'],
  EMPTY_STATE_SIZE: ['small', 'medium', 'large'],
};

/**
 * Common UI colors
 * @type {Object<string, string>}
 */
export const UI_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F9FAFB',
  SURFACE_SECONDARY: '#F3F4F6',
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_TERTIARY: '#9CA3AF',
  BORDER: '#E5E7EB',
  BORDER_DARK: '#D1D5DB',
};

/**
 * Validates if props object matches component requirements
 * @param {Object} props - Props to validate
 * @param {Object} requirements - Required prop types
 * @returns {Object} Validation result
 */
export const validateProps = (props, requirements) => {
  const errors = [];
  const warnings = [];

  Object.entries(requirements).forEach(([propName, expectedType]) => {
    const value = props[propName];

    if (value === undefined && !expectedType.includes('?')) {
      errors.push(`Missing required prop: ${propName}`);
      return;
    }

    if (value === undefined && expectedType.includes('?')) {
      return; // Optional prop not provided
    }

    const cleanType = expectedType.replace('?', '');

    switch (cleanType) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Prop ${propName} must be a string`);
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Prop ${propName} must be a valid number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Prop ${propName} must be a boolean`);
        }
        break;
      case 'function':
        if (typeof value !== 'function') {
          errors.push(`Prop ${propName} must be a function`);
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null) {
          errors.push(`Prop ${propName} must be an object`);
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`Prop ${propName} must be an array`);
        }
        break;
      default:
        // Custom validation for specific values
        if (Array.isArray(cleanType) && !cleanType.includes(value)) {
          warnings.push(`Prop ${propName} should be one of: ${cleanType.join(', ')}`);
        }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Creates default props for a component
 * @param {Object} defaultProps - Default props object
 * @param {Object} providedProps - Provided props object
 * @returns {Object} Merged props object
 */
export const createDefaultProps = (defaultProps, providedProps) => {
  return {
    ...defaultProps,
    ...providedProps,
  };
};

/**
 * Sanitizes style objects to prevent invalid styles
 * @param {Object} styles - Style object to sanitize
 * @returns {Object} Sanitized style object
 */
export const sanitizeStyles = (styles) => {
  if (!styles || typeof styles !== 'object') {
    return {};
  }

  const sanitized = {};

  Object.entries(styles).forEach(([key, value]) => {
    // Remove undefined values
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  UI_VARIANTS,
  UI_COLORS,
  validateProps,
  createDefaultProps,
  sanitizeStyles,
  debounce,
  throttle,
};
