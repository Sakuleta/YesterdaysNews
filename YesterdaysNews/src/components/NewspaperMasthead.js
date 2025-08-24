import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, LAYOUT, SHADOWS, SPACING } from '../utils/constants';
import DateUtils from '../services/DateUtils';

/**
 * NewspaperMasthead Component
 * Displays the newspaper header with vintage styling
 */
const NewspaperMasthead = ({ eventsCount = 0 }) => {
  const currentDate = DateUtils.getCurrentDateFormatted();
  const dayOfWeek = DateUtils.getCurrentDayOfWeek();
  
  return (
    <View style={styles.container}>
      {/* Top border line */}
      <View style={styles.topBorder} />
      
      {/* Main masthead */}
      <View style={styles.mastheadContainer}>
        <View style={styles.headerRow}>
          <View style={styles.leftSection}>
            <Text style={styles.issue}>Vol. 2025</Text>
            <Text style={styles.issue}>No. 235</Text>
          </View>
          
          <View style={styles.centerSection}>
            <Text style={styles.newspaperTitle} numberOfLines={1} adjustsFontSizeToFit={true}>YESTERDAY'S NEWS</Text>
            <Text style={styles.tagline}>Historical Events Daily Chronicle</Text>
          </View>
          
          <View style={styles.rightSection}>
            <Text style={styles.weather}>☀️ Sunny</Text>
            <Text style={styles.price}>Free Edition</Text>
          </View>
        </View>
        
        {/* Date and location line */}
        <View style={styles.dateLocationRow}>
          <Text style={styles.location}>📍 Global Edition</Text>
          <Text style={styles.currentDate}>{dayOfWeek}, {currentDate}</Text>
          <Text style={styles.pages}>{eventsCount} Stories</Text>
        </View>
      </View>
      
      {/* Double border line */}
      <View style={styles.doubleBorder}>
        <View style={styles.borderLine} />
        <View style={styles.borderLine} />
      </View>
      
      {/* Breaking news ticker */}
      <View style={styles.breakingNews}>
        <MaterialIcons name="fiber-manual-record" size={8} color={COLORS.politics} />
        <Text style={styles.breakingText}>
          BREAKING: Discover what happened on this day throughout history • 
          Events spanning over 2000 years of human civilization •
        </Text>
        <MaterialIcons name="fiber-manual-record" size={8} color={COLORS.politics} />
      </View>
      
      {/* Bottom border */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.paperBackground,
    paddingHorizontal: LAYOUT.pageMargin,
    paddingTop: SPACING.md,
    ...SHADOWS.paperShadow,
  },
  
  topBorder: {
    height: LAYOUT.headerBorderWidth,
    backgroundColor: COLORS.headlineBlack,
    marginBottom: SPACING.md,
  },
  
  mastheadContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  
  issue: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
    color: COLORS.inkGray,
  },
  
  newspaperTitle: {
    ...TYPOGRAPHY.masthead,
    textAlign: 'center',
    marginBottom: 2,
    ...SHADOWS.textShadow,
    flexShrink: 0,
    numberOfLines: 1,
  },
  
  tagline: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  weather: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
  },
  
  price: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  dateLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.sm,
  },
  
  location: {
    ...TYPOGRAPHY.byline,
    fontSize: 11,
  },
  
  currentDate: {
    ...TYPOGRAPHY.dateHeader,
    fontWeight: 'bold',
  },
  
  pages: {
    ...TYPOGRAPHY.byline,
    fontSize: 11,
  },
  
  doubleBorder: {
    marginVertical: SPACING.sm,
  },
  
  borderLine: {
    height: 1,
    backgroundColor: COLORS.headlineBlack,
    marginVertical: 2,
  },
  
  breakingNews: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paperYellow,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.politics,
  },
  
  breakingText: {
    ...TYPOGRAPHY.byline,
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: SPACING.xs,
    flex: 1,
  },
  
  bottomBorder: {
    height: LAYOUT.headerBorderWidth,
    backgroundColor: COLORS.headlineBlack,
    marginTop: SPACING.sm,
  },
});

export default NewspaperMasthead;