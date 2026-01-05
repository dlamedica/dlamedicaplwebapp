import React, { useState, useEffect } from 'react';
import { DrugSearchFilters, SearchResult } from '../../types/drug';
import { 
  FaFilter, FaTimes, FaChevronDown, FaChevronUp, 
  FaSearch, FaCapsules, FaSyringe, FaIndustry,
  FaMoneyBillWave, FaGlobe, FaFileAlt, FaPills,
  FaPrescriptionBottleAlt, FaCode, FaCog
} from 'react-icons/fa';

interface AdvancedDrugFiltersProps {
  filters: DrugSearchFilters;
  onFiltersChange: (filters: DrugSearchFilters) => void;
  facets?: SearchResult['facets'];
  totalResults: number;
  darkMode: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const AdvancedDrugFilters: React.FC<AdvancedDrugFiltersProps> = ({
  filters,
  onFiltersChange,
  facets,
  totalResults,
  darkMode,
  isOpen = true,
  onToggle
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleFilterChange = (key: keyof DrugSearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const handleMultiSelectChange = (
    key: keyof DrugSearchFilters, 
    value: string, 
    checked: boolean
  ) => {
    const currentValues = (filters[key] as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      query: filters.query, // Zachowaj tylko zapytanie
      onlyRefunded: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.pharmaceuticalForm?.length) count += filters.pharmaceuticalForm.length;
    if (filters.administrationRoute?.length) count += filters.administrationRoute.length;
    if (filters.prescriptionType?.length) count += filters.prescriptionType.length;
    if (filters.atcGroup) count++;
    if (filters.manufacturer) count++;
    if (filters.activeSubstance) count++;
    if (filters.refundationStatus && filters.refundationStatus !== 'all') count++;
    if (filters.preparationType && filters.preparationType !== 'all') count++;
    if (filters.hasEducationalMaterials) count++;
    if (filters.registrationStatus && filters.registrationStatus !== 'all') count++;
    if (filters.country) count++;
    if (filters.procedureType?.length) count += filters.procedureType.length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const administrationRouteLabels: { [key: string]: string } = {
    'oral': 'Doustna',
    'parenteral': 'Pozajelitowa',
    'topical': 'Miejscowa',
    'inhalation': 'Wziewna',
    'rectal': 'Doodbytnicza',
    'vaginal': 'Dopochwowa',
    'ophthalmic': 'Do oczu',
    'auricular': 'Do ucha',
    'nasal': 'Do nosa',
    'other': 'Inna'
  };

  const prescriptionTypeLabels: { [key: string]: string } = {
    'Rp': 'Rp - Recepta',
    'Rpz': 'Rpz - Do zastrzeżonego stosowania',
    'Rpw': 'Rpw - Weterynaryjna',
    'OTC': 'OTC - Bez recepty',
    'Lz': 'Lz - Lek zapasowy'
  };

  if (!isOpen) {
    return (
      <div className={`p-4 border rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <FaFilter className="w-4 h-4 mr-2" />
            <span className="font-medium">Filtry</span>
            {activeFiltersCount > 0 && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                'bg-[#38b6ff]/20 text-[#38b6ff]'
              }`}>
                {activeFiltersCount}
              </span>
            )}
          </div>
          <FaChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaFilter className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Filtry
            </h3>
            <span className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {totalResults} wyników
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  darkMode 
                    ? 'text-[#38b6ff] hover:bg-gray-700' 
                    : 'text-[#38b6ff] hover:bg-gray-100'
                }`}
              >
                Wyczyść ({activeFiltersCount})
              </button>
            )}
            {onToggle && (
              <button
                onClick={onToggle}
                className={`p-1 rounded transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Refundacja - zawsze dostępna */}
        <section>
          <button
            onClick={() => toggleSection('refundation')}
            className={`flex items-center justify-between w-full mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <h4 className="font-medium flex items-center">
              <FaMoneyBillWave className="w-4 h-4 mr-2" />
              Refundacja
            </h4>
            {expandedSections.has('refundation') ? 
              <FaChevronUp className="w-4 h-4" /> : 
              <FaChevronDown className="w-4 h-4" />
            }
          </button>
          {expandedSections.has('refundation') && (
            <div className="space-y-2">
              <label className={`flex items-center cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="radio"
                  name="refundation"
                  checked={!filters.refundationStatus || filters.refundationStatus === 'all'}
                  onChange={() => handleFilterChange('refundationStatus', 'all')}
                  className="mr-2"
                />
                <span>Wszystkie</span>
              </label>
              <label className={`flex items-center cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="radio"
                  name="refundation"
                  checked={filters.refundationStatus === 'refunded'}
                  onChange={() => handleFilterChange('refundationStatus', 'refunded')}
                  className="mr-2"
                />
                <span>Tylko refundowane</span>
              </label>
              <label className={`flex items-center cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="radio"
                  name="refundation"
                  checked={filters.refundationStatus === 'none'}
                  onChange={() => handleFilterChange('refundationStatus', 'none')}
                  className="mr-2"
                />
                <span>Bez refundacji</span>
              </label>
            </div>
          )}
        </section>

        {/* Forma farmaceutyczna */}
        {facets?.pharmaceuticalForms && facets.pharmaceuticalForms.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('form')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaPills className="w-4 h-4 mr-2" />
                Postać farmaceutyczna
              </h4>
              {expandedSections.has('form') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('form') && (
              <div className="space-y-2">
                {facets.pharmaceuticalForms.slice(0, 10).map(form => (
                  <label
                    key={form.name}
                    className={`flex items-center cursor-pointer ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.pharmaceuticalForm?.includes(form.name) || false}
                      onChange={(e) => handleMultiSelectChange(
                        'pharmaceuticalForm',
                        form.name,
                        e.target.checked
                      )}
                      className="mr-2 rounded"
                    />
                    <span className="flex-1">{form.name}</span>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ({form.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Droga podania */}
        {facets?.administrationRoutes && facets.administrationRoutes.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('route')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaSyringe className="w-4 h-4 mr-2" />
                Droga podania
              </h4>
              {expandedSections.has('route') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('route') && (
              <div className="space-y-2">
                {facets.administrationRoutes.map(route => (
                  <label
                    key={route.name}
                    className={`flex items-center cursor-pointer ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.administrationRoute?.includes(
                        Object.keys(administrationRouteLabels).find(
                          key => administrationRouteLabels[key] === route.name
                        ) || route.name
                      ) || false}
                      onChange={(e) => {
                        const value = Object.keys(administrationRouteLabels).find(
                          key => administrationRouteLabels[key] === route.name
                        ) || route.name;
                        handleMultiSelectChange(
                          'administrationRoute',
                          value,
                          e.target.checked
                        );
                      }}
                      className="mr-2 rounded"
                    />
                    <span className="flex-1">{route.name}</span>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ({route.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Typ recepty */}
        {facets?.prescriptionTypes && facets.prescriptionTypes.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('prescription')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaPrescriptionBottleAlt className="w-4 h-4 mr-2" />
                Dostępność
              </h4>
              {expandedSections.has('prescription') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('prescription') && (
              <div className="space-y-2">
                {facets.prescriptionTypes.map(type => (
                  <label
                    key={type.type}
                    className={`flex items-center cursor-pointer ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.prescriptionType?.includes(type.type) || false}
                      onChange={(e) => handleMultiSelectChange(
                        'prescriptionType',
                        type.type,
                        e.target.checked
                      )}
                      className="mr-2 rounded"
                    />
                    <span className="flex-1">
                      {prescriptionTypeLabels[type.type] || type.type}
                    </span>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ({type.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}


        {/* Grupa ATC */}
        {facets?.atcGroups && facets.atcGroups.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('atc')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaCode className="w-4 h-4 mr-2" />
                Grupa ATC
              </h4>
              {expandedSections.has('atc') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('atc') && (
              <div className="space-y-2">
                <label className={`flex items-center cursor-pointer ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <input
                    type="radio"
                    name="atc"
                    checked={!filters.atcGroup}
                    onChange={() => handleFilterChange('atcGroup', undefined)}
                    className="mr-2"
                  />
                  <span>Wszystkie grupy</span>
                </label>
                {facets.atcGroups.map(group => (
                  <label
                    key={group.code}
                    className={`flex items-center cursor-pointer ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="atc"
                      checked={filters.atcGroup === group.code}
                      onChange={() => {
                        handleFilterChange('atcGroup', group.code);
                        handleFilterChange('atcLevel', 1);
                      }}
                      className="mr-2"
                    />
                    <span className="flex-1">
                      {group.code} - {group.name}
                    </span>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ({group.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Producent */}
        {facets?.manufacturers && facets.manufacturers.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('manufacturer')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaIndustry className="w-4 h-4 mr-2" />
                Producent
              </h4>
              {expandedSections.has('manufacturer') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('manufacturer') && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Szukaj producenta..."
                  value={filters.manufacturer || ''}
                  onChange={(e) => handleFilterChange('manufacturer', e.target.value || undefined)}
                  className={`w-full px-3 py-2 rounded border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {facets.manufacturers.slice(0, 10).map(manufacturer => (
                    <button
                      key={manufacturer.name}
                      onClick={() => handleFilterChange('manufacturer', manufacturer.name)}
                      className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                        filters.manufacturer === manufacturer.name
                          ? 'bg-[#38b6ff]/20 text-[#38b6ff]'
                          : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {manufacturer.name} ({manufacturer.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Substancja czynna */}
        {facets?.activeSubstances && facets.activeSubstances.length > 0 && (
          <section>
            <button
              onClick={() => toggleSection('substance')}
              className={`flex items-center justify-between w-full mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <h4 className="font-medium flex items-center">
                <FaCapsules className="w-4 h-4 mr-2" />
                Substancja czynna
              </h4>
              {expandedSections.has('substance') ? 
                <FaChevronUp className="w-4 h-4" /> : 
                <FaChevronDown className="w-4 h-4" />
              }
            </button>
            {expandedSections.has('substance') && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Szukaj substancji..."
                  value={filters.activeSubstance || ''}
                  onChange={(e) => handleFilterChange('activeSubstance', e.target.value || undefined)}
                  className={`w-full px-3 py-2 rounded border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {facets.activeSubstances.slice(0, 20).map(substance => (
                    <button
                      key={substance.name}
                      onClick={() => handleFilterChange('activeSubstance', substance.name)}
                      className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                        filters.activeSubstance === substance.name
                          ? 'bg-[#38b6ff]/20 text-[#38b6ff]'
                          : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {substance.name} ({substance.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Dodatkowe filtry */}
        <section>
          <button
            onClick={() => toggleSection('additional')}
            className={`flex items-center justify-between w-full mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <h4 className="font-medium flex items-center">
              <FaCog className="w-4 h-4 mr-2" />
              Dodatkowe filtry
            </h4>
            {expandedSections.has('additional') ? 
              <FaChevronUp className="w-4 h-4" /> : 
              <FaChevronDown className="w-4 h-4" />
            }
          </button>
          {expandedSections.has('additional') && (
            <div className="space-y-3">
              {/* Typ preparatu */}
              <div>
                <label className={`text-sm font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Typ preparatu
                </label>
                <select
                  value={filters.preparationType || 'all'}
                  onChange={(e) => handleFilterChange(
                    'preparationType',
                    e.target.value === 'all' ? undefined : e.target.value
                  )}
                  className={`w-full mt-1 px-3 py-2 rounded border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Wszystkie</option>
                  <option value="human">Ludzki</option>
                  <option value="veterinary">Weterynaryjny</option>
                </select>
              </div>

              {/* Materiały edukacyjne */}
              <label className={`flex items-center cursor-pointer ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  checked={filters.hasEducationalMaterials || false}
                  onChange={(e) => handleFilterChange(
                    'hasEducationalMaterials',
                    e.target.checked ? true : undefined
                  )}
                  className="mr-2 rounded"
                />
                <span className="flex items-center">
                  <FaFileAlt className="w-4 h-4 mr-2" />
                  Tylko z materiałami edukacyjnymi
                </span>
              </label>

              {/* Status rejestracji */}
              <div>
                <label className={`text-sm font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Status rejestracji
                </label>
                <select
                  value={filters.registrationStatus || 'all'}
                  onChange={(e) => handleFilterChange(
                    'registrationStatus',
                    e.target.value === 'all' ? undefined : e.target.value
                  )}
                  className={`w-full mt-1 px-3 py-2 rounded border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Wszystkie</option>
                  <option value="active">Aktywne</option>
                  <option value="withdrawn">Wycofane</option>
                  <option value="suspended">Zawieszone</option>
                  <option value="expired">Wygasłe</option>
                </select>
              </div>

              {/* Kraj */}
              {facets?.countries && facets.countries.length > 0 && (
                <div>
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <FaGlobe className="inline w-4 h-4 mr-1" />
                    Kraj pochodzenia
                  </label>
                  <input
                    type="text"
                    placeholder="Szukaj kraju..."
                    value={filters.country || ''}
                    onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
                    className={`w-full mt-1 px-3 py-2 rounded border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdvancedDrugFilters;