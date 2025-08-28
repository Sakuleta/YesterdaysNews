import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/constants';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';

/**
 * LoadingIndicator Component - Reusable loading indicator with multiple styles
 *
 * @param {Object} props
 * @param {'small'|'medium'|'large'} props.size - Loading indicator size
 * @param {string} props.message - Loading message
 * @param {'spinner'|'pulse'|'dots'} props.type - Loading animation type
 * @param {Object} props.style - Custom container styles
 * @param {Object} props.textStyle - Custom text styles
 * @param {boolean} props.overlay - Show as overlay
 * @param {string} props.color - Custom color
 */
const LoadingIndicator = ({
  size = 'medium',
  message,
  type = 'spinner',
  style,
  textStyle,
  overlay = false,
  color,
  ...props
}) => {
  // Use performance monitor
  usePerformanceMonitor('LoadingIndicator');

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'small';
    }
  };

  const getColor = () => {
    return color || COLORS.primary;
  };

  const renderSpinner = () => (
    <ActivityIndicator
      size={getSpinnerSize()}
      color={getColor()}
      {...props}
    />
  );

  const renderPulse = () => {
    const pulseAnim = new Animated.Value(1);

    React.useEffect(() => {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }, []);

    return (
      <Animated.View
        style={[
          styles.pulseContainer,
          styles[size],
          {
            transform: [{ scale: pulseAnim }],
            backgroundColor: getColor(),
          },
        ]}
      />
    );
  };

  const renderDots = () => {
    const dot1Opacity = new Animated.Value(0.3);
    const dot2Opacity = new Animated.Value(0.3);
    const dot3Opacity = new Animated.Value(0.3);

    React.useEffect(() => {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };
      animateDots();
    }, []);

    return (
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity, backgroundColor: getColor() }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity, backgroundColor: getColor() }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity, backgroundColor: getColor() }]} />
      </View>
    );
  };

  const renderIndicator = () => {
    switch (type) {
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.indicatorContainer}>
        {renderIndicator()}
        {message && (
          <Text style={[styles.message, textStyle]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },

  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pulse styles
  pulseContainer: {
    borderRadius: 50,
  },

  small: {
    width: 20,
    height: 20,
  },

  medium: {
    width: 40,
    height: 40,
  },

  large: {
    width: 60,
    height: 60,
  },

  // Dots styles
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },

  // Text styles
  message: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default LoadingIndicator;
