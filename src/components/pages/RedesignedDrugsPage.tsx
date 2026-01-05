import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaPills, FaSearch, FaFilter, FaTimes, FaChevronDown,
  FaHeart, FaHeartBroken, FaExchangeAlt, FaFileAlt,
  FaBarcode, FaBuilding, FaSyringe, FaCertificate
} from 'react-icons/fa';
import { globalDataService } from '../../services/globalDataService';
import { drugDocumentService } from '../../services/drugDocumentService';
import { atcToIcd11Service } from '../../services/atcToIcd11Service';
import { drugSubstitutesService } from '../../services/drugSubstitutesService';
import { EnhancedDrug, DrugSearchFilters, SearchResult } from '../../types/drug';

interface RedesignedDrugsPageProps {
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

const RedesignedDrugsPage: React.FC<RedesignedDrugsPageProps> = ({
  darkMode,
  highContrast,
  fontSize
}) => {
  // Stan danych
  const [cacheData, setCacheData] = useState(() => globalDataService.getDrugsData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<EnhancedDrug | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Filtry - przeprojektowane
  const [filters, setFilters] = useState<DrugSearchFilters>({
    query: '',
    pharmaceuticalForm: undefined,
    administrationRoute: undefined,
    atcGroup: undefined,
    refundationStatus: 'all',
    onlyRefunded: false
  });

  // Stan UI
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'indications' | 'dosage' | 'contraindications' | 'substitutes' | 'documents'>('basic');
  const [currentPage, setCurrentPage] = useState(1);
  const drugsPerPage = 20;

  // Inicjalizacja
  useEffect(() => {
    const unsubscribe = globalDataService.addListener(() => {
      setCacheData(globalDataService.getDrugsData());
    });

    drugDocumentService.initialize();
    loadFavorites();
    
    return unsubscribe;
  }, []);

  // Ładowanie ulubionych
  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('drug_favorites');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Zapisywanie ulubionych
  const saveFavorites = useCallback((newFavorites: Set<string>) => {
    try {
      localStorage.setItem('drug_favorites', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Wyszukiwanie z filtrami
  const searchResults = useMemo(() => {
    if (!cacheData.searchService) {
      return { drugs: [], totalCount: 0, facets: {} } as SearchResult;
    }

    const searchFilters = {
      ...filters,
      query: searchQuery
    };

    return cacheData.searchService.search(searchFilters);
  }, [cacheData.searchService, filters, searchQuery]);

  // Statystyki
  const stats = useMemo((): DrugStats => {
    const drugs = searchResults.drugs;
    return {
      total: drugs.length,
      otc: drugs.filter(d => d.packages.some(p => p.prescriptionType === 'OTC')).length,
      rx: drugs.filter(d => d.packages.some(p => p.prescriptionType === 'Rp')).length,
      rpz: drugs.filter(d => d.packages.some(p => p.prescriptionType === 'Rpz')).length,
      refunded: drugs.filter(d => d.packages.some(p => p.refundationStatus !== 'none')).length
    };
  }, [searchResults]);

  // Paginacja
  const paginatedDrugs = useMemo(() => {
    const startIndex = (currentPage - 1) * drugsPerPage;
    return searchResults.drugs.slice(startIndex, startIndex + drugsPerPage);
  }, [searchResults.drugs, currentPage]);

  const totalPages = Math.ceil(searchResults.totalCount / drugsPerPage);

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((key: keyof DrugSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleDrugSelect = useCallback((drug: EnhancedDrug) => {
    setSelectedDrug(drug);
    setShowDetails(true);
    setActiveTab('basic');
  }, []);

  const handleToggleFavorite = useCallback((drugId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(drugId)) {
      newFavorites.delete(drugId);
    } else {
      newFavorites.add(drugId);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      onlyRefunded: false,
      refundationStatus: 'all'
    });
    setSearchQuery('');
  }, []);

  // Renderowanie
  if (!cacheData.isLoaded && cacheData.isLoading) {
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
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Przetwarzanie {cacheData.drugs.length} leków
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Nagłówek ze statystykami */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Baza Leków
          </h1>
          
          {/* Statystyki w jednej linii */}
          <div className="grid grid-cols-5 gap-4">
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="text-2xl font-bold text-blue-500">{stats.total}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Wszystkie leki
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="text-2xl font-bold text-green-500">{stats.otc}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                OTC
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="text-2xl font-bold text-orange-500">{stats.rx}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Na receptę
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="text-2xl font-bold text-purple-500">{stats.rpz}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Szpitalne
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="text-2xl font-bold text-indigo-500">{stats.refunded}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refundowane
              </div>
            </div>
          </div>
        </div>

        {/* Wyszukiwarka */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Szukaj po nazwie, substancji czynnej lub producencie..."
              className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filtry w jednej linii */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            {/* Postać farmaceutyczna */}
            <select
              value={filters.pharmaceuticalForm || ''}
              onChange={(e) => handleFilterChange('pharmaceuticalForm', e.target.value || undefined)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Postać farmaceutyczna ▼</option>
              <option value="tabletki">Tabletki</option>
              <option value="kapsulki">Kapsułki</option>
              <option value="syrop">Syrop</option>
              <option value="krople">Krople</option>
              <option value="masc">Maść</option>
              <option value="zawiesina">Zawiesina</option>
              <option value="roztwor">Roztwór</option>
              <option value="aerozol">Aerozol</option>
            </select>

            {/* Droga podania */}
            <select
              value={filters.administrationRoute || ''}
              onChange={(e) => handleFilterChange('administrationRoute', e.target.value || undefined)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Droga podania ▼</option>
              <option value="oral">Doustna</option>
              <option value="parenteral">Pozajelitowa</option>
              <option value="topical">Miejscowa</option>
              <option value="inhalation">Wziewna</option>
              <option value="other">Inna</option>
            </select>

            {/* Grupa ATC */}
            <select
              value={filters.atcGroup || ''}
              onChange={(e) => handleFilterChange('atcGroup', e.target.value || undefined)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Grupa ATC ▼</option>
              <option value="A">A - Przewód pokarmowy</option>
              <option value="B">B - Krew</option>
              <option value="C">C - Układ krążenia</option>
              <option value="D">D - Dermatologia</option>
              <option value="G">G - Układ moczowo-płciowy</option>
              <option value="H">H - Hormony</option>
              <option value="J">J - Leki przeciwzakaźne</option>
              <option value="L">L - Leki przeciwnowotworowe</option>
              <option value="M">M - Układ mięśniowo-szkieletowy</option>
              <option value="N">N - Układ nerwowy</option>
              <option value="P">P - Leki przeciwpasożytnicze</option>
              <option value="R">R - Układ oddechowy</option>
              <option value="S">S - Narządy zmysłów</option>
              <option value="V">V - Różne</option>
            </select>

            {/* Status refundacji */}
            <select
              value={filters.refundationStatus || 'all'}
              onChange={(e) => handleFilterChange('refundationStatus', e.target.value as any)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Status refundacji ▼</option>
              <option value="refunded">Refundowane</option>
              <option value="partial">Częściowo refundowane</option>
              <option value="none">Bez refundacji</option>
            </select>
          </div>

          {/* Przycisk czyszczenia filtrów */}
          {(searchQuery || filters.pharmaceuticalForm || filters.administrationRoute || 
            filters.atcGroup || filters.refundationStatus !== 'all') && (
            <div className="mt-2 text-right">
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 ml-auto"
              >
                <FaTimes className="w-3 h-3" />
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>

        {/* Lista leków - wyrównana siatka */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {paginatedDrugs.map((drug) => (
            <DrugListItem
              key={drug.id}
              drug={drug}
              onSelect={handleDrugSelect}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(drug.id)}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
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
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Następna
            </button>
          </div>
        )}
      </div>

      {/* Modal szczegółów leku */}
      {showDetails && selectedDrug && (
        <DrugDetailsModal
          drug={selectedDrug}
          onClose={() => setShowDetails(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          allDrugs={cacheData.drugs}
        />
      )}
    </div>
  );
};

// Komponent pojedynczego leku na liście
const DrugListItem: React.FC<{
  drug: EnhancedDrug;
  onSelect: (drug: EnhancedDrug) => void;
  onToggleFavorite: (drugId: string) => void;
  isFavorite: boolean;
  darkMode: boolean;
}> = ({ drug, onSelect, onToggleFavorite, isFavorite, darkMode }) => {
  const refundationStatus = drug.packages.some(p => p.refundationStatus === 'refunded')
    ? 'Refundowany'
    : drug.packages.some(p => p.refundationStatus === 'partial')
    ? 'Częściowo refundowany'
    : 'Bez refundacji';

  const refundationColor = refundationStatus === 'Refundowany'
    ? 'text-green-500'
    : refundationStatus === 'Częściowo refundowany'
    ? 'text-yellow-500'
    : 'text-gray-500';

  return (
    <div className={`grid grid-cols-12 gap-4 p-4 rounded-lg border ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-200 hover:shadow-md'
    } transition-all cursor-pointer`}
    onClick={() => onSelect(drug)}
    >
      {/* Nazwa i substancja - 5 kolumn */}
      <div className="col-span-5">
        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {drug.tradeName} {drug.strength}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {drug.commonName} • {drug.pharmaceuticalForm}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <FaBuilding className="inline w-3 h-3 mr-1" />
          {drug.manufacturer}
        </p>
      </div>

      {/* Informacje kliniczne - 3 kolumny */}
      <div className="col-span-3 flex items-center">
        <div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
          }`}>
            {drug.atcCode.code}
          </span>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FaSyringe className="inline w-3 h-3 mr-1" />
            {drug.administrationRoute}
          </p>
        </div>
      </div>

      {/* Status refundacji - 2 kolumny */}
      <div className="col-span-2 flex items-center">
        <div className={`text-sm font-medium ${refundationColor}`}>
          <FaCertificate className="inline w-4 h-4 mr-1" />
          {refundationStatus}
        </div>
      </div>

      {/* Akcje - 2 kolumny */}
      <div className="col-span-2 flex items-center justify-end gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(drug.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            isFavorite
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          {isFavorite ? <FaHeart /> : <FaHeartBroken />}
        </button>
        
        <button className={`px-4 py-2 rounded-lg font-medium ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
          Zobacz szczegóły
        </button>
      </div>
    </div>
  );
};

// Modal szczegółów leku
const DrugDetailsModal: React.FC<{
  drug: EnhancedDrug;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
  darkMode: boolean;
  allDrugs: EnhancedDrug[];
}> = ({ drug, onClose, activeTab, onTabChange, darkMode, allDrugs }) => {
  const [indications, setIndications] = useState<any[]>([]);
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any>({ leaflet: [], characteristic: [] });

  // Pobierz wskazania ICD-11
  useEffect(() => {
    const icd11Indications = atcToIcd11Service.getIndicationsForATC(drug.atcCode.code);
    setIndications(icd11Indications);
  }, [drug]);

  // Znajdź zamienniki
  useEffect(() => {
    const foundSubstitutes = drugSubstitutesService.findSubstitutes(drug, allDrugs);
    setSubstitutes(foundSubstitutes);
  }, [drug, allDrugs]);

  // Pobierz dokumenty
  useEffect(() => {
    const fetchDocuments = async () => {
      const [leaflet, characteristic] = await Promise.all([
        drugDocumentService.fetchLeaflet(drug.id),
        drugDocumentService.fetchCharacteristic(drug.id)
      ]);
      setDocuments({ leaflet, characteristic });
    };
    fetchDocuments();
  }, [drug]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Nagłówek */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {drug.tradeName} {drug.strength}
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {drug.commonName}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zakładki */}
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
                onClick={() => onTabChange(tab.id)}
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
              <div className="space-y-4">
                <InfoRow label="Postać farmaceutyczna" value={drug.pharmaceuticalForm} darkMode={darkMode} />
                <InfoRow label="Droga podania" value={drug.administrationRoute} darkMode={darkMode} />
                <InfoRow label="Kod ATC" value={`${drug.atcCode.code} - ${drug.atcCode.description}`} darkMode={darkMode} />
                <InfoRow label="Producent" value={drug.manufacturer} darkMode={darkMode} />
                <InfoRow label="Status" value={drug.status === 'active' ? 'Aktywny' : 'Wycofany'} darkMode={darkMode} />
                
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Opakowania ({drug.packages.length})
                  </h4>
                  <div className="space-y-2">
                    {drug.packages.map((pkg, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {pkg.packageSize} • {pkg.prescriptionType}
                          </span>
                          <span className={`text-sm font-medium ${
                            pkg.refundationStatus === 'refunded' ? 'text-green-500' :
                            pkg.refundationStatus === 'partial' ? 'text-yellow-500' :
                            'text-gray-500'
                          }`}>
                            {pkg.refundationStatus === 'refunded' ? 'Refundowany' :
                             pkg.refundationStatus === 'partial' ? 'Częściowo' :
                             'Bez refundacji'}
                          </span>
                        </div>
                        {pkg.ean && (
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FaBarcode className="inline w-3 h-3 mr-1" />
                            {pkg.ean}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'indications' && (
              <div className="space-y-4">
                {indications.length > 0 ? (
                  indications.map((indication, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-sm font-medium ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {indication.code}
                        </span>
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {indication.description}
                        </span>
                      </div>
                      <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kategoria: {indication.category}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Brak zdefiniowanych wskazań ICD-11 dla tego kodu ATC
                  </p>
                )}
              </div>
            )}

            {activeTab === 'dosage' && (
              <div>
                {documents.leaflet.find((s: any) => s.title === 'Dawkowanie') ? (
                  <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {documents.leaflet.find((s: any) => s.title === 'Dawkowanie').content}
                  </div>
                ) : (
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Informacje o dawkowaniu będą dostępne po pobraniu ulotki
                  </p>
                )}
              </div>
            )}

            {activeTab === 'contraindications' && (
              <div>
                {documents.leaflet.find((s: any) => s.title === 'Przeciwwskazania') ? (
                  <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {documents.leaflet.find((s: any) => s.title === 'Przeciwwskazania').content}
                  </div>
                ) : (
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Informacje o przeciwwskazaniach będą dostępne po pobraniu ulotki
                  </p>
                )}
              </div>
            )}

            {activeTab === 'substitutes' && (
              <div className="space-y-4">
                {substitutes.length > 0 ? (
                  <>
                    {drugSubstitutesService.groupSubstitutesByCategory(substitutes).exact.length > 0 && (
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Dokładne zamienniki
                        </h4>
                        {drugSubstitutesService.groupSubstitutesByCategory(substitutes).exact.map((sub, idx) => (
                          <SubstituteItem key={idx} substitute={sub} darkMode={darkMode} />
                        ))}
                      </div>
                    )}
                    
                    {drugSubstitutesService.groupSubstitutesByCategory(substitutes).compatible.length > 0 && (
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Kompatybilne zamienniki
                        </h4>
                        {drugSubstitutesService.groupSubstitutesByCategory(substitutes).compatible.map((sub, idx) => (
                          <SubstituteItem key={idx} substitute={sub} darkMode={darkMode} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nie znaleziono zamienników dla tego leku
                  </p>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <a
                  href={`https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${drug.id}/leaflet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-4 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <FaFileAlt className="text-blue-500" />
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Ulotka dla pacjenta
                  </span>
                </a>
                
                <a
                  href={`https://rejestrymedyczne.ezdrowie.gov.pl/api/rpl/medicinal-products/${drug.id}/characteristic`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-4 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <FaFileAlt className="text-blue-500" />
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Charakterystyka produktu leczniczego (ChPL)
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponenty pomocnicze
const InfoRow: React.FC<{
  label: string;
  value: string;
  darkMode: boolean;
}> = ({ label, value, darkMode }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
    <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {label}:
    </span>
    <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

const SubstituteItem: React.FC<{
  substitute: any;
  darkMode: boolean;
}> = ({ substitute, darkMode }) => (
  <div className={`p-4 rounded-lg mb-2 ${
    darkMode ? 'bg-gray-700' : 'bg-gray-100'
  }`}>
    <div className="flex justify-between items-start">
      <div>
        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {substitute.drug.tradeName} {substitute.drug.strength}
        </h5>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {substitute.drug.manufacturer}
        </p>
        <div className="flex gap-2 mt-1">
          {substitute.matchReasons.map((reason: string, idx: number) => (
            <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {reason}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FaExchangeAlt className="text-blue-500" />
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {substitute.matchScore}% dopasowania
        </span>
      </div>
    </div>
  </div>
);

export default RedesignedDrugsPage;