import React, { useState, useEffect } from 'react';
import { FireIcon, ClockIcon } from '../icons/CustomIcons';

interface FlashSaleBannerProps {
  darkMode: boolean;
  endTime?: Date;
}

/**
 * Kompaktowy baner Flash Sale
 * Zmniejszony o 30-40% zgodnie z wymaganiami
 */
const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ darkMode, endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    let targetEndTime = endTime;
    if (!targetEndTime) {
      // Domyślnie 24h od teraz
      targetEndTime = new Date();
      targetEndTime.setHours(targetEndTime.getHours() + 24);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = targetEndTime!.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft) return null;

  return (
    <div className={`rounded-xl overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-r from-red-900/80 to-orange-900/80 border border-red-500/30'
        : 'bg-gradient-to-r from-red-500 to-orange-500'
    }`}>
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Lewa strona - tekst */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-red-500/20' : 'bg-white/20'
          }`}>
            <FireIcon size={20} color="#fff" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">FLASH SALE!</h3>
            <p className="text-white/80 text-xs hidden sm:block">
              Tylko dziś – do -50% na wybrane produkty
            </p>
          </div>
        </div>

        {/* Prawa strona - timer */}
        <div className="flex items-center gap-2">
          <ClockIcon size={16} color="#fff" className="opacity-80 hidden sm:block" />
          <div className="flex items-center gap-1 text-white font-mono font-bold text-sm sm:text-base">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-white/60">:</span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-white/60">:</span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
