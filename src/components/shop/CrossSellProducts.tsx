import React from 'react';
import { Ebook } from '../../types/ebook';
import EbookCard from './EbookCard';

interface CrossSellProductsProps {
  products: Ebook[];
  darkMode: boolean;
  title?: string;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
  onQuickView?: (ebook: Ebook) => void;
}

const CrossSellProducts: React.FC<CrossSellProductsProps> = ({
  products,
  darkMode,
  title = 'Klienci kupowali również',
  onViewDetails,
  onAddToCart,
  onQuickView,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className={`text-2xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <EbookCard
            key={product.id}
            ebook={product}
            darkMode={darkMode}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

export default CrossSellProducts;

