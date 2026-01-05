interface IconScoutIcon {
  id: string;
  name: string;
  urls: {
    svg: string;
    png: string;
  };
  tags: string[];
}

interface IconScoutSearchResult {
  icons: IconScoutIcon[];
  total: number;
  page: number;
  per_page: number;
}

export class IconScoutService {
  private static readonly BASE_URL = 'https://api.iconscout.com/v3';
  private static readonly CLIENT_ID = import.meta.env.VITE_ICONSCOUT_CLIENT_ID;

  static async searchIcons(query: string, page: number = 1, perPage: number = 20): Promise<IconScoutSearchResult> {
    if (!this.CLIENT_ID || this.CLIENT_ID === 'disabled') {
      throw new Error('IconScout Client ID is not configured');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
        headers: {
          'Client-ID': this.CLIENT_ID,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`IconScout API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        icons: data.icons || [],
        total: data.total || 0,
        page: data.page || 1,
        per_page: data.per_page || perPage
      };
    } catch (error) {
      console.error('IconScout search error:', error);
      throw error;
    }
  }

  static async getIcon(iconId: string): Promise<IconScoutIcon> {
    if (!this.CLIENT_ID || this.CLIENT_ID === 'disabled') {
      throw new Error('IconScout Client ID is not configured');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/icons/${iconId}`, {
        headers: {
          'Client-ID': this.CLIENT_ID,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`IconScout API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('IconScout get icon error:', error);
      throw error;
    }
  }

  static isConfigured(): boolean {
    return !!(this.CLIENT_ID && this.CLIENT_ID !== 'disabled');
  }
}