import React from 'react';
import { LoadingSpinner } from '../icons/CustomIcons';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  darkMode?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Unikalny przycisk z własnym designem
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  darkMode = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: darkMode
      ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] hover:shadow-lg active:scale-95'
      : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] hover:shadow-lg active:scale-95',
    secondary: darkMode
      ? 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg active:scale-95'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg active:scale-95',
    outline: darkMode
      ? 'border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10 hover:shadow-lg active:scale-95'
      : 'border-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10 hover:shadow-lg active:scale-95',
    ghost: darkMode
      ? 'text-gray-300 hover:bg-gray-700/50 active:scale-95'
      : 'text-gray-700 hover:bg-gray-100 active:scale-95',
    danger: darkMode
      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-lg active:scale-95'
      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-lg active:scale-95',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingSpinner size={20} color="currentColor" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
};

export default CustomButton;

