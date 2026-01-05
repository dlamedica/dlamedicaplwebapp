import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

interface SearchSuggestion {
  type: 'position' | 'company' | 'location';
  value: string;
  count?: number;
}

interface JobOfferSearchProps {
  value: string;
  placeholder?: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  disabled?: boolean;
}

const JobOfferSearch: React.FC<JobOfferSearchProps> = ({
  value,
  placeholder = 'Wyszukaj oferty pracy, firmy, lokalizacje...',
  darkMode,
  fontSize,
  suggestions = [],
  onSearch,
  onSuggestionSelect,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          text: 'text-sm',
          input: 'text-sm',
        };
      case 'large':
        return {
          text: 'text-lg',
          input: 'text-lg',
        };
      default:
        return {
          text: 'text-base',
          input: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Sync external value with internal state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Show suggestions if there's input and suggestions are available
    if (newValue.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions.length]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    if (inputValue.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue.length, suggestions.length]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(inputValue);
      setShowSuggestions(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, [inputValue, onSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onSearch]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setInputValue(suggestion.value);
    onSearch(suggestion.value);
    setShowSuggestions(false);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  }, [onSearch, onSuggestionSelect]);

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'position':
        return <FaBriefcase className="text-[#38b6ff]" />;
      case 'company':
        return <span className="text-[#38b6ff]">🏢</span>;
      case 'location':
        return <FaMapMarkerAlt className="text-[#38b6ff]" />;
      default:
        return <FaSearch className="text-[#38b6ff]" />;
    }
  };

  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'position':
        return 'Stanowisko';
      case 'company':
        return 'Firma';
      case 'location':
        return 'Lokalizacja';
      default:
        return '';
    }
  };

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.value.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 8); // Limit to 8 suggestions

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div
        className={`
          relative flex items-center
          ${isFocused ? 'ring-2 ring-[#38b6ff] ring-opacity-50' : ''}
          ${darkMode
            ? 'bg-black border-gray-600'
            : 'bg-white border-gray-300'
          }
          border rounded-lg transition-all duration-200 shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center">
          <FaSearch
            className={`
              ${darkMode ? 'text-gray-400' : 'text-gray-500'}
              transition-colors duration-200
              ${isFocused ? 'text-[#38b6ff]' : ''}
            `}
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-10 py-3 ${fontSizes.input} rounded-lg
            ${darkMode
              ? 'bg-black text-white placeholder-gray-400'
              : 'bg-white text-gray-900 placeholder-gray-500'
            }
            border-none outline-none
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />

        {/* Clear Button */}
        {inputValue && !disabled && (
          <button
            onClick={handleClear}
            className={`
              absolute right-3 p-1 rounded-full transition-colors duration-200
              ${darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-label="Wyczyść wyszukiwanie"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
        <div
          ref={suggestionsRef}
          className={`
            absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 max-h-80 overflow-y-auto
            ${darkMode
              ? 'bg-black border-gray-600'
              : 'bg-white border-gray-300'
            }
          `}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-3 text-left flex items-center space-x-3
                transition-colors duration-200 border-b border-opacity-20
                ${darkMode
                  ? 'text-white hover:bg-gray-800 border-gray-600'
                  : 'text-gray-900 hover:bg-gray-50 border-gray-200'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg border-b-0' : ''}
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getSuggestionIcon(suggestion.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`${fontSizes.text} font-medium truncate`}>
                  {suggestion.value}
                </div>
                <div
                  className={`
                    text-xs
                    ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                  `}
                >
                  {getSuggestionLabel(suggestion.type)}
                  {suggestion.count && ` • ${suggestion.count} ofert`}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <span className="text-[#38b6ff] text-sm">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && inputValue.length > 0 && filteredSuggestions.length === 0 && !disabled && (
        <div
          ref={suggestionsRef}
          className={`
            absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50
            ${darkMode
              ? 'bg-black border-gray-600'
              : 'bg-white border-gray-300'
            }
          `}
        >
          <div
            className={`
              px-4 py-3 text-center
              ${darkMode ? 'text-gray-400' : 'text-gray-500'}
            `}
          >
            <FaSearch className="mx-auto mb-2 text-lg opacity-50" />
            <div className={fontSizes.text}>
              Brak sugestii dla "{inputValue}"
            </div>
            <div className="text-xs mt-1">
              Naciśnij Enter, aby wyszukać
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOfferSearch;