import React from 'react';
import { Ebook } from '../../types/ebook';
import { EyeIcon, HeartIcon, CompareIcon, CartIcon } from '../icons/CustomIcons';

interface ProductQuickActionsCustomProps {
  ebook: Ebook;
  darkMode: boolean;
  onQuickView: () => void;
  onAddToWishlist: () => void;
  onAddToComparison: () => void;
  onAddToCart: () => void;
  isInWishlist: boolean;
  isInComparison: boolean;
  isInCart: boolean;
}

const ProductQuickActionsCustom: React.FC<ProductQuickActionsCustomProps> = ({
  ebook,
  darkMode,
  onQuickView,
  onAddToWishlist,
  onAddToComparison,
  onAddToCart,
  isInWishlist,
  isInComparison,
  isInCart,
}) => {
  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      <div className={`flex flex-col gap-2 p-2 rounded-lg backdrop-blur-sm ${
        darkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-90'
      } shadow-lg`}>
        <button
          onClick={onQuickView}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
          title="Szybki podgląd"
          aria-label={`Szybki podgląd: ${ebook.title}`}
        >
          <EyeIcon size={18} color={darkMode ? '#38b6ff' : '#38b6ff'} />
        </button>
        
        <button
          onClick={onAddToWishlist}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
            isInWishlist
              ? darkMode
                ? 'bg-red-900 bg-opacity-50 text-red-400'
                : 'bg-red-100 text-red-600'
              : darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
          title={isInWishlist ? 'Usuń z listy życzeń' : 'Dodaj do listy życzeń'}
          aria-label={isInWishlist ? `Usuń ${ebook.title} z listy życzeń` : `Dodaj ${ebook.title} do listy życzeń`}
        >
          <HeartIcon 
            size={18} 
            color={isInWishlist ? (darkMode ? '#ef4444' : '#dc2626') : (darkMode ? '#9ca3af' : '#6b7280')} 
          />
        </button>
        
        <button
          onClick={onAddToComparison}
          disabled={isInComparison}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
            isInComparison
              ? darkMode
                ? 'bg-blue-900 bg-opacity-50 text-blue-400'
                : 'bg-blue-100 text-blue-600'
              : darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
          title={isInComparison ? 'Już w porównaniu' : 'Dodaj do porównania'}
          aria-label={isInComparison ? `${ebook.title} jest już w porównaniu` : `Dodaj ${ebook.title} do porównania`}
        >
          <CompareIcon 
            size={18} 
            color={isInComparison ? (darkMode ? '#60a5fa' : '#2563eb') : (darkMode ? '#9ca3af' : '#6b7280')} 
          />
        </button>
        
        <button
          onClick={onAddToCart}
          disabled={isInCart}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
            isInCart
              ? darkMode
                ? 'bg-green-900 bg-opacity-50 text-green-400'
                : 'bg-green-100 text-green-600'
              : darkMode
              ? 'bg-[#38b6ff] hover:bg-[#2a9fe5] text-black'
              : 'bg-[#38b6ff] hover:bg-[#2a9fe5] text-black'
          }`}
          title={isInCart ? 'Już w koszyku' : 'Dodaj do koszyka'}
          aria-label={isInCart ? `${ebook.title} jest już w koszyku` : `Dodaj ${ebook.title} do koszyka`}
        >
          <CartIcon 
            size={18} 
            color={isInCart ? (darkMode ? '#4ade80' : '#16a34a') : '#000000'} 
          />
        </button>
      </div>
    </div>
  );
};

export default ProductQuickActionsCustom;

