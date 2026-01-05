import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Ebook } from '../../types/ebook';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';
import PurchaseProgressBar from '../games/PurchaseProgressBar';
import AbandonedCartTimer from '../shop/AbandonedCartTimer';
import { validateDiscountCode, calculateDiscountedPrice } from '../../services/discountService';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { MinusIcon } from '../icons/MinusIcon';
import { CartIcon } from '../icons/CartIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface CartPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const CartPage: React.FC<CartPageProps> = ({ darkMode, fontSize }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

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

  const handleCheckout = () => {
    window.history.pushState({}, '', '/sklep/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
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
              <CartIcon 
                className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                size={80}
              />
            </div>
            <h2 className={`${fontSizes.title} font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Twój koszyk jest pusty
            </h2>
            <p className={`${fontSizes.text} mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dodaj produkty do koszyka, aby kontynuować zakupy
            </p>
            <button
              onClick={handleBackToShop}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button}`}
            >
              <ArrowLeftIcon className="inline mr-2" size={18} />
              Powrót do sklepu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const baseTotalPrice = getTotalPrice();
  const discountAmount = appliedDiscount > 0 
    ? (baseTotalPrice * appliedDiscount) / 100
    : 0;
  const discountedPrice = appliedDiscount > 0 
    ? calculateDiscountedPrice(baseTotalPrice, discountAmount)
    : baseTotalPrice;
  const totalPrice = discountedPrice;

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
            <ArrowLeftIcon size={18} />
            Powrót do sklepu
          </button>
          <h1 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Twój koszyk
          </h1>
          <p className={`${fontSizes.subtitle} ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {items.length} {items.length === 1 ? 'produkt' : 'produktów'} w koszyku
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Abandoned Cart Timer */}
            <AbandonedCartTimer 
              darkMode={darkMode} 
              onApplyDiscount={(code) => {
                const result = validateDiscountCode(code, baseTotalPrice);
                if (result.valid) {
                  setDiscountCode(code);
                  // Oblicz procent rabatu
                  const percentage = (result.discount / baseTotalPrice) * 100;
                  setAppliedDiscount(percentage);
                  setDiscountMessage(result.message || `Kod ${code} zastosowany!`);
                } else {
                  setDiscountMessage(result.message || 'Nieprawidłowy kod');
                }
              }}
            />
            {items.map((item) => {
              const categoryInfo = EBOOK_CATEGORIES[item.ebook.category];
              return (
                <div
                  key={item.ebook.id}
                  className={`p-6 rounded-lg shadow-md ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.ebook.coverImage}
                        alt={item.ebook.title}
                        className="w-32 h-48 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Ebook';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`${fontSizes.subtitle} font-bold mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.ebook.title}
                          </h3>
                          <p className={`${fontSizes.text} mb-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {item.ebook.author}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            {(() => {
                              const IconComponent = getCategoryIcon(item.ebook.category);
                              return IconComponent ? (
                                <IconComponent 
                                  className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                                  size={16} 
                                />
                              ) : null;
                            })()}
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {categoryInfo.name}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.ebook.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            darkMode
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                              : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                          }`}
                          title="Usuń z koszyka"
                        >
                          <TrashIcon size={18} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className={`${fontSizes.text} font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Ilość:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.ebook.id, item.quantity - 1)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                darkMode
                                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              <MinusIcon size={12} />
                            </button>
                            <span className={`${fontSizes.text} font-semibold w-8 text-center ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.ebook.id, item.quantity + 1)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                darkMode
                                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              <PlusIcon size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`${fontSizes.subtitle} font-bold ${
                            darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                          }`}>
                            {formatPrice(item.ebook.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {formatPrice(item.ebook.price)} za szt.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'text-red-400 hover:text-red-300 hover:bg-gray-800'
                    : 'text-red-600 hover:text-red-700 hover:bg-gray-100'
                } ${fontSizes.text}`}
              >
                <TrashIcon className="inline mr-2" size={18} />
                Wyczyść koszyk
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`sticky top-4 p-6 rounded-lg shadow-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`${fontSizes.subtitle} font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Podsumowanie zamówienia
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Produkty ({items.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  <span className={`${fontSizes.text} font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatPrice(baseTotalPrice)}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className={`${fontSizes.text} ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Rabat ({discountCode}): -{appliedDiscount}%
                    </span>
                    <span className={`${fontSizes.text} font-semibold ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      -{formatPrice(baseTotalPrice - discountedPrice)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={`${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Dostawa
                  </span>
                  <span className={`${fontSizes.text} font-semibold ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Darmowa
                  </span>
                </div>
                {/* Purchase Progress Bar */}
              {totalPrice > 0 && totalPrice < 50 && (
                <div className="mb-6">
                  <PurchaseProgressBar
                    darkMode={darkMode}
                    targetAmount={50}
                    rewardType="scratch_card"
                    rewardDescription="Kartę do zdrapywania"
                  />
                </div>
              )}

              <div className="border-t border-gray-300 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className={`${fontSizes.subtitle} font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Razem
                    </span>
                    <span className={`${fontSizes.subtitle} font-bold ${
                      darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                    }`}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                } ${fontSizes.button}`}
              >
                Przejdź do płatności
                <ArrowRightIcon size={18} />
              </button>

              <p className={`text-xs text-center mt-4 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Bezpieczna płatność • Natychmiastowy dostęp do produktów cyfrowych
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

