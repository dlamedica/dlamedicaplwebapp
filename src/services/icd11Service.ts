import { db } from '../lib/apiClient';

export interface ICD11Entity {
  id: string;
  who_id: string;
  code: string;
  title: string;
  description?: string | null;
  version?: string;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICD11SearchResult {
  entities: ICD11Entity[];
  total: number;
  page: number;
  limit: number;
}

export class ICD11Service {
  /**
   * Search ICD-11 entities with pagination
   */
  static async searchEntities(
    searchTerm: string = '',
    page: number = 1,
    limit: number = 50
  ): Promise<ICD11SearchResult> {
    try {
      let query = db
        .from('icd11_entities')
        .select('*', { count: 'exact' });

      // Apply search filter if provided
      if (searchTerm.trim()) {
        const term = searchTerm.trim();
        query = query.or(
          `code.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%`
        );
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query
        .order('code', { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching ICD-11 entities:', error);
        throw new Error(`Failed to fetch ICD-11 data: ${error.message}`);
      }

      return {
        entities: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('ICD11Service.searchEntities error:', error);
      throw error;
    }
  }

  /**
   * Get all entities (use carefully, might be large)
   */
  static async getAllEntities(): Promise<ICD11Entity[]> {
    try {
      const { data, error } = await db
        .from('icd11_entities')
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        console.error('Error fetching all ICD-11 entities:', error);
        throw new Error(`Failed to fetch ICD-11 data: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('ICD11Service.getAllEntities error:', error);
      throw error;
    }
  }

  /**
   * Get entity by WHO ID
   */
  static async getEntityByWhoId(whoId: string): Promise<ICD11Entity | null> {
    try {
      const { data, error } = await db
        .from('icd11_entities')
        .select('*')
        .eq('who_id', whoId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching ICD-11 entity:', error);
        throw new Error(`Failed to fetch ICD-11 entity: ${error.message}`);
      }

      return data || null;
    } catch (error) {
      console.error('ICD11Service.getEntityByWhoId error:', error);
      throw error;
    }
  }

  /**
   * Get entity by code
   */
  static async getEntityByCode(code: string): Promise<ICD11Entity | null> {
    try {
      const { data, error } = await db
        .from('icd11_entities')
        .select('*')
        .eq('code', code)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching ICD-11 entity by code:', error);
        throw new Error(`Failed to fetch ICD-11 entity: ${error.message}`);
      }

      return data || null;
    } catch (error) {
      console.error('ICD11Service.getEntityByCode error:', error);
      throw error;
    }
  }

  /**
   * Get statistics about ICD-11 data
   */
  static async getStats(): Promise<{
    total: number;
    version?: string;
    lastUpdated?: string;
  }> {
    try {
      const { count, error } = await db
        .from('icd11_entities')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching ICD-11 stats:', error);
        throw new Error(`Failed to fetch ICD-11 stats: ${error.message}`);
      }

      // Get version and last updated info
      const { data: versionData } = await db
        .from('icd11_entities')
        .select('version, generated_at')
        .limit(1)
        .single();

      return {
        total: count || 0,
        version: versionData?.version,
        lastUpdated: versionData?.generated_at
      };
    } catch (error) {
      console.error('ICD11Service.getStats error:', error);
      throw error;
    }
  }

  /**
   * Check if local DB is configured and ICD-11 data is available
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const { count, error } = await db
        .from('icd11_entities')
        .select('*', { count: 'exact', head: true });

      return !error && (count || 0) > 0;
    } catch (error) {
      return false;
    }
  }
}