/**
 * API dla aplikacji na oferty pracy
 * Zastępuje stary moduł local DB
 */

import { JobOffer } from '../types/job-offers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('access_token');

export interface ApplicationWithJobOffer {
  id: string;
  userId: string;
  jobOfferId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  updatedAt?: string;
  jobOffer?: JobOffer;
}

export interface ApplicationInput {
  jobOfferId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

/**
 * Pobierz aplikacje użytkownika
 */
export async function getUserApplications(): Promise<ApplicationWithJobOffer[]> {
  try {
    const token = getToken();
    if (!token) return [];

    const response = await fetch(`${API_URL}/applications`, {
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

/**
 * Złóż aplikację
 */
export async function submitApplication(input: ApplicationInput): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Nie udało się złożyć aplikacji' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Wycofaj aplikację
 */
export async function withdrawApplication(applicationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    const response = await fetch(`${API_URL}/applications/${applicationId}/withdraw`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Nie udało się wycofać aplikacji' };
  } catch {
    return { success: false, error: 'Wystąpił błąd' };
  }
}

/**
 * Sprawdź czy użytkownik już aplikował
 */
export async function hasApplied(jobOfferId: string): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/applications/check/${jobOfferId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result.hasApplied === true;
  } catch {
    return false;
  }
}

