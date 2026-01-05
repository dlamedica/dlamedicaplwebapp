import { EnhancedDrug, DrugSearchFilters, SearchResult } from '../types/drug';

export class DrugSearchService {
  private drugs: EnhancedDrug[] = [];
  private searchIndex: Map<string, Set<number>> = new Map();
  
  constructor(drugs: EnhancedDrug[]) {
    this.drugs = drugs;
    this.buildSearchIndex();
  }
  
  /**
   * Buduje indeks wyszukiwania dla szybkiego wyszukiwania
   */
  private buildSearchIndex() {
    this.searchIndex.clear();
    
    this.drugs.forEach((drug, index) => {
      // Indeksuj wszystkie terminy wyszukiwania
      drug.searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, new Set());
        }
        this.searchIndex.get(term)!.add(index);
      });
      
      // Indeksuj również fragmenty nazw (trigrams dla fuzzy search)
      const allNames = [drug.tradeName, drug.commonName, ...drug.activeSubstances].join(' ').toLowerCase();
      const trigrams = this.generateTrigrams(allNames);
      
      trigrams.forEach(trigram => {
        const key = `tri_${trigram}`;
        if (!this.searchIndex.has(key)) {
          this.searchIndex.set(key, new Set());
        }
        this.searchIndex.get(key)!.add(index);
      });
    });
  }
  
  /**
   * Generuje trigramy dla fuzzy search
   */
  private generateTrigrams(text: string): string[] {
    const trigrams: string[] = [];
    const cleanText = text.replace(/[^a-z0-9]/g, '');
    
    for (let i = 0; i <= cleanText.length - 3; i++) {
      trigrams.push(cleanText.substring(i, i + 3));
    }
    
    return trigrams;
  }
  
  /**
   * Wyszukiwanie fuzzy oparte na podobieństwie
   */
  private fuzzySearch(query: string): { drugIndex: number; score: number }[] {
    const queryTrigrams = this.generateTrigrams(query.toLowerCase());
    const candidateScores = new Map<number, number>();
    
    // Znajdź kandydatów na podstawie trigramów
    queryTrigrams.forEach(trigram => {
      const key = `tri_${trigram}`;
      const drugIndices = this.searchIndex.get(key);
      
      if (drugIndices) {
        drugIndices.forEach(drugIndex => {
          const currentScore = candidateScores.get(drugIndex) || 0;
          candidateScores.set(drugIndex, currentScore + 1);
        });
      }
    });
    
    // Oblicz ostateczne wyniki similarity
    const results: { drugIndex: number; score: number }[] = [];
    
    candidateScores.forEach((trigramMatches, drugIndex) => {
      const drug = this.drugs[drugIndex];
      let maxScore = 0;
      
      // Sprawdź podobieństwo do każdego pola
      const fieldsToCheck = [drug.tradeName, drug.commonName, ...drug.activeSubstances];
      
      fieldsToCheck.forEach(field => {
        if (field) {
          const similarity = this.calculateSimilarity(query.toLowerCase(), field.toLowerCase());
          maxScore = Math.max(maxScore, similarity);
        }
      });
      
      // Bonus za exact match
      if (fieldsToCheck.some(field => field.toLowerCase().includes(query.toLowerCase()))) {
        maxScore += 0.3;
      }
      
      // Bonus za matching na początku nazwy
      if (fieldsToCheck.some(field => field.toLowerCase().startsWith(query.toLowerCase()))) {
        maxScore += 0.5;
      }
      
      if (maxScore > 0.3) { // Threshold dla relevance
        results.push({ drugIndex, score: Math.min(maxScore, 1) });
      }
    });
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Oblicza podobieństwo Jaccard między dwoma stringami
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const trigrams1 = new Set(this.generateTrigrams(str1));
    const trigrams2 = new Set(this.generateTrigrams(str2));
    
    const intersection = new Set([...trigrams1].filter(x => trigrams2.has(x)));
    const union = new Set([...trigrams1, ...trigrams2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }
  
  /**
   * Wyszukiwanie exact match
   */
  private exactSearch(query: string): number[] {
    const results = new Set<number>();
    const queryLower = query.toLowerCase();
    
    // Szukaj w indeksie
    this.searchIndex.forEach((drugIndices, term) => {
      if (term.includes(queryLower)) {
        drugIndices.forEach(index => results.add(index));
      }
    });
    
    return Array.from(results);
  }
  
  /**
   * Główna funkcja wyszukiwania
   */
  search(filters: DrugSearchFilters): SearchResult {
    let candidateIndices: number[] = [];
    
    // Wyszukiwanie tekstowe
    if (filters.query.trim()) {
      const query = filters.query.trim();
      
      // Najpierw spróbuj exact match
      const exactMatches = this.exactSearch(query);
      
      if (exactMatches.length > 0) {
        candidateIndices = exactMatches;
      } else {
        // Jeśli brak exact match, użyj fuzzy search
        const fuzzyResults = this.fuzzySearch(query);
        candidateIndices = fuzzyResults.map(r => r.drugIndex);
      }
    } else {
      // Bez query, zwróć wszystkie leki
      candidateIndices = Array.from({ length: this.drugs.length }, (_, i) => i);
    }
    
    // Filtruj według innych kryteriów
    const filteredDrugs = candidateIndices
      .map(index => this.drugs[index])
      .filter(drug => this.applyFilters(drug, filters));
    
    // Generuj facets
    const facets = this.generateFacets(filteredDrugs);
    
    return {
      drugs: filteredDrugs,
      totalCount: filteredDrugs.length,
      facets
    };
  }
  
  /**
   * Stosuje filtry do leku
   */
  private applyFilters(drug: EnhancedDrug, filters: DrugSearchFilters): boolean {
    // Filtr postaci farmaceutycznej
    if (filters.pharmaceuticalForm && 
        !drug.pharmaceuticalForm.toLowerCase().includes(filters.pharmaceuticalForm.toLowerCase())) {
      return false;
    }
    
    // Filtr drogi podania
    if (filters.administrationRoute && 
        drug.administrationRouteGroup !== filters.administrationRoute) {
      return false;
    }
    
    // Filtr typu recepty
    if (filters.prescriptionType && filters.prescriptionType.length > 0) {
      const hasMatchingPackage = drug.packages.some(pkg => 
        filters.prescriptionType!.includes(pkg.prescriptionType)
      );
      if (!hasMatchingPackage) return false;
    }
    
    // Filtr grupy ATC
    if (filters.atcGroup && 
        !drug.atcCode.code.startsWith(filters.atcGroup)) {
      return false;
    }
    
    // Filtr producenta
    if (filters.manufacturer && 
        !drug.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())) {
      return false;
    }
    
    // Filtr substancji czynnej
    if (filters.activeSubstance) {
      const hasMatchingSubstance = drug.activeSubstances.some(substance =>
        substance.toLowerCase().includes(filters.activeSubstance!.toLowerCase())
      );
      if (!hasMatchingSubstance) return false;
    }
    
    // Filtr refundacji
    if (filters.onlyRefunded) {
      const hasRefundedPackage = drug.packages.some(pkg => 
        pkg.refundationStatus === 'refunded' || pkg.refundationStatus === 'partial'
      );
      if (!hasRefundedPackage) return false;
    }
    
    return true;
  }
  
  /**
   * Generuje facets dla filtrowania
   */
  private generateFacets(drugs: EnhancedDrug[]) {
    const pharmaceuticalForms = new Map<string, number>();
    const administrationRoutes = new Map<string, number>();
    const manufacturers = new Map<string, number>();
    const atcGroups = new Map<string, number>();
    
    drugs.forEach(drug => {
      // Postaci farmaceutyczne
      const form = drug.pharmaceuticalForm;
      pharmaceuticalForms.set(form, (pharmaceuticalForms.get(form) || 0) + 1);
      
      // Drogi podania
      const route = drug.administrationRouteGroup;
      administrationRoutes.set(route, (administrationRoutes.get(route) || 0) + 1);
      
      // Producenci
      const manufacturer = drug.manufacturer;
      manufacturers.set(manufacturer, (manufacturers.get(manufacturer) || 0) + 1);
      
      // Grupy ATC
      const atcGroup = drug.atcCode.level1;
      const atcName = drug.atcCode.description;
      const key = `${atcGroup} - ${atcName}`;
      atcGroups.set(key, (atcGroups.get(key) || 0) + 1);
    });
    
    return {
      pharmaceuticalForms: Array.from(pharmaceuticalForms.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
        
      administrationRoutes: Array.from(administrationRoutes.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
        
      manufacturers: Array.from(manufacturers.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50),
        
      atcGroups: Array.from(atcGroups.entries())
        .map(([nameWithCode, count]) => {
          const [code, name] = nameWithCode.split(' - ');
          return { code, name, count };
        })
        .sort((a, b) => b.count - a.count)
    };
  }
  
  /**
   * Zwraca sugestie dla autocomplete
   */
  getSuggestions(query: string, limit: number = 10): string[] {
    if (query.length < 2) return [];
    
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();
    
    this.drugs.forEach(drug => {
      // Sprawdź nazwy handlowe
      if (drug.tradeName.toLowerCase().includes(queryLower)) {
        suggestions.add(drug.tradeName);
      }
      
      // Sprawdź nazwy powszechnie stosowane
      if (drug.commonName.toLowerCase().includes(queryLower)) {
        suggestions.add(drug.commonName);
      }
      
      // Sprawdź substancje czynne
      drug.activeSubstances.forEach(substance => {
        if (substance.toLowerCase().includes(queryLower)) {
          suggestions.add(substance);
        }
      });
    });
    
    return Array.from(suggestions)
      .sort((a, b) => {
        // Sortuj według relevance - im wcześniej match, tym wyżej
        const aIndex = a.toLowerCase().indexOf(queryLower);
        const bIndex = b.toLowerCase().indexOf(queryLower);
        
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        
        return a.length - b.length; // Krótsze nazwy wyżej
      })
      .slice(0, limit);
  }
}