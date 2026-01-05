import React, { useState, useMemo } from 'react';
import { FilterIcon, CloseIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, StarIcon } from '../icons/CustomIcons';
import { EbookCategory, EBOOK_CATEGORIES } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';

interface ProductFiltersAdvancedProps {
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
}

// Grupowanie kategorii według typu
const CATEGORY_GROUPS = {
  preclinical: {
    name: 'Przedkliniczne',
    categories: ['anatomy', 'physiology', 'biochemistry', 'pathophysiology', 'histology', 'embryology', 'pharmacology']
  },
  clinical: {
    name: 'Kliniczne',
    categories: ['internal-medicine', 'cardiology', 'pulmonology', 'neurology', 'gastroenterology', 'nephrology', 'hematology', 'endocrinology', 'rheumatology', 'infectious-diseases', 'psychiatry', 'dermatology', 'pediatrics', 'gynecology']
  },
  diagnostics: {
    name: 'Diagnostyka',
    categories: ['ekg', 'usg', 'radiology', 'laboratory', 'imaging']
  },
  procedures: {
    name: 'Procedury i specjalizacje',
    categories: ['geriatrics', 'emergency', 'intensive-care', 'surgery', 'orthopedics', 'anesthesiology', 'oncology', 'palliative-care']
  }
};

const ProductFiltersAdvanced: React.FC<ProductFiltersAdvancedProps> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const categories = Object.values(EBOOK_CATEGORIES);

  // Pobierz wszystkie dostępne tagi z produktów
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    mockEbooks.forEach(ebook => {
      ebook.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, []);

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

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 1000 || 
    ratingMin > 0;

  const activeFiltersCount = selectedCategories.length + 
    selectedTags.length + 
    (priceRange[0] > 0 ? 1 : 0) + 
    (priceRange[1] < 1000 ? 1 : 0) + 
    (ratingMin > 0 ? 1 : 0);

  // Predefiniowane opcje oceny
  const ratingOptions = [
    { value: 0, label: 'Wszystkie' },
    { value: 4.0, label: 'Od 4.0 ⭐' },
    { value: 4.5, label: 'Od 4.5 ⭐' },
    { value: 5.0, label: 'Tylko 5.0 ⭐' },
  ];

  // Znajdź kategorię po ID
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="mb-4">
      {/* Header z przyciskiem rozwijania i resetem */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${
            darkMode
              ? hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <FilterIcon size={16} />
            <span className="text-sm">Zaawansowane filtry</span>
            {hasActiveFilters && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                'bg-white/20'
              }`}>
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </button>

        {/* Przycisk Reset - zawsze widoczny */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              darkMode
                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            <CloseIcon size={14} />
            <span className="hidden sm:inline">Wyczyść filtry</span>
          </button>
        )}
      </div>

      {/* Aktywne filtry - podgląd */}
      {hasActiveFilters && !isOpen && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedCategories.map(cat => {
            const info = getCategoryInfo(cat);
            return (
              <span
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  darkMode
                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {info?.name || cat}
                <CloseIcon size={10} />
              </span>
            );
          })}
          {selectedTags.map(tag => (
            <span
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                darkMode
                  ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {tag}
              <CloseIcon size={10} />
            </span>
          ))}
          {ratingMin > 0 && (
            <span
              onClick={() => onRatingChange(0)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                darkMode
                  ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Od {ratingMin.toFixed(1)} ⭐
              <CloseIcon size={10} />
            </span>
          )}
        </div>
      )}

      {/* Panel filtrów - rozwijany */}
      {isOpen && (
        <div className={`mt-3 p-4 rounded-xl space-y-4 ${
          darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          {/* Kategorie pogrupowane */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Kategorie ({selectedCategories.length})
            </h4>
            
            <div className="space-y-2">
              {Object.entries(CATEGORY_GROUPS).map(([groupKey, group]) => {
                const groupCategories = group.categories
                  .map(id => getCategoryInfo(id as EbookCategory))
                  .filter(Boolean);
                
                if (groupCategories.length === 0) return null;

                const selectedInGroup = group.categories.filter(id => 
                  selectedCategories.includes(id as EbookCategory)
                ).length;

                return (
                  <div key={groupKey} className={`rounded-lg overflow-hidden ${
                    darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                  }`}>
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className={`w-full px-3 py-2 flex items-center justify-between text-sm font-medium ${
                        darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {group.name}
                        {selectedInGroup > 0 && (
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {selectedInGroup}
                          </span>
                        )}
                      </span>
                      {expandedGroups.has(groupKey) ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
                    </button>
                    
                    {expandedGroups.has(groupKey) && (
                      <div className="px-3 pb-3 grid grid-cols-2 md:grid-cols-3 gap-1.5">
                        {groupCategories.map((categoryInfo) => {
                          if (!categoryInfo) return null;
                          const isSelected = selectedCategories.includes(categoryInfo.id);
                          return (
                            <button
                              key={categoryInfo.id}
                              onClick={() => toggleCategory(categoryInfo.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : darkMode
                                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                              }`}
                            >
                              {isSelected && <CheckIcon size={10} color="currentColor" />}
                              <span className="truncate">{categoryInfo.name}</span>
                              {isSelected && <CloseIcon size={10} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tagi - kompaktowe */}
          {availableTags.length > 0 && (
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Tagi ({selectedTags.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {isSelected && <CheckIcon size={8} color="currentColor" />}
                      {tag}
                      {isSelected && <CloseIcon size={8} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cena i Ocena w jednym rzędzie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zakres cenowy */}
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Cena (PLN)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                  className={`w-20 px-2 py-1.5 rounded-lg text-sm border ${
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Od"
                />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                  className={`w-20 px-2 py-1.5 rounded-lg text-sm border ${
                    darkMode
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Do"
                />
              </div>
            </div>

            {/* Ocena - przyciski */}
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Minimalna ocena
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ratingOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => onRatingChange(option.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      ratingMin === option.value
                        ? 'bg-yellow-500 text-black'
                        : darkMode
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFiltersAdvanced;
