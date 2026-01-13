/**
 * Translation Plugin Types
 * Zaawansowana wtyczka do tłumaczeń z pełną obsługą lokalizacji
 */

// Obsługiwane języki
export type SupportedLanguage = 'pl' | 'en' | 'uk';

// Konfiguracja języka
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
}

// Mapa dostępnych języków
export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      decimal: ',',
      thousands: ' '
    },
    currency: {
      code: 'PLN',
      symbol: 'zł',
      position: 'after'
    }
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ','
    },
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before'
    }
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      decimal: ',',
      thousands: ' '
    },
    currency: {
      code: 'UAH',
      symbol: '₴',
      position: 'after'
    }
  }
};

// Typ dla zagnieżdżonych tłumaczeń
export type TranslationValue = string | { [key: string]: TranslationValue };

// Struktura pliku tłumaczeń
export interface TranslationFile {
  [key: string]: TranslationValue;
}

// Opcje interpolacji
export interface InterpolationOptions {
  [key: string]: string | number;
}

// Kontekst języka
export interface LanguageContextType {
  // Aktualny język
  language: SupportedLanguage;
  languageConfig: LanguageConfig;

  // Zmiana języka
  setLanguage: (lang: SupportedLanguage) => void;

  // Funkcja tłumaczenia
  t: (key: string, options?: InterpolationOptions) => string;

  // Sprawdzenie czy język istnieje
  isLanguageSupported: (lang: string) => lang is SupportedLanguage;

  // Lista dostępnych języków
  availableLanguages: LanguageConfig[];

  // Formatowanie
  formatDate: (date: Date | string, format?: string) => string;
  formatNumber: (num: number, decimals?: number) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatRelativeTime: (date: Date | string) => string;

  // Lokalizacja
  locale: string;
  direction: 'ltr' | 'rtl';

  // Status ładowania
  isLoading: boolean;

  // Preferencje użytkownika
  userPreferences: UserLanguagePreferences;
  updatePreferences: (prefs: Partial<UserLanguagePreferences>) => void;
}

// Preferencje językowe użytkownika
export interface UserLanguagePreferences {
  preferredLanguage: SupportedLanguage;
  autoDetect: boolean;
  rememberChoice: boolean;
  dateFormat?: string;
  numberFormat?: string;
  currency?: string;
}

// Domyślne preferencje
export const DEFAULT_PREFERENCES: UserLanguagePreferences = {
  preferredLanguage: 'pl',
  autoDetect: true,
  rememberChoice: true
};

// Klucze localStorage
export const STORAGE_KEYS = {
  LANGUAGE: 'dlamedica_language',
  PREFERENCES: 'dlamedica_language_preferences',
  LAST_VISIT: 'dlamedica_last_language_visit'
} as const;

// Mapowanie języków przeglądarki na obsługiwane
export const BROWSER_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  'pl': 'pl',
  'pl-PL': 'pl',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'uk': 'uk',
  'uk-UA': 'uk'
};
