import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, SHADOWS } from '../utils/constants';

/**
 * NewspaperPage Component
 * Creates a realistic newspaper page layout with fold effects
 */
const NewspaperPage = ({ children, pageNumber = 1, totalPages = 1 }) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [foldPosition, setFoldPosition] = useState(screenData.height * 0.6);

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
      setFoldPosition(result.window.height * 0.6);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.pageContainer}>
      {/* Paper texture background */}
      <LinearGradient
        colors={[COLORS.paperBackground, COLORS.paperYellow, COLORS.paperBackground]}
        style={styles.paperBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Newspaper content */}
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          // Update fold position based on scroll
          const scrollY = event.nativeEvent.contentOffset.y;
          setFoldPosition(screenData.height * 0.6 + scrollY * 0.1);
        }}
        scrollEventThrottle={16}
      >
        {children}
        
        {/* Page footer */}
        <View style={styles.pageFooter}>
          <View style={styles.footerBorder} />
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Yesterday's News Historical Chronicle</Text>
            <Text style={styles.pageNumber}>Page {pageNumber} of {totalPages}</Text>
            <Text style={styles.footerText}>www.yesterdaysnews.app</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Paper shadow edges */}
      <LinearGradient
        colors={['transparent', COLORS.shadow, 'transparent']}
        style={styles.leftShadow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      
      <LinearGradient
        colors={['transparent', COLORS.shadow, 'transparent']}
        style={styles.rightShadow}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
      />
    </View>
  );
};

/**
 * NewspaperSection Component
 * Creates distinct sections within the newspaper
 */
export const NewspaperSection = ({ title, children, icon }) => {
  return (
    <View style={styles.sectionContainer}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionBorder} />
        <View style={styles.sectionTitleContainer}>
          {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionBorder} />
      </View>
      
      {/* Section content */}
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.paperBackground,
    position: 'relative',
  },
  
  paperBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: SPACING.sm,
  },
  
  foldLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: LAYOUT.foldLineHeight,
    backgroundColor: COLORS.foldLine,
    opacity: 0.3,
    ...SHADOWS.foldShadow,
  },
  
  leftShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 10,
    pointerEvents: 'none',
  },
  
  rightShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 10,
    pointerEvents: 'none',
  },
  
  pageFooter: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    paddingHorizontal: LAYOUT.pageMargin,
  },
  
  footerBorder: {
    height: 2,
    backgroundColor: COLORS.headlineBlack,
    marginBottom: SPACING.sm,
  },
  
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  footerText: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
  },
  
  pageNumber: {
    ...TYPOGRAPHY.byline,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Section styles
  sectionContainer: {
    marginVertical: LAYOUT.sectionSpacing,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: LAYOUT.pageMargin,
  },
  
  sectionBorder: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.headlineBlack,
  },
  
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paperBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  
  sectionIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.sectionHeader,
  },
  
  sectionContent: {
    // Content will be styled by child components
  },
});

export default NewspaperPage;