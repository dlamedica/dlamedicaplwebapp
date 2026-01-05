import { Ebook } from '../types/ebook';
import { mockEbooks } from '../data/mockEbooks';

interface UserPreferences {
  viewedProducts: string[];
  purchasedProducts: string[];
  wishlistProducts: string[];
  searchHistory: string[];
  preferredCategories: string[];
}

/**
 * Serwis do personalizacji rekomendacji produktów
 */
export class PersonalizationService {
  /**
   * Pobiera preferencje użytkownika z localStorage
   */
  static getUserPreferences(): UserPreferences {
    return {
      viewedProducts: JSON.parse(localStorage.getItem('viewed_products') || '[]'),
      purchasedProducts: JSON.parse(localStorage.getItem('purchased_products') || '[]'),
      wishlistProducts: JSON.parse(localStorage.getItem('dlamedica_wishlist') || '[]').map((e: Ebook) => e.id),
      searchHistory: JSON.parse(localStorage.getItem('search_history') || '[]'),
      preferredCategories: JSON.parse(localStorage.getItem('preferred_categories') || '[]'),
    };
  }

  /**
   * Generuje personalizowane rekomendacje na podstawie historii użytkownika
   */
  static getPersonalizedRecommendations(limit: number = 8): Ebook[] {
    const preferences = this.getUserPreferences();
    const scoredProducts = mockEbooks.map(ebook => ({
      ebook,
      score: this.calculateProductScore(ebook, preferences),
    }));

    // Sortuj według wyniku i zwróć top produkty
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.ebook);
  }

  /**
   * Oblicza wynik produktu na podstawie preferencji użytkownika
   */
  private static calculateProductScore(ebook: Ebook, preferences: UserPreferences): number {
    let score = 0;

    // Bonus za produkty w tej samej kategorii co przeglądane
    if (preferences.viewedProducts.length > 0) {
      const viewedCategories = preferences.viewedProducts
        .map(id => mockEbooks.find(e => e.id === id)?.category)
        .filter(Boolean);
      
      if (viewedCategories.includes(ebook.category)) {
        score += 10;
      }
    }

    // Bonus za produkty w preferowanych kategoriach
    if (preferences.preferredCategories.includes(ebook.category)) {
      score += 15;
    }

    // Bonus za produkty z podobnymi tagami
    const viewedTags = preferences.viewedProducts
      .flatMap(id => {
        const viewedEbook = mockEbooks.find(e => e.id === id);
        return viewedEbook?.tags || [];
      });
    
    const commonTags = ebook.tags.filter(tag => viewedTags.includes(tag));
    score += commonTags.length * 5;

    // Bonus za produkty w wishlist (ale nie kupione)
    if (preferences.wishlistProducts.includes(ebook.id)) {
      score += 20;
    }

    // Bonus za bestsellery i nowości
    if (ebook.isBestseller) {
      score += 8;
    }
    if (ebook.isNew) {
      score += 5;
    }

    // Bonus za wysokie oceny
    if (ebook.rating && ebook.rating >= 4.5) {
      score += 10;
    }

    // Bonus za promocje
    if (ebook.isOnSale) {
      score += 7;
    }

    // Kary za już kupione produkty
    if (preferences.purchasedProducts.includes(ebook.id)) {
      score -= 50;
    }

    // Kary za już przeglądane (ale mniejsze)
    if (preferences.viewedProducts.includes(ebook.id)) {
      score -= 5;
    }

    return Math.max(0, score);
  }

  /**
   * Aktualizuje preferencje użytkownika na podstawie akcji
   */
  static updatePreferences(action: 'view' | 'purchase' | 'wishlist' | 'search', data: string | string[]) {
    const preferences = this.getUserPreferences();

    switch (action) {
      case 'view':
        if (typeof data === 'string') {
          preferences.viewedProducts = [
            data,
            ...preferences.viewedProducts.filter(id => id !== data),
          ].slice(0, 50); // Zachowaj ostatnie 50
        }
        break;
      case 'purchase':
        if (typeof data === 'string') {
          if (!preferences.purchasedProducts.includes(data)) {
            preferences.purchasedProducts.push(data);
          }
        }
        break;
      case 'wishlist':
        if (typeof data === 'string') {
          if (!preferences.wishlistProducts.includes(data)) {
            preferences.wishlistProducts.push(data);
          }
        }
        break;
      case 'search':
        if (Array.isArray(data)) {
          preferences.searchHistory = [
            ...data,
            ...preferences.searchHistory.filter(term => !data.includes(term)),
          ].slice(0, 20); // Zachowaj ostatnie 20 wyszukiwań
        }
        break;
    }

    // Aktualizuj preferowane kategorie
    const categoryCounts: Record<string, number> = {};
    [...preferences.viewedProducts, ...preferences.purchasedProducts].forEach(id => {
      const ebook = mockEbooks.find(e => e.id === id);
      if (ebook) {
        categoryCounts[ebook.category] = (categoryCounts[ebook.category] || 0) + 1;
      }
    });

    preferences.preferredCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    // Zapisz do localStorage
    localStorage.setItem('viewed_products', JSON.stringify(preferences.viewedProducts));
    localStorage.setItem('purchased_products', JSON.stringify(preferences.purchasedProducts));
    localStorage.setItem('preferred_categories', JSON.stringify(preferences.preferredCategories));
    localStorage.setItem('search_history', JSON.stringify(preferences.searchHistory));
  }
}

