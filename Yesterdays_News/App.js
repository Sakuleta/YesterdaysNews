import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { 
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { 
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold 
} from '@expo-google-fonts/lato';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import NewspaperSplashScreen from './src/components/NewspaperSplashScreen';

// Utils
import { COLORS } from './src/utils/constants';
import './src/i18n';

/**
 * Yesterday's News - Main Application Component
 * A single-screen mobile app that displays historical events
 * that occurred on the current date in previous years
 */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
  });

  // Fontlar yüklenene kadar loading göster
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor={COLORS.background} 
        />
        {/* Basit loading ekranı */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Splash screen göster
  if (showSplash) {
    return (
      <NewspaperSplashScreen onFinish={() => setShowSplash(false)} />
    );
  }

  // Ana ekran
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor={COLORS.background} 
      />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: 'Lato_400Regular',
  },
});
