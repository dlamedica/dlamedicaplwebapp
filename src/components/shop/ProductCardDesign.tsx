import React from 'react';
import { Ebook } from '../../types/ebook';
import { CartIcon, HeartIcon, EyeIcon, CompareIcon, StarIcon, TagIcon } from '../icons/CustomIcons';
import LazyImage from './LazyImage';

interface ProductCardDesignProps {
  ebook: Ebook;
  darkMode: boolean;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
  onQuickView?: (ebook: Ebook) => void;
  onAddToComparison?: (ebookId: string) => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (ebookId: string) => void;
}

/**
 * Unikalny design karty produktu z własnymi ikonami
 */
const ProductCardDesign: React.FC<ProductCardDesignProps> = ({
  ebook,
  darkMode,
  onViewDetails,
  onAddToCart,
  onQuickView,
  onAddToComparison,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const discountPercentage = ebook.originalPrice
    ? Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100)
    : 0;

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-gray-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
    } hover:shadow-2xl hover:scale-[1.02]`}>
      {/* Badge Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {ebook.isNew && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold shadow-lg">
            NOWOŚĆ
          </div>
        )}
        {ebook.isBestseller && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
            BESTSELLER
          </div>
        )}
        {ebook.isOnSale && discountPercentage > 0 && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Quick Actions - Top Right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(ebook.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
              isInWishlist
                ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-lg'
                : darkMode
                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                : 'bg-white/80 text-gray-600 hover:bg-gray-100/80'
            }`}
            aria-label={isInWishlist ? 'Usuń z listy życzeń' : 'Dodaj do listy życzeń'}
          >
            <HeartIcon size={18} color={isInWishlist ? 'white' : 'currentColor'} filled={isInWishlist} />
          </button>
        )}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(ebook);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                : 'bg-white/80 text-gray-600 hover:bg-gray-100/80'
            }`}
            aria-label="Szybki podgląd"
          >
            <EyeIcon size={18} />
          </button>
        )}
        {onAddToComparison && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToComparison(ebook.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
              darkMode
                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                : 'bg-white/80 text-gray-600 hover:bg-gray-100/80'
            }`}
            aria-label="Dodaj do porównania"
          >
            <CompareIcon size={18} />
          </button>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <LazyImage
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {ebook.category}
          </span>
          {ebook.tags.slice(0, 2).map((tag) => (
            <div key={tag} className="flex items-center gap-1">
              <TagIcon size={12} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              <span className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 line-clamp-2 group-hover:text-[#38b6ff] transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {ebook.title}
        </h3>

        {/* Author */}
        <p className={`text-sm mb-3 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {ebook.author}
        </p>

        {/* Rating */}
        {ebook.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={14}
                  color={star <= Math.round(ebook.rating!) ? '#FBBF24' : darkMode ? '#4B5563' : '#D1D5DB'}
                  filled={star <= Math.round(ebook.rating!)}
                />
              ))}
            </div>
            <span className={`text-sm font-semibold ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {ebook.rating.toFixed(1)}
            </span>
            {ebook.reviewCount && (
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                ({ebook.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          {ebook.originalPrice && (
            <span className={`text-sm line-through ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {formatPrice(ebook.originalPrice)}
            </span>
          )}
          <span className={`text-2xl font-bold bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] bg-clip-text text-transparent`}>
            {formatPrice(ebook.price)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(ebook.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg'
            }`}
          >
            Szczegóły
          </button>
          <button
            onClick={() => onAddToCart(ebook)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white hover:from-[#2a9fe5] hover:to-[#1a8fd5] hover:shadow-lg hover:scale-105`}
          >
            <CartIcon size={18} color="white" />
            Do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDesign;

