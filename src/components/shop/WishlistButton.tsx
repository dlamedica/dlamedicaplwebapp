import React from 'react';
import { HeartIcon } from '../icons/CustomIcons';
import { useWishlist } from '../../contexts/WishlistContext';
import { Ebook } from '../../types/ebook';

interface WishlistButtonProps {
  ebook: Ebook;
  darkMode: boolean;
  variant?: 'icon' | 'button' | 'compact';
  onToggle?: () => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  ebook,
  darkMode,
  variant = 'button',
  onToggle,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(ebook.id);

  const handleToggle = () => {
    if (inWishlist) {
      removeFromWishlist(ebook.id);
    } else {
      addToWishlist(ebook);
    }
    if (onToggle) {
      onToggle();
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
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
        <HeartIcon color={inWishlist ? 'currentColor' : 'currentColor'} />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
          inWishlist
            ? darkMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-600 text-white hover:bg-red-700'
            : darkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label={inWishlist ? `Usuń ${ebook.title} z listy życzeń` : `Dodaj ${ebook.title} do listy życzeń`}
      >
        <FaHeart className={inWishlist ? 'fill-current' : ''} size={12} />
        <span>{inWishlist ? 'W liście' : 'Lista'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
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
      <FaHeart className={inWishlist ? 'fill-current' : ''} />
      {inWishlist ? 'W liście życzeń' : 'Dodaj do listy życzeń'}
    </button>
  );
};

export default WishlistButton;

