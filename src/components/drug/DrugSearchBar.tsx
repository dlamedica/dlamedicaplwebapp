import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaTimes, FaHistory, FaClock } from 'react-icons/fa';
import { DrugSearchService } from '../../services/drugSearch';
import SearchHistory from './SearchHistory';

interface DrugSearchBarProps {
  searchService: DrugSearchService | null;
  onSearch: (query: string) => void;
  placeholder?: string;
  darkMode?: boolean;
  className?: string;
  currentFilters?: any; // For search history
}

interface SearchHistory {
  query: string;
  timestamp: number;
}

const DrugSearchBar: React.FC<DrugSearchBarProps> = ({
  searchService,
  onSearch,
  placeholder = "Szukaj leku po nazwie, substancji czynnej lub kodzie ATC...",
  darkMode = false,
  className = "",
  currentFilters
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Załaduj historię wyszukiwań z localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('drug_search_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(history);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);
  
  // Zapisz historię do localStorage
  const saveSearchHistory = useCallback((newQuery: string) => {
    if (newQuery.trim().length < 2) return;
    
    const newHistory = [
      { query: newQuery, timestamp: Date.now() },
      ...searchHistory.filter(item => item.query !== newQuery)
    ].slice(0, 10); // Maksymalnie 10 ostatnich wyszukiwań
    
    setSearchHistory(newHistory);
    localStorage.setItem('drug_search_history', JSON.stringify(newHistory));
  }, [searchHistory]);
  
  // Debounced suggestions
  const updateSuggestions = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchService && searchQuery.length >= 2) {
        const newSuggestions = searchService.getSuggestions(searchQuery, 8);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        setShowHistory(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, [searchService]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestion(-1);
    
    if (value.trim()) {
      updateSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };
  
  const handleInputFocus = () => {
    if (query.trim()) {
      updateSuggestions(query);
    } else if (searchHistory.length > 0) {
      setShowHistory(true);
      setShowSuggestions(false);
    }
  };
  
  const handleInputBlur = () => {
    // Opóźnienie aby umożliwić kliknięcie na sugestię
    setTimeout(() => {
      setShowSuggestions(false);
      setShowHistory(false);
    }, 200);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = showHistory ? searchHistory.length : suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > -1 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          const selectedItem = showHistory 
            ? searchHistory[selectedSuggestion].query
            : suggestions[selectedSuggestion];
          handleSearchSubmit(selectedItem);
        } else {
          handleSearchSubmit(query);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setShowHistory(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };
  
  const handleSearchSubmit = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setQuery(trimmedQuery);
      saveSearchHistory(trimmedQuery);
      onSearch(trimmedQuery);
      setShowSuggestions(false);
      setShowHistory(false);
      setSelectedSuggestion(-1);
      inputRef.current?.blur();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSearchSubmit(suggestion);
  };
  
  const handleHistoryClick = (historyItem: SearchHistory) => {
    handleSearchSubmit(historyItem.query);
  };
  
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowHistory(false);
    setSelectedSuggestion(-1);
    onSearch('');
    inputRef.current?.focus();
  };
  
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('drug_search_history');
    setShowHistory(false);
  };
  
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} dni temu`;
    if (hours > 0) return `${hours} godz. temu`;
    if (minutes > 0) return `${minutes} min. temu`;
    return 'przed chwilą';
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className={`h-5 w-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 ${query ? 'pr-20' : 'pr-10'} py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } ${showSuggestions || showHistory ? 'rounded-b-none' : ''}`}
          autoComplete="off"
          spellCheck="false"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* History button */}
          <button
            onClick={() => setShowFullHistory(true)}
            className={`p-2 mr-1 transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Pokaż historię wyszukiwań"
          >
            <FaHistory className="h-4 w-4" />
          </button>
          
          {/* Clear button */}
          {query && (
            <button
              onClick={clearSearch}
              className={`p-2 mr-1 transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Wyczyść wyszukiwanie"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {(showSuggestions || showHistory) && (
        <div
          ref={suggestionsRef}
          className={`absolute z-50 w-full mt-0 rounded-b-lg border-2 border-t-0 max-h-80 overflow-y-auto ${
            darkMode
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-300'
          } shadow-lg`}
        >
          {showHistory && searchHistory.length > 0 && (
            <>
              <div className={`px-4 py-2 border-b flex items-center justify-between ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <FaHistory className={`h-4 w-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Ostatnie wyszukiwania
                  </span>
                </div>
                <button
                  onClick={clearHistory}
                  className={`text-xs transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Wyczyść
                </button>
              </div>
              
              {searchHistory.map((item, index) => (
                <button
                  key={`${item.query}-${item.timestamp}`}
                  onClick={() => handleHistoryClick(item)}
                  className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                    selectedSuggestion === index
                      ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaClock className={`h-3 w-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <span className={
                      darkMode ? 'text-white' : 'text-gray-900'
                    }>
                      {item.query}
                    </span>
                  </div>
                  <span className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </button>
              ))}
            </>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <>
              {showHistory && searchHistory.length > 0 && (
                <div className={`border-t ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`} />
              )}
              
              <div className={`px-4 py-2 border-b ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sugestie
                </span>
              </div>
              
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    selectedSuggestion === (showHistory ? searchHistory.length + index : index)
                      ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaSearch className={`h-3 w-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <span className={
                      darkMode ? 'text-white' : 'text-gray-900'
                    }>
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
          
          {showSuggestions && suggestions.length === 0 && query.length >= 2 && (
            <div className={`px-4 py-3 text-center ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Brak sugestii dla "{query}"
            </div>
          )}
        </div>
      )}
      
      {/* Full Search History Modal */}
      <SearchHistory
        isVisible={showFullHistory}
        onClose={() => setShowFullHistory(false)}
        onSearchSelect={(selectedQuery, filters) => {
          setQuery(selectedQuery);
          onSearch(selectedQuery);
          setShowFullHistory(false);
          setShowSuggestions(false);
        }}
        darkMode={darkMode}
      />
    </div>
  );
};

export default DrugSearchBar;