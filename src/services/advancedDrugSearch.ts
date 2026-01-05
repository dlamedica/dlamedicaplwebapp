import { EnhancedDrug, DrugSearchFilters, SearchResult, DrugStatistics } from '../types/drug';
import Fuse from 'fuse.js';
import { drugSubstitutesService } from './drugSubstitutesService';

export class AdvancedDrugSearchService {
  private drugs: EnhancedDrug[];
  private fuseIndex: Fuse<EnhancedDrug>;
  private statistics: DrugStatistics;
  private atcHierarchy: Map<string, { name: string; parent?: string }>;
  
  constructor(drugs: EnhancedDrug[]) {
    this.drugs = drugs;
    this.statistics = this.calculateStatistics();
    this.atcHierarchy = this.buildATCHierarchy();
    
    // Konfiguracja Fuse.js dla inteligentnego wyszukiwania
    const fuseOptions = {
      keys: [
        { name: 'tradeName', weight: 2.0 },
        { name: 'commonName', weight: 1.8 },
        { name: 'activeSubstances', weight: 1.5 },
        { name: 'marketingAuthorization', weight: 0.8 },
        { name: 'atcCodeRaw', weight: 0.7 },
        { name: 'searchTerms', weight: 1.2 },
        { name: 'pharmaceuticalForm', weight: 0.5 },
        { name: 'therapeuticGroup', weight: 0.6 }
      ],
      threshold: 0.3, // Tolerancja błędów
      location: 0,
      distance: 100,
      minMatchCharLength: 2,
      shouldSort: true,
      includeScore: true,
      findAllMatches: true,
      ignoreLocation: false,
      useExtendedSearch: true
    };
    
    this.fuseIndex = new Fuse(drugs, fuseOptions);
  }
  
  /**
   * Zaawansowane wyszukiwanie leków z filtrami
   */
  public search(filters: DrugSearchFilters): SearchResult {
    let results = [...this.drugs];
    
    // 1. Wyszukiwanie tekstowe
    if (filters.query && filters.query.trim()) {
      const searchResults = this.performTextSearch(filters.query);
      results = searchResults;
    }
    
    // 2. Filtrowanie po formie farmaceutycznej
    if (filters.pharmaceuticalForm && filters.pharmaceuticalForm.length > 0) {
      results = results.filter(drug => 
        filters.pharmaceuticalForm!.includes(drug.pharmaceuticalForm)
      );
    }
    
    // 3. Filtrowanie po drodze podania
    if (filters.administrationRoute && filters.administrationRoute.length > 0) {
      results = results.filter(drug =>
        filters.administrationRoute!.includes(drug.administrationRouteGroup)
      );
    }
    
    // 4. Filtrowanie po typie recepty
    if (filters.prescriptionType && filters.prescriptionType.length > 0) {
      results = results.filter(drug =>
        drug.packages.some(pkg => 
          filters.prescriptionType!.includes(pkg.prescriptionType)
        )
      );
    }
    
    // 5. Filtrowanie po grupie ATC
    if (filters.atcGroup) {
      results = this.filterByATCGroup(results, filters.atcGroup, filters.atcLevel);
    }
    
    // 6. Filtrowanie po producencie
    if (filters.manufacturer) {
      results = results.filter(drug =>
        drug.marketingAuthorization.toLowerCase().includes(filters.manufacturer!.toLowerCase()) ||
        drug.manufacturingInfo.manufacturer?.toLowerCase().includes(filters.manufacturer!.toLowerCase())
      );
    }
    
    // 7. Filtrowanie po substancji czynnej
    if (filters.activeSubstance) {
      results = results.filter(drug =>
        drug.activeSubstances.some(substance =>
          substance.toLowerCase().includes(filters.activeSubstance!.toLowerCase())
        )
      );
    }
    
    // 8. Filtrowanie po statusie refundacji
    if (filters.refundationStatus && filters.refundationStatus !== 'all') {
      results = results.filter(drug => {
        const hasRefundation = drug.packages.some(pkg =>
          pkg.refundationStatus === 'refunded' || pkg.refundationStatus === 'partial'
        );
        
        if (filters.refundationStatus === 'refunded') {
          return hasRefundation;
        } else if (filters.refundationStatus === 'none') {
          return !hasRefundation;
        }
        return true;
      });
    }
    
    // 9. Filtrowanie po typie preparatu
    if (filters.preparationType && filters.preparationType !== 'all') {
      results = results.filter(drug => {
        if (filters.preparationType === 'human') {
          return drug.preparationType.toLowerCase().includes('ludzki');
        } else if (filters.preparationType === 'veterinary') {
          return drug.preparationType.toLowerCase().includes('weterynaryjny');
        }
        return true;
      });
    }
    
    // 10. Filtrowanie po materiałach edukacyjnych
    if (filters.hasEducationalMaterials) {
      results = results.filter(drug =>
        drug.documents.educationalToolsHCP || drug.documents.educationalToolsPatient
      );
    }
    
    // 11. Filtrowanie po statusie rejestracji
    if (filters.registrationStatus && filters.registrationStatus !== 'all') {
      results = results.filter(drug => drug.status === filters.registrationStatus);
    }
    
    // 12. Filtrowanie po kraju
    if (filters.country) {
      results = results.filter(drug => {
        const info = drug.manufacturingInfo;
        return (
          info.manufacturerCountry?.toLowerCase().includes(filters.country!.toLowerCase()) ||
          info.importerCountry?.toLowerCase().includes(filters.country!.toLowerCase()) ||
          info.exportCountry?.toLowerCase().includes(filters.country!.toLowerCase())
        );
      });
    }
    
    // 13. Filtrowanie po typie procedury
    if (filters.procedureType && filters.procedureType.length > 0) {
      results = results.filter(drug =>
        filters.procedureType!.includes(drug.procedureType)
      );
    }
    
    // Oblicz fasety (agregacje) dla wyników
    const facets = this.calculateFacets(results);
    
    // Sugestie dla błędnie wpisanych nazw
    const suggestions = this.generateSuggestions(filters.query, results);
    
    return {
      drugs: results,
      totalCount: results.length,
      facets,
      suggestions
    };
  }
  
  /**
   * Wyszukiwanie tekstowe z obsługą błędów i synonimów
   */
  private performTextSearch(query: string): EnhancedDrug[] {
    // Normalizuj zapytanie
    const normalizedQuery = this.normalizeQuery(query);
    
    // Sprawdź czy to kod ATC
    if (this.isATCCode(normalizedQuery)) {
      return this.searchByATCCode(normalizedQuery);
    }
    
    // Sprawdź czy to numer EAN
    if (this.isEAN(normalizedQuery)) {
      return this.searchByEAN(normalizedQuery);
    }
    
    // Użyj Fuse.js dla wyszukiwania rozmytego
    const fuseResults = this.fuseIndex.search(normalizedQuery);
    
    // Sortuj wyniki według score i popularności
    const scoredResults = fuseResults
      .map(result => ({
        drug: result.item,
        score: result.score || 0,
        popularity: result.item.popularity || 0
      }))
      .sort((a, b) => {
        // Najpierw według score (niższy = lepszy)
        if (Math.abs(a.score - b.score) > 0.1) {
          return a.score - b.score;
        }
        // Potem według popularności
        return b.popularity - a.popularity;
      })
      .map(item => item.drug);
    
    return scoredResults;
  }
  
  /**
   * Normalizuje zapytanie wyszukiwania
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\sąćęłńóśźż-]/g, '') // Usuń znaki specjalne oprócz polskich
      .replace(/\s+/g, ' '); // Normalizuj spacje
  }
  
  /**
   * Sprawdza czy zapytanie to kod ATC
   */
  private isATCCode(query: string): boolean {
    const atcPattern = /^[A-Z]\d{2}[A-Z]{2}\d{2}$/i;
    return atcPattern.test(query);
  }
  
  /**
   * Sprawdza czy zapytanie to kod EAN
   */
  private isEAN(query: string): boolean {
    const eanPattern = /^\d{13}$/;
    return eanPattern.test(query);
  }
  
  /**
   * Wyszukuje po kodzie ATC
   */
  private searchByATCCode(atcCode: string): EnhancedDrug[] {
    const normalizedCode = atcCode.toUpperCase();
    return this.drugs.filter(drug => 
      drug.atcCodeRaw.startsWith(normalizedCode)
    );
  }
  
  /**
   * Wyszukuje po kodzie EAN
   */
  private searchByEAN(ean: string): EnhancedDrug[] {
    return this.drugs.filter(drug =>
      drug.packages.some(pkg => pkg.ean === ean)
    );
  }
  
  /**
   * Filtruje po grupie ATC z obsługą hierarchii
   */
  private filterByATCGroup(drugs: EnhancedDrug[], atcGroup: string, level?: number): EnhancedDrug[] {
    const normalizedGroup = atcGroup.toUpperCase();
    
    return drugs.filter(drug => {
      if (!drug.atcCodeRaw) return false;
      
      if (level) {
        // Filtruj według konkretnego poziomu
        switch (level) {
          case 1:
            return drug.atcCodeRaw.charAt(0) === normalizedGroup;
          case 2:
            return drug.atcCodeRaw.substring(0, 3) === normalizedGroup;
          case 3:
            return drug.atcCodeRaw.substring(0, 4) === normalizedGroup;
          case 4:
            return drug.atcCodeRaw.substring(0, 5) === normalizedGroup;
          case 5:
            return drug.atcCodeRaw === normalizedGroup;
          default:
            return drug.atcCodeRaw.startsWith(normalizedGroup);
        }
      }
      
      return drug.atcCodeRaw.startsWith(normalizedGroup);
    });
  }
  
  /**
   * Oblicza fasety (agregacje) dla wyników
   */
  private calculateFacets(drugs: EnhancedDrug[]): SearchResult['facets'] {
    const facets: SearchResult['facets'] = {
      pharmaceuticalForms: [],
      administrationRoutes: [],
      manufacturers: [],
      atcGroups: [],
      activeSubstances: [],
      prescriptionTypes: [],
      countries: []
    };
    
    // Mapy do zliczania
    const formsMap = new Map<string, number>();
    const routesMap = new Map<string, number>();
    const manufacturersMap = new Map<string, number>();
    const atcMap = new Map<string, { name: string; count: number }>();
    const substancesMap = new Map<string, number>();
    const prescriptionMap = new Map<string, number>();
    const countriesMap = new Map<string, number>();
    
    // Zliczaj wystąpienia
    drugs.forEach(drug => {
      // Formy farmaceutyczne
      if (drug.pharmaceuticalForm) {
        formsMap.set(drug.pharmaceuticalForm, (formsMap.get(drug.pharmaceuticalForm) || 0) + 1);
      }
      
      // Drogi podania
      const routeLabel = this.getAdministrationRouteLabel(drug.administrationRouteGroup);
      routesMap.set(routeLabel, (routesMap.get(routeLabel) || 0) + 1);
      
      // Producenci
      if (drug.marketingAuthorization) {
        manufacturersMap.set(drug.marketingAuthorization, 
          (manufacturersMap.get(drug.marketingAuthorization) || 0) + 1);
      }
      
      // Grupy ATC (poziom 1)
      if (drug.atcCodeRaw) {
        const level1 = drug.atcCodeRaw.charAt(0);
        const atcName = drug.atcCode.level1 || level1;
        const existing = atcMap.get(level1);
        if (existing) {
          existing.count++;
        } else {
          atcMap.set(level1, { name: atcName, count: 1 });
        }
      }
      
      // Substancje czynne
      drug.activeSubstances.forEach(substance => {
        substancesMap.set(substance, (substancesMap.get(substance) || 0) + 1);
      });
      
      // Typy recept
      drug.packages.forEach(pkg => {
        if (pkg.prescriptionType) {
          prescriptionMap.set(pkg.prescriptionType, 
            (prescriptionMap.get(pkg.prescriptionType) || 0) + 1);
        }
      });
      
      // Kraje
      const countries = [
        drug.manufacturingInfo.manufacturerCountry,
        drug.manufacturingInfo.importerCountry,
        drug.manufacturingInfo.exportCountry
      ].filter(Boolean);
      
      countries.forEach(country => {
        if (country) {
          countriesMap.set(country, (countriesMap.get(country) || 0) + 1);
        }
      });
    });
    
    // Konwertuj mapy na tablice i sortuj
    facets.pharmaceuticalForms = Array.from(formsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    facets.administrationRoutes = Array.from(routesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    facets.manufacturers = Array.from(manufacturersMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    facets.atcGroups = Array.from(atcMap.entries())
      .map(([code, data]) => ({ code, name: data.name, count: data.count }))
      .sort((a, b) => a.code.localeCompare(b.code));
    
    facets.activeSubstances = Array.from(substancesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
    
    facets.prescriptionTypes = Array.from(prescriptionMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    
    facets.countries = Array.from(countriesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    return facets;
  }
  
  /**
   * Generuje sugestie dla błędnie wpisanych nazw
   */
  private generateSuggestions(query?: string, results?: EnhancedDrug[]): string[] {
    if (!query || query.length < 3) return [];
    
    const suggestions: string[] = [];
    const normalizedQuery = query.toLowerCase();
    
    // Jeśli nie ma wyników, szukaj podobnych nazw
    if (!results || results.length === 0) {
      // Szukaj w nazwach handlowych
      this.drugs.forEach(drug => {
        const drugNameLower = drug.tradeName.toLowerCase();
        if (drugNameLower.includes(normalizedQuery) || 
            this.levenshteinDistance(normalizedQuery, drugNameLower) <= 2) {
          suggestions.push(drug.tradeName);
        }
      });
      
      // Szukaj w nazwach powszechnych
      this.drugs.forEach(drug => {
        if (drug.commonName) {
          const commonNameLower = drug.commonName.toLowerCase();
          if (commonNameLower.includes(normalizedQuery) || 
              this.levenshteinDistance(normalizedQuery, commonNameLower) <= 2) {
            suggestions.push(drug.commonName);
          }
        }
      });
    }
    
    // Usuń duplikaty i ogranicz do 10 sugestii
    return [...new Set(suggestions)].slice(0, 10);
  }
  
  /**
   * Oblicza odległość Levenshteina między dwoma ciągami
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,     // usunięcie
            dp[i][j - 1] + 1,     // wstawienie
            dp[i - 1][j - 1] + 1  // zamiana
          );
        }
      }
    }
    
    return dp[m][n];
  }
  
  /**
   * Zwraca etykietę dla grupy drogi podania
   */
  private getAdministrationRouteLabel(group: string): string {
    const labels: { [key: string]: string } = {
      'oral': 'Doustna',
      'parenteral': 'Pozajelitowa (iniekcje)',
      'topical': 'Miejscowa (na skórę)',
      'inhalation': 'Wziewna',
      'rectal': 'Doodbytnicza',
      'vaginal': 'Dopochwowa',
      'ophthalmic': 'Do oczu',
      'auricular': 'Do ucha',
      'nasal': 'Do nosa',
      'other': 'Inna'
    };
    
    return labels[group] || group;
  }
  
  /**
   * Oblicza statystyki leków
   */
  private calculateStatistics(): DrugStatistics {
    const stats: DrugStatistics = {
      totalDrugs: this.drugs.length,
      byPharmaceuticalForm: {},
      byAdministrationRoute: {},
      byPrescriptionType: {},
      byATCLevel1: {},
      topManufacturers: [],
      topActiveSubstances: [],
      refundedDrugsCount: 0,
      drugsWithEducationalMaterials: 0
    };
    
    // Mapy do zliczania
    const manufacturersMap = new Map<string, number>();
    const substancesMap = new Map<string, number>();
    
    this.drugs.forEach(drug => {
      // Formy farmaceutyczne
      if (drug.pharmaceuticalForm) {
        stats.byPharmaceuticalForm[drug.pharmaceuticalForm] = 
          (stats.byPharmaceuticalForm[drug.pharmaceuticalForm] || 0) + 1;
      }
      
      // Drogi podania
      stats.byAdministrationRoute[drug.administrationRouteGroup] = 
        (stats.byAdministrationRoute[drug.administrationRouteGroup] || 0) + 1;
      
      // Grupy ATC poziom 1
      if (drug.atcCodeRaw) {
        const level1 = drug.atcCodeRaw.charAt(0);
        if (!stats.byATCLevel1[level1]) {
          stats.byATCLevel1[level1] = {
            name: drug.atcCode.level1 || level1,
            count: 0
          };
        }
        stats.byATCLevel1[level1].count++;
      }
      
      // Typy recept
      drug.packages.forEach(pkg => {
        if (pkg.prescriptionType) {
          stats.byPrescriptionType[pkg.prescriptionType] = 
            (stats.byPrescriptionType[pkg.prescriptionType] || 0) + 1;
        }
        
        // Leki refundowane
        if (pkg.refundationStatus === 'refunded' || pkg.refundationStatus === 'partial') {
          stats.refundedDrugsCount++;
        }
      });
      
      // Producenci
      if (drug.marketingAuthorization) {
        manufacturersMap.set(drug.marketingAuthorization,
          (manufacturersMap.get(drug.marketingAuthorization) || 0) + 1);
      }
      
      // Substancje czynne
      drug.activeSubstances.forEach(substance => {
        substancesMap.set(substance, (substancesMap.get(substance) || 0) + 1);
      });
      
      // Materiały edukacyjne
      if (drug.documents.educationalToolsHCP || drug.documents.educationalToolsPatient) {
        stats.drugsWithEducationalMaterials++;
      }
    });
    
    // Top producenci
    stats.topManufacturers = Array.from(manufacturersMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Top substancje czynne
    stats.topActiveSubstances = Array.from(substancesMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    return stats;
  }
  
  /**
   * Buduje hierarchię ATC
   */
  private buildATCHierarchy(): Map<string, { name: string; parent?: string }> {
    const hierarchy = new Map<string, { name: string; parent?: string }>();
    
    this.drugs.forEach(drug => {
      if (drug.atcCodeRaw && drug.atcCode) {
        // Poziom 1
        const level1 = drug.atcCodeRaw.charAt(0);
        if (!hierarchy.has(level1)) {
          hierarchy.set(level1, { name: drug.atcCode.level1 });
        }
        
        // Poziom 2
        const level2 = drug.atcCodeRaw.substring(0, 3);
        if (!hierarchy.has(level2) && drug.atcCode.level2) {
          hierarchy.set(level2, { 
            name: drug.atcCode.level2,
            parent: level1
          });
        }
        
        // Można dodać kolejne poziomy...
      }
    });
    
    return hierarchy;
  }
  
  /**
   * Zwraca statystyki
   */
  public getStatistics(): DrugStatistics {
    return this.statistics;
  }
  
  /**
   * Zwraca hierarchię ATC
   */
  public getATCHierarchy(): Map<string, { name: string; parent?: string }> {
    return this.atcHierarchy;
  }
  
  /**
   * Zwraca leki według ID
   */
  public getDrugById(id: string): EnhancedDrug | undefined {
    return this.drugs.find(drug => drug.id === id);
  }
  
  /**
   * Zwraca podobne leki
   */
  public getSimilarDrugs(drugId: string, limit: number = 10): EnhancedDrug[] {
    const drug = this.getDrugById(drugId);
    if (!drug) return [];
    
    // Znajdź leki z tymi samymi substancjami czynnymi
    const similarBySubstance = this.drugs.filter(d => 
      d.id !== drugId &&
      d.activeSubstances.some(substance => 
        drug.activeSubstances.includes(substance)
      )
    );
    
    // Jeśli mało wyników, dodaj leki z tej samej grupy ATC
    if (similarBySubstance.length < limit && drug.atcCodeRaw) {
      const atcGroup = drug.atcCodeRaw.substring(0, 4); // Poziom 3
      const similarByATC = this.drugs.filter(d =>
        d.id !== drugId &&
        d.atcCodeRaw.startsWith(atcGroup) &&
        !similarBySubstance.includes(d)
      );
      
      similarBySubstance.push(...similarByATC);
    }
    
    return similarBySubstance.slice(0, limit);
  }
  
  /**
   * Zwraca zamienniki leku (generyki)
   */
  public getDrugSubstitutes(drugId: string): EnhancedDrug[] {
    const drug = this.getDrugById(drugId);
    if (!drug) return [];
    
    // Użyj zaawansowanego serwisu do znajdowania zamienników
    const substitutes = drugSubstitutesService.findSubstitutes(drug, this.drugs, {
      strictMatch: false,
      includeGenerics: true,
      includeBranded: true
    });
    
    // Zwróć tylko leki (bez metadanych o dopasowaniu)
    return substitutes.map(substitute => substitute.drug);
  }
}