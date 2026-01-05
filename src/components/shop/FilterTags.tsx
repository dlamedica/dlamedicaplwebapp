import React from 'react';
import { CloseIcon, CheckIcon } from '../icons/CustomIcons';

interface FilterTag {
  id: string;
  label: string;
  type: 'format' | 'discount' | 'new' | 'bestseller' | 'sort';
  color?: string;
}

interface FilterTagsProps {
  darkMode: boolean;
  activeTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
}

const AVAILABLE_TAGS: FilterTag[] = [
  { id: 'pdf', label: 'PDF', type: 'format', color: 'bg-red-500' },
  { id: 'epub', label: 'E-book', type: 'format', color: 'bg-blue-500' },
  { id: 'video', label: 'Wideo', type: 'format', color: 'bg-purple-500' },
  { id: 'discount', label: 'Rabat', type: 'discount', color: 'bg-pink-500' },
  { id: 'bestseller', label: 'Bestseller', type: 'bestseller', color: 'bg-amber-500' },
  { id: 'new', label: 'Nowość', type: 'new', color: 'bg-emerald-500' },
];

/**
 * Klikalne tagi filtrów w formie "kapsułek"
 */
const FilterTags: React.FC<FilterTagsProps> = ({
  darkMode,
  activeTags,
  onTagToggle,
  onClearAll,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {AVAILABLE_TAGS.map((tag) => {
        const isActive = activeTags.includes(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? `${tag.color} text-white shadow-md`
                : darkMode
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {isActive && <CheckIcon size={12} color="#fff" />}
            <span>{tag.label}</span>
            {isActive && (
              <CloseIcon size={12} color="#fff" className="ml-0.5" />
            )}
          </button>
        );
      })}

      {activeTags.length > 0 && (
        <button
          onClick={onClearAll}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            darkMode
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Wyczyść
        </button>
      )}
    </div>
  );
};

export default FilterTags;

export { AVAILABLE_TAGS };
export type { FilterTag };

