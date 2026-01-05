/**
 * Komponent CheckoutSuggestions - Sugestie produktów w checkout
 * "Dodaj jeszcze jeden produkt i otrzymaj darmową dostawę"
 */

import React from 'react';
import { FaPlus, FaTruck, FaGift } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface CheckoutSuggestionsProps {
  currentTotal: number;
  freeShippingThreshold: number;
  suggestedProducts: Ebook[];
  darkMode?: boolean;
  onAddProduct: (product: Ebook) => void;
  onViewProduct: (productId: string) => void;
}

const CheckoutSuggestions: React.FC<CheckoutSuggestionsProps> = ({
  currentTotal,
  freeShippingThreshold,
  suggestedProducts,
  darkMode = false,
  onAddProduct,
  onViewProduct,
}) => {
  const amountNeeded = freeShippingThreshold - currentTotal;

  if (amountNeeded <= 0 || suggestedProducts.length === 0) {
    return null;
  }

  // Znajdź produkt, który spełni próg
  const perfectProduct = suggestedProducts.find(p => p.price >= amountNeeded && p.price <= amountNeeded * 1.5);
  const bestProduct = perfectProduct || suggestedProducts[0];

  return (
    <div className={`p-4 rounded-lg border-2 ${
      darkMode
        ? 'bg-blue-900/20 border-blue-500'
        : 'bg-blue-50 border-blue-500'
    } shadow-lg mb-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <FaTruck className="text-white text-xl" />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            💡 Dodaj jeszcze jeden produkt!
          </h3>
          <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            Dodaj produkty za {amountNeeded.toFixed(2)} PLN i otrzymaj darmową dostawę!
          </p>
        </div>
      </div>

      {bestProduct && (
        <div className={`p-3 rounded-lg mb-3 ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {bestProduct.title}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {bestProduct.author}
              </p>
            </div>
            <div className="text-right mr-4">
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {bestProduct.price.toFixed(2)} PLN
              </p>
            </div>
            <button
              onClick={() => onAddProduct(bestProduct)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2`}
            >
              <FaPlus />
              Dodaj
            </button>
          </div>
        </div>
      )}

      <div className={`p-2 rounded ${
        darkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Aktualna wartość:
          </span>
          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentTotal.toFixed(2)} PLN
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Do darmowej dostawy:
          </span>
          <span className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {amountNeeded.toFixed(2)} PLN
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${
          darkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${(currentTotal / freeShippingThreshold) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuggestions;

