/**
 * Translation Plugin Utilities
 * Funkcje pomocnicze dla systemu tłumaczeń
 */

import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  STORAGE_KEYS,
  BROWSER_LANGUAGE_MAP,
  UserLanguagePreferences,
  DEFAULT_PREFERENCES,
  TranslationValue,
  InterpolationOptions
} from './types';

/**
 * Wykrywa język przeglądarki i mapuje na obsługiwany język
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'pl';

  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'pl';

  // Sprawdź dokładne dopasowanie
  if (BROWSER_LANGUAGE_MAP[browserLang]) {
    return BROWSER_LANGUAGE_MAP[browserLang];
  }

  // Sprawdź prefix języka (np. 'en' z 'en-US')
  const langPrefix = browserLang.split('-')[0];
  if (BROWSER_LANGUAGE_MAP[langPrefix]) {
    return BROWSER_LANGUAGE_MAP[langPrefix];
  }

  // Domyślnie polski
  return 'pl';
}

/**
 * Pobiera zapisany język z localStorage
 */
export function getSavedLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && isValidLanguage(saved)) {
      return saved as SupportedLanguage;
    }
  } catch {
    console.warn('Could not read language from localStorage');
  }

  return null;
}

/**
 * Zapisuje język do localStorage
 */
export function saveLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
  } catch {
    console.warn('Could not save language to localStorage');
  }
}

/**
 * Pobiera preferencje użytkownika z localStorage
 */
export function getUserPreferences(): UserLanguagePreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch {
    console.warn('Could not read preferences from localStorage');
  }

  return DEFAULT_PREFERENCES;
}

/**
 * Zapisuje preferencje użytkownika do localStorage
 */
export function saveUserPreferences(prefs: UserLanguagePreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch {
    console.warn('Could not save preferences to localStorage');
  }
}

/**
 * Sprawdza czy język jest obsługiwany
 */
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return lang in SUPPORTED_LANGUAGES;
}

/**
 * Pobiera początkowy język (z uwzględnieniem preferencji i wykrywania)
 */
export function getInitialLanguage(): SupportedLanguage {
  const prefs = getUserPreferences();

  // Jeśli użytkownik ma zapisaną preferencję i wybrał "zapamiętaj"
  if (prefs.rememberChoice) {
    const savedLang = getSavedLanguage();
    if (savedLang) {
      return savedLang;
    }
  }

  // Jeśli włączone auto-wykrywanie
  if (prefs.autoDetect) {
    return detectBrowserLanguage();
  }

  // Domyślna preferencja
  return prefs.preferredLanguage;
}

/**
 * Pobiera zagnieżdżoną wartość z obiektu tłumaczeń
 */
export function getNestedValue(obj: TranslationValue, path: string): string | undefined {
  const keys = path.split('.');
  let current: TranslationValue = obj;

  for (const key of keys) {
    if (typeof current === 'string') {
      return undefined;
    }
    if (current[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpoluje zmienne w tekście tłumaczenia
 * Obsługuje format: {variable} lub {{variable}}
 */
export function interpolate(text: string, options?: InterpolationOptions): string {
  if (!options) return text;

  return text.replace(/\{\{?(\w+)\}?\}/g, (match, key) => {
    if (key in options) {
      return String(options[key]);
    }
    return match;
  });
}

/**
 * Formatuje datę zgodnie z lokalizacją
 */
export function formatDateLocalized(
  date: Date | string,
  lang: SupportedLanguage,
  format?: string
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const config = SUPPORTED_LANGUAGES[lang];
  const locale = `${lang}-${lang.toUpperCase()}`;

  // Jeśli podano niestandardowy format
  if (format) {
    return formatCustomDate(dateObj, format);
  }

  // Użyj Intl.DateTimeFormat dla standardowego formatowania
  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  } catch {
    // Fallback
    return dateObj.toLocaleDateString();
  }
}

/**
 * Formatuje datę z niestandardowym formatem
 */
function formatCustomDate(date: Date, format: string): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const yearShort = year.slice(-2);

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('YY', yearShort);
}

/**
 * Formatuje liczbę zgodnie z lokalizacją
 */
export function formatNumberLocalized(
  num: number,
  lang: SupportedLanguage,
  decimals: number = 2
): string {
  const config = SUPPORTED_LANGUAGES[lang];

  try {
    const locale = lang === 'pl' ? 'pl-PL' : lang === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  } catch {
    // Fallback
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.numberFormat.thousands);
    return decimals > 0 ? `${intPart}${config.numberFormat.decimal}${parts[1]}` : intPart;
  }
}

/**
 * Formatuje walutę zgodnie z lokalizacją
 */
export function formatCurrencyLocalized(
  amount: number,
  lang: SupportedLanguage,
  currencyCode?: string
): string {
  const config = SUPPORTED_LANGUAGES[lang];
  const currency = currencyCode || config.currency.code;

  try {
    const locale = lang === 'pl' ? 'pl-PL' : lang === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch {
    // Fallback
    const formatted = formatNumberLocalized(amount, lang, 2);
    const symbol = config.currency.symbol;
    return config.currency.position === 'before'
      ? `${symbol}${formatted}`
      : `${formatted} ${symbol}`;
  }
}

/**
 * Formatuje względny czas (np. "5 minut temu")
 */
export function formatRelativeTimeLocalized(
  date: Date | string,
  lang: SupportedLanguage
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Teksty dla różnych języków
  const texts: Record<SupportedLanguage, {
    justNow: string;
    minutes: (n: number) => string;
    hours: (n: number) => string;
    days: (n: number) => string;
    weeks: (n: number) => string;
    months: (n: number) => string;
    years: (n: number) => string;
  }> = {
    pl: {
      justNow: 'przed chwilą',
      minutes: (n) => `${n} min temu`,
      hours: (n) => `${n} godz. temu`,
      days: (n) => `${n} ${n === 1 ? 'dzień' : 'dni'} temu`,
      weeks: (n) => `${n} ${n === 1 ? 'tydzień' : 'tygodni'} temu`,
      months: (n) => `${n} ${n === 1 ? 'miesiąc' : 'miesięcy'} temu`,
      years: (n) => `${n} ${n === 1 ? 'rok' : 'lat'} temu`
    },
    en: {
      justNow: 'just now',
      minutes: (n) => `${n} min ago`,
      hours: (n) => `${n} hour${n !== 1 ? 's' : ''} ago`,
      days: (n) => `${n} day${n !== 1 ? 's' : ''} ago`,
      weeks: (n) => `${n} week${n !== 1 ? 's' : ''} ago`,
      months: (n) => `${n} month${n !== 1 ? 's' : ''} ago`,
      years: (n) => `${n} year${n !== 1 ? 's' : ''} ago`
    },
    uk: {
      justNow: 'щойно',
      minutes: (n) => `${n} хв тому`,
      hours: (n) => `${n} год тому`,
      days: (n) => `${n} ${n === 1 ? 'день' : 'днів'} тому`,
      weeks: (n) => `${n} ${n === 1 ? 'тиждень' : 'тижнів'} тому`,
      months: (n) => `${n} ${n === 1 ? 'місяць' : 'місяців'} тому`,
      years: (n) => `${n} ${n === 1 ? 'рік' : 'років'} тому`
    }
  };

  const t = texts[lang];

  if (seconds < 60) return t.justNow;
  if (minutes < 60) return t.minutes(minutes);
  if (hours < 24) return t.hours(hours);
  if (days < 7) return t.days(days);
  if (weeks < 4) return t.weeks(weeks);
  if (months < 12) return t.months(months);
  return t.years(years);
}

/**
 * Aktualizuje atrybut lang na elemencie HTML
 */
export function updateDocumentLanguage(lang: SupportedLanguage): void {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = lang;
  document.documentElement.dir = SUPPORTED_LANGUAGES[lang].direction;
}

/**
 * Generuje URL z parametrem języka
 */
export function getLocalizedUrl(path: string, lang: SupportedLanguage): string {
  // Można rozszerzyć o prefix językowy w URL jeśli potrzebne
  // np. /en/page lub /uk/page
  return path;
}
