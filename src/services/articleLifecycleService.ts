export interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  publishedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'pending_deletion';
}

export class ArticleLifecycleService {
  private static readonly ARTICLE_LIFETIME_DAYS = 365;
  private static readonly WARNING_DAYS_BEFORE_DELETION = 7;
  private static deletionLog: Array<{
    id: number;
    title: string;
    deletedAt: string;
    reason: string;
  }> = [];

  // Oblicza datę wygaśnięcia artykułu (365 dni od publikacji)
  static calculateExpirationDate(publishedDate: string): string {
    const published = new Date(publishedDate);
    const expiration = new Date(published);
    expiration.setDate(published.getDate() + this.ARTICLE_LIFETIME_DAYS);
    return expiration.toISOString();
  }

  // Sprawdza, czy artykuł jest przeterminowany
  static isArticleExpired(publishedDate: string): boolean {
    const published = new Date(publishedDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays >= this.ARTICLE_LIFETIME_DAYS;
  }

  // Sprawdza, czy artykuł wymaga powiadomienia o nadchodzącej ekspiracji
  static needsExpirationWarning(publishedDate: string): boolean {
    const published = new Date(publishedDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilExpiration = this.ARTICLE_LIFETIME_DAYS - diffInDays;
    return daysUntilExpiration <= this.WARNING_DAYS_BEFORE_DELETION && daysUntilExpiration > 0;
  }

  // Filtruje aktywne artykuły (nieexpired)
  static filterActiveArticles(articles: Article[]): Article[] {
    return articles.filter(article => !this.isArticleExpired(article.publishedAt || article.date));
  }

  // Znajduje artykuły wymagające powiadomienia
  static getArticlesNeedingWarning(articles: Article[]): Article[] {
    return articles.filter(article => 
      this.needsExpirationWarning(article.publishedAt || article.date) && 
      !this.isArticleExpired(article.publishedAt || article.date)
    );
  }

  // Znajduje artykuły do usunięcia
  static getExpiredArticles(articles: Article[]): Article[] {
    return articles.filter(article => this.isArticleExpired(article.publishedAt || article.date));
  }

  // Symuluje codzienne uruchamianie procesu usuwania o 03:00
  static scheduleDailyCleanup(): void {
    const now = new Date();
    const next3AM = new Date();
    next3AM.setHours(3, 0, 0, 0);
    
    // Jeśli już minęła 03:00 dzisiaj, zaplanuj na jutro
    if (now > next3AM) {
      next3AM.setDate(next3AM.getDate() + 1);
    }

    const timeUntilCleanup = next3AM.getTime() - now.getTime();
    
    setTimeout(() => {
      this.performDailyCleanup();
      // Zaplanuj następne uruchomienie za 24 godziny
      setInterval(() => {
        this.performDailyCleanup();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilCleanup);

    console.log(`Następne automatyczne czyszczenie artykułów zaplanowane na: ${next3AM.toLocaleString('pl-PL')}`);
  }

  // Wykonuje codzienne czyszczenie
  private static performDailyCleanup(): void {
    const articles = this.loadArticlesFromStorage();
    const expiredArticles = this.getExpiredArticles(articles);
    const warningArticles = this.getArticlesNeedingWarning(articles);

    // Wysyłaj powiadomienia o nadchodzącej ekspiracji
    if (warningArticles.length > 0) {
      this.sendExpirationWarnings(warningArticles);
    }

    // Usuń przeterminowane artykuły
    if (expiredArticles.length > 0) {
      this.deleteExpiredArticles(expiredArticles);
    }

    console.log(`Codzienne czyszczenie wykonane: ${new Date().toLocaleString('pl-PL')}`);
    console.log(`- Usunięto artykułów: ${expiredArticles.length}`);
    console.log(`- Wysłano powiadomień: ${warningArticles.length}`);
  }

  // Wysyła powiadomienia administratorom o nadchodzącej ekspiracji
  private static sendExpirationWarnings(articles: Article[]): void {
    const message = `POWIADOMIENIE: ${articles.length} artykułów zostanie automatycznie usuniętych w ciągu 7 dni:\\n\\n${articles.map(a => `- ${a.title} (opublikowany: ${new Date(a.publishedAt || a.date).toLocaleDateString('pl-PL')})`).join('\\n')}`;
    
    // Symulacja wysłania emaila do administratora
    console.warn('📧 POWIADOMIENIE DLA ADMINISTRATORA:', message);
    
    // W rzeczywistej aplikacji można użyć serwisu emailowego
    // await EmailService.sendAdminNotification(message);
  }

  // Usuwa przeterminowane artykuły i loguje akcję
  private static deleteExpiredArticles(articles: Article[]): void {
    const deletedAt = new Date().toISOString();
    
    articles.forEach(article => {
      this.deletionLog.push({
        id: article.id,
        title: article.title,
        deletedAt,
        reason: `Automatyczne usunięcie po ${this.ARTICLE_LIFETIME_DAYS} dniach od publikacji`
      });
      
      // Symulacja usunięcia z bazy danych
      console.log(`🗑️ Usunięto artykuł: "${article.title}" (ID: ${article.id})`);
    });
    
    // Zapisz log do localStorage lub wyślij do API
    this.saveDeletionLog();
  }

  // Zwraca log usuniętych artykułów
  static getDeletionLog(): Array<{id: number, title: string, deletedAt: string, reason: string}> {
    return [...this.deletionLog];
  }

  // Czyści log usuniętych artykułów
  static clearDeletionLog(): void {
    this.deletionLog = [];
    localStorage.removeItem('articleDeletionLog');
  }

  // Zapisuje log do localStorage
  private static saveDeletionLog(): void {
    localStorage.setItem('articleDeletionLog', JSON.stringify(this.deletionLog));
  }

  // Wczytuje log z localStorage
  static loadDeletionLog(): void {
    const saved = localStorage.getItem('articleDeletionLog');
    if (saved) {
      this.deletionLog = JSON.parse(saved);
    }
  }

  // Symuluje wczytanie artykułów z magazynu danych
  private static loadArticlesFromStorage(): Article[] {
    // W rzeczywistej aplikacji można to połączyć z API lub bazą danych
    try {
      const articlesData = localStorage.getItem('articles');
      return articlesData ? JSON.parse(articlesData) : [];
    } catch {
      return [];
    }
  }

  // Inicjalizuje serwis zarządzania cyklem życia artykułów
  static initialize(): void {
    this.loadDeletionLog();
    this.scheduleDailyCleanup();
    console.log('🔄 Serwis zarządzania cyklem życia artykułów został zainicjalizowany');
  }

  // Sprawdza status artykułu
  static getArticleStatus(publishedDate: string): 'active' | 'warning' | 'expired' {
    if (this.isArticleExpired(publishedDate)) {
      return 'expired';
    }
    if (this.needsExpirationWarning(publishedDate)) {
      return 'warning';
    }
    return 'active';
  }

  // Zwraca liczbę dni do ekspiracji
  static getDaysUntilExpiration(publishedDate: string): number {
    const published = new Date(publishedDate);
    const expiration = new Date(published);
    expiration.setDate(published.getDate() + this.ARTICLE_LIFETIME_DAYS);
    const now = new Date();
    const diffInDays = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffInDays);
  }
}