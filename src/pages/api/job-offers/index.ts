import JobOffersApiService, { JobOfferQuery } from '../../../services/jobOffersApi';
import { JobOfferInput } from '../../../lib/types/job-offers';

/**
 * Job Offers API Handler
 * Equivalent to Next.js pages/api/job-offers/index.ts
 * 
 * Handles:
 * - GET /api/job-offers - Get all job offers with filtering and pagination
 * - POST /api/job-offers - Create a new job offer
 */

export interface NextApiRequest {
  method?: string;
  query: Record<string, string | string[]>;
  body: any;
  headers: Record<string, string>;
}

export interface NextApiResponse {
  status: (code: number) => NextApiResponse;
  json: (data: any) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 BEZPIECZEŃSTWO: CORS - tylko dozwolone domeny (nie wildcard!)
  const allowedOrigins = [
    import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
    import.meta.env.VITE_FRONTEND_URL_PROD,
    'https://dlamedica.pl',
    'https://www.dlamedica.pl',
  ].filter(Boolean);
  
  const origin = req.headers.origin || req.headers.referer;
  const isAllowedOrigin = !origin || allowedOrigins.some(allowed => 
    origin.startsWith(allowed)
  );
  
  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGetJobOffers(req, res);
        break;
      
      case 'POST':
        await handleCreateJobOffer(req, res);
        break;
      
      default:
        res.status(405).json({ 
          success: false,
          error: 'Method not allowed',
          allowedMethods: ['GET', 'POST']
        });
        break;
    }
  } catch (error) {
    console.error('API Error in /api/job-offers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * GET /api/job-offers
 * Get all job offers with optional filtering and pagination
 */
async function handleGetJobOffers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query: JobOfferQuery = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: Math.min(parseInt(req.query.limit as string) || 10, 100), // Max 100 items per page
      category: req.query.category as string,
      location: req.query.location as string,
      contractType: req.query.contractType as string,
      salaryType: req.query.salaryType as string,
      search: req.query.search as string || req.query.q as string,
      sortBy: (req.query.sortBy as 'postedDate' | 'salary' | 'company' | 'position') || 'postedDate',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    // Validate pagination parameters
    if (query.page && query.page < 1) {
      res.status(400).json({
        success: false,
        error: 'Page number must be greater than 0',
      });
      return;
    }

    if (query.limit && (query.limit < 1 || query.limit > 100)) {
      res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100',
      });
      return;
    }

    const result = await JobOffersApiService.getJobOffers(query);

    if (result.success) {
      // Set cache headers for GET requests
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        query: {
          page: query.page,
          limit: query.limit,
          filters: {
            category: query.category,
            location: query.location,
            contractType: query.contractType,
            salaryType: query.salaryType,
            search: query.search,
          },
          sorting: {
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    throw error; // Will be handled by main error handler
  }
}

/**
 * POST /api/job-offers
 * Create a new job offer
 */
async function handleCreateJobOffer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const jobOfferData: JobOfferInput = req.body;

    // Comprehensive validation
    const validationErrors = validateJobOfferInput(jobOfferData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Additional business logic validation
    if (jobOfferData.salary && jobOfferData.salary.length > 50) {
      res.status(400).json({
        success: false,
        error: 'Salary field is too long (max 50 characters)',
      });
      return;
    }

    if (jobOfferData.description && jobOfferData.description.length > 5000) {
      res.status(400).json({
        success: false,
        error: 'Description is too long (max 5000 characters)',
      });
      return;
    }

    const result = await JobOffersApiService.createJobOffer(jobOfferData);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    throw error; // Will be handled by main error handler
  }
}

/**
 * Validate job offer input data
 */
function validateJobOfferInput(data: JobOfferInput): string[] {
  const errors: string[] = [];

  // Required fields
  if (!data.company || data.company.trim().length === 0) {
    errors.push('Company name is required');
  }
  if (!data.position || data.position.trim().length === 0) {
    errors.push('Position title is required');
  }
  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required');
  }
  if (!data.contractType || data.contractType.trim().length === 0) {
    errors.push('Contract type is required');
  }
  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Job description is required');
  }

  // Field length validation
  if (data.company && data.company.length > 100) {
    errors.push('Company name is too long (max 100 characters)');
  }
  if (data.position && data.position.length > 100) {
    errors.push('Position title is too long (max 100 characters)');
  }
  if (data.location && data.location.length > 100) {
    errors.push('Location is too long (max 100 characters)');
  }

  // Valid category validation
  const validCategories = [
    'Lekarze', 
    'Pielęgniarki', 
    'Ratownicy', 
    'Fizjoterapeuci', 
    'Technicy', 
    'Farmaceuci', 
    'Inne'
  ];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
  }

  // Valid contract type validation
  const validContractTypes = [
    'Umowa o pracę',
    'Umowa zlecenie',
    'Umowa o dzieło',
    'B2B',
    'Kontrakt',
    'Praktyki/Staż'
  ];
  if (data.contractType && !validContractTypes.includes(data.contractType)) {
    errors.push(`Invalid contract type. Must be one of: ${validContractTypes.join(', ')}`);
  }

  return errors;
}

// Additional utility functions for the API

/**
 * Get API documentation/schema
 */
export async function getApiDocumentation() {
  return {
    version: '1.0',
    endpoints: {
      'GET /api/job-offers': {
        description: 'Get job offers with filtering and pagination',
        parameters: {
          page: 'number (optional, default: 1)',
          limit: 'number (optional, default: 10, max: 100)',
          category: 'string (optional)',
          location: 'string (optional)',
          contractType: 'string (optional)',
          salaryType: 'string (optional)',
          search: 'string (optional)',
          sortBy: 'string (optional: postedDate, salary, company, position)',
          sortOrder: 'string (optional: asc, desc)',
        },
        response: {
          success: 'boolean',
          data: 'JobOffer[]',
          pagination: 'PaginationInfo',
          query: 'QueryInfo',
        },
      },
      'POST /api/job-offers': {
        description: 'Create a new job offer',
        body: {
          company: 'string (required)',
          position: 'string (required)',
          location: 'string (required)',
          contractType: 'string (required)',
          category: 'string (required)',
          description: 'string (required)',
          salary: 'string (optional)',
          salaryType: 'string (optional)',
          facilityType: 'string (optional)',
          zamow_medyczny: 'boolean (optional)',
        },
        response: {
          success: 'boolean',
          data: 'JobOffer',
          message: 'string',
        },
      },
    },
    errors: {
      400: 'Bad Request - Invalid parameters or validation failed',
      405: 'Method Not Allowed - Unsupported HTTP method',
      500: 'Internal Server Error - Server-side error',
    },
  };
}

// Export for direct use in React components
export { JobOffersApiService };