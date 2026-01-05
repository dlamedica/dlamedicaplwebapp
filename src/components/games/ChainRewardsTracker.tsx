import React, { useState, useEffect } from 'react';
import { FaGift, FaTrophy, FaStar } from 'react-icons/fa';

interface ChainRewardsTrackerProps {
  darkMode: boolean;
  currentStreak?: number;
  nextReward?: number;
}

const ChainRewardsTracker: React.FC<ChainRewardsTrackerProps> = ({
  darkMode,
  currentStreak = 0,
  nextReward = 5,
}) => {
  const [streak, setStreak] = useState(currentStreak);

  useEffect(() => {
    // W rzeczywistości pobierz z localStorage lub API
    const savedStreak = localStorage.getItem('purchase_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
  }, []);

  if (streak === 0) return null;

  const progress = (streak % nextReward) / nextReward;
  const nextMilestone = Math.ceil(streak / nextReward) * nextReward;

  return (
    <div className={`mb-6 p-4 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaTrophy className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} size={20} />
          <div>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Seria zakupów!
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {streak} {streak === 1 ? 'zakup' : streak < 5 ? 'zakupy' : 'zakupów'} z rzędu
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <FaStar className="text-yellow-500" size={16} />
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {streak}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Do następnej nagrody:
          </span>
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {nextMilestone - streak} {nextMilestone - streak === 1 ? 'zakup' : 'zakupów'}
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all duration-500 ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {nextMilestone - streak <= 2 && (
          <p className={`text-xs mt-2 text-center ${
            darkMode ? 'text-yellow-400' : 'text-purple-600'
          }`}>
            <FaGift className="inline mr-1" />
            Prawie masz nagrodę! Kup jeszcze {nextMilestone - streak} {nextMilestone - streak === 1 ? 'produkt' : 'produkty'}!
          </p>
        )}
      </div>
    </div>
  );
};

export default ChainRewardsTracker;
