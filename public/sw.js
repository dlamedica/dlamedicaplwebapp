/**
 * DlaMedica Service Worker
 * Web Push Notifications handler
 */

const CACHE_NAME = 'dlamedica-v1';

// Instalacja service workera
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

// Aktywacja
self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated');
  event.waitUntil(clients.claim());
});

// Obsługa push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'DlaMedica',
    body: 'Masz nowe powiadomienie',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    url: '/'
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.error('[SW] Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: data.timestamp || Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Zobacz'
      },
      {
        action: 'close',
        title: 'Zamknij'
      }
    ],
    requireInteraction: false,
    tag: data.tag || 'dlamedica-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Klik w powiadomienie
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Znajdz otwarta zakladke
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Otworz nowa zakladke
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Zamkniecie powiadomienia
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed');
});

// Opcjonalnie: cache dla offline (basic)
self.addEventListener('fetch', (event) => {
  // Pass through - nie blokuj requestow
  // W przyszlosci mozna dodac strategia cache
});
