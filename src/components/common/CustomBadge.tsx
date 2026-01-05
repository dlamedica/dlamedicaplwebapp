import React from 'react';

interface CustomBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  className?: string;
}

/**
 * Unikalny badge z własnym designem
 */
const CustomBadge: React.FC<CustomBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  darkMode = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variantClasses = {
    default: darkMode
      ? 'bg-gray-700 text-gray-300'
      : 'bg-gray-100 text-gray-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    error: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default CustomBadge;

