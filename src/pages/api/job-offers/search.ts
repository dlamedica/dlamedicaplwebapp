import JobOffersApiService, { JobOfferQuery } from '../../../services/jobOffersApi';

/**
 * Job Offers Search API Handler
 * Equivalent to Next.js pages/api/job-offers/search.ts
 * 
 * Handles:
 * - GET /api/job-offers/search - Advanced search with filters
 */

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  json: (data: any) => void;
  end: () => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status = 405;
    res.json({ error: 'Method not allowed' });
    return;
  }

  try {
    await handleSearchJobOffers(req, res);
  } catch (error) {
    console.error('Search API Error:', error);
    res.status = 500;
    res.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/job-offers/search
 * Advanced search with multiple filters
 */
async function handleSearchJobOffers(req: ApiRequest, res: ApiResponse) {
  const query: JobOfferQuery = {
    page: req.query?.page ? parseInt(req.query.page as string) : 1,
    limit: req.query?.limit ? parseInt(req.query.limit as string) : 10,
    category: req.query?.category as string,
    location: req.query?.location as string,
    contractType: req.query?.contractType as string,
    salaryType: req.query?.salaryType as string,
    search: req.query?.search as string || req.query?.q as string, // Support both 'search' and 'q'
    sortBy: req.query?.sortBy as 'postedDate' | 'salary' | 'company' | 'position',
    sortOrder: req.query?.sortOrder as 'asc' | 'desc',
  };

  // Validate search query
  if (!query.search && !query.category && !query.location && !query.contractType && !query.salaryType) {
    res.status = 400;
    res.json({
      success: false,
      error: 'At least one search parameter is required',
    });
    return;
  }

  const result = await JobOffersApiService.searchJobOffers(query);

  if (result.success) {
    res.status = 200;
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      query: {
        search: query.search,
        filters: {
          category: query.category,
          location: query.location,
          contractType: query.contractType,
          salaryType: query.salaryType,
        },
        sorting: {
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        },
      },
    });
  } else {
    res.status = 400;
    res.json({
      success: false,
      error: result.error,
    });
  }
}

// Export for direct use
export { JobOffersApiService };