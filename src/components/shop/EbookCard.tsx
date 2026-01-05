import React from 'react';
import { Ebook } from '../../types/ebook';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { useWishlist } from '../../contexts/WishlistContext';
import LazyImage from './LazyImage';
import SocialProofBanner from '../games/SocialProofBanner';
import ScarcityIndicator from '../games/ScarcityIndicator';
import ProductTags from './ProductTags';
import AnimatedCard from './AnimatedCard';
import { StarIcon } from '../icons/StarIcon';
import { CartIcon } from '../icons/CartIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { BalanceScaleIcon } from '../icons/BalanceScaleIcon';
import { HeartIcon } from '../icons/HeartIcon';

interface EbookCardProps {
  ebook: Ebook;
  darkMode: boolean;
  onViewDetails: (ebookId: string) => void;
  onAddToCart: (ebook: Ebook) => void;
  onQuickView?: (ebook: Ebook) => void;
  onAddToComparison?: (ebookId: string) => void;
}

const EbookCard: React.FC<EbookCardProps> = ({ 
  ebook, 
  darkMode, 
  onViewDetails, 
  onAddToCart,
  onQuickView,
  onAddToComparison,
}) => {
  const categoryInfo = EBOOK_CATEGORIES[ebook.category];
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(ebook.id);

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
    <AnimatedCard className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className={`w-full h-full ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {ebook.isNew && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded">
            NOWOŚĆ
          </span>
        )}
        {ebook.isBestseller && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded">
            BESTSELLER
          </span>
        )}
        {ebook.isOnSale && ebook.originalPrice && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <LazyImage
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Ebook';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(ebook);
              }}
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-3 py-2 bg-[#38b6ff] text-black rounded-lg font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              title="Szybki podgląd"
              aria-label={`Szybki podgląd: ${ebook.title}`}
            >
              <EyeIcon size={16} />
              Quick View
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(ebook.id);
            }}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
            aria-label={`Zobacz szczegóły: ${ebook.title}`}
          >
            <EyeIcon size={16} />
            Szczegóły
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          {React.createElement(getCategoryIcon(categoryInfo.iconKey), { 
            className: darkMode ? 'text-gray-400' : 'text-gray-600',
            size: 18 
          })}
          <span className={`text-xs font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {categoryInfo.name}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-lg mb-1 line-clamp-2 min-h-[3.5rem] ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <a
            href={`/sklep/ebook/${ebook.id}`}
            onClick={(e) => {
              e.preventDefault();
              onViewDetails(ebook.id);
            }}
            className="hover:text-[#38b6ff] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] rounded"
            aria-label={`Przejdź do szczegółów: ${ebook.title}`}
          >
            {ebook.title}
          </a>
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
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  size={14}
                  color={star <= Math.round(ebook.rating!) ? '#FBBF24' : darkMode ? '#4B5563' : '#D1D5DB'}
                  filled={star <= Math.round(ebook.rating!)}
                />
              ))}
              <span className={`font-semibold ml-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {ebook.rating.toFixed(1)}
              </span>
            </div>
            {ebook.reviewCount && (
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                ({ebook.reviewCount} opinii)
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {ebook.originalPrice && (
            <span className={`text-sm line-through ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {formatPrice(ebook.originalPrice)}
            </span>
          )}
          <span className={`text-2xl font-bold ${
            darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
          }`}>
            {formatPrice(ebook.price)}
          </span>
        </div>

        {/* Social Proof - pokazuj losowo */}
        {Math.random() > 0.7 && (
          <div className="mb-3">
            <SocialProofBanner
              productId={ebook.id}
              darkMode={darkMode}
              variant={Math.random() > 0.5 ? 'purchase' : 'view'}
              compact={true}
            />
          </div>
        )}

        {/* Scarcity Indicator - dla produktów w promocji */}
        {ebook.isOnSale && Math.random() > 0.6 && (
          <div className="mb-3">
            <ScarcityIndicator
              remaining={Math.floor(Math.random() * 5) + 1}
              type="product"
              darkMode={darkMode}
              variant="badge"
              threshold={3}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(ebook.id)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label={`Zobacz szczegóły: ${ebook.title}`}
          >
            Szczegóły
          </button>
          <button
            onClick={() => onAddToCart(ebook)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            }`}
            aria-label={`Dodaj do koszyka: ${ebook.title}`}
          >
            <CartIcon size={18} color="currentColor" />
            Do koszyka
          </button>
          </div>
          {onAddToComparison && (
            <button
              onClick={() => onAddToComparison(ebook.id)}
              className={`w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BalanceScaleIcon size={16} />
              Porównaj
            </button>
          )}
        </div>
      </div>
      </div>
    </AnimatedCard>
  );
};

export default EbookCard;

