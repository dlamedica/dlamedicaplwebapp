/**
 * Language Context
 * Zaawansowany kontekst do zarządzania językiem i tłumaczeniami
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  SupportedLanguage,
  LanguageConfig,
  LanguageContextType,
  UserLanguagePreferences,
  SUPPORTED_LANGUAGES,
  DEFAULT_PREFERENCES,
  InterpolationOptions,
  TranslationFile
} from './types';
import {
  getInitialLanguage,
  saveLanguage,
  getUserPreferences,
  saveUserPreferences,
  isValidLanguage,
  getNestedValue,
  interpolate,
  formatDateLocalized,
  formatNumberLocalized,
  formatCurrencyLocalized,
  formatRelativeTimeLocalized,
  updateDocumentLanguage
} from './utils';

// Import tłumaczeń
import plTranslations from './locales/pl.json';
import enTranslations from './locales/en.json';
import ukTranslations from './locales/uk.json';

// Mapa tłumaczeń
const translations: Record<SupportedLanguage, TranslationFile> = {
  pl: plTranslations,
  en: enTranslations,
  uk: ukTranslations
};

// Domyślna wartość kontekstu
const defaultContext: LanguageContextType = {
  language: 'pl',
  languageConfig: SUPPORTED_LANGUAGES.pl,
  setLanguage: () => {},
  t: (key) => key,
  isLanguageSupported: isValidLanguage,
  availableLanguages: Object.values(SUPPORTED_LANGUAGES),
  formatDate: () => '',
  formatNumber: () => '',
  formatCurrency: () => '',
  formatRelativeTime: () => '',
  locale: 'pl-PL',
  direction: 'ltr',
  isLoading: false,
  userPreferences: DEFAULT_PREFERENCES,
  updatePreferences: () => {}
};

// Tworzenie kontekstu
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Props providera
interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

/**
 * Provider kontekstu języka
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage,
  onLanguageChange
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (defaultLanguage && isValidLanguage(defaultLanguage)) {
      return defaultLanguage;
    }
    return getInitialLanguage();
  });

  const [userPreferences, setUserPreferences] = useState<UserLanguagePreferences>(() =>
    getUserPreferences()
  );

  const [isLoading, setIsLoading] = useState(false);

  // Aktualna konfiguracja języka
  const languageConfig = useMemo(() => SUPPORTED_LANGUAGES[language], [language]);

  // Lista dostępnych języków
  const availableLanguages = useMemo(() => Object.values(SUPPORTED_LANGUAGES), []);

  // Locale string
  const locale = useMemo(() => {
    switch (language) {
      case 'pl': return 'pl-PL';
      case 'en': return 'en-US';
      case 'uk': return 'uk-UA';
      default: return 'pl-PL';
    }
  }, [language]);

  // Kierunek tekstu
  const direction = useMemo(() => languageConfig.direction, [languageConfig]);

  // Aktualizuj atrybut lang na document przy zmianie języka
  useEffect(() => {
    updateDocumentLanguage(language);
  }, [language]);

  // Funkcja zmiany języka
  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    if (!isValidLanguage(newLang)) {
      console.warn(`Language "${newLang}" is not supported`);
      return;
    }

    setIsLoading(true);

    // Zapisz do localStorage jeśli użytkownik chce zapamiętać
    if (userPreferences.rememberChoice) {
      saveLanguage(newLang);
    }

    setLanguageState(newLang);

    // Callback dla rodzica
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Symulacja krótkiego opóźnienia dla płynniejszego UX
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [userPreferences.rememberChoice, onLanguageChange]);

  // Funkcja tłumaczenia
  const t = useCallback((key: string, options?: InterpolationOptions): string => {
    const translation = getNestedValue(translations[language], key);

    if (translation === undefined) {
      // Fallback do polskiego
      const fallback = getNestedValue(translations.pl, key);
      if (fallback !== undefined) {
        console.warn(`Translation missing for "${key}" in "${language}", using Polish fallback`);
        return interpolate(fallback, options);
      }

      // Zwróć klucz jeśli nie znaleziono tłumaczenia
      console.warn(`Translation not found for key: "${key}"`);
      return key;
    }

    return interpolate(translation, options);
  }, [language]);

  // Funkcje formatowania
  const formatDate = useCallback((date: Date | string, format?: string): string => {
    return formatDateLocalized(date, language, format);
  }, [language]);

  const formatNumber = useCallback((num: number, decimals?: number): string => {
    return formatNumberLocalized(num, language, decimals);
  }, [language]);

  const formatCurrency = useCallback((amount: number, currencyCode?: string): string => {
    return formatCurrencyLocalized(amount, language, currencyCode);
  }, [language]);

  const formatRelativeTime = useCallback((date: Date | string): string => {
    return formatRelativeTimeLocalized(date, language);
  }, [language]);

  // Aktualizacja preferencji
  const updatePreferences = useCallback((prefs: Partial<UserLanguagePreferences>) => {
    const newPrefs = { ...userPreferences, ...prefs };
    setUserPreferences(newPrefs);
    saveUserPreferences(newPrefs);

    // Jeśli zmieniono preferowany język, ustaw go
    if (prefs.preferredLanguage && prefs.preferredLanguage !== language) {
      setLanguage(prefs.preferredLanguage);
    }
  }, [userPreferences, language, setLanguage]);

  // Wartość kontekstu
  const contextValue: LanguageContextType = useMemo(() => ({
    language,
    languageConfig,
    setLanguage,
    t,
    isLanguageSupported: isValidLanguage,
    availableLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    locale,
    direction,
    isLoading,
    userPreferences,
    updatePreferences
  }), [
    language,
    languageConfig,
    setLanguage,
    t,
    availableLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    locale,
    direction,
    isLoading,
    userPreferences,
    updatePreferences
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook do używania kontekstu języka
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export { LanguageContext };
export default LanguageProvider;
