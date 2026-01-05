/**
 * Komponent ExitIntentPopup - Popup przy próbie wyjścia
 * Oferuje specjalną ofertę, aby zatrzymać użytkownika
 */

import React, { useEffect, useState } from 'react';
import { FaTimes, FaGift, FaTag } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

interface ExitIntentPopupProps {
  darkMode?: boolean;
  onClose: () => void;
  onApplyDiscount: (code: string) => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  darkMode = false,
  onClose,
  onApplyDiscount,
}) => {
  const { items, getTotalPrice } = useCart();
  const [show, setShow] = useState(false);
  const [discountCode] = useState(`STAY${Math.random().toString(36).substring(2, 6).toUpperCase()}`);

  useEffect(() => {
    let mouseY = 0;

    const handleMouseLeave = (e: MouseEvent) => {
      // Jeśli mysz wychodzi przez górę okna
      if (e.clientY <= 0 && items.length > 0) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [items.length]);

  if (!show || items.length === 0) {
    return null;
  }

  const handleApplyCode = () => {
    onApplyDiscount(discountCode);
    setShow(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${darkMode ? 'bg-black/90' : 'bg-white/95'} backdrop-blur-sm`}>
      <div className={`relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 border-2 border-yellow-500' : 'bg-white border-2 border-yellow-500'
      }`}>
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaGift className="text-white text-4xl" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ⏰ Czekaj!
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nie wychodź jeszcze!
          </p>
        </div>

        <div className={`p-6 rounded-lg mb-6 ${
          darkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`text-center font-bold text-xl mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
            Otrzymujesz specjalną ofertę!
          </p>
          <p className={`text-center ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
            Zostań i wykorzystaj kod rabatowy <span className="font-bold">{discountCode}</span> na 15% zniżki!
          </p>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Wartość koszyka:
            </span>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {getTotalPrice().toFixed(2)} PLN
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Z rabatem 15%:
            </span>
            <span className={`font-bold text-green-500`}>
              {(getTotalPrice() * 0.85).toFixed(2)} PLN
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-400">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Oszczędzasz:
            </span>
            <span className={`font-bold text-green-500`}>
              {(getTotalPrice() * 0.15).toFixed(2)} PLN
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleApplyCode}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900'
            } shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
          >
            <FaTag />
            Zastosuj kod i zakończ zakup
          </button>
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Nie, dziękuję
          </button>
        </div>

        <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          ⚠️ Ta oferta jest ważna tylko teraz. Jeśli wyjdziesz, stracisz możliwość wykorzystania kodu.
        </p>
      </div>
    </div>
  );
};

export default ExitIntentPopup;

