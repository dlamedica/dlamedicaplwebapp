// Utility functions for filtering articles

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  createdAt?: string;
  category?: string;
  tags?: string[];
}

/**
 * Filters out articles older than 12 months (365 days) from the current date
 * @param articles - Array of articles to filter
 * @returns Filtered array with only articles newer than 12 months
 */
export const filterOldArticles = (articles: Article[]): Article[] => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  
  return articles.filter(article => {
    // Use createdAt if available, otherwise fall back to date field
    const articleDate = new Date(article.createdAt || article.date);
    
    // Check if the date is valid
    if (isNaN(articleDate.getTime())) {
      console.warn(`Invalid date for article ${article.id}: ${article.createdAt || article.date}`);
      return false; // Remove articles with invalid dates
    }
    
    // Return true if article is newer than 12 months
    return articleDate >= twelveMonthsAgo;
  });
};

/**
 * Filters articles by category
 * @param articles - Array of articles to filter
 * @param category - Category to filter by
 * @returns Filtered array
 */
export const filterByCategory = (articles: Article[], category: string): Article[] => {
  if (!category || category === 'Wszystkie' || category === 'Najnowsze') {
    return articles;
  }
  
  return articles.filter(article => 
    article.category && article.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Filters articles by tags
 * @param articles - Array of articles to filter
 * @param tag - Tag to filter by
 * @returns Filtered array
 */
export const filterByTag = (articles: Article[], tag: string): Article[] => {
  if (!tag) {
    return articles;
  }
  
  return articles.filter(article => 
    article.tags && article.tags.some(articleTag => 
      articleTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
};

/**
 * Sorts articles by date
 * @param articles - Array of articles to sort
 * @param sortOrder - 'newest' or 'oldest'
 * @returns Sorted array
 */
export const sortByDate = (articles: Article[], sortOrder: 'newest' | 'oldest' = 'newest'): Article[] => {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    
    if (sortOrder === 'newest') {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });
};

/**
 * Searches articles by title and excerpt
 * @param articles - Array of articles to search
 * @param searchTerm - Search term
 * @returns Filtered array
 */
export const searchArticles = (articles: Article[], searchTerm: string): Article[] => {
  if (!searchTerm.trim()) {
    return articles;
  }
  
  const term = searchTerm.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(term) || 
    article.excerpt.toLowerCase().includes(term)
  );
};

/**
 * Combined filter and sort function for articles
 * @param articles - Array of articles to process
 * @param filters - Filter options
 * @returns Processed array
 */
export const processArticles = (
  articles: Article[], 
  filters: {
    category?: string;
    tag?: string;
    sortOrder?: 'newest' | 'oldest';
    searchTerm?: string;
    removeOld?: boolean;
  } = {}
): Article[] => {
  let processed = [...articles];
  
  // First, remove old articles if requested (default: true)
  if (filters.removeOld !== false) {
    processed = filterOldArticles(processed);
  }
  
  // Apply category filter
  if (filters.category) {
    processed = filterByCategory(processed, filters.category);
  }
  
  // Apply tag filter
  if (filters.tag) {
    processed = filterByTag(processed, filters.tag);
  }
  
  // Apply search
  if (filters.searchTerm) {
    processed = searchArticles(processed, filters.searchTerm);
  }
  
  // Sort by date
  processed = sortByDate(processed, filters.sortOrder || 'newest');
  
  return processed;
};