/**
 * Komponent Koła Fortuny
 * Pozwala użytkownikom grać raz dziennie i wygrywać nagrody
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaGift, FaCoins, FaTicketAlt, FaTimes } from 'react-icons/fa';

interface SpinWheelProps {
  darkMode?: boolean;
  onClose?: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ darkMode = false, onClose }) => {
  const { canPlaySpinWheel, playSpinWheel } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [rotation, setRotation] = useState(0);

  // Nagrody na kole (8 sektorów)
  const rewards = [
    { type: 'points', value: 50, label: '50 punktów', color: '#38b6ff', probability: 0.3 },
    { type: 'points', value: 100, label: '100 punktów', color: '#2a9fe5', probability: 0.2 },
    { type: 'points', value: 200, label: '200 punktów', color: '#1e7fc7', probability: 0.1 },
    { type: 'discount', value: 5, label: '5% rabat', color: '#10b981', probability: 0.15 },
    { type: 'discount', value: 10, label: '10% rabat', color: '#059669', probability: 0.1 },
    { type: 'discount', value: 20, label: '20% rabat', color: '#047857', probability: 0.05 },
    { type: 'points', value: 25, label: '25 punktów', color: '#8b5cf6', probability: 0.08 },
    { type: 'nothing', value: 0, label: 'Spróbuj ponownie', color: '#6b7280', probability: 0.02 },
  ];

  const handleSpin = async () => {
    if (!canPlaySpinWheel || spinning) return;

    setSpinning(true);
    setResult(null);

    // Losuj nagrodę
    const random = Math.random();
    let cumulative = 0;
    let selectedIndex = 0;

    for (let i = 0; i < rewards.length; i++) {
      cumulative += rewards[i].probability;
      if (random <= cumulative) {
        selectedIndex = i;
        break;
      }
    }

    // Oblicz rotację (pełny obrót + pozycja nagrody)
    const fullRotations = 5; // 5 pełnych obrotów
    const sectorAngle = 360 / rewards.length;
    const targetAngle = selectedIndex * sectorAngle;
    const finalRotation = fullRotations * 360 + (360 - targetAngle) + sectorAngle / 2;

    setRotation(finalRotation);

    // Po zakończeniu animacji, pobierz nagrodę z serwera
    setTimeout(async () => {
      const reward = await playSpinWheel();
      if (reward) {
        const rewardValue = JSON.parse(reward.reward_value);
        setResult({
          type: reward.reward_type,
          value: reward.discount_percentage || reward.points_awarded || 0,
          code: reward.discount_code,
          message: reward.reward_type === 'discount_code' 
            ? `Wygrałeś kod rabatowy ${reward.discount_code} na ${reward.discount_percentage}%!`
            : reward.reward_type === 'points'
            ? `Wygrałeś ${reward.points_awarded} punktów!`
            : 'Niestety, tym razem nic nie wygrałeś. Spróbuj ponownie jutro!',
        });
      }
      setSpinning(false);
    }, 4000); // Czas animacji
  };

  if (!canPlaySpinWheel && !result) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
        <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {onClose && (
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <FaGift className="text-white text-3xl" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Koło Fortuny
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Dziś już zagrałeś! Wróć jutro po kolejną szansę na wygraną.
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5]'
              }`}
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm`}>
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Koło Fortuny
          </h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Zakręć kołem i wygraj nagrodę!
          </p>
        </div>

        {/* Koło */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <div
            className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden transition-transform duration-4000 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {rewards.map((reward, index) => {
              const angle = (360 / rewards.length) * index;
              const sectorAngle = 360 / rewards.length;
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((angle + sectorAngle) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle + sectorAngle) * Math.PI) / 180)}%)`,
                    backgroundColor: reward.color,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle + sectorAngle / 2}deg)`,
                    }}
                  >
                    <div className="text-white text-xs font-bold text-center whitespace-nowrap">
                      {reward.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wskaźnik */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500"></div>
          </div>
        </div>

        {/* Wynik */}
        {result && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center mb-2">
              {result.type === 'discount_code' ? (
                <FaTicketAlt className="text-green-500 text-2xl mr-2" />
              ) : result.type === 'points' ? (
                <FaCoins className="text-yellow-500 text-2xl mr-2" />
              ) : (
                <FaGift className="text-gray-500 text-2xl mr-2" />
              )}
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {result.message}
              </p>
            </div>
            {result.code && (
              <div className={`mt-2 p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'} border-2 border-dashed border-green-500`}>
                <p className={`text-sm font-mono text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Kod: <span className="font-bold text-green-500">{result.code}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Przycisk */}
        <button
          onClick={handleSpin}
          disabled={spinning || !canPlaySpinWheel}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            spinning || !canPlaySpinWheel
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] hover:from-[#2a9fe5] hover:to-[#1e7fc7] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {spinning ? 'Kręci się...' : canPlaySpinWheel ? 'Zakręć kołem!' : 'Już dziś grałeś'}
        </button>

        <p className={`text-center text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Możesz zagrać raz dziennie
        </p>
      </div>
    </div>
  );
};

export default SpinWheel;

