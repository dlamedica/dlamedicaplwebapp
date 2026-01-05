import React from 'react';
import { motion } from 'framer-motion';
import { Ebook } from '../../types/ebook';
import ProductCardEnhanced from './ProductCardEnhanced';
import { ChevronRightIcon } from '../icons/CustomIcons';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Ebook[];
  darkMode: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onNavigate?: (path: string) => void;
  onQuickView?: (ebook: Ebook) => void;
  onAddToComparison?: (ebookId: string) => void;
  onTagClick?: (tag: string, type: 'format' | 'discount' | 'new' | 'bestseller') => void;
  maxItems?: number;
  layout?: 'grid' | 'scroll';
  badge?: {
    text: string;
    color: string;
  };
}

/**
 * Sekcja produktów (Bestsellery, Nowości, Polecane, Promocje)
 * - Wspiera layout siatki i przewijania poziomego
 * - Obsługuje badge i przycisk "Zobacz wszystkie"
 */
const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  darkMode,
  showViewAll = true,
  onViewAll,
  onNavigate,
  onQuickView,
  onAddToComparison,
  onTagClick,
  maxItems = 4,
  layout = 'grid',
  badge,
}) => {
  const displayProducts = products.slice(0, maxItems);

  if (displayProducts.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Header sekcji */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${badge.color}`}>
              {badge.text}
            </span>
          )}
          {subtitle && (
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </span>
          )}
        </div>
        
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <span>Zobacz wszystkie</span>
            <ChevronRightIcon size={16} />
          </button>
        )}
      </div>

      {/* Produkty */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayProducts.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCardEnhanced
                ebook={ebook}
                darkMode={darkMode}
                onNavigate={onNavigate}
                onQuickView={onQuickView}
                onAddToComparison={onAddToComparison}
                onTagClick={onTagClick}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative -mx-4 px-4">
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {displayProducts.map((ebook, index) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <ProductCardEnhanced
                  ebook={ebook}
                  darkMode={darkMode}
                  onNavigate={onNavigate}
                  onQuickView={onQuickView}
                  onAddToComparison={onAddToComparison}
                  onTagClick={onTagClick}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductSection;

