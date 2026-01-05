import React, { memo, ReactNode } from 'react';

export type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  darkMode?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Reusable Card component
 * Optimized with React.memo
 */
const Card: React.FC<CardProps> = memo(({
  children,
  title,
  subtitle,
  footer,
  header,
  variant = 'default',
  className = '',
  darkMode = false,
  onClick,
  hoverable = false,
}) => {
  const baseStyles = 'rounded-lg transition-all';
  
  const variantStyles: Record<CardVariant, string> = {
    default: darkMode
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white border border-gray-200',
    outlined: darkMode
      ? 'bg-transparent border-2 border-gray-700'
      : 'bg-transparent border-2 border-gray-300',
    elevated: darkMode
      ? 'bg-gray-800 shadow-xl'
      : 'bg-white shadow-lg',
  };

  const hoverStyles = hoverable || onClick
    ? darkMode
      ? 'hover:bg-gray-700 cursor-pointer'
      : 'hover:bg-gray-50 cursor-pointer'
    : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`.trim();

  return (
    <div
      className={combinedClassName}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Header */}
      {(header || title) && (
        <div className={`px-6 py-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {header || (
            <>
              {title && (
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`mt-1 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`px-6 py-4 ${
        darkMode ? 'text-gray-200' : 'text-gray-900'
      }`}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`px-6 py-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {footer}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.variant === nextProps.variant &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.hoverable === nextProps.hoverable &&
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children
  );
});

Card.displayName = 'Card';

export default Card;

