import { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { ANIMATIONS } from '../utils/constants';

/**
 * Custom hook for managing modal animations
 * Handles all animation states and sequences for the modal
 */
export const useModalAnimations = (visible) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      slideAnim.setValue(30);
      fadeAnim.setValue(0);
      contentOpacity.setValue(0);

      // Opening animation sequence
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
      ]).start();
    } else {
      // Closing animation
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
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim, slideAnim, fadeAnim, contentOpacity]);

  return {
    scaleAnim,
    opacityAnim,
    slideAnim,
    fadeAnim,
    contentOpacity
  };
};

export default useModalAnimations;
