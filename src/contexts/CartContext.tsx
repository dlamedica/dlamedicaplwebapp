import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Ebook } from '../types/ebook';
import { trackAddToCart } from '../utils/analytics';

export interface CartItem {
  ebook: Ebook;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (ebook: Ebook, quantity?: number) => void;
  removeFromCart: (ebookId: string) => void;
  updateQuantity: (ebookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (ebookId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dlamedica_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Wczytaj koszyk z localStorage przy inicjalizacji
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania koszyka z localStorage:', error);
    }
    return [];
  });

  // Zapisz koszyk do localStorage przy każdej zmianie
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      // Zapisz timestamp ostatniej aktualizacji koszyka (dla przypomnień)
      if (items.length > 0) {
        localStorage.setItem('cart_last_update', Date.now().toString());
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania koszyka do localStorage:', error);
    }
  }, [items]);

  const addToCart = useCallback((ebook: Ebook, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.ebook.id === ebook.id);
      
      if (existingItem) {
        // Jeśli produkt już jest w koszyku, zwiększ ilość
        return prevItems.map((item) =>
          item.ebook.id === ebook.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Track analytics tylko przy pierwszym dodaniu
        trackAddToCart(ebook.id, ebook.title, ebook.price);
        // Dodaj nowy produkt do koszyka
        return [...prevItems, { ebook, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((ebookId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.ebook.id !== ebookId));
  }, []);

  const updateQuantity = useCallback((ebookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(ebookId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.ebook.id === ebookId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.ebook.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((ebookId: string) => {
    return items.some((item) => item.ebook.id === ebookId);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

