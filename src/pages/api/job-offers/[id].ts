import JobOffersApiService from '../../../services/jobOffersApi';
import { JobOfferInput } from '../../../lib/types/job-offers';

/**
 * Individual Job Offer API Handler
 * Equivalent to Next.js pages/api/job-offers/[id].ts
 * 
 * Handles:
 * - GET /api/job-offers/[id] - Get job offer by ID or slug
 * - PUT /api/job-offers/[id] - Update job offer by ID
 * - DELETE /api/job-offers/[id] - Delete job offer by ID
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
  const { id } = req.query as { id: string };

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
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Validate ID parameter
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    res.status(400).json({ 
      success: false,
      error: 'Job offer ID or slug is required',
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGetJobOffer(id, req, res);
        break;
      
      case 'PUT':
        await handleUpdateJobOffer(id, req, res);
        break;
      
      case 'DELETE':
        await handleDeleteJobOffer(id, req, res);
        break;
      
      default:
        res.status(405).json({ 
          success: false,
          error: 'Method not allowed',
          allowedMethods: ['GET', 'PUT', 'DELETE'],
          timestamp: new Date().toISOString()
        });
        break;
    }
  } catch (error) {
    console.error(`API Error in /api/job-offers/${id}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * GET /api/job-offers/[id]
 * Get job offer by ID or slug
 */
async function handleGetJobOffer(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try to get by ID first, then by slug
    let result = await JobOffersApiService.getJobOfferById(id);
    
    if (!result.success && result.error?.includes('not found')) {
      // If not found by ID, try by slug
      result = await JobOffersApiService.getJobOfferBySlug(id);
    }

    if (result.success && result.data) {
      // Set cache headers for GET requests
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
      res.setHeader('ETag', `"${result.data.id}-${new Date(result.data.postedDate).getTime()}"`);
      
      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          id: result.data.id,
          slug: JobOffersApiService.generateSlug(result.data.position, result.data.location),
          lastModified: result.data.postedDate,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      const statusCode = result.error?.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error || 'Job offer not found',
        searchedBy: isUUID(id) ? 'ID' : 'slug',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    throw error; // Will be handled by main error handler
  }
}

/**
 * PUT /api/job-offers/[id]
 * Update job offer by ID
 */
async function handleUpdateJobOffer(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const updates: Partial<JobOfferInput> = req.body;

    // Validate that we have update data
    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        error: 'No update data provided',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validate update data
    const validationErrors = validateJobOfferUpdates(updates);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Only allow updates by UUID (not slug)
    if (!isUUID(id)) {
      res.status(400).json({
        success: false,
        error: 'Updates can only be performed using the job offer UUID, not slug',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const result = await JobOffersApiService.updateJobOffer(id, updates);

    if (result.success && result.data) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message,
        meta: {
          updatedFields: Object.keys(updates),
          id: result.data.id,
          slug: JobOffersApiService.generateSlug(result.data.position, result.data.location),
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      const statusCode = result.error?.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error || 'Failed to update job offer',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    throw error; // Will be handled by main error handler
  }
}

/**
 * DELETE /api/job-offers/[id]
 * Delete job offer by ID
 */
async function handleDeleteJobOffer(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow deletion by UUID (not slug)
    if (!isUUID(id)) {
      res.status(400).json({
        success: false,
        error: 'Deletion can only be performed using the job offer UUID, not slug',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Optional: Add authorization check here
    // if (!isAuthorizedToDelete(req.headers.authorization, id)) {
    //   res.status(403).json({ success: false, error: 'Unauthorized' });
    //   return;
    // }

    const result = await JobOffersApiService.deleteJobOffer(id);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        meta: {
          deletedId: id,
          deletedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      const statusCode = result.error?.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error || 'Failed to delete job offer',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    throw error; // Will be handled by main error handler
  }
}

/**
 * Validate job offer update data
 */
function validateJobOfferUpdates(updates: Partial<JobOfferInput>): string[] {
  const errors: string[] = [];

  // Field length validation
  if (updates.company && updates.company.length > 100) {
    errors.push('Company name is too long (max 100 characters)');
  }
  if (updates.position && updates.position.length > 100) {
    errors.push('Position title is too long (max 100 characters)');
  }
  if (updates.location && updates.location.length > 100) {
    errors.push('Location is too long (max 100 characters)');
  }
  if (updates.salary && updates.salary.length > 50) {
    errors.push('Salary is too long (max 50 characters)');
  }
  if (updates.description && updates.description.length > 5000) {
    errors.push('Description is too long (max 5000 characters)');
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
  if (updates.category && !validCategories.includes(updates.category)) {
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
  if (updates.contractType && !validContractTypes.includes(updates.contractType)) {
    errors.push(`Invalid contract type. Must be one of: ${validContractTypes.join(', ')}`);
  }

  // Ensure no empty strings
  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      errors.push(`${key} cannot be empty`);
    }
  });

  return errors;
}

/**
 * Check if a string is a valid UUID
 */
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Additional endpoints for specific operations

/**
 * GET /api/job-offers/slug/[slug]
 * Get job offer by slug specifically
 */
export async function getJobOfferBySlugEndpoint(slug: string) {
  return await JobOffersApiService.getJobOfferBySlug(slug);
}

/**
 * GET /api/job-offers/category/[category]
 * Get job offers by category
 */
export async function getJobOffersByCategory(category: string) {
  return await JobOffersApiService.getJobOffersByCategory(category);
}

/**
 * GET /api/job-offers/location/[location]
 * Get job offers by location
 */
export async function getJobOffersByLocation(location: string) {
  return await JobOffersApiService.getJobOffersByLocation(location);
}

/**
 * Get API documentation for this endpoint
 */
export async function getApiDocumentation() {
  return {
    version: '1.0',
    endpoint: '/api/job-offers/[id]',
    description: 'Operations on individual job offers',
    parameters: {
      id: 'string (UUID or slug) - Job offer identifier',
    },
    methods: {
      'GET': {
        description: 'Get job offer by ID or slug',
        response: {
          success: 'boolean',
          data: 'JobOffer',
          meta: 'object',
        },
      },
      'PUT': {
        description: 'Update job offer (UUID only)',
        body: 'Partial<JobOfferInput>',
        response: {
          success: 'boolean',
          data: 'JobOffer',
          message: 'string',
          meta: 'object',
        },
      },
      'DELETE': {
        description: 'Delete job offer (UUID only)',
        response: {
          success: 'boolean',
          message: 'string',
          meta: 'object',
        },
      },
    },
    errors: {
      400: 'Bad Request - Invalid ID, validation failed, or missing data',
      404: 'Not Found - Job offer not found',
      405: 'Method Not Allowed - Unsupported HTTP method',
      500: 'Internal Server Error - Server-side error',
    },
  };
}

// Export for direct use in React components
export { JobOffersApiService };