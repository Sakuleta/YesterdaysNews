import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import DateUtils from '../services/DateUtils';
import { cardStyles, textStyles } from '../styles/commonStyles';

/**
 * EventCardHeader Component - Header section of EventCard
 * Displays category icon, category name, and formatted year
 */
const EventCardHeader = ({ year, category = 'event' }) => {
  const formattedYear = DateUtils.formatYear(year);
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.event;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.event;

  return (
    <View style={cardStyles.header}>
      <View style={styles.categoryContainer}>
        <MaterialCommunityIcons name={categoryIcon} size={18} color={categoryColor} />
        <Text style={[textStyles.category, { color: categoryColor }]}>
          {category}
        </Text>
      </View>
      <Text style={textStyles.year}>{formattedYear}</Text>
    </View>
  );
};

const styles = {
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default EventCardHeader;
