import React, { useState } from 'react';
import { Ebook } from '../../types/ebook';
import { CartIcon, HeartIcon, EyeIcon, CompareIcon, StarIcon, BoltIcon } from '../icons/CustomIcons';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import LazyImage from './LazyImage';

interface ProductCardEnhancedProps {
  ebook: Ebook;
  darkMode: boolean;
  onQuickView?: (ebook: Ebook) => void;
  onAddToComparison?: (ebookId: string) => void;
  onNavigate?: (path: string) => void;
  onTagClick?: (tag: string, type: 'format' | 'discount' | 'new' | 'bestseller') => void;
}

// Mapowanie typu produktu na etykietę
const getProductTypeLabel = (format?: string): { label: string; color: string; bgClass: string } => {
  switch (format?.toLowerCase()) {
    case 'pdf':
      return { label: 'PDF', color: '#ef4444', bgClass: 'bg-red-500 hover:bg-red-600' };
    case 'epub':
      return { label: 'E-book', color: '#3b82f6', bgClass: 'bg-blue-500 hover:bg-blue-600' };
    case 'video':
    case 'mp4':
      return { label: 'Kurs wideo', color: '#8b5cf6', bgClass: 'bg-purple-500 hover:bg-purple-600' };
    case 'notes':
    case 'docx':
      return { label: 'Notatki', color: '#22c55e', bgClass: 'bg-green-500 hover:bg-green-600' };
    default:
      return { label: 'PDF', color: '#ef4444', bgClass: 'bg-red-500 hover:bg-red-600' };
  }
};

/**
 * Ulepszona karta produktu z unikalnym designem premium
 * - Stała wysokość karty (min 420px)
 * - Stała wysokość miniatury (200px)
 * - Klikalne tagi
 * - Hover preview z opisem
 */
const ProductCardEnhanced: React.FC<ProductCardEnhancedProps> = ({
  ebook,
  darkMode,
  onQuickView,
  onAddToComparison,
  onNavigate,
  onTagClick,
}) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  
  const inCart = isInCart(ebook.id);
  const inWishlist = isInWishlist(ebook.id);
  const productType = getProductTypeLabel(ebook.format);
  
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`/sklep/ebook/${ebook.id}`);
    } else {
      window.history.pushState({}, '', `/sklep/ebook/${ebook.id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(ebook);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(ebook.id);
    } else {
      addToWishlist(ebook);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(ebook);
    }
  };

  const handleAddToComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToComparison) {
      onAddToComparison(ebook.id);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tag: string, type: 'format' | 'discount' | 'new' | 'bestseller') => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag, type);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const discountPercentage = ebook.originalPrice && ebook.originalPrice > ebook.price
    ? Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100)
    : 0;

  // Czy produkt jest bestselerem (np. salesCount > 50)
  const isBestseller = (ebook.salesCount || 0) > 50;

  // Skrócony opis do hover preview
  const shortDescription = ebook.description 
    ? ebook.description.slice(0, 100) + (ebook.description.length > 100 ? '...' : '')
    : 'Profesjonalna publikacja medyczna.';

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50'
          : 'bg-white border border-gray-200/80'
      } ${
        isHovered 
          ? 'shadow-2xl shadow-blue-500/10 -translate-y-1' 
          : 'shadow-md hover:shadow-lg'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        borderRadius: '16px',
        minHeight: '440px' // Stała minimalna wysokość karty
      }}
    >
      {/* Tagi w lewym górnym rogu - klikalne */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
        {/* Tag zniżki */}
        {discountPercentage > 0 && (
          <button
            onClick={(e) => handleTagClick(e, 'discount', 'discount')}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md transition-all hover:scale-105"
          >
            -{discountPercentage}%
          </button>
        )}
        
        {/* Tag bestseller */}
        {isBestseller && (
          <button
            onClick={(e) => handleTagClick(e, 'bestseller', 'bestseller')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md transition-all hover:scale-105"
          >
            BESTSELLER
          </button>
        )}
        
        {/* Tag nowość */}
        {ebook.isNew && (
          <button
            onClick={(e) => handleTagClick(e, 'new', 'new')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md transition-all hover:scale-105"
          >
            NOWOŚĆ
          </button>
        )}
      </div>

      {/* Tag typu produktu - prawy górny - klikalny */}
      <button
        onClick={(e) => handleTagClick(e, ebook.format || 'pdf', 'format')}
        className={`absolute top-3 right-3 z-20 ${productType.bgClass} text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md transition-all hover:scale-105`}
      >
        {productType.label}
      </button>

      {/* Obrazek produktu - STAŁA WYSOKOŚĆ 200px */}
      <div className="relative h-[200px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
        <LazyImage
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay z akcjami przy hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 flex flex-col justify-end p-3 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Krótki opis - hover preview */}
          <p className="text-white/90 text-[11px] leading-relaxed mb-2 line-clamp-2">
            {shortDescription}
          </p>
          
          {/* Przyciski akcji */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
              title="Szybki podgląd"
            >
              <EyeIcon size={16} />
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 shadow-lg ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-900 hover:bg-white'
              }`}
              title={inWishlist ? 'Usuń z listy życzeń' : 'Dodaj do listy życzeń'}
            >
              <HeartIcon size={16} color={inWishlist ? '#ffffff' : 'currentColor'} />
            </button>
            
            {onAddToComparison && (
              <button
                onClick={handleAddToComparison}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                title="Porównaj"
              >
                <CompareIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Treść karty - flex-grow aby wypełnić pozostałą przestrzeń */}
      <div className="flex flex-col flex-grow p-4">
        {/* Kategoria */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
            darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}>
            {ebook.category}
          </span>
        </div>

        {/* Tytuł - stała wysokość 2 linii */}
        <h3 className={`font-bold text-sm mb-1 line-clamp-2 leading-snug min-h-[40px] ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {ebook.title}
        </h3>

        {/* Autor */}
        <p className={`text-[11px] mb-2 truncate ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {ebook.author || 'Autor nieznany'}
        </p>

        {/* Ocena */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              size={11}
              filled={i < Math.round(ebook.rating || 0)}
              color={i < Math.round(ebook.rating || 0) ? '#fbbf24' : (darkMode ? '#4b5563' : '#d1d5db')}
            />
          ))}
          <span className={`text-[10px] ml-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            ({ebook.reviewCount || 0})
          </span>
        </div>

        {/* Ikona błyskawicy - dostęp od razu */}
        <div className={`flex items-center gap-1 mb-2 ${
          darkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          <BoltIcon size={12} color="currentColor" />
          <span className="text-[10px] font-medium">Dostęp od razu</span>
        </div>

        {/* Spacer - wypycha cenę i przyciski na dół */}
        <div className="flex-grow" />

        {/* Cena */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-lg font-bold ${
            discountPercentage > 0 ? 'text-red-500' : (darkMode ? 'text-white' : 'text-gray-900')
          }`}>
            {formatPrice(ebook.price)}
          </span>
          {ebook.originalPrice && ebook.originalPrice > ebook.price && (
            <span className={`text-xs line-through ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {formatPrice(ebook.originalPrice)}
            </span>
          )}
        </div>

        {/* Przyciski CTA */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`flex-1 py-2 rounded-xl font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
              inCart
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg'
            }`}
          >
            <CartIcon size={14} color="#ffffff" />
            <span>{inCart ? 'W koszyku' : 'Do koszyka'}</span>
          </button>
          
          <button
            onClick={handleCardClick}
            className={`px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-200 border ${
              darkMode
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Zobacz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardEnhanced;
