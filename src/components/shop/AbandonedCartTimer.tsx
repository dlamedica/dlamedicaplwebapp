/**
 * Komponent AbandonedCartTimer - Timer w koszyku
 * Pokazuje czas do wygaśnięcia oferty i zachęca do szybkiego zakupu
 */

import React, { useState, useEffect } from 'react';
import { FaClock, FaGift, FaTag } from 'react-icons/fa';
import UrgencyTimer from '../games/UrgencyTimer';

interface AbandonedCartTimerProps {
  darkMode?: boolean;
  onApplyDiscount?: (code: string) => void;
}

const AbandonedCartTimer: React.FC<AbandonedCartTimerProps> = ({
  darkMode = false,
  onApplyDiscount,
}) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minut w sekundach
  const [discountCode] = useState(`FAST${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + Math.floor(timeLeft / 60));

  if (timeLeft === 0 || applied) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      darkMode
        ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500'
        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500'
    } shadow-lg mb-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center animate-pulse">
          <FaClock className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ⏰ Oferta specjalna wygasa!
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Zakończ zakup w ciągu {minutes}:{seconds.toString().padStart(2, '0')} i otrzymaj bonus!
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-lg mb-3 ${
        darkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaGift className="text-green-500" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Kod rabatowy:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-lg ${
              darkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {discountCode}
            </span>
            <button
              onClick={() => {
                if (onApplyDiscount) {
                  onApplyDiscount(discountCode);
                  setApplied(true);
                }
              }}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <FaTag className="inline mr-1" />
              Zastosuj
            </button>
          </div>
        </div>
        <p className={`text-xs mt-2 text-center ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          💡 Otrzymujesz 10% rabatu za szybkie zakończenie zakupu!
        </p>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-2 rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
          style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AbandonedCartTimer;

