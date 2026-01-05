import React, { useState, useEffect } from 'react';
import { FaChartLine, FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface PriceTrackerProps {
  currentPrice: number;
  originalPrice?: number;
  darkMode: boolean;
  showHistory?: boolean;
}

const PriceTracker: React.FC<PriceTrackerProps> = ({
  currentPrice,
  originalPrice,
  darkMode,
  showHistory = false,
}) => {
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    // Symulacja historii cen
    if (showHistory) {
      const history = [
        originalPrice || currentPrice * 1.2,
        originalPrice || currentPrice * 1.1,
        currentPrice,
      ];
      setPriceHistory(history);
    }
  }, [currentPrice, originalPrice, showHistory]);

  if (!originalPrice) return null;

  const priceChange = originalPrice - currentPrice;
  const priceChangePercent = Math.round((priceChange / originalPrice) * 100);

  return (
    <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      <div className="flex items-center gap-2">
        <FaChartLine className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={14} />
        <span className="text-xs font-semibold">Śledzenie ceny</span>
      </div>
      
      <div className="flex items-center gap-2">
        {priceChange > 0 ? (
          <>
            <FaArrowDown className="text-green-500" size={12} />
            <span className="text-xs text-green-500 font-semibold">
              Spadek o {priceChangePercent}% ({priceChange.toFixed(2)} zł)
            </span>
          </>
        ) : (
          <>
            <FaArrowUp className="text-red-500" size={12} />
            <span className="text-xs text-red-500 font-semibold">
              Wzrost o {Math.abs(priceChangePercent)}%
            </span>
          </>
        )}
      </div>

      {showHistory && priceHistory.length > 0 && (
        <div className="flex items-end gap-1 h-12">
          {priceHistory.map((price, index) => {
            const maxPrice = Math.max(...priceHistory);
            const height = (price / maxPrice) * 100;
            const isCurrent = index === priceHistory.length - 1;
            
            return (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  isCurrent
                    ? darkMode ? 'bg-[#38b6ff]' : 'bg-blue-500'
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                style={{ height: `${height}%` }}
                title={`${price.toFixed(2)} zł`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceTracker;

