/**
 * API dla ofert pracy
 * Zastępuje stary moduł local DB
 */

export { JobOffer, JobOfferInput, getJobOfferBySlug, getJobOffers } from '../types/job-offers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('access_token');

/**
 * Generuje slug dla oferty pracy
 */
export function generateSlug(position: string, location: string): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  return `${normalize(position)}-${normalize(location)}`;
}

/**
 * Aktualizuj ofertę pracy
 */
export async function updateJobOffer(
  id: string,
  updates: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/job-offers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result.data };
    }

    return { success: false, error: result.error || 'Nie udało się zaktualizować oferty' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Usuń ofertę pracy
 */
export async function deleteJobOffer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/job-offers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true };
    }

    return { success: false, error: result.error || 'Nie udało się usunąć oferty' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Utwórz nową ofertę pracy
 */
export async function createJobOffer(
  data: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/job-offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result.data };
    }

    return { success: false, error: result.error || 'Nie udało się utworzyć oferty' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

