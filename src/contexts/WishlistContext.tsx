import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Ebook } from '../types/ebook';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface WishlistContextType {
  items: Ebook[];
  addToWishlist: (ebook: Ebook) => void;
  removeFromWishlist: (ebookId: string) => void;
  isInWishlist: (ebookId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'dlamedica_wishlist';

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pushNotifications = usePushNotifications();
  const showWishlistUpdate = pushNotifications?.showWishlistUpdate;
  const [items, setItems] = useState<Ebook[]>(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        return JSON.parse(savedWishlist);
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania wishlist z localStorage:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Błąd podczas zapisywania wishlist do localStorage:', error);
    }
  }, [items]);

  const addToWishlist = useCallback((ebook: Ebook) => {
    setItems((prevItems) => {
      if (prevItems.some((item) => item.id === ebook.id)) {
        return prevItems; // Już jest w wishlist
      }
      if (showWishlistUpdate) {
        showWishlistUpdate(ebook.title, true);
      }
      return [...prevItems, ebook];
    });
  }, [showWishlistUpdate]);

  const removeFromWishlist = useCallback((ebookId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === ebookId);
      if (item && showWishlistUpdate) {
        showWishlistUpdate(item.title, false);
      }
      return prevItems.filter((item) => item.id !== ebookId);
    });
  }, [showWishlistUpdate]);

  const isInWishlist = useCallback((ebookId: string) => {
    return items.some((item) => item.id === ebookId);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  }, []);

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

