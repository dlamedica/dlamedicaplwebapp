import React, { memo } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  darkMode?: boolean;
  rounded?: boolean;
}

/**
 * Reusable Badge component
 * Optimized with React.memo
 */
const Badge: React.FC<BadgeProps> = memo(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  darkMode = false,
  rounded = false,
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variantStyles: Record<BadgeVariant, string> = {
    primary: darkMode
      ? 'bg-blue-600 text-white'
      : 'bg-blue-100 text-blue-800',
    secondary: darkMode
      ? 'bg-gray-600 text-white'
      : 'bg-gray-100 text-gray-800',
    success: darkMode
      ? 'bg-green-600 text-white'
      : 'bg-green-100 text-green-800',
    danger: darkMode
      ? 'bg-red-600 text-white'
      : 'bg-red-100 text-red-800',
    warning: darkMode
      ? 'bg-yellow-600 text-white'
      : 'bg-yellow-100 text-yellow-800',
    info: darkMode
      ? 'bg-cyan-600 text-white'
      : 'bg-cyan-100 text-cyan-800',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const roundedStyle = rounded ? 'rounded-full' : 'rounded';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${className}`.trim();

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.rounded === nextProps.rounded &&
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children
  );
});

Badge.displayName = 'Badge';

export default Badge;

