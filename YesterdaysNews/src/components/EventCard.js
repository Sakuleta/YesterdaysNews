import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  COLORS, 
  TYPOGRAPHY, 
  SPACING, 
  LAYOUT, 
  SHADOWS, 
  CATEGORY_ICONS, 
  CATEGORY_COLORS 
} from '../utils/constants';
import DateUtils from '../services/DateUtils';
import { truncateText } from '../utils/helpers';

/**
 * EventCard Component
 * Displays an individual historical event with year, title, description, and links
 */
const EventCard = ({ event, onPress }) => {
  const {
    year,
    title,
    description,
    category = 'event',
    links = []
  } = event;

  const formattedYear = DateUtils.formatYear(year);
  const categoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.event;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.event;

  const handleLinkPress = async (link) => {
    try {
      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open this link');
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(event);
    } else if (links.length > 0) {
      handleLinkPress(links[0]);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.yearContainer}>
          <Text style={styles.categoryIcon}>{categoryIcon}</Text>
          <Text style={[styles.yearText, { color: categoryColor }]}>
            {formattedYear}
          </Text>
        </View>
        
        {links.length > 0 && (
          <MaterialIcons 
            name="open-in-new" 
            size={16} 
            color={COLORS.textLight} 
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        
        {description && description !== title && (
          <Text style={styles.descriptionText} numberOfLines={3}>
            {truncateText(description, 150)}
          </Text>
        )}
      </View>

      {links.length > 1 && (
        <View style={styles.linksContainer}>
          <Text style={styles.linksLabel}>Related articles:</Text>
          {links.slice(0, 2).map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkItem}
              onPress={() => handleLinkPress(link)}
            >
              <MaterialIcons 
                name="article" 
                size={14} 
                color={COLORS.primary} 
              />
              <Text style={styles.linkText} numberOfLines={1}>
                {truncateText(link.title, 40)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.categoryBorder, { backgroundColor: categoryColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: LAYOUT.screenPadding,
    marginVertical: LAYOUT.cardMargin,
    borderRadius: LAYOUT.cardBorderRadius,
    padding: LAYOUT.cardPadding,
    ...SHADOWS.card,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  yearText: {
    ...TYPOGRAPHY.eventYear,
    fontWeight: '700',
  },
  content: {
    marginBottom: SPACING.sm,
  },
  titleText: {
    ...TYPOGRAPHY.eventTitle,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  descriptionText: {
    ...TYPOGRAPHY.eventDescription,
    lineHeight: 20,
  },
  linksContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  linksLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  linkText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    flex: 1,
    textDecorationLine: 'underline',
  },
  categoryBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: LAYOUT.cardBorderRadius,
    borderBottomLeftRadius: LAYOUT.cardBorderRadius,
  },
});

export default EventCard;