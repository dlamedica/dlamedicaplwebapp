/**
 * Spaced Repetition System (SRS) Service
 * Implementacja algorytmu SM-2 (SuperMemo 2) - podobny do Anki
 */

export interface SRSProgress {
  id: string;
  userId: string;
  cardId: string;
  easeFactor: number; // Współczynnik łatwości (domyślnie 2.5)
  interval: number; // Interwał w dniach
  repetitions: number; // Liczba powtórek
  nextReview: Date; // Data następnej powtórki
  lastReview?: Date; // Data ostatniej powtórki
  reviewCount: number; // Całkowita liczba powtórek
  correctCount: number; // Liczba poprawnych odpowiedzi
  incorrectCount: number; // Liczba niepoprawnych odpowiedzi
  streak: number; // Seria poprawnych odpowiedzi
  quality: number; // Jakość ostatniej odpowiedzi (0-5)
}

export interface ReviewResult {
  quality: number; // 0-5 (0=zapomniałem, 5=łatwe)
  newInterval: number;
  newEaseFactor: number;
  newRepetitions: number;
  nextReview: Date;
}

/**
 * Algorytm SM-2 do obliczania interwałów powtórek
 * 
 * @param progress - Aktualny postęp fiszki
 * @param quality - Jakość odpowiedzi (0-5)
 * @returns Nowy stan postępu
 */
export function calculateSRS(
  progress: SRSProgress,
  quality: number
): ReviewResult {
  let { easeFactor, interval, repetitions } = progress;

  // Jakość odpowiedzi (0-5)
  // 0 = Zapomniałem / Błędna odpowiedź
  // 1 = Bardzo trudne
  // 2 = Trudne
  // 3 = Dobrze
  // 4 = Łatwe
  // 5 = Bardzo łatwe

  if (quality < 3) {
    // Błędna odpowiedź - reset
    repetitions = 0;
    interval = 1;
    // Zmniejsz ease factor (minimum 1.3)
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else {
    // Poprawna odpowiedź
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    repetitions += 1;

    // Aktualizuj ease factor na podstawie jakości
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor); // Minimum 1.3
  }

  // Oblicz datę następnej powtórki
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    quality,
    newInterval: interval,
    newEaseFactor: easeFactor,
    newRepetitions: repetitions,
    nextReview,
  };
}

/**
 * Inicjalizacja nowego postępu SRS dla fiszki
 */
export function initializeSRSProgress(
  userId: string,
  cardId: string
): SRSProgress {
  return {
    id: `${userId}-${cardId}`,
    userId,
    cardId,
    easeFactor: 2.5, // Domyślny współczynnik łatwości
    interval: 1, // Pierwsza powtórka za 1 dzień
    repetitions: 0, // Brak powtórek
    nextReview: new Date(), // Do powtórki dzisiaj
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    quality: 0,
  };
}

/**
 * Pobierz fiszki do powtórki (due cards)
 */
export function getDueCards(
  allProgress: SRSProgress[],
  maxCards: number = 20
): SRSProgress[] {
  const now = new Date();
  
  return allProgress
    .filter(progress => {
      const nextReview = new Date(progress.nextReview);
      return nextReview <= now;
    })
    .sort((a, b) => {
      // Sortuj po dacie następnej powtórki (najstarsze pierwsze)
      const dateA = new Date(a.nextReview).getTime();
      const dateB = new Date(b.nextReview).getTime();
      return dateA - dateB;
    })
    .slice(0, maxCards);
}

/**
 * Pobierz nowe fiszki (new cards)
 */
export function getNewCards(
  allCards: string[],
  allProgress: SRSProgress[],
  maxCards: number = 20
): string[] {
  const reviewedCardIds = new Set(allProgress.map(p => p.cardId));
  
  return allCards
    .filter(cardId => !reviewedCardIds.has(cardId))
    .slice(0, maxCards);
}

/**
 * Oblicz statystyki SRS
 */
export interface SRSStats {
  totalCards: number;
  newCards: number;
  learningCards: number; // W trakcie nauki (repetitions < 3)
  reviewCards: number; // Do powtórki
  masteredCards: number; // Opanowane (interval > 30 dni)
  averageEaseFactor: number;
  retentionRate: number; // Wskaźnik retencji (correct / total)
  cardsDueToday: number;
  cardsDueTomorrow: number;
  cardsDueThisWeek: number;
}

export function calculateSRSStats(
  allProgress: SRSProgress[],
  totalCards: number
): SRSStats {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const reviewedCards = allProgress.length;
  const newCards = totalCards - reviewedCards;

  const learningCards = allProgress.filter(p => p.repetitions < 3).length;
  const masteredCards = allProgress.filter(p => p.interval > 30).length;

  const dueToday = allProgress.filter(p => {
    const nextReview = new Date(p.nextReview);
    return nextReview <= now;
  }).length;

  const dueTomorrow = allProgress.filter(p => {
    const nextReview = new Date(p.nextReview);
    return nextReview > now && nextReview <= tomorrow;
  }).length;

  const dueThisWeek = allProgress.filter(p => {
    const nextReview = new Date(p.nextReview);
    return nextReview > now && nextReview <= nextWeek;
  }).length;

  const totalReviews = allProgress.reduce((sum, p) => sum + p.reviewCount, 0);
  const totalCorrect = allProgress.reduce((sum, p) => sum + p.correctCount, 0);
  const retentionRate = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;

  const averageEaseFactor = allProgress.length > 0
    ? allProgress.reduce((sum, p) => sum + p.easeFactor, 0) / allProgress.length
    : 2.5;

  return {
    totalCards,
    newCards,
    learningCards,
    reviewCards: dueToday,
    masteredCards,
    averageEaseFactor,
    retentionRate,
    cardsDueToday: dueToday,
    cardsDueTomorrow: dueTomorrow,
    cardsDueThisWeek: dueThisWeek,
  };
}

/**
 * Oblicz heatmap danych powtórek
 */
export interface HeatmapData {
  date: string; // YYYY-MM-DD
  count: number; // Liczba powtórek w danym dniu
  level: number; // Poziom intensywności (0-4)
}

export function calculateHeatmap(
  allProgress: SRSProgress[],
  days: number = 365
): HeatmapData[] {
  const heatmap: Map<string, number> = new Map();
  const now = new Date();

  // Zbierz wszystkie daty powtórek
  allProgress.forEach(progress => {
    if (progress.lastReview) {
      const reviewDate = new Date(progress.lastReview);
      const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < days) {
        const dateKey = reviewDate.toISOString().split('T')[0];
        const currentCount = heatmap.get(dateKey) || 0;
        heatmap.set(dateKey, currentCount + 1);
      }
    }
  });

  // Generuj wszystkie dni
  const result: HeatmapData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const count = heatmap.get(dateKey) || 0;
    
    // Oblicz poziom (0-4)
    let level = 0;
    if (count > 0) level = 1;
    if (count >= 5) level = 2;
    if (count >= 10) level = 3;
    if (count >= 20) level = 4;

    result.push({ date: dateKey, count, level });
  }

  return result;
}

/**
 * Eksport do formatu Anki
 */
export interface AnkiCard {
  front: string;
  back: string;
  tags?: string[];
}

export function exportToAnkiFormat(
  cards: Array<{ front: string; back: string; tags?: string[] }>
): string {
  // Format TSV (Tab-Separated Values) - kompatybilny z Anki
  const lines = cards.map(card => {
    const front = card.front.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const back = card.back.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const tags = card.tags ? card.tags.join(' ') : '';
    return `${front}\t${back}\t${tags}`;
  });

  return lines.join('\n');
}

/**
 * Import z formatu Anki
 */
export function importFromAnkiFormat(content: string): AnkiCard[] {
  const lines = content.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    const parts = line.split('\t');
    if (parts.length < 2) {
      throw new Error('Invalid Anki format: each line must have at least 2 columns');
    }

    const front = parts[0].replace(/<br>/g, '\n');
    const back = parts[1].replace(/<br>/g, '\n');
    const tags = parts[2] ? parts[2].split(' ').filter(t => t.trim()) : [];

    return { front, back, tags };
  });
}

/**
 * Oblicz optymalną liczbę nowych kart dziennie
 */
export function calculateOptimalNewCards(
  stats: SRSStats,
  maxNewCards: number = 20
): number {
  // Jeśli masz dużo kart do powtórki, zmniejsz nowe karty
  if (stats.cardsDueToday > 50) {
    return Math.max(5, Math.floor(maxNewCards * 0.5));
  }
  
  if (stats.cardsDueToday > 30) {
    return Math.max(10, Math.floor(maxNewCards * 0.75));
  }

  return maxNewCards;
}

/**
 * Oblicz szacowany czas sesji
 */
export function estimateSessionTime(
  newCards: number,
  reviewCards: number,
  secondsPerCard: number = 10
): number {
  // Nowe karty zajmują więcej czasu (2x)
  const newCardsTime = newCards * secondsPerCard * 2;
  const reviewCardsTime = reviewCards * secondsPerCard;
  
  return Math.ceil((newCardsTime + reviewCardsTime) / 60); // w minutach
}

