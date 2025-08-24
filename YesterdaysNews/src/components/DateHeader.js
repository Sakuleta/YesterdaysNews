import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';
import DateUtils from '../services/DateUtils';

/**
 * DateHeader Component
 * Displays the current date and count of historical events found
 */
const DateHeader = ({ eventsCount = 0 }) => {
  const currentDate = DateUtils.getCurrentDateFormatted();
  const dayOfWeek = DateUtils.getCurrentDayOfWeek();

  return (
    <View style={styles.container}>
      <View style={styles.dateSection}>
        <MaterialIcons 
          name="calendar-today" 
          size={LAYOUT.iconSize} 
          color={COLORS.primary} 
          style={styles.calendarIcon}
        />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
      </View>
      
      <View style={styles.eventsCountSection}>
        <Text style={styles.eventsCountText}>
          {eventsCount > 0 ? (
            eventsCount === 1 ? 
              `${eventsCount} event found` : 
              `${eventsCount} events found`
          ) : (
            'Loading events...'
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: LAYOUT.screenPadding,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  calendarIcon: {
    marginRight: SPACING.sm,
  },
  dateTextContainer: {
    flex: 1,
  },
  dayOfWeek: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateText: {
    ...TYPOGRAPHY.header,
    marginTop: 2,
  },
  eventsCountSection: {
    marginTop: SPACING.sm,
  },
  eventsCountText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});

export default DateHeader;