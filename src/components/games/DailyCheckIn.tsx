/**
 * Komponent codziennego logowania
 * Pozwala użytkownikom odbierać codzienne nagrody
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaCalendarCheck, FaGift, FaFire, FaCheckCircle } from 'react-icons/fa';

interface DailyCheckInProps {
  darkMode?: boolean;
  compact?: boolean;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ darkMode = false, compact = false }) => {
  const { canClaimDailyReward, claimDailyReward, userPoints, dailyRewardsHistory } = useGame();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState<any>(null);

  // Nagrody za kolejne dni (7-dniowa seria)
  const dailyRewards = [
    { day: 1, points: 10, label: 'Dzień 1' },
    { day: 2, points: 15, label: 'Dzień 2' },
    { day: 3, points: 20, label: 'Dzień 3' },
    { day: 4, points: 30, label: 'Dzień 4' },
    { day: 5, points: 40, label: 'Dzień 5' },
    { day: 6, points: 50, label: 'Dzień 6' },
    { day: 7, points: 100, label: 'Dzień 7 - Bonus!' },
  ];

  const streakDays = userPoints?.streak_days || 0;
  const currentDay = Math.min(streakDays % 7 || 7, 7);

  const handleClaim = async () => {
    if (!canClaimDailyReward || claiming) return;

    setClaiming(true);
    const rewardData = await claimDailyReward();
    
    if (rewardData) {
      const rewardValue = JSON.parse(rewardData.reward_value);
      setReward({
        points: rewardValue.points,
        streak: rewardValue.streak,
      });
      setClaimed(true);
    }
    
    setClaiming(false);
  };

  if (compact) {
    return (
      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FaCalendarCheck className={`text-2xl mr-2 ${darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'}`} />
            <div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Codzienna nagroda
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Seria: {streakDays} dni
              </p>
            </div>
          </div>
          {streakDays > 0 && (
            <div className="flex items-center text-orange-500">
              <FaFire className="mr-1" />
              <span className="font-bold">{streakDays}</span>
            </div>
          )}
        </div>

        {canClaimDailyReward ? (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className={`w-full py-2 rounded-lg font-medium transition-all ${
              claiming
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] hover:from-[#2a9fe5] hover:to-[#1e7fc7] text-white'
            }`}
          >
            {claiming ? 'Odbieranie...' : 'Odbierz nagrodę'}
          </button>
        ) : (
          <div className={`py-2 px-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <FaCheckCircle className="inline mr-1 text-green-500" />
              Dziś już odebrano
            </p>
          </div>
        )}

        {reward && claimed && (
          <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              <FaGift className="inline mr-1" />
              Otrzymano {reward.points} punktów!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-xl flex items-center justify-center mr-4">
          <FaCalendarCheck className="text-white text-2xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Codzienna nagroda
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Odbierz codzienną nagrodę i zbuduj serię!
          </p>
        </div>
      </div>

      {/* Seria */}
      {streakDays > 0 && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-orange-900/20 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaFire className="text-orange-500 text-2xl mr-2" />
              <div>
                <p className={`font-bold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                  Twoja seria: {streakDays} dni
                </p>
                <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  Im dłuższa seria, tym więcej punktów!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kalendarz nagród */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Nagrody za kolejne dni:
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {dailyRewards.map((dayReward, index) => {
            const isClaimed = dailyRewardsHistory.some(
              (r) => new Date(r.reward_date).getDate() === new Date().getDate() - (6 - index)
            );
            const isToday = index === currentDay - 1;
            const isPast = index < currentDay - 1;

            return (
              <div
                key={dayReward.day}
                className={`p-2 rounded-lg text-center border-2 ${
                  isToday
                    ? darkMode
                      ? 'bg-[#38b6ff]/20 border-[#38b6ff]'
                      : 'bg-blue-50 border-blue-500'
                    : isPast
                    ? darkMode
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-green-50 border-green-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {dayReward.label}
                </p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dayReward.points}
                </p>
                <p className="text-xs text-gray-500">pkt</p>
                {isPast && (
                  <FaCheckCircle className="mx-auto mt-1 text-green-500 text-xs" />
                )}
                {isToday && (
                  <div className="mx-auto mt-1 w-2 h-2 bg-[#38b6ff] rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Przycisk */}
      {canClaimDailyReward ? (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            claiming
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] hover:from-[#2a9fe5] hover:to-[#1e7fc7] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {claiming ? 'Odbieranie...' : 'Odbierz dzisiejszą nagrodę!'}
        </button>
      ) : (
        <div className={`py-3 px-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <FaCheckCircle className="inline mr-2 text-green-500" />
            Dziś już odebrano nagrodę. Wróć jutro!
          </p>
        </div>
      )}

      {/* Wynik */}
      {reward && claimed && (
        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center justify-center">
            <FaGift className="text-green-500 text-2xl mr-2" />
            <div>
              <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                Gratulacje! Otrzymałeś {reward.points} punktów!
              </p>
              {reward.streak > 1 && (
                <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Twoja seria: {reward.streak} dni
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCheckIn;

