import React, { useEffect } from 'react';
import { FaWeight, FaHeartbeat, FaTint, FaEye, FaBrain, FaCalculator } from 'react-icons/fa';
import PremiumFeatureWrapper from '../PremiumFeatureWrapper';
import PremiumFeatureBadge from '../PremiumFeatureBadge';
import { useUser } from '../../hooks/useUser';

interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface CalculatorsProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const Calculators: React.FC<CalculatorsProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated } = useUser();
  const isPremium = false; // TODO: Add premium check logic

  const handleLogin = () => {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleUpgrade = () => {
    alert('Funkcja uaktualnienia do Premium będzie wkrótce dostępna!');
  };
  useEffect(() => {
    document.title = 'Kalkulatory Medyczne – DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Praktyczne kalkulatory medyczne: BMI, GFR, GCS i więcej. Narzędzia dla lekarzy i studentów medycyny.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Kalkulatory Medyczne – DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Praktyczne kalkulatory medyczne: BMI, GFR, GCS i więcej. Narzędzia dla lekarzy i studentów medycyny.');
    }
  }, []);

  const calculators: Calculator[] = [
    {
      id: 'bmi',
      title: 'BMI',
      description: 'Wskaźnik masy ciała - podstawowe narzędzie do oceny prawidłowej masy ciała w stosunku do wzrostu pacjenta.',
      icon: FaWeight,
      category: 'Podstawowe'
    },
    {
      id: 'gfr',
      title: 'GFR',
      description: 'Szacunkowa szybkość filtracji kłębuszkowej - kluczowy wskaźnik funkcji nerek i stopnia niewydolności.',
      icon: FaTint,
      category: 'Nefrologia'
    },
    {
      id: 'gcs',
      title: 'GCS',
      description: 'Skala Glasgow Coma Scale - standardowa ocena poziomu świadomości u pacjentów z urazami głowy.',
      icon: FaBrain,
      category: 'Neurologia'
    },
    {
      id: 'cardiac-risk',
      title: 'Ryzyko sercowe',
      description: 'Ocena ryzyka sercowo-naczyniowego na podstawie czynników ryzyka i parametrów klinicznych.',
      icon: FaHeartbeat,
      category: 'Kardiologia'
    },
    {
      id: 'vision-test',
      title: 'Test ostrości wzroku',
      description: 'Podstawowa ocena ostrości wzroku z wykorzystaniem standardowych tablic optometrycznych.',
      icon: FaEye,
      category: 'Okulistyka'
    },
    {
      id: 'drug-dosage',
      title: 'Dawkowanie leków',
      description: 'Obliczanie odpowiednich dawek leków w zależności od masy ciała, wieku i funkcji narządów.',
      icon: FaCalculator,
      category: 'Farmakologia'
    }
  ];

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          mainTitle: 'text-2xl md:text-3xl',
          description: 'text-sm md:text-base',
          cardTitle: 'text-lg',
          cardDescription: 'text-sm',
          buttonText: 'text-sm',
          categoryText: 'text-xs'
        };
      case 'large':
        return {
          mainTitle: 'text-4xl md:text-5xl',
          description: 'text-lg md:text-xl',
          cardTitle: 'text-2xl',
          cardDescription: 'text-lg',
          buttonText: 'text-lg',
          categoryText: 'text-sm'
        };
      default:
        return {
          mainTitle: 'text-3xl md:text-4xl',
          description: 'text-base md:text-lg',
          cardTitle: 'text-xl',
          cardDescription: 'text-base',
          buttonText: 'text-base',
          categoryText: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();


  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className={`font-bold ${fontSizes.mainTitle} ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Kalkulatory medyczne
            </h1>
            <PremiumFeatureBadge darkMode={darkMode} size="medium" />
          </div>
          <p className={`${fontSizes.description} ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } max-w-4xl mx-auto leading-relaxed mb-8`}>
            Znajdziesz tu praktyczne narzędzia ułatwiające codzienną pracę medyczną – od kalkulatorów BMI, przez GCS, po wskaźniki nerkowe.
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Calculators Grid */}
        <PremiumFeatureWrapper
          darkMode={darkMode}
          isAuthenticated={isAuthenticated}
          isPremium={isPremium}
          featureName="Kalkulatory medyczne"
          description="Uzyskaj dostęp do profesjonalnych kalkulatorów medycznych: BMI, GFR, GCS i więcej"
          onLogin={handleLogin}
          onUpgrade={handleUpgrade}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator) => {
            const IconComponent = calculator.icon;
            return (
              <div
                key={calculator.id}
                className={`rounded-lg shadow-lg overflow-hidden transition-colors duration-300 hover:shadow-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                aria-label={`Kalkulator ${calculator.title}`}
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded-full ${fontSizes.categoryText} ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {calculator.category}
                    </span>
                  </div>

                  {/* Icon and Title */}
                  <div className="text-center mb-6">
                    <div className="mb-4">
                      <IconComponent 
                        className={`mx-auto text-[#38b6ff] ${
                          fontSize === 'large' ? 'text-5xl' : 
                          fontSize === 'small' ? 'text-3xl' : 'text-4xl'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <h2 className={`font-bold mb-3 ${fontSizes.cardTitle} ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {calculator.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className={`mb-6 ${fontSizes.cardDescription} ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  } leading-relaxed text-center`}>
                    {calculator.description}
                  </p>

                  {/* Button */}
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${fontSizes.buttonText} bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}
                    aria-label={`Przejdź do kalkulatora ${calculator.title}`}
                  >
                    Przejdź
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </PremiumFeatureWrapper>

        {/* Additional Info */}
        <div className={`mt-16 text-center p-8 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="mb-4">
            <span className="text-4xl">🩺</span>
          </div>
          <h2 className={`font-bold mb-4 ${fontSizes.cardTitle} ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Precyzyjne obliczenia medyczne
          </h2>
          <p className={`${fontSizes.cardDescription} ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } max-w-2xl mx-auto leading-relaxed`}>
            Wszystkie kalkulatory zostały opracowane w oparciu o aktualne wytyczne medyczne 
            i standardy kliniczne, zapewniając dokładność i niezawodność w codziennej praktyce.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculators;