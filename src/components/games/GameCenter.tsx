/**
 * Główny hub gier - centrum gamifikacji
 * Łączy wszystkie komponenty gier w jednym miejscu
 */

import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import PointsDisplay from './PointsDisplay';
import DailyCheckIn from './DailyCheckIn';
import SpinWheel from './SpinWheel';
import QuestBoard from './QuestBoard';
import ScratchCard from './ScratchCard';
import ExpiringRewardsAlert from './ExpiringRewardsAlert';
import ChainRewardsTracker from './ChainRewardsTracker';
import LuckyDraw from './LuckyDraw';
import TreasureHunt from './TreasureHunt';
import LoyaltyProgram from './LoyaltyProgram';
import PersonalizedOffer from './PersonalizedOffer';
import DailyChallenge from './DailyChallenge';
import { FaGamepad, FaCoins, FaCalendarCheck, FaTrophy, FaTicketAlt, FaTimes, FaShoppingCart, FaGift, FaMap, FaCrown } from 'react-icons/fa';

interface GameCenterProps {
  darkMode?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  onClose?: () => void;
}

const GameCenter: React.FC<GameCenterProps> = ({ darkMode = false, fontSize = 'medium', onClose }) => {
  const { userPoints, unclaimedRewards } = useGame();
  const [activeGame, setActiveGame] = useState<'spin' | 'scratch' | 'lucky' | 'treasure' | null>(null);

  const fontSizes = {
    small: {
      title: 'text-xl',
      subtitle: 'text-sm',
      body: 'text-xs',
    },
    medium: {
      title: 'text-2xl',
      subtitle: 'text-base',
      body: 'text-sm',
    },
    large: {
      title: 'text-3xl',
      subtitle: 'text-lg',
      body: 'text-base',
    },
  };

  const sizes = fontSizes[fontSize];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] rounded-xl flex items-center justify-center mr-4">
                <FaGamepad className="text-white text-3xl" />
              </div>
              <div>
                <h1 className={`${sizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Centrum Gier
                </h1>
                <p className={`${sizes.subtitle} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Zbieraj punkty, graj w gry i wygrywaj nagrody!
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
              >
                <FaTimes className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Powiadomienie o nieodebranych nagrodach */}
          {unclaimedRewards.length > 0 && (
            <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center">
                <FaGift className="text-yellow-500 text-xl mr-2" />
                <p className={`${sizes.body} ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  Masz {unclaimedRewards.length} nieodebraną nagrodę! Sprawdź swoje nagrody.
                </p>
              </div>
            </div>
          )}

          {/* Wygasające nagrody - Loss Aversion */}
          <div className="mb-6">
            <ExpiringRewardsAlert darkMode={darkMode} />
          </div>
        </div>

        {/* Główne sekcje */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Punkty i poziom */}
          <div className="col-span-1">
            <PointsDisplay darkMode={darkMode} />
          </div>

          {/* Codzienne logowanie */}
          <div className="col-span-1">
            <DailyCheckIn darkMode={darkMode} />
          </div>

          {/* Statystyki - Moved here for better balance */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col justify-center`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${sizes.subtitle} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Twoja aktywność
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userPoints?.streak_days || 0}
                </p>
                <p className="text-xs text-gray-500">Dni serii</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userPoints?.level || 1}
                </p>
                <p className="text-xs text-gray-500">Poziom</p>
              </div>
            </div>
          </div>
        </div>

        {/* Szybkie akcje - Redesigned Tiles */}
        <div className="mb-10">
          <h3 className={`${sizes.title} font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
            <span className="w-1.5 h-8 bg-[#38b6ff] rounded-full mr-3"></span>
            Strefa Gier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveGame('spin')}
              className={`group relative overflow-hidden rounded-2xl p-6 h-48 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-left flex flex-col justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity"></div>

              <div className="relative z-10">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl inline-block mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <FaTicketAlt className="text-white text-2xl" />
                </div>
                <h4 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Koło Fortuny
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Zakręć i wygraj nagrodę! Dostępne codziennie.
                </p>
              </div>
              <div className="relative z-10 flex justify-end">
                <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-lg dark:bg-purple-900/30 dark:text-purple-300">
                  Darmowy spin
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveGame('lucky')}
              className={`group relative overflow-hidden rounded-2xl p-6 h-48 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-left flex flex-col justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity"></div>

              <div className="relative z-10">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl inline-block mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <FaGift className="text-white text-2xl" />
                </div>
                <h4 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Wielkie Losowanie
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Zbieraj losy i wygrywaj cenne nagrody co tydzień!
                </p>
              </div>
              <div className="relative z-10 flex justify-end">
                <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-300">
                  Główna nagroda
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveGame('treasure')}
              className={`group relative overflow-hidden rounded-2xl p-6 h-48 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-left flex flex-col justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity"></div>

              <div className="relative z-10">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl inline-block mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <FaMap className="text-white text-2xl" />
                </div>
                <h4 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Polowanie na Skarby
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Znajdź ukryte kody na stronie i zgarnij punkty!
                </p>
              </div>
              <div className="relative z-10 flex justify-end">
                <span className="text-xs font-bold px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg dark:bg-cyan-900/30 dark:text-cyan-300">
                  Aktywne
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Codzienne Wyzwania */}
        <div className="mb-6">
          <DailyChallenge darkMode={darkMode} />
        </div>

        {/* Misje */}
        <div className="mb-6">
          <QuestBoard darkMode={darkMode} />
        </div>

        {/* Chain Rewards Tracker - Seria zakupów */}
        <div className="mb-6">
          <ChainRewardsTracker darkMode={darkMode} />
        </div>

        {/* Program Lojalnościowy */}
        <div className="mb-6">
          <LoyaltyProgram darkMode={darkMode} />
        </div>

        {/* Spersonalizowane Oferty */}
        <div className="mb-6">
          <PersonalizedOffer darkMode={darkMode} />
        </div>


      </div>

      {/* Modale gier */}
      {activeGame === 'spin' && (
        <SpinWheel darkMode={darkMode} onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'scratch' && (
        <ScratchCard darkMode={darkMode} onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'lucky' && (
        <LuckyDraw darkMode={darkMode} onClose={() => setActiveGame(null)} />
      )}
      {activeGame === 'treasure' && (
        <TreasureHunt darkMode={darkMode} onClose={() => setActiveGame(null)} />
      )}
    </div>
  );
};

export default GameCenter;

