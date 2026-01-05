import React, { memo, InputHTMLAttributes, forwardRef } from 'react';
import { FormField } from './FormField';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
  fullWidth?: boolean;
  darkMode?: boolean;
}

/**
 * Reusable Input component with validation and icons
 * Optimized with React.memo and forwardRef
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  touched = false,
  helpText,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = true,
  darkMode = false,
  className = '',
  id,
  name,
  required,
  ...props
}, ref) => {
  const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseStyles = `block rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff] focus:ring-[#38b6ff]'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#38b6ff] focus:ring-[#38b6ff]'
  } ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`;

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  const inputId = id || name;

  const inputElement = (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={`${combinedClassName} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
        aria-invalid={error && touched ? 'true' : 'false'}
        aria-describedby={
          error && touched
            ? `${inputId}-error`
            : helpText
            ? `${inputId}-help`
            : undefined
        }
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );

  if (label) {
    return (
      <FormField
        label={label}
        name={inputId || ''}
        error={error}
        touched={touched}
        required={required}
        helpText={helpText}
      >
        {inputElement}
      </FormField>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export default memo(Input);

