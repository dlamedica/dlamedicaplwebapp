/**
 * Komponent BundleDeal - Pakiety produktów z rabatem
 * "Kup 3 za cenę 2" lub podobne oferty
 */

import React from 'react';
import { FaBox, FaTag, FaCheckCircle } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface BundleDealProps {
  products: Ebook[];
  discount: number; // Procent rabatu
  darkMode?: boolean;
  onAddBundle: (products: Ebook[]) => void;
  onViewProduct: (productId: string) => void;
}

const BundleDeal: React.FC<BundleDealProps> = ({
  products,
  discount,
  darkMode = false,
  onAddBundle,
  onViewProduct,
}) => {
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const discountedPrice = totalPrice * (1 - discount / 100);
  const savings = totalPrice - discountedPrice;

  if (products.length < 2) {
    return null;
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${
      darkMode
        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500'
        : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500'
    } shadow-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
          <FaBox className="text-white text-xl" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📦 Pakiet Oszczędnościowy
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kup wszystkie razem i oszczędź {discount}%!
          </p>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-2 mb-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`p-3 rounded-lg flex items-center gap-3 ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            }`}
          >
            <FaCheckCircle className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.title}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.author}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.price.toFixed(2)} PLN
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className={`p-4 rounded-lg mb-4 ${
        darkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Cena regularna:
          </span>
          <span className={`line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {totalPrice.toFixed(2)} PLN
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            Rabat {discount}%:
          </span>
          <span className={`font-bold text-red-500`}>
            -{savings.toFixed(2)} PLN
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-400">
          <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cena pakietu:
          </span>
          <span className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {discountedPrice.toFixed(2)} PLN
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onAddBundle(products)}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
          darkMode
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
      >
        <FaTag />
        Kup pakiet i oszczędź {savings.toFixed(2)} PLN!
      </button>

      <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        💡 Oszczędzasz {savings.toFixed(2)} PLN kupując pakiet zamiast osobno!
      </p>
    </div>
  );
};

export default BundleDeal;

