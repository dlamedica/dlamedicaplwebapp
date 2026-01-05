import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaPills, FaSearch, FaTimes, FaBuilding, FaCertificate, 
  FaBarcode, FaFileAlt, FaExchangeAlt
} from 'react-icons/fa';
import * as Papa from 'papaparse';
import { documentParserService } from '../../services/documentParserService';
import { getIndicationsForATC } from '../../data/atcToIcd11Mapping';
import DrugDetailedDescription from '../drug/DrugDetailedDescription';
import VirtualizedDrugsList from '../drug/VirtualizedDrugsList';

// Cache configuration
const CACHE_KEY = 'dlamedica_drugs_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 godziny
const ITEMS_PER_PAGE = 20;

interface Drug {
  id: string;
  nazwaProduktu: string;
  nazwaPowszechnieStosowana: string;
  moc: string;
  nazwaPostaciFarmaceutycznej: string;
  kodATC: string;
  opakowanie: string;
  podmiotOdpowiedzialny: string;
  numerPozwolenia: string;
  waznoscPozwolenia: string;
  ulotka?: string;
  charakterystyka?: string;
  statusRefundacji: string;
  drogaPodania: string;
}

interface NewDrugsPageProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface DrugStats {
  total: number;
  otc: number;
  rx: number;
  rpz: number;
  refunded: number;
}

// Opisy grup terapeutycznych na podstawie ATC
const atcGroupDescriptions: Record<string, string> = {
  // Główne grupy (pierwszy znak)
  'A': 'Lek gastroenterologiczny',
  'B': 'Lek hematologiczny', 
  'C': 'Lek kardiologiczny',
  'D': 'Lek dermatologiczny',
  'G': 'Lek ginekologiczno-urologiczny',
  'H': 'Lek hormonalny',
  'J': 'Antybiotyk lub lek przeciwzakaźny',
  'L': 'Lek przeciwnowotworowy',
  'M': 'Lek przeciwbólowy i przeciwzapalny',
  'N': 'Lek neurologiczny lub psychiatryczny',
  'P': 'Lek przeciwpasożytniczy',
  'R': 'Lek pulmonologiczny',
  'S': 'Lek okulistyczny lub otolaryngologiczny',
  'V': 'Różne preparaty',
  
  // Szczegółowe podgrupy (3 znaki)
  'M01': 'Niesteroidowy lek przeciwzapalny (NLPZ)',
  'M01A': 'Niesteroidowy lek przeciwzapalny',
  'M01AE': 'NLPZ z grupy pochodnych kwasu propionowego',
  'J01': 'Antybiotyk',
  'J01C': 'Antybiotyk beta-laktamowy',
  'J01CA': 'Penicyliny',
  'N02': 'Lek przeciwbólowy',
  'N02B': 'Nieopioidowy lek przeciwbólowy',
  'N02BE': 'Anilidy (paracetamol)',
  'C07': 'Lek beta-adrenolityczny',
  'C09': 'Lek na nadciśnienie',
  'A11': 'Witaminy',
  'A11C': 'Witaminy A i D',
  'A11CC': 'Witamina D i analogi',
  'D03': 'Preparat na rany i owrzodzenia',
  'D03A': 'Cicatrisant',
  'D03AX': 'Inne preparaty wspomagające gojenie'
};


const NewDrugsPage: React.FC<NewDrugsPageProps> = ({ darkMode, highContrast, fontSize }) => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'indications' | 'dosage' | 'contraindications' | 'substitutes' | 'documents'>('basic');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDrugs, setTotalDrugs] = useState(22418); // Rzeczywista liczba z bazy
  const [drugDocuments, setDrugDocuments] = useState<any>(null);
  const [substitutes, setSubstitutes] = useState<Drug[]>([]);
  
  // Filtry w jednej linii
  const [filters, setFilters] = useState({
    pharmaceuticalForm: '',
    administrationRoute: '',
    atcGroup: '',
    refundationStatus: ''
  });

  // Ładowanie danych z cache lub CSV
  useEffect(() => {
    loadDrugsData();
  }, []);

  // Debug statystyki
  useEffect(() => {
    if (drugs.length > 0) {
      console.log('🔍 STATYSTYKI DEBUG:', {
        totalLoaded: drugs.length,
        totalExpected: 22418,
        sampleDrugs: drugs.slice(0, 3).map(d => ({ name: d.nazwaProduktu, atc: d.kodATC })),
        statusBreakdown: {
          otc: drugs.filter(d => d.statusRefundacji.includes('Bez recepty') || d.statusRefundacji === 'Bez refundacji').length,
          rx: drugs.filter(d => d.statusRefundacji.includes('Refundowane (recepta)') || d.statusRefundacji.includes('Refundowane (apteki)')).length,
          rpz: drugs.filter(d => d.statusRefundacji.includes('Refundowane (szpitale)')).length
        }
      });
    }
  }, [drugs]);

  const loadDrugsData = async () => {
    try {
      // NATYCHMIASTOWE ładowanie z cache jeśli istnieje
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Załaduj natychmiast, bez względu na wiek cache dla lepszego UX
        console.log(`⚡ Natychmiastowe ładowanie ${data.length} leków z cache`);
        setDrugs(data);
        setTotalDrugs(data.length);
        setLoading(false);
        
        // Jeśli cache jest świeży, nie ładuj ponownie
        if (Date.now() - timestamp < CACHE_DURATION) {
          return;
        }
        
        // Jeśli cache jest stary, ładuj w tle (ale nie blokuj UI)
        console.log('🔄 Cache jest stary, aktualizacja w tle...');
      } else {
        setLoading(true);
      }
      
      // Jeśli nie ma cache, załaduj z CSV
      console.log('🔄 Ładowanie CSV...');
      const response = await fetch('/bazaleki.csv');
      
      if (!response.ok) {
        throw new Error('Nie można załadować danych');
      }
      
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';'
      });
      
      // Przetwórz WSZYSTKIE dane - pełną bazę 22,418 leków
      const processedDrugs = parsedData.data.map((row: any, index: number) => ({
        id: row['Identyfikator Produktu Leczniczego'] || `drug-${index}`,
        nazwaProduktu: row['Nazwa Produktu Leczniczego'] || 'Brak nazwy',
        nazwaPowszechnieStosowana: row['Nazwa powszechnie stosowana'] || '',
        moc: row['Moc'] || '',
        nazwaPostaciFarmaceutycznej: row['Postać farmaceutyczna'] || '',
        kodATC: (row['Kod ATC'] || '').split(',')[0].trim(),
        opakowanie: row['Opakowanie'] || '',
        podmiotOdpowiedzialny: row['Podmiot odpowiedzialny'] || '',
        numerPozwolenia: row['Numer pozwolenia'] || '',
        waznoscPozwolenia: row['Ważność pozwolenia'] || '',
        ulotka: row['Ulotka'] || `https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${row['Identyfikator Produktu Leczniczego']}/leaflet`,
        charakterystyka: row['Charakterystyka'] || `https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${row['Identyfikator Produktu Leczniczego']}/characteristic`,
        statusRefundacji: determineRefundationStatus(row['Opakowanie'] || ''),
        drogaPodania: extractAdministrationRoute(row['Droga podania - Gatunek - Tkanka - Okres karencji'] || '')
      })).filter(drug => drug.nazwaProduktu !== 'Brak nazwy');

      // Zapisz do cache
      const cacheData = {
        data: processedDrugs,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      setDrugs(processedDrugs);
      setTotalDrugs(processedDrugs.length);
      setLoading(false);
      
      console.log(`📊 Załadowano ${processedDrugs.length} leków z bazy danych`);
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
      setLoading(false);
      // Fallback data
      setDrugs(sampleDrugs);
    }
  };

  const determineRefundationStatus = (packaging: string): string => {
    const pack = packaging.toLowerCase();
    if (pack.includes('rpz')) return 'Refundowane (szpitale)';
    if (pack.includes('rp') && !pack.includes('rpz')) return 'Refundowane (recepta)';
    if (pack.includes('lz')) return 'Lek zaprogramowany';
    if (pack.includes('otc')) return 'Bez recepty (OTC)';
    // Sprawdź czy w ogóle wymaga recepty na podstawie nazwy
    if (pack.includes('tabletki') || pack.includes('kapsułki') || pack.includes('syrop')) {
      return 'Bez recepty (OTC)';
    }
    return 'Bez recepty (OTC)';
  };

  const extractAdministrationRoute = (route: string): string => {
    if (route.toLowerCase().includes('doustna')) return 'Doustne';
    if (route.toLowerCase().includes('dożylna')) return 'Dożylne';
    if (route.toLowerCase().includes('skórę')) return 'Miejscowe';
    if (route.toLowerCase().includes('nos')) return 'Donosowe';
    return 'Inne';
  };

  // Statystyki - poprawione liczby według analizy
  const stats = useMemo((): DrugStats => {
    const currentStats = {
      total: drugs.length || 0,
      otc: drugs.filter(d => d.statusRefundacji.includes('Bez recepty') || d.statusRefundacji === 'Bez refundacji').length,
      rx: drugs.filter(d => d.statusRefundacji.includes('Refundowane (recepta)') || d.statusRefundacji.includes('Refundowane (apteki)')).length,
      rpz: drugs.filter(d => d.statusRefundacji.includes('Refundowane (szpitale)')).length,
      refunded: drugs.filter(d => !d.statusRefundacji.includes('Bez recepty') && d.statusRefundacji !== 'Bez refundacji').length
    };
    
    // Jeśli dane są załadowane, pokaż rzeczywiste statystyki
    // W przeciwnym razie pokaż liczby z analizy bazy
    return drugs.length > 0 ? currentStats : {
      total: 22418,
      otc: 3718,     // Bez recepty (OTC)
      rx: 14353,     // Na receptę
      rpz: 2966,     // Recepta szpitalna
      refunded: 17993 // Wszystkie refundowane (rx + rpz + lz)
    };
  }, [drugs]);

  // Filtrowanie
  const filteredDrugs = useMemo(() => {
    let filtered = drugs;

    // Wyszukiwanie
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(drug => 
        drug.nazwaProduktu.toLowerCase().includes(query) ||
        drug.nazwaPowszechnieStosowana.toLowerCase().includes(query) ||
        drug.podmiotOdpowiedzialny.toLowerCase().includes(query) ||
        drug.kodATC.toLowerCase().includes(query)
      );
    }

    // Filtry
    if (filters.pharmaceuticalForm) {
      filtered = filtered.filter(drug => 
        drug.nazwaPostaciFarmaceutycznej.toLowerCase().includes(filters.pharmaceuticalForm.toLowerCase())
      );
    }

    if (filters.administrationRoute) {
      filtered = filtered.filter(drug => drug.drogaPodania === filters.administrationRoute);
    }

    if (filters.atcGroup) {
      filtered = filtered.filter(drug => drug.kodATC.startsWith(filters.atcGroup));
    }

    if (filters.refundationStatus) {
      if (filters.refundationStatus === 'refunded') {
        filtered = filtered.filter(drug => drug.statusRefundacji !== 'Bez refundacji');
      } else if (filters.refundationStatus === 'none') {
        filtered = filtered.filter(drug => drug.statusRefundacji === 'Bez refundacji');
      }
    }

    return filtered;
  }, [drugs, searchQuery, filters]);

  // Paginacja
  const paginatedDrugs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDrugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDrugs, currentPage]);

  const totalPages = Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE);

  // Wyszukiwanie zamienników - ulepszone
  const findSubstitutes = (drug: Drug): Drug[] => {
    const exactMatches = drugs.filter(d => 
      // Dokładnie ta sama substancja czynna
      d.nazwaPowszechnieStosowana.toLowerCase() === drug.nazwaPowszechnieStosowana.toLowerCase() &&
      // Ta sama moc
      d.moc === drug.moc &&
      // Ta sama postać farmaceutyczna
      d.nazwaPostaciFarmaceutycznej.toLowerCase() === drug.nazwaPostaciFarmaceutycznej.toLowerCase() &&
      // Inny produkt
      d.id !== drug.id
    );

    // Jeśli znaleziono dokładne dopasowania, zwróć je
    if (exactMatches.length > 0) {
      return exactMatches.slice(0, 10);
    }

    // Jeśli nie ma dokładnych, szukaj podobnych (tylko substancja i postać)
    const similarMatches = drugs.filter(d => 
      d.nazwaPowszechnieStosowana.toLowerCase() === drug.nazwaPowszechnieStosowana.toLowerCase() &&
      d.nazwaPostaciFarmaceutycznej.toLowerCase() === drug.nazwaPostaciFarmaceutycznej.toLowerCase() &&
      d.id !== drug.id
    );

    return similarMatches.slice(0, 10);
  };

  // Generowanie opisu leku na podstawie ATC
  const generateDrugDescription = (drug: Drug): string => {
    const atcCode = drug.kodATC;
    if (!atcCode) return 'Produkt leczniczy';
    
    // Sprawdź dokładny kod (5 znaków)
    if (atcGroupDescriptions[atcCode]) {
      return atcGroupDescriptions[atcCode];
    }
    
    // Sprawdź podgrupę (3 znaki)
    const subgroup = atcCode.substring(0, 3);
    if (atcGroupDescriptions[subgroup]) {
      return atcGroupDescriptions[subgroup];
    }
    
    // Sprawdź główną grupę (1 znak)
    const mainGroup = atcCode.substring(0, 1);
    if (atcGroupDescriptions[mainGroup]) {
      return atcGroupDescriptions[mainGroup];
    }
    
    return 'Produkt leczniczy';
  };

  // Pobieranie wskazań ICD-11 - używa rozszerzonego mapowania
  const getIcd11Indications = (atcCode: string) => {
    const indications = getIndicationsForATC(atcCode);
    if (indications) {
      // Konwertuj format z nowego mapowania na stary format dla kompatybilności
      const allIndications = [
        ...indications.primaryIndications.map(ind => ({ code: ind.code, description: ind.name })),
        ...indications.secondaryIndications.map(ind => ({ code: ind.code, description: `${ind.name} (wskazanie dodatkowe)` }))
      ];
      return allIndications;
    }
    return [];
  };

  const clearFilters = () => {
    setFilters({
      pharmaceuticalForm: '',
      administrationRoute: '',
      atcGroup: '',
      refundationStatus: ''
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return searchQuery || filters.pharmaceuticalForm || filters.administrationRoute || 
           filters.atcGroup || filters.refundationStatus;
  };

  // Funkcja do ładowania danych leku
  const loadDrugData = useCallback(async (drug: Drug) => {
    try {
      console.log('Ładowanie danych dla leku:', drug.nazwaProduktu, 'ATC:', drug.kodATC);
      
      // Załaduj dokumenty - próbuj z pełnym ID, potem z ATC
      let documents;
      try {
        documents = await documentParserService.parseLeaflet(drug.id);
      } catch {
        documents = await documentParserService.parseLeaflet(drug.kodATC);
      }
      
      console.log('Załadowane dokumenty:', documents);
      setDrugDocuments(documents);

      // Znajdź zamienniki
      const foundSubstitutes = findSubstitutes(drug);
      console.log('Znalezione zamienniki:', foundSubstitutes.length);
      setSubstitutes(foundSubstitutes);
    } catch (error) {
      console.error('Błąd ładowania danych leku:', error);
      setDrugDocuments(null);
      setSubstitutes([]);
    }
  }, [drugs]);

  // Handler dla otwierania modalu
  const handleOpenModal = useCallback((drug: Drug) => {
    setSelectedDrug(drug);
    setShowModal(true);
    setActiveTab('basic');
    loadDrugData(drug);
  }, [loadDrugData]);

  // Handler dla przełączania między lekami w modal
  const handleSwitchDrug = useCallback((drug: Drug) => {
    setSelectedDrug(drug);
    setActiveTab('basic');
    loadDrugData(drug);
  }, [loadDrugData]);

  // Sample data fallback - więcej przykładowych leków do testowania
  const sampleDrugs: Drug[] = [
    {
      id: "PL001",
      nazwaProduktu: "Apap",
      nazwaPowszechnieStosowana: "Paracetamolum",
      moc: "500 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      kodATC: "N02BE01",
      opakowanie: "20 tabletek",
      podmiotOdpowiedzialny: "US Pharmacia Sp. z o.o.",
      numerPozwolenia: "R/1234/2020",
      waznoscPozwolenia: "2030-12-31",
      statusRefundacji: "Bez refundacji",
      drogaPodania: "Doustne"
    },
    {
      id: "PL002",
      nazwaProduktu: "Ibuprofen",
      nazwaPowszechnieStosowana: "Ibuprofen",
      moc: "400 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      kodATC: "M01AE01",
      opakowanie: "30 tabletek",
      podmiotOdpowiedzialny: "Polpharma S.A.",
      numerPozwolenia: "R/5678/2021",
      waznoscPozwolenia: "2031-12-31",
      statusRefundacji: "Refundowane (apteki)",
      drogaPodania: "Doustne"
    },
    {
      id: "PL003",
      nazwaProduktu: "Amoxicillin Sandoz",
      nazwaPowszechnieStosowana: "Amoxicillinum",
      moc: "500 mg",
      nazwaPostaciFarmaceutycznej: "Kapsułki twarde",
      kodATC: "J01CA04",
      opakowanie: "21 kapsułek",
      podmiotOdpowiedzialny: "Sandoz Pharmaceuticals",
      numerPozwolenia: "R/9999/2020",
      waznoscPozwolenia: "2030-06-30",
      statusRefundacji: "Refundowane (apteki)",
      drogaPodania: "Doustne"
    },
    {
      id: "PL004",
      nazwaProduktu: "Panadol",
      nazwaPowszechnieStosowana: "Paracetamolum",
      moc: "500 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      kodATC: "N02BE01",
      opakowanie: "12 tabletek",
      podmiotOdpowiedzialny: "GlaxoSmithKline",
      numerPozwolenia: "R/4444/2021",
      waznoscPozwolenia: "2032-12-31",
      statusRefundacji: "Bez refundacji",
      drogaPodania: "Doustne"
    },
    {
      id: "PL005",
      nazwaProduktu: "Ibufen",
      nazwaPowszechnieStosowana: "Ibuprofen",
      moc: "400 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      kodATC: "M01AE01",
      opakowanie: "20 tabletek",
      podmiotOdpowiedzialny: "Hasco-Lek S.A.",
      numerPozwolenia: "R/7777/2022",
      waznoscPozwolenia: "2033-06-30",
      statusRefundacji: "Bez refundacji",
      drogaPodania: "Doustne"
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <FaPills className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ładowanie bazy leków...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Nagłówek z licznikami - wyrównany */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-6 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            💊 Baza Leków
          </h1>
          
          {/* Statystyki w jednej linii - wyrównane */}
          <div className="grid grid-cols-5 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-blue-500">{stats.total}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Wszystkie leki
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-green-500">{stats.otc}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                OTC
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-orange-500">{stats.rx}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Na receptę
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-purple-500">{stats.rpz}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Szpitalne
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-indigo-500">{stats.refunded}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refundowane
              </div>
            </div>
          </div>
        </div>

        {/* Wyszukiwarka - centrowana */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po nazwie, substancji czynnej, producencie lub kodzie ATC..."
              className={`w-full pl-12 pr-12 py-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filtry w jednej linii - poprawiony wygląd bez strzałek */}
        <div className="mb-6">
          <div className="flex gap-4 max-w-5xl mx-auto">
            <select
              value={filters.pharmaceuticalForm}
              onChange={(e) => setFilters(prev => ({ ...prev, pharmaceuticalForm: e.target.value }))}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-blue-500 shadow-md`}
            >
              <option value="">Postać farmaceutyczna</option>
              <option value="tabletki">Tabletki</option>
              <option value="kapsułki">Kapsułki</option>
              <option value="syrop">Syrop</option>
              <option value="krople">Krople</option>
              <option value="maść">Maść</option>
              <option value="zawiesina">Zawiesina</option>
              <option value="roztwór">Roztwór</option>
            </select>

            <select
              value={filters.administrationRoute}
              onChange={(e) => setFilters(prev => ({ ...prev, administrationRoute: e.target.value }))}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-blue-500 shadow-md`}
            >
              <option value="">Droga podania</option>
              <option value="Doustne">Doustne</option>
              <option value="Dożylne">Dożylne</option>
              <option value="Miejscowe">Miejscowe</option>
              <option value="Donosowe">Donosowe</option>
              <option value="Inne">Inne</option>
            </select>

            <select
              value={filters.atcGroup}
              onChange={(e) => setFilters(prev => ({ ...prev, atcGroup: e.target.value }))}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-blue-500 shadow-md`}
            >
              <option value="">Grupa ATC</option>
              <option value="A">A - Przewód pokarmowy</option>
              <option value="B">B - Krew</option>
              <option value="C">C - Układ krążenia</option>
              <option value="D">D - Dermatologia</option>
              <option value="J">J - Leki przeciwzakaźne</option>
              <option value="M">M - Układ mięśniowo-szkieletowy</option>
              <option value="N">N - Układ nerwowy</option>
              <option value="R">R - Układ oddechowy</option>
            </select>

            <select
              value={filters.refundationStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, refundationStatus: e.target.value }))}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-blue-500 shadow-md`}
            >
              <option value="">Status refundacji</option>
              <option value="all">Wszystkie</option>
              <option value="refunded">Refundowane</option>
              <option value="none">Bez refundacji</option>
            </select>
          </div>

          {/* Przycisk czyszczenia filtrów */}
          {hasActiveFilters() && (
            <div className="text-center mt-4">
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 flex items-center gap-2 mx-auto"
              >
                <FaTimes className="w-4 h-4" />
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>

        {/* Licznik wyników */}
        <div className="text-center mb-6">
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Znaleziono <span className="font-bold text-blue-500">{filteredDrugs.length}</span> leków
          </p>
        </div>

        {/* Lista leków - zoptymalizowana wydajność */}
        <div className="mb-8">
          {filteredDrugs.length > 100 && paginatedDrugs.length > 0 ? (
            /* Wirtualizacja dla dużej liczby wyników */
            <>
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ⚡ Widok zoptymalizowany dla {filteredDrugs.length.toLocaleString()} wyników
                </span>
              </div>
              <VirtualizedDrugsList 
                drugs={paginatedDrugs} 
                onDrugClick={handleOpenModal}
                darkMode={darkMode}
                generateDrugDescription={generateDrugDescription}
              />
            </>
          ) : (
            /* Standardowa lista dla mniejszych wyników */
            <div className="space-y-4">
              {paginatedDrugs.length > 0 ? (
                paginatedDrugs.map((drug) => (
                  <div
                    key={drug.id}
                    className={`grid grid-cols-12 gap-4 p-4 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                        : 'bg-white border-gray-200 hover:shadow-lg'
                    } transition-all cursor-pointer shadow-md`}
                    onClick={() => handleOpenModal(drug)}
                  >
                    {/* Nazwa i substancja - 5 kolumn */}
                    <div className="col-span-5">
                      <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {drug.nazwaProduktu} {drug.moc}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {drug.nazwaPowszechnieStosowana} • {drug.nazwaPostaciFarmaceutycznej}
                      </p>
                      <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {generateDrugDescription(drug)}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        <FaBuilding className="inline w-3 h-3 mr-1" />
                        {drug.podmiotOdpowiedzialny.substring(0, 30)}...
                      </p>
                    </div>

                    {/* Informacje kliniczne - 3 kolumny */}
                    <div className="col-span-3 flex items-center">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {drug.kodATC}
                        </span>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {drug.drogaPodania}
                        </p>
                      </div>
                    </div>

                    {/* Status refundacji - 2 kolumny */}
                    <div className="col-span-2 flex items-center">
                      <div className={`text-sm font-medium flex items-center ${
                        drug.statusRefundacji === 'Bez refundacji' 
                          ? 'text-gray-500'
                          : drug.statusRefundacji.includes('szpitale')
                          ? 'text-purple-500'
                          : 'text-green-500'
                      }`}>
                        <FaCertificate className="inline w-4 h-4 mr-2" />
                        {drug.statusRefundacji}
                      </div>
                    </div>

                    {/* Przycisk akcji - 2 kolumny */}
                    <div className="col-span-2 flex items-center justify-end">
                      <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } w-full`}>
                        Zobacz szczegóły
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    💊
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Nie znaleziono leków
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Spróbuj zmienić kryteria wyszukiwania
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-900'
              } border shadow-md transition-colors`}
            >
              Poprzednia
            </button>
            
            <span className={`px-4 py-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Strona {currentPage} z {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-900'
              } border shadow-md transition-colors`}
            >
              Następna
            </button>
          </div>
        )}
      </div>

      {/* Modal szczegółów leku */}
      {showModal && selectedDrug && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Nagłówek */}
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedDrug.nazwaProduktu} {selectedDrug.moc}
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedDrug.nazwaPowszechnieStosowana}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Zakładki - przeprojektowane */}
              <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {[
                  { id: 'basic', label: 'Podstawowe' },
                  { id: 'indications', label: 'Wskazania ICD-11' },
                  { id: 'dosage', label: 'Dawkowanie' },
                  { id: 'contraindications', label: 'Przeciwwskazania' },
                  { id: 'substitutes', label: `Zamienniki (${substitutes.length})` },
                  { id: 'documents', label: 'Dokumenty' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? `border-b-2 border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                        : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Zawartość zakładek */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'basic' && (
                  <DrugDetailedDescription drug={selectedDrug} darkMode={darkMode} />
                )}

                {activeTab === 'indications' && (
                  <div className="space-y-4">
                    {(() => {
                      const indications = getIcd11Indications(selectedDrug.kodATC);
                      return indications.length > 0 ? (
                        indications.map((indication, idx) => (
                          <div key={idx} className={`p-4 rounded-lg ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <div className="flex items-center gap-3">
                              <span className={`font-mono text-sm font-medium px-2 py-1 rounded ${
                                darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {indication.code}
                              </span>
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {indication.description}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Brak zdefiniowanych wskazań ICD-11 dla kodu ATC: {selectedDrug.kodATC}
                        </p>
                      );
                    })()}
                  </div>
                )}

                {activeTab === 'dosage' && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {drugDocuments?.dawkowanie || 'Ładowanie informacji o dawkowaniu...'}
                    </p>
                  </div>
                )}

                {activeTab === 'contraindications' && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                      {drugDocuments?.przeciwwskazania || 'Ładowanie informacji o przeciwwskazaniach...'}
                    </p>
                  </div>
                )}

                {activeTab === 'substitutes' && (
                  <div className="space-y-4">
                    {substitutes.length > 0 ? (
                      substitutes.map((substitute, idx) => (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                              darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => handleSwitchDrug(substitute)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {substitute.nazwaProduktu} {substitute.moc}
                                </h5>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {substitute.podmiotOdpowiedzialny}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'
                                  }`}>
                                    Ta sama substancja
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    Ta sama moc
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center flex-col gap-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaExchangeAlt className="text-blue-500" />
                                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Zamiennik
                                  </span>
                                </div>
                                <button 
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    darkMode
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSwitchDrug(substitute);
                                  }}
                                >
                                  Zobacz szczegóły
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                            Nie znaleziono zamienników dla tego leku
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Zamienniki to leki o tej samej substancji czynnej, mocy i postaci farmaceutycznej
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {selectedDrug.ulotka && (
                      <a
                        href={selectedDrug.ulotka}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          darkMode 
                            ? 'border-gray-700 hover:bg-gray-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <FaFileAlt className="text-blue-500 text-xl" />
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Ulotka dla pacjenta
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Oficjalny dokument z rejestru produktów leczniczych
                          </p>
                        </div>
                      </a>
                    )}
                    
                    {selectedDrug.charakterystyka && (
                      <a
                        href={selectedDrug.charakterystyka}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-4 rounded-lg border ${
                          darkMode 
                            ? 'border-gray-700 hover:bg-gray-700' 
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <FaFileAlt className="text-blue-500 text-xl" />
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Charakterystyka produktu leczniczego (ChPL)
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Szczegółowe informacje dla profesjonalistów
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDrugsPage;