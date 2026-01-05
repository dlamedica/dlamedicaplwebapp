import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layout/MainLayout';
import { 
  FaArrowLeft, 
  FaSave, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaCopy, 
  FaImage, 
  FaMicrophone, 
  FaEye, 
  FaBold, 
  FaItalic, 
  FaUnderline,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
  difficulty: number; // 1-5 stars
  frontImage?: string;
  backImage?: string;
  frontAudio?: string;
  backAudio?: string;
}

interface FlashcardEditorProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ darkMode, fontSize }) => {
  const [setId] = useState(1); // Mock set ID from URL params
  const [setTitle] = useState("Anatomia układu krążenia");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showFront, setShowFront] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = `Edytuj fiszki: ${setTitle} – DlaMedica.pl`;
    
    // Mock flashcards data
    const mockCards: Flashcard[] = [
      {
        id: 1,
        front: "Co to jest mitochondrium?",
        back: "Organella komórkowa odpowiedzialna za produkcję ATP w procesie oddychania komórkowego. Nazywana 'elektrownią komórki'.",
        hint: "Związane z energią komórki",
        explanation: "Mitochondria zawierają własne DNA i są prawdopodobnie pochodzenia bakteryjnego (teoria endosymbiotyczna).",
        difficulty: 3
      },
      {
        id: 2,
        front: "Ile komór ma serce człowieka?",
        back: "Cztery komory: dwa przedsionki (prawy i lewy) oraz dwie komory (prawa i lewa).",
        difficulty: 2
      },
      {
        id: 3,
        front: "Jaka jest główna funkcja erytrocytów?",
        back: "Transport tlenu z płuc do tkanek oraz dwutlenku węgla z tkanek do płuc.",
        hint: "Związane z transportem gazów",
        difficulty: 2
      }
    ];
    
    setCards(mockCards);
  }, [setTitle]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      handleAutoSave();
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [cards]);

  const handleAutoSave = () => {
    // TODO: Save to database
    setLastSaved(new Date());
    console.log('Auto-saved flashcards at:', new Date());
  };

  const handleGoBack = () => {
    window.history.pushState({}, '', '/fiszki');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleCardUpdate = (field: keyof Flashcard, value: string | number) => {
    if (cards.length === 0) return;

    const updatedCards = [...cards];
    updatedCards[selectedCardIndex] = {
      ...updatedCards[selectedCardIndex],
      [field]: value
    };
    setCards(updatedCards);
  };

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: Date.now(),
      front: '',
      back: '',
      difficulty: 3
    };
    setCards([...cards, newCard]);
    setSelectedCardIndex(cards.length);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) return; // Don't delete if it's the last card

    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    
    if (selectedCardIndex >= updatedCards.length) {
      setSelectedCardIndex(updatedCards.length - 1);
    }
  };

  const handleDuplicateCard = (index: number) => {
    const cardToDuplicate = cards[index];
    const duplicatedCard: Flashcard = {
      ...cardToDuplicate,
      id: Date.now(),
      front: cardToDuplicate.front + ' (kopia)',
      back: cardToDuplicate.back
    };
    const updatedCards = [...cards];
    updatedCards.splice(index + 1, 0, duplicatedCard);
    setCards(updatedCards);
    setSelectedCardIndex(index + 1);
  };

  const handleNavigateCard = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedCardIndex > 0) {
      setSelectedCardIndex(selectedCardIndex - 1);
    } else if (direction === 'next' && selectedCardIndex < cards.length - 1) {
      setSelectedCardIndex(selectedCardIndex + 1);
    }
  };

  const filteredCards = cards.filter(card => 
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-xl',
          subtitle: 'text-base',
          input: 'text-sm',
          button: 'text-sm',
          sidebar: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          input: 'text-lg',
          button: 'text-lg',
          sidebar: 'text-base'
        };
      default:
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          input: 'text-base',
          button: 'text-base',
          sidebar: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();
  const currentCard = cards[selectedCardIndex];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`px-8 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className={`flex items-center gap-2 ${fontSizes.button} ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              <FaArrowLeft />
              Powrót do biblioteki
            </button>
            
            <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
              <h1 className={`${fontSizes.title} font-bold`}>
                Edytuj: {setTitle}
              </h1>
              <p className={`${fontSizes.sidebar} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {cards.length} fiszek • 
                {lastSaved ? ` Zapisano: ${lastSaved.toLocaleTimeString()}` : ' Nie zapisano'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
              } ${fontSizes.button}`}
            >
              <FaEye />
              {isPreviewMode ? 'Edytuj' : 'Podgląd'}
            </button>

            <button
              onClick={handleAutoSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black ${fontSizes.button}`}
            >
              <FaSave />
              Zapisz
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`w-80 border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`${fontSizes.subtitle} font-semibold`}>
                Lista fiszek ({cards.length})
              </h2>
              <button
                onClick={handleAddCard}
                className={`p-2 rounded-lg transition-colors bg-[#38b6ff] hover:bg-[#2a9fe5] text-black`}
                title="Dodaj nową fiszkę"
              >
                <FaPlus />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Wyszukaj fiszkę..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } ${fontSizes.sidebar}`}
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCards.map((card, index) => {
              const actualIndex = cards.findIndex(c => c.id === card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardIndex(actualIndex)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    actualIndex === selectedCardIndex
                      ? darkMode 
                        ? 'bg-blue-900/50 border-blue-700' 
                        : 'bg-blue-50 border-blue-200'
                      : darkMode
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`${fontSizes.sidebar} font-medium truncate mb-1`}>
                        {card.front || 'Nowa fiszka'}
                      </p>
                      <p className={`${fontSizes.sidebar} ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                        {card.back || 'Brak odpowiedzi'}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`text-xs ${
                                star <= card.difficulty 
                                  ? 'text-yellow-400' 
                                  : darkMode ? 'text-gray-600' : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateCard(actualIndex);
                        }}
                        className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        title="Duplikuj"
                      >
                        <FaCopy className="text-xs" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(actualIndex);
                        }}
                        className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500`}
                        title="Usuń"
                        disabled={cards.length <= 1}
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Editor Panel */}
        <div className="flex-1 flex flex-col">
          {/* Card Navigation */}
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigateCard('prev')}
                disabled={selectedCardIndex === 0}
                className={`p-2 rounded-lg transition-colors ${
                  selectedCardIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FaChevronLeft />
              </button>
              
              <span className={`${fontSizes.subtitle} font-medium`}>
                Fiszka {selectedCardIndex + 1} z {cards.length}
              </span>
              
              <button
                onClick={() => handleNavigateCard('next')}
                disabled={selectedCardIndex === cards.length - 1}
                className={`p-2 rounded-lg transition-colors ${
                  selectedCardIndex === cards.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FaChevronRight />
              </button>
            </div>

            {isPreviewMode && (
              <button
                onClick={() => setShowFront(!showFront)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                } ${fontSizes.button}`}
              >
                Pokaż {showFront ? 'tył' : 'przód'}
              </button>
            )}
          </div>

          {/* Card Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentCard && (
              isPreviewMode ? (
                // Preview Mode
                <div className="max-w-2xl mx-auto">
                  <div className={`p-8 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                  } shadow-lg min-h-[300px] flex items-center justify-center`}>
                    <div className="text-center">
                      <div className={`mb-4 ${fontSizes.subtitle} font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {showFront ? 'PRZÓD' : 'TYŁ'}
                      </div>
                      <div className={`${fontSizes.title} leading-relaxed`}>
                        {showFront ? currentCard.front : currentCard.back}
                      </div>
                      {!showFront && currentCard.hint && (
                        <div className={`mt-6 p-4 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <div className={`${fontSizes.sidebar} font-medium mb-2`}>💡 Wskazówka:</div>
                          <div className={fontSizes.input}>{currentCard.hint}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Front Side */}
                  <div>
                    <label className={`block ${fontSizes.subtitle} font-semibold mb-4`}>
                      Przód fiszki (pytanie/termin)
                    </label>
                    <div className="space-y-4">
                      <textarea
                        value={currentCard.front}
                        onChange={(e) => handleCardUpdate('front', e.target.value)}
                        placeholder="Wpisz pytanie lub termin..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${fontSizes.input}`}
                      />
                      
                      <div className="flex gap-2">
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } ${fontSizes.button}`}>
                          <FaImage />
                          Dodaj obraz
                        </button>
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } ${fontSizes.button}`}>
                          <FaMicrophone />
                          Dodaj audio
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div>
                    <label className={`block ${fontSizes.subtitle} font-semibold mb-4`}>
                      Tył fiszki (odpowiedź/definicja)
                    </label>
                    <div className="space-y-4">
                      <textarea
                        value={currentCard.back}
                        onChange={(e) => handleCardUpdate('back', e.target.value)}
                        placeholder="Wpisz odpowiedź lub definicję..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${fontSizes.input}`}
                      />
                      
                      <div className="flex gap-2">
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } ${fontSizes.button}`}>
                          <FaImage />
                          Dodaj obraz
                        </button>
                        <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } ${fontSizes.button}`}>
                          <FaMicrophone />
                          Dodaj audio
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hint */}
                    <div>
                      <label className={`block ${fontSizes.input} font-medium mb-2`}>
                        Wskazówka (opcjonalna)
                      </label>
                      <textarea
                        value={currentCard.hint || ''}
                        onChange={(e) => handleCardUpdate('hint', e.target.value)}
                        placeholder="Podpowiedź pomagająca w odpowiedzi..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${fontSizes.input}`}
                      />
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className={`block ${fontSizes.input} font-medium mb-2`}>
                        Dodatkowe wyjaśnienie
                      </label>
                      <textarea
                        value={currentCard.explanation || ''}
                        onChange={(e) => handleCardUpdate('explanation', e.target.value)}
                        placeholder="Szersze wyjaśnienie tematu..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none ${fontSizes.input}`}
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className={`block ${fontSizes.input} font-medium mb-4`}>
                      Trudność tej fiszki
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleCardUpdate('difficulty', star)}
                            className={`text-2xl transition-colors ${
                              star <= currentCard.difficulty 
                                ? 'text-yellow-400 hover:text-yellow-500' 
                                : darkMode 
                                  ? 'text-gray-600 hover:text-gray-500' 
                                  : 'text-gray-300 hover:text-gray-400'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      <span className={`${fontSizes.input} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentCard.difficulty}/5 gwiazdek
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardEditor;