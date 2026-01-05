/**
 * Komponent tablicy misji
 * Wyświetla aktywne misje i postęp użytkownika
 */

import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaCheckCircle, FaCircle, FaGift, FaTrophy, FaShoppingCart, FaHeart, FaShare, FaUserPlus } from 'react-icons/fa';

interface QuestBoardProps {
  darkMode?: boolean;
  compact?: boolean;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ darkMode = false, compact = false }) => {
  const { userQuests, refreshQuests, loading } = useGame();

  useEffect(() => {
    refreshQuests();
  }, [refreshQuests]);

  // Ikony dla typów misji
  const questIcons: { [key: string]: any } = {
    purchase: FaShoppingCart,
    purchase_amount: FaShoppingCart,
    add_to_cart: FaShoppingCart,
    add_to_wishlist: FaHeart,
    review: FaGift,
    share: FaShare,
    referral: FaUserPlus,
    daily_checkin: FaCheckCircle,
    level_up: FaTrophy,
  };

  // Nazwy typów misji
  const questTypeNames: { [key: string]: string } = {
    purchase: 'Zakupy',
    purchase_amount: 'Wartość zakupów',
    add_to_cart: 'Dodaj do koszyka',
    add_to_wishlist: 'Dodaj do ulubionych',
    review: 'Recenzje',
    share: 'Udostępnienia',
    referral: 'Polecenia',
    daily_checkin: 'Codzienne logowanie',
    level_up: 'Awans poziomu',
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg h-40`}></div>
    );
  }

  if (userQuests.length === 0) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Brak aktywnych misji w tym momencie
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Aktywne misje
        </h3>
        <div className="space-y-2">
          {userQuests.slice(0, 3).map((userQuest) => {
            const Icon = questIcons[userQuest.quest.quest_type] || FaCircle;
            const progress = (userQuest.current_progress / userQuest.target_progress) * 100;

            return (
              <div
                key={userQuest.quest.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Icon className={`text-lg mr-2 ${darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userQuest.quest.title}
                    </span>
                  </div>
                  {userQuest.is_completed ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userQuest.current_progress} / {userQuest.target_progress}
                    </span>
                  )}
                </div>
                {!userQuest.is_completed && (
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
          <FaTrophy className="text-white text-2xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Misje i wyzwania
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Ukończ misje i zdobądź nagrody!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {userQuests.map((userQuest) => {
          const Icon = questIcons[userQuest.quest.quest_type] || FaCircle;
          const progress = (userQuest.current_progress / userQuest.target_progress) * 100;
          const isCompleted = userQuest.is_completed;

          return (
            <div
              key={userQuest.quest.id}
              className={`p-4 rounded-lg border-2 ${
                isCompleted
                  ? darkMode
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-green-50 border-green-500'
                  : darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start flex-1">
                  <Icon
                    className={`text-2xl mr-3 mt-1 ${
                      isCompleted
                        ? 'text-green-500'
                        : darkMode
                        ? 'text-[#38b6ff]'
                        : 'text-[#38b6ff]'
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userQuest.quest.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userQuest.quest.description}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {questTypeNames[userQuest.quest.quest_type] || userQuest.quest.quest_type}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
                )}
              </div>

              {/* Postęp */}
              {!isCompleted && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Postęp
                    </span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userQuest.current_progress} / {userQuest.target_progress}
                    </span>
                  </div>
                  <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Nagroda */}
              <div className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="flex items-center">
                  <FaGift className={`text-lg mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nagroda:
                  </span>
                </div>
                <span className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {userQuest.quest.reward_points} punktów
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestBoard;

