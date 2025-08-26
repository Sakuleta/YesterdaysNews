import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import HistoricalEventsAPI from '../services/HistoricalEventsAPI';

/**
 * NewspaperMasthead Component - Vintage Style
 * Displays the newspaper title in a classic, bold format.
 */
const NewspaperMasthead = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const languages = ['tr', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru'];
    const currentIndex = languages.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];
    
    // Notify parent component about language change first
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    
    // Clear cache when switching languages to get fresh content
    await HistoricalEventsAPI.clearLanguageCache();
    
    // Change language
    i18n.changeLanguage(newLang);
  };
  
  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`${t('app.title')} - ${t('app.subtitle')}`}
    >
      <View style={styles.masthead}>
        <Text 
          style={styles.newspaperTitle}
          accessible={true}
          accessibilityRole="text"
        >
          {t('app.title')}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.subHeader}>
        <Text 
          style={styles.subHeaderText}
          accessible={true}
          accessibilityRole="text"
        >
          {t('app.subtitle')}
        </Text>
        <TouchableOpacity 
          style={styles.languageToggle} 
          onPress={toggleLanguage}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('app.changeLanguage')}
          accessibilityHint={t('app.changeLanguageHint')}
        >
          <MaterialIcons name="language" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: LAYOUT.pageMargin,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    alignItems: 'center',
    overflow: 'hidden', // Ensure full-width dividers are visible
  },
  masthead: {
    width: '100%',
    height: 70, // Increased from 55 to accommodate potential two-line titles
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs, // Reduced from SPACING.sm to bring closer to divider
    position: 'relative',
  },
  newspaperTitle: {
    ...TYPOGRAPHY.masthead,
    textAlign: 'center',
    fontSize: 28, // Reduced from 32 to better fit longer titles
    minHeight: 60, // Increased from 50 to accommodate potential wrapping
    includeFontPadding: false, // Remove Android font padding for consistency
    textAlignVertical: 'center', // Center text vertically on Android
    flexShrink: 1, // Allow text to shrink if needed
    flexWrap: 'wrap', // Allow text to wrap if needed
    maxWidth: '100%', // Ensure text doesn't overflow
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: SPACING.xs / 2, // Reduced to bring closer to title
    marginHorizontal: -LAYOUT.pageMargin, // Extend beyond container padding
  },
  subHeader: {
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  subHeaderText: {
    ...TYPOGRAPHY.subheadline,
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  doubleDivider: {
    width: '100%',
    marginTop: SPACING.sm,
  },
  dividerThin: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerThick: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.borderDark,
    marginTop: 2,
  },
  languageToggle: {
    position: 'absolute',
    right: SPACING.md,
    padding: SPACING.xs,
    alignItems: 'center',
  },
});

export default NewspaperMasthead;
