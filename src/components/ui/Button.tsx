// 🎨 UNIKALNY KOMPONENT PRZYCISKU - Stworzony od podstaw

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'design-button inline-flex items-center justify-center font-medium transition-all duration-250 ease-in-out relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5] hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'bg-transparent border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff] hover:text-white',
    ghost: 'bg-transparent text-[#38b6ff] hover:bg-[#38b6ff]/10',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || isLoading ? disabledClasses : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Ładowanie...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

