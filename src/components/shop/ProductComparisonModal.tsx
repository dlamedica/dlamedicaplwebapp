import React from 'react';
import { CloseIcon, CheckIcon, ErrorIcon } from '../icons/CustomIcons';
import { Ebook } from '../../types/ebook';
import { mockEbooks } from '../../data/mockEbooks';
import LazyImage from './LazyImage';

interface ProductComparisonModalProps {
  products: string[];
  darkMode: boolean;
  onClose: () => void;
  onRemove: (productId: string) => void;
}

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  products,
  darkMode,
  onClose,
  onRemove,
}) => {
  const productData = products
    .map(id => mockEbooks.find(e => e.id === id))
    .filter((ebook): ebook is Ebook => ebook !== undefined);

  if (productData.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(price);
  };

  const features = [
    { label: 'Tytuł', key: 'title' },
    { label: 'Autor', key: 'author' },
    { label: 'Kategoria', key: 'category' },
    { label: 'Cena', key: 'price' },
    { label: 'Ocena', key: 'rating' },
    { label: 'Liczba opinii', key: 'reviewCount' },
    { label: 'Format', key: 'format' },
    { label: 'Liczba stron', key: 'pages' },
    { label: 'Data publikacji', key: 'publicationDate' },
    { label: 'Bestseller', key: 'isBestseller' },
    { label: 'Nowość', key: 'isNew' },
    { label: 'W promocji', key: 'isOnSale' },
  ];

  const getFeatureValue = (ebook: Ebook, key: string): string | number | boolean => {
    switch (key) {
      case 'title':
        return ebook.title;
      case 'author':
        return ebook.author;
      case 'category':
        return ebook.category;
      case 'price':
        return formatPrice(ebook.price);
      case 'rating':
        return ebook.rating ? ebook.rating.toFixed(1) : 'Brak';
      case 'reviewCount':
        return ebook.reviewCount || 0;
      case 'format':
        return ebook.format;
      case 'pages':
        return ebook.pages || 'N/A';
      case 'publicationDate':
        return new Date(ebook.publicationDate).toLocaleDateString('pl-PL');
      case 'isBestseller':
        return ebook.isBestseller;
      case 'isNew':
        return ebook.isNew;
      case 'isOnSale':
        return ebook.isOnSale;
      default:
        return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`max-w-7xl w-full max-h-[90vh] overflow-auto rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-4 border-b ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Porównanie produktów ({productData.length})
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'hover:bg-gray-700 text-white'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
            aria-label="Zamknij"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <th className={`text-left p-4 font-semibold ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cecha
                </th>
                {productData.map((ebook) => (
                  <th key={ebook.id} className={`text-center p-4 border-l ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="relative">
                      <button
                        onClick={() => onRemove(ebook.id)}
                        className={`absolute -top-2 -right-2 p-1 rounded-full ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                        aria-label={`Usuń ${ebook.title} z porównania`}
                      >
                        <ErrorIcon size={14} />
                      </button>
                      <LazyImage
                        src={ebook.coverImage}
                        alt={ebook.title}
                        className="w-24 h-32 object-cover rounded mx-auto mb-2"
                      />
                      <p className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {ebook.title}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.key}
                  className={`border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } ${index % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-750' : 'bg-gray-50')}`}
                >
                  <td className={`p-4 font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.label}
                  </td>
                  {productData.map((ebook) => (
                    <td
                      key={ebook.id}
                      className={`text-center p-4 border-l ${
                        darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {typeof getFeatureValue(ebook, feature.key) === 'boolean' ? (
                        getFeatureValue(ebook, feature.key) ? (
                          <CheckIcon size={18} color="#10B981" className="mx-auto" />
                        ) : (
                          <CloseIcon size={18} color="#EF4444" className="mx-auto" />
                        )
                      ) : (
                        <span>{String(getFeatureValue(ebook, feature.key))}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end gap-2 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonModal;

