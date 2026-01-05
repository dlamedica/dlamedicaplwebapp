/**
 * API dla ulubionych ofert pracy
 * Zastępuje stary moduł local DB
 */

import { JobOffer } from '../types/job-offers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('access_token');

export interface FavoriteWithJobOffer {
  id: string;
  userId: string;
  jobOfferId: string;
  createdAt: string;
  jobOffer?: JobOffer;
}

/**
 * Sprawdź czy oferta jest w ulubionych
 */
export async function isFavorite(jobOfferId: string): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/favorites/check/${jobOfferId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result.isFavorite === true;
  } catch {
    return false;
  }
}

/**
 * Dodaj do ulubionych
 */
export async function addToFavorites(jobOfferId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobOfferId }),
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Nie udało się dodać do ulubionych' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Usuń z ulubionych
 */
export async function removeFromFavorites(jobOfferId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/favorites/${jobOfferId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Nie udało się usunąć z ulubionych' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Pobierz ulubione użytkownika
 */
export async function getUserFavorites(): Promise<FavoriteWithJobOffer[]> {
  try {
    const token = getToken();
    if (!token) return [];

    const response = await fetch(`${API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (response.ok && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch {
    return [];
  }
}

