import React, { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaTimes, FaClock, FaTrash } from 'react-icons/fa';

interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
  filters?: {
    pharmaceuticalForm?: string;
    administrationRoute?: string;
    onlyRefunded?: boolean;
    atcGroup?: string;
  };
}

interface SearchHistoryProps {
  onSearchSelect: (query: string, filters?: SearchHistoryEntry['filters']) => void;
  onClose: () => void;
  darkMode?: boolean;
  isVisible: boolean;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSearchSelect,
  onClose,
  darkMode = false,
  isVisible
}) => {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const saved = localStorage.getItem('drug_search_history');
        if (saved) {
          const parsedHistory = JSON.parse(saved).map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
          setHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    if (isVisible) {
      loadHistory();
    }
  }, [isVisible]);

  // Save search to history
  const saveSearch = (query: string, resultsCount: number, filters?: SearchHistoryEntry['filters']) => {
    if (!query.trim()) return;

    const newEntry: SearchHistoryEntry = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
      resultsCount,
      filters
    };

    const updatedHistory = [
      newEntry,
      ...history.filter(entry => entry.query !== query.trim())
    ].slice(0, 10); // Keep only last 10 searches

    setHistory(updatedHistory);
    
    try {
      localStorage.setItem('drug_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('drug_search_history');
  };

  // Remove specific entry
  const removeEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('drug_search_history', JSON.stringify(updatedHistory));
  };

  // Filter history based on search term
  const filteredHistory = history.filter(entry =>
    entry.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Przed chwilą';
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return timestamp.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Format filters for display
  const formatFilters = (filters?: SearchHistoryEntry['filters']) => {
    if (!filters) return null;
    
    const filterParts: string[] = [];
    if (filters.pharmaceuticalForm) filterParts.push(filters.pharmaceuticalForm);
    if (filters.administrationRoute) filterParts.push(filters.administrationRoute);
    if (filters.onlyRefunded) filterParts.push('Tylko refundowane');
    if (filters.atcGroup) filterParts.push(`ATC: ${filters.atcGroup}`);
    
    return filterParts.length > 0 ? filterParts.join(' • ') : null;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-2xl ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } max-h-[70vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <FaHistory className={`w-5 h-5 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Historia wyszukiwań
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                  darkMode
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                <FaTrash className="w-3 h-3" />
                Wyczyść
              </button>
            )}
            
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search in history */}
        {history.length > 5 && (
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Szukaj w historii..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              />
            </div>
          </div>
        )}

        {/* History list */}
        <div className="overflow-y-auto max-h-[50vh]">
          {filteredHistory.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className={`px-6 py-4 hover:bg-opacity-50 transition-colors cursor-pointer group ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSearchSelect(entry.query, entry.filters)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <FaSearch className={`w-4 h-4 flex-shrink-0 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <h3 className={`font-medium truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          "{entry.query}"
                        </h3>
                      </div>
                      
                      <div className="mt-1 ml-7">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {entry.resultsCount} {entry.resultsCount === 1 ? 'wynik' : 'wyników'}
                          </span>
                          <div className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            <span className={`${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {formatTimestamp(entry.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        {entry.filters && formatFilters(entry.filters) && (
                          <div className={`mt-1 text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Filtry: {formatFilters(entry.filters)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(entry.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                        darkMode
                          ? 'text-gray-500 hover:text-red-400'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FaHistory className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Brak historii wyszukiwań
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Twoje ostatnie wyszukiwania pojawią się tutaj
              </p>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <FaSearch className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Nie znaleziono wyników
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Spróbuj użyć innego hasła wyszukiwania
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for managing search history
export const useSearchHistory = () => {
  const saveSearch = (query: string, resultsCount: number, filters?: SearchHistoryEntry['filters']) => {
    if (!query.trim()) return;

    const newEntry: SearchHistoryEntry = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
      resultsCount,
      filters
    };

    try {
      const existingHistory = localStorage.getItem('drug_search_history');
      const history: SearchHistoryEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      const updatedHistory = [
        newEntry,
        ...history.filter(entry => entry.query !== query.trim())
      ].slice(0, 10);

      localStorage.setItem('drug_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  return { saveSearch };
};

export default SearchHistory;
export type { SearchHistoryEntry };