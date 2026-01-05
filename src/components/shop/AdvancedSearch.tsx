import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';
import LazyImage from './LazyImage';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface AdvancedSearchProps {
  darkMode: boolean;
  onSelect: (ebook: Ebook) => void;
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ darkMode, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return mockEbooks
      .filter((ebook) =>
        ebook.title.toLowerCase().includes(lowerQuery) ||
        ebook.author.toLowerCase().includes(lowerQuery) ||
        ebook.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 8);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedSuggestion >= 0) {
      e.preventDefault();
      onSelect(suggestions[selectedSuggestion]);
      setQuery('');
      setSelectedSuggestion(-1);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Szukaj produktów, autorów, tagów..."
          className={`w-full pl-12 pr-10 py-3 rounded-lg border transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#38b6ff]'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#38b6ff]'
          } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
          autoFocus
          aria-label="Wyszukiwarka produktów"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls="search-suggestions"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedSuggestion(-1);
            }}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {query && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          role="listbox"
          aria-label="Sugestie wyszukiwania"
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          {suggestions.map((ebook, index) => (
            <button
              key={ebook.id}
              onClick={() => {
                onSelect(ebook);
                setQuery('');
                setSelectedSuggestion(-1);
              }}
              role="option"
              aria-selected={index === selectedSuggestion}
              className={`w-full text-left px-4 py-3 hover:bg-opacity-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
                index === selectedSuggestion
                  ? darkMode
                    ? 'bg-[#38b6ff] bg-opacity-20'
                    : 'bg-[#38b6ff] bg-opacity-10'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x64?text=Ebook';
                  }}
                />
                <div className="flex-1">
                  <p className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {ebook.title}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {ebook.author}
                  </p>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {new Intl.NumberFormat('pl-PL', {
                      style: 'currency',
                      currency: 'PLN',
                    }).format(ebook.price)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

