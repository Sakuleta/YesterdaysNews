import React from 'react';
import { View, StyleSheet } from 'react-native';

const NewspaperTexture = () => {
  // Gazete dokusu için çizgiler oluştur
  const createLines = () => {
    const lines = [];
    for (let i = 0; i < 50; i++) {
      lines.push(
        <View
          key={i}
          style={[
            styles.line,
            {
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              width: Math.random() * 100 + 50,
              opacity: Math.random() * 0.1 + 0.05,
            },
          ]}
        />
      );
    }
    return lines;
  };

  // Gazete lekeleri oluştur
  const createStains = () => {
    const stains = [];
    for (let i = 0; i < 20; i++) {
      stains.push(
        <View
          key={i}
          style={[
            styles.stain,
            {
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              opacity: Math.random() * 0.15 + 0.05,
            },
          ]}
        />
      );
    }
    return stains;
  };

  return (
    <View style={styles.container}>
      {/* Ana dokusu overlay */}
      <View style={styles.mainTexture} />
      
      {/* Rastgele çizgiler */}
      {createLines()}
      
      {/* Rastgele lekeler */}
      {createStains()}
      
      {/* Köşe yıpranma efekti */}
      <View style={styles.cornerWear} />
      <View style={styles.cornerWear2} />
      <View style={styles.cornerWear3} />
      <View style={styles.cornerWear4} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  mainTexture: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(139, 69, 19, 0.03)',
    opacity: 0.4,
  },
  line: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#8B4513',
    borderRadius: 0.5,
  },
  stain: {
    position: 'absolute',
    backgroundColor: '#8B4513',
    borderRadius: 50,
  },
  cornerWear: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#8B4513',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cornerWear2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    shadowColor: '#8B4513',
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cornerWear3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    shadowColor: '#8B4513',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cornerWear4: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    shadowColor: '#8B4513',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default NewspaperTexture;
