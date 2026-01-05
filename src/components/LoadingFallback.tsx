import React from 'react';

interface LoadingFallbackProps {
  message?: string;
  darkMode?: boolean;
}

/**
 * Komponent wyświetlany podczas ładowania lazy-loaded komponentów
 */
const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Ładowanie...', 
  darkMode = false 
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;

