import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import FlashcardImportExport from '../flashcards/FlashcardImportExport';
import { 
  FaPlus, 
  FaUpload, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaPlay, 
  FaEdit, 
  FaCopy, 
  FaTrash, 
  FaShare,
  FaChartBar,
  FaCalendarAlt,
  FaBook,
  FaFire
} from 'react-icons/fa';

interface FlashcardSet {
  id: number;
  title: string;
  description: string;
  cardCount: number;
  category: string;
  difficulty: 'Łatwy' | 'Średni' | 'Trudny';
  progress: number; // 0-100
  lastStudied: string;
  created: string;
  isPublic: boolean;
  thumbnail: string;
  tags: string[];
}

interface FlashcardLibraryProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const FlashcardLibrary: React.FC<FlashcardLibraryProps> = ({ darkMode, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [selectedDifficulty, setSelectedDifficulty] = useState('wszystkie');
  const [sortBy, setSortBy] = useState('lastStudied');
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [showImportExport, setShowImportExport] = useState(false);
  const [selectedSetForImportExport, setSelectedSetForImportExport] = useState<FlashcardSet | null>(null);

  useEffect(() => {
    document.title = 'Moje Fiszki – DlaMedica.pl';
    
    // Mock data for flashcard sets
    const mockSets: FlashcardSet[] = [
      {
        id: 1,
        title: "Anatomia układu krążenia",
        description: "Podstawowe struktury i funkcje serca oraz naczyń krwionośnych",
        cardCount: 45,
        category: "Anatomia",
        difficulty: "Średni",
        progress: 78,
        lastStudied: "2 dni temu",
        created: "2024-01-15",
        isPublic: false,
        thumbnail: "❤️",
        tags: ["anatomia", "serce", "naczynia"]
      },
      {
        id: 2,
        title: "Farmakologia - leki kardiologiczne",
        description: "Mechanizmy działania i zastosowanie leków sercowo-naczyniowych",
        cardCount: 32,
        category: "Farmakologia",
        difficulty: "Trudny",
        progress: 45,
        lastStudied: "5 dni temu",
        created: "2024-01-10",
        isPublic: true,
        thumbnail: "💊",
        tags: ["farmakologia", "kardiologia", "leki"]
      },
      {
        id: 3,
        title: "Fizjologia oddechowa",
        description: "Mechanizmy oddychania i wymiana gazowa w płucach",
        cardCount: 28,
        category: "Fizjologia",
        difficulty: "Średni",
        progress: 92,
        lastStudied: "wczoraj",
        created: "2024-01-20",
        isPublic: false,
        thumbnail: "🫁",
        tags: ["fizjologia", "oddychanie", "płuca"]
      },
      {
        id: 4,
        title: "Podstawy biochemii",
        description: "Struktury i funkcje białek, węglowodanów i lipidów",
        cardCount: 67,
        category: "Biochemia",
        difficulty: "Łatwy",
        progress: 23,
        lastStudied: "tydzień temu",
        created: "2024-01-05",
        isPublic: false,
        thumbnail: "🧪",
        tags: ["biochemia", "białka", "metabolizm"]
      }
    ];
    
    setFlashcardSets(mockSets);
  }, []);

  const handleCreateNew = () => {
    window.history.pushState({}, '', '/fiszki/create');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleStudySet = (setId: number) => {
    window.history.pushState({}, '', `/fiszki/study/${setId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleEditSet = (setId: number) => {
    window.history.pushState({}, '', `/fiszki/edit/${setId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleViewProgress = () => {
    window.history.pushState({}, '', '/fiszki/progress');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-base',
          cardTitle: 'text-lg',
          cardText: 'text-sm',
          buttonText: 'text-sm',
          statValue: 'text-xl',
          statLabel: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-xl',
          cardTitle: 'text-2xl',
          cardText: 'text-lg',
          buttonText: 'text-lg',
          statValue: 'text-3xl',
          statLabel: 'text-base'
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-lg',
          cardTitle: 'text-xl',
          cardText: 'text-base',
          buttonText: 'text-base',
          statValue: 'text-2xl',
          statLabel: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Calculate stats
  const totalSets = flashcardSets.length;
  const totalCards = flashcardSets.reduce((sum, set) => sum + set.cardCount, 0);
  const studiedToday = 23; // Mock data
  const studyStreak = 7; // Mock data

  // Filter sets
  const filteredSets = flashcardSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'wszystkie' || set.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'wszystkie' || set.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort sets
  const sortedSets = [...filteredSets].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'cardCount':
        return b.cardCount - a.cardCount;
      default: // lastStudied
        return a.lastStudied.localeCompare(b.lastStudied);
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Łatwy':
        return darkMode ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-100';
      case 'Średni':
        return darkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-700 bg-yellow-100';
      case 'Trudny':
        return darkMode ? 'text-red-400 bg-red-900/30' : 'text-red-700 bg-red-100';
      default:
        return darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <MainLayout darkMode={darkMode} showSidebar={true} currentPage="flashcards">
      <div className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`${fontSizes.title} font-bold mb-4`}>
              📇 Moje Fiszki
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Zarządzaj swoimi zestawami fiszek i ucz się efektywnie
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCreateNew}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black ${fontSizes.buttonText}`}
              >
                <FaPlus />
                Utwórz nowy zestaw
              </button>
              
              <button
                onClick={() => {
                  // For now, show import/export for first set (in production, let user choose)
                  if (flashcardSets.length > 0) {
                    setSelectedSetForImportExport(flashcardSets[0]);
                    setShowImportExport(true);
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                } ${fontSizes.buttonText}`}
              >
                <FaUpload />
                Importuj / Eksportuj
              </button>

              <button
                onClick={handleViewProgress}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                } ${fontSizes.buttonText}`}
              >
                <FaChartBar />
                Moje statystyki
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    {totalSets}
                  </p>
                  <p className={`${fontSizes.statLabel} ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Zestawy fiszek
                  </p>
                </div>
                <FaBook className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                    {totalCards}
                  </p>
                  <p className={`${fontSizes.statLabel} ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Łącznie fiszek
                  </p>
                </div>
                <span className={`text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'}`}>📇</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    {studiedToday}
                  </p>
                  <p className={`${fontSizes.statLabel} ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    Dziś przećwiczono
                  </p>
                </div>
                <span className={`text-3xl ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>✅</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${fontSizes.statValue} font-bold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                    {studyStreak} dni
                  </p>
                  <p className={`${fontSizes.statLabel} ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Passa nauki
                  </p>
                </div>
                <FaFire className={`text-3xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Wyszukaj zestawy po nazwie, opisie lub tagach..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${fontSizes.buttonText}`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${fontSizes.buttonText}`}
                >
                  <option value="wszystkie">Wszystkie kategorie</option>
                  <option value="Anatomia">Anatomia</option>
                  <option value="Fizjologia">Fizjologia</option>
                  <option value="Biochemia">Biochemia</option>
                  <option value="Farmakologia">Farmakologia</option>
                  <option value="Kardiologia">Kardiologia</option>
                  <option value="Neurologia">Neurologia</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={`px-3 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${fontSizes.buttonText}`}
              >
                <option value="wszystkie">Wszystkie poziomy</option>
                <option value="Łatwy">Łatwy</option>
                <option value="Średni">Średni</option>
                <option value="Trudny">Trudny</option>
              </select>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <FaSort className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${fontSizes.buttonText}`}
                >
                  <option value="lastStudied">Ostatnio używane</option>
                  <option value="title">Alfabetycznie</option>
                  <option value="created">Data utworzenia</option>
                  <option value="progress">Postęp</option>
                  <option value="cardCount">Liczba fiszek</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flashcard Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSets.map(set => (
              <div
                key={set.id}
                className={`rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                } shadow-lg hover:shadow-xl`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 mr-4">
                      {set.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h3 className={`${fontSizes.cardTitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {set.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(set.difficulty)}`}>
                        {set.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {set.isPublic && (
                    <span className="text-sm text-blue-500">🌍</span>
                  )}
                </div>

                {/* Description */}
                <p className={`${fontSizes.cardText} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
                  {set.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`${fontSizes.cardText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      📇 {set.cardCount} fiszek • {set.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Ostatnio: {set.lastStudied}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {set.progress}% opanowane
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${set.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {set.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                  {set.tags.length > 3 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      +{set.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStudySet(set.id)}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black text-sm flex items-center justify-center gap-1`}
                  >
                    <FaPlay className="text-xs" />
                    Ucz się
                  </button>
                  
                  <button
                    onClick={() => handleEditSet(set.id)}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <FaEdit />
                  </button>
                  
                  <button
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedSets.length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-4">📇</div>
              <h3 className={`${fontSizes.cardTitle} font-semibold mb-2`}>
                Brak zestawów fiszek
              </h3>
              <p className={`${fontSizes.cardText} mb-6`}>
                {searchTerm || selectedCategory !== 'wszystkie' || selectedDifficulty !== 'wszystkie'
                  ? 'Nie znaleziono zestawów pasujących do filtrów'
                  : 'Utwórz swój pierwszy zestaw fiszek aby rozpocząć naukę'}
              </p>
              {!searchTerm && selectedCategory === 'wszystkie' && selectedDifficulty === 'wszystkie' && (
                <button
                  onClick={handleCreateNew}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black ${fontSizes.buttonText}`}
                >
                  Utwórz pierwszy zestaw
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Import/Export Modal */}
      {showImportExport && selectedSetForImportExport && (
        <FlashcardImportExport
          darkMode={darkMode}
          fontSize={fontSize}
          cards={[]} // Mock - w produkcji pobierz karty z zestawu
          onImport={(cards) => {
            // Handle import (w produkcji zapisz do bazy)
            console.log('Imported cards:', cards);
            setShowImportExport(false);
          }}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </MainLayout>
  );
};

export default FlashcardLibrary;