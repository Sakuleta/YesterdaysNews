import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const GearAnimation = ({ size = 80, color = '#8B4513', rotationDuration = 2000, reverse = false }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: rotationDuration,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ['0deg', '-360deg'] : ['0deg', '360deg'],
  });

  // Çark dişlerini oluştur
  const createGearTeeth = () => {
    const teeth = [];
    const toothCount = 12;
    const toothLength = size * 0.25;
    const toothWidth = size * 0.05;

    for (let i = 0; i < toothCount; i++) {
      const angle = (i * 360) / toothCount;
      const radius = size / 2;
      
      teeth.push(
        <View
          key={i}
          style={[
            styles.gearTooth,
            {
              width: toothWidth,
              height: toothLength,
              backgroundColor: color,
              transform: [
                { translateX: radius - toothWidth / 2 },
                { translateY: -toothLength / 2 },
                { rotate: `${angle}deg` },
              ],
            },
          ]}
        />
      );
    }
    return teeth;
  };

  return (
    <Animated.View
      style={[
        styles.gear,
        {
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      {/* Çark dişleri */}
      {createGearTeeth()}
      
      {/* Merkez daire */}
      <View
        style={[
          styles.gearCenter,
          {
            width: size * 0.3,
            height: size * 0.3,
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gear: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gearTooth: {
    position: 'absolute',
    borderRadius: 2,
  },
  gearCenter: {
    borderRadius: 50,
  },
});

export default GearAnimation;
