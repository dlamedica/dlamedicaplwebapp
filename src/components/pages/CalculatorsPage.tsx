import React, { useState, useEffect } from 'react';
import { FaCalculator, FaSearch, FaTimes, FaHeart, FaUserMd, FaBone, FaLungs, FaBrain, FaEye } from 'react-icons/fa';

interface Calculator {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

interface CalculatorsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CalculatorsPage: React.FC<CalculatorsPageProps> = ({ darkMode, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [filteredCalculators, setFilteredCalculators] = useState<Calculator[]>([]);

  const calculators: Calculator[] = [
    {
      id: '1',
      slug: 'pmr-eular-acr-2012',
      title: '2012 EULAR/ACR Classification Criteria for Polymyalgia Rheumatica',
      description: 'Classifies polymyalgia rheumatica by expert consensus recommendations.',
      category: 'Reumatologia',
      tags: ['PMR', 'polymyalgia', 'rheumatica', 'EULAR', 'ACR', 'classification'],
      featured: true
    },
    {
      id: '2',
      slug: 'rcc-leibovich-2018',
      title: '2018 Leibovich Model for Renal Cell Carcinoma (RCC)',
      description: 'Predicts progression-free and cancer-specific survival in patients with renal cell carcinoma (RCC).',
      category: 'Onkologia',
      tags: ['RCC', 'renal', 'cancer', 'carcinoma', 'Leibovich', 'survival'],
      featured: true
    }
  ];

  const categories = ['Wszystkie', 'Reumatologia', 'Onkologia', 'Kardiologia', 'Neurologia', 'Pulmonologia'];

  const categoryIcons: Record<string, React.ReactNode> = {
    'Wszystkie': <FaCalculator />,
    'Reumatologia': <FaBone />,
    'Onkologia': <FaHeart />,
    'Kardiologia': <FaHeart />,
    'Neurologia': <FaBrain />,
    'Pulmonologia': <FaLungs />,
    'Nefrologia': <FaUserMd />,
    'Okulistyka': <FaEye />
  };

  useEffect(() => {
    let filtered = calculators;

    // Filter by category
    if (selectedCategory !== 'Wszystkie') {
      filtered = filtered.filter(calc => calc.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(calc =>
        calc.title.toLowerCase().includes(searchLower) ||
        calc.description.toLowerCase().includes(searchLower) ||
        calc.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredCalculators(filtered);
  }, [searchTerm, selectedCategory]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          inputText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          inputText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          inputText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    document.title = 'Kalkulatory Medyczne | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Profesjonalne kalkulatory medyczne do diagnostyki i leczenia. Narzędzia kliniczne oparte na najnowszych wytycznych medycznych.');
    }
  }, []);

  const navigateToCalculator = (slug: string) => {
    window.history.pushState({}, '', `/kalkulatory/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#38b6ff] rounded-xl flex items-center justify-center shadow-lg">
              <FaCalculator className="text-white text-3xl" />
            </div>
          </div>
          <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            Kalkulatory Medyczne
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed`}>
            Profesjonalne narzędzia kliniczne do diagnostyki i leczenia oparte na najnowszych wytycznych medycznych.
            Wszystkie kalkulatory są bezpłatne i dostępne bez rejestracji.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center mt-8 space-x-8">
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-3xl font-bold text-[#38b6ff]">{calculators.length}</div>
              <div className="text-sm">Kalkulatorów</div>
            </div>
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-3xl font-bold text-[#38b6ff]">{categories.length - 1}</div>
              <div className="text-sm">Kategorii</div>
            </div>
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-3xl font-bold text-[#38b6ff]">100%</div>
              <div className="text-sm">Bezpłatne</div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Szukaj kalkulatorów medycznych..."
                className={`w-full px-4 py-4 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.inputText} ${
                  darkMode
                    ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className={`p-1 rounded transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
                <FaSearch className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${fontSizes.buttonText} ${
                  selectedCategory === category
                    ? 'bg-[#38b6ff] text-black shadow-md transform scale-105'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <span className="text-lg">{categoryIcons[category]}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
            Znaleziono {filteredCalculators.length} kalkulatorów {selectedCategory !== 'Wszystkie' && `w kategorii "${selectedCategory}"`}
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calculator) => (
            <div
              key={calculator.id}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              onClick={() => navigateToCalculator(calculator.slug)}
            >
              <div className="p-6">
                {/* Featured badge */}
                {calculator.featured && (
                  <div className="flex justify-end mb-3">
                    <span className="bg-[#38b6ff] text-black text-xs font-bold px-2 py-1 rounded-full">
                      POPULARNE
                    </span>
                  </div>
                )}

                {/* Category */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-[#38b6ff]">{categoryIcons[calculator.category]}</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {calculator.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-3 leading-snug`}>
                  {calculator.title}
                </h3>

                {/* Description */}
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 leading-relaxed`}>
                  {calculator.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {calculator.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className={`w-full py-3 px-4 ${fontSizes.buttonText} font-semibold rounded-lg transition-all duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg`}>
                  Otwórz kalkulator
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-black'} mb-2`}>
              Brak wyników
            </h3>
            <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Nie znaleziono kalkulatorów spełniających kryteria wyszukiwania.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Wszystkie');
              }}
              className={`px-6 py-3 ${fontSizes.buttonText} font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5]`}
            >
              Wyczyść filtry
            </button>
          </div>
        )}

        {/* Information Box */}
        <div className={`mt-16 rounded-xl p-8 ${
          darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            O kalkulatorach medycznych DlaMedica
          </h3>
          <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
            <p>
              • <strong>Bezpłatne:</strong> Wszystkie kalkulatory są dostępne za darmo, bez rejestracji i limitów
            </p>
            <p>
              • <strong>Oparte na dowodach:</strong> Każdy kalkulator bazuje na najnowszych wytycznych medycznych
            </p>
            <p>
              • <strong>Profesjonalne:</strong> Narzędzia stworzone dla lekarzy i studentów medycyny
            </p>
            <p>
              • <strong>Zawsze aktualne:</strong> Regularne aktualizacje zgodnie z nowymi wytycznymi
            </p>
            <p>
              • <strong>Mobilne:</strong> Wszystkie kalkulatory działają na telefonach i tabletach
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;