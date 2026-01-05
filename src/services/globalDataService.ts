import { EnhancedDrug } from '../types/drug';
import { DrugParser } from './drugParser';
import { AdvancedDrugSearchService } from './advancedDrugSearch';

interface ICD11Data {
  code: string;
  name: string;
  category: string;
  subcategories?: ICD11Data[];
}

interface GlobalDataCache {
  drugs: EnhancedDrug[];
  drugSearchService: AdvancedDrugSearchService | null;
  icd11Data: ICD11Data[];
  isLoaded: {
    drugs: boolean;
    icd11: boolean;
  };
  isLoading: {
    drugs: boolean;
    icd11: boolean;
  };
  errors: {
    drugs: string | null;
    icd11: string | null;
  };
}

export class GlobalDataService {
  private static instance: GlobalDataService | null = null;
  private cache: GlobalDataCache;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.cache = {
      drugs: [],
      drugSearchService: null,
      icd11Data: [],
      isLoaded: {
        drugs: false,
        icd11: false
      },
      isLoading: {
        drugs: false,
        icd11: false
      },
      errors: {
        drugs: null,
        icd11: null
      }
    };

    // Sprawdź czy dane są w localStorage i załaduj je natychmiast
    this.loadFromLocalStorage();

    // Rozpocznij ładowanie w tle
    this.startBackgroundLoading();
  }

  public static getInstance(): GlobalDataService {
    if (!GlobalDataService.instance) {
      GlobalDataService.instance = new GlobalDataService();
    }
    return GlobalDataService.instance;
  }

  // Dodaj listener do zmian w cache
  public addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // Sprawdź czy dane są aktualne (nie starsze niż 24h)
  private isDataFresh(key: string): boolean {
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    if (!timestamp) return false;

    const age = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 godziny
    return age < maxAge;
  }

  // Załaduj dane z localStorage jeśli są aktualne
  private loadFromLocalStorage() {
    try {
      // Drugs cache
      if (this.isDataFresh('drugs_cache')) {
        const drugsData = localStorage.getItem('drugs_cache');
        if (drugsData) {
          const drugs = JSON.parse(drugsData);
          this.cache.drugs = drugs;
          this.cache.drugSearchService = new AdvancedDrugSearchService(drugs);
          this.cache.isLoaded.drugs = true;
          console.log(`📦 Loaded ${drugs.length} drugs from cache`);
        }
      }

      // ICD-11 cache
      if (this.isDataFresh('icd11_cache')) {
        const icd11Data = localStorage.getItem('icd11_cache');
        if (icd11Data) {
          this.cache.icd11Data = JSON.parse(icd11Data);
          this.cache.isLoaded.icd11 = true;
          console.log(`📦 Loaded ${this.cache.icd11Data.length} ICD-11 codes from cache`);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage(key: string, data: any) {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(key, dataString);
      localStorage.setItem(`${key}_timestamp`, Date.now().toString());
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn(`⚠️ LocalStorage quota exceeded when saving ${key}. Clearing old cache and retrying...`);
        this.cleanOldCache(true); // Force clean all

        try {
          // Retry once
          localStorage.setItem(key, JSON.stringify(data));
          localStorage.setItem(`${key}_timestamp`, Date.now().toString());
        } catch (retryError) {
          console.error(`❌ Failed to save ${key} to localStorage even after cleanup. Using in-memory storage only.`);
          // Remove the keys to avoid partial data
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_timestamp`);
        }
      } else {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    }
  }

  // Wyczyść stare dane z localStorage
  private cleanOldCache(force: boolean = false) {
    const keys = ['drugs_cache', 'icd11_cache'];
    keys.forEach(key => {
      if (force || !this.isDataFresh(key)) {
        console.log(`🧹 Cleaning cache for ${key} (force: ${force})`);
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_timestamp`);
      }
    });
  }

  // Rozpocznij ładowanie w tle
  private async startBackgroundLoading() {
    // Ładuj wszystko równolegle
    const promises = [];

    if (!this.cache.isLoaded.drugs) {
      promises.push(this.loadDrugsData());
    }

    if (!this.cache.isLoaded.icd11) {
      promises.push(this.loadICD11Data());
    }

    // Czekaj na wszystkie ale nie blokuj UI
    Promise.allSettled(promises).then(() => {
      console.log('🚀 Background data loading completed');
    });
  }

  // Ładowanie danych leków
  private async loadDrugsData() {
    if (this.cache.isLoading.drugs) return;

    try {
      this.cache.isLoading.drugs = true;
      this.cache.errors.drugs = null;
      this.notifyListeners();

      console.log('🔄 Loading drugs data in background...');

      const response = await fetch('/bazaleki.csv');
      if (!response.ok) {
        throw new Error('Cannot load drugs database');
      }

      const csvContent = await response.text();
      const drugs = await DrugParser.parseCSVToDrugs(csvContent);

      this.cache.drugs = drugs;
      this.cache.drugSearchService = new AdvancedDrugSearchService(drugs);
      this.cache.isLoaded.drugs = true;

      // Zapisz do localStorage TYLKO jeśli NIE jesteśmy w trybie mock
      // Tryb mock często działa na środowiskach z limitem storage lub ma dużo innych danych
      const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      if (!useMock) {
        this.saveToLocalStorage('drugs_cache', drugs);
      } else {
        console.log('🧪 Mock mode active: Skipping drugs_cache localStorage save to prevent QuotaExceededError');
      }

      console.log(`✅ Loaded ${drugs.length} drugs successfully`);

    } catch (error: any) {
      console.error('❌ Error loading drugs:', error);
      this.cache.errors.drugs = error.message;
    } finally {
      this.cache.isLoading.drugs = false;
      this.notifyListeners();
    }
  }

  // Ładowanie danych ICD-11
  private async loadICD11Data() {
    if (this.cache.isLoading.icd11) return;

    try {
      this.cache.isLoading.icd11 = true;
      this.cache.errors.icd11 = null;
      this.notifyListeners();

      console.log('🔄 Loading ICD-11 data in background...');

      // Najpierw spróbuj załadować z pliku
      let icd11Data: ICD11Data[] = [];

      try {
        const response = await fetch('/icd11.json');
        console.log('📡 ICD-11 fetch response:', response.status, response.ok);
        if (response.ok) {
          const jsonData = await response.json();
          console.log('📦 ICD-11 JSON structure:', {
            hasEntities: !!jsonData.entities,
            entitiesLength: jsonData.entities?.length,
            isArray: Array.isArray(jsonData),
            totalEntities: jsonData.totalEntities
          });

          // Check if it's the structured format with entities array
          if (jsonData.entities && Array.isArray(jsonData.entities)) {
            icd11Data = jsonData.entities.map((entity: any) => ({
              code: entity.code,
              name: entity.title || entity.name,
              category: entity.category || 'General'
            }));
            console.log('✅ ICD-11 structured format processed:', icd11Data.length, 'items');
          } else if (Array.isArray(jsonData)) {
            // Direct array format
            icd11Data = jsonData;
            console.log('✅ ICD-11 direct array format processed:', icd11Data.length, 'items');
          }
        } else {
          console.error('❌ ICD-11 fetch failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ ICD-11 fetch error:', error);
        // Jeśli plik nie istnieje, użyj wbudowanych danych
        icd11Data = this.getBuiltInICD11Data();
      }

      this.cache.icd11Data = icd11Data;
      this.cache.isLoaded.icd11 = true;

      // Zapisz do localStorage
      this.saveToLocalStorage('icd11_cache', icd11Data);

      console.log(`✅ Loaded ${icd11Data.length} ICD-11 codes successfully`);

    } catch (error: any) {
      console.error('❌ Error loading ICD-11:', error);
      this.cache.errors.icd11 = error.message;
    } finally {
      this.cache.isLoading.icd11 = false;
      this.notifyListeners();
    }
  }

  // Wbudowane dane ICD-11 (najważniejsze kody)
  private getBuiltInICD11Data(): ICD11Data[] {
    return [
      { code: '1A00-1H9Z', name: 'Certain infectious or parasitic diseases', category: 'Infectious' },
      { code: '2A00-2F9Z', name: 'Neoplasms', category: 'Neoplasms' },
      { code: '3A00-3C5Z', name: 'Diseases of the blood or blood-forming organs', category: 'Blood' },
      { code: '4A00-4B4Z', name: 'Diseases of the immune system', category: 'Immune' },
      { code: '5A00-5D9Z', name: 'Endocrine, nutritional or metabolic diseases', category: 'Endocrine' },
      { code: '6A00-6E8Z', name: 'Mental, behavioural or neurodevelopmental disorders', category: 'Mental' },
      { code: '7A00-7B9Z', name: 'Sleep-wake disorders', category: 'Sleep' },
      { code: '8A00-8E7Z', name: 'Diseases of the nervous system', category: 'Nervous' },
      { code: '9A00-9D9Z', name: 'Diseases of the visual system', category: 'Visual' },
      { code: 'AB00-AD6Z', name: 'Diseases of the ear or mastoid process', category: 'Ear' },
      { code: 'BA00-BE2Z', name: 'Diseases of the circulatory system', category: 'Circulatory' },
      { code: 'CA00-CB7Z', name: 'Diseases of the respiratory system', category: 'Respiratory' },
      { code: 'DA00-DE2Z', name: 'Diseases of the digestive system', category: 'Digestive' },
      { code: 'EA00-EL9Z', name: 'Diseases of the skin', category: 'Skin' },
      { code: 'FA00-FC9Z', name: 'Diseases of the musculoskeletal system', category: 'Musculoskeletal' },
      { code: 'GA00-GC9Z', name: 'Diseases of the genitourinary system', category: 'Genitourinary' },
      { code: 'JA00-JB9Z', name: 'Conditions related to sexual health', category: 'Sexual' },
      { code: 'KA00-KD4Z', name: 'Pregnancy, childbirth or the puerperium', category: 'Pregnancy' },
      { code: 'KE00-KE8Z', name: 'Certain conditions originating in the perinatal period', category: 'Perinatal' },
      { code: 'LA00-LD9Z', name: 'Developmental anomalies', category: 'Developmental' },
      { code: 'MG30-MH9Z', name: 'Symptoms, signs or clinical findings', category: 'Symptoms' },
      { code: 'NA00-NF9Z', name: 'Injury, poisoning or certain other consequences', category: 'Injury' }
    ];
  }

  // Public API
  public getDrugsData(): { drugs: EnhancedDrug[]; searchService: AdvancedDrugSearchService | null; isLoaded: boolean; isLoading: boolean; error: string | null } {
    return {
      drugs: this.cache.drugs,
      searchService: this.cache.drugSearchService,
      isLoaded: this.cache.isLoaded.drugs,
      isLoading: this.cache.isLoading.drugs,
      error: this.cache.errors.drugs
    };
  }

  public getICD11Data(): { data: ICD11Data[]; isLoaded: boolean; isLoading: boolean; error: string | null } {
    return {
      data: this.cache.icd11Data,
      isLoaded: this.cache.isLoaded.icd11,
      isLoading: this.cache.isLoading.icd11,
      error: this.cache.errors.icd11
    };
  }

  // Wymuś ponowne załadowanie danych
  public async forceReload(type: 'drugs' | 'icd11' | 'all' = 'all') {
    if (type === 'drugs' || type === 'all') {
      this.cache.isLoaded.drugs = false;
      localStorage.removeItem('drugs_cache');
      localStorage.removeItem('drugs_cache_timestamp');
      await this.loadDrugsData();
    }

    if (type === 'icd11' || type === 'all') {
      this.cache.isLoaded.icd11 = false;
      localStorage.removeItem('icd11_cache');
      localStorage.removeItem('icd11_cache_timestamp');
      await this.loadICD11Data();
    }
  }

  // Sprawdź status cache
  public getCacheStatus() {
    return {
      drugs: {
        loaded: this.cache.isLoaded.drugs,
        loading: this.cache.isLoading.drugs,
        count: this.cache.drugs.length,
        error: this.cache.errors.drugs
      },
      icd11: {
        loaded: this.cache.isLoaded.icd11,
        loading: this.cache.isLoading.icd11,
        count: this.cache.icd11Data.length,
        error: this.cache.errors.icd11
      }
    };
  }
}

// Export singleton instance
export const globalDataService = GlobalDataService.getInstance();