/**
 * Language Settings Component
 * Panel ustawień językowych użytkownika
 */

import React from 'react';
import { useLanguage } from './LanguageContext';
import { SupportedLanguage } from './types';

interface LanguageSettingsProps {
  darkMode?: boolean;
  className?: string;
  onClose?: () => void;
}

/**
 * Panel ustawień językowych
 */
export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  darkMode = false,
  className = '',
  onClose
}) => {
  const {
    language,
    setLanguage,
    availableLanguages,
    userPreferences,
    updatePreferences,
    t
  } = useLanguage();

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const handleAutoDetectChange = (enabled: boolean) => {
    updatePreferences({ autoDetect: enabled });
  };

  const handleRememberChoiceChange = (enabled: boolean) => {
    updatePreferences({ rememberChoice: enabled });
  };

  return (
    <div className={`${className}`}>
      <div className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Nagłówek */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('common.language')}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Lista języków */}
        <div className="space-y-2 mb-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('common.selectLanguage')}
          </label>
          <div className="grid gap-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  flex items-center space-x-4 p-4 rounded-xl transition-all duration-200
                  ${language === lang.code
                    ? 'bg-[#38b6ff] text-black shadow-lg'
                    : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{lang.nativeName}</div>
                  <div className={`text-sm ${language === lang.code ? 'text-black/70' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {lang.name}
                  </div>
                </div>
                {language === lang.code && (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className={`border-t my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

        {/* Opcje */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('profile.preferences')}
          </h3>

          {/* Auto-wykrywanie */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Automatyczne wykrywanie
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wykryj język przeglądarki przy pierwszej wizycie
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={userPreferences.autoDetect}
                onChange={(e) => handleAutoDetectChange(e.target.checked)}
                className="sr-only"
              />
              <div
                onClick={() => handleAutoDetectChange(!userPreferences.autoDetect)}
                className={`
                  w-14 h-8 rounded-full transition-colors duration-200 cursor-pointer
                  ${userPreferences.autoDetect ? 'bg-[#38b6ff]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200
                    ${userPreferences.autoDetect ? 'translate-x-7' : 'translate-x-1'}
                    mt-1
                  `}
                />
              </div>
            </div>
          </label>

          {/* Zapamiętaj wybór */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Zapamiętaj wybór
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Zachowaj preferowany język między sesjami
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={userPreferences.rememberChoice}
                onChange={(e) => handleRememberChoiceChange(e.target.checked)}
                className="sr-only"
              />
              <div
                onClick={() => handleRememberChoiceChange(!userPreferences.rememberChoice)}
                className={`
                  w-14 h-8 rounded-full transition-colors duration-200 cursor-pointer
                  ${userPreferences.rememberChoice ? 'bg-[#38b6ff]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`
                    w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200
                    ${userPreferences.rememberChoice ? 'translate-x-7' : 'translate-x-1'}
                    mt-1
                  `}
                />
              </div>
            </div>
          </label>
        </div>

        {/* Informacja */}
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-start space-x-3">
            <svg className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
              Twój wybór języka zostanie zapisany i zastosowany przy następnej wizycie na stronie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal z ustawieniami językowymi
 */
export const LanguageSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}> = ({ isOpen, onClose, darkMode = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <LanguageSettings darkMode={darkMode} onClose={onClose} />
      </div>
    </div>
  );
};

export default LanguageSettings;
