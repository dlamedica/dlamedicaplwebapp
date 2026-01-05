/**
 * Komponent DailyChallenge - Codzienne Wyzwania
 * Różne wyzwania każdego dnia, które zachęcają do zakupów
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaTrophy, FaCheckCircle, FaGift, FaShoppingCart, FaHeart, FaShare, FaStar } from 'react-icons/fa';
import UrgencyTimer from './UrgencyTimer';

interface DailyChallengeProps {
  darkMode?: boolean;
  compact?: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'purchase' | 'cart' | 'wishlist' | 'share' | 'review' | 'category';
  target: number;
  current: number;
  reward: {
    points: number;
    discount?: number;
    code?: string;
  };
  icon: any;
  color: string;
  completed: boolean;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ darkMode = false, compact = false }) => {
  const { userPoints } = useGame();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // Generuj codzienne wyzwania (w rzeczywistości z bazy danych)
  useEffect(() => {
    const today = new Date().getDay(); // 0 = niedziela, 6 = sobota
    
    const dailyChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Kup produkt z kategorii Anatomia',
        description: 'Dodaj do koszyka produkt z kategorii Anatomia',
        type: 'category',
        target: 1,
        current: 0,
        reward: { points: 100, discount: 10, code: 'ANATOMY10' },
        icon: FaShoppingCart,
        color: '#38b6ff',
        completed: false,
      },
      {
        id: '2',
        title: 'Dodaj 3 produkty do koszyka',
        description: 'Zbierz 3 produkty w koszyku',
        type: 'cart',
        target: 3,
        current: 0, // W rzeczywistości z koszyka
        reward: { points: 50 },
        icon: FaShoppingCart,
        color: '#10b981',
        completed: false,
      },
      {
        id: '3',
        title: 'Dodaj 2 produkty do ulubionych',
        description: 'Zapisz produkty do wishlisty',
        type: 'wishlist',
        target: 2,
        current: 0, // W rzeczywistości z wishlisty
        reward: { points: 25 },
        icon: FaHeart,
        color: '#ef4444',
        completed: false,
      },
      {
        id: '4',
        title: 'Udostępnij produkt',
        description: 'Udostępnij dowolny produkt w mediach społecznościowych',
        type: 'share',
        target: 1,
        current: 0,
        reward: { points: 30, discount: 5, code: 'SHARE5' },
        icon: FaShare,
        color: '#8b5cf6',
        completed: false,
      },
    ];

    // Rotacja wyzwań w zależności od dnia tygodnia
    const selectedChallenges = dailyChallenges.slice(0, 3);
    setChallenges(selectedChallenges);
  }, []);

  const expiresAt = new Date();
  expiresAt.setHours(23, 59, 59, 999); // Koniec dnia

  if (compact) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <FaTrophy className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dzisiejsze wyzwanie
          </h3>
        </div>
        {challenges.length > 0 && (
          <div className="space-y-2">
            {challenges.slice(0, 1).map((challenge) => {
              const Icon = challenge.icon;
              const progress = (challenge.current / challenge.target) * 100;
              return (
                <div key={challenge.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {challenge.title}
                    </span>
                    <span className={`text-xs font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {challenge.reward.points} pkt
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: challenge.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg`}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
          <FaTrophy className="text-white text-2xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Codzienne Wyzwania
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Ukończ wyzwania i zdobądź nagrody!
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <UrgencyTimer
          expiresAt={expiresAt}
          darkMode={darkMode}
          variant="compact"
          message="Wyzwania resetują się za:"
        />
      </div>

      {/* Progress */}
      <div className={`p-4 rounded-lg mb-6 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ukończone wyzwania
          </span>
          <span className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {completedCount} / {challenges.length}
          </span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden mt-2 ${
          darkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
            style={{ width: `${(completedCount / challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const progress = (challenge.current / challenge.target) * 100;
          const isCompleted = challenge.completed || progress >= 100;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 ${
                isCompleted
                  ? darkMode
                    ? 'bg-green-900/20 border-green-500'
                    : 'bg-green-50 border-green-500'
                  : darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500' : ''
                  }`}
                  style={!isCompleted ? { backgroundColor: challenge.color + '20' } : {}}
                >
                  {isCompleted ? (
                    <FaCheckCircle className="text-white text-xl" />
                  ) : (
                    <Icon className="text-xl" style={{ color: challenge.color }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.title}
                    </h4>
                    {isCompleted && (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        darkMode ? 'bg-green-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        UKOŃCZONE
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.description}
                  </p>

                  {/* Progress */}
                  {!isCompleted && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Postęp
                        </span>
                        <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {challenge.current} / {challenge.target}
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: challenge.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Reward */}
                  <div className={`p-2 rounded ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nagroda:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          {challenge.reward.points} punktów
                        </span>
                        {challenge.reward.discount && challenge.reward.code && (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                          }`}>
                            + {challenge.reward.discount}% rabat
                          </span>
                        )}
                      </div>
                    </div>
                    {challenge.reward.code && (
                      <p className={`text-xs mt-1 font-mono text-center ${
                        darkMode ? 'text-green-300' : 'text-green-700'
                      }`}>
                        Kod: {challenge.reward.code}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className={`mt-4 p-3 rounded-lg ${
        darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
      }`}>
        <p className={`text-xs text-center ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          💡 Wyzwania resetują się codziennie o północy. Ukończ wszystkie, aby otrzymać bonusową nagrodę!
        </p>
      </div>
    </div>
  );
};

export default DailyChallenge;

