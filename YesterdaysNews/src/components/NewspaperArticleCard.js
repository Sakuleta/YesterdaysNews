import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Animated } from 'react-native';
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
 * NewspaperArticleCard Component
 * Displays historical events in newspaper column style
 */
const NewspaperArticleCard = ({ event, isHeadline = false, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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

  const containerStyle = isHeadline ? styles.headlineContainer : styles.articleContainer;
  const titleStyle = isHeadline ? styles.headlineTitle : styles.articleTitle;
  const textStyle = isHeadline ? styles.headlineText : styles.articleText;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={containerStyle}
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Article header with year and category */}
        <View style={styles.articleHeader}>
          <View style={styles.yearBadge}>
            <Text style={styles.categoryIcon}>{categoryIcon}</Text>
            <Text style={[styles.yearText, { color: categoryColor }]}>
              {formattedYear}
            </Text>
          </View>
          
          {links.length > 0 && (
            <View style={styles.linkIndicator}>
              <MaterialIcons 
                name="library-books" 
                size={14} 
                color={COLORS.inkGray} 
              />
              <Text style={styles.linkCount}>{links.length}</Text>
            </View>
          )}
        </View>

        {/* Newspaper-style title */}
        <Text style={titleStyle} numberOfLines={isHeadline ? 3 : 2}>
          {title}
        </Text>
        
        {/* Article text in columns */}
        <Text style={textStyle} numberOfLines={isHeadline ? 6 : 4}>
          {truncateText(description, isHeadline ? 250 : 150)}
        </Text>

        {/* Article footer */}
        <View style={styles.articleFooter}>
          <Text style={styles.byline}>Historical Chronicle Desk</Text>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryLabel, { color: categoryColor }]}>
              {category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Newspaper column separator */}
        <View style={[styles.columnSeparator, { backgroundColor: categoryColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Headline article (main story)
  headlineContainer: {
    backgroundColor: COLORS.paperBackground,
    marginHorizontal: LAYOUT.pageMargin,
    marginVertical: LAYOUT.articleSpacing,
    padding: LAYOUT.sectionSpacing,
    borderWidth: 2,
    borderColor: COLORS.headlineBlack,
    ...SHADOWS.paperShadow,
  },
  
  // Regular article
  articleContainer: {
    backgroundColor: COLORS.paperYellow,
    marginHorizontal: LAYOUT.pageMargin,
    marginVertical: LAYOUT.articleSpacing / 2,
    padding: LAYOUT.columnGap,
    borderWidth: 1,
    borderColor: COLORS.foldLine,
    ...SHADOWS.foldShadow,
    position: 'relative',
  },
  
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.foldLine,
  },
  
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paperBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: LAYOUT.borderRadius,
  },
  
  categoryIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  
  yearText: {
    ...TYPOGRAPHY.byline,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  linkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  linkCount: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
    marginLeft: SPACING.xs / 2,
  },
  
  // Headlines
  headlineTitle: {
    ...TYPOGRAPHY.headline,
    marginBottom: SPACING.md,
    textAlign: 'left',
    ...SHADOWS.textShadow,
  },
  
  headlineText: {
    ...TYPOGRAPHY.bodyText,
    fontSize: 15,
    marginBottom: SPACING.md,
    columnCount: 2,
    columnGap: SPACING.md,
  },
  
  // Regular articles
  articleTitle: {
    ...TYPOGRAPHY.subheadline,
    fontSize: 16,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  
  articleText: {
    ...TYPOGRAPHY.columnText,
    marginBottom: SPACING.sm,
  },
  
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.foldLine,
  },
  
  byline: {
    ...TYPOGRAPHY.byline,
    fontSize: 10,
  },
  
  categoryBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    backgroundColor: COLORS.paperBackground,
    borderRadius: 2,
  },
  
  categoryLabel: {
    ...TYPOGRAPHY.byline,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  columnSeparator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});

export default NewspaperArticleCard;