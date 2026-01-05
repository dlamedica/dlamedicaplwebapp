import React from 'react';
import './loadingSpinnerStyles.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  darkMode?: boolean;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Unikalny komponent LoadingSpinner dla platformy edukacyjnej
 * Wszystkie animacje i style są stworzone od podstaw
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  darkMode = false,
  className = '',
  text,
  fullScreen = false
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'spinner-sm',
      md: 'spinner-md',
      lg: 'spinner-lg',
      xl: 'spinner-xl'
    };
    return sizes[size];
  };

  const getVariantColor = () => {
    const variants = {
      default: darkMode ? '#6b7280' : '#9ca3af',
      primary: '#38b6ff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    return variants[variant];
  };

  const spinnerColor = getVariantColor();
  const sizeClass = getSizeClasses();

  const spinnerContent = (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${sizeClass}`}>
        {/* Outer Ring */}
        <div 
          className="spinner-ring spinner-ring-outer"
          style={{ borderColor: `${spinnerColor}40` }}
        >
          <div 
            className="spinner-ring-fill"
            style={{ borderTopColor: spinnerColor }}
          />
        </div>
        
        {/* Middle Ring */}
        <div 
          className="spinner-ring spinner-ring-middle"
          style={{ borderColor: `${spinnerColor}30` }}
        >
          <div 
            className="spinner-ring-fill spinner-ring-reverse"
            style={{ borderTopColor: spinnerColor }}
          />
        </div>
        
        {/* Inner Ring */}
        <div 
          className="spinner-ring spinner-ring-inner"
          style={{ borderColor: `${spinnerColor}20` }}
        >
          <div 
            className="spinner-ring-fill"
            style={{ borderTopColor: spinnerColor }}
          />
        </div>
        
        {/* Center Dot */}
        <div 
          className="spinner-center-dot"
          style={{ backgroundColor: spinnerColor }}
        />
      </div>
      
      {text && (
        <p className={`spinner-text ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-4`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${
        darkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-sm`}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;

