import React from 'react';

interface ProductCardSkeletonProps {
  darkMode: boolean;
}

/**
 * Skeleton loader dla karty produktu
 * Wyświetlany podczas ładowania produktów
 */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ darkMode }) => {
  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50'
          : 'bg-white border border-gray-200/80'
      }`}
      style={{ 
        borderRadius: '16px',
        minHeight: '440px'
      }}
    >
      {/* Skeleton miniatury */}
      <div className={`h-[200px] flex-shrink-0 animate-pulse ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        {/* Shimmer effect */}
        <div className="h-full w-full relative overflow-hidden">
          <div className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r ${
            darkMode 
              ? 'from-transparent via-gray-600/20 to-transparent' 
              : 'from-transparent via-white/40 to-transparent'
          }`} />
        </div>
      </div>

      {/* Skeleton treści */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Kategoria */}
        <div className={`h-4 w-20 rounded animate-pulse ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Tytuł */}
        <div className="space-y-1.5">
          <div className={`h-4 w-full rounded animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-4 w-3/4 rounded animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>

        {/* Autor */}
        <div className={`h-3 w-1/2 rounded animate-pulse ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Ocena */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded animate-pulse ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Cena */}
        <div className={`h-6 w-24 rounded animate-pulse ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />

        {/* Przyciski */}
        <div className="flex gap-2">
          <div className={`flex-1 h-10 rounded-xl animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`w-20 h-10 rounded-xl animate-pulse ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

