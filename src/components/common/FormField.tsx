import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
  className?: string;
}

/**
 * Wspólny komponent pola formularza z walidacją
 * Wyświetla label, pole, błąd i pomocniczy tekst
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  touched = false,
  required = false,
  children,
  helpText,
  className = '',
}) => {
  const showError = touched && error;

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          showError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={showError ? 'relative' : ''}>
        {children}
        {showError && (
          <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
      
      {!showError && helpText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;

