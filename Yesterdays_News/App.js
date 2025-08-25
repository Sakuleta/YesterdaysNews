import React from 'react';
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

// Utils
import { COLORS } from './src/utils/constants';
import './src/i18n';

/**
 * Yesterday's News - Main Application Component
 * A single-screen mobile app that displays historical events
 * that occurred on the current date in previous years
 */
export default function App() {
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
  });

  if (!fontsLoaded) {
    // You can return a loading indicator here
    return null;
  }

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
});
