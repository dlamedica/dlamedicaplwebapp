import React from 'react';
import { FilterIcon } from '../icons/CustomIcons';

interface QuickFilter {
  id: string;
  label: string;
  count: number;
  active: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  onFilterClick: (filterId: string) => void;
  darkMode: boolean;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ filters, onFilterClick, darkMode }) => {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon size={18} color={darkMode ? '#9ca3af' : '#6b7280'} />
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Szybkie filtry
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterClick(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter.active
                ? 'bg-[#38b6ff] text-black shadow-lg'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter.active
                  ? 'bg-black/20'
                  : darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;

