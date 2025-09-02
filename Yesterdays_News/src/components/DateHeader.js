import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';
import DateUtils from '../services/DateUtils';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { getCurrentWeather } from '../services/WeatherService';

/**
 * DateHeader Component - Vintage Newspaper Style
 * Displays the current date in a classic newspaper format.
 */
const DateHeader = ({ eventsCount = 0, refreshTrigger = 0 }) => {
  const { t, i18n } = useTranslation();
  
  // Set moment locale based on current app language
  moment.locale(i18n.language);
  
  const currentDate = moment().format('MMMM D, YYYY');
  const dayOfWeek = moment().format('dddd');

  const [weather, setWeather] = useState({ icon: 'weather-cloudy', translationKey: 'weather.overcast' });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Use forceRefresh when refreshTrigger changes (pull-to-refresh)
        // Use isInitialLoad for first app load to get fresher data
        const result = await getCurrentWeather(refreshTrigger > 0, isFirstLoad);
        if (isMounted && result) {
          setWeather({
            icon: result.icon || 'weather-cloudy',
            translationKey: result.translationKey || 'weather.overcast',
          });
          // Mark that first load is complete
          if (isFirstLoad) {
            setIsFirstLoad(false);
          }
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        // Keep existing weather or fallback to default
        if (isMounted && (!weather.icon || weather.icon === 'weather-cloudy')) {
          setWeather({
            icon: 'weather-sunny', // Default to sunny as user mentioned
            translationKey: 'weather.sunny',
          });
        }
      }
    })();
    return () => { isMounted = false; };
  }, [refreshTrigger, weather.icon, isFirstLoad]);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`${dayOfWeek}, ${currentDate}`}
      accessibilityHint={`${eventsCount} historical events available today`}
    >
      <View style={styles.topRow}>
        <Text
          style={styles.dayOfWeek}
          accessible={true}
          accessibilityRole="text"
        >
          {dayOfWeek}
        </Text>
        <View
          style={styles.weatherSection}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Weather: ${t(weather.translationKey)}`}
        >
          <MaterialCommunityIcons name={weather.icon} size={16} color={COLORS.textSecondary} />
          <Text style={styles.weatherText}>{t(weather.translationKey)}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text
          style={styles.dateText}
          accessible={true}
          accessibilityRole="text"
        >
          {currentDate}
        </Text>
        <Text
          style={styles.eventsCountText}
          accessible={true}
          accessibilityRole="text"
        >
          {eventsCount > 0 ? t('date.storiesToday', { count: eventsCount }) : t('date.loading')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: LAYOUT.pageMargin,
    paddingVertical: SPACING.md,
    borderBottomWidth: LAYOUT.headerBorderWidth,
    borderBottomColor: COLORS.borderDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dayOfWeek: {
    ...TYPOGRAPHY.dateHeader,
    fontSize: 12,
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    color: COLORS.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateText: {
    ...TYPOGRAPHY.headlineSmall,
    fontFamily: 'Lato_400Regular, system-ui',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
  },
  eventsCountText: {
    ...TYPOGRAPHY.byline,
    fontFamily: 'Lato_400Regular_Italic',
    color: COLORS.textSecondary,
  },
});

export default DateHeader;
