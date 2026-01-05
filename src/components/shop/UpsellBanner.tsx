import React from 'react';
import { FaArrowUp, FaCheck } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';
import LazyImage from './LazyImage';

interface UpsellBannerProps {
  product: Ebook;
  darkMode: boolean;
  discount?: number;
  onAddToCart: (ebook: Ebook) => void;
  onViewDetails: (ebookId: string) => void;
}

const UpsellBanner: React.FC<UpsellBannerProps> = ({
  product,
  darkMode,
  discount = 20,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className={`mt-8 p-6 rounded-lg border-2 ${
      darkMode
        ? 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500'
        : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
    }`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <LazyImage
            src={product.coverImage}
            alt={product.title}
            className="w-32 h-48 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaArrowUp className={darkMode ? 'text-yellow-400' : 'text-purple-600'} />
            <span className={`text-sm font-semibold ${
              darkMode ? 'text-yellow-400' : 'text-purple-600'
            }`}>
              UPSELL - Oszczędź {discount}%
            </span>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {product.title}
          </h3>
          <p className={`text-sm mb-4 line-clamp-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {product.shortDescription || product.description.substring(0, 150)}...
          </p>
          <div className="flex items-center gap-4">
            {product.originalPrice && (
              <span className={`text-lg line-through ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {new Intl.NumberFormat('pl-PL', {
                  style: 'currency',
                  currency: 'PLN',
                }).format(product.originalPrice)}
              </span>
            )}
            <span className={`text-2xl font-bold ${
              darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
            }`}>
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
              }).format(product.price)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            }`}
          >
            <FaCheck />
            Dodaj do koszyka
          </button>
          <button
            onClick={() => onViewDetails(product.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            Zobacz szczegóły
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsellBanner;

