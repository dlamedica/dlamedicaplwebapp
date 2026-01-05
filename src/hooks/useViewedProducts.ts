import { useState, useEffect } from 'react';
import { Ebook } from '../types/ebook';

const VIEWED_PRODUCTS_KEY = 'viewed_products';
const MAX_VIEWED_PRODUCTS = 20;

export const useViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState<Ebook[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (stored) {
      try {
        setViewedProducts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading viewed products:', error);
      }
    }
  }, []);

  const addViewedProduct = (ebook: Ebook) => {
    setViewedProducts((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== ebook.id);
      // Add to beginning
      const updated = [ebook, ...filtered].slice(0, MAX_VIEWED_PRODUCTS);
      // Save to localStorage
      localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearViewedProducts = () => {
    setViewedProducts([]);
    localStorage.removeItem(VIEWED_PRODUCTS_KEY);
  };

  return {
    viewedProducts,
    addViewedProduct,
    clearViewedProducts,
  };
};

