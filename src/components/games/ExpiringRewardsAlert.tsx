/**
 * Komponent ExpiringRewardsAlert - Powiadomienia o wygasających nagrodach
 * Wykorzystuje Loss Aversion - strach przed utratą
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaExclamationTriangle, FaGift, FaTicketAlt, FaCoins, FaTimes } from 'react-icons/fa';
import UrgencyTimer from './UrgencyTimer';

interface ExpiringRewardsAlertProps {
  darkMode?: boolean;
  onDismiss?: () => void;
}

const ExpiringRewardsAlert: React.FC<ExpiringRewardsAlertProps> = ({
  darkMode = false,
  onDismiss,
}) => {
  const { unclaimedRewards, userPoints } = useGame();
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Filtruj wygasające nagrody (w ciągu 7 dni)
  const expiringRewards = unclaimedRewards.filter((reward) => {
    if (dismissed.includes(reward.id)) return false;
    if (!reward.expires_at) return false;
    
    const expiresAt = new Date(reward.expires_at);
    const now = new Date();
    const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  });

  // Sprawdź wygasające punkty
  const expiringPoints = userPoints && userPoints.available_points > 0 ? {
    points: userPoints.available_points,
    expiresIn: 30, // Punkty wygasają po 30 dniach nieaktywności (przykład)
  } : null;

  if (expiringRewards.length === 0 && !expiringPoints) {
    return null;
  }

  const handleDismiss = (rewardId: string) => {
    setDismissed([...dismissed, rewardId]);
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'discount_code':
        return FaTicketAlt;
      case 'points':
        return FaCoins;
      default:
        return FaGift;
    }
  };

  const getRewardLabel = (reward: any) => {
    if (reward.reward_type === 'discount_code') {
      return `Kod rabatowy ${reward.discount_code} (${reward.discount_percentage}%)`;
    }
    if (reward.reward_type === 'points') {
      return `${reward.points_awarded} punktów`;
    }
    return 'Nagroda';
  };

  return (
    <div className="space-y-3">
      {/* Wygasające nagrody z gier */}
      {expiringRewards.map((reward) => {
        const Icon = getRewardIcon(reward.reward_type);
        const daysLeft = reward.expires_at
          ? Math.ceil((new Date(reward.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        return (
          <div
            key={reward.id}
            className={`p-4 rounded-lg border-2 ${
              daysLeft <= 1
                ? darkMode
                  ? 'bg-red-900/20 border-red-500 animate-pulse'
                  : 'bg-red-50 border-red-500 animate-pulse'
                : daysLeft <= 3
                ? darkMode
                  ? 'bg-orange-900/20 border-orange-500'
                  : 'bg-orange-50 border-orange-500'
                : darkMode
                ? 'bg-yellow-900/20 border-yellow-500'
                : 'bg-yellow-50 border-yellow-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  daysLeft <= 1
                    ? 'bg-red-500'
                    : daysLeft <= 3
                    ? 'bg-orange-500'
                    : 'bg-yellow-500'
                }`}>
                  <Icon className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaExclamationTriangle className={`text-sm ${
                      daysLeft <= 1
                        ? 'text-red-500'
                        : daysLeft <= 3
                        ? 'text-orange-500'
                        : 'text-yellow-500'
                    }`} />
                    <p className={`font-bold ${
                      daysLeft <= 1
                        ? darkMode ? 'text-red-300' : 'text-red-900'
                        : daysLeft <= 3
                        ? darkMode ? 'text-orange-300' : 'text-orange-900'
                        : darkMode ? 'text-yellow-300' : 'text-yellow-900'
                    }`}>
                      {daysLeft <= 1
                        ? '⚠️ Ostatnia szansa!'
                        : daysLeft <= 3
                        ? '⏰ Wygasa wkrótce!'
                        : '⏳ Wygasa za kilka dni'}
                    </p>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getRewardLabel(reward)}
                  </p>
                  {daysLeft <= 1 && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      Jeśli nie wykorzystasz tej nagrody, stracisz ją na zawsze!
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDismiss(reward.id)}
                className={`p-1 rounded ${
                  darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Timer */}
            {reward.expires_at && (
              <UrgencyTimer
                expiresAt={reward.expires_at}
                darkMode={darkMode}
                variant="compact"
                message={`Wygasa za ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}`}
              />
            )}
          </div>
        );
      })}

      {/* Wygasające punkty */}
      {expiringPoints && expiringPoints.points > 0 && (
        <div className={`p-4 rounded-lg border-2 ${
          darkMode
            ? 'bg-yellow-900/20 border-yellow-500'
            : 'bg-yellow-50 border-yellow-500'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-500">
              <FaCoins className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FaExclamationTriangle className="text-yellow-500 text-sm" />
                <p className={`font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                  ⏳ Twoje punkty wygasają!
                </p>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Masz <span className="font-bold text-yellow-600">{expiringPoints.points}</span> punktów, które wygasną za {expiringPoints.expiresIn} dni nieaktywności.
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                💡 Wykorzystaj je teraz, zanim je stracisz! 100 punktów = 1 PLN rabatu.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiringRewardsAlert;

