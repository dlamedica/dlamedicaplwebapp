import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  darkMode: boolean;
  variant?: 'dropdown' | 'buttons' | 'compact';
}

const languages = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱', shortName: 'PL' },
  { code: 'en', name: 'English', flag: '🇬🇧', shortName: 'EN' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', shortName: 'UA' }
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ darkMode, variant = 'dropdown' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compact variant - just flags
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`text-lg p-1 rounded transition-all duration-200 ${
              i18n.language === lang.code
                ? 'ring-2 ring-[#38b6ff] ring-offset-1 scale-110'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            } ${darkMode ? 'ring-offset-black' : 'ring-offset-white'}`}
            title={lang.name}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  // Buttons variant - horizontal buttons
  if (variant === 'buttons') {
    return (
      <div className="flex items-center gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              i18n.language === lang.code
                ? darkMode
                  ? 'bg-[#38b6ff] text-black'
                  : 'bg-[#38b6ff] text-black'
                : darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
            aria-label={`Switch to ${lang.name}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.shortName}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          darkMode
            ? 'text-white hover:bg-gray-800 border border-gray-700'
            : 'text-black hover:bg-gray-100 border border-gray-200'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.shortName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-44 rounded-lg shadow-xl border z-50 overflow-hidden ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                i18n.language === lang.code
                  ? darkMode
                    ? 'bg-[#38b6ff]/20 text-[#38b6ff]'
                    : 'bg-[#38b6ff]/10 text-[#38b6ff]'
                  : darkMode
                    ? 'text-white hover:bg-gray-700'
                    : 'text-black hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
              {i18n.language === lang.code && (
                <svg className="w-4 h-4 ml-auto text-[#38b6ff]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
