/**
 * Komponent CrossSelling - "Często kupowane razem"
 * Sugeruje produkty, które inni kupowali razem z aktualnym produktem
 */

import React from 'react';
import { FaShoppingCart, FaUsers } from 'react-icons/fa';
import EbookCard from './EbookCard';
import { Ebook } from '../../types/ebook';

interface CrossSellingProps {
  currentProduct: Ebook;
  products: Ebook[];
  darkMode?: boolean;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
}

const CrossSelling: React.FC<CrossSellingProps> = ({
  currentProduct,
  products,
  darkMode = false,
  onViewDetails,
  onAddToCart,
}) => {
  // Filtruj produkty (wyklucz aktualny, znajdź podobne)
  const relatedProducts = products
    .filter(p => p.id !== currentProduct.id)
    .filter(p => 
      p.category === currentProduct.category ||
      p.tags.some(tag => currentProduct.tags.includes(tag))
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <FaUsers className="text-white text-xl" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Często kupowane razem
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Inni klienci, którzy kupili ten produkt, wybrali również:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <div key={product.id} className="relative">
            <EbookCard
              ebook={product}
              darkMode={darkMode}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
            {/* Badge "Często razem" */}
            <div className="absolute top-2 right-2 z-10">
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                <FaShoppingCart className="inline mr-1" />
                Razem
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Deal Suggestion */}
      <div className={`mt-6 p-4 rounded-lg ${
        darkMode ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
              💡 Pakiet oszczędnościowy
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              Kup {currentProduct.title} razem z powyższymi produktami i oszczędź do 20%!
            </p>
          </div>
          <button
            onClick={() => {
              // Dodaj wszystkie do koszyka
              relatedProducts.forEach(p => onAddToCart(p));
              onAddToCart(currentProduct);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              darkMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            Dodaj pakiet
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrossSelling;

