import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/constants';
import { useTranslation } from 'react-i18next';

/**
 * EventCardFooter Component - Footer section of EventCard
 * Displays visible source attribution and a "Read More" affordance
 */
const EventCardFooter = ({ source, linkUrl }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      {source ? (
        <View style={styles.sourceContainer} accessibilityRole="text" accessible={true}>
          <MaterialCommunityIcons name="source-branch" size={14} color={COLORS.textSecondary} />
          <Text style={styles.sourceText} numberOfLines={1}>
            {source}
          </Text>
        </View>
      ) : <View />}
      <View style={styles.readMoreContainer} accessibilityRole="text" accessible={true}>
        <Text style={styles.readMoreText}>{t('card.readMore')}</Text>
        <MaterialCommunityIcons name="arrow-right-thin" size={16} color={COLORS.textSecondary} />
      </View>
    </View>
  );
};

const styles = {
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  sourceText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    maxWidth: '80%',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    ...TYPOGRAPHY.labelSmall,
    fontFamily: 'Lato_700Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};

export default EventCardFooter;
