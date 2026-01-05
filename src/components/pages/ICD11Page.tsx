import React, { useState, useEffect } from 'react';
import { FaSearch, FaTable, FaTimes, FaDatabase, FaRocket, FaSpinner } from 'react-icons/fa';
import { ICD11Service, ICD11Entity } from '../../services/icd11Service';
import { globalDataService } from '../../services/globalDataService';

interface ICD11PageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ICD11Page: React.FC<ICD11PageProps> = ({ darkMode, fontSize }) => {
  // Użyj globalnego cache
  const [cacheData, setCacheData] = useState(() => globalDataService.getICD11Data());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEntities, setFilteredEntities] = useState<ICD11Entity[]>([]);
  const [totalEntities, setTotalEntities] = useState(0);

  const itemsPerPage = 50;

  // Subskrypcja do zmian w globalnym cache
  useEffect(() => {
    const unsubscribe = globalDataService.addListener(() => {
      setCacheData(globalDataService.getICD11Data());
    });

    return unsubscribe;
  }, []);

  // Handle search and filtering on cached data
  useEffect(() => {
    if (!cacheData.data.length) {
      setFilteredEntities([]);
      setTotalEntities(0);
      return;
    }

    // Convert globalDataService data to ICD11Entity format
    const entities: ICD11Entity[] = cacheData.data.map((item, index) => ({
      id: `icd11_${index}`,
      who_id: `icd11_${index}`,
      code: item.code,
      title: item.name,
      description: null,
      version: '2022-02',
      generated_at: new Date().toISOString()
    }));

    let filtered = entities;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = entities.filter(entity =>
        entity.code.toLowerCase().includes(searchLower) ||
        entity.title.toLowerCase().includes(searchLower) ||
        (entity.description && entity.description.toLowerCase().includes(searchLower))
      );
    }

    setTotalEntities(filtered.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredEntities(filtered.slice(startIndex, startIndex + itemsPerPage));
  }, [cacheData.data, searchTerm, currentPage]);

  const totalPages = Math.ceil(totalEntities / itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          tableHeader: 'text-sm',
          tableCell: 'text-sm',
          inputText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          tableHeader: 'text-lg',
          tableCell: 'text-lg',
          inputText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          tableHeader: 'text-base',
          tableCell: 'text-base',
          inputText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  useEffect(() => {
    document.title = 'ICD-11 - Międzynarodowa Klasyfikacja Chorób | DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'ICD-11 - najnowsza międzynarodowa klasyfikacja chorób WHO po polsku. Wyszukaj kody i diagnozy.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'ICD-11 - Międzynarodowa Klasyfikacja Chorób | DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Przeszukuj bazę ICD-11 po polsku. Kody chorób i diagnoz według najnowszej klasyfikacji WHO.');
    }
  }, []);

  // Loading state - pokazuj tylko jeśli kompletnie brak danych
  if (!cacheData.isLoaded && cacheData.isLoading) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-[#38b6ff] rounded-lg flex items-center justify-center">
                <FaSpinner className="text-white text-2xl animate-spin" />
              </div>
            </div>
            <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Ładowanie ICD-11...
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Pierwsze uruchomienie - ładowanie klasyfikacji chorób...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - tylko jeśli brak danych i błąd
  if (!cacheData.isLoaded && cacheData.error) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
              Błąd ładowania
            </h1>
            <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {cacheData.error}
            </p>
            
            <button
              onClick={() => globalDataService.forceReload('icd11')}
              className={`mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#38b6ff] rounded-lg flex items-center justify-center">
              {cacheData.isLoaded ? (
                <FaDatabase className="text-white text-2xl" />
              ) : (
                <FaTable className="text-white text-2xl" />
              )}
            </div>
          </div>
          <h1 className={`font-bold ${fontSizes.title} ${darkMode ? 'text-white' : 'text-black'} mb-4`}>
            ICD-11 - Międzynarodowa Klasyfikacja Chorób
            {!cacheData.isLoaded && cacheData.isLoading && (
              <span className="ml-3 inline-flex items-center gap-2 text-sm">
                <FaSpinner className="animate-spin w-4 h-4" />
                Aktualizacja w tle...
              </span>
            )}
          </h1>
          <p className={`${fontSizes.subtitle} ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            Najnowsza 11. rewizja Międzynarodowej Klasyfikacji Chorób WHO po polsku. 
            Wyszukaj kody i diagnozy w najaktualniejszej klasyfikacji.
          </p>
          
          
          {/* Stats */}
          <div className="flex justify-center mt-6 space-x-6">
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-2xl font-bold text-[#38b6ff]">{cacheData.data.length.toLocaleString()}</div>
              <div className="text-sm">Jednostek chorobowych</div>
            </div>
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-2xl font-bold text-[#38b6ff]">{totalEntities.toLocaleString()}</div>
              <div className="text-sm">Wyników wyszukiwania</div>
            </div>
            <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="text-2xl font-bold text-[#38b6ff]">11</div>
              <div className="text-sm">Wersja WHO</div>
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-[#38b6ff] rounded-full"></div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-8">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaSearch className="inline mr-2 text-[#38b6ff]" />
              Wyszukaj w ICD-11
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Szukaj po kodzie lub nazwie choroby..."
                className={`w-full px-4 py-4 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.inputText} ${
                  darkMode
                    ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Table */}
          <div className={`rounded-lg shadow-lg overflow-hidden ${
            darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Table Header */}
            <div className={`px-6 py-4 border-b ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`${fontSizes.tableHeader} font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Wyniki wyszukiwania ({totalEntities.toLocaleString()})
                </h2>
                {cacheData.isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#38b6ff]"></div>
                )}
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left ${fontSizes.tableHeader} font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } uppercase tracking-wider`}>
                      Kod
                    </th>
                    <th className={`px-6 py-3 text-left ${fontSizes.tableHeader} font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } uppercase tracking-wider`}>
                      Nazwa choroby
                    </th>
                    <th className={`px-6 py-3 text-left ${fontSizes.tableHeader} font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } uppercase tracking-wider`}>
                      Opis
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredEntities.length > 0 ? (
                    filteredEntities.map((entity) => (
                      <tr 
                        key={entity.id}
                        className={`transition-colors duration-200 ${
                          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-6 py-4 whitespace-nowrap ${fontSizes.tableCell}`}>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#38b6ff] text-black">
                            {entity.code}
                          </span>
                        </td>
                        <td className={`px-6 py-4 ${fontSizes.tableCell} ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {entity.title}
                        </td>
                        <td className={`px-6 py-4 ${fontSizes.tableCell} ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {entity.description || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={3} 
                        className={`px-6 py-16 text-center ${fontSizes.tableCell} ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-4xl mb-4">🔍</div>
                          <p className="font-medium mb-2">Nie znaleziono wyników</p>
                          <p className="text-sm">Spróbuj zmienić kryteria wyszukiwania</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-6 py-4 border-t ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Strona {currentPage} z {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#38b6ff] hover:text-black'
                      } ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Poprzednia
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-[#38b6ff] hover:text-black'
                      } ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Następna
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className={`mt-8 rounded-lg p-6 ${
          darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            O klasyfikacji ICD-11
          </h3>
          <div className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } space-y-2`}>
            <p>
              • ICD-11 to najnowsza (11.) rewizja Międzynarodowej Klasyfikacji Chorób WHO z 2022 roku
            </p>
            <p>
              • Zawiera aktualne kody i diagnozy chorób zgodnie z najnowszymi standardami medycznymi
            </p>
            <p>
              • Wyszukiwanie dostępne według kodu choroby, nazwy lub opisu
            </p>
            <p>
              • Dane są ładowane z globalnego cache dla natychmiastowego dostępu
            </p>
            <p>
              • Cache jest automatycznie odświeżany co 24 godziny
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICD11Page;