import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaPills, FaSearch, FaTimes, FaFilter, FaInfoCircle,
  FaChartBar, FaEye, FaExchangeAlt, FaFileAlt,
  FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';
import { globalDataService } from '../../services/globalDataService';
import { EnhancedDrug, DrugSearchFilters, SearchResult } from '../../types/drug';
import DrugDetailModal from '../drug/DrugDetailModal';
import AdvancedDrugFilters from '../drug/AdvancedDrugFilters';

interface EnhancedDrugsPageProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const EnhancedDrugsPage: React.FC<EnhancedDrugsPageProps> = ({
  darkMode,
  highContrast,
  fontSize
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DrugSearchFilters>({
    query: '',
    onlyRefunded: false
  });
  const [searchResults, setSearchResults] = useState<SearchResult>({
    drugs: [],
    totalCount: 0,
    facets: {
      pharmaceuticalForms: [],
      administrationRoutes: [],
      manufacturers: [],
      atcGroups: [],
      activeSubstances: [],
      prescriptionTypes: [],
      countries: []
    }
  });
  const [selectedDrug, setSelectedDrug] = useState<EnhancedDrug | null>(null);
  const [similarDrugs, setSimilarDrugs] = useState<EnhancedDrug[]>([]);
  const [substituteDrugs, setSubstituteDrugs] = useState<EnhancedDrug[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSimilar, setShowSimilar] = useState(false);
  const [showSubstitutes, setShowSubstitutes] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // State dla danych z globalDataService
  const [globalData, setGlobalData] = useState(() => globalDataService.getDrugsData());

  // Nasłuchuj na zmiany w globalDataService
  useEffect(() => {
    const unsubscribe = globalDataService.addListener(() => {
      setGlobalData(globalDataService.getDrugsData());
    });
    return unsubscribe;
  }, []);

  // Pobierz dane leków z lokalnego state
  const { drugs: allDrugs, searchService, isLoaded, isLoading: dataLoading, error: dataError } = globalData;

  useEffect(() => {
    setIsLoading(dataLoading);
    setError(dataError);
  }, [dataLoading, dataError]);

  // Wykonaj wyszukiwanie
  const performSearch = useCallback((searchFilters: DrugSearchFilters) => {
    if (!searchService || !isLoaded) return;

    try {
      const results = searchService.search(searchFilters);
      setSearchResults(results);
      setCurrentPage(1);
    } catch (err) {
      console.error('Błąd wyszukiwania:', err);
      setError('Wystąpił błąd podczas wyszukiwania');
    }
  }, [searchService, isLoaded]);

  // Obsługuj zmianę zapytania wyszukiwania
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, query };
      performSearch(newFilters);
      return newFilters;
    });
  }, [performSearch]);

  // Obsługuj zmianę filtrów
  const handleFiltersChange = useCallback((newFilters: DrugSearchFilters) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.query || '');
    performSearch(newFilters);
  }, [performSearch]);

  // Wykonaj pierwsze wyszukivanie przy załadowaniu danych
  useEffect(() => {
    if (isLoaded && searchService) {
      performSearch(filters);
    }
  }, [isLoaded, searchService]);

  // Paginacja
  const paginatedDrugs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return searchResults.drugs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [searchResults.drugs, currentPage]);

  const totalPages = Math.ceil(searchResults.totalCount / ITEMS_PER_PAGE);

  // Obsługa szczegółów leku
  const handleDrugClick = (drug: EnhancedDrug) => {
    setSelectedDrug(drug);
    setSimilarDrugs([]);
    setSubstituteDrugs([]);
    setShowSimilar(false);
    setShowSubstitutes(false);
  };

  // Funkcja do zamykania DrugDetailModal
  const handleCloseDrugModal = () => {
    setSelectedDrug(null);
    setShowSimilar(false);
    setShowSubstitutes(false);
    setSimilarDrugs([]);
    setSubstituteDrugs([]);
  };

  const handleFindSimilar = (drugId: string) => {
    if (!searchService) return;
    const similar = searchService.getSimilarDrugs(drugId, 10);
    setSimilarDrugs(similar);
    setShowSimilar(true);
  };

  const handleFindSubstitutes = (drugId: string) => {
    if (!searchService) return;
    const substitutes = searchService.getDrugSubstitutes(drugId);
    setSubstituteDrugs(substitutes);
    setShowSubstitutes(true);
  };

  // Renderowanie stanu ładowania
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Ładowanie bazy leków...</p>
          <p className="text-sm mt-2 opacity-70">To może potrwać kilka sekund</p>
        </div>
      </div>
    );
  }

  // Renderowanie błędu
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <div className="text-center">
          <FaExclamationTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-lg">Wystąpił błąd podczas ładowania bazy leków</p>
          <p className="text-sm mt-2 opacity-70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#38b6ff] text-white rounded hover:bg-[#2a9fe5]"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      highContrast 
        ? 'bg-white text-black' 
        : darkMode 
          ? 'bg-black text-white' 
          : 'bg-gray-50 text-black'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaPills className="w-8 h-8 mr-3 text-[#38b6ff]" />
            <div>
              <h1 className={`text-3xl font-bold ${
                fontSize === 'large' ? 'text-4xl' : fontSize === 'small' ? 'text-2xl' : 'text-3xl'
              }`}>
                Baza Leków
              </h1>
              <p className={`mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : 'text-base'}`}>
                Przeszukuj {allDrugs.length.toLocaleString()} leków z kompletnymi informacjami
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Szukaj po nazwie, substancji czynnej, kodzie ATC, EAN..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 rounded-lg border text-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-[#38b6ff] focus:border-transparent`}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-2xl font-bold text-[#38b6ff]">
                {searchResults.totalCount.toLocaleString()}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Znalezionych leków
              </div>
            </div>
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {searchService?.getStatistics().refundedDrugsCount.toLocaleString() || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refundowanych
              </div>
            </div>
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {searchService?.getStatistics().drugsWithEducationalMaterials.toLocaleString() || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Z materiałami
              </div>
            </div>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`p-4 rounded-lg border transition-colors ${
                isFiltersOpen
                  ? darkMode
                    ? 'bg-[#38b6ff]/20 border-[#38b6ff] text-[#38b6ff]'
                    : 'bg-[#38b6ff]/10 border-[#38b6ff] text-[#38b6ff]'
                  : darkMode
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Filtry</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {isFiltersOpen && (
            <div className="lg:col-span-1">
              <AdvancedDrugFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                facets={searchResults.facets}
                totalResults={searchResults.totalCount}
                darkMode={darkMode}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(false)}
              />
            </div>
          )}

          {/* Results */}
          <div className={isFiltersOpen ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Suggestions */}
            {searchResults.suggestions && searchResults.suggestions.length > 0 && (
              <div className={`mb-4 p-4 rounded-lg ${
                darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
              } border`}>
                <p className={`text-sm mb-2 ${
                  darkMode ? 'text-yellow-200' : 'text-yellow-800'
                }`}>
                  Czy chodziło Ci o:
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchResults.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchChange(suggestion)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        darkMode 
                          ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                          : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {paginatedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDrugClick(drug)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {drug.tradeName}
                      </h3>
                      {drug.commonName && (
                        <p className={`text-sm mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {drug.commonName} • {drug.strength}
                        </p>
                      )}
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {drug.pharmaceuticalForm} • {drug.administrationRoute}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {drug.packages.some(pkg => pkg.refundationStatus !== 'none') && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Refundowany
                        </span>
                      )}
                      {drug.documents.educationalToolsHCP && (
                        <FaFileAlt className="w-4 h-4 text-[#38b6ff]" title="Ma materiały edukacyjne" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Substancje czynne:
                      </span>
                      <p className={`mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {drug.activeSubstances.slice(0, 2).join(', ')}
                        {drug.activeSubstances.length > 2 && ` +${drug.activeSubstances.length - 2}`}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Producent:
                      </span>
                      <p className={`mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {drug.marketingAuthorization}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        ATC:
                      </span>
                      <p className={`mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {drug.atcCodeRaw || 'Brak kodu'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {drug.packages.map((pkg, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded ${
                            pkg.prescriptionType === 'OTC'
                              ? 'bg-green-100 text-green-800'
                              : pkg.prescriptionType === 'Rp'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-[#38b6ff]/20 text-[#38b6ff]'
                          }`}
                        >
                          {pkg.prescriptionType}
                        </span>
                      ))}
                    </div>
                    <button className="flex items-center text-sm text-[#38b6ff] hover:text-[#2a9fe5]">
                      <FaEye className="w-4 h-4 mr-1" />
                      Zobacz szczegóły
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded border ${
                      currentPage === 1
                        ? darkMode 
                          ? 'bg-gray-700 text-gray-500 border-gray-600' 
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                        : darkMode
                          ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Poprzednia
                  </button>
                  
                  <span className={`px-4 py-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {currentPage} z {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded border ${
                      currentPage === totalPages
                        ? darkMode 
                          ? 'bg-gray-700 text-gray-500 border-gray-600' 
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                        : darkMode
                          ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Następna
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.totalCount === 0 && !isLoading && (
              <div className="text-center py-12">
                <FaPills className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nie znaleziono leków
                </p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drug Detail Modal */}
        {selectedDrug && (
          <DrugDetailModal
            drug={selectedDrug}
            onClose={handleCloseDrugModal}
            onFindSimilar={handleFindSimilar}
            onFindSubstitutes={handleFindSubstitutes}
            substitutes={substituteDrugs}
            darkMode={darkMode}
          />
        )}

        {/* Similar Drugs Modal */}
        {showSimilar && !selectedDrug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
               onClick={() => setShowSimilar(false)}>
            <div className={`relative w-full max-w-4xl max-h-[80vh] mx-4 rounded-lg shadow-xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
                 onClick={(e) => e.stopPropagation()}>
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Podobne leki ({similarDrugs.length})
                  </h2>
                  <button
                    onClick={() => setShowSimilar(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {similarDrugs.map(drug => (
                    <div
                      key={drug.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedDrug(drug);
                        setShowSimilar(false);
                      }}
                    >
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {drug.tradeName}
                      </h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {drug.commonName} • {drug.strength}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {drug.marketingAuthorization}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Substitutes Modal */}
        {showSubstitutes && !selectedDrug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
               onClick={() => setShowSubstitutes(false)}>
            <div className={`relative w-full max-w-4xl max-h-[80vh] mx-4 rounded-lg shadow-xl overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
                 onClick={(e) => e.stopPropagation()}>
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Zamienniki ({substituteDrugs.length})
                  </h2>
                  <button
                    onClick={() => setShowSubstitutes(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {substituteDrugs.length > 0 ? (
                  <div className="space-y-4">
                    {substituteDrugs.map(drug => (
                      <div
                        key={drug.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedDrug(drug);
                          setShowSubstitutes(false);
                        }}
                      >
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {drug.tradeName}
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {drug.commonName} • {drug.strength}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {drug.marketingAuthorization}
                        </p>
                        <div className="mt-2 flex gap-2">
                          {drug.packages.map((pkg, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded ${
                                pkg.refundationStatus !== 'none'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {pkg.prescriptionType}
                              {pkg.refundationStatus !== 'none' && ' (Refundowany)'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaExchangeAlt className={`w-12 h-12 mx-auto mb-4 ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nie znaleziono zamienników dla tego leku
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Zamienniki to leki o identycznych substancjach czynnych, mocy i postaci farmaceutycznej
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDrugsPage;