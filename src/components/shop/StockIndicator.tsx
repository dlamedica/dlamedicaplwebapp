import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface StockIndicatorProps {
  inStock: boolean;
  stockCount?: number;
  darkMode: boolean;
  variant?: 'badge' | 'text';
}

const StockIndicator: React.FC<StockIndicatorProps> = ({
  inStock,
  stockCount,
  darkMode,
  variant = 'badge',
}) => {
  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {inStock ? (
          <>
            <FaCheckCircle className="text-green-500" size={14} />
            <span className="text-sm">
              {stockCount !== undefined
                ? `Dostępne (${stockCount} szt.)`
                : 'Dostępne'}
            </span>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="text-red-500" size={14} />
            <span className="text-sm text-red-500">Niedostępne</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
      inStock
        ? darkMode
          ? 'bg-green-900 bg-opacity-30 text-green-300 border border-green-500'
          : 'bg-green-50 text-green-700 border border-green-200'
        : darkMode
        ? 'bg-red-900 bg-opacity-30 text-red-300 border border-red-500'
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {inStock ? (
        <>
          <FaCheckCircle size={10} />
          <span>{stockCount !== undefined ? `${stockCount} szt.` : 'W magazynie'}</span>
        </>
      ) : (
        <>
          <FaExclamationTriangle size={10} />
          <span>Niedostępne</span>
        </>
      )}
    </div>
  );
};

export default StockIndicator;

