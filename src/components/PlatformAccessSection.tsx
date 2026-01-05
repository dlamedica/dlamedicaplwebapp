import React from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, Globe, Lock, Unlock } from 'lucide-react';

interface PlatformAccessSectionProps {
  darkMode: boolean;
  userCountry?: string | null;
}

/**
 * Sekcja z informacjami o dostępie do platformy
 * Wyświetla się na stronie głównej po kliknięciu "Then" w modalu
 */
const PlatformAccessSection: React.FC<PlatformAccessSectionProps> = ({
  darkMode,
  userCountry,
}) => {
  const accessLevels = [
    {
      level: 'Podstawowy',
      description: 'Dostęp do przeglądania treści publicznych',
      features: [
        'Przeglądanie artykułów i aktualności',
        'Korzystanie z kalkulatorów medycznych',
        'Wyszukiwanie w bazie leków',
        'Przeglądanie ofert pracy',
      ],
      available: true,
    },
    {
      level: 'Zalogowany użytkownik',
      description: 'Pełny dostęp po zalogowaniu',
      features: [
        'Wszystkie funkcje podstawowe',
        'Zapisywanie ulubionych treści',
        'Dostęp do materiałów edukacyjnych',
        'System osiągnięć i punktów',
        'Historia zamówień i zakupów',
      ],
      available: true,
    },
    {
      level: 'Użytkownik z Polski',
      description: 'Dodatkowe funkcje dla użytkowników z Polski',
      features: [
        'Wszystkie funkcje użytkownika zalogowanego',
        'Pełny dostęp do sklepu z ebookami',
        'Możliwość publikowania ofert pracy',
        'Dostęp do wszystkich materiałów edukacyjnych',
        'Wsparcie w języku polskim',
      ],
      available: userCountry?.toLowerCase() === 'polska' || userCountry?.toLowerCase() === 'poland',
    },
    {
      level: 'Użytkownik zagraniczny',
      description: 'Ograniczony dostęp dla użytkowników z zagranicy',
      features: [
        'Wszystkie funkcje użytkownika zalogowanego',
        'Ograniczony dostęp do niektórych treści',
        'Możliwość zakupu ebooków (z ograniczeniami)',
        'Wsparcie w języku angielskim',
      ],
      restrictions: [
        'Niektóre materiały mogą być dostępne tylko w języku polskim',
        'Niektóre funkcje mogą wymagać dodatkowej weryfikacji',
        'Oferty pracy mogą być ograniczone do rynku polskiego',
      ],
      available: userCountry && (userCountry.toLowerCase() !== 'polska' && userCountry.toLowerCase() !== 'poland'),
    },
  ];

  return (
    <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek sekcji */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Poziomy dostępu do platformy
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Zrozum różne poziomy dostępu i funkcjonalności dostępne na DlaMedica.pl
          </p>
          {userCountry && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Globe className={`w-5 h-5 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                Twoja lokalizacja: <strong>{userCountry}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Poziomy dostępu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessLevels.map((level, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all ${
                level.available
                  ? darkMode
                    ? 'bg-gray-800 border-blue-500 hover:border-blue-400'
                    : 'bg-gray-50 border-blue-300 hover:border-blue-400'
                  : darkMode
                  ? 'bg-gray-800 border-gray-700 opacity-60'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {level.available ? (
                      <CheckCircle className={`w-5 h-5 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    ) : (
                      <XCircle className={`w-5 h-5 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    )}
                    <h3 className={`text-xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {level.level}
                    </h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {level.description}
                  </p>
                </div>
                {level.available ? (
                  <Unlock className={`w-6 h-6 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                ) : (
                  <Lock className={`w-6 h-6 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                )}
              </div>

              {/* Funkcjonalności */}
              <div className="space-y-2 mb-4">
                <h4 className={`text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Dostępne funkcje:
                </h4>
                <ul className="space-y-1">
                  {level.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ograniczenia (tylko dla użytkowników zagranicznych) */}
              {level.restrictions && level.restrictions.length > 0 && (
                <div className={`mt-4 p-3 rounded-lg ${
                  darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <div className="flex-1">
                      <h5 className={`text-sm font-semibold mb-1 ${
                        darkMode ? 'text-yellow-300' : 'text-yellow-800'
                      }`}>
                        Ograniczenia:
                      </h5>
                      <ul className="space-y-1">
                        {level.restrictions.map((restriction, restrictionIndex) => (
                          <li key={restrictionIndex} className={`text-xs ${
                            darkMode ? 'text-yellow-200' : 'text-yellow-700'
                          }`}>
                            • {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informacja dodatkowa */}
        <div className={`mt-8 p-6 rounded-xl ${
          darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-semibold mb-2 ${
                darkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                Ważne informacje
              </h4>
              <p className={`text-sm ${
                darkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                Poziomy dostępu mogą się różnić w zależności od Twojej lokalizacji i statusu konta.
                Niektóre funkcjonalności mogą wymagać dodatkowej weryfikacji lub mogą być dostępne tylko dla określonych grup użytkowników.
                W razie pytań skontaktuj się z naszym zespołem wsparcia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformAccessSection;
