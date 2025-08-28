import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import LinkSecurityManager from '../services/LinkSecurityManager';

/**
 * LinksSection Component - Related links section
 * Displays related links with security checks
 */
const LinksSection = ({ links, categoryColor, source }) => {
  const { t } = useTranslation();

  const handleLinkPress = (link) => {
    LinkSecurityManager.handleLinkPress(link);
  };

  // Function to shorten long titles
  const shortenTitle = (title) => {
    if (title.length <= 25) return title;
    
    // Try to find a good breaking point
    const words = title.split('_');
    if (words.length > 1) {
      // If it's snake_case, take first two words
      return words.slice(0, 2).join('_');
    }
    
    // If it's too long, truncate and add ellipsis
    return title.substring(0, 22) + '...';
  };

  if (!links || links.length === 0) {
    return (
      <View style={styles.noLinksContainer}>
        <MaterialIcons name="info-outline" size={16} color={COLORS.textTertiary} />
        <Text style={styles.noLinksText}>
          {source === 'Wikipedia'
            ? t('modal.noRelatedSources')
            : t('modal.noRelatedSourcesForSource', { source: source || 'this source' })
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.linksSection}>
      <View style={styles.linksSectionHeader}>
        <MaterialIcons name="library-books" size={20} color={categoryColor} />
        <Text style={[styles.linksSectionTitle, { color: categoryColor }]}>
          {t('modal.related')}
        </Text>
      </View>

      {links.map((link, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.linkItem, { borderLeftColor: categoryColor }]}
          onPress={() => handleLinkPress(link)}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Open ${link.title}`}
        >
          <View style={styles.linkItemContent}>
            <MaterialIcons name="article" size={16} color={categoryColor} />
            <Text style={styles.linkText} numberOfLines={1}>
              {shortenTitle(link.title)}
            </Text>
            <MaterialIcons name="open-in-new" size={16} color={categoryColor} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  linksSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: LAYOUT.cardPadding,
  },

  linksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  linksSectionTitle: {
    ...TYPOGRAPHY.headlineSmall,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },

  linkItem: {
    marginBottom: SPACING.md,
    borderRadius: LAYOUT.borderRadius,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
  },

  linkItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },

  linkText: {
    ...TYPOGRAPHY.bodyMedium,
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  noLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: LAYOUT.borderRadius,
    marginTop: SPACING.md,
    marginHorizontal: LAYOUT.cardPadding,
  },

  noLinksText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.sm,
    color: COLORS.textTertiary,
  },
};

export default LinksSection;
