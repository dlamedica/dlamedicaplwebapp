import React, { useState, useRef } from 'react';

interface CategoryBarProps {
  darkMode: boolean;
  onCategoryChange: (category: string) => void;
}

// Ikony dla kategorii
const CategoryIcons: Record<string, JSX.Element> = {
  'Aktualności': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  'Nauka': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.42a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
    </svg>
  ),
  'Technologie': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'Zdrowie publiczne': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  'Prawo medyczne': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  'Leczenie': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
};

// Kolory dla kategorii
const CategoryColors: Record<string, { bg: string; bgDark: string; text: string; border: string }> = {
  'Aktualności': { bg: 'bg-blue-50', bgDark: 'bg-blue-900/30', text: 'text-blue-600', border: 'border-blue-200' },
  'Nauka': { bg: 'bg-purple-50', bgDark: 'bg-purple-900/30', text: 'text-purple-600', border: 'border-purple-200' },
  'Technologie': { bg: 'bg-cyan-50', bgDark: 'bg-cyan-900/30', text: 'text-cyan-600', border: 'border-cyan-200' },
  'Zdrowie publiczne': { bg: 'bg-rose-50', bgDark: 'bg-rose-900/30', text: 'text-rose-600', border: 'border-rose-200' },
  'Prawo medyczne': { bg: 'bg-amber-50', bgDark: 'bg-amber-900/30', text: 'text-amber-600', border: 'border-amber-200' },
  'Leczenie': { bg: 'bg-indigo-50', bgDark: 'bg-indigo-900/30', text: 'text-indigo-600', border: 'border-indigo-200' },
};

const CategoryBar: React.FC<CategoryBarProps> = ({ darkMode, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('Aktualności');
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Aktualności',
    'Nauka',
    'Technologie',
    'Zdrowie publiczne',
    'Prawo medyczne',
    'Leczenie'
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`w-full py-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/80'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tytuł sekcji */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Przeglądaj kategorie
          </h2>
          {/* Przyciski przewijania na mobile/tablet */}
          <div className="flex gap-2 lg:hidden">
            <button
              onClick={() => scroll('left')}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-sm'
                }`}
              aria-label="Przewiń w lewo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-sm'
                }`}
              aria-label="Przewiń w prawo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Kafelki kategorii */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:flex-wrap lg:justify-center lg:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const colors = CategoryColors[category] || CategoryColors['Aktualności'];
            const icon = CategoryIcons[category] || CategoryIcons['Aktualności'];

            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Kategoria ${category}`}
                className={`
                  flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-sm
                  transition-all duration-300 border
                  ${isActive
                    ? `${darkMode ? 'bg-[#38b6ff]' : 'bg-[#38b6ff]'} text-white border-transparent shadow-lg shadow-[#38b6ff]/30 scale-[1.02]`
                    : darkMode
                      ? `${colors.bgDark} text-gray-300 border-gray-700 hover:border-[#38b6ff]/50 hover:bg-gray-800`
                      : `${colors.bg} ${colors.text} ${colors.border} hover:border-[#38b6ff] hover:shadow-md`
                  }
                `}
              >
                <span className={`${isActive ? 'text-white' : ''}`}>
                  {icon}
                </span>
                <span className="whitespace-nowrap">{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ukrycie scrollbara dla WebKit */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;
