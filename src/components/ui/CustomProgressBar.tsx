/**
 * Własny komponent paska postępu z unikalnym designem
 */

import React from 'react';

interface CustomProgressBarProps {
  value: number; // 0-100
  max?: number;
  darkMode?: boolean;
  variant?: 'default' | 'gradient' | 'animated';
  color?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
  value,
  max = 100,
  darkMode = false,
  variant = 'default',
  color,
  className = '',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const trackStyles = darkMode
    ? 'bg-gray-800 border border-gray-700'
    : 'bg-gray-200 border border-gray-300';

  const getFillStyles = () => {
    if (color) {
      return `bg-[${color}]`;
    }

    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-[#38b6ff] via-purple-500 to-pink-500';
      case 'animated':
        return darkMode
          ? 'bg-gradient-to-r from-[#2da7ef] to-[#38b6ff] animate-pulse'
          : 'bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] animate-pulse';
      default:
        return darkMode ? 'bg-[#38b6ff]' : 'bg-[#38b6ff]';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {label || 'Postęp'}
          </span>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full h-3 rounded-full overflow-hidden ${trackStyles}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getFillStyles()}`}
          style={{ width: `${percentage}%` }}
        >
          {variant === 'animated' && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

