import {
  getJobOffers,
  getJobOffersByCategory,
  getJobOffersByLocation,
  getJobOfferById,
  getJobOfferBySlug,
  createJobOffer,
  updateJobOffer,
  deleteJobOffer,
  generateSlug,
} from './mockJobService';
import { JobOffer, JobOfferInput } from '../types';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface JobOfferQuery {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  contractType?: string;
  salaryType?: string;
  search?: string;
  sortBy?: 'postedDate' | 'salary' | 'company' | 'position';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Job Offers API Service
 * Equivalent to Next.js API routes but for React/Vite app
 */
export class JobOffersApiService {
  /**
   * GET /api/job-offers
   * Get all job offers with optional filtering and pagination
   */
  static async getJobOffers(query: JobOfferQuery = {}): Promise<PaginatedResponse<JobOffer>> {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        location,
        contractType,
        salaryType,
        search,
        sortBy = 'postedDate',
        sortOrder = 'desc',
      } = query;

      // Get all job offers first
      const jobOffers = await getJobOffers();

      if (!jobOffers) {
        return {
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }

      // Apply filters
      let filteredOffers = jobOffers;

      if (category && category !== 'Wszystkie') {
        filteredOffers = filteredOffers.filter((offer) => offer.category === category);
      }

      if (location) {
        filteredOffers = filteredOffers.filter((offer) =>
          offer.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (contractType) {
        filteredOffers = filteredOffers.filter((offer) => offer.contractType === contractType);
      }

      if (salaryType) {
        filteredOffers = filteredOffers.filter((offer) => offer.salaryType === salaryType);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredOffers = filteredOffers.filter(
          (offer) =>
            offer.position.toLowerCase().includes(searchLower) ||
            offer.company.toLowerCase().includes(searchLower) ||
            offer.description.toLowerCase().includes(searchLower) ||
            offer.location.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filteredOffers.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'postedDate':
            aValue = new Date(a.postedDate).getTime();
            bValue = new Date(b.postedDate).getTime();
            break;
          case 'salary':
            // Extract numeric value from salary string
            aValue = extractSalaryNumber(a.salary) || 0;
            bValue = extractSalaryNumber(b.salary) || 0;
            break;
          case 'company':
            aValue = a.company.toLowerCase();
            bValue = b.company.toLowerCase();
            break;
          case 'position':
            aValue = a.position.toLowerCase();
            bValue = b.position.toLowerCase();
            break;
          default:
            aValue = a.postedDate;
            bValue = b.postedDate;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const total = filteredOffers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedOffers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * POST /api/job-offers
   * Create a new job offer
   */
  static async createJobOffer(jobOfferData: JobOfferInput): Promise<ApiResponse<JobOffer>> {
    try {
      const data = await createJobOffer(jobOfferData as any);

      return {
        success: true,
        data,
        message: 'Oferta pracy została utworzona pomyślnie',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET /api/job-offers/[id]
   * Get job offer by ID
   */
  static async getJobOfferById(id: string): Promise<ApiResponse<JobOffer>> {
    try {
      const data = await getJobOfferById(id);

      if (!data) {
        return {
          success: false,
          error: 'Oferta pracy nie została znaleziona',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET /api/job-offers/slug/[slug]
   * Get job offer by slug
   */
  static async getJobOfferBySlug(slug: string): Promise<ApiResponse<JobOffer>> {
    try {
      const data = await getJobOfferBySlug(slug);

      if (!data) {
        return {
          success: false,
          error: 'Oferta pracy nie została znaleziona',
        };
      }

      return {
        success: true,
        data,
      };

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * PUT /api/job-offers/[id]
   * Update job offer by ID
   */
  static async updateJobOffer(
    id: string,
    updates: Partial<JobOfferInput>
  ): Promise<ApiResponse<JobOffer>> {
    try {
      const data = await updateJobOffer(id, updates as any);

      if (!data) {
        return {
          success: false,
          error: 'Oferta pracy nie została znaleziona',
        };
      }

      return {
        success: true,
        data,
        message: 'Oferta pracy została zaktualizowana pomyślnie',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * DELETE /api/job-offers/[id]
   * Delete job offer by ID
   */
  static async deleteJobOffer(id: string): Promise<ApiResponse<null>> {
    try {
      await deleteJobOffer(id);

      return {
        success: true,
        data: null,
        message: 'Oferta pracy została usunięta pomyślnie',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET /api/job-offers/category/[category]
   * Get job offers by category
   */
  static async getJobOffersByCategory(category: string): Promise<ApiResponse<JobOffer[]>> {
    try {
      const data = await getJobOffersByCategory(category);

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET /api/job-offers/location/[location]
   * Get job offers by location
   */
  static async getJobOffersByLocation(location: string): Promise<ApiResponse<JobOffer[]>> {
    try {
      const data = await getJobOffersByLocation(location);

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET /api/job-offers/search
   * Search job offers with advanced filters
   */
  static async searchJobOffers(query: JobOfferQuery): Promise<PaginatedResponse<JobOffer>> {
    return this.getJobOffers(query);
  }

  /**
   * GET /api/job-offers/stats
   * Get job offers statistics
   */
  static async getJobOffersStats(): Promise<ApiResponse<any>> {
    try {
      const jobOffers = await getJobOffers();

      if (!jobOffers) {
        return {
          success: true,
          data: {
            total: 0,
            byCategory: {},
            byLocation: {},
            byContractType: {},
            recent: 0,
          },
        };
      }

      const stats = {
        total: jobOffers.length,
        byCategory: {} as Record<string, number>,
        byLocation: {} as Record<string, number>,
        byContractType: {} as Record<string, number>,
        recent: 0, // Last 7 days
      };

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      jobOffers.forEach((offer) => {
        // Count by category
        stats.byCategory[offer.category] = (stats.byCategory[offer.category] || 0) + 1;

        // Count by location
        stats.byLocation[offer.location] = (stats.byLocation[offer.location] || 0) + 1;

        // Count by contract type
        stats.byContractType[offer.contractType] =
          (stats.byContractType[offer.contractType] || 0) + 1;

        // Count recent offers
        if (new Date(offer.postedDate) >= sevenDaysAgo) {
          stats.recent += 1;
        }
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate slug for job offer
   */
  static generateSlug(position: string, location: string): string {
    return generateSlug(position, location);
  }
}

// Helper functions
function extractSalaryNumber(salary?: string): number | null {
  if (!salary || salary === 'Nie podano') return null;

  const match = salary.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}

// Export individual functions for direct use
export {
  getJobOffers,
  getJobOffersByCategory,
  getJobOffersByLocation,
  getJobOfferById,
  getJobOfferBySlug,
  createJobOffer,
  updateJobOffer,
  deleteJobOffer,
  generateSlug,
};

export default JobOffersApiService;