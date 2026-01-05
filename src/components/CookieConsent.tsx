import React, { useState, useEffect } from 'react';
import { FaCookie, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface CookieConsentProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CookieConsent: React.FC<CookieConsentProps> = ({ darkMode, highContrast, fontSize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('dlamedica-cookies-accepted');
    if (!hasAccepted) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          text: 'text-sm',
          buttonText: 'text-xs',
          title: 'text-base'
        };
      case 'large':
        return {
          text: 'text-lg',
          buttonText: 'text-base',
          title: 'text-xl'
        };
      default:
        return {
          text: 'text-base',
          buttonText: 'text-sm',
          title: 'text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const handleAccept = () => {
    localStorage.setItem('dlamedica-cookies-accepted', 'true');
    localStorage.setItem('dlamedica-cookies-accepted-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('dlamedica-cookies-accepted', 'false');
    localStorage.setItem('dlamedica-cookies-accepted-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Set a temporary dismissal - will show again on next visit
    sessionStorage.setItem('dlamedica-cookies-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className={`max-w-6xl mx-auto rounded-lg shadow-xl border-2 transition-all duration-300 ${
        highContrast
          ? 'bg-white border-black'
          : darkMode
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <FaCookie className={`mr-3 text-xl ${
                highContrast ? 'text-black' : 'text-[#38b6ff]'
              }`} />
              <h3 className={`${fontSizes.title} font-bold ${
                highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Informacja o plikach cookies
              </h3>
            </div>
            
            <button
              onClick={handleClose}
              className={`p-1 rounded transition-colors duration-200 ${
                highContrast
                  ? 'text-black hover:bg-gray-200'
                  : darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Zamknij banner cookies"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className={`${fontSizes.text} ${
            highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-4`}>
            <p className="mb-3">
              Ta strona używa plików cookies w celu zapewnienia najlepszej jakości usług. 
              Kontynuując przeglądanie strony, wyrażasz zgodę na ich użycie.
            </p>
            
            {isExpanded && (
              <div className="space-y-3">
                <p>
                  <strong>Niezbędne cookies:</strong> Umożliwiają podstawowe funkcjonalności strony, 
                  takie jak nawigacja i dostęp do bezpiecznych obszarów.
                </p>
                <p>
                  <strong>Cookies preferencji:</strong> Zapamiętują Twoje ustawienia (np. tryb ciemny, rozmiar czcionki).
                </p>
                <p>
                  <strong>Cookies analityczne:</strong> Pomagają nam zrozumieć, jak korzystasz ze strony, 
                  aby ją ulepszać.
                </p>
                <p>
                  Więcej informacji znajdziesz w naszej{' '}
                  <button
                    onClick={() => {
                      window.history.pushState({}, '', '/polityka-prywatnosci');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`underline ${
                      highContrast ? 'text-black' : 'text-[#38b6ff] hover:text-[#2a9fe5]'
                    }`}
                  >
                    Polityce Prywatności
                  </button>.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center ${fontSizes.buttonText} ${
                highContrast 
                  ? 'text-black hover:text-gray-600' 
                  : 'text-[#38b6ff] hover:text-[#2a9fe5]'
              } transition-colors duration-200`}
            >
              <FaInfoCircle className="mr-1" />
              {isExpanded ? 'Pokaż mniej' : 'Dowiedz się więcej'}
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className={`px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-all duration-200 ${
                  highContrast
                    ? 'bg-white border-2 border-black text-black hover:bg-gray-100'
                    : darkMode
                      ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Odrzuć
              </button>
              
              <button
                onClick={handleAccept}
                className={`px-6 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-all duration-200 ${
                  highContrast
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg'
                }`}
              >
                Akceptuję wszystkie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;