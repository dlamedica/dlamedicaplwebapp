import { useEffect, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { usePushNotifications } from './usePushNotifications';
import { useAuth } from '../contexts/AuthContext';
import { EmailService } from '../services/emailService';

const CART_REMINDER_KEY = 'cart_reminder_shown';
const CART_REMINDER_DELAY = 5 * 60 * 1000; // 5 minut

export const useCartReminder = () => {
  const { getTotalItems, getTotalPrice, items } = useCart();
  const { showCartReminder, permission } = usePushNotifications();
  const { user } = useAuth();

  const checkCartReminder = useCallback(() => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    if (totalItems === 0) {
      // Wyczyść flagę jeśli koszyk jest pusty
      localStorage.removeItem(CART_REMINDER_KEY);
      return;
    }

    // Sprawdź czy już pokazaliśmy przypomnienie
    const reminderShown = localStorage.getItem(CART_REMINDER_KEY);
    if (reminderShown) {
      const shownTime = parseInt(reminderShown, 10);
      const timeSinceShown = Date.now() - shownTime;
      
      // Pokaż ponownie tylko jeśli minęło więcej niż 30 minut
      if (timeSinceShown < 30 * 60 * 1000) {
        return;
      }
    }

    // Sprawdź kiedy ostatnio dodano coś do koszyka
    const lastCartUpdate = localStorage.getItem('cart_last_update');
    if (lastCartUpdate) {
      const timeSinceUpdate = Date.now() - parseInt(lastCartUpdate, 10);
      
      // Pokaż przypomnienie jeśli minęło więcej niż 5 minut
      if (timeSinceUpdate >= CART_REMINDER_DELAY) {
        if (permission === 'granted') {
          showCartReminder(totalItems);
          localStorage.setItem(CART_REMINDER_KEY, Date.now().toString());
        }
        
        // Wysyłaj email z przypomnieniem (tylko raz dziennie)
        if (user?.email) {
          const lastEmailReminder = localStorage.getItem('cart_email_reminder');
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          
          if (!lastEmailReminder || parseInt(lastEmailReminder, 10) < oneDayAgo) {
            const cartItems = items.map(item => ({
              title: item.ebook.title,
              price: item.ebook.price,
            }));
            
            EmailService.sendCartReminder(
              user.email,
              cartItems,
              totalPrice
            ).catch(err => console.error('Błąd wysyłania email:', err));
            
            localStorage.setItem('cart_email_reminder', Date.now().toString());
          }
        }
      }
    }
  }, [getTotalItems, getTotalPrice, showCartReminder, permission]);

  useEffect(() => {
    // Sprawdź przypomnienie co minutę
    const interval = setInterval(checkCartReminder, 60 * 1000);
    
    // Sprawdź również po załadowaniu strony
    checkCartReminder();

    return () => clearInterval(interval);
  }, [checkCartReminder]);
};

