import React from 'react';
import { FaTimes, FaShoppingCart, FaHeart, FaStar, FaFilePdf } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../hooks/useToast';
import LazyImage from './LazyImage';

interface QuickViewModalProps {
  ebook: Ebook;
  darkMode: boolean;
  onClose: () => void;
  onViewDetails: (ebookId: string) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  ebook,
  darkMode,
  onClose,
  onViewDetails,
}) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showSuccess } = useToast();

  const inCart = isInCart(ebook.id);
  const inWishlist = isInWishlist(ebook.id);
  const categoryInfo = EBOOK_CATEGORIES[ebook.category];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(ebook);
    showSuccess(`${ebook.title} został dodany do koszyka`);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(ebook.id);
      showSuccess('Usunięto z listy życzeń');
    } else {
      addToWishlist(ebook);
      showSuccess('Dodano do listy życzeń');
    }
  };

  const handleViewDetails = () => {
    onViewDetails(ebook.id);
    onClose();
  };

  const discountPercentage = ebook.originalPrice
    ? Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <FaTimes />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left - Image */}
          <div>
            <div className="relative">
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Ebook';
                }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
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
            </div>
          </div>

          {/* Right - Details */}
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
              {React.createElement(getCategoryIcon(categoryInfo.iconKey), {
                className: darkMode ? 'text-gray-400' : 'text-gray-600',
                size: 20,
              })}
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {categoryInfo.name}
              </span>
            </div>

            {/* Title */}
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {ebook.title}
            </h2>

            {/* Author */}
            <p className={`text-lg mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {ebook.author}
            </p>

            {/* Rating */}
            {ebook.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(ebook.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : darkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }`}
                      size={16}
                    />
                  ))}
                </div>
                <span className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {ebook.rating.toFixed(1)}
                </span>
                {ebook.reviewCount && (
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ({ebook.reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {ebook.originalPrice && (
                <p className={`text-sm line-through mb-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {formatPrice(ebook.originalPrice)}
                </p>
              )}
              <p className={`text-3xl font-bold ${
                darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
              }`}>
                {formatPrice(ebook.price)}
              </p>
            </div>

            {/* Short Description */}
            {(ebook.shortDescription || ebook.description) && (
              <p className={`text-sm mb-6 line-clamp-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {ebook.shortDescription || ebook.description.substring(0, 150) + '...'}
              </p>
            )}

            {/* Quick Info */}
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <FaFilePdf className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {ebook.format} • {ebook.pages} stron • {ebook.fileSize}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  inCart
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                }`}
              >
                <FaShoppingCart />
                {inCart ? 'W koszyku' : 'Dodaj do koszyka'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                    inWishlist
                      ? darkMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                      : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <FaHeart className={inWishlist ? 'fill-current' : ''} />
                  {inWishlist ? 'W liście' : 'Lista życzeń'}
                </button>

                <button
                  onClick={handleViewDetails}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Zobacz szczegóły
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

