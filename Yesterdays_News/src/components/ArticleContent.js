import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import DateUtils from '../services/DateUtils';

/**
 * ArticleContent Component - Main content area of the modal
 * Displays headline, byline information, and article body
 */
const ArticleContent = ({ event, contentOpacity, slideAnim }) => {
  const { t } = useTranslation();

  if (!event) return null;

  const {
    year,
    title,
    description,
    category = 'event',
    source,
  } = event;

  const formattedYear = DateUtils.formatYear(year);
  const categoryColor = COLORS.primary; // You can map category to color if needed

  return (
    <View style={styles.articleContent}>
      {/* Modern headline */}
      <View style={styles.headlineContainer}>
        <Text style={styles.headline} numberOfLines={0}>
          {title}
        </Text>
      </View>

      {/* Modern byline */}
      <View style={styles.bylineSection}>
        <View style={styles.bylineContent}>
          <View style={styles.bylineRow}>
            <MaterialIcons name="edit" size={16} color={categoryColor} />
            <Text style={styles.bylineText}>{t('modal.by')}</Text>
          </View>
          <View style={styles.bylineRow}>
            <MaterialIcons name="schedule" size={16} color={COLORS.textSecondary} />
            <Text style={styles.datelineText}>
              {t('modal.originally', { year: formattedYear })}
            </Text>
          </View>
        </View>
      </View>

      {/* Modern article body */}
      <View style={styles.articleBody}>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      {/* Bottom spacer */}
      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = {
  articleContent: {
    padding: LAYOUT.cardPadding,
    paddingTop: SPACING.lg,
  },

  headlineContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },

  headline: {
    ...TYPOGRAPHY.headlineLarge,
    textAlign: 'center',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },

  bylineSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
  },

  bylineContent: {
    position: 'relative',
  },

  bylineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  bylineText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    marginLeft: SPACING.sm,
    color: COLORS.textPrimary,
  },

  datelineText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.sm,
    color: COLORS.textSecondary,
  },

  articleBody: {
    marginBottom: SPACING.md,
  },

  description: {
    ...TYPOGRAPHY.bodyLarge,
    lineHeight: 24,
    textAlign: 'left',
    color: COLORS.textSecondary,
  },

  bottomSpacer: {
    height: SPACING.md,
  },
};

export default ArticleContent;
