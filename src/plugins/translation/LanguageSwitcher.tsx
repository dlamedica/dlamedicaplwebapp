/**
 * Language Switcher Component
 * Zaawansowany przełącznik języka z różnymi wariantami wyświetlania
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from './types';

interface LanguageSwitcherProps {
  // Styl wyświetlania
  variant?: 'dropdown' | 'buttons' | 'compact' | 'minimal';

  // Pokaż flagę
  showFlag?: boolean;

  // Pokaż nazwę języka
  showName?: boolean;

  // Pokaż natywną nazwę
  showNativeName?: boolean;

  // Tryb ciemny
  darkMode?: boolean;

  // Klasa CSS
  className?: string;

  // Callback po zmianie
  onLanguageChange?: (lang: SupportedLanguage) => void;

  // Pozycja dropdownu
  dropdownPosition?: 'left' | 'right' | 'center';

  // Rozmiar
  size?: 'small' | 'medium' | 'large';
}

/**
 * Komponent przełącznika języka
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  showFlag = true,
  showName = true,
  showNativeName = false,
  darkMode = false,
  className = '',
  onLanguageChange,
  dropdownPosition = 'right',
  size = 'medium'
}) => {
  const { language, setLanguage, availableLanguages, languageConfig, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zamknij dropdown przy kliknięciu poza
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obsługa zmiany języka
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // Rozmiary
  const sizeClasses = {
    small: 'text-xs py-1 px-2',
    medium: 'text-sm py-2 px-3',
    large: 'text-base py-3 px-4'
  };

  const flagSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  // Renderowanie nazwy języka
  const renderLanguageName = (config: typeof languageConfig) => {
    if (showNativeName) {
      return config.nativeName;
    }
    if (showName) {
      return config.nativeName;
    }
    return null;
  };

  // Wariant dropdown
  if (variant === 'dropdown') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center space-x-2 rounded-lg transition-all duration-200
            ${sizeClasses[size]}
            ${darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
              : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300'
            }
            focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:ring-opacity-50
          `}
          aria-label={t('common.selectLanguage')}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {showFlag && (
            <span className={flagSizes[size]} role="img" aria-hidden="true">
              {languageConfig.flag}
            </span>
          )}
          {showName && (
            <span className="font-medium">
              {renderLanguageName(languageConfig)}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className={`
              absolute z-50 mt-2 rounded-lg shadow-xl border overflow-hidden
              ${dropdownPosition === 'left' ? 'left-0' : dropdownPosition === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}
              ${darkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-200'
              }
            `}
            role="listbox"
            aria-label={t('common.selectLanguage')}
          >
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center space-x-3 ${sizeClasses[size]} transition-colors duration-150
                  ${language === lang.code
                    ? darkMode
                      ? 'bg-[#38b6ff] text-black'
                      : 'bg-[#38b6ff] text-black'
                    : darkMode
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-800 hover:bg-gray-100'
                  }
                `}
                role="option"
                aria-selected={language === lang.code}
              >
                {showFlag && (
                  <span className={flagSizes[size]} role="img" aria-hidden="true">
                    {lang.flag}
                  </span>
                )}
                <span className="font-medium whitespace-nowrap">
                  {showNativeName ? lang.nativeName : lang.nativeName}
                </span>
                {language === lang.code && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Wariant buttons
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-1 ${className}`} role="radiogroup" aria-label={t('common.selectLanguage')}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              flex items-center space-x-1 rounded-lg transition-all duration-200
              ${sizeClasses[size]}
              ${language === lang.code
                ? 'bg-[#38b6ff] text-black shadow-md'
                : darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }
            `}
            role="radio"
            aria-checked={language === lang.code}
          >
            {showFlag && (
              <span className={flagSizes[size]} role="img" aria-hidden="true">
                {lang.flag}
              </span>
            )}
            {showName && (
              <span className="font-medium">
                {lang.code.toUpperCase()}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Wariant compact - tylko flagi
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${className}`} role="radiogroup" aria-label={t('common.selectLanguage')}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${language === lang.code
                ? 'bg-[#38b6ff]/20 ring-2 ring-[#38b6ff]'
                : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }
            `}
            title={lang.nativeName}
            role="radio"
            aria-checked={language === lang.code}
            aria-label={lang.nativeName}
          >
            <span className={`${flagSizes[size]} ${language === lang.code ? '' : 'opacity-70 hover:opacity-100'}`} role="img" aria-hidden="true">
              {lang.flag}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Wariant minimal - tylko kod języka
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center ${className}`}>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
          className={`
            rounded-lg transition-all duration-200 cursor-pointer
            ${sizeClasses[size]}
            ${darkMode
              ? 'bg-gray-800 text-white border-gray-600'
              : 'bg-white text-gray-800 border-gray-300'
            }
            border focus:outline-none focus:ring-2 focus:ring-[#38b6ff]
          `}
          aria-label={t('common.selectLanguage')}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

/**
 * Prosty przełącznik flag
 */
export const LanguageFlags: React.FC<{
  darkMode?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ darkMode = false, className = '', size = 'medium' }) => {
  return (
    <LanguageSwitcher
      variant="compact"
      darkMode={darkMode}
      className={className}
      size={size}
      showFlag={true}
      showName={false}
    />
  );
};

export default LanguageSwitcher;
