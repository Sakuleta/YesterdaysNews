import { Animated } from 'react-native';
import { ANIMATIONS } from './constants';

/**
 * Animation Utilities
 * Common animation patterns used across the application
 */

/**
 * Create fade in animation
 * @param {Animated.Value} animatedValue - Animated value to use
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const fadeIn = (animatedValue, config = {}) => {
  const { toValue = 1, duration = ANIMATIONS.normal } = config;

  return new Promise((resolve) => {
    Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start(resolve);
  });
};

/**
 * Create fade out animation
 * @param {Animated.Value} animatedValue - Animated value to use
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const fadeOut = (animatedValue, config = {}) => {
  const { toValue = 0, duration = ANIMATIONS.fast } = config;

  return new Promise((resolve) => {
    Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start(resolve);
  });
};

/**
 * Create scale animation
 * @param {Animated.Value} animatedValue - Animated value to use
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const scale = (animatedValue, config = {}) => {
  const {
    toValue = 1,
    tension = ANIMATIONS.spring.tension,
    friction = ANIMATIONS.spring.friction
  } = config;

  return new Promise((resolve) => {
    Animated.spring(animatedValue, {
      toValue,
      tension,
      friction,
      useNativeDriver: true,
    }).start(resolve);
  });
};

/**
 * Create slide animation
 * @param {Animated.Value} animatedValue - Animated value to use
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const slide = (animatedValue, config = {}) => {
  const {
    toValue = 0,
    duration = ANIMATIONS.normal,
    tension = ANIMATIONS.spring.tension,
    friction = ANIMATIONS.spring.friction,
    useSpring = true
  } = config;

  return new Promise((resolve) => {
    const animation = useSpring
      ? Animated.spring(animatedValue, {
          toValue,
          tension,
          friction,
          useNativeDriver: true,
        })
      : Animated.timing(animatedValue, {
          toValue,
          duration,
          useNativeDriver: true,
        });

    animation.start(resolve);
  });
};

/**
 * Create modal entrance animation sequence
 * @param {Object} animations - Animation values {scaleAnim, opacityAnim, slideAnim, fadeAnim}
 * @returns {Promise} Animation promise
 */
export const modalEntrance = (animations) => {
  const { scaleAnim, opacityAnim, slideAnim, fadeAnim, contentOpacity } = animations;

  return new Promise((resolve) => {
    Animated.sequence([
      // Background fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.fast,
        useNativeDriver: true,
      }),
      // Modal appearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: ANIMATIONS.spring.tension,
          friction: ANIMATIONS.spring.friction,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATIONS.normal,
          useNativeDriver: true,
        }),
      ]),
      // Content slide up and fade in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: ANIMATIONS.spring.tension,
          friction: ANIMATIONS.spring.friction,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: ANIMATIONS.normal,
          useNativeDriver: true,
        }),
      ]),
    ]).start(resolve);
  });
};

/**
 * Create modal exit animation sequence
 * @param {Object} animations - Animation values {scaleAnim, opacityAnim, fadeAnim}
 * @returns {Promise} Animation promise
 */
export const modalExit = (animations) => {
  const { scaleAnim, opacityAnim, fadeAnim } = animations;

  return new Promise((resolve) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        tension: ANIMATIONS.spring.tension,
        friction: ANIMATIONS.spring.friction,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: ANIMATIONS.fast,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATIONS.fast,
        useNativeDriver: true,
      }),
    ]).start(resolve);
  });
};

/**
 * Create loading animation
 * @param {Animated.Value} animatedValue - Animated value to use
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const loadingPulse = (animatedValue, config = {}) => {
  const { minValue = 0.7, maxValue = 1, duration = 1000 } = config;

  return new Promise((resolve) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Loop the animation
      loadingPulse(animatedValue, config);
      resolve();
    });
  });
};

/**
 * Create staggered animation for list items
 * @param {Array} animatedValues - Array of animated values
 * @param {Object} config - Animation configuration
 * @returns {Promise} Animation promise
 */
export const staggeredFadeIn = (animatedValues, config = {}) => {
  const { delay = 100, duration = ANIMATIONS.normal } = config;

  return new Promise((resolve) => {
    const animations = animatedValues.map((value, index) => {
      return Animated.timing(value, {
        toValue: 1,
        duration,
        delay: index * delay,
        useNativeDriver: true,
      });
    });

    Animated.stagger(delay, animations).start(resolve);
  });
};



/**
 * Reset animation values
 * @param {Object} animations - Animation values to reset
 */
export const resetAnimations = (animations) => {
  Object.values(animations).forEach(value => {
    if (value && typeof value.setValue === 'function') {
      value.setValue(0);
    }
  });
};

export default {
  fadeIn,
  fadeOut,
  scale,
  slide,
  modalEntrance,
  modalExit,
  loadingPulse,
  staggeredFadeIn,
  resetAnimations,
};
