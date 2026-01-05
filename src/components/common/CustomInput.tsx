import React from 'react';
import { SearchIcon } from '../icons/CustomIcons';

interface CustomInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
  icon?: 'search' | 'none';
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

/**
 * Unikalny input z własnym designem
 */
const CustomInput: React.FC<CustomInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  darkMode = false,
  icon = 'none',
  className = '',
  disabled = false,
  error,
  label,
}) => {
  const baseClasses = `w-full rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff]/50 ${
    error
      ? 'border-red-500 focus:border-red-500'
      : darkMode
      ? 'bg-gray-800 border-gray-700 focus:border-[#38b6ff]'
      : 'bg-white border-gray-300 focus:border-[#38b6ff]'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const textClasses = darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400';

  const paddingClass = icon === 'search' ? 'pl-12 pr-4' : 'px-4';
  const sizeClass = 'py-3 text-base';

  return (
    <div className="w-full">
      {label && (
        <label className={`block mb-2 font-semibold ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon === 'search' && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <SearchIcon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseClasses} ${textClasses} ${paddingClass} ${sizeClass}`}
        />
      </div>
      {error && (
        <p className={`mt-1 text-sm ${
          darkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomInput;

