/**
 * Serwis do pobierania artykułów z API
 */

import { apiCall } from '../lib/apiClient';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  source_urls?: string[];
}

export interface ArticlesResponse {
  articles: Article[];
}

/**
 * Pobiera listę artykułów z API
 */
export const fetchArticles = async (options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const queryString = params.toString();
    const url = `/articles${queryString ? `?${queryString}` : ''}`;

    const { data, error } = await apiCall(url);

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data?.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

/**
 * Pobiera pojedynczy artykuł z API
 */
export const fetchArticleById = async (id: number): Promise<Article | null> => {
  try {
    const { data, error } = await apiCall(`/articles/${id}`);

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data?.article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

/**
 * Pobiera kategorie artykułów
 */
export const getArticleCategories = (): string[] => {
  return [
    'Aktualności',
    'Najnowsze',
    'Technologie',
    'Zdrowie publiczne',
    'Badania',
    'Prawo medyczne',
    'Farmakologia'
  ];
};
