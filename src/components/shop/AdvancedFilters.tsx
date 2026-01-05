import React, { useState } from 'react';
import { FaFilter, FaTimes, FaCheck } from 'react-icons/fa';
import { EbookCategory, EBOOK_CATEGORIES } from '../../types/ebook';

interface AdvancedFiltersProps {
  darkMode: boolean;
  selectedCategories: EbookCategory[];
  selectedTags: string[];
  priceRange: [number, number];
  ratingMin: number;
  onCategoriesChange: (categories: EbookCategory[]) => void;
  onTagsChange: (tags: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onReset: () => void;
  availableTags: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  darkMode,
  selectedCategories,
  selectedTags,
  priceRange,
  ratingMin,
  onCategoriesChange,
  onTagsChange,
  onPriceRangeChange,
  onRatingChange,
  onReset,
  availableTags,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = Object.values(EBOOK_CATEGORIES);

  const toggleCategory = (category: EbookCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 1000 || 
    ratingMin > 0;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between ${
          darkMode
            ? hasActiveFilters
              ? 'bg-[#38b6ff] text-black'
              : 'bg-gray-700 text-white hover:bg-gray-600'
            : hasActiveFilters
            ? 'bg-[#38b6ff] text-black'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <FaFilter />
          <span>Zaawansowane filtry</span>
          {hasActiveFilters && (
            <span className={`px-2 py-0.5 rounded text-xs ${
              darkMode ? 'bg-black bg-opacity-20' : 'bg-white bg-opacity-20'
            }`}>
              {selectedCategories.length + selectedTags.length + (ratingMin > 0 ? 1 : 0)}
            </span>
          )}
        </div>
        {isOpen ? <FaTimes /> : <FaCheck />}
      </button>

      {isOpen && (
        <div className={`mt-4 p-6 rounded-lg space-y-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Categories */}
          <div>
            <h3 className={`font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Kategorie
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const categoryInfo = EBOOK_CATEGORIES[category];
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      isSelected
                        ? darkMode
                          ? 'bg-[#38b6ff] text-black'
                          : 'bg-[#38b6ff] text-black'
                        : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && <FaCheck size={12} />}
                    {categoryInfo.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tagi
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                        isSelected
                          ? darkMode
                            ? 'bg-[#38b6ff] text-black'
                            : 'bg-[#38b6ff] text-black'
                          : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected && <FaCheck size={10} className="inline mr-1" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <h3 className={`font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Zakres cenowy
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                className={`w-24 px-3 py-2 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>-</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className={`w-24 px-3 py-2 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <span className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                PLN
              </span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className={`font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Minimalna ocena
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={ratingMin}
                onChange={(e) => onRatingChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className={`text-sm font-semibold w-12 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {ratingMin.toFixed(1)} ⭐
              </span>
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Wyczyść filtry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;

