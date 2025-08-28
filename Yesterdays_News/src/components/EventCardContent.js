import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';
import { truncateText } from '../utils/helpers';

/**
 * EventCardContent Component - Content section of EventCard
 * Displays event title and description
 */
const EventCardContent = ({ title, description }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.titleText}>
        {title}
      </Text>

      {description && description !== title && (
        <Text style={styles.descriptionText} numberOfLines={4}>
          {truncateText(description, 180)}
        </Text>
      )}
    </View>
  );
};

const styles = {
  content: {
    marginBottom: SPACING.md,
  },
  titleText: {
    ...TYPOGRAPHY.headlineSmall,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  descriptionText: {
    ...TYPOGRAPHY.bodyMedium,
    fontFamily: 'Lato_400Regular',
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
};

export default EventCardContent;
