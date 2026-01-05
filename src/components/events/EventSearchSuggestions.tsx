import React from 'react';
import { SearchIcon } from '../icons/CustomIcons';

interface Event {
  id: number;
  name: string;
  slug: string;
}

interface EventSearchSuggestionsProps {
  suggestions: Event[];
  onSuggestionClick: (event: Event) => void;
  darkMode: boolean;
  visible: boolean;
}

const EventSearchSuggestions: React.FC<EventSearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  darkMode,
  visible
}) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 max-h-64 overflow-y-auto ${
        darkMode
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-2">
        {suggestions.map((event) => (
          <button
            key={event.id}
            onClick={() => onSuggestionClick(event)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
              darkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <SearchIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
            <span className="flex-1 truncate">{event.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventSearchSuggestions;

