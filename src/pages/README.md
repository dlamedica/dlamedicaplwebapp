# Job Offers Pages & API Routes

This directory contains the page components and API route handlers for the job offers functionality, structured similar to Next.js for consistency and scalability.

## Pages Structure

### `/oferty-pracy/`
- `index.tsx` - Main job offers listing page
- `[id].tsx` - Dynamic job offer detail page (by slug)

## API Routes Structure

### `/api/job-offers/`
- `index.ts` - Main job offers API (GET all, POST create)
- `[id].ts` - Individual job offer operations (GET, PUT, DELETE by ID)
- `search.ts` - Advanced search functionality
- `stats.ts` - Job offers statistics

## Usage Examples

### Pages

```tsx
// Main job offers page
import JobOffersIndex from './pages/oferty-pracy/index';

<JobOffersIndex darkMode={darkMode} fontSize={fontSize} />

// Job offer detail page
import JobOfferDetail from './pages/oferty-pracy/[id]';

<JobOfferDetail darkMode={darkMode} fontSize={fontSize} />
```

### API Service

```tsx
import JobOffersApiService from '../services/jobOffersApi';

// Get all job offers with filters
const result = await JobOffersApiService.getJobOffers({
  page: 1,
  limit: 10,
  category: 'Lekarze',
  location: 'Warszawa',
  search: 'ginekolog'
});

// Get job offer by slug
const jobOffer = await JobOffersApiService.getJobOfferBySlug('ginekolog-warszawa');

// Create new job offer
const newOffer = await JobOffersApiService.createJobOffer({
  company: 'Klinika XYZ',
  position: 'Lekarz internista',
  location: 'Kraków',
  contractType: 'Umowa o pracę',
  category: 'Lekarze',
  description: 'Poszukujemy doświadczonego internisty...',
});
```

## API Endpoints

### GET `/api/job-offers`
Get all job offers with optional filtering and pagination.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `category` (string) - Filter by category
- `location` (string) - Filter by location
- `contractType` (string) - Filter by contract type
- `salaryType` (string) - Filter by salary type
- `search` (string) - Search in position, company, description
- `sortBy` (string) - Sort by: postedDate, salary, company, position
- `sortOrder` (string) - Sort order: asc, desc

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### POST `/api/job-offers`
Create a new job offer.

**Body:**
```json
{
  "company": "Company Name",
  "position": "Position Title",
  "location": "City",
  "contractType": "Contract Type",
  "category": "Category",
  "description": "Job description...",
  "salary": "5000 PLN",
  "salaryType": "Stawka za miesiąc"
}
```

### GET `/api/job-offers/[id]`
Get job offer by ID.

### PUT `/api/job-offers/[id]`
Update job offer by ID.

### DELETE `/api/job-offers/[id]`
Delete job offer by ID.

### GET `/api/job-offers/search`
Advanced search with filters (same as GET `/api/job-offers` but with required search parameters).

### GET `/api/job-offers/stats`
Get job offers statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byCategory": {
      "Lekarze": 80,
      "Pielęgniarki": 40,
      "Fizjoterapeuci": 30
    },
    "byLocation": {
      "Warszawa": 60,
      "Kraków": 40,
      "Wrocław": 30
    },
    "byContractType": {
      "Umowa o pracę": 100,
      "Umowa zlecenie": 30,
      "B2B": 20
    },
    "recent": 15
  }
}
```

## SEO Features

The job offer detail page includes comprehensive SEO optimization:

### Meta Tags
- Dynamic title and description based on job offer content
- Open Graph tags for social media sharing
- Canonical URLs
- Structured data (JSON-LD) for search engines

### Structured Data
The page includes JobPosting structured data for better search engine understanding:
- Job title and description
- Hiring organization information
- Job location
- Employment type
- Salary information (when available)
- Date posted and validity period

### Usage
SEO is automatically handled when viewing job offer detail pages. The `updateMetaTags` utility function updates the document head with relevant information.

## Error Handling

All API routes include comprehensive error handling:
- Input validation
- Database error handling
- Structured error responses
- HTTP status codes

## Type Safety

All components and API routes are fully typed with TypeScript:
- `JobOffer` interface for job offer data
- `JobOfferInput` interface for creating/updating job offers
- `ApiResponse` interfaces for API responses
- `JobOfferQuery` interface for search parameters

## Integration with Backend API

The API routes integrate with the backend:
- Real-time data fetching
- Automatic error handling
- Type-safe database operations
- Optimized queries for performance

## Future Enhancements

Planned improvements:
- Planned real-time updates
- Advanced filtering with price ranges
- Job offer bookmarking and alerts
- Application tracking system
- Email notifications for new job offers
- Analytics and tracking