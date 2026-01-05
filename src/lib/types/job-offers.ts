/**
 * Typy dla ofert pracy - zastępuje stare typy local DB
 */

export interface JobOffer {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  salaryType?: string;
  contractType: string;
  category: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  facilityType?: string;
  postedDate: string;
  expiryDate?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  slug?: string;
  employerId?: string;
  contactEmail?: string;
  contactPhone?: string;
  companyLogo?: string;
  applicationUrl?: string;
  zamowMedyczny?: boolean;
  views?: number;
  applicationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobOfferInput {
  company: string;
  position: string;
  location: string;
  salary?: string;
  salaryType?: string;
  contractType: string;
  category: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  facilityType?: string;
  expiryDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  companyLogo?: string;
  applicationUrl?: string;
  zamowMedyczny?: boolean;
}

export interface JobOfferFilters {
  category?: string;
  location?: string;
  contractType?: string;
  salaryType?: string;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Funkcja do pobierania ofert pracy przez API
 */
export async function getJobOfferBySlug(slug: string): Promise<{ data: JobOffer | null; error: { message: string } | null }> {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_URL}/job-offers/${slug}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      return { data: result.data, error: null };
    }
    
    return { data: null, error: { message: result.error || 'Nie znaleziono oferty' } };
  } catch (error) {
    return { data: null, error: { message: 'Wystąpił błąd podczas pobierania oferty' } };
  }
}

/**
 * Funkcja do pobierania wszystkich ofert pracy
 */
export async function getJobOffers(filters?: JobOfferFilters & { page?: number; limit?: number }): Promise<{ data: JobOffer[]; pagination: PaginationInfo | null; error: { message: string } | null }> {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`${API_URL}/job-offers?${params.toString()}`);
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data || [], pagination: result.pagination || null, error: null };
    }
    
    return { data: [], pagination: null, error: { message: result.error || 'Wystąpił błąd' } };
  } catch (error) {
    return { data: [], pagination: null, error: { message: 'Wystąpił błąd podczas pobierania ofert' } };
  }
}

