/**
 * Komponent PriceDropAlert - Powiadomienia o spadku ceny
 * Pokazuje, że cena produktu spadła
 */

import React from 'react';
import { FaArrowDown, FaBell } from 'react-icons/fa';

interface PriceDropAlertProps {
  originalPrice: number;
  currentPrice: number;
  darkMode?: boolean;
  onNotify?: () => void;
}

const PriceDropAlert: React.FC<PriceDropAlertProps> = ({
  originalPrice,
  currentPrice,
  darkMode = false,
  onNotify,
}) => {
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  const savings = originalPrice - currentPrice;

  if (currentPrice >= originalPrice) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${
      darkMode
        ? 'bg-green-900/20 border-green-500'
        : 'bg-green-50 border-green-500'
    } shadow-lg mb-4`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <FaArrowDown className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
            🎉 Cena spadła!
          </h4>
          <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
            Oszczędzasz {savings.toFixed(2)} PLN ({discount.toFixed(0)}% rabatu)!
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-lg mb-2 ${
        darkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Była cena:
            </p>
            <p className={`line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {originalPrice.toFixed(2)} PLN
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Teraz:
            </p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {currentPrice.toFixed(2)} PLN
            </p>
          </div>
        </div>
      </div>

      {onNotify && (
        <button
          onClick={onNotify}
          className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <FaBell />
          Powiadom mnie o kolejnych spadkach
        </button>
      )}
    </div>
  );
};

export default PriceDropAlert;

