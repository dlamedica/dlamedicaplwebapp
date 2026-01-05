/**
 * Komponent RecentlyViewed - Ostatnio oglądane produkty
 * Z timerem pokazującym, że inni też oglądają
 */

import React, { useState, useEffect } from 'react';
import { FaEye, FaClock } from 'react-icons/fa';
import { Ebook } from '../../types/ebook';

interface RecentlyViewedProps {
  products: Ebook[];
  darkMode?: boolean;
  onViewProduct: (productId: string) => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  products,
  darkMode = false,
  onViewProduct,
}) => {
  const [viewers, setViewers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Symulacja liczby osób oglądających produkt
    const interval = setInterval(() => {
      const newViewers: { [key: string]: number } = {};
      products.forEach((product) => {
        newViewers[product.id] = Math.floor(Math.random() * 15) + 1;
      });
      setViewers(newViewers);
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center gap-3 mb-4">
        <FaEye className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Ostatnio oglądane
        </h3>
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((product) => {
          const viewersCount = viewers[product.id] || Math.floor(Math.random() * 15) + 1;
          const viewedMinutesAgo = Math.floor(Math.random() * 60) + 1;

          return (
            <div
              key={product.id}
              onClick={() => onViewProduct(product.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-500 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs flex items-center gap-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <FaEye className="text-blue-500" />
                      {viewersCount} osób ogląda
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <FaClock />
                      {viewedMinutesAgo} min temu
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.price.toFixed(2)} PLN
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;

