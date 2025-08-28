import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import HistoricalEventsAPI from '../services/HistoricalEventsAPI';

/**
 * Custom hook for language management
 * Handles language switching and cache clearing
 */
export const useLanguageManager = (onLanguageChange) => {
  const { i18n } = useTranslation();

  const toggleLanguage = useCallback(async () => {
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
  }, [i18n, onLanguageChange]);

  const changeLanguage = useCallback(async (newLang) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Clear cache when switching languages to get fresh content
    await HistoricalEventsAPI.clearLanguageCache();

    // Change language
    i18n.changeLanguage(newLang);
  }, [i18n, onLanguageChange]);

  return {
    toggleLanguage,
    changeLanguage,
    currentLanguage: i18n.language,
    languages: ['tr', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru']
  };
};

export default useLanguageManager;
