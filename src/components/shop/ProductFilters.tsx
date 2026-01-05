import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { EbookCategory, EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';

interface ProductFiltersProps {
  darkMode: boolean;
  selectedCategory: EbookCategory | 'all';
  onCategoryChange: (category: EbookCategory | 'all') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  fontSize: 'small' | 'medium' | 'large';
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  darkMode,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showFilters,
  onToggleFilters,
  fontSize,
}) => {
  const fontSizes = {
    small: { title: 'text-lg', text: 'text-sm' },
    medium: { title: 'text-xl', text: 'text-base' },
    large: { title: 'text-2xl', text: 'text-lg' },
  }[fontSize];

  const categories = Object.values(EBOOK_CATEGORIES);
  const maxPrice = 1000;

  const quickPriceFilters = [
    { label: 'Do 50 zł', range: [0, 50] as [number, number] },
    { label: '50-100 zł', range: [50, 100] as [number, number] },
    { label: '100-200 zł', range: [100, 200] as [number, number] },
    { label: 'Powyżej 200 zł', range: [200, maxPrice] as [number, number] },
  ];

  return (
    <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } ${fontSizes.text}`}
        >
          <FaFilter />
          Filtry
        </button>
        {showFilters && (
          <button
            onClick={onToggleFilters}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="space-y-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          {/* Price Filters */}
          <div>
            <h3 className={`${fontSizes.text} font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Cena
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickPriceFilters.map((filter, index) => {
                const isActive =
                  priceRange[0] === filter.range[0] && priceRange[1] === filter.range[1];
                return (
                  <button
                    key={index}
                    onClick={() => onPriceRangeChange(filter.range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#38b6ff] text-black'
                        : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {priceRange[0]} zł
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {priceRange[1]} zł
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="10"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <h3 className={`${fontSizes.text} font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Kategorie
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'bg-[#38b6ff] text-black'
                    : darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Wszystkie
              </button>
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.iconKey);
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#38b6ff] text-black'
                        : darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {React.createElement(IconComponent, { size: 16 })}
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;

