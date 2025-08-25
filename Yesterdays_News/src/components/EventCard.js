import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  COLORS, 
  TYPOGRAPHY, 
  SPACING, 
  LAYOUT,
  CATEGORY_ICONS, 
  CATEGORY_COLORS 
} from '../utils/constants';
import DateUtils from '../services/DateUtils';
import { truncateText } from '../utils/helpers';
import { useTranslation } from 'react-i18next';

/**
 * EventCard Component - Vintage Newspaper Style
 * Displays an individual historical event as a newspaper clipping.
 */
const EventCard = ({ event, onPress }) => {
  const { t } = useTranslation();
  const {
    year,
    title,
    description,
    category = 'event',
  } = event;

  const formattedYear = DateUtils.formatYear(year);
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.event;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.event;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(event)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <MaterialCommunityIcons name={categoryIcon} size={18} color={categoryColor} />
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {category}
          </Text>
        </View>
        <Text style={styles.yearText}>{formattedYear}</Text>
      </View>

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

      <View style={styles.footer}>
        <Text style={styles.readMoreText}>{t('card.readMore')}</Text>
        <MaterialCommunityIcons name="arrow-right-thin" size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const areEqual = (prevProps, nextProps) => {
  const a = prevProps.event;
  const b = nextProps.event;
  return (
    a.id === b.id &&
    a.year === b.year &&
    a.title === b.title &&
    a.description === b.description &&
    a.category === b.category
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginHorizontal: LAYOUT.pageMargin,
    marginVertical: SPACING.sm,
    borderRadius: LAYOUT.cardBorderRadius,
    padding: LAYOUT.cardPadding,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    ...TYPOGRAPHY.labelMedium,
    fontFamily: 'Lato_700Bold',
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  yearText: {
    ...TYPOGRAPHY.eventYear,
    fontFamily: 'Lato_700Bold',
    color: COLORS.textSecondary,
  },
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  readMoreText: {
    ...TYPOGRAPHY.labelSmall,
    fontFamily: 'Lato_700Bold',
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default React.memo(EventCard, areEqual);
