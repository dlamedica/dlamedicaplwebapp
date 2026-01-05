import React from 'react';
import { FaFire, FaStar, FaTag } from 'react-icons/fa';
import EbookCard from './EbookCard';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';

interface ProductRecommendationsProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
  onQuickView: (ebook: Ebook) => void;
  onAddToComparison: (ebookId: string) => void;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  darkMode,
  fontSize,
  onViewDetails,
  onAddToCart,
  onQuickView,
  onAddToComparison,
}) => {
  const fontSizes = {
    small: { title: 'text-xl', text: 'text-sm' },
    medium: { title: 'text-2xl', text: 'text-base' },
    large: { title: 'text-3xl', text: 'text-lg' },
  }[fontSize];

  const bestsellers = mockEbooks.filter((e) => e.isBestseller).slice(0, 4);
  const newArrivals = mockEbooks.filter((e) => e.isNew).slice(0, 4);
  const onSale = mockEbooks.filter((e) => e.isOnSale).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaFire className="text-orange-500" size={24} />
            <h2 className={`${fontSizes.title} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Bestsellery
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestsellers.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                darkMode={darkMode}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onAddToComparison={onAddToComparison}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaStar className="text-green-500" size={24} />
            <h2 className={`${fontSizes.title} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Nowości
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                darkMode={darkMode}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onAddToComparison={onAddToComparison}
              />
            ))}
          </div>
        </div>
      )}

      {/* On Sale */}
      {onSale.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FaTag className="text-red-500" size={24} />
            <h2 className={`${fontSizes.title} font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Promocje
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {onSale.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                darkMode={darkMode}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onAddToComparison={onAddToComparison}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;

