import { db } from '../lib/apiClient';

// Interfaces
export interface CalculatorCategory {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'radio' | 'checkbox' | 'number' | 'text' | 'select';
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
    points: number;
  }>;
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
}

export interface CalculationConfig {
  type: 'sum_points' | 'custom';
  min_score: number;
  max_score: number;
  custom_logic?: string;
}

export interface ResultInterpretation {
  condition: string;
  result: string;
  description?: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
  severity: 'low' | 'moderate' | 'high' | 'positive' | 'negative';
}

export interface ResultsConfig {
  interpretations: ResultInterpretation[];
}

export interface MedicalCalculator {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  category_id: string;
  form_fields: FormField[];
  calculation_config: CalculationConfig;
  results_config: ResultsConfig;
  evidence: string[];
  next_steps: string[];
  references: string[];
  creator_insights: string;
  tags: string[];
  specialty: string;
  difficulty_level: string;
  usage_count: number;
  average_rating: number;
  is_featured: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  // Joined data
  category?: CalculatorCategory;
}

export interface CalculatorResult {
  id: string;
  user_id: string;
  calculator_id: string;
  input_data: Record<string, any>;
  results: Record<string, any>;
  calculation_time: string;
  ip_address?: string;
  user_agent?: string;
}

export interface CalculatorSearchFilters {
  category?: string;
  search?: string;
  specialty?: string;
  featured_only?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface CalculatorStats {
  total_calculators: number;
  total_categories: number;
  total_calculations: number;
  popular_calculators: MedicalCalculator[];
  newest_calculators: MedicalCalculator[];
}

// Calculator Service Class
export class CalculatorService {
  // Mock data definitions
  private static mockCategories: CalculatorCategory[] = [
    {
      id: 'cat-1',
      name: 'kardiologia',
      display_name: 'Kardiologia',
      description: 'Kalkulatory kardiologiczne',
      icon: 'heart',
      color: 'red',
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cat-2',
      name: 'pediatria',
      display_name: 'Pediatria',
      description: 'Kalkulatory pediatryczne',
      icon: 'child',
      color: 'blue',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  private static mockCalculators: MedicalCalculator[] = [
    {
      id: 'calc-1',
      slug: 'skala-cha2ds2-vasc',
      title: 'Skala CHA2DS2-VASc',
      description: 'Ocena ryzyka udaru u pacjentów z migotaniem przedsionków',
      instructions: 'Wybierz odpowiednie czynniki ryzyka',
      category_id: 'cat-1',
      form_fields: [],
      calculation_config: { type: 'sum_points', min_score: 0, max_score: 9 },
      results_config: { interpretations: [] },
      evidence: [],
      next_steps: [],
      references: [],
      creator_insights: '',
      tags: ['kardiologia', 'udar'],
      specialty: 'Kardiologia',
      difficulty_level: 'Średni',
      usage_count: 1500,
      average_rating: 4.8,
      is_featured: true,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      category: {
        id: 'cat-1',
        name: 'kardiologia',
        display_name: 'Kardiologia',
        description: 'Kalkulatory kardiologiczne',
        icon: 'heart',
        color: 'red',
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: 'calc-2',
      slug: 'bm-index',
      title: 'Wskaźnik BMI',
      description: 'Obliczanie wskaźnika masy ciała',
      instructions: 'Podaj wagę i wzrost',
      category_id: 'cat-2',
      form_fields: [],
      calculation_config: { type: 'custom', min_score: 10, max_score: 50 },
      results_config: { interpretations: [] },
      evidence: [],
      next_steps: [],
      references: [],
      creator_insights: '',
      tags: ['pediatria', 'ogólne'],
      specialty: 'Pediatria',
      difficulty_level: 'Łatwy',
      usage_count: 5000,
      average_rating: 4.5,
      is_featured: true,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      category: {
        id: 'cat-2',
        name: 'pediatria',
        display_name: 'Pediatria',
        description: 'Kalkulatory pediatryczne',
        icon: 'child',
        color: 'blue',
        sort_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ];

  // Get all calculator categories
  static async getCategories(): Promise<{ data: CalculatorCategory[] | null; error: any }> {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return { data: this.mockCategories, error: null };
    }

    try {
      const { data, error } = await db
        .from('calculator_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      return { data, error };
    } catch (error) {
      console.error('Error fetching calculator categories:', error);
      return { data: null, error };
    }
  }

  // Get calculators with optional filtering
  static async getCalculators(filters: CalculatorSearchFilters = {}): Promise<{ data: MedicalCalculator[] | null; error: any; count?: number }> {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      let filtered = [...this.mockCalculators];
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'featured') filtered = filtered.filter(c => c.is_featured);
        else if (filters.category !== 'popular' && filters.category !== 'newest') {
          filtered = filtered.filter(c => c.category?.name === filters.category);
        }
      }
      if (filters.featured_only) filtered = filtered.filter(c => c.is_featured);

      // Apply limit
      if (filters.limit) filtered = filtered.slice(0, filters.limit);

      return { data: filtered, error: null, count: filtered.length };
    }

    try {
      let query = db
        .from('medical_calculators')
        .select(`
          *,
          category:calculator_categories(*)
        `, { count: 'exact' })
        .eq('is_active', true);

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'popular') {
          query = query.order('usage_count', { ascending: false });
        } else if (filters.category === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (filters.category === 'featured') {
          query = query.eq('is_featured', true);
        } else {
          // Filter by category name
          query = query.eq('calculator_categories.name', filters.category);
        }
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }

      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }

      if (filters.featured_only) {
        query = query.eq('is_featured', true);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      // Default ordering if no category-specific ordering
      if (!filters.category || filters.category === 'all') {
        query = query.order('usage_count', { ascending: false });
      }

      const { data, error, count } = await query;

      return { data, error, count: count || 0 };
    } catch (error) {
      console.error('Error fetching calculators:', error);
      return { data: null, error, count: 0 };
    }
  }

  // Get single calculator by slug
  static async getCalculatorBySlug(slug: string): Promise<{ data: MedicalCalculator | null; error: any }> {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const calculator = this.mockCalculators.find(c => c.slug === slug);
      return { data: calculator || null, error: calculator ? null : 'Not found' };
    }

    try {
      const { data, error } = await db
        .from('medical_calculators')
        .select(`
          *,
          category:calculator_categories(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      // Increment usage count
      if (data && !error) {
        await db
          .from('medical_calculators')
          .update({ usage_count: (data.usage_count || 0) + 1 })
          .eq('id', data.id);
      }

      return { data, error };
    } catch (error) {
      console.error('Error fetching calculator by slug:', error);
      return { data: null, error };
    }
  }

  // Calculate results based on form input
  static calculateResults(calculator: MedicalCalculator, inputData: Record<string, any>): {
    score: number;
    interpretation: ResultInterpretation | null;
    rawResults: Record<string, any>;
  } {
    try {
      let score = 0;
      const rawResults: Record<string, any> = { inputData, fieldScores: {} };

      // Calculate score based on form fields
      if (calculator.calculation_config.type === 'sum_points') {
        calculator.form_fields.forEach(field => {
          const inputValue = inputData[field.id];
          if (inputValue && field.options) {
            const selectedOption = field.options.find(opt => opt.value === inputValue);
            if (selectedOption) {
              score += selectedOption.points;
              rawResults.fieldScores[field.id] = selectedOption.points;
            }
          }
        });
      }

      // Find matching interpretation
      let interpretation: ResultInterpretation | null = null;
      for (const interp of calculator.results_config.interpretations) {
        try {
          // Safely evaluate condition without eval
          if (this.evaluateCondition(interp.condition, score)) {
            interpretation = interp;
            break;
          }
        } catch (e) {
          console.error('Error evaluating condition:', interp.condition, e);
        }
      }

      rawResults.score = score;
      rawResults.interpretation = interpretation;

      return { score, interpretation, rawResults };
    } catch (error) {
      console.error('Error calculating results:', error);
      return { score: 0, interpretation: null, rawResults: {} };
    }
  }

  // Save calculation result for logged user
  static async saveCalculatorResult(
    calculatorId: string,
    inputData: Record<string, any>,
    results: Record<string, any>
  ): Promise<{ data: CalculatorResult | null; error: any }> {
    try {
      const { data: { user } } = await db.auth.getUser();

      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await db
        .from('calculator_results')
        .insert({
          user_id: user.id,
          calculator_id: calculatorId,
          input_data: inputData,
          results: results,
          calculation_time: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error saving calculator result:', error);
      return { data: null, error };
    }
  }

  // Get user's calculator history
  static async getUserCalculatorHistory(limit: number = 20): Promise<{ data: CalculatorResult[] | null; error: any }> {
    try {
      const { data: { user } } = await db.auth.getUser();

      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data, error } = await db
        .from('calculator_results')
        .select(`
          *,
          calculator:medical_calculators(id, title, slug)
        `)
        .eq('user_id', user.id)
        .order('calculation_time', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      console.error('Error fetching calculator history:', error);
      return { data: null, error };
    }
  }

  // Get calculator statistics
  static async getCalculatorStats(): Promise<{ data: CalculatorStats | null; error: any }> {
    try {
      // Get total counts
      const [categoriesResult, calculatorsResult, resultsResult] = await Promise.all([
        db.from('calculator_categories').select('id', { count: 'exact', head: true }),
        db.from('medical_calculators').select('id', { count: 'exact', head: true }).eq('is_active', true),
        db.from('calculator_results').select('id', { count: 'exact', head: true })
      ]);

      // Get popular calculators
      const { data: popularCalculators } = await db
        .from('medical_calculators')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false })
        .limit(5);

      // Get newest calculators
      const { data: newestCalculators } = await db
        .from('medical_calculators')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      const stats: CalculatorStats = {
        total_calculators: calculatorsResult.count || 0,
        total_categories: categoriesResult.count || 0,
        total_calculations: resultsResult.count || 0,
        popular_calculators: popularCalculators || [],
        newest_calculators: newestCalculators || []
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching calculator stats:', error);
      return { data: null, error };
    }
  }

  // Search calculators with text search
  static async searchCalculators(searchTerm: string, limit: number = 20): Promise<{ data: MedicalCalculator[] | null; error: any }> {
    return this.getCalculators({
      search: searchTerm,
      limit: limit
    });
  }

  // Get featured calculators
  static async getFeaturedCalculators(limit: number = 10): Promise<{ data: MedicalCalculator[] | null; error: any }> {
    return this.getCalculators({
      featured_only: true,
      limit: limit
    });
  }

  // Get calculators by category
  static async getCalculatorsByCategory(categoryName: string, limit?: number): Promise<{ data: MedicalCalculator[] | null; error: any }> {
    return this.getCalculators({
      category: categoryName,
      limit: limit
    });
  }

  // Safely evaluate condition strings without eval
  private static evaluateCondition(condition: string, score: number): boolean {
    // Replace 'score' with actual value
    const processedCondition = condition.replace(/score/g, score.toString());

    // Handle common mathematical conditions safely
    const patterns = [
      {
        regex: /^(\d+(?:\.\d+)?) >= (\d+(?:\.\d+)?) && (\d+(?:\.\d+)?) <= (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val1, min, val2, max] = matches;
          return parseFloat(val1) >= parseFloat(min) && parseFloat(val2) <= parseFloat(max);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) >= (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) >= parseFloat(threshold);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) <= (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) <= parseFloat(threshold);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) > (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) > parseFloat(threshold);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) < (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) < parseFloat(threshold);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) == (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) === parseFloat(threshold);
        }
      },
      {
        regex: /^(\d+(?:\.\d+)?) != (\d+(?:\.\d+)?)$/, handler: (matches: RegExpMatchArray) => {
          const [, val, threshold] = matches;
          return parseFloat(val) !== parseFloat(threshold);
        }
      }
    ];

    for (const pattern of patterns) {
      const matches = processedCondition.match(pattern.regex);
      if (matches) {
        return pattern.handler(matches);
      }
    }

    // Fallback for unrecognized patterns - log warning and return false
    console.warn('Unrecognized condition pattern:', condition);
    return false;
  }
}

export default CalculatorService;