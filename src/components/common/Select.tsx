import React, { memo, SelectHTMLAttributes, forwardRef } from 'react';
import { FormField } from './FormField';

export type SelectSize = 'sm' | 'md' | 'lg';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: SelectSize;
  fullWidth?: boolean;
  darkMode?: boolean;
}

/**
 * Reusable Select component with validation
 * Optimized with React.memo and forwardRef
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  touched = false,
  helpText,
  options,
  placeholder,
  size = 'md',
  fullWidth = true,
  darkMode = false,
  className = '',
  id,
  name,
  required,
  ...props
}, ref) => {
  const sizeStyles: Record<SelectSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseStyles = `block rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#38b6ff] focus:ring-[#38b6ff]'
      : 'bg-white border-gray-300 text-gray-900 focus:border-[#38b6ff] focus:ring-[#38b6ff]'
  } ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`;

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  const selectId = id || name;

  const selectElement = (
    <select
      ref={ref}
      id={selectId}
      name={name}
      className={combinedClassName}
      aria-invalid={error && touched ? 'true' : 'false'}
      aria-describedby={
        error && touched
          ? `${selectId}-error`
          : helpText
          ? `${selectId}-help`
          : undefined
      }
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );

  if (label) {
    return (
      <FormField
        label={label}
        name={selectId || ''}
        error={error}
        touched={touched}
        required={required}
        helpText={helpText}
      >
        {selectElement}
      </FormField>
    );
  }

  return selectElement;
});

Select.displayName = 'Select';

export default memo(Select);

