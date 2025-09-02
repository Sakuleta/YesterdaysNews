import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import useLanguageManager from '../hooks/useLanguageManager';

/**
 * NewspaperMasthead Component - Vintage Style
 * Displays the newspaper title in a classic, bold format.
 * Now uses useLanguageManager hook for language switching logic.
 */
const NewspaperMasthead = ({ onLanguageChange, isLoading = false }) => {
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useLanguageManager(onLanguageChange);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageSelect = async (languageCode) => {
    await changeLanguage(languageCode);
    setShowLanguageModal(false);
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === i18n.language && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text style={styles.languageFlag}>{item.flag}</Text>
      <Text style={[
        styles.languageName,
        item.code === i18n.language && styles.selectedLanguageName
      ]}>
        {item.name}
      </Text>
      {item.code === i18n.language && (
        <MaterialIcons name="check" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

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
          style={[
            styles.languageToggle,
            isLoading && styles.languageToggleDisabled
          ]}
          onPress={() => !isLoading && setShowLanguageModal(true)}
          disabled={isLoading}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isLoading ? t('app.languageLoading') : t('app.selectLanguage')}
          accessibilityHint={isLoading ? t('app.languageLoadingHint') : `${t('app.selectLanguage')} - ${currentLanguage.name}`}
        >
          <Text style={[
            styles.currentLanguageFlag,
            isLoading && styles.languageFlagDisabled
          ]}>{currentLanguage.flag}</Text>
          <MaterialIcons
            name={isLoading ? "hourglass-empty" : "expand-more"}
            size={20}
            color={isLoading ? COLORS.textDisabled : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('app.selectLanguage')}</Text>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.languageListContainer}
              scrollEnabled={false} // Disable scrolling to force all items to fit
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguageFlag: {
    fontSize: 16,
    marginRight: SPACING.xs / 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    backgroundColor: COLORS.background,
    borderRadius: LAYOUT.borderRadius,
    margin: SPACING.xl,
    width: '80%',
    maxWidth: 300,
    maxHeight: '90%', // Further increased to ensure all languages fit
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.headlineSmall,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 50, // Ensure consistent item height
  },
  selectedLanguageItem: {
    backgroundColor: COLORS.primary + '10',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  languageName: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    flex: 1,
  },
  selectedLanguageName: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  languageToggleDisabled: {
    opacity: 0.5,
  },
  languageFlagDisabled: {
    opacity: 0.5,
  },
  languageListContainer: {
    flexGrow: 1, // Allow the list to grow to fit content
  },
});

export default NewspaperMasthead;
