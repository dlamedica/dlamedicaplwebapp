import React, { memo, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  darkMode?: boolean;
}

/**
 * Reusable Button component with variants and loading state
 * Optimized with React.memo
 */
const Button: React.FC<ButtonProps> = memo(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  leftIcon,
  rightIcon,
  darkMode = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: darkMode
      ? 'bg-[#38b6ff] hover:bg-[#2da7ef] text-white focus:ring-[#38b6ff]'
      : 'bg-[#38b6ff] hover:bg-[#2da7ef] text-white focus:ring-[#38b6ff]',
    secondary: darkMode
      ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: darkMode
      ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: darkMode
      ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    outline: darkMode
      ? 'border-2 border-gray-600 hover:bg-gray-700 text-gray-300 focus:ring-gray-500'
      : 'border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: darkMode
      ? 'hover:bg-gray-700 text-gray-300 focus:ring-gray-500'
      : 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.fullWidth === nextProps.fullWidth &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
  );
});

Button.displayName = 'Button';

export default Button;

