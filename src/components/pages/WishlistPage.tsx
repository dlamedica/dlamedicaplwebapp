import React from 'react';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { Ebook } from '../../types/ebook';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';

interface WishlistPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const WishlistPage: React.FC<WishlistPageProps> = ({ darkMode, fontSize }) => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl',
          subtitle: 'text-lg',
          text: 'text-sm',
          button: 'text-sm',
        };
      case 'large':
        return {
          title: 'text-4xl',
          subtitle: 'text-2xl',
          text: 'text-lg',
          button: 'text-lg',
        };
      default:
        return {
          title: 'text-3xl',
          subtitle: 'text-xl',
          text: 'text-base',
          button: 'text-base',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const handleBackToShop = () => {
    window.history.pushState({}, '', '/sklep');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleAddToCart = (ebook: Ebook) => {
    addToCart(ebook);
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className={`text-center py-16 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex justify-center mb-6">
              <FaHeart 
                className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                size={80}
              />
            </div>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Twoja lista życzeń jest pusta
            </h2>
            <p className={`${fontSizes.text} mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dodaj produkty do listy życzeń, aby zapisać je na później
            </p>
            <button
              onClick={handleBackToShop}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button}`}
            >
              <FaArrowLeft className="inline mr-2" />
              Powrót do sklepu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToShop}
            className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FaArrowLeft />
            Powrót do sklepu
          </button>
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Lista życzeń
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {items.length} {items.length === 1 ? 'produkt' : 'produktów'} w liście życzeń
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((ebook) => {
            const categoryInfo = EBOOK_CATEGORIES[ebook.category];
            const IconComponent = getCategoryIcon(categoryInfo.iconKey);
            
            return (
              <div
                key={ebook.id}
                className={`p-6 rounded-lg shadow-md ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                {/* Cover Image */}
                <div className="mb-4">
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Ebook';
                    }}
                  />
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent 
                      className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                      size={16}
                    />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {categoryInfo.name}
                    </span>
                  </div>

                  <h3 className={`${fontSizes.subtitle} font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {ebook.title}
                  </h3>
                  <p className={`${fontSizes.text} mb-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {ebook.author}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    {ebook.originalPrice && (
                      <p className={`text-sm line-through mb-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {formatPrice(ebook.originalPrice)}
                      </p>
                    )}
                    <p className={`${fontSizes.subtitle} font-bold ${
                      darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                    }`}>
                      {formatPrice(ebook.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(ebook)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                        darkMode
                          ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                          : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                      } ${fontSizes.button}`}
                    >
                      <FaShoppingCart />
                      Do koszyka
                    </button>
                    <button
                      onClick={() => removeFromWishlist(ebook.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } ${fontSizes.button}`}
                      title="Usuń z listy życzeń"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

