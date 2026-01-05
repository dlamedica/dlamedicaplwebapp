import React from 'react';
import './badgeStyles.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium' | 'difficulty-easy' | 'difficulty-medium' | 'difficulty-hard';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  darkMode?: boolean;
  className?: string;
  icon?: React.ReactNode;
  animated?: boolean;
}

/**
 * Unikalny komponent Badge dla platformy edukacyjnej
 * Wszystkie style są stworzone od podstaw, bez gotowych rozwiązań
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  darkMode = false,
  className = '',
  icon,
  animated = false
}) => {
  const getVariantClasses = () => {
    const variants: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
      default: {
        bg: darkMode ? 'bg-gray-700/50' : 'bg-gray-100',
        text: darkMode ? 'text-gray-300' : 'text-gray-700',
        border: darkMode ? 'border-gray-600/50' : 'border-gray-300/50'
      },
      success: {
        bg: darkMode ? 'bg-green-500/20' : 'bg-green-100',
        text: darkMode ? 'text-green-400' : 'text-green-700',
        border: darkMode ? 'border-green-500/30' : 'border-green-300/50'
      },
      warning: {
        bg: darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
        text: darkMode ? 'text-yellow-400' : 'text-yellow-700',
        border: darkMode ? 'border-yellow-500/30' : 'border-yellow-300/50'
      },
      error: {
        bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
        text: darkMode ? 'text-red-400' : 'text-red-700',
        border: darkMode ? 'border-red-500/30' : 'border-red-300/50'
      },
      info: {
        bg: darkMode ? 'bg-blue-500/20' : 'bg-blue-100',
        text: darkMode ? 'text-blue-400' : 'text-blue-700',
        border: darkMode ? 'border-blue-500/30' : 'border-blue-300/50'
      },
      premium: {
        bg: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600',
        text: 'text-black',
        border: 'border-yellow-500/50'
      },
      'difficulty-easy': {
        bg: darkMode ? 'bg-green-500/20' : 'bg-green-100',
        text: darkMode ? 'text-green-400' : 'text-green-700',
        border: darkMode ? 'border-green-500/30' : 'border-green-300/50'
      },
      'difficulty-medium': {
        bg: darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
        text: darkMode ? 'text-yellow-400' : 'text-yellow-700',
        border: darkMode ? 'border-yellow-500/30' : 'border-yellow-300/50'
      },
      'difficulty-hard': {
        bg: darkMode ? 'bg-red-500/20' : 'bg-red-100',
        text: darkMode ? 'text-red-400' : 'text-red-700',
        border: darkMode ? 'border-red-500/30' : 'border-red-300/50'
      }
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-3 py-1.5',
      lg: 'text-sm px-4 py-2'
    };
    return sizes[size];
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${variantClasses.bg}
        ${variantClasses.text}
        border ${variantClasses.border}
        rounded-lg font-semibold
        ${sizeClasses}
        ${animated ? 'badge-animated' : ''}
        ${className}
        badge-component
      `}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{children}</span>
    </span>
  );
};

export default Badge;

