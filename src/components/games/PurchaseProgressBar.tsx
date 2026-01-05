/**
 * Komponent PurchaseProgressBar - Wizualizacja postępu do następnej nagrody
 * Zachęca do zwiększenia wartości koszyka
 */

import React from 'react';
import { FaGift, FaCoins, FaTrophy } from 'react-icons/fa';
import { useGame } from '../../contexts/GameContext';
import { useCart } from '../../contexts/CartContext';

interface PurchaseProgressBarProps {
  darkMode?: boolean;
  targetAmount?: number; // Cel w PLN (opcjonalny, domyślnie 100)
  rewardType?: 'scratch_card' | 'points' | 'discount' | 'level_up';
  rewardDescription?: string;
}

const PurchaseProgressBar: React.FC<PurchaseProgressBarProps> = ({
  darkMode = false,
  targetAmount = 100,
  rewardType = 'scratch_card',
  rewardDescription,
}) => {
  const { getTotalPrice } = useCart();
  const { userPoints } = useGame();

  const currentAmount = getTotalPrice();
  const progress = Math.min(100, (currentAmount / targetAmount) * 100);
  const remaining = Math.max(0, targetAmount - currentAmount);

  // Ikony dla różnych typów nagród
  const rewardIcons = {
    scratch_card: FaGift,
    points: FaCoins,
    discount: FaGift,
    level_up: FaTrophy,
  };

  const rewardLabels = {
    scratch_card: 'Kartę do zdrapywania',
    points: 'Bonusowe punkty',
    discount: 'Kod rabatowy',
    level_up: 'Awans poziomu',
  };

  const Icon = rewardIcons[rewardType];
  const rewardLabel = rewardDescription || rewardLabels[rewardType];

  if (progress >= 100) {
    return (
      <div className={`p-4 rounded-lg ${
        darkMode
          ? 'bg-green-900/20 border-2 border-green-500'
          : 'bg-green-50 border-2 border-green-500'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <FaGift className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              🎉 Gratulacje! Osiągnąłeś cel!
            </p>
            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              Po zakończeniu zakupu otrzymasz {rewardLabel.toLowerCase()}!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    } shadow-md`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          darkMode ? 'bg-purple-600' : 'bg-purple-500'
        }`}>
          <Icon className="text-white text-lg" />
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {remaining > 0 ? (
              <>
                Zostało <span className="text-[#38b6ff] font-bold">{remaining.toFixed(2)} PLN</span> do {rewardLabel.toLowerCase()}!
              </>
            ) : (
              <>Otrzymasz {rewardLabel.toLowerCase()}!</>
            )}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Aktualna wartość koszyka: {currentAmount.toFixed(2)} PLN / {targetAmount} PLN
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-4 rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div
          className="h-full bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] transition-all duration-500 relative"
          style={{ width: `${progress}%` }}
        >
          {progress > 10 && (
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {progress.toFixed(0)}% ukończone
        </span>
        {remaining > 0 && (
          <span className={`text-xs font-semibold ${darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'}`}>
            {remaining.toFixed(2)} PLN do celu
          </span>
        )}
      </div>

      {/* Suggestion */}
      {remaining > 0 && remaining < 50 && (
        <div className={`mt-3 p-2 rounded ${
          darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-xs text-center ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            💡 Dodaj jeszcze jeden produkt i otrzymaj nagrodę!
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchaseProgressBar;

