import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaGraduationCap, 
  FaEdit, 
  FaCheckSquare, 
  FaPuzzlePiece, 
  FaRocket,
  FaChartLine,
  FaFire,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { calculateSRSStats, getDueCards, getNewCards, type SRSProgress, type SRSStats } from '../../services/srsService';
import SRSReviewSession from './SRSReviewSession';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
}

interface StudyModeSelectionProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setId?: string;
  cards?: Flashcard[];
  onClose?: () => void;
}

const StudyModeSelection: React.FC<StudyModeSelectionProps> = ({ 
  darkMode, 
  fontSize, 
  setId,
  cards: providedCards,
  onClose 
}) => {
  const { user } = useAuth();
  const [showSRS, setShowSRS] = useState(false);
  const [srsStats, setSrsStats] = useState<SRSStats | null>(null);
  const [progress, setProgress] = useState<SRSProgress[]>([]);
  const [cards, setCards] = useState<Flashcard[]>(providedCards || []);
  const [loading, setLoading] = useState(!providedCards);

  // Load cards if setId provided
  useEffect(() => {
    if (setId && !providedCards) {
      // Load cards from localStorage or API (mock for now)
      const mockCards: Flashcard[] = [
        { id: '1', front: 'Co to jest mitochondrium?', back: 'Organella komórkowa odpowiedzialna za produkcję ATP', hint: 'Związane z energią', explanation: 'Mitochondria zawierają własne DNA' },
        { id: '2', front: 'Ile komór ma serce?', back: 'Cztery komory: dwa przedsionki i dwie komory' },
        { id: '3', front: 'Funkcja erytrocytów?', back: 'Transport tlenu i CO2', hint: 'Związane z transportem gazów' },
      ];
      setCards(mockCards);
      setLoading(false);
    }
  }, [setId, providedCards]);

  useEffect(() => {
    if (!user || cards.length === 0) return;

    // Load progress from localStorage (w produkcji z API)
    const savedProgress = localStorage.getItem(`srs_progress_${user.id}`);
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress).map((p: any) => ({
        ...p,
        nextReview: new Date(p.nextReview),
        lastReview: p.lastReview ? new Date(p.lastReview) : undefined
      }));
      setProgress(progressData);

      // Calculate stats
      const stats = calculateSRSStats(progressData, cards.length);
      setSrsStats(stats);
    } else {
      // Initialize stats
      const stats = calculateSRSStats([], cards.length);
      setSrsStats(stats);
    }
  }, [user, cards.length]);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  // Get cards for SRS review
  const getCardsForReview = () => {
    const dueCards = getDueCards(progress, 20);
    const newCardsList = getNewCards(
      cards.map(c => c.id),
      progress,
      20
    );

    // Combine due and new cards
    const dueCardIds = new Set(dueCards.map(c => c.cardId));
    const newCardIds = newCardsList.slice(0, 20 - dueCards.length);
    
    const reviewCards = [
      ...dueCards.map(c => cards.find(card => card.id === c.cardId)).filter(Boolean) as Flashcard[],
      ...newCardIds.map(id => cards.find(card => card.id === id)).filter(Boolean) as Flashcard[]
    ];

    return reviewCards;
  };

  const handleStartSRS = () => {
    setShowSRS(true);
  };

  const handleSRSComplete = (stats: SRSStats) => {
    setSrsStats(stats);
    setShowSRS(false);
    // Reload progress
    if (user) {
      const savedProgress = localStorage.getItem(`srs_progress_${user.id}`);
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress).map((p: any) => ({
          ...p,
          nextReview: new Date(p.nextReview),
          lastReview: p.lastReview ? new Date(p.lastReview) : undefined
        }));
        setProgress(progressData);
      }
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.pushState({}, '', '/fiszki');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  if (showSRS) {
    const reviewCards = getCardsForReview();
    if (reviewCards.length === 0) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`max-w-md mx-auto p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Brak fiszek do powtórki! 🎉
            </h2>
            <p className={`${fontSizes.text} mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wszystkie fiszki zostały przejrzane. Wróć później!
            </p>
            <button
              onClick={() => setShowSRS(false)}
              className="px-6 py-3 bg-[#38b6ff] text-white rounded-lg font-semibold hover:bg-[#2a9fe5]"
            >
              Powrót
            </button>
          </div>
        </div>
      );
    }

    return (
      <SRSReviewSession
        darkMode={darkMode}
        fontSize={fontSize}
        cards={reviewCards}
        onComplete={handleSRSComplete}
        onClose={() => setShowSRS(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleClose}
            className={`mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FaArrowLeft />
            <span className={fontSizes.text}>Powrót</span>
          </button>
          <h1 className={`${fontSizes.title} font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Wybierz tryb nauki
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {cards.length} fiszek w zestawie
          </p>
        </div>

        {/* SRS Stats */}
        {srsStats && (
          <div className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Statystyki SRS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nowe</p>
                <p className={`${fontSizes.subtitle} font-bold text-[#38b6ff]`}>{srsStats.newCards}</p>
              </div>
              <div className="text-center">
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Do powtórki</p>
                <p className={`${fontSizes.subtitle} font-bold text-orange-500`}>{srsStats.cardsDueToday}</p>
              </div>
              <div className="text-center">
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Opanowane</p>
                <p className={`${fontSizes.subtitle} font-bold text-green-500`}>{srsStats.masteredCards}</p>
              </div>
              <div className="text-center">
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Retencja</p>
                <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {srsStats.retentionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Study Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SRS Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-2 border-[#38b6ff]' : 'bg-white border-2 border-[#38b6ff]'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#38b6ff] text-white">
                <FaRocket size={24} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Powtórka SRS
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Inteligentne powtórki
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Algorytm automatycznie planuje powtórki na podstawie zapamiętywania. Najbardziej efektywny sposób nauki!
            </p>
            {srsStats && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Nowe karty:</span>
                  <span className="font-semibold text-[#38b6ff]">{srsStats.newCards}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Do powtórki:</span>
                  <span className="font-semibold text-orange-500">{srsStats.cardsDueToday}</span>
                </div>
              </div>
            )}
            <button
              onClick={handleStartSRS}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] ${fontSizes.button}`}
            >
              <FaRocket className="inline mr-2" />
              Rozpocznij powtórkę SRS
            </button>
          </div>

          {/* Classic Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaPlay size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Klasyczny
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Prosta powtórka
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tradycyjny tryb nauki - przejrzyj wszystkie fiszki w kolejności.
            </p>
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } ${fontSizes.button}`}
            >
              <FaPlay className="inline mr-2" />
              Rozpocznij (Wkrótce)
            </button>
          </div>

          {/* Learn Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaGraduationCap size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Nauka
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Uczenie się nowych
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Skup się tylko na nowych fiszkach, które jeszcze nie były powtarzane.
            </p>
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } ${fontSizes.button}`}
            >
              <FaGraduationCap className="inline mr-2" />
              Rozpocznij (Wkrótce)
            </button>
          </div>

          {/* Write Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaEdit size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pisanie
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Wpisz odpowiedź
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wpisz odpowiedź zamiast wybierać - bardziej wymagający tryb nauki.
            </p>
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } ${fontSizes.button}`}
            >
              <FaEdit className="inline mr-2" />
              Rozpocznij (Wkrótce)
            </button>
          </div>

          {/* Test Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaCheckSquare size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Test
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sprawdź wiedzę
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Test z oceną - sprawdź swoją wiedzę bez podpowiedzi.
            </p>
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } ${fontSizes.button}`}
            >
              <FaCheckSquare className="inline mr-2" />
              Rozpocznij (Wkrótce)
            </button>
          </div>

          {/* Match Mode */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaPuzzlePiece size={24} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
              </div>
              <div>
                <h3 className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dopasuj
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gra dopasowywania
                </p>
              </div>
            </div>
            <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Dopasuj pytania do odpowiedzi - interaktywna gra edukacyjna.
            </p>
            <button
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } ${fontSizes.button}`}
            >
              <FaPuzzlePiece className="inline mr-2" />
              Rozpocznij (Wkrótce)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyModeSelection;

