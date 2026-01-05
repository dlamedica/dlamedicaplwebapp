/**
 * Komponent LoyaltyProgram - Program Lojalnościowy
 * Statusy VIP z różnymi korzyściami
 */

import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaCrown, FaStar, FaGem, FaTrophy, FaCheckCircle } from 'react-icons/fa';

interface LoyaltyProgramProps {
  darkMode?: boolean;
  compact?: boolean;
}

interface LoyaltyTier {
  id: string;
  name: string;
  icon: any;
  color: string;
  minPurchases: number;
  minSpent: number;
  benefits: string[];
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ darkMode = false, compact = false }) => {
  const { userPoints } = useGame();

  const tiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Brązowy',
      icon: FaStar,
      color: '#cd7f32',
      minPurchases: 0,
      minSpent: 0,
      benefits: [
        '1 punkt za każde 1 PLN',
        'Dostęp do codziennych nagród',
        'Koło fortuny raz dziennie',
      ],
    },
    {
      id: 'silver',
      name: 'Srebrny',
      icon: FaGem,
      color: '#c0c0c0',
      minPurchases: 5,
      minSpent: 500,
      benefits: [
        '1.2 punktu za każde 1 PLN',
        'Wszystkie korzyści Brązowego',
        'Dodatkowe 10% punktów za zakupy',
        'Priorytetowa obsługa',
      ],
    },
    {
      id: 'gold',
      name: 'Złoty',
      icon: FaCrown,
      color: '#ffd700',
      minPurchases: 15,
      minSpent: 1500,
      benefits: [
        '1.5 punktu za każde 1 PLN',
        'Wszystkie korzyści Srebrnego',
        'Dodatkowe 20% punktów za zakupy',
        'Ekskluzywne oferty',
        'Darmowa dostawa',
      ],
    },
    {
      id: 'platinum',
      name: 'Platynowy',
      icon: FaTrophy,
      color: '#e5e4e2',
      minPurchases: 30,
      minSpent: 3000,
      benefits: [
        '2 punkty za każde 1 PLN',
        'Wszystkie korzyści Złotego',
        'Dodatkowe 30% punktów za zakupy',
        'Osobisty konsultant',
        'Darmowe produkty co miesiąc',
        'Wczesny dostęp do nowości',
      ],
    },
  ];

  // Określ aktualny status użytkownika
  const getCurrentTier = (): LoyaltyTier => {
    if (!userPoints) return tiers[0];

    const purchases = userPoints.total_purchases;
    const spent = parseFloat(userPoints.total_spent.toString());

    for (let i = tiers.length - 1; i >= 0; i--) {
      if (purchases >= tiers[i].minPurchases && spent >= tiers[i].minSpent) {
        return tiers[i];
      }
    }

    return tiers[0];
  };

  const getNextTier = (): LoyaltyTier | null => {
    const current = getCurrentTier();
    const currentIndex = tiers.findIndex(t => t.id === current.id);
    
    if (currentIndex < tiers.length - 1) {
      return tiers[currentIndex + 1];
    }
    
    return null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const CurrentIcon = currentTier.icon;

  // Progress do następnego poziomu
  const progressToNext = nextTier && userPoints
    ? Math.min(
        100,
        ((userPoints.total_purchases / nextTier.minPurchases) * 50 +
         (parseFloat(userPoints.total_spent.toString()) / nextTier.minSpent) * 50)
      )
    : 100;

  if (compact) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentTier.color + '20' }}
          >
            <CurrentIcon className="text-xl" style={{ color: currentTier.color }} />
          </div>
          <div className="flex-1">
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Status: {currentTier.name}
            </p>
            {nextTier && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Do {nextTier.name}: {progressToNext.toFixed(0)}%
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg`}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
          <FaCrown className="text-white text-2xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Program Lojalnościowy
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Im więcej kupujesz, tym lepsze korzyści!
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className={`p-4 rounded-lg mb-6 border-2 ${
        darkMode
          ? `bg-${currentTier.color}-900/20 border-${currentTier.color}-500`
          : `bg-${currentTier.color}-50 border-${currentTier.color}-500`
      }`}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentTier.color + '20' }}
          >
            <CurrentIcon className="text-3xl" style={{ color: currentTier.color }} />
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Twój status: {currentTier.name}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {userPoints?.total_purchases || 0} zakupów • {userPoints?.total_spent.toFixed(2) || 0} PLN wydane
            </p>
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {nextTier && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Do statusu {nextTier.name}:
            </span>
            <span className={`text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {progressToNext.toFixed(0)}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{nextTier.minPurchases} zakupów</span>
            <span>{nextTier.minSpent} PLN</span>
          </div>
        </div>
      )}

      {/* All Tiers */}
      <div className="space-y-3">
        <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Wszystkie poziomy:
        </h3>
        {tiers.map((tier, index) => {
          const TierIcon = tier.icon;
          const isCurrent = tier.id === currentTier.id;
          const isUnlocked = userPoints && 
            userPoints.total_purchases >= tier.minPurchases &&
            parseFloat(userPoints.total_spent.toString()) >= tier.minSpent;

          return (
            <div
              key={tier.id}
              className={`p-4 rounded-lg border-2 ${
                isCurrent
                  ? darkMode
                    ? 'bg-yellow-900/20 border-yellow-500'
                    : 'bg-yellow-50 border-yellow-500'
                  : isUnlocked
                  ? darkMode
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-green-50 border-green-500'
                  : darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tier.color + '20' }}
                >
                  <TierIcon className="text-xl" style={{ color: tier.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tier.name}
                    </h4>
                    {isCurrent && (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-yellow-400 text-gray-900'
                      }`}>
                        AKTUALNY
                      </span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    )}
                  </div>
                  <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Wymagania: {tier.minPurchases} zakupów lub {tier.minSpent} PLN
                  </p>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className={`text-sm flex items-start gap-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className="text-green-500 mt-0.5">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltyProgram;

