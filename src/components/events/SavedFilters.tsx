import React, { useState, useEffect } from 'react';
import { BookIcon, TrashIcon, PlusIcon } from '../icons/CustomIcons';

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    eventType?: string;
    type?: string;
    priceFilter?: string;
    dateRange?: string;
  };
}

interface SavedFiltersProps {
  darkMode: boolean;
  onApplyFilter: (filters: SavedFilter['filters']) => void;
}

const SavedFilters: React.FC<SavedFiltersProps> = ({ darkMode, onApplyFilter }) => {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    // Pobierz zapisane filtry z localStorage
    const saved = localStorage.getItem('eventSavedFilters');
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved filters:', e);
      }
    }
  }, []);

  const saveCurrentFilter = (currentFilters: SavedFilter['filters']) => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: currentFilters
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('eventSavedFilters', JSON.stringify(updated));
    setFilterName('');
    setShowSaveDialog(false);
  };

  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('eventSavedFilters', JSON.stringify(updated));
  };

  if (savedFilters.length === 0 && !showSaveDialog) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookIcon size={18} color={darkMode ? '#9ca3af' : '#6b7280'} />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Zapisane filtry
          </h3>
        </div>
        <button
          onClick={() => setShowSaveDialog(true)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
            darkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <PlusIcon size={14} color="currentColor" />
          <span>Zapisz</span>
        </button>
      </div>

      {showSaveDialog && (
        <div className={`mb-4 p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Nazwa filtra..."
            className={`w-full px-3 py-2 rounded-lg border mb-2 ${
              darkMode
                ? 'bg-black border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && filterName.trim()) {
                // TODO: Przekaż aktualne filtry
                saveCurrentFilter({});
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                // TODO: Przekaż aktualne filtry
                saveCurrentFilter({});
              }}
              className="px-4 py-2 bg-[#38b6ff] text-black rounded-lg font-semibold hover:bg-[#2a9fe5] transition-colors"
            >
              Zapisz
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setFilterName('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {savedFilters.map((filter) => (
          <div
            key={filter.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <button
              onClick={() => onApplyFilter(filter.filters)}
              className={`text-sm font-medium hover:text-[#38b6ff] transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {filter.name}
            </button>
            <button
              onClick={() => deleteFilter(filter.id)}
              className="p-1 rounded hover:bg-gray-700/50 transition-colors"
              title="Usuń filtr"
            >
              <TrashIcon size={14} color={darkMode ? '#9ca3af' : '#6b7280'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedFilters;

