// 🎨 UNIKALNY KOMPONENT KARTY - Stworzony od podstaw

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  darkMode = false,
  hover = true,
  padding = 'md',
  shadow = 'md',
}) => {
  const baseClasses = 'design-card rounded-lg border transition-all duration-250';
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  const darkClasses = darkMode 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-200';
  
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:-translate-y-0.5' 
    : '';
  
  return (
    <div className={`
      ${baseClasses}
      ${paddingClasses[padding]}
      ${shadowClasses[shadow]}
      ${darkClasses}
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;

