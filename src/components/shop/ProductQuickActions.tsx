import React from 'react';
import { CartIcon, HeartIcon, CompareIcon, EyeIcon } from '../icons/CustomIcons';
import { Ebook } from '../../types/ebook';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

interface ProductQuickActionsProps {
  ebook: Ebook;
  darkMode: boolean;
  onQuickView?: (ebook: Ebook) => void;
  onAddToComparison?: (ebookId: string) => void;
  compact?: boolean;
}

const ProductQuickActions: React.FC<ProductQuickActionsProps> = ({
  ebook,
  darkMode,
  onQuickView,
  onAddToComparison,
  compact = false,
}) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inCart = isInCart(ebook.id);
  const inWishlist = isInWishlist(ebook.id);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {onQuickView && (
          <button
            onClick={() => onQuickView(ebook)}
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Szybki podgląd: ${ebook.title}`}
            title="Quick View"
          >
            <EyeIcon size={14} />
          </button>
        )}
        <button
          onClick={() => {
            if (inWishlist) {
              removeFromWishlist(ebook.id);
            } else {
              addToWishlist(ebook);
            }
          }}
          className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
            inWishlist
              ? darkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-600 text-white hover:bg-red-700'
              : darkMode
              ? 'bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-gray-200'
          }`}
          aria-label={inWishlist ? `Usuń ${ebook.title} z listy życzeń` : `Dodaj ${ebook.title} do listy życzeń`}
          title={inWishlist ? 'W liście życzeń' : 'Dodaj do listy życzeń'}
        >
          <HeartIcon size={14} color={inWishlist ? 'currentColor' : 'currentColor'} />
        </button>
        {onAddToComparison && (
          <button
            onClick={() => onAddToComparison(ebook.id)}
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Porównaj: ${ebook.title}`}
            title="Porównaj"
          >
            <CompareIcon size={14} />
          </button>
        )}
        <button
          onClick={() => addToCart(ebook)}
          className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
            inCart
              ? darkMode
                ? 'bg-green-600 text-white'
                : 'bg-green-600 text-white'
              : darkMode
              ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
          }`}
          aria-label={inCart ? `${ebook.title} w koszyku` : `Dodaj ${ebook.title} do koszyka`}
          title={inCart ? 'W koszyku' : 'Dodaj do koszyka'}
        >
          <CartIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {onQuickView && (
        <button
          onClick={() => onQuickView(ebook)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={`Szybki podgląd: ${ebook.title}`}
        >
          <EyeIcon />
          Quick View
        </button>
      )}
      <button
        onClick={() => {
          if (inWishlist) {
            removeFromWishlist(ebook.id);
          } else {
            addToWishlist(ebook);
          }
        }}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
          inWishlist
            ? darkMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-600 text-white hover:bg-red-700'
            : darkMode
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
        aria-label={inWishlist ? `Usuń ${ebook.title} z listy życzeń` : `Dodaj ${ebook.title} do listy życzeń`}
      >
        <HeartIcon color={inWishlist ? 'currentColor' : 'currentColor'} />
        {inWishlist ? 'W liście' : 'Lista życzeń'}
      </button>
      <button
        onClick={() => addToCart(ebook)}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white ${
          inCart
            ? darkMode
              ? 'bg-green-600 text-white'
              : 'bg-green-600 text-white'
            : darkMode
            ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
        }`}
        aria-label={inCart ? `${ebook.title} w koszyku` : `Dodaj ${ebook.title} do koszyka`}
      >
        <CartIcon />
        {inCart ? 'W koszyku' : 'Do koszyka'}
      </button>
    </div>
  );
};

export default ProductQuickActions;

