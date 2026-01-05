/**
 * Własny komponent odznaki z unikalnym designem
 */

import React from 'react';

interface CustomBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  className?: string;
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  darkMode = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const variantStyles = {
    default: darkMode
      ? 'bg-gray-700 text-gray-200 border border-gray-600'
      : 'bg-gray-100 text-gray-800 border border-gray-300',
    success: darkMode
      ? 'bg-green-900/30 text-green-300 border border-green-700'
      : 'bg-green-100 text-green-800 border border-green-300',
    warning: darkMode
      ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700'
      : 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    error: darkMode
      ? 'bg-red-900/30 text-red-300 border border-red-700'
      : 'bg-red-100 text-red-800 border border-red-300',
    info: darkMode
      ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
      : 'bg-blue-100 text-blue-800 border border-blue-300'
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

