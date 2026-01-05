// Service for managing drug database with CSV import functionality
export interface Drug {
  id: string;
  nazwa: string;
  substancja_czynna: string;
  kod_atc: string;
  dawkowanie: string;
  producent: string;
  cena: number;
  dostepnosc: 'dostepny' | 'brak' | 'ograniczona';
  data_dodania: Date;
  zrodlo: 'import_csv' | 'manual' | 'api';
  aktywny: boolean;
}

export interface ImportStats {
  total_rows: number;
  successful_imports: number;
  failed_imports: number;
  skipped_duplicates: number;
  errors: string[];
}

class DrugDatabaseService {
  private drugs: Drug[] = [
    // Initial sample data
    {
      id: '1',
      nazwa: 'Apap',
      substancja_czynna: 'Paracetamolum',
      kod_atc: 'N02BE01',
      dawkowanie: '500mg',
      producent: 'USP Zdrowie',
      cena: 12.50,
      dostepnosc: 'dostepny',
      data_dodania: new Date('2024-01-01'),
      zrodlo: 'manual',
      aktywny: true
    },
    {
      id: '2',
      nazwa: 'Ibuprom',
      substancja_czynna: 'Ibuprofenum',
      kod_atc: 'M01AE01',
      dawkowanie: '200mg',
      producent: 'USP Zdrowie',
      cena: 15.99,
      dostepnosc: 'dostepny',
      data_dodania: new Date('2024-01-02'),
      zrodlo: 'manual',
      aktywny: true
    },
    {
      id: '3',
      nazwa: 'Aspirin',
      substancja_czynna: 'Acidum acetylsalicylicum',
      kod_atc: 'N02BA01',
      dawkowanie: '500mg',
      producent: 'Bayer',
      cena: 18.75,
      dostepnosc: 'ograniczona',
      data_dodania: new Date('2024-01-03'),
      zrodlo: 'manual',
      aktywny: true
    }
  ];

  private lastUpdateTime: Date = new Date();
  private importHistory: Array<{
    id: string;
    filename: string;
    import_date: Date;
    stats: ImportStats;
    status: 'success' | 'partial' | 'failed';
  }> = [];

  // Get all drugs
  getDrugs(): Drug[] {
    return this.drugs.filter(drug => drug.aktywny);
  }

  // Get drug by ID
  getDrugById(id: string): Drug | undefined {
    return this.drugs.find(drug => drug.id === id && drug.aktywny);
  }

  // Search drugs
  searchDrugs(query: string, filters?: {
    substancja_czynna?: string;
    producent?: string;
    dostepnosc?: string;
    cena_min?: number;
    cena_max?: number;
  }): Drug[] {
    let filtered = this.drugs.filter(drug => drug.aktywny);

    // Text search
    if (query.trim()) {
      const searchQuery = query.toLowerCase().trim();
      filtered = filtered.filter(drug =>
        drug.nazwa.toLowerCase().includes(searchQuery) ||
        drug.substancja_czynna.toLowerCase().includes(searchQuery) ||
        drug.producent.toLowerCase().includes(searchQuery) ||
        drug.kod_atc.toLowerCase().includes(searchQuery)
      );
    }

    // Apply filters
    if (filters) {
      if (filters.substancja_czynna) {
        filtered = filtered.filter(drug => 
          drug.substancja_czynna.toLowerCase().includes(filters.substancja_czynna!.toLowerCase())
        );
      }
      if (filters.producent) {
        filtered = filtered.filter(drug => 
          drug.producent.toLowerCase().includes(filters.producent!.toLowerCase())
        );
      }
      if (filters.dostepnosc) {
        filtered = filtered.filter(drug => drug.dostepnosc === filters.dostepnosc);
      }
      if (filters.cena_min !== undefined) {
        filtered = filtered.filter(drug => drug.cena >= filters.cena_min!);
      }
      if (filters.cena_max !== undefined) {
        filtered = filtered.filter(drug => drug.cena <= filters.cena_max!);
      }
    }

    return filtered;
  }

  // Parse CSV content
  private parseCSV(csvContent: string): any[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('Plik CSV jest pusty');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    return rows.map(row => {
      const values = this.parseCSVRow(row);
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });
      return rowData;
    });
  }

  // Parse single CSV row handling quoted values
  private parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < row.length) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }
    
    result.push(current.trim());
    return result;
  }

  // Validate drug data
  private validateDrugData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.nazwa || data.nazwa.trim() === '') {
      errors.push('Brak nazwy leku');
    }
    
    if (!data.substancja_czynna || data.substancja_czynna.trim() === '') {
      errors.push('Brak substancji czynnej');
    }
    
    if (!data.kod_atc || data.kod_atc.trim() === '') {
      errors.push('Brak kodu ATC');
    }
    
    if (!data.producent || data.producent.trim() === '') {
      errors.push('Brak nazwy producenta');
    }
    
    if (data.cena && isNaN(parseFloat(data.cena))) {
      errors.push('Nieprawidłowa cena');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `drug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check for duplicates
  private isDuplicate(drugData: any): boolean {
    return this.drugs.some(drug => 
      drug.nazwa.toLowerCase() === drugData.nazwa?.toLowerCase() &&
      drug.substancja_czynna.toLowerCase() === drugData.substancja_czynna?.toLowerCase() &&
      drug.producent.toLowerCase() === drugData.producent?.toLowerCase()
    );
  }

  // Import CSV file
  async importFromCSV(file: File, replaceExisting: boolean = false): Promise<ImportStats> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const rows = this.parseCSV(csvContent);
          
          const stats: ImportStats = {
            total_rows: rows.length,
            successful_imports: 0,
            failed_imports: 0,
            skipped_duplicates: 0,
            errors: []
          };

          // If replace existing, mark all current drugs as inactive
          if (replaceExisting) {
            this.drugs.forEach(drug => {
              if (drug.zrodlo === 'import_csv') {
                drug.aktywny = false;
              }
            });
          }

          rows.forEach((rowData, index) => {
            try {
              // Validate data
              const validation = this.validateDrugData(rowData);
              if (!validation.valid) {
                stats.failed_imports++;
                stats.errors.push(`Wiersz ${index + 2}: ${validation.errors.join(', ')}`);
                return;
              }

              // Check for duplicates (only if not replacing)
              if (!replaceExisting && this.isDuplicate(rowData)) {
                stats.skipped_duplicates++;
                return;
              }

              // Create new drug entry
              const newDrug: Drug = {
                id: this.generateId(),
                nazwa: rowData.nazwa.trim(),
                substancja_czynna: rowData.substancja_czynna.trim(),
                kod_atc: rowData.kod_atc.trim(),
                dawkowanie: rowData.dawkowanie?.trim() || '',
                producent: rowData.producent.trim(),
                cena: parseFloat(rowData.cena) || 0,
                dostepnosc: this.mapAvailability(rowData.dostepnosc),
                data_dodania: new Date(),
                zrodlo: 'import_csv',
                aktywny: true
              };

              this.drugs.push(newDrug);
              stats.successful_imports++;

            } catch (error) {
              stats.failed_imports++;
              stats.errors.push(`Wiersz ${index + 2}: Błąd przetwarzania - ${error}`);
            }
          });

          // Update last update time
          this.lastUpdateTime = new Date();

          // Save import history
          const importRecord = {
            id: this.generateId(),
            filename: file.name,
            import_date: new Date(),
            stats: { ...stats },
            status: stats.failed_imports === 0 ? 'success' as const : 
                   stats.successful_imports > 0 ? 'partial' as const : 'failed' as const
          };
          
          this.importHistory.unshift(importRecord);
          
          // Keep only last 10 import records
          this.importHistory = this.importHistory.slice(0, 10);

          resolve(stats);
        } catch (error) {
          reject(new Error(`Błąd parsowania CSV: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Błąd odczytu pliku'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  // Map availability status
  private mapAvailability(value: string): 'dostepny' | 'brak' | 'ograniczona' {
    if (!value) return 'dostepny';
    const normalized = value.toLowerCase().trim();
    
    if (normalized.includes('brak') || normalized.includes('niedostępny')) {
      return 'brak';
    } else if (normalized.includes('ograniczon')) {
      return 'ograniczona';
    } else {
      return 'dostepny';
    }
  }

  // Get database statistics
  getStatistics() {
    const active = this.drugs.filter(drug => drug.aktywny);
    const bySource = {
      import_csv: active.filter(d => d.zrodlo === 'import_csv').length,
      manual: active.filter(d => d.zrodlo === 'manual').length,
      api: active.filter(d => d.zrodlo === 'api').length
    };
    
    const byAvailability = {
      dostepny: active.filter(d => d.dostepnosc === 'dostepny').length,
      brak: active.filter(d => d.dostepnosc === 'brak').length,
      ograniczona: active.filter(d => d.dostepnosc === 'ograniczona').length
    };

    const manufacturers = [...new Set(active.map(d => d.producent))];
    const atcCodes = [...new Set(active.map(d => d.kod_atc))];

    return {
      total_drugs: active.length,
      last_update: this.lastUpdateTime,
      by_source: bySource,
      by_availability: byAvailability,
      manufacturers_count: manufacturers.length,
      atc_codes_count: atcCodes.length,
      avg_price: active.length > 0 ? active.reduce((sum, drug) => sum + drug.cena, 0) / active.length : 0
    };
  }

  // Get import history
  getImportHistory() {
    return [...this.importHistory];
  }

  // Get last update time
  getLastUpdateTime(): Date {
    return this.lastUpdateTime;
  }

  // Delete drug
  deleteDrug(id: string): boolean {
    const drugIndex = this.drugs.findIndex(drug => drug.id === id);
    if (drugIndex !== -1) {
      this.drugs[drugIndex].aktywny = false;
      return true;
    }
    return false;
  }

  // Add single drug manually
  addDrug(drugData: Omit<Drug, 'id' | 'data_dodania' | 'zrodlo' | 'aktywny'>): Drug {
    const newDrug: Drug = {
      ...drugData,
      id: this.generateId(),
      data_dodania: new Date(),
      zrodlo: 'manual',
      aktywny: true
    };

    this.drugs.push(newDrug);
    return newDrug;
  }

  // Update drug
  updateDrug(id: string, updates: Partial<Drug>): boolean {
    const drugIndex = this.drugs.findIndex(drug => drug.id === id);
    if (drugIndex !== -1) {
      this.drugs[drugIndex] = { ...this.drugs[drugIndex], ...updates };
      return true;
    }
    return false;
  }

  // Export to CSV
  exportToCSV(): string {
    const activeDrugs = this.drugs.filter(drug => drug.aktywny);
    
    const headers = ['nazwa', 'substancja_czynna', 'kod_atc', 'dawkowanie', 'producent', 'cena', 'dostepnosc'];
    const csvRows = [headers.join(',')];

    activeDrugs.forEach(drug => {
      const row = [
        `"${drug.nazwa}"`,
        `"${drug.substancja_czynna}"`,
        `"${drug.kod_atc}"`,
        `"${drug.dawkowanie}"`,
        `"${drug.producent}"`,
        drug.cena.toString(),
        `"${drug.dostepnosc}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Clear all imported drugs
  clearImportedDrugs(): number {
    const importedDrugs = this.drugs.filter(drug => drug.zrodlo === 'import_csv' && drug.aktywny);
    importedDrugs.forEach(drug => {
      drug.aktywny = false;
    });
    
    this.lastUpdateTime = new Date();
    return importedDrugs.length;
  }

  // Get sample CSV template
  getCSVTemplate(): string {
    return `nazwa,substancja_czynna,kod_atc,dawkowanie,producent,cena,dostepnosc
"Przykładowy Lek 1","Paracetamolum","N02BE01","500mg","Producent ABC",12.50,"dostepny"
"Przykładowy Lek 2","Ibuprofenum","M01AE01","200mg","Producent XYZ",15.99,"ograniczona"
"Przykładowy Lek 3","Acidum acetylsalicylicum","N02BA01","100mg","Producent DEF",8.75,"brak"`;
  }
}

export const drugDatabaseService = new DrugDatabaseService();