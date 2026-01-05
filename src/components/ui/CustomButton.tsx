/**
 * Własny komponent przycisku z unikalnym designem
 */

import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  darkMode = false,
  disabled = false,
  className = '',
  icon
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantStyles = {
    primary: darkMode
      ? 'bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white hover:from-[#2da7ef] hover:to-[#38b6ff] shadow-lg shadow-[#38b6ff]/30'
      : 'bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-white hover:from-[#2da7ef] hover:to-[#38b6ff] shadow-md shadow-[#38b6ff]/20',
    secondary: darkMode
      ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700'
      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-100 hover:to-gray-200',
    success: darkMode
      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/30'
      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-md shadow-green-500/20',
    danger: darkMode
      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/30'
      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-md shadow-red-500/20',
    outline: darkMode
      ? 'border-2 border-gray-600 text-gray-300 hover:border-[#38b6ff] hover:text-[#38b6ff] bg-transparent'
      : 'border-2 border-gray-300 text-gray-700 hover:border-[#38b6ff] hover:text-[#38b6ff] bg-transparent'
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

