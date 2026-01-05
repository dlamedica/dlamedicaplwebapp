/**
 * Własny komponent karty z unikalnym designem
 */

import React from 'react';

interface CustomCardProps {
  children: React.ReactNode;
  darkMode?: boolean;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  darkMode = false,
  className = '',
  variant = 'default',
  onClick
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variantStyles = {
    default: darkMode
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
      : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
    elevated: darkMode
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700'
      : 'bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-200',
    outlined: darkMode
      ? 'bg-transparent border-2 border-gray-700'
      : 'bg-transparent border-2 border-gray-300'
  };

  const hoverStyles = onClick
    ? darkMode
      ? 'hover:border-[#38b6ff] hover:shadow-lg hover:shadow-[#38b6ff]/20 cursor-pointer'
      : 'hover:border-[#38b6ff] hover:shadow-lg hover:shadow-[#38b6ff]/10 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

