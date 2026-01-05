import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaPills, FaSearch, FaTimes, FaBuilding, FaCertificate, 
  FaBarcode, FaFileAlt, FaExchangeAlt, FaInfoCircle, FaExclamationTriangle,
  FaFileMedical
} from 'react-icons/fa';
import * as Papa from 'papaparse';
import { documentParserService } from '../../services/documentParserService';

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
  statusRefundacji: string;
  drogaPodania: string;
  grupaTerapeutyczna?: string;
  substancjeCzynne?: string[];
  documents?: {
    leaflet?: string;
    spc?: string;
    educationalToolsHCP?: string;
    educationalToolsPatient?: string;
  };
}

interface SimpleDrugsPageProps {
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

const SimpleDrugsPage: React.FC<SimpleDrugsPageProps> = ({ darkMode, highContrast, fontSize }) => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'indications' | 'dosage' | 'contraindications' | 'substitutes' | 'documents'>('basic');
  const [currentPage, setCurrentPage] = useState(1);
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

  const loadDrugsData = async () => {
    try {
      // Wyczyść stary cache, aby zmusić do ponownego parsowania z nowymi dokumentami
      localStorage.removeItem(CACHE_KEY);
      setLoading(true);
      
      // Ładowanie z CSV
      console.log('🔄 Ładowanie CSV...');
      const response = await fetch('/bazaleki.csv');
      
      if (!response.ok) {
        throw new Error('Nie można załadować danych');
      }
      
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        delimiter: ';',
        quoteChar: '"',
        escapeChar: '"',
        newline: '\n'
      });
      
      // Funkcja pomocnicza do czyszczenia URL-i
      const cleanUrl = (url: string | undefined): string | undefined => {
        if (!url || typeof url !== 'string') return undefined;
        const cleaned = url.trim().replace(/[\r\n\t]/g, '');
        return cleaned && cleaned.startsWith('http') ? cleaned : undefined;
      };
      
      // Przetwórz WSZYSTKIE dane
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
        statusRefundacji: determineRefundationStatus(row['Opakowanie'] || ''),
        drogaPodania: extractAdministrationRoute(row['Droga podania - Gatunek - Tkanka - Okres karencji'] || ''),
        grupaTerapeutyczna: getTherapeuticGroup((row['Kod ATC'] || '').split(',')[0].trim()),
        substancjeCzynne: (row['Substancja czynna'] || '').split(/[,;]/).map(s => s.trim()).filter(s => s),
        documents: {
          leaflet: cleanUrl(row['Ulotka']),
          spc: cleanUrl(row['Charakterystyka']),
          educationalToolsHCP: cleanUrl(row['Narzędzia edukacyjne dla osoby wykonującej zawód medyczny']),
          educationalToolsPatient: cleanUrl(row['Narzędzia edukacyjne dla pacjenta'])
        }
      })).filter(drug => drug.nazwaProduktu !== 'Brak nazwy');

      // Zapisz do cache
      const cacheData = {
        data: processedDrugs,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      setDrugs(processedDrugs);
      setLoading(false);
      
      // Debug: sprawdź ile leków ma dokumenty
      const drugsWithLeaflets = processedDrugs.filter(d => d.documents.leaflet).length;
      const drugsWithSPC = processedDrugs.filter(d => d.documents.spc).length;
      console.log(`📊 Załadowano ${processedDrugs.length} leków z bazy danych`);
      console.log(`📄 Leki z ulotkami: ${drugsWithLeaflets}, z charakterystykami: ${drugsWithSPC}`);
      
      // Debug: pokaż pierwsze leki z dokumentami
      const firstDrugsWithDocs = processedDrugs.filter(d => d.documents.leaflet || d.documents.spc).slice(0, 3);
      firstDrugsWithDocs.forEach(drug => {
        console.log(`🔗 ${drug.nazwaProduktu} ma dokumenty:`, drug.documents);
      });
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
    return 'Bez recepty (OTC)';
  };

  const extractAdministrationRoute = (route: string): string => {
    if (route.toLowerCase().includes('doustna')) return 'Doustne';
    if (route.toLowerCase().includes('dożylna')) return 'Dożylne';
    if (route.toLowerCase().includes('skórę')) return 'Miejscowe';
    if (route.toLowerCase().includes('nos')) return 'Donosowe';
    return 'Inne';
  };

  // Statystyki
  const stats = useMemo((): DrugStats => {
    const currentStats = {
      total: drugs.length || 0,
      otc: drugs.filter(d => d.statusRefundacji.includes('Bez recepty') || d.statusRefundacji === 'Bez refundacji').length,
      rx: drugs.filter(d => d.statusRefundacji.includes('Refundowane (recepta)') || d.statusRefundacji.includes('Refundowane (apteki)')).length,
      rpz: drugs.filter(d => d.statusRefundacji.includes('Refundowane (szpitale)')).length,
      refunded: drugs.filter(d => !d.statusRefundacji.includes('Bez recepty') && d.statusRefundacji !== 'Bez refundacji').length
    };
    
    return drugs.length > 0 ? currentStats : {
      total: 22418,
      otc: 3718,
      rx: 14353,
      rpz: 2966,
      refunded: 17993
    };
  }, [drugs]);

  // Filtrowanie
  const filteredDrugs = useMemo(() => {
    let filtered = drugs;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(drug => 
        drug.nazwaProduktu.toLowerCase().includes(query) ||
        drug.nazwaPowszechnieStosowana.toLowerCase().includes(query) ||
        drug.podmiotOdpowiedzialny.toLowerCase().includes(query) ||
        drug.kodATC.toLowerCase().includes(query)
      );
    }

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

  // Sample data fallback
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
      drogaPodania: "Doustne",
      documents: {
        leaflet: undefined,
        spc: undefined,
        educationalToolsHCP: undefined,
        educationalToolsPatient: undefined
      }
    }
  ];

  const handleOpenModal = (drug: Drug) => {
    console.log('🔍 Otwieranie modala dla leku:', drug);
    console.log('📄 Dokumenty leku:', drug.documents);
    setSelectedDrug(drug);
    setShowModal(true);
    setActiveTab('basic');
    
    // Załaduj dokumenty
    documentParserService.parseLeaflet(drug.kodATC).then(documents => {
      setDrugDocuments(documents);
    }).catch(error => {
      console.error('Błąd ładowania dokumentów:', error);
      setDrugDocuments(null);
    });
    
    // Znajdź zamienniki
    const foundSubstitutes = drugs.filter(d => 
      d.nazwaPowszechnieStosowana.toLowerCase() === drug.nazwaPowszechnieStosowana.toLowerCase() &&
      d.moc === drug.moc &&
      d.nazwaPostaciFarmaceutycznej.toLowerCase() === drug.nazwaPostaciFarmaceutycznej.toLowerCase() &&
      d.id !== drug.id
    ).slice(0, 10);
    setSubstitutes(foundSubstitutes);
  };

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
        {/* Nagłówek z licznikami */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-6 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            💊 Baza Leków
          </h1>
          
          {/* Statystyki */}
          <div className="grid grid-cols-5 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-blue-500">{stats.total.toLocaleString()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Wszystkie leki
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-green-500">{stats.otc.toLocaleString()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Bez recepty
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-orange-500">{stats.rx.toLocaleString()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Na receptę
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-purple-500">{stats.rpz.toLocaleString()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Szpitalne
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="text-3xl font-bold text-indigo-500">{stats.refunded.toLocaleString()}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refundowane
              </div>
            </div>
          </div>
        </div>

        {/* Wyszukiwarka */}
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

        {/* Licznik wyników */}
        <div className="text-center mb-6">
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Znaleziono <span className="font-bold text-blue-500">{filteredDrugs.length.toLocaleString()}</span> leków
          </p>
        </div>

        {/* Lista leków */}
        <div className="space-y-4 mb-8">
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

      {/* Pełny modal z tabami */}
      {showModal && selectedDrug && (
        <div key={selectedDrug.id}>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Header */}
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

                {/* Taby */}
                <div className="flex space-x-1 mt-6">
                  {[
                    { id: 'basic', label: 'Podstawowe', icon: FaPills },
                    { id: 'indications', label: 'Wskazania', icon: FaFileAlt },
                    { id: 'dosage', label: 'Dawkowanie', icon: FaBarcode },
                    { id: 'contraindications', label: 'Przeciwwskazania', icon: FaCertificate },
                    { id: 'substitutes', label: 'Zamienniki', icon: FaExchangeAlt },
                    { id: 'documents', label: 'Dokumenty', icon: FaFileAlt }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          activeTab === tab.id
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Postać farmaceutyczna:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.nazwaPostaciFarmaceutycznej}
                        </p>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Kod ATC:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.kodATC}
                        </p>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Droga podania:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.drogaPodania}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status refundacji:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.statusRefundacji}
                        </p>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Producent:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.podmiotOdpowiedzialny}
                        </p>
                      </div>
                      <div>
                        <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Numer pozwolenia:
                        </span>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedDrug.numerPozwolenia}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'indications' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Wskazania do stosowania
                    </h3>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start">
                        <FaInfoCircle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Szczegółowe wskazania w dokumentach urzędowych
                          </p>
                          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Pełną listę wskazań do stosowania znajdziesz w ulotce dla pacjenta oraz charakterystyce produktu leczniczego.
                          </p>
                          <div className="space-y-2">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Kod ATC:</strong> <span className="font-mono">{selectedDrug.kodATC}</span>
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Grupa terapeutyczna:</strong> Na podstawie klasyfikacji ATC
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {(selectedDrug.documents?.leaflet || selectedDrug.documents?.spc) && (
                        <div className="mt-4 flex gap-2">
                          {selectedDrug.documents?.leaflet && (
                            <a
                              href={selectedDrug.documents?.leaflet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              <FaFileAlt className="w-3 h-3 mr-1" />
                              Zobacz wskazania w ulotce
                            </a>
                          )}
                          {selectedDrug.documents?.spc && (
                            <a
                              href={selectedDrug.documents?.spc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-green-800 text-green-200 hover:bg-green-700'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              <FaFileMedical className="w-3 h-3 mr-1" />
                              Charakterystyka
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'dosage' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dawkowanie i sposób stosowania
                    </h3>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="grid gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Podstawowe informacje o leku
                          </h4>
                          <div className="space-y-1">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Moc preparatu:</strong> {selectedDrug.moc}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Postać:</strong> {selectedDrug.nazwaPostaciFarmaceutycznej}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Droga podania:</strong> {selectedDrug.drogaPodania}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaInfoCircle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <div>
                            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Dokładne dawkowanie w ulotce
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Szczegółowe informacje o dawkowaniu dla różnych grup pacjentów (dorośli, dzieci, osoby starsze) 
                              oraz sposobie przyjmowania znajdziesz w ulotce dla pacjenta.
                            </p>
                          </div>
                        </div>
                        
                        {selectedDrug.documents?.leaflet && (
                          <div className="flex gap-2">
                            <a
                              href={selectedDrug.documents?.leaflet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              <FaFileAlt className="w-3 h-3 mr-1" />
                              Zobacz dawkowanie w ulotce
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ostrzeżenie */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-start">
                        <FaExclamationTriangle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Ważne
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Dawkowanie określa lekarz. Nie zmieniaj dawkowania bez konsultacji ze specjalistą.
                            Zawsze zapoznaj się z ulotką przed użyciem leku.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contraindications' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Przeciwwskazania i ostrzeżenia
                    </h3>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-start">
                        <FaExclamationTriangle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                        <div>
                          <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Zawsze sprawdź przeciwwskazania w ulotce
                          </p>
                          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Szczegółowe przeciwwskazania, ostrzeżenia i środki ostrożności znajdują się w ulotce dla pacjenta 
                            oraz charakterystyce produktu leczniczego. Przed zastosowaniem leku zawsze zapoznaj się z tymi dokumentami.
                          </p>
                          
                          <div className={`p-3 rounded ${darkMode ? 'bg-red-800/30' : 'bg-red-100'} mt-3`}>
                            <p className={`text-sm font-medium ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                              ⚠️ Podstawowe zasady bezpieczeństwa:
                            </p>
                            <ul className={`text-sm mt-2 space-y-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                              <li>• Sprawdź datę ważności przed użyciem</li>
                              <li>• Nie stosuj, jeśli masz uczulenie na składniki</li>
                              <li>• Skonsultuj się z lekarzem o interakcjach z innymi lekami</li>
                              <li>• Przechowuj zgodnie z instrukcją na opakowaniu</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {(selectedDrug.documents?.leaflet || selectedDrug.documents?.spc) && (
                        <div className="mt-4 flex gap-2">
                          {selectedDrug.documents?.leaflet && (
                            <a
                              href={selectedDrug.documents?.leaflet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-red-800 text-red-200 hover:bg-red-700'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              <FaFileAlt className="w-3 h-3 mr-1" />
                              Sprawdź przeciwwskazania w ulotce
                            </a>
                          )}
                          {selectedDrug.documents?.spc && (
                            <a
                              href={selectedDrug.documents?.spc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-red-800 text-red-200 hover:bg-red-700'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              <FaFileMedical className="w-3 h-3 mr-1" />
                              Charakterystyka produktu
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Dodatkowe ostrzeżenie */}
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-start">
                        <FaExclamationTriangle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Skonsultuj się ze specjalistą
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            W przypadku wątpliwości zawsze skonsultuj się z lekarzem lub farmaceutą. 
                            Nie stosuj leku na własną rękę bez wcześniejszej diagnozy medycznej.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'substitutes' && (
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Zamienniki leku ({substitutes.length})
                    </h3>
                    {substitutes.length > 0 ? (
                      <div className="space-y-3">
                        {substitutes.map((substitute) => (
                          <div
                            key={substitute.id}
                            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                              darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setSelectedDrug(substitute);
                              setActiveTab('basic');
                            }}
                          >
                            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {substitute.nazwaProduktu} {substitute.moc}
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {substitute.podmiotOdpowiedzialny}
                            </p>
                            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                              substitute.statusRefundacji === 'Bez refundacji'
                                ? 'bg-gray-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {substitute.statusRefundacji}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <FaExchangeAlt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Brak dostępnych zamienników</p>
                        <p className="text-sm mt-2">dla {selectedDrug.nazwaPowszechnieStosowana} {selectedDrug.moc}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dokumenty urzędowe
                    </h3>
                    
                    {(selectedDrug.documents?.leaflet || selectedDrug.documents?.spc) ? (
                      <div className="space-y-3">
                        {selectedDrug.documents?.leaflet && (
                          <a
                            href={selectedDrug.documents?.leaflet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-4 rounded-lg border transition-colors ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <FaFileAlt className={`w-6 h-6 mr-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <div>
                              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Ulotka dla pacjenta
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Informacje o stosowaniu, dawkowaniu i przeciwwskazaniach
                              </p>
                            </div>
                          </a>
                        )}
                        
                        {selectedDrug.documents?.spc && (
                          <a
                            href={selectedDrug.documents?.spc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-4 rounded-lg border transition-colors ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <FaFileAlt className={`w-6 h-6 mr-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <div>
                              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Charakterystyka produktu leczniczego
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Szczegółowe informacje dla specjalistów
                              </p>
                            </div>
                          </a>
                        )}
                        
                        {selectedDrug.documents?.educationalToolsHCP && (
                          <a
                            href={selectedDrug.documents?.educationalToolsHCP}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-4 rounded-lg border transition-colors ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <FaFileAlt className={`w-6 h-6 mr-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <div>
                              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Materiały dla personelu medycznego
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Przewodniki i materiały szkoleniowe
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <FaFileAlt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Brak dostępnych dokumentów</p>
                        <p className="text-sm">
                          Dokumenty mogą być dostępne bezpośrednio u producenta lub w rejestrach urzędowych
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDrugsPage;