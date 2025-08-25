import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'moment/locale/tr';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/ru';
// Removed ar/zh/ja for now

// Minimal base translations; extend as needed
import tr from './locales/tr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
// Removed ar/zh/ja resource imports for now

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
};

const SUPPORTED_LANGUAGES = ['en','tr','es','fr','de','it','pt','ru'];

const resolveInitialLanguage = () => {
  try {
    if (typeof Localization.getLocales === 'function') {
      const locales = Localization.getLocales();
      if (Array.isArray(locales) && locales.length > 0) {
        const first = locales[0];
        // Prefer languageCode (e.g., 'tr'), fallback to languageTag (e.g., 'tr-TR')
        let code = first.languageCode || (first.languageTag ? first.languageTag.split('-')[0] : undefined);
        if (code && SUPPORTED_LANGUAGES.includes(code)) return code;
        // Fallback to en if device locale is not supported (e.g., ja/ar/zh)
        return 'en';
      }
    }
    // Back-compat: some SDKs expose 'locale' as a string like 'tr-TR'
    if (typeof Localization.locale === 'string' && Localization.locale.length > 0) {
      return Localization.locale.split('-')[0];
    }
  } catch (_) {
    // ignore and fallback
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: resolveInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;

