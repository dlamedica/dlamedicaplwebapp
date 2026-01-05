import { useState, useEffect, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Powiadomienia nie są obsługiwane w tej przeglądarce');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    if (permission === 'denied') {
      console.warn('Użytkownik zablokował powiadomienia');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Błąd podczas żądania uprawnień do powiadomień:', error);
      return false;
    }
  }, [isSupported, permission]);

  const showNotification = useCallback(
    async (options: NotificationOptions) => {
      if (!isSupported) {
        console.warn('Powiadomienia nie są obsługiwane');
        return null;
      }

      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          return null;
        }
      }

      const notificationOptions: NotificationOptions = {
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'default',
        requireInteraction: options.requireInteraction || false,
        ...options,
      };

      try {
        const notification = new Notification(options.title, notificationOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Automatyczne zamknięcie po 5 sekundach (chyba że requireInteraction = true)
        if (!notificationOptions.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }

        return notification;
      } catch (error) {
        console.error('Błąd podczas wyświetlania powiadomienia:', error);
        return null;
      }
    },
    [isSupported, permission, requestPermission]
  );

  const showSaleNotification = useCallback(
    async (productTitle: string, discount: number, productId: string) => {
      return showNotification({
        title: '🔥 Promocja!',
        body: `${productTitle} - ${discount}% taniej!`,
        tag: `sale-${productId}`,
        icon: '/favicon.ico',
        requireInteraction: false,
        actions: [
          {
            action: 'view',
            title: 'Zobacz produkt',
          },
        ],
      });
    },
    [showNotification]
  );

  const showCartReminder = useCallback(
    async (itemCount: number) => {
      return showNotification({
        title: 'Koszyk czeka na Ciebie',
        body: `Masz ${itemCount} ${itemCount === 1 ? 'produkt' : 'produktów'} w koszyku`,
        tag: 'cart-reminder',
        requireInteraction: false,
      });
    },
    [showNotification]
  );

  const showOrderConfirmation = useCallback(
    async (orderId: string, total: number) => {
      return showNotification({
        title: 'Zamówienie złożone!',
        body: `Dziękujemy za zakup. Wartość: ${total.toFixed(2)} zł`,
        tag: `order-${orderId}`,
        requireInteraction: true,
      });
    },
    [showNotification]
  );

  const showWishlistUpdate = useCallback(
    async (productTitle: string, isAdded: boolean) => {
      return showNotification({
        title: isAdded ? 'Dodano do listy życzeń' : 'Usunięto z listy życzeń',
        body: productTitle,
        tag: 'wishlist-update',
        requireInteraction: false,
      });
    },
    [showNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showSaleNotification,
    showCartReminder,
    showOrderConfirmation,
    showWishlistUpdate,
  };
};

