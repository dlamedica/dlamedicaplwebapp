// WordPress API Service for CMS and Shop integration
// CMS: cms.dlamedica.pl/wp-json/wp/v2/posts
// Shop: sklep.dlamedica.pl/wp-json/wp/v2/products (WooCommerce)

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: {
    [key: string]: any;
  };
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: any[];
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: any[];
}

export interface PostsResponse {
  posts: WordPressPost[];
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export interface ProductsResponse {
  products: WooCommerceProduct[];
  totalPages: number;
  totalProducts: number;
  hasMore: boolean;
}

class WordPressService {
  // Konfiguracja przez zmienne środowiskowe. Jeśli nie podasz, CMS jest domyślnie WYŁĄCZONY,
  // aby nie spamować błędami sieci podczas lokalnego dev.
  // NIE używaj hardcoded wartości - zawsze przez zmienne środowiskowe!
  private static readonly CMS_BASE_URL = (import.meta as any).env?.VITE_CMS_BASE_URL;
  private static readonly SHOP_BASE_URL = (import.meta as any).env?.VITE_SHOP_BASE_URL;
  private static readonly ENABLE_CMS = String((import.meta as any).env?.VITE_ENABLE_CMS || '').toLowerCase() === 'true';
  private static readonly DEFAULT_PER_PAGE = 10;

  // Basic fetch with error handling and CORS support
  private static async fetchWithErrorHandling(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        mode: 'cors', // Enable CORS
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('WordPress API Error:', error);
      throw error;
    }
  }

  // ===================================
  // CMS POSTS METHODS
  // ===================================

  static async getPosts(
    page: number = 1,
    perPage: number = this.DEFAULT_PER_PAGE,
    categories?: number[],
    search?: string
  ): Promise<PostsResponse> {
    try {
      // Jeśli CMS jest wyłączony lub tryb MOCK
      const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      if (!this.ENABLE_CMS || useMock) {
        if (useMock) {
          const mockPosts: WordPressPost[] = [
            {
              id: 1,
              date: new Date().toISOString(),
              date_gmt: new Date().toISOString(),
              guid: { rendered: 'mock-1' },
              modified: new Date().toISOString(),
              modified_gmt: new Date().toISOString(),
              slug: 'nowe-standardy-w-kardiologii',
              status: 'publish',
              type: 'post',
              link: '/aktualnosci/nowe-standardy-w-kardiologii',
              title: { rendered: 'Nowe standardy w kardiologii inwazyjnej 2024' },
              content: { rendered: '<p>W 2024 roku wprowadzono zaktualizowane wytyczne dotyczące leczenia ostrego zespołu wieńcowego...</p>', protected: false },
              excerpt: { rendered: 'Przegląd najnowszych wytycznych PTK i ESC dotyczących postępowania w ostrych zespołach wieńcowych.', protected: false },
              author: 1,
              featured_media: 0,
              comment_status: 'open',
              ping_status: 'open',
              sticky: false,
              template: '',
              format: 'standard',
              meta: [],
              categories: [1],
              tags: [],
              _links: {}
            },
            {
              id: 2,
              date: new Date(Date.now() - 86400000).toISOString(),
              date_gmt: new Date(Date.now() - 86400000).toISOString(),
              guid: { rendered: 'mock-2' },
              modified: new Date().toISOString(),
              modified_gmt: new Date().toISOString(),
              slug: 'sztuczna-inteligencja-w-diagnostyce',
              status: 'publish',
              type: 'post',
              link: '/aktualnosci/ai-w-diagnostyce',
              title: { rendered: 'Sztuczna inteligencja w diagnostyce obrazowej' },
              content: { rendered: '<p>Systemy AI coraz skuteczniej wspierają radiologów w wykrywaniu zmian nowotworowych we wczesnym stadium...</p>', protected: false },
              excerpt: { rendered: 'Jak algorytmy uczenia maszynowego zmieniają oblicze nowoczesnej radiologii i onkologii.', protected: false },
              author: 1,
              featured_media: 0,
              comment_status: 'open',
              ping_status: 'open',
              sticky: false,
              template: '',
              format: 'standard',
              meta: [],
              categories: [2],
              tags: [],
              _links: {}
            },
            {
              id: 3,
              date: new Date(Date.now() - 172800000).toISOString(),
              date_gmt: new Date(Date.now() - 172800000).toISOString(),
              guid: { rendered: 'mock-3' },
              modified: new Date().toISOString(),
              modified_gmt: new Date().toISOString(),
              slug: 'rezydentura-w-polsce-raport',
              status: 'publish',
              type: 'post',
              link: '/aktualnosci/raport-rezydentury',
              title: { rendered: 'Raport: Sytuacja rezydentów w Polsce' },
              content: { rendered: '<p>Analiza warunków pracy, zarobków i dostępności miejsc specjalizacyjnych w bieżącym roku...</p>', protected: false },
              excerpt: { rendered: 'Najnowsze dane z Ministerstwa Zdrowia dotyczące naboru na specjalizacje lekarskie.', protected: false },
              author: 1,
              featured_media: 0,
              comment_status: 'open',
              ping_status: 'open',
              sticky: false,
              template: '',
              format: 'standard',
              meta: [],
              categories: [3],
              tags: [],
              _links: {}
            }
          ];
          return { posts: mockPosts, totalPages: 1, totalPosts: 3, hasMore: false };
        }
        return { posts: [], totalPages: 0, totalPosts: 0, hasMore: false };
      }
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        _embed: 'true', // Include featured media and author info
        status: 'publish'
      });

      if (categories && categories.length > 0) {
        params.append('categories', categories.join(','));
      }

      if (search) {
        params.append('search', search);
      }

      const response = await this.fetchWithErrorHandling(
        `${this.CMS_BASE_URL}/posts?${params.toString()}`
      );

      const posts: WordPressPost[] = await response.json();

      // Extract pagination info from headers
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const hasMore = page < totalPages;

      return {
        posts,
        totalPages,
        totalPosts,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Return empty response instead of throwing to prevent app crashes
      return {
        posts: [],
        totalPages: 0,
        totalPosts: 0,
        hasMore: false
      };
    }
  }

  static async getPost(id: number): Promise<WordPressPost | null> {
    // Hard Mock Return
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return null; // Mock retrieval handled better in getPosts for now, distinct item mock not critical for layout check but preventing 404 is.
    }
    try {
      if (!this.ENABLE_CMS) return null;
      const response = await this.fetchWithErrorHandling(
        `${this.CMS_BASE_URL}/posts/${id}?_embed=true`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  static async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    // Hard Mock Return
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      // Return a dummy post if needed to prevent null crashes, or null if expected
      return null;
    }
    try {
      if (!this.ENABLE_CMS) return null;
      const response = await this.fetchWithErrorHandling(
        `${this.CMS_BASE_URL}/posts?slug=${slug}&_embed=true`
      );
      const posts: WordPressPost[] = await response.json();
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  static async getFeaturedMedia(mediaId: number): Promise<WordPressMedia | null> {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') return null;
    try {
      if (!this.ENABLE_CMS) return null;
      const response = await this.fetchWithErrorHandling(
        `${this.CMS_BASE_URL}/media/${mediaId}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching media:', error);
      return null;
    }
  }

  // ===================================
  // SHOP PRODUCTS METHODS (WooCommerce)
  // ===================================

  static async getProducts(
    page: number = 1,
    perPage: number = this.DEFAULT_PER_PAGE,
    category?: string,
    search?: string,
    featured?: boolean,
    onSale?: boolean
  ): Promise<ProductsResponse> {
    try {
      // Hard Mock Return
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        console.log('Returning MOCK products');
        const mockProducts: WooCommerceProduct[] = [
          {
            id: 101,
            name: 'E-book: Anatomia dla studentów',
            slug: 'ebook-anatomia',
            permalink: '/produkt/ebook-anatomia',
            date_created: new Date().toISOString(),
            date_created_gmt: new Date().toISOString(),
            date_modified: new Date().toISOString(),
            date_modified_gmt: new Date().toISOString(),
            type: 'simple',
            status: 'publish',
            featured: true,
            catalog_visibility: 'visible',
            description: '<p>Kompletny przewodnik po anatomii...</p>',
            short_description: 'Niezbędnik każdego studenta medycyny.',
            sku: 'EBOOK-001',
            price: '49.99',
            regular_price: '69.99',
            sale_price: '49.99',
            date_on_sale_from: null,
            date_on_sale_from_gmt: null,
            date_on_sale_to: null,
            date_on_sale_to_gmt: null,
            price_html: '<span class="amount">49.99 zł</span>',
            on_sale: true,
            purchasable: true,
            total_sales: 150,
            virtual: true,
            downloadable: true,
            downloads: [],
            download_limit: -1,
            download_expiry: -1,
            external_url: '',
            button_text: '',
            tax_status: 'taxable',
            tax_class: '',
            manage_stock: false,
            stock_quantity: null,
            stock_status: 'instock',
            backorders: 'no',
            backorders_allowed: false,
            backordered: false,
            sold_individually: false,
            weight: '',
            dimensions: { length: '', width: '', height: '' },
            shipping_required: false,
            shipping_taxable: false,
            shipping_class: '',
            shipping_class_id: 0,
            reviews_allowed: true,
            average_rating: '4.8',
            rating_count: 12,
            related_ids: [],
            upsell_ids: [],
            cross_sell_ids: [],
            parent_id: 0,
            purchase_note: '',
            categories: [{ id: 15, name: 'E-booki', slug: 'e-booki' }],
            tags: [],
            images: [{
              id: 102,
              date_created: new Date().toISOString(),
              date_created_gmt: new Date().toISOString(),
              date_modified: new Date().toISOString(),
              date_modified_gmt: new Date().toISOString(),
              src: 'https://placehold.co/600x400/38b6ff/ffffff?text=E-book+Anatomia',
              name: 'E-book Anatomia',
              alt: 'E-book Anatomia'
            }],
            attributes: [],
            default_attributes: [],
            variations: [],
            grouped_products: [],
            menu_order: 0,
            meta_data: []
          }
        ];
        return { products: mockProducts, totalPages: 1, totalProducts: 1, hasMore: false };
      }

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        status: 'publish'
      });

      if (category) {
        params.append('category', category);
      }

      if (search) {
        params.append('search', search);
      }

      if (featured !== undefined) {
        params.append('featured', featured.toString());
      }

      if (onSale !== undefined) {
        params.append('on_sale', onSale.toString());
      }

      // Note: WooCommerce API might require authentication
      // For now, we'll try public endpoints
      const response = await this.fetchWithErrorHandling(
        `${this.SHOP_BASE_URL}/products?${params.toString()}`
      );

      const products: WooCommerceProduct[] = await response.json();

      // Extract pagination info from headers
      const totalProducts = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const hasMore = page < totalPages;

      return {
        products,
        totalPages,
        totalProducts,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty response for graceful degradation
      return {
        products: [],
        totalPages: 0,
        totalProducts: 0,
        hasMore: false
      };
    }
  }

  static async getProduct(id: number): Promise<WooCommerceProduct | null> {
    try {
      const response = await this.fetchWithErrorHandling(
        `${this.SHOP_BASE_URL}/products/${id}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  static async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    try {
      const response = await this.fetchWithErrorHandling(
        `${this.SHOP_BASE_URL}/products?slug=${slug}`
      );
      const products: WooCommerceProduct[] = await response.json();
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  static stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  static formatDate(dateString: string, locale: string = 'pl-PL'): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  static getExcerpt(post: WordPressPost, maxLength: number = 200): string {
    // First try the excerpt field
    if (post.excerpt?.rendered) {
      const excerpt = this.stripHtmlTags(post.excerpt.rendered);
      return this.truncateText(excerpt, maxLength);
    }

    // Fallback to content
    if (post.content?.rendered) {
      const content = this.stripHtmlTags(post.content.rendered);
      return this.truncateText(content, maxLength);
    }

    return '';
  }

  static getFeaturedImageUrl(post: WordPressPost, _size: string = 'medium'): string | null {
    try {
      // WordPress embeds featured media when using _embed parameter
      if (post._links?.['wp:featuredmedia']) {
        // This would need to be resolved separately
        // For now, return null if we can't find embedded media
        return null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Test connection to WordPress APIs
  static async testConnections(): Promise<{ cms: boolean; shop: boolean }> {
    const results = {
      cms: false,
      shop: false
    };

    // Test CMS connection
    try {
      const response = await this.fetchWithErrorHandling(`${this.CMS_BASE_URL}/posts?per_page=1`);
      results.cms = response.ok;
    } catch (error) {
      console.warn('CMS connection test failed:', error);
    }

    // Test Shop connection
    try {
      const response = await this.fetchWithErrorHandling(`${this.SHOP_BASE_URL}/products?per_page=1`);
      results.shop = response.ok;
    } catch (error) {
      console.warn('Shop connection test failed:', error);
    }

    return results;
  }
}

export { WordPressService };
