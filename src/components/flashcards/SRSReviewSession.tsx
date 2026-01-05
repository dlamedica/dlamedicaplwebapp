import React, { useState, useEffect, useRef } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaArrowRight, 
  FaArrowLeft,
  FaClock,
  FaChartLine,
  FaFire,
  FaTimesCircle,
  FaCheckCircle,
  FaQuestionCircle,
  FaThumbsUp,
  FaThumbsDown
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import {
  calculateSRS,
  initializeSRSProgress,
  type SRSProgress,
  type ReviewResult,
  calculateSRSStats,
  type SRSStats
} from '../../services/srsService';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
}

interface SRSReviewSessionProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  cards: Flashcard[];
  onComplete: (stats: SRSStats) => void;
  onClose: () => void;
}

const SRSReviewSession: React.FC<SRSReviewSessionProps> = ({ 
  darkMode, 
  fontSize, 
  cards,
  onComplete,
  onClose 
}) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progressMap, setProgressMap] = useState<Map<string, SRSProgress>>(new Map());
  const [reviewHistory, setReviewHistory] = useState<Array<{ cardId: string; quality: number }>>([]);
  const [startTime] = useState(Date.now());
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
    timeSpent: 0
  });

  // Load progress from localStorage (w produkcji z API)
  useEffect(() => {
    if (!user) return;

    const savedProgress = localStorage.getItem(`srs_progress_${user.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const map = new Map<string, SRSProgress>();
      progress.forEach((p: SRSProgress) => {
        map.set(p.cardId, { ...p, nextReview: new Date(p.nextReview), lastReview: p.lastReview ? new Date(p.lastReview) : undefined });
      });
      setProgressMap(map);
    }
  }, [user]);

  // Initialize progress for cards without progress
  useEffect(() => {
    if (!user) return;

    const newProgress = new Map(progressMap);
    cards.forEach(card => {
      if (!newProgress.has(card.id)) {
        const progress = initializeSRSProgress(user.id, card.id);
        newProgress.set(card.id, progress);
      }
    });
    setProgressMap(newProgress);
  }, [cards, user, progressMap]);

  // Get current card
  const currentCard = cards[currentIndex];
  const currentProgress = currentCard ? progressMap.get(currentCard.id) : null;

  // Check if card is due
  const isDue = currentProgress 
    ? new Date(currentProgress.nextReview) <= new Date()
    : true;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleQuality = (quality: number) => {
    if (!currentCard || !currentProgress || !user) return;

    const result = calculateSRS(currentProgress, quality);
    
    // Update progress
    const updatedProgress: SRSProgress = {
      ...currentProgress,
      easeFactor: result.newEaseFactor,
      interval: result.newInterval,
      repetitions: result.newRepetitions,
      nextReview: result.nextReview,
      lastReview: new Date(),
      reviewCount: currentProgress.reviewCount + 1,
      correctCount: quality >= 3 ? currentProgress.correctCount + 1 : currentProgress.correctCount,
      incorrectCount: quality < 3 ? currentProgress.incorrectCount + 1 : currentProgress.incorrectCount,
      streak: quality >= 3 ? currentProgress.streak + 1 : 0,
      quality: quality,
    };

    const newProgressMap = new Map(progressMap);
    newProgressMap.set(currentCard.id, updatedProgress);
    setProgressMap(newProgressMap);

    // Save to localStorage (w produkcji do API)
    const progressArray = Array.from(newProgressMap.values());
    localStorage.setItem(`srs_progress_${user.id}`, JSON.stringify(progressArray));

    // Update review history
    setReviewHistory([...reviewHistory, { cardId: currentCard.id, quality }]);

    // Update session stats
    const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: quality >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
      timeSpent: prev.timeSpent + timeSpent
    }));

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setCardStartTime(Date.now());
    } else {
      // Session complete
      const stats = calculateSRSStats(Array.from(newProgressMap.values()), cards.length);
      onComplete(stats);
    }
  };

  const getQualityButtons = () => {
    const buttons = [
      { quality: 0, label: 'Zapomniałem', icon: FaTimesCircle, color: 'bg-red-500', text: 'text-white' },
      { quality: 1, label: 'Bardzo trudne', icon: FaThumbsDown, color: 'bg-orange-500', text: 'text-white' },
      { quality: 2, label: 'Trudne', icon: FaQuestionCircle, color: 'bg-yellow-500', text: 'text-white' },
      { quality: 3, label: 'Dobrze', icon: FaCheckCircle, color: 'bg-blue-500', text: 'text-white' },
      { quality: 4, label: 'Łatwe', icon: FaThumbsUp, color: 'bg-green-500', text: 'text-white' },
      { quality: 5, label: 'Bardzo łatwe', icon: FaCheck, color: 'bg-emerald-500', text: 'text-white' },
    ];

    return buttons;
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  if (!currentCard) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Brak fiszek do powtórki
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const timeSpent = Math.floor((Date.now() - cardStartTime) / 1000);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} px-6 py-4 shadow-sm`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <FaTimes />
            </button>
            <div>
              <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Powtórka SRS
              </h2>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Fiszka {currentIndex + 1} z {cards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <FaClock />
              <span className={fontSizes.text}>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </div>
            {currentProgress && (
              <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaFire className={currentProgress.streak > 0 ? 'text-orange-500' : ''} />
                <span className={fontSizes.text}>Streak: {currentProgress.streak}</span>
              </div>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Card */}
        <div className={`mb-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
          {/* Front */}
          <div className="p-8 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                Pytanie
              </span>
            </div>
            <div 
              className={`${fontSizes.subtitle} ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}
              style={{ minHeight: '150px' }}
            >
              {currentCard.front}
            </div>
            {currentCard.hint && !showAnswer && (
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'} italic`}>
                  💡 Podpowiedź: {currentCard.hint}
                </p>
              </div>
            )}
            {!showAnswer && (
              <button
                onClick={handleShowAnswer}
                className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] ${fontSizes.button}`}
              >
                Pokaż odpowiedź
              </button>
            )}
          </div>

          {/* Back */}
          {showAnswer && (
            <div className="p-8">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  Odpowiedź
                </span>
              </div>
              <div 
                className={`${fontSizes.subtitle} ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}
                style={{ minHeight: '150px' }}
              >
                {currentCard.back}
              </div>
              {currentCard.explanation && (
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    📚 Wyjaśnienie: {currentCard.explanation}
                  </p>
                </div>
              )}

              {/* SRS Info */}
              {currentProgress && (
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interwał</p>
                      <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentProgress.interval} {currentProgress.interval === 1 ? 'dzień' : 'dni'}
                      </p>
                    </div>
                    <div>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powtórki</p>
                      <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentProgress.repetitions}
                      </p>
                    </div>
                    <div>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ease Factor</p>
                      <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentProgress.easeFactor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Buttons */}
              <div className="mt-8">
                <p className={`${fontSizes.text} mb-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Jak dobrze pamiętałeś odpowiedź?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getQualityButtons().map(btn => (
                    <button
                      key={btn.quality}
                      onClick={() => handleQuality(btn.quality)}
                      className={`${btn.color} ${btn.text} p-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center gap-2 ${fontSizes.button}`}
                    >
                      <btn.icon size={24} />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Session Stats */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Statystyki sesji
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Przejrzane</p>
              <p className={`${fontSizes.subtitle} font-bold text-[#38b6ff]`}>{sessionStats.reviewed}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poprawne</p>
              <p className={`${fontSizes.subtitle} font-bold text-green-500`}>{sessionStats.correct}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Błędne</p>
              <p className={`${fontSizes.subtitle} font-bold text-red-500`}>{sessionStats.incorrect}</p>
            </div>
            <div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Czas</p>
              <p className={`${fontSizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.floor(sessionStats.timeSpent / 60)}:{(sessionStats.timeSpent % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRSReviewSession;

