import Papa from 'papaparse';
import { EnhancedDrug, DrugPackage, ATCCode, DrugManufacturingInfo, DrugDocuments } from '../types/drug';
import { getIndicationsForATC } from '../data/atcToIcd11Mapping';

export class DrugParser {
  
  /**
   * Parsuje dane opakowań z formatu CSV
   */
  static parsePackages(packageString: string): DrugPackage[] {
    if (!packageString) return [];
    
    const packages: DrugPackage[] = [];
    const lines = packageString.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const parts = line.split('¦').map(p => p.trim());
      if (parts.length >= 2) {
        const ean = parts[0] || '';
        const prescriptionType = this.parsePrescriptionType(parts[1]);
        const registrationNumber = parts[2] || '';
        
        // Pozostała część to opis opakowania
        const descriptionParts = parts.slice(3);
        const description = descriptionParts.join(' ').trim();
        
        // Wyciągnij wielkość opakowania z opisu
        const size = this.extractPackageSize(description);
        
        // Określ status refundacji
        const refundationStatus = this.determineRefundationStatus(parts[1], description);
        
        packages.push({
          ean,
          prescriptionType,
          registrationNumber,
          description,
          size,
          refundationStatus: refundationStatus.status,
          refundationPercentage: refundationStatus.percentage,
          price: refundationStatus.price,
          refundationPrice: refundationStatus.refundationPrice,
          patientPayment: refundationStatus.patientPayment
        });
      }
    });
    
    return packages;
  }
  
  /**
   * Parsuje typ recepty z kodu
   */
  private static parsePrescriptionType(code: string): 'Rp' | 'Rpz' | 'Rpw' | 'OTC' | 'Lz' | string {
    const normalizedCode = code.toUpperCase().trim();
    
    if (normalizedCode.includes('RPW')) return 'Rpw';
    if (normalizedCode.includes('RPZ')) return 'Rpz';
    if (normalizedCode.includes('RP')) return 'Rp';
    if (normalizedCode.includes('OTC')) return 'OTC';
    if (normalizedCode.includes('LZ')) return 'Lz';
    
    // Jeśli to inny typ, zwróć oryginalną wartość
    return code.trim();
  }
  
  /**
   * Wyciąga wielkość opakowania z opisu
   */
  private static extractPackageSize(description: string): string {
    if (!description) return '';
    
    // Rozszerzone wzorce
    const sizePatterns = [
      /(\d+)\s*(?:tabl\.|tabletek|tablet|tab\.)/i,
      /(\d+)\s*(?:kaps\.|kapsułek|capsules|kaps)/i,
      /(\d+)\s*(?:amp\.|ampułek|ampules|amp)/i,
      /(\d+)\s*(?:fiol\.|fiolek|vials|fiol)/i,
      /(\d+)\s*(?:sasz\.|saszetek|sachets)/i,
      /(\d+\s*x\s*\d+)\s*(?:ml|mg|g)/i, // np. "10 x 5 ml"
      /(\d+(?:\.\d+)?)\s*(?:ml|mililitrów)/i,
      /(\d+(?:\.\d+)?)\s*(?:l|litrów|liters)/i,
      /(\d+(?:\.\d+)?)\s*(?:g|gramów|gram)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg|miligramów)/i,
      /(\d+(?:\.\d+)?)\s*(?:kg|kilogramów)/i,
      /(\d+)\s*(?:szt\.|sztuk|pieces|szt)/i,
      /(\d+)\s*(?:dawek|doses|dawka)/i,
      /(\d+)\s*(?:plastrów|plasters|plaster)/i,
      /(\d+)\s*(?:czopków|suppositories)/i
    ];
    
    for (const pattern of sizePatterns) {
      const match = description.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    // Jeśli nie znaleziono wzorca, spróbuj wyciągnąć liczby
    const numberMatch = description.match(/\d+(?:\.\d+)?/);
    if (numberMatch) {
      return numberMatch[0];
    }
    
    return description.substring(0, 50); // Fallback
  }
  
  /**
   * Określa status refundacji i ceny
   */
  private static determineRefundationStatus(code: string, description: string): {
    status: 'refunded' | 'partial' | 'none';
    percentage?: number;
    price?: number;
    refundationPrice?: number;
    patientPayment?: number;
  } {
    const text = (code + ' ' + description).toUpperCase();
    
    // Szukaj informacji o refundacji
    if (text.includes('100%') || text.includes('BEZPŁATNY')) {
      return { status: 'refunded', percentage: 100, patientPayment: 0 };
    }
    
    // Szukaj procentów odpłatności
    const percentMatch = text.match(/(\d+)%/);
    if (percentMatch) {
      const percentage = parseInt(percentMatch[1]);
      return { 
        status: percentage === 100 ? 'refunded' : 'partial', 
        percentage: percentage
      };
    }
    
    // Szukaj cen
    const priceMatch = text.match(/(\d+[,.]?\d*)\s*(?:ZŁ|PLN)/i);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(',', '.'));
      return { status: 'partial', price };
    }
    
    // Ryczałt
    if (text.includes('RYCZAŁT')) {
      return { status: 'partial', patientPayment: 3.20 }; // Standardowy ryczałt
    }
    
    // Sprawdź czy jest Rpz (zwykle refundowane)
    if (text.includes('RPZ') && !text.includes('BEZ REFUNDACJI')) {
      return { status: 'partial' };
    }
    
    return { status: 'none' };
  }
  
  /**
   * Parsuje kod ATC na hierarchiczną strukturę
   */
  static parseATCCode(atcString: string): ATCCode {
    const code = atcString.trim().toUpperCase();
    
    if (!code || code.length < 1) {
      return {
        code: '',
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        description: ''
      };
    }
    
    const level1 = code.charAt(0);
    const level2 = code.substring(0, 3);
    const level3 = code.substring(0, 4);
    const level4 = code.substring(0, 5);
    const level5 = code.length >= 7 ? code : '';
    
    return {
      code,
      level1: this.getATCLevel1Description(level1),
      level2: this.getATCLevel2Description(level2),
      level3: level3,
      level4: level4,
      level5: level5,
      description: this.getATCFullDescription(code)
    };
  }
  
  /**
   * Zwraca opis głównej grupy ATC (poziom 1)
   */
  private static getATCLevel1Description(code: string): string {
    const atcLevel1: { [key: string]: string } = {
      'A': 'Przewód pokarmowy i metabolizm',
      'B': 'Krew i układ krwiotwórczy',
      'C': 'Układ sercowo-naczyniowy',
      'D': 'Leki dermatologiczne',
      'G': 'Układ moczowo-płciowy i hormony płciowe',
      'H': 'Hormony ogólnoustrojowe, z wyłączeniem hormonów płciowych i insulin',
      'J': 'Leki przeciwzakaźne do stosowania ogólnego',
      'L': 'Leki przeciwnowotworowe i immunomodulujące',
      'M': 'Układ mięśniowo-szkieletowy',
      'N': 'Układ nerwowy',
      'P': 'Leki przeciwpasożytnicze, środki owadobójcze i repelenty',
      'R': 'Układ oddechowy',
      'S': 'Narządy zmysłów',
      'V': 'Różne'
    };
    
    return atcLevel1[code] || 'Nieznana grupa';
  }
  
  /**
   * Zwraca opis grupy terapeutycznej ATC (poziom 2)
   */
  private static getATCLevel2Description(code: string): string {
    const atcLevel2: { [key: string]: string } = {
      // Przewód pokarmowy i metabolizm
      'A01': 'Leki stomatologiczne',
      'A02': 'Leki stosowane w zaburzeniach związanych z nadkwaśnością',
      'A03': 'Leki stosowane w czynnościowych zaburzeniach żołądkowo-jelitowych',
      'A04': 'Leki przeciwwymiotne i przeciw nudnościom',
      'A05': 'Leki stosowane w chorobach wątroby i dróg żółciowych',
      'A06': 'Leki przeczyszczające',
      'A07': 'Leki przeciwbiegunkowe, przeciwzapalne i przeciwzakaźne stosowane w chorobach jelit',
      'A08': 'Leki zmniejszające apetyt, z wyłączeniem produktów dietetycznych',
      'A09': 'Środki poprawiające trawienie, włączając enzymy',
      'A10': 'Leki stosowane w cukrzycy',
      'A11': 'Witaminy',
      'A12': 'Suplementy minerałów',
      'A13': 'Leki wzmacniające',
      'A14': 'Leki anaboliczne do stosowania ogólnego',
      'A15': 'Środki pobudzające apetyt',
      'A16': 'Inne leki wpływające na przewód pokarmowy i metabolizm',
      
      // Układ sercowo-naczyniowy
      'C01': 'Leki stosowane w chorobach serca',
      'C02': 'Leki przeciwnadciśnieniowe',
      'C03': 'Leki moczopędne',
      'C04': 'Leki rozszerzające naczynia obwodowe',
      'C05': 'Leki ochraniające naczynia',
      'C07': 'Leki blokujące receptory beta-adrenergiczne',
      'C08': 'Blokery kanału wapniowego',
      'C09': 'Leki działające na układ renina-angiotensyna',
      'C10': 'Leki wpływające na stężenie lipidów',
      
      // Układ nerwowy
      'N01': 'Środki znieczulające',
      'N02': 'Leki przeciwbólowe',
      'N03': 'Leki przeciwpadaczkowe',
      'N04': 'Leki przeciw chorobie Parkinsona',
      'N05': 'Leki psychotropowe',
      'N06': 'Psychoanaleptyki',
      'N07': 'Inne leki działające na układ nerwowy',
      
      // Można dodać więcej...
    };
    
    return atcLevel2[code] || '';
  }
  
  /**
   * Zwraca pełny opis kodu ATC
   */
  private static getATCFullDescription(code: string): string {
    const level1 = this.getATCLevel1Description(code.charAt(0));
    const level2 = this.getATCLevel2Description(code.substring(0, 3));
    
    if (level2) {
      return `${level1} - ${level2}`;
    }
    return level1;
  }
  
  /**
   * Określa grupę drogi podania
   */
  static determineAdministrationRouteGroup(route: string): 'oral' | 'parenteral' | 'topical' | 'inhalation' | 'rectal' | 'vaginal' | 'ophthalmic' | 'auricular' | 'nasal' | 'other' {
    const normalizedRoute = route.toLowerCase();
    
    if (normalizedRoute.includes('doustna') || normalizedRoute.includes('przez usta') || normalizedRoute.includes('oral')) {
      return 'oral';
    }
    
    if (normalizedRoute.includes('dożylna') || normalizedRoute.includes('domięśniowa') || 
        normalizedRoute.includes('podskórna') || normalizedRoute.includes('iniekcja') ||
        normalizedRoute.includes('infuzja') || normalizedRoute.includes('parenteralna')) {
      return 'parenteral';
    }
    
    if (normalizedRoute.includes('skóra') || normalizedRoute.includes('miejscowo') || 
        normalizedRoute.includes('zewnętrzne') || normalizedRoute.includes('transdermalnie')) {
      return 'topical';
    }
    
    if (normalizedRoute.includes('wziewne') || normalizedRoute.includes('inhalacja') ||
        normalizedRoute.includes('aerozol') || normalizedRoute.includes('nebulizacja')) {
      return 'inhalation';
    }
    
    if (normalizedRoute.includes('doodbytnicza') || normalizedRoute.includes('rectal')) {
      return 'rectal';
    }
    
    if (normalizedRoute.includes('dopochwowa') || normalizedRoute.includes('vaginal')) {
      return 'vaginal';
    }
    
    if (normalizedRoute.includes('do oczu') || normalizedRoute.includes('okulistyczna') ||
        normalizedRoute.includes('ophthalmic')) {
      return 'ophthalmic';
    }
    
    if (normalizedRoute.includes('do ucha') || normalizedRoute.includes('douszna')) {
      return 'auricular';
    }
    
    if (normalizedRoute.includes('do nosa') || normalizedRoute.includes('donosowa')) {
      return 'nasal';
    }
    
    return 'other';
  }
  
  /**
   * Parsuje substancje czynne
   */
  private static parseActiveSubstances(substancesString: string): string[] {
    if (!substancesString) return [];
    
    // Rozdziel po przecinkach lub średnikach
    const substances = substancesString
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Usuń duplikaty
    return [...new Set(substances)];
  }
  
  /**
   * Parsuje informacje o produkcji
   */
  private static parseManufacturingInfo(row: any): DrugManufacturingInfo {
    return {
      manufacturer: row['Nazwa wytwórcy'] || undefined,
      manufacturerCountry: row['Kraj wytwórcy'] || undefined,
      importer: row['Nazwa importera'] || undefined,
      importerCountry: row['Kraj importera'] || undefined,
      manufacturerImporter: row['Nazwa wytwórcy/importera'] || undefined,
      manufacturerImporterCountry: row['Kraj wytwórcy/importera'] || undefined,
      responsibleEntityExportCountry: row['Podmiot odpowiedzialny w kraju eksportu'] || undefined,
      exportCountry: row['Kraj eksportu'] || undefined
    };
  }
  
  /**
   * Parsuje dokumenty
   */
  private static parseDocuments(row: any): DrugDocuments {
    // Funkcja pomocnicza do czyszczenia URL-i
    const cleanUrl = (url: string | undefined): string | undefined => {
      if (!url || typeof url !== 'string') return undefined;
      const cleaned = url.trim().replace(/[\r\n\t]/g, '');
      return cleaned && cleaned.startsWith('http') ? cleaned : undefined;
    };

    return {
      leaflet: cleanUrl(row['Ulotka']),
      spc: cleanUrl(row['Charakterystyka']),
      labelLeaflet: cleanUrl(row['Etykieto-ulotka']),
      parallelImportLeaflet: cleanUrl(row['Ulotka importu równoległego']),
      parallelImportLabelLeaflet: cleanUrl(row['Etykieto-ulotka importu równoległego']),
      parallelImportPackageMarking: cleanUrl(row['Oznakowanie opakowań importu równoległego']),
      educationalToolsHCP: cleanUrl(row['Narzędzia edukacyjne dla osoby wykonującej zawód medyczny']),
      educationalToolsPatient: cleanUrl(row['Narzędzia edukacyjne dla pacjenta'])
    };
  }
  
  /**
   * Określa status leku
   */
  private static determineStatus(validity: string): 'active' | 'withdrawn' | 'suspended' | 'expired' {
    const normalizedValidity = validity.toLowerCase();
    
    if (normalizedValidity.includes('bezterminowe') || normalizedValidity.includes('ważne')) {
      return 'active';
    }
    
    if (normalizedValidity.includes('wycofane') || normalizedValidity.includes('cofnięte')) {
      return 'withdrawn';
    }
    
    if (normalizedValidity.includes('zawieszone')) {
      return 'suspended';
    }
    
    if (normalizedValidity.includes('wygasłe') || normalizedValidity.includes('nieważne')) {
      return 'expired';
    }
    
    // Sprawdź datę ważności
    const dateMatch = validity.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      const expiryDate = new Date(dateMatch[0]);
      if (expiryDate < new Date()) {
        return 'expired';
      }
    }
    
    return 'active';
  }
  
  /**
   * Generuje terminy wyszukiwania dla leku
   */
  static generateSearchTerms(drug: Partial<EnhancedDrug>): string[] {
    const terms: string[] = [];
    
    // Nazwa handlowa
    if (drug.tradeName) {
      terms.push(drug.tradeName.toLowerCase());
      // Dodaj warianty bez znaków specjalnych
      terms.push(drug.tradeName.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]/g, ''));
      // Dodaj pierwsze słowo
      const firstWord = drug.tradeName.split(' ')[0];
      if (firstWord) terms.push(firstWord.toLowerCase());
    }
    
    // Nazwa powszechnie stosowana
    if (drug.commonName) {
      terms.push(drug.commonName.toLowerCase());
      terms.push(drug.commonName.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]/g, ''));
    }
    
    // Substancje czynne
    if (drug.activeSubstances) {
      drug.activeSubstances.forEach(substance => {
        terms.push(substance.toLowerCase());
        terms.push(substance.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]/g, ''));
      });
    }
    
    // Kod ATC
    if (drug.atcCodeRaw) {
      terms.push(drug.atcCodeRaw.toLowerCase());
    }
    
    // Producent
    if (drug.marketingAuthorization) {
      const producer = drug.marketingAuthorization.toLowerCase();
      terms.push(producer);
      // Dodaj skróty firm
      const words = producer.split(' ');
      if (words.length > 1) {
        const abbreviation = words.map(w => w[0]).join('');
        terms.push(abbreviation);
      }
    }
    
    // Forma farmaceutyczna
    if (drug.pharmaceuticalForm) {
      terms.push(drug.pharmaceuticalForm.toLowerCase());
    }
    
    return [...new Set(terms)]; // Usuń duplikaty
  }
  
  /**
   * Główna funkcja parsująca CSV do EnhancedDrug[]
   */
  static async parseCSVToDrugs(csvContent: string): Promise<EnhancedDrug[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: 'greedy',
        delimiter: ';',
        encoding: 'UTF-8',
        quoteChar: '"',
        escapeChar: '"',
        newline: '\n',
        complete: (results) => {
          try {
            const drugs = results.data.map((row: any, index: number) => {
              const atcCode = this.parseATCCode(row['Kod ATC'] || '');
              const manufacturingInfo = this.parseManufacturingInfo(row);
              const documents = this.parseDocuments(row);
              
              const drug: EnhancedDrug = {
                // Podstawowe informacje
                id: row['Identyfikator Produktu Leczniczego'] || `DRUG_${index}`,
                tradeName: row['Nazwa Produktu Leczniczego'] || '',
                commonName: row['Nazwa powszechnie stosowana'] || '',
                previousName: row['Nazwa poprzednia produktu'] || undefined,
                strength: row['Moc'] || '',
                pharmaceuticalForm: row['Postać farmaceutyczna'] || '',
                
                // Typ i status
                preparationType: row['Rodzaj preparatu'] || 'Ludzki',
                animalUseProhibition: row['Zakaz stosowania u zwierząt'] || undefined,
                
                // Kody i klasyfikacje
                atcCode: atcCode,
                atcCodeRaw: row['Kod ATC'] || '',
                
                // Rejestracja
                registrationNumber: row['Numer pozwolenia'] || '',
                registrationValidity: row['Ważność pozwolenia'] || '',
                procedureType: row['Typ procedury'] || '',
                legalBasis: row['Podstawa prawna wniosku'] || undefined,
                
                // Producent i dystrybucja
                marketingAuthorization: row['Podmiot odpowiedzialny'] || '',
                manufacturingInfo: manufacturingInfo,
                
                // Opakowania i dostępność
                packages: this.parsePackages(row['Opakowanie'] || ''),
                packagesRaw: row['Opakowanie'] || '',
                
                // Substancje czynne
                activeSubstances: this.parseActiveSubstances(row['Substancja czynna'] || ''),
                activeSubstancesRaw: row['Substancja czynna'] || '',
                
                // Droga podania
                administrationRoute: row['Droga podania - Gatunek - Tkanka - Okres karencji'] || '',
                administrationDetails: row['Droga podania - Gatunek - Tkanka - Okres karencji'] || undefined,
                administrationRouteGroup: this.determineAdministrationRouteGroup(row['Droga podania - Gatunek - Tkanka - Okres karencji'] || ''),
                
                // Status i ważność
                status: this.determineStatus(row['Ważność pozwolenia'] || ''),
                expiryDate: undefined, // Może być wypełnione z pola "Ważność pozwolenia"
                
                // Wskazania i przeciwwskazania (początkowo puste, będą wypełnione)
                indications: [],
                contraindications: [],
                warnings: [],
                sideEffects: [],
                
                // Dawkowanie (nie ma w CSV, więc pozostaje puste)
                standardDosage: undefined,
                pediatricDosage: undefined,
                elderlyDosage: undefined,
                renalImpairmentDosage: undefined,
                hepaticImpairmentDosage: undefined,
                
                // Interakcje (nie ma w CSV)
                interactions: [],
                foodInteractions: [],
                
                // Dokumenty
                documents: documents,
                
                // Metadane
                lastUpdated: new Date().toISOString(),
                dataSource: 'URPL',
                
                // Wyszukiwanie i kategoryzacja
                searchTerms: [],
                popularity: 0,
                therapeuticGroup: atcCode.description,
                
                // Dodatkowe informacje (nie ma w CSV)
                storageConditions: undefined,
                shelfLife: undefined,
                specialPrecautions: undefined,
                pregnancyCategory: undefined,
                lactationSafety: undefined,
                drivingImpact: undefined
              };
              
              // Dodaj wskazania ICD-11 na podstawie kodu ATC
              const icd11Indications = getIndicationsForATC(drug.atcCode.code);
              if (icd11Indications) {
                drug.indications = [
                  ...icd11Indications.primaryIndications,
                  ...icd11Indications.secondaryIndications
                ];
              }
              
              // Generuj terminy wyszukiwania
              drug.searchTerms = this.generateSearchTerms(drug);
              
              // Debug: sprawdź czy są dokumenty dla pierwszych kilku leków
              if (index < 5 && (drug.documents.leaflet || drug.documents.spc)) {
                console.log(`🔗 Lek ${drug.tradeName} ma dokumenty:`, {
                  leaflet: drug.documents.leaflet,
                  spc: drug.documents.spc
                });
              }
              
              return drug;
            }).filter((drug: EnhancedDrug) => drug.tradeName.trim() !== '');
            
            console.log(`✅ Sparsowano ${drugs.length} leków z ${results.data.length} wierszy`);
            
            // Debug: sprawdź ile leków ma dokumenty
            const drugsWithLeaflets = drugs.filter(d => d.documents.leaflet).length;
            const drugsWithSPC = drugs.filter(d => d.documents.spc).length;
            console.log(`📄 Leki z ulotkami: ${drugsWithLeaflets}, z charakterystykami: ${drugsWithSPC}`);
            
            resolve(drugs);
          } catch (error) {
            console.error('❌ Błąd podczas parsowania CSV:', error);
            reject(error);
          }
        },
        error: (error) => {
          console.error('❌ Błąd parsera CSV:', error);
          reject(error);
        }
      });
    });
  }
}