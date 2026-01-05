/**
 * API Client - klient do komunikacji z lokalnym backendem
 * Zastępuje local DB - wszystko działa przez własne API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper do pobierania tokena
const getToken = () => localStorage.getItem('access_token');

// Helper do API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    return { data: null, error: { message: data.error || 'Wystąpił błąd', code: response.status.toString() } };
  }
  
  return { data, error: null };
};

/**
 * Klient bazy danych - wrapper kompatybilny z poprzednim API
 * Używa lokalnego backendu zamiast local DB
 */
export const db = {
  from: (table: string) => createQueryBuilder(table),
  auth: {
    getSession: async () => {
      const token = getToken();
      if (!token) return { data: { session: null }, error: null };
      
      try {
        const result = await apiCall('/auth/me');
        return {
          data: {
            session: result.data ? { access_token: token, user: result.data } : null,
          },
          error: null,
        };
      } catch {
        return { data: { session: null }, error: null };
      }
    },
    getUser: async () => {
      const token = getToken();
      if (!token) return { data: { user: null }, error: null };
      
      try {
        const result = await apiCall('/auth/me');
        return { data: { user: result.data }, error: null };
      } catch {
        return { data: { user: null }, error: null };
      }
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const token = getToken();
      if (token) {
        apiCall('/auth/me').then(result => {
          if (result.data) {
            callback('SIGNED_IN', { user: result.data });
          }
        });
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return { error: null };
    },
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        
        const token = getToken();
        const response = await fetch(`${API_URL}/storage/${bucket}/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        
        const data = await response.json();
        return { data: response.ok ? { path: data.path } : null, error: response.ok ? null : data };
      },
      remove: async (paths: string[]) => {
        const result = await apiCall(`/storage/${bucket}/delete`, {
          method: 'POST',
          body: JSON.stringify({ paths }),
        });
        return { error: result.error };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `${API_URL}/storage/${bucket}/${path}` },
      }),
    }),
  },
};

// Query builder dla kompatybilności
function createQueryBuilder(table: string) {
  let queryParams: Record<string, any> = {};
  let selectColumns = '*';
  
  const builder = {
    select: (columns = '*') => {
      selectColumns = columns;
      return builder;
    },
    eq: (column: string, value: any) => {
      queryParams[column] = value;
      return builder;
    },
    in: (column: string, values: any[]) => {
      queryParams[`${column}__in`] = values.join(',');
      return builder;
    },
    gte: (column: string, value: any) => {
      queryParams[`${column}__gte`] = value;
      return builder;
    },
    lte: (column: string, value: any) => {
      queryParams[`${column}__lte`] = value;
      return builder;
    },
    order: (column: string, options?: { ascending?: boolean }) => {
      queryParams['_orderBy'] = column;
      queryParams['_order'] = options?.ascending === false ? 'desc' : 'asc';
      return builder;
    },
    limit: (n: number) => {
      queryParams['_limit'] = n;
      return builder;
    },
    range: (from: number, to: number) => {
      queryParams['_offset'] = from;
      queryParams['_limit'] = to - from + 1;
      return builder;
    },
    single: async () => {
      queryParams['_limit'] = 1;
      const result = await executeQuery();
      return { 
        data: result.data?.[0] || null, 
        error: result.error 
      };
    },
    maybeSingle: async () => {
      queryParams['_limit'] = 1;
      const result = await executeQuery();
      return { 
        data: result.data?.[0] || null, 
        error: null 
      };
    },
    then: async (resolve: (result: any) => void) => {
      const result = await executeQuery();
      resolve(result);
    },
  };

  async function executeQuery() {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    
    const url = `/data/${table}${params.toString() ? '?' + params.toString() : ''}`;
    return apiCall(url);
  }

  // Insert
  builder.insert = (data: any) => {
    return {
      select: () => ({
        single: async () => {
          const result = await apiCall(`/data/${table}`, {
            method: 'POST',
            body: JSON.stringify(Array.isArray(data) ? data[0] : data),
          });
          return result;
        },
        then: async (resolve: any) => {
          const result = await apiCall(`/data/${table}`, {
            method: 'POST',
            body: JSON.stringify(data),
          });
          resolve(result);
        },
      }),
      then: async (resolve: any) => {
        const result = await apiCall(`/data/${table}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        resolve(result);
      },
    };
  };

  // Update
  builder.update = (data: any) => {
    return {
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            const result = await apiCall(`/data/${table}/${value}`, {
              method: 'PUT',
              body: JSON.stringify(data),
            });
            return result;
          },
        }),
        then: async (resolve: any) => {
          const result = await apiCall(`/data/${table}/${value}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          resolve(result);
        },
      }),
    };
  };

  // Upsert
  builder.upsert = (data: any, _options?: any) => {
    return {
      select: () => ({
        single: async () => {
          const result = await apiCall(`/data/${table}/upsert`, {
            method: 'POST',
            body: JSON.stringify(data),
          });
          return result;
        },
      }),
      then: async (resolve: any) => {
        const result = await apiCall(`/data/${table}/upsert`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        resolve(result);
      },
    };
  };

  // Delete
  builder.delete = () => ({
    eq: (column: string, value: any) => ({
      then: async (resolve: any) => {
        const result = await apiCall(`/data/${table}/${value}`, {
          method: 'DELETE',
        });
        resolve(result);
      },
    }),
  });

  return builder;
}

// User Profile type definition
export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  profession?: string;
  zawod?: string;
  specialization?: string;
  city?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_employer?: boolean;
  is_company?: boolean;
  role?: string;
  company_name?: string;
  company_website?: string;
  company_logo_url?: string;
  company_bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Eksportuj API URL
export { API_URL };

// Eksport domyślny dla kompatybilności
export default db;
