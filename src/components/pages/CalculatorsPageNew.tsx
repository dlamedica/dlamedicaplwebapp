import React, { useState, useEffect } from 'react';
import { FaCalculator, FaSearch, FaTimes, FaHeart, FaUserMd, FaBone, FaLungs, FaBrain, FaEye, FaStar, FaClock, FaRegHeart, FaBook, FaAmbulance, FaRibbon } from 'react-icons/fa';
import { Search, Star, Clock, Heart, Filter, BookOpen, TrendingUp, Stethoscope, Tag } from 'lucide-react';
import { CalculatorService, CalculatorCategory, MedicalCalculator, CalculatorStats } from '../../services/calculatorService';
import { useUser } from '../../hooks/useUser';

interface CalculatorsPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CalculatorsPage: React.FC<CalculatorsPageProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<CalculatorCategory[]>([]);
  const [calculators, setCalculators] = useState<MedicalCalculator[]>([]);
  const [stats, setStats] = useState<CalculatorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const categoryIcons: Record<string, React.ReactNode> = {
    'popular': <FaStar />,
    'newest': <FaClock />,
    'favorites': <FaHeart />,
    'cardiology': <FaHeart />,
    'emergency': <FaAmbulance />,
    'nephrology': <FaUserMd />,
    'neurology': <FaBrain />,
    'oncology': <FaRibbon />,
    'pulmonology': <FaLungs />,
    'rheumatology': <FaBone />,
    'guidelines': <FaBook />,
    'all': <FaCalculator />
  };

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

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  // Load calculators when category or search changes
  useEffect(() => {
    loadCalculators();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const { data, error } = await CalculatorService.getCategories();
      if (error) throw error;
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Błąd podczas ładowania kategorii');
    }
  };

  const loadCalculators = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error, count } = await CalculatorService.getCalculators({
        category: selectedCategory,
        search: searchTerm.trim() || undefined,
        limit: 50
      });

      if (error) throw error;
      
      setCalculators(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error loading calculators:', err);
      setError('Błąd podczas ładowania kalkulatorów');
      setCalculators([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await CalculatorService.getCalculatorStats();
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const navigateToCalculator = (slug: string) => {
    window.history.pushState({}, '', `/kalkulatory/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchTerm(''); // Clear search when changing category
    setSelectedLetter(''); // Clear letter filter
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? '' : letter);
  };


  const toggleFavorite = (calculatorId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(calculatorId)) {
      newFavorites.delete(calculatorId);
    } else {
      newFavorites.add(calculatorId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('calculator-favorites', JSON.stringify(Array.from(newFavorites)));
  };

  // Mock data with new calculators
  const mockCalculators: MedicalCalculator[] = [
    {
      id: '1',
      name: '2012 EULAR/ACR Classification Criteria for Polymyalgia Rheumatica',
      slug: 'polymyalgia-rheumatica-criteria',
      description: 'Kryteria klasyfikacyjne EULAR/ACR z 2012 roku do rozpoznawania polimialgia rheumatica',
      category: 'rheumatology',
      tags: ['rheumatology', 'classification', 'PMR', 'EULAR', 'ACR'],
      inputs: [],
      formula: '',
      interpretation: '',
      references: '',
      is_favorite: false,
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      view_count: 456,
      isNew: true,
      specialty: 'Reumatologia'
    },
    {
      id: '2',
      name: '2018 Leibovich Model for Renal Cell Carcinoma (RCC)',
      slug: 'leibovich-rcc-model',
      description: 'Model prognostyczny Leibovich dla raka nerkowokomórkowego po nefrektomii',
      category: 'oncology',
      tags: ['oncology', 'RCC', 'prognosis', 'Leibovich', 'kidney'],
      inputs: [],
      formula: '',
      interpretation: '',
      references: '',
      is_favorite: false,
      created_at: '2024-01-10',
      updated_at: '2024-01-10',
      view_count: 234,
      isNew: true,
      specialty: 'Onkologia'
    },
    {
      id: '3',
      name: '2023 Duke-International Society Criteria',
      slug: 'duke-international-society-criteria',
      description: 'Najnowsze kryteria Duke-International Society do diagnostyki zapalenia wsierdzia',
      category: 'cardiology',
      tags: ['cardiology', 'endocarditis', 'Duke', 'diagnosis', 'criteria'],
      inputs: [],
      formula: '',
      interpretation: '',
      references: '',
      is_favorite: false,
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      view_count: 789,
      isNew: true,
      specialty: 'Kardiologia'
    },
    {
      id: '4',
      name: 'BMI Calculator',
      slug: 'bmi-calculator',
      description: 'Kalkulator wskaźnika masy ciała (BMI) z interpretacją według WHO',
      category: 'general',
      tags: ['BMI', 'obesity', 'general', 'screening'],
      inputs: [],
      formula: '',
      interpretation: '',
      references: '',
      is_favorite: false,
      created_at: '2023-12-01',
      updated_at: '2023-12-01',
      view_count: 2345,
      isNew: false,
      specialty: 'Medycyna ogólna'
    },
    {
      id: '5',
      name: 'CHAD₂DS₂-VASc Score',
      slug: 'chads2ds2-vasc-score',
      description: 'Ocena ryzyka udaru mózgu u pacjentów z migotaniem przedsionków',
      category: 'cardiology',
      tags: ['cardiology', 'stroke', 'atrial fibrillation', 'risk'],
      inputs: [],
      formula: '',
      interpretation: '',
      references: '',
      is_favorite: false,
      created_at: '2023-11-15',
      updated_at: '2023-11-15',
      view_count: 1567,
      isNew: false,
      specialty: 'Kardiologia'
    }
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const filterCategories = [
    { id: 'all', name: 'Wszystko', icon: <Filter className="w-4 h-4" /> },
    { id: 'popular', name: 'Popularne', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'newest', name: 'Nowe', icon: <Clock className="w-4 h-4" /> },
    { id: 'favorites', name: 'Ulubione', icon: <Heart className="w-4 h-4" /> },
    { id: 'for_you', name: 'Dla ciebie', icon: <Star className="w-4 h-4" /> }
  ];

  const getFilteredCalculators = () => {
    let filtered = mockCalculators;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(calc => 
        calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'popular') {
        filtered = filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      } else if (selectedCategory === 'newest') {
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (selectedCategory === 'favorites') {
        filtered = filtered.filter(calc => favorites.has(calc.id));
      } else if (selectedCategory === 'for_you') {
        // "Dla ciebie" - można dodać logikę rekomendacji, na razie pokazujemy wszystkie
        filtered = filtered.sort((a, b) => Math.random() - 0.5); // losowe sortowanie jako placeholder
      } else {
        filtered = filtered.filter(calc => calc.category === selectedCategory);
      }
    }

    // Filter by letter
    if (selectedLetter) {
      filtered = filtered.filter(calc => 
        calc.name.charAt(0).toUpperCase() === selectedLetter
      );
    }

    return filtered;
  };

  useEffect(() => {
    document.title = 'Kalkulatory Medyczne | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Profesjonalne narzędzia kliniczne do diagnostyki i leczenia oparte na najnowszych wytycznych medycznych. Wszystkie kalkulatory są bezpłatne i dostępne bez rejestracji.');
    }
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Centered */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#38b6ff] rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
          </div>
          <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Kalkulatory Medyczne
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Narzędzia kliniczne oparte na dowodach
          </p>
        </div>

        {/* Search Bar - Centered and Simplified */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Szukaj kalkulatorów"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs - Centered */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#38b6ff] text-black shadow-md'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* A-Z Navigation - Centered */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-1 justify-center">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterSelect(letter)}
                className={`w-8 h-8 text-sm font-medium rounded transition-all duration-200 ${
                  selectedLetter === letter
                    ? 'bg-[#38b6ff] text-black'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter('')}
                className={`px-3 py-1 text-sm rounded ml-2 ${
                  darkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Wyczyść
              </button>
            )}
          </div>
        </div>


        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Znaleziono {getFilteredCalculators().length} kalkulatorów
            {selectedCategory !== 'all' && ` w kategorii ${filterCategories.find(c => c.id === selectedCategory)?.name}`}
            {selectedLetter && ` na literę "${selectedLetter}"`}
          </p>
        </div>

        {/* Calculator Cards - MDCalc Style */}
        <div className="space-y-4">
          {getFilteredCalculators().map((calculator) => (
            <div
              key={calculator.id}
              onClick={() => navigateToCalculator(calculator.slug)}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.01] hover:shadow-xl ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-[#38b6ff] hover:bg-gray-750'
                  : 'bg-white border-gray-200 hover:border-[#38b6ff] hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-bold ${fontSizes.cardTitle} ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    } hover:text-[#38b6ff] transition-colors`}>
                      {calculator.name}
                    </h3>
                    {calculator.isNew && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        NOWY
                      </span>
                    )}
                  </div>
                  
                  <p className={`${fontSizes.cardText} ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  } mb-3 leading-relaxed`}>
                    {calculator.description}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {calculator.specialty}
                    </span>
                    
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(calculator.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.has(calculator.id)
                        ? 'text-red-500 hover:text-red-600'
                        : darkMode
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {favorites.has(calculator.id) ? (
                      <FaHeart className="w-5 h-5" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {getFilteredCalculators().length === 0 && (
          <div className="text-center py-16">
            <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              📊
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nie znaleziono kalkulatorów
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Spróbuj zmienić kryteria wyszukiwania lub filtry
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLetter('');
              }}
              className="px-6 py-2 bg-[#38b6ff] text-black rounded-lg hover:bg-[#2a9fe5] transition-colors"
            >
              Wyczyść wszystkie filtry
            </button>
          </div>
        )}

        {/* Information Box */}
        <div className={`mt-16 rounded-xl p-8 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`${fontSizes.cardTitle} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            O kalkulatorach medycznych DlaMedica
          </h3>
          <div className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-3`}>
            <p>
              • <strong>Oparte na dowodach:</strong> Wszystkie kalkulatory bazują na najnowszych wytycznych medycznych i badaniach
            </p>
            <p>
              • <strong>Bezpłatny dostęp:</strong> Bez konieczności rejestracji, całkowicie darmowe
            </p>
            <p>
              • <strong>Narzędzia profesjonalne:</strong> Zaprojektowane dla pracowników służby zdrowia i studentów medycyny
            </p>
            <p>
              • <strong>Zawsze aktualne:</strong> Regularne aktualizacje zgodnie z nowymi wytycznymi medycznymi
            </p>
            <p>
              • <strong>Przyjazne mobilnym:</strong> Działa płynnie na telefonach i tabletach
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;