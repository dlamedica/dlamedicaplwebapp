/**
 * Komponent UrgencyTimer - Odliczanie czasu do końca oferty
 * Tworzy pilność i FOMO (Fear of Missing Out)
 */

import React, { useState, useEffect } from 'react';
import { FaClock, FaFire } from 'react-icons/fa';

interface UrgencyTimerProps {
  expiresAt: string | Date;
  darkMode?: boolean;
  variant?: 'default' | 'compact' | 'banner';
  message?: string;
  onExpire?: () => void;
}

const UrgencyTimer: React.FC<UrgencyTimerProps> = ({
  expiresAt,
  darkMode = false,
  variant = 'default',
  message,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        if (onExpire) onExpire();
        return null;
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (isExpired || !timeLeft) {
    return null;
  }

  const isUrgent = timeLeft.total < 3600000; // Mniej niż 1 godzina
  const isVeryUrgent = timeLeft.total < 900000; // Mniej niż 15 minut

  // Kompaktowy wariant
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
        isVeryUrgent
          ? 'bg-red-500 text-white animate-pulse'
          : isUrgent
          ? 'bg-orange-500 text-white'
          : darkMode
          ? 'bg-gray-700 text-white'
          : 'bg-gray-200 text-gray-900'
      }`}>
        <FaClock className="text-xs" />
        <span className="text-xs font-bold">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Banner wariant
  if (variant === 'banner') {
    return (
      <div className={`p-3 rounded-lg ${
        isVeryUrgent
          ? 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'
          : isUrgent
          ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
          : darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isVeryUrgent ? (
              <FaFire className="text-white text-xl animate-pulse" />
            ) : (
              <FaClock className={`text-xl ${isUrgent ? 'text-white' : darkMode ? 'text-gray-300' : 'text-yellow-800'}`} />
            )}
            <div>
              <p className={`text-sm font-bold ${
                isUrgent ? 'text-white' : darkMode ? 'text-white' : 'text-yellow-900'
              }`}>
                {message || 'Oferta kończy się za:'}
              </p>
              {isVeryUrgent && (
                <p className="text-xs text-white/90 mt-0.5">
                  ⚠️ Ostatnia szansa!
                </p>
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${
            isUrgent ? 'text-white' : darkMode ? 'text-white' : 'text-yellow-900'
          }`}>
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    );
  }

  // Domyślny wariant
  return (
    <div className={`p-3 rounded-lg border-2 ${
      isVeryUrgent
        ? 'bg-red-50 border-red-500 animate-pulse'
        : isUrgent
        ? 'bg-orange-50 border-orange-500'
        : darkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-blue-50 border-blue-500'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          isVeryUrgent
            ? 'bg-red-500 text-white'
            : isUrgent
            ? 'bg-orange-500 text-white'
            : darkMode
            ? 'bg-gray-700 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <FaClock className="text-lg" />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold mb-1 ${
            isVeryUrgent
              ? 'text-red-900'
              : isUrgent
              ? 'text-orange-900'
              : darkMode
              ? 'text-white'
              : 'text-blue-900'
          }`}>
            {message || 'Oferta kończy się za:'}
          </p>
          {isVeryUrgent && (
            <p className="text-xs text-red-700 mb-1">
              ⚠️ Ostatnia szansa! Nie przegap tej okazji!
            </p>
          )}
          {isUrgent && !isVeryUrgent && (
            <p className="text-xs text-orange-700 mb-1">
              ⏰ Zostało mniej niż godzina!
            </p>
          )}
        </div>
        <div className={`text-2xl font-bold font-mono ${
          isVeryUrgent
            ? 'text-red-900'
            : isUrgent
            ? 'text-orange-900'
            : darkMode
            ? 'text-white'
            : 'text-blue-900'
        }`}>
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
      <div className={`mt-2 w-full h-2 rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div
          className={`h-full transition-all duration-1000 ${
            isVeryUrgent
              ? 'bg-red-500'
              : isUrgent
              ? 'bg-orange-500'
              : 'bg-blue-500'
          }`}
          style={{
            width: `${Math.min(100, (timeLeft.total / (24 * 60 * 60 * 1000)) * 100)}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default UrgencyTimer;

