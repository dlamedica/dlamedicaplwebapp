/**
 * useTranslation Hook
 * Prosty hook do tłumaczeń z pełną funkcjonalnością
 */

import { useCallback, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { SupportedLanguage, InterpolationOptions } from './types';

interface UseTranslationReturn {
  // Główna funkcja tłumaczenia
  t: (key: string, options?: InterpolationOptions) => string;

  // Aktualny język
  language: SupportedLanguage;

  // Zmiana języka
  changeLanguage: (lang: SupportedLanguage) => void;

  // Formatowanie
  formatDate: (date: Date | string, format?: string) => string;
  formatNumber: (num: number, decimals?: number) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatRelativeTime: (date: Date | string) => string;

  // Informacje o języku
  isRTL: boolean;
  locale: string;

  // Status
  isLoading: boolean;
}

/**
 * Hook do tłumaczeń
 * Prostszy interfejs niż pełny useLanguage
 */
export function useTranslation(namespace?: string): UseTranslationReturn {
  const {
    language,
    setLanguage,
    t: translate,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    direction,
    locale,
    isLoading
  } = useLanguage();

  // Funkcja tłumaczenia z opcjonalnym namespace
  const t = useCallback((key: string, options?: InterpolationOptions): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return translate(fullKey, options);
  }, [namespace, translate]);

  // Czy język jest RTL
  const isRTL = useMemo(() => direction === 'rtl', [direction]);

  return {
    t,
    language,
    changeLanguage: setLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    isRTL,
    locale,
    isLoading
  };
}

/**
 * Hook do tłumaczeń z automatycznym namespace
 * Używany gdy komponent ma swój własny namespace
 */
export function useNamespacedTranslation(namespace: string): UseTranslationReturn {
  return useTranslation(namespace);
}

/**
 * Hook do formatowania dat
 */
export function useDateFormat() {
  const { formatDate, formatRelativeTime, locale } = useLanguage();

  return {
    formatDate,
    formatRelativeTime,
    locale
  };
}

/**
 * Hook do formatowania liczb i walut
 */
export function useNumberFormat() {
  const { formatNumber, formatCurrency, languageConfig } = useLanguage();

  return {
    formatNumber,
    formatCurrency,
    currencySymbol: languageConfig.currency.symbol,
    currencyCode: languageConfig.currency.code
  };
}

export default useTranslation;
