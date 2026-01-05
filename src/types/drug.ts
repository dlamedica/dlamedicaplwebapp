// Rozbudowane typy dla systemu leków

export interface DrugPackage {
  ean: string;
  prescriptionType: 'Rp' | 'Rpz' | 'Rpw' | 'OTC' | 'Lz' | string;
  registrationNumber: string;
  description: string;
  size: string;
  refundationStatus: 'refunded' | 'partial' | 'none';
  refundationPercentage?: number;
  price?: number;
  refundationPrice?: number;
  patientPayment?: number;
}

export interface ATCCode {
  code: string;
  level1: string; // A - Przewód pokarmowy i metabolizm
  level2: string; // A10 - Leki stosowane w cukrzycy
  level3: string; // A10B - Leki hipoglikemizujące z wyjątkiem insulin
  level4: string; // A10BA - Biguanidy
  level5: string; // A10BA02 - Metformina
  description: string;
}

export interface ICD11Indication {
  code: string;
  name: string;
  category: 'primary' | 'secondary' | 'off-label';
}

export interface DrugInteraction {
  drugName: string;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
}

export interface DrugDocuments {
  leaflet?: string; // Ulotka
  spc?: string; // Charakterystyka produktu leczniczego
  labelLeaflet?: string; // Etykieto-ulotka
  parallelImportLeaflet?: string; // Ulotka importu równoległego
  parallelImportLabelLeaflet?: string; // Etykieto-ulotka importu równoległego
  parallelImportPackageMarking?: string; // Oznakowanie opakowań importu równoległego
  educationalToolsHCP?: string; // Narzędzia edukacyjne dla osoby wykonującej zawód medyczny
  educationalToolsPatient?: string; // Narzędzia edukacyjne dla pacjenta
}

export interface DrugManufacturingInfo {
  manufacturer?: string;
  manufacturerCountry?: string;
  importer?: string;
  importerCountry?: string;
  manufacturerImporter?: string;
  manufacturerImporterCountry?: string;
  responsibleEntityExportCountry?: string;
  exportCountry?: string;
}

export interface EnhancedDrug {
  // Podstawowe informacje
  id: string; // Identyfikator Produktu Leczniczego
  tradeName: string; // Nazwa Produktu Leczniczego
  commonName: string; // Nazwa powszechnie stosowana (INN)
  previousName?: string; // Nazwa poprzednia produktu
  strength: string; // Moc
  pharmaceuticalForm: string; // Postać farmaceutyczna
  
  // Typ i status
  preparationType: string; // Rodzaj preparatu (Ludzki/Weterynaryjny)
  animalUseProhibition?: string; // Zakaz stosowania u zwierząt
  
  // Kody i klasyfikacje
  atcCode: ATCCode;
  atcCodeRaw: string; // Oryginalny kod ATC z CSV
  
  // Rejestracja
  registrationNumber: string; // Numer pozwolenia
  registrationValidity: string; // Ważność pozwolenia
  procedureType: string; // Typ procedury (DCP, MRP, narodowa, etc.)
  legalBasis?: string; // Podstawa prawna wniosku
  
  // Producent i dystrybucja  
  marketingAuthorization: string; // Podmiot odpowiedzialny
  manufacturingInfo: DrugManufacturingInfo;
  
  // Opakowania i dostępność
  packages: DrugPackage[];
  packagesRaw: string; // Surowe dane o opakowaniach
  
  // Substancje czynne
  activeSubstances: string[];
  activeSubstancesRaw: string; // Surowe dane o substancjach
  
  // Droga podania
  administrationRoute: string; // Droga podania
  administrationDetails?: string; // Droga podania - Gatunek - Tkanka - Okres karencji
  administrationRouteGroup: 'oral' | 'parenteral' | 'topical' | 'inhalation' | 'rectal' | 'vaginal' | 'ophthalmic' | 'auricular' | 'nasal' | 'other';
  
  // Status i ważność
  status: 'active' | 'withdrawn' | 'suspended' | 'expired';
  expiryDate?: string;
  
  // Wskazania i przeciwwskazania
  indications: ICD11Indication[];
  contraindications: string[];
  warnings: string[];
  sideEffects?: string[];
  
  // Dawkowanie
  standardDosage?: string;
  pediatricDosage?: string;
  elderlyDosage?: string;
  renalImpairmentDosage?: string;
  hepaticImpairmentDosage?: string;
  
  // Interakcje
  interactions: DrugInteraction[];
  foodInteractions?: string[];
  
  // Dokumenty
  documents: DrugDocuments;
  
  // Metadane
  lastUpdated: string;
  dataSource: 'URPL' | 'EMA' | 'other';
  
  // Wyszukiwanie i kategoryzacja
  searchTerms: string[]; // Pre-processed search terms
  popularity: number; // Scoring for search ranking
  therapeuticGroup?: string; // Grupa terapeutyczna
  
  // Dodatkowe informacje
  storageConditions?: string;
  shelfLife?: string;
  specialPrecautions?: string;
  pregnancyCategory?: 'A' | 'B' | 'C' | 'D' | 'X' | 'N';
  lactationSafety?: 'safe' | 'caution' | 'contraindicated' | 'unknown';
  drivingImpact?: 'none' | 'minor' | 'major' | 'unknown';
}

export interface DrugSearchFilters {
  query: string;
  pharmaceuticalForm?: string[];
  administrationRoute?: string[];
  prescriptionType?: string[];
  atcGroup?: string;
  atcLevel?: 1 | 2 | 3 | 4 | 5;
  manufacturer?: string;
  activeSubstance?: string;
  refundationStatus?: 'all' | 'refunded' | 'partial' | 'none';
  onlyRefunded?: boolean;
  preparationType?: 'human' | 'veterinary' | 'all';
  hasEducationalMaterials?: boolean;
  registrationStatus?: 'active' | 'all';
  country?: string;
  procedureType?: string[];
}

export interface SearchResult {
  drugs: EnhancedDrug[];
  totalCount: number;
  facets: {
    pharmaceuticalForms: { name: string; count: number }[];
    administrationRoutes: { name: string; count: number }[];
    manufacturers: { name: string; count: number }[];
    atcGroups: { code: string; name: string; count: number }[];
    activeSubstances: { name: string; count: number }[];
    prescriptionTypes: { type: string; count: number }[];
    countries: { name: string; count: number }[];
  };
  suggestions?: string[]; // Sugestie dla błędnie wpisanych nazw
}

// Mapowanie ATC do ICD-11
export interface ATCToICD11Mapping {
  [atcCode: string]: {
    primaryIndications: ICD11Indication[];
    secondaryIndications: ICD11Indication[];
  };
}

// Hierarchia ATC dla browsera
export interface ATCHierarchy {
  level1: { [key: string]: { name: string; level2: ATCLevel2 } };
}

export interface ATCLevel2 {
  [key: string]: { name: string; level3: ATCLevel3 };
}

export interface ATCLevel3 {
  [key: string]: { name: string; level4: ATCLevel4 };
}

export interface ATCLevel4 {
  [key: string]: { name: string; level5: ATCLevel5 };
}

export interface ATCLevel5 {
  [key: string]: { name: string };
}

// Statystyki leków
export interface DrugStatistics {
  totalDrugs: number;
  byPharmaceuticalForm: { [form: string]: number };
  byAdministrationRoute: { [route: string]: number };
  byPrescriptionType: { [type: string]: number };
  byATCLevel1: { [code: string]: { name: string; count: number } };
  topManufacturers: { name: string; count: number }[];
  topActiveSubstances: { name: string; count: number }[];
  refundedDrugsCount: number;
  drugsWithEducationalMaterials: number;
}

// Cache dla optymalizacji
export interface DrugCache {
  timestamp: number;
  drugs: EnhancedDrug[];
  statistics: DrugStatistics;
  atcHierarchy: ATCHierarchy;
  searchIndex: Map<string, string[]>; // term -> drug IDs
}