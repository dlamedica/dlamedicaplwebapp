import React from 'react';
import AnimatedSection from './AnimatedSection';
import RippleButton from './RippleButton';
import './emptyStateStyles.css';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  darkMode?: boolean;
  className?: string;
  variant?: 'default' | 'error' | 'info' | 'success';
}

/**
 * Unikalny komponent EmptyState dla pustych stanów
 * Wszystkie style i animacje są stworzone od podstaw
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  darkMode = false,
  className = '',
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    const variants = {
      default: {
        iconBg: darkMode ? 'bg-gray-700/50' : 'bg-gray-100',
        iconColor: darkMode ? 'text-gray-400' : 'text-gray-500',
        titleColor: darkMode ? 'text-white' : 'text-gray-900',
        descColor: darkMode ? 'text-gray-400' : 'text-gray-600'
      },
      error: {
        iconBg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
        iconColor: darkMode ? 'text-red-400' : 'text-red-600',
        titleColor: darkMode ? 'text-red-300' : 'text-red-700',
        descColor: darkMode ? 'text-red-400/80' : 'text-red-600/80'
      },
      info: {
        iconBg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        titleColor: darkMode ? 'text-blue-300' : 'text-blue-700',
        descColor: darkMode ? 'text-blue-400/80' : 'text-blue-600/80'
      },
      success: {
        iconBg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        titleColor: darkMode ? 'text-green-300' : 'text-green-700',
        descColor: darkMode ? 'text-green-400/80' : 'text-green-600/80'
      }
    };
    return variants[variant];
  };

  const variantStyles = getVariantStyles();

  return (
    <AnimatedSection animation="fadeIn" delay={0}>
      <div className={`empty-state text-center py-16 ${className}`}>
        <div className={`empty-state-content max-w-md mx-auto p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/50'
        } education-glass border ${darkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
          {/* Icon */}
          <div className="mb-6">
            <div className={`
              inline-block p-6 rounded-2xl
              ${variantStyles.iconBg}
              empty-state-icon
            `}>
              <div className={variantStyles.iconColor}>
                {icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`
            text-2xl font-bold mb-3
            ${variantStyles.titleColor}
            empty-state-title
          `}>
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className={`
              text-base mb-6
              ${variantStyles.descColor}
              empty-state-description
            `}>
              {description}
            </p>
          )}

          {/* Action Button */}
          {actionLabel && onAction && (
            <RippleButton
              onClick={onAction}
              variant="primary"
              darkMode={darkMode}
              className="px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {actionLabel}
            </RippleButton>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default EmptyState;

