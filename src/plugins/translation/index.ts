/**
 * Translation Plugin
 * Zaawansowana wtyczka do tłumaczeń dla DlaMedica.pl
 *
 * Funkcjonalności:
 * - Obsługa wielu języków (PL, EN, UK)
 * - Automatyczne wykrywanie języka przeglądarki
 * - Zapamiętywanie preferencji użytkownika
 * - Formatowanie dat, liczb i walut zgodnie z lokalizacją
 * - Interpolacja zmiennych w tłumaczeniach
 * - Przełącznik języka z różnymi wariantami
 * - Panel ustawień językowych
 *
 * Użycie:
 *
 * 1. Wrap your app with LanguageProvider:
 * ```tsx
 * import { LanguageProvider } from './plugins/translation';
 *
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 * ```
 *
 * 2. Use the useTranslation hook in components:
 * ```tsx
 * import { useTranslation } from './plugins/translation';
 *
 * const MyComponent = () => {
 *   const { t, language, changeLanguage, formatDate } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('common.welcome')}</h1>
 *       <p>{t('greeting.hello', { name: 'John' })}</p>
 *       <p>{formatDate(new Date())}</p>
 *     </div>
 *   );
 * };
 * ```
 *
 * 3. Add the LanguageSwitcher component:
 * ```tsx
 * import { LanguageSwitcher } from './plugins/translation';
 *
 * <LanguageSwitcher variant="dropdown" darkMode={darkMode} />
 * ```
 */

// Context and Provider
export { LanguageProvider, useLanguage, LanguageContext } from './LanguageContext';

// Hooks
export { useTranslation, useNamespacedTranslation, useDateFormat, useNumberFormat } from './useTranslation';

// Components
export { LanguageSwitcher, LanguageFlags } from './LanguageSwitcher';
export { LanguageSettings, LanguageSettingsModal } from './LanguageSettings';

// Types
export type {
  SupportedLanguage,
  LanguageConfig,
  LanguageContextType,
  UserLanguagePreferences,
  InterpolationOptions,
  TranslationFile,
  TranslationValue
} from './types';

// Constants
export {
  SUPPORTED_LANGUAGES,
  DEFAULT_PREFERENCES,
  STORAGE_KEYS,
  BROWSER_LANGUAGE_MAP
} from './types';

// Utilities
export {
  detectBrowserLanguage,
  getSavedLanguage,
  saveLanguage,
  getUserPreferences,
  saveUserPreferences,
  isValidLanguage,
  getInitialLanguage,
  formatDateLocalized,
  formatNumberLocalized,
  formatCurrencyLocalized,
  formatRelativeTimeLocalized,
  updateDocumentLanguage,
  getLocalizedUrl
} from './utils';

// Default export
export { default as TranslationProvider } from './LanguageContext';
