import React, { memo, TextareaHTMLAttributes, forwardRef } from 'react';
import { FormField } from './FormField';

export type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  size?: TextareaSize;
  fullWidth?: boolean;
  darkMode?: boolean;
  rows?: number;
}

/**
 * Reusable Textarea component with validation
 * Optimized with React.memo and forwardRef
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  touched = false,
  helpText,
  size = 'md',
  fullWidth = true,
  darkMode = false,
  className = '',
  id,
  name,
  required,
  rows = 4,
  ...props
}, ref) => {
  const sizeStyles: Record<TextareaSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseStyles = `block rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 resize-y ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff] focus:ring-[#38b6ff]'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#38b6ff] focus:ring-[#38b6ff]'
  } ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`;

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();

  const textareaId = id || name;

  const textareaElement = (
    <textarea
      ref={ref}
      id={textareaId}
      name={name}
      rows={rows}
      className={combinedClassName}
      aria-invalid={error && touched ? 'true' : 'false'}
      aria-describedby={
        error && touched
          ? `${textareaId}-error`
          : helpText
          ? `${textareaId}-help`
          : undefined
      }
      {...props}
    />
  );

  if (label) {
    return (
      <FormField
        label={label}
        name={textareaId || ''}
        error={error}
        touched={touched}
        required={required}
        helpText={helpText}
      >
        {textareaElement}
      </FormField>
    );
  }

  return textareaElement;
});

Textarea.displayName = 'Textarea';

export default memo(Textarea);

