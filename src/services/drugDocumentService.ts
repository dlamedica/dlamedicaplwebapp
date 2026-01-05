interface DocumentSection {
  title: string;
  content: string;
}

interface DrugDocument {
  type: 'leaflet' | 'characteristic';
  sections: DocumentSection[];
  fetchedAt: Date;
  drugId: string;
}

class DrugDocumentService {
  private cache: Map<string, DrugDocument> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  async fetchLeaflet(drugId: string): Promise<DocumentSection[]> {
    const cacheKey = `leaflet-${drugId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached.sections;

    try {
      const url = `https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${drugId}/leaflet`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leaflet: ${response.status}`);
      }

      // TODO: Parse PDF/HTML content
      // For now, return mock data
      const sections: DocumentSection[] = [
        {
          title: 'Wskazania do stosowania',
          content: 'Lek jest wskazany w leczeniu...'
        },
        {
          title: 'Dawkowanie',
          content: 'Zalecana dawka to...'
        },
        {
          title: 'Przeciwwskazania',
          content: 'Nie należy stosować leku w przypadku...'
        },
        {
          title: 'Działania niepożądane',
          content: 'Możliwe działania niepożądane to...'
        }
      ];

      const document: DrugDocument = {
        type: 'leaflet',
        sections,
        fetchedAt: new Date(),
        drugId
      };

      this.cache.set(cacheKey, document);
      this.saveToIndexedDB(cacheKey, document);

      return sections;
    } catch (error) {
      console.error('Error fetching leaflet:', error);
      return [];
    }
  }

  async fetchCharacteristic(drugId: string): Promise<DocumentSection[]> {
    const cacheKey = `characteristic-${drugId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached.sections;

    try {
      const url = `https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${drugId}/characteristic`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch characteristic: ${response.status}`);
      }

      // TODO: Parse PDF/HTML content
      // For now, return mock data
      const sections: DocumentSection[] = [
        {
          title: 'Właściwości farmakodynamiczne',
          content: 'Mechanizm działania...'
        },
        {
          title: 'Właściwości farmakokinetyczne',
          content: 'Wchłanianie, dystrybucja...'
        },
        {
          title: 'Wskazania terapeutyczne',
          content: 'Szczegółowe wskazania...'
        }
      ];

      const document: DrugDocument = {
        type: 'characteristic',
        sections,
        fetchedAt: new Date(),
        drugId
      };

      this.cache.set(cacheKey, document);
      this.saveToIndexedDB(cacheKey, document);

      return sections;
    } catch (error) {
      console.error('Error fetching characteristic:', error);
      return [];
    }
  }

  private getFromCache(key: string): DrugDocument | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.fetchedAt.getTime();
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  private async saveToIndexedDB(key: string, document: DrugDocument): Promise<void> {
    try {
      if (!('indexedDB' in window)) return;

      const dbName = 'drugDocuments';
      const storeName = 'documents';
      
      const db = await this.openDB(dbName, storeName);
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await store.put({ key, document, timestamp: Date.now() });
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  }

  private async loadFromIndexedDB(): Promise<void> {
    try {
      if (!('indexedDB' in window)) return;

      const dbName = 'drugDocuments';
      const storeName = 'documents';
      
      const db = await this.openDB(dbName, storeName);
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.getAll();
      const allRecords = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      const now = Date.now();

      allRecords.forEach((record: any) => {
        if (now - record.timestamp < this.CACHE_DURATION) {
          this.cache.set(record.key, record.document);
        }
      });
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
    }
  }

  private openDB(dbName: string, storeName: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async initialize(): Promise<void> {
    await this.loadFromIndexedDB();
  }
}

export const drugDocumentService = new DrugDocumentService();
export type { DocumentSection, DrugDocument };