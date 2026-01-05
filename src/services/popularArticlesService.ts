export interface PopularityMetrics {
  id: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  readTime: number; // czas spędzony czytając artykuł w sekundach
  popularityScore: number;
  lastUpdated: string;
}

export class PopularArticlesService {
  private static popularityData: Map<number, PopularityMetrics> = new Map();

  // Oblicza wynik popularności na podstawie różnych metryk
  static calculatePopularityScore(metrics: Omit<PopularityMetrics, 'popularityScore' | 'lastUpdated'>): number {
    const { views, likes, shares, comments, readTime } = metrics;
    
    // Wagi dla różnych metryk
    const weights = {
      views: 1,
      likes: 3,
      shares: 5,
      comments: 4,
      readTime: 0.01 // 1 punkt za każde 100 sekund czytania
    };

    const score = 
      (views * weights.views) +
      (likes * weights.likes) +
      (shares * weights.shares) +
      (comments * weights.comments) +
      (readTime * weights.readTime);

    return Math.round(score);
  }

  // Aktualizuje metryki popularności dla artykułu
  static updateArticleMetrics(articleId: number, metrics: Partial<Omit<PopularityMetrics, 'id' | 'popularityScore' | 'lastUpdated'>>): void {
    const current = this.popularityData.get(articleId) || {
      id: articleId,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      readTime: 0,
      popularityScore: 0,
      lastUpdated: new Date().toISOString()
    };

    const updated = {
      ...current,
      ...metrics,
      lastUpdated: new Date().toISOString()
    };

    updated.popularityScore = this.calculatePopularityScore(updated);
    this.popularityData.set(articleId, updated);
    
    // Zapisz do localStorage
    this.saveToStorage();
  }

  // Zwiększa liczbę wyświetleń artykułu
  static incrementViews(articleId: number): void {
    const current = this.getArticleMetrics(articleId);
    this.updateArticleMetrics(articleId, {
      views: current.views + 1
    });
  }

  // Zwiększa liczbę polubień
  static incrementLikes(articleId: number): void {
    const current = this.getArticleMetrics(articleId);
    this.updateArticleMetrics(articleId, {
      likes: current.likes + 1
    });
  }

  // Zwiększa liczbę udostępnień
  static incrementShares(articleId: number): void {
    const current = this.getArticleMetrics(articleId);
    this.updateArticleMetrics(articleId, {
      shares: current.shares + 1
    });
  }

  // Zwiększa liczbę komentarzy
  static incrementComments(articleId: number): void {
    const current = this.getArticleMetrics(articleId);
    this.updateArticleMetrics(articleId, {
      comments: current.comments + 1
    });
  }

  // Dodaje czas czytania
  static addReadTime(articleId: number, seconds: number): void {
    const current = this.getArticleMetrics(articleId);
    this.updateArticleMetrics(articleId, {
      readTime: current.readTime + seconds
    });
  }

  // Pobiera metryki popularności dla artykułu
  static getArticleMetrics(articleId: number): PopularityMetrics {
    return this.popularityData.get(articleId) || {
      id: articleId,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      readTime: 0,
      popularityScore: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Sortuje artykuły według popularności
  static sortByPopularity<T extends { id: number }>(articles: T[]): T[] {
    return articles.sort((a, b) => {
      const aMetrics = this.getArticleMetrics(a.id);
      const bMetrics = this.getArticleMetrics(b.id);
      return bMetrics.popularityScore - aMetrics.popularityScore;
    });
  }

  // Pobiera najbardziej popularne artykuły
  static getMostPopular<T extends { id: number }>(articles: T[], limit: number = 10): T[] {
    return this.sortByPopularity(articles).slice(0, limit);
  }

  // Generuje przykładowe dane popularności dla demonstracji
  static generateSampleData(articleIds: number[]): void {
    articleIds.forEach((id, index) => {
      // Generuj losowe, ale realistyczne dane
      const basePopularity = Math.max(0, 100 - (index * 10)); // Pierwszy artykuł najbardziej popularny
      
      this.updateArticleMetrics(id, {
        views: Math.floor(Math.random() * 1000) + basePopularity * 10,
        likes: Math.floor(Math.random() * 50) + basePopularity,
        shares: Math.floor(Math.random() * 20) + Math.floor(basePopularity / 2),
        comments: Math.floor(Math.random() * 30) + Math.floor(basePopularity / 3),
        readTime: Math.floor(Math.random() * 300) + basePopularity * 5
      });
    });
  }

  // Zapisuje dane do localStorage
  private static saveToStorage(): void {
    const data = Object.fromEntries(this.popularityData);
    localStorage.setItem('articlePopularityMetrics', JSON.stringify(data));
  }

  // Wczytuje dane z localStorage
  static loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('articlePopularityMetrics');
      if (stored) {
        const data = JSON.parse(stored);
        this.popularityData = new Map(Object.entries(data).map(([k, v]) => [parseInt(k), v as PopularityMetrics]));
      }
    } catch (error) {
      console.warn('Nie udało się wczytać danych popularności artykułów:', error);
    }
  }

  // Inicjalizuje serwis
  static initialize(): void {
    this.loadFromStorage();
    console.log('📊 Serwis popularności artykułów został zainicjalizowany');
  }

  // Czyści wszystkie dane popularności
  static clearAllData(): void {
    this.popularityData.clear();
    localStorage.removeItem('articlePopularityMetrics');
  }

  // Zwraca wszystkie dane popularności
  static getAllMetrics(): PopularityMetrics[] {
    return Array.from(this.popularityData.values());
  }

  // Zwraca top N artykułów według określonej metryki
  static getTopByMetric<T extends { id: number }>(
    articles: T[], 
    metric: keyof Pick<PopularityMetrics, 'views' | 'likes' | 'shares' | 'comments'>,
    limit: number = 5
  ): T[] {
    return articles.sort((a, b) => {
      const aMetrics = this.getArticleMetrics(a.id);
      const bMetrics = this.getArticleMetrics(b.id);
      return bMetrics[metric] - aMetrics[metric];
    }).slice(0, limit);
  }
}