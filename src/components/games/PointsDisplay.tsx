/**
 * Komponent wyświetlający punkty i poziom użytkownika
 */

import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaCoins, FaTrophy, FaChartLine } from 'react-icons/fa';

interface PointsDisplayProps {
  darkMode?: boolean;
  compact?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ darkMode = false, compact = false }) => {
  const { userPoints, loading } = useGame();

  if (loading || !userPoints) {
    return (
      <div className={`animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg h-20`}></div>
    );
  }

  const progressPercentage = (userPoints.experience / userPoints.experience_to_next_level) * 100;

  // Nazwy poziomów
  const levelNames: { [key: number]: string } = {
    1: 'Nowicjusz',
    2: 'Student',
    3: 'Absolwent',
    4: 'Doktor',
    5: 'Profesor',
  };

  const levelName = levelNames[userPoints.level] || `Poziom ${userPoints.level}`;

  if (compact) {
    return (
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCoins className={`text-2xl mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkty</p>
              <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userPoints.available_points.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poziom</p>
            <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userPoints.level} - {levelName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
          <FaCoins className="text-white text-2xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Twoje punkty
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Zbieraj punkty i awansuj na wyższe poziomy!
          </p>
        </div>
      </div>

      {/* Punkty */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Dostępne
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {userPoints.available_points.toLocaleString()}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Wydane
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {userPoints.spent_points.toLocaleString()}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Łącznie
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {userPoints.total_points.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Poziom */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FaTrophy className={`text-xl mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {levelName} (Poziom {userPoints.level})
            </span>
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {userPoints.experience} / {userPoints.experience_to_next_level} EXP
          </span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statystyki */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-2">
          <FaChartLine className={`text-lg mr-2 ${darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'}`} />
          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Statystyki
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Zakupy
            </p>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userPoints.total_purchases}
            </p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Wydane łącznie
            </p>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {userPoints.total_spent.toFixed(2)} PLN
            </p>
          </div>
        </div>
      </div>

      {/* Informacja o wymianie */}
      <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-sm text-center ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          💡 100 punktów = 1 PLN rabatu
        </p>
      </div>
    </div>
  );
};

export default PointsDisplay;

