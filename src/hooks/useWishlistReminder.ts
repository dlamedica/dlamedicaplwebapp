import { useEffect, useCallback } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { usePushNotifications } from './usePushNotifications';
import { useAuth } from '../contexts/AuthContext';
import { mockEbooks } from '../data/mockEbooks';
import { EmailService } from '../services/emailService';

const WISHLIST_REMINDER_KEY = 'wishlist_reminder_shown';
const WISHLIST_REMINDER_DELAY = 7 * 24 * 60 * 60 * 1000; // 7 dni

export const useWishlistReminder = () => {
  const { items } = useWishlist();
  const { showNotification, permission } = usePushNotifications();
  const { user } = useAuth();

  const checkWishlistReminder = useCallback(() => {
    if (items.length === 0) {
      localStorage.removeItem(WISHLIST_REMINDER_KEY);
      return;
    }

    // Sprawdź czy już pokazaliśmy przypomnienie
    const reminderShown = localStorage.getItem(WISHLIST_REMINDER_KEY);
    if (reminderShown) {
      const shownTime = parseInt(reminderShown, 10);
      const timeSinceShown = Date.now() - shownTime;
      
      // Pokaż ponownie tylko jeśli minęło więcej niż 7 dni
      if (timeSinceShown < WISHLIST_REMINDER_DELAY) {
        return;
      }
    }

    // Sprawdź czy są produkty w promocji
    const itemsOnSale = items.filter(item => {
      const currentEbook = mockEbooks.find(e => e.id === item.id);
      return currentEbook?.isOnSale || (currentEbook?.originalPrice && currentEbook.originalPrice > currentEbook.price);
    });

    if (itemsOnSale.length > 0 && permission === 'granted') {
      const product = itemsOnSale[0];
      const discount = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 20;

      showNotification({
        title: '🔥 Promocja na liście życzeń!',
        body: `${product.title} jest teraz ${discount}% taniej!`,
        tag: `wishlist-sale-${product.id}`,
        requireInteraction: false,
      });

      // Wysyłaj email z promocjami (tylko raz dziennie)
      if (user?.email) {
        const lastEmailReminder = localStorage.getItem('wishlist_email_reminder');
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        if (!lastEmailReminder || parseInt(lastEmailReminder, 10) < oneDayAgo) {
          const saleProducts = itemsOnSale.map(item => ({
            title: item.title,
            oldPrice: item.originalPrice || item.price,
            newPrice: item.price,
            discount: item.originalPrice && item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 20,
          }));
          
          EmailService.sendWishlistSaleNotification(
            user.email,
            saleProducts
          ).catch(err => console.error('Błąd wysyłania email:', err));
          
          localStorage.setItem('wishlist_email_reminder', Date.now().toString());
        }
      }

      localStorage.setItem(WISHLIST_REMINDER_KEY, Date.now().toString());
    }
  }, [items, showNotification, permission]);

  useEffect(() => {
    // Sprawdź przypomnienie co godzinę
    const interval = setInterval(checkWishlistReminder, 60 * 60 * 1000);
    
    // Sprawdź również po załadowaniu strony
    checkWishlistReminder();

    return () => clearInterval(interval);
  }, [checkWishlistReminder]);
};

