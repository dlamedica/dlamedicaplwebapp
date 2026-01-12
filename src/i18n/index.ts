import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationPL from '../locales/pl/translation.json';
import translationEN from '../locales/en/translation.json';
import translationUK from '../locales/uk/translation.json';

const resources = {
  pl: {
    translation: translationPL
  },
  en: {
    translation: translationEN
  },
  uk: {
    translation: translationUK
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    debug: false,

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'dlamedica_language'
    }
  });

export default i18n;
