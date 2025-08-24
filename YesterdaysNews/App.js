import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';

// Utils
import { COLORS } from './src/utils/constants';

/**
 * Yesterday's News - Main Application Component
 * A single-screen mobile app that displays historical events
 * that occurred on the current date in previous years
 */
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
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
