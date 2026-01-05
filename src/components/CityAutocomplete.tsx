import React, { useState, useEffect, useRef } from 'react';
import { useCities } from '../hooks/useCities';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  darkMode?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Wpisz nazwę miasta...",
  darkMode = false,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const { cities, searchCities, addCity } = useCities();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = query.length > 0 ? searchCities(query) : [];

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleSelect = (cityName: string) => {
    setQuery(cityName);
    onChange(cityName);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleAddNewCity = async () => {
    if (query.trim() && !cities.some(city => city.name.toLowerCase() === query.toLowerCase())) {
      const newCity = await addCity(query.trim());
      if (newCity) {
        handleSelect(newCity.name);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(query.length > 0)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        } border`}>
          {suggestions.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city.name)}
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                darkMode 
                  ? 'text-white hover:bg-gray-700 focus:bg-gray-700' 
                  : 'text-gray-900 hover:bg-blue-50 focus:bg-blue-50'
              }`}
            >
              {city.name}
            </button>
          ))}
          
          {query.trim() && !suggestions.some(city => city.name.toLowerCase() === query.toLowerCase()) && (
            <button
              type="button"
              onClick={handleAddNewCity}
              className={`w-full text-left px-3 py-2 border-t font-medium ${
                darkMode 
                  ? 'text-blue-400 border-gray-600 hover:bg-gray-700' 
                  : 'text-blue-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              + Dodaj "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;