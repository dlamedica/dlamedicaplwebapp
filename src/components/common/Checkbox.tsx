import React, { memo, InputHTMLAttributes, forwardRef } from 'react';
import { FormField } from './FormField';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  darkMode?: boolean;
}

/**
 * Reusable Checkbox component with validation
 * Optimized with React.memo and forwardRef
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  touched = false,
  helpText,
  darkMode = false,
  className = '',
  id,
  name,
  required,
  ...props
}, ref) => {
  const checkboxId = id || name || `checkbox-${Math.random()}`;

  const checkboxElement = (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          name={name}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff] ${
            darkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          } ${error && touched ? 'border-red-500' : ''} ${className}`}
          aria-invalid={error && touched ? 'true' : 'false'}
          aria-describedby={
            error && touched
              ? `${checkboxId}-error`
              : helpText
              ? `${checkboxId}-help`
              : undefined
          }
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label
            htmlFor={checkboxId}
            className={`font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            } ${error && touched ? 'text-red-600 dark:text-red-400' : ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helpText && !error && (
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {helpText}
            </p>
          )}
          {error && touched && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (!label) {
    return checkboxElement;
  }

  return (
    <div className="mb-4">
      {checkboxElement}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default memo(Checkbox);

