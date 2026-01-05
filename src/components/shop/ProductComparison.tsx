import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';
import { EBOOK_CATEGORIES } from '../../types/ebook';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/useToast';
import LazyImage from './LazyImage';

interface ProductComparisonProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Global comparison state (shared across components)
let globalComparisonList: string[] = [];
const comparisonListeners: Set<(list: string[]) => void> = new Set();

export const addToComparisonGlobal = (ebookId: string): boolean => {
  if (globalComparisonList.length >= 3) return false;
  if (!globalComparisonList.includes(ebookId)) {
    globalComparisonList = [...globalComparisonList, ebookId];
    localStorage.setItem('product_comparison', JSON.stringify(globalComparisonList));
    comparisonListeners.forEach(listener => listener([...globalComparisonList]));
    return true;
  }
  return false;
};

export const removeFromComparisonGlobal = (ebookId: string): void => {
  globalComparisonList = globalComparisonList.filter(id => id !== ebookId);
  if (globalComparisonList.length > 0) {
    localStorage.setItem('product_comparison', JSON.stringify(globalComparisonList));
  } else {
    localStorage.removeItem('product_comparison');
  }
  comparisonListeners.forEach(listener => listener([...globalComparisonList]));
};

const ProductComparison: React.FC<ProductComparisonProps> = ({ darkMode, fontSize }) => {
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();
  const { showSuccess } = useToast();

  const fontSizes = {
    small: { title: 'text-xl', text: 'text-sm', button: 'text-sm' },
    medium: { title: 'text-2xl', text: 'text-base', button: 'text-base' },
    large: { title: 'text-3xl', text: 'text-lg', button: 'text-lg' },
  }[fontSize];

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('product_comparison');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        globalComparisonList = parsed;
        setComparisonList(parsed);
      } catch (error) {
        console.error('Error loading comparison list:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (comparisonList.length > 0) {
      localStorage.setItem('product_comparison', JSON.stringify(comparisonList));
      globalComparisonList = comparisonList;
    } else {
      localStorage.removeItem('product_comparison');
      globalComparisonList = [];
    }
  }, [comparisonList]);

  const removeFromComparison = (ebookId: string) => {
    removeFromComparisonGlobal(ebookId);
  };

  const clearComparison = () => {
    globalComparisonList = [];
    setComparisonList([]);
    comparisonListeners.forEach(listener => listener([]));
  };

  const comparedProducts = comparisonList
    .map((id) => mockEbooks.find((e) => e.id === id))
    .filter((e): e is Ebook => e !== undefined);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  if (comparedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-2xl border-2 border-[#38b6ff] p-4 max-w-4xl w-full max-h-[80vh] overflow-y-auto`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${fontSizes.title} font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Porównanie produktów ({comparedProducts.length}/3)
        </h3>
        <div className="flex gap-2">
          {comparedProducts.length > 0 && (
            <button
              onClick={clearComparison}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Wyczyść
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left py-2 px-3 ${fontSizes.text} font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Cecha
              </th>
              {comparedProducts.map((ebook) => (
                <th key={ebook.id} className={`text-center py-2 px-3 ${fontSizes.text} font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => removeFromComparison(ebook.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        darkMode
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                          : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <CloseIcon size={14} />
                    </button>
                    <img
                      src={ebook.coverImage}
                      alt={ebook.title}
                      className="w-16 h-24 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x96?text=Ebook';
                      }}
                    />
                    <span className="text-xs max-w-[120px] line-clamp-2">
                      {ebook.title}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cena
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} font-bold ${
                  darkMode ? 'text-[#38b6ff]' : 'text-[#38b6ff]'
                }`}>
                  {formatPrice(ebook.price)}
                </td>
              ))}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Autor
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ebook.author}
                </td>
              ))}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Kategoria
              </td>
              {comparedProducts.map((ebook) => {
                const categoryInfo = EBOOK_CATEGORIES[ebook.category];
                return (
                  <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {categoryInfo.name}
                  </td>
                );
              })}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Format
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ebook.format}
                </td>
              ))}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Liczba stron
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ebook.pages}
                </td>
              ))}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Rozmiar pliku
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ebook.fileSize}
                </td>
              ))}
            </tr>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ocena
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className={`py-2 px-3 text-center ${fontSizes.text} ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {ebook.rating ? ebook.rating.toFixed(1) : 'Brak'}
                </td>
              ))}
            </tr>
            <tr>
              <td className={`py-2 px-3 ${fontSizes.text} font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Akcje
              </td>
              {comparedProducts.map((ebook) => (
                <td key={ebook.id} className="py-2 px-3 text-center">
                  <button
                    onClick={() => {
                      addToCart(ebook);
                      showSuccess(`${ebook.title} dodany do koszyka`);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      darkMode
                        ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                        : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                    } ${fontSizes.button}`}
                  >
                    Do koszyka
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Full Comparison Modal Button */}
      {comparedProducts.length >= 2 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            }`}
          >
            Pełne porównanie
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {showModal && (
        <ProductComparisonModal
          products={comparisonList}
          darkMode={darkMode}
          onClose={() => setShowModal(false)}
          onRemove={removeFromComparison}
        />
      )}
    </div>
  );
};

export default ProductComparison;

