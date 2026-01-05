import React from 'react';
import { FaExclamationTriangle, FaFire } from 'react-icons/fa';

interface ScarcityIndicatorProps {
  remaining: number;
  type?: 'product' | 'offer';
  darkMode: boolean;
  variant?: 'badge' | 'banner';
  threshold?: number;
}

const ScarcityIndicator: React.FC<ScarcityIndicatorProps> = ({
  remaining,
  type = 'product',
  darkMode,
  variant = 'badge',
  threshold = 5,
}) => {
  const isLow = remaining <= threshold;

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
        isLow
          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      }`}>
        {isLow ? (
          <>
            <FaExclamationTriangle size={10} />
            <span>Zostało tylko {remaining}!</span>
          </>
        ) : (
          <>
            <FaFire size={10} />
            <span>Ograniczona dostępność</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      isLow
        ? darkMode ? 'bg-red-900 bg-opacity-30 border border-red-500' : 'bg-red-50 border border-red-200'
        : darkMode ? 'bg-orange-900 bg-opacity-30 border border-orange-500' : 'bg-orange-50 border border-orange-200'
    }`}>
      {isLow ? (
        <>
          <FaExclamationTriangle className={darkMode ? 'text-red-400' : 'text-red-600'} size={14} />
          <span className={`text-xs font-semibold ${
            darkMode ? 'text-red-300' : 'text-red-700'
          }`}>
            Zostało tylko {remaining} {remaining === 1 ? 'sztuka' : 'sztuki'}!
          </span>
        </>
      ) : (
        <>
          <FaFire className={darkMode ? 'text-orange-400' : 'text-orange-600'} size={14} />
          <span className={`text-xs ${
            darkMode ? 'text-orange-300' : 'text-orange-700'
          }`}>
            Ograniczona dostępność - zostało {remaining} sztuk
          </span>
        </>
      )}
    </div>
  );
};

export default ScarcityIndicator;
