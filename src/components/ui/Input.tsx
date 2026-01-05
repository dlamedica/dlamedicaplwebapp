// 🎨 UNIKALNY KOMPONENT INPUTU - Stworzony od podstaw

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  darkMode?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  darkMode = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'design-input w-full transition-all duration-250';
  
  const darkClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'focus:border-[#38b6ff] focus:ring-[#38b6ff]';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            ${baseClasses}
            ${darkClasses}
            ${errorClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

