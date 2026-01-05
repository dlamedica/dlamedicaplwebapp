import React from 'react';
import { FaHome, FaNewspaper, FaBriefcase, FaArrowLeft } from 'react-icons/fa';

interface NotFoundPageProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ darkMode, highContrast, fontSize }) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-6xl md:text-7xl',
          subtitle: 'text-xl md:text-2xl',
          text: 'text-base md:text-lg',
          buttonText: 'text-sm md:text-base'
        };
      case 'large':
        return {
          title: 'text-8xl md:text-9xl',
          subtitle: 'text-3xl md:text-4xl',
          text: 'text-xl md:text-2xl',
          buttonText: 'text-lg md:text-xl'
        };
      default:
        return {
          title: 'text-7xl md:text-8xl',
          subtitle: 'text-2xl md:text-3xl',
          text: 'text-lg md:text-xl',
          buttonText: 'text-base md:text-lg'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 ${
      highContrast 
        ? 'bg-white' 
        : darkMode 
          ? 'bg-black' 
          : 'bg-gray-50'
    } transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Number */}
        <div className={`${fontSizes.title} font-bold mb-8 ${
          highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-[#38b6ff]'
        } leading-none`}>
          404
        </div>

        {/* Error Message */}
        <h1 className={`${fontSizes.subtitle} font-bold mb-6 ${
          highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Nie znaleziono strony
        </h1>

        <p className={`${fontSizes.text} ${
          highContrast ? 'text-gray-600' : darkMode ? 'text-gray-300' : 'text-gray-600'
        } mb-12 max-w-2xl mx-auto leading-relaxed`}>
          Strona, której szukasz, mogła zostać przeniesiona, usunięta lub nie istnieje. 
          Sprawdź poprawność adresu URL lub skorzystaj z jednej z poniższych opcji.
        </p>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {/* Home Button */}
          <button
            onClick={() => handleNavigation('/')}
            className={`group flex flex-col items-center p-6 rounded-lg transition-all duration-200 ${
              highContrast
                ? 'bg-white border-2 border-black hover:bg-black hover:text-white'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-lg'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
              highContrast
                ? 'bg-gray-200 group-hover:bg-white'
                : 'bg-[#38b6ff] group-hover:bg-[#2a9fe5]'
            }`}>
              <FaHome className={`text-xl ${
                highContrast ? 'text-black group-hover:text-black' : 'text-black'
              }`} />
            </div>
            <span className={`${fontSizes.buttonText} font-medium`}>
              Strona główna
            </span>
            <span className={`text-sm mt-1 ${
              highContrast ? 'text-gray-600 group-hover:text-gray-300' : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Powrót do głównej
            </span>
          </button>

          {/* News Button */}
          <button
            onClick={() => handleNavigation('/')}
            className={`group flex flex-col items-center p-6 rounded-lg transition-all duration-200 ${
              highContrast
                ? 'bg-white border-2 border-black hover:bg-black hover:text-white'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-lg'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
              highContrast
                ? 'bg-gray-200 group-hover:bg-white'
                : 'bg-[#38b6ff] group-hover:bg-[#2a9fe5]'
            }`}>
              <FaNewspaper className={`text-xl ${
                highContrast ? 'text-black group-hover:text-black' : 'text-black'
              }`} />
            </div>
            <span className={`${fontSizes.buttonText} font-medium`}>
              Aktualności
            </span>
            <span className={`text-sm mt-1 ${
              highContrast ? 'text-gray-600 group-hover:text-gray-300' : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Najnowsze wiadomości
            </span>
          </button>

          {/* Jobs Button */}
          <button
            onClick={() => handleNavigation('/praca')}
            className={`group flex flex-col items-center p-6 rounded-lg transition-all duration-200 ${
              highContrast
                ? 'bg-white border-2 border-black hover:bg-black hover:text-white'
                : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-md hover:shadow-lg'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
              highContrast
                ? 'bg-gray-200 group-hover:bg-white'
                : 'bg-[#38b6ff] group-hover:bg-[#2a9fe5]'
            }`}>
              <FaBriefcase className={`text-xl ${
                highContrast ? 'text-black group-hover:text-black' : 'text-black'
              }`} />
            </div>
            <span className={`${fontSizes.buttonText} font-medium`}>
              Oferty pracy
            </span>
            <span className={`text-sm mt-1 ${
              highContrast ? 'text-gray-600 group-hover:text-gray-300' : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Znajdź pracę
            </span>
          </button>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className={`inline-flex items-center ${fontSizes.text} ${
            highContrast ? 'text-black hover:text-gray-600' : 'text-[#38b6ff] hover:text-[#2a9fe5]'
          } transition-colors duration-200`}
        >
          <FaArrowLeft className="mr-2" />
          Wróć do poprzedniej strony
        </button>

        {/* Logo Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-[#38b6ff] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className={`text-xl font-bold ${
              highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              DlaMedica.pl
            </span>
          </div>
          <p className={`mt-2 text-sm ${
            highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Portal dla medyków
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;