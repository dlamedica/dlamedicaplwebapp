import JobOffersApiService from '../../../services/jobOffersApi';

/**
 * Job Offers Statistics API Handler
 * Equivalent to Next.js pages/api/job-offers/stats.ts
 * 
 * Handles:
 * - GET /api/job-offers/stats - Get job offers statistics
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
    await handleGetStats(req, res);
  } catch (error) {
    console.error('Stats API Error:', error);
    res.status = 500;
    res.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * GET /api/job-offers/stats
 * Get comprehensive statistics about job offers
 */
async function handleGetStats(req: ApiRequest, res: ApiResponse) {
  const result = await JobOffersApiService.getJobOffersStats();

  if (result.success) {
    res.status = 200;
    res.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
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