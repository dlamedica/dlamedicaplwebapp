/**
 * Narzędzia do analityki
 * Senior specialist implementation
 */

import { log } from './logger';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
}

/**
 * Wysyła event do Google Analytics (symulacja)
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  // W rzeczywistej aplikacji użyj Google Analytics 4
  // gtag('event', event.action, {
  //   event_category: event.category,
  //   event_label: event.label,
  //   value: event.value,
  // });

  const enrichedEvent: AnalyticsEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  log.info('Analytics Event', enrichedEvent);

  // Store in sessionStorage for debugging
  if (typeof window !== 'undefined') {
    try {
      const events = JSON.parse(sessionStorage.getItem('analytics_events') || '[]');
      events.push(enrichedEvent);
      // Keep only last 100 events
      const recentEvents = events.slice(-100);
      sessionStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    } catch {
      // Ignore storage errors
    }
  }
};

/**
 * Śledzi wyświetlenie strony
 */
export const trackPageView = (path: string, title?: string): void => {
  // W rzeczywistej aplikacji użyj Google Analytics 4
  // gtag('config', 'GA_MEASUREMENT_ID', {
  //   page_path: path,
  //   page_title: title,
  // });

  log.info('Page View', { path, title });

  trackEvent({
    action: 'page_view',
    category: 'Navigation',
    label: path,
  });
};

/**
 * Śledzi kliknięcie w produkt
 */
export const trackProductClick = (productId: string, productName: string) => {
  trackEvent({
    action: 'click',
    category: 'Product',
    label: productName,
  });
};

/**
 * Śledzi dodanie produktu do koszyka
 */
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent({
    action: 'add_to_cart',
    category: 'Ecommerce',
    label: productName,
    value: price,
  });
};

/**
 * Śledzi rozpoczęcie checkoutu
 */
export const trackBeginCheckout = (value: number, items: number) => {
  trackEvent({
    action: 'begin_checkout',
    category: 'Ecommerce',
    label: `${items} items`,
    value: value,
  });
};

/**
 * Śledzi zakup
 */
export const trackPurchase = (transactionId: string, value: number, items: number) => {
  trackEvent({
    action: 'purchase',
    category: 'Ecommerce',
    label: transactionId,
    value: value,
  });
};

/**
 * Śledzi wyszukiwanie
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
  });
};

