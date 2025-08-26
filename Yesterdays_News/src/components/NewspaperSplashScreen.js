import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GearAnimation from './GearAnimation';
import NewspaperTexture from './NewspaperTexture';

const { width, height } = Dimensions.get('window');

const NewspaperSplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      // Logo fade in ve scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Metin fade in
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ];

    Animated.sequence(animations).start(() => {
      // 3 saniye sonra ana ekrana geç
      setTimeout(() => {
        onFinish();
      }, 3000);
    });
  }, []);

  return (
    <View style={styles.container} testID="newspaper-splash-container">
      {/* Arka plan gradient */}
      <LinearGradient
        colors={['#f4f1e8', '#e8e0d0', '#d4c4a8']}
        style={styles.background}
      />
      
      {/* Gazete dokusu overlay */}
      <NewspaperTexture />
      
      {/* Köşe tarihleri */}
      <View style={styles.cornerDates}>
        <Text style={[styles.cornerDate, { top: 20, left: 20 }]}>1899</Text>
        <Text style={[styles.cornerDate, { top: 20, right: 20 }]}>1923</Text>
        <Text style={[styles.cornerDate, { top: 60, left: 20 }]}>1945</Text>
        <Text style={[styles.cornerDate, { top: 60, right: 20 }]}>1969</Text>
        <Text style={[styles.cornerDate, { bottom: 60, left: 20 }]}>1989</Text>
        <Text style={[styles.cornerDate, { bottom: 60, right: 20 }]}>2001</Text>
      </View>
      
      {/* Küçük haber başlıkları */}
      <View style={styles.newsHeadlines}>
        <Text style={styles.headline}>BREAKING NEWS</Text>
        <Text style={styles.headline}>HISTORY</Text>
        <Text style={styles.headline}>DAILY</Text>
      </View>

      {/* Ana logo container */}
      <View style={styles.logoContainer}>
        {/* Dönen çarklar */}
        <View style={styles.gear1}>
          <GearAnimation size={80} color="#8B4513" rotationDuration={3000} />
        </View>
        
        <View style={styles.gear2}>
          <GearAnimation size={80} color="#8B4513" rotationDuration={2500} reverse={true} />
        </View>

        {/* Ana logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/android/res/mipmap-hdpi/adaptive-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Ana başlık */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: textAnim,
            transform: [{ translateY: textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })}],
          },
        ]}
      >
        <Text style={styles.mainTitle}>YESTERDAY'S NEWS</Text>
        <Text style={styles.subtitle}>Today's Current Events Are Truly Yesterday's News</Text>
      </Animated.View>

      {/* Alt bilgi */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Est. 2025</Text>
        <Text style={styles.footerText}>Historical Events Daily</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  cornerDates: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cornerDate: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#8B4513',
    opacity: 0.5,
  },
  newsHeadlines: {
    position: 'absolute',
    top: 40,
    right: 25,
    alignItems: 'flex-end',
  },
  headline: {
    fontSize: 9,
    fontFamily: 'Lato_700Bold',
    color: '#8B4513',
    opacity: 0.8,
    marginBottom: 15,
    transform: [{ rotate: '90deg' }],
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  gear1: {
    position: 'absolute',
    top: -40,
    left: -40,
  },
  gear2: {
    position: 'absolute',
    bottom: -40,
    right: -40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lato_400Regular_Italic',
    color: '#A0522D',
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: width * 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: 'Lato_400Regular',
    color: '#8B4513',
    opacity: 0.6,
    marginBottom: 2,
  },
});

export default NewspaperSplashScreen;
