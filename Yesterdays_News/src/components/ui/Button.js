import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../utils/constants';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';

/**
 * Button Component - Reusable button with multiple variants
 *
 * @param {Object} props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {'primary'|'secondary'|'outline'|'ghost'} props.variant - Button variant
 * @param {'small'|'medium'|'large'} props.size - Button size
 * @param {boolean} props.loading - Show loading indicator
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.icon - Icon name (MaterialIcons)
 * @param {'left'|'right'} props.iconPosition - Icon position
 * @param {Object} props.style - Custom styles
 * @param {Object} props.textStyle - Custom text styles
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) => {
  // Use performance monitor
  usePerformanceMonitor('Button');

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.base, styles[variant], styles[size]];

    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];

    if (textStyle) {
      baseTextStyle.push(textStyle);
    }

    return baseTextStyle;
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <MaterialIcons
        name={icon}
        size={styles[`${size}Icon`].fontSize}
        color={getTextStyle()[0].color || COLORS.textPrimary}
        style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={styles[`${variant}Text`].color || COLORS.textPrimary}
        />
      );
    }

    return (
      <View style={styles.content}>
        {iconPosition === 'left' && renderIcon()}
        <Text style={getTextStyle()}>
          {title}
        </Text>
        {iconPosition === 'right' && renderIcon()}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Loading...' : title}
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: LAYOUT.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    minHeight: 32,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: 52,
  },

  // States
  disabled: {
    opacity: 0.6,
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icons
  iconLeft: {
    marginRight: SPACING.xs,
  },
  iconRight: {
    marginLeft: SPACING.xs,
  },
  smallIcon: {
    fontSize: 16,
  },
  mediumIcon: {
    fontSize: 18,
  },
  largeIcon: {
    fontSize: 20,
  },

  // Text
  text: {
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.labelMedium.fontFamily,
  },

  primaryText: {
    color: COLORS.surface,
    fontFamily: TYPOGRAPHY.labelMedium.fontFamily,
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontFamily: TYPOGRAPHY.labelMedium.fontFamily,
  },
  outlineText: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.labelMedium.fontFamily,
  },
  ghostText: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.labelMedium.fontFamily,
  },

  smallText: {
    fontSize: TYPOGRAPHY.labelSmall.fontSize,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.labelMedium.fontSize,
  },
  largeText: {
    fontSize: TYPOGRAPHY.labelLarge.fontSize,
  },
});

export default Button;
