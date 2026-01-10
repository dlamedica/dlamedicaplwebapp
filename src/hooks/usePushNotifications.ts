import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

interface PushSubscriptionState {
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

// Helper do konwersji VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [pushState, setPushState] = useState<PushSubscriptionState>({
    isSubscribed: false,
    subscription: null
  });
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);

  // Inicjalizacja
  useEffect(() => {
    const init = async () => {
      // Sprawdz wsparcie dla notifications
      if ('Notification' in window) {
        setIsSupported(true);
        setPermission(Notification.permission);
      }

      // Sprawdz wsparcie dla service workers i push
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          // Pobierz VAPID key
          const response = await fetch(`${API_URL}/push/vapid-public-key`);
          const data = await response.json();
          if (data.configured && data.publicKey) {
            setVapidPublicKey(data.publicKey);
          }

          // Rejestruj service worker
          const registration = await navigator.serviceWorker.register('/sw.js');
          setSwRegistration(registration);

          // Sprawdz czy juz subskrybowany
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            setPushState({ isSubscribed: true, subscription });
          }
        } catch (error) {
          console.warn('Push setup error:', error);
        }
      }
    };

    init();
  }, []);

  // Prośba o uprawnienia do powiadomień
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Powiadomienia nie są obsługiwane');
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
      console.error('Błąd:', error);
      return false;
    }
  }, [isSupported, permission]);

  // Subskrybuj do Web Push (server-side)
  const subscribeToPush = useCallback(async (topics: string[] = ['general']): Promise<boolean> => {
    if (!swRegistration || !vapidPublicKey) {
      console.warn('Push nie jest skonfigurowany');
      return false;
    }

    const granted = await requestPermission();
    if (!granted) return false;

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Wyślij subskrypcję na serwer
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          topics
        })
      });

      if (response.ok) {
        setPushState({ isSubscribed: true, subscription });
        console.log('Push subscription successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push subscription error:', error);
      return false;
    }
  }, [swRegistration, vapidPublicKey, requestPermission]);

  // Anuluj subskrypcję
  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    if (!pushState.subscription) return true;

    try {
      await pushState.subscription.unsubscribe();

      // Powiadom serwer
      await fetch(`${API_URL}/push/unsubscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: pushState.subscription.endpoint })
      });

      setPushState({ isSubscribed: false, subscription: null });
      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return false;
    }
  }, [pushState.subscription]);

  // Wyświetl powiadomienie lokalne (gdy strona otwarta)
  const showNotification = useCallback(
    async (options: NotificationOptions) => {
      if (!isSupported) return null;

      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      const notificationOptions = {
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

        if (!notificationOptions.requireInteraction) {
          setTimeout(() => notification.close(), 5000);
        }

        return notification;
      } catch (error) {
        console.error('Notification error:', error);
        return null;
      }
    },
    [isSupported, permission, requestPermission]
  );

  // Convenience methods
  const showSaleNotification = useCallback(
    async (productTitle: string, discount: number, productId: string) => {
      return showNotification({
        title: 'Promocja!',
        body: `${productTitle} - ${discount}% taniej!`,
        tag: `sale-${productId}`,
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
      });
    },
    [showNotification]
  );

  return {
    // Basic notification support
    isSupported,
    permission,
    requestPermission,
    showNotification,

    // Web Push (server-side)
    isPushSupported: !!swRegistration && !!vapidPublicKey,
    isSubscribed: pushState.isSubscribed,
    subscribeToPush,
    unsubscribeFromPush,

    // Convenience methods
    showSaleNotification,
    showCartReminder,
    showOrderConfirmation,
    showWishlistUpdate,
  };
};
