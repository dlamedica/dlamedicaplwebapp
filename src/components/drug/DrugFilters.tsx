import React, { useState } from 'react';
import { FaFilter, FaChevronDown, FaPills, FaSyringe, FaTablets, FaEye, FaTint, FaWind, FaTimes } from 'react-icons/fa';
import { DrugSearchFilters, SearchResult } from '../../types/drug';

interface DrugFiltersProps {
  filters: DrugSearchFilters;
  onFiltersChange: (filters: DrugSearchFilters) => void;
  searchResult?: SearchResult;
  darkMode?: boolean;
  className?: string;
}

const DrugFilters: React.FC<DrugFiltersProps> = ({
  filters,
  onFiltersChange,
  searchResult,
  darkMode = false,
  className = ""
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Ikony dla postaci farmaceutycznych
  const getPharmFormIcon = (form: string) => {
    const formLower = form.toLowerCase();
    if (formLower.includes('tabletki')) return <FaTablets className="w-4 h-4" />;
    if (formLower.includes('kapsułki')) return <FaPills className="w-4 h-4" />;
    if (formLower.includes('krople')) return <FaTint className="w-4 h-4" />;
    if (formLower.includes('aerozol') || formLower.includes('spray')) return <FaWind className="w-4 h-4" />;
    if (formLower.includes('iniekcja')) return <FaSyringe className="w-4 h-4" />;
    return <FaPills className="w-4 h-4" />;
  };
  
  // Etykiety dla dróg podania
  const administrationRouteLabels = {
    'oral': 'Doustne',
    'parenteral': 'Pozajelitowe',
    'topical': 'Miejscowe',
    'inhalation': 'Wziewne',
    'other': 'Inne'
  };
  
  // Etykiety dla typów recept
  const prescriptionTypeLabels = {
    'Rp': 'Rp - Na receptę',
    'Rpz': 'Rpz - Recepta szpitalna',
    'OTC': 'OTC - Bez recepty',
    'Lz': 'Lz - Lek zagrożenia'
  };
  
  const updateFilter = <K extends keyof DrugSearchFilters>(
    key: K,
    value: DrugSearchFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  
  const togglePrescriptionType = (type: string) => {
    const currentTypes = filters.prescriptionType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    updateFilter('prescriptionType', newTypes.length > 0 ? newTypes : undefined);
  };
  
  const resetFilters = () => {
    onFiltersChange({
      query: filters.query, // Zachowaj query
      onlyRefunded: false
    });
  };
  
  const hasActiveFilters = () => {
    return !!(
      filters.pharmaceuticalForm ||
      filters.administrationRoute ||
      filters.prescriptionType?.length ||
      filters.atcGroup ||
      filters.manufacturer ||
      filters.activeSubstance ||
      filters.refundationStatus !== 'all' ||
      filters.onlyRefunded
    );
  };
  
  return (
    <div className={`${className}`}>
      {/* Główne filtry */}
      <div className={`rounded-lg border p-4 ${
        darkMode 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          
          {/* Postać farmaceutyczna */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Postać farmaceutyczna
            </label>
            <select
              value={filters.pharmaceuticalForm || ''}
              onChange={(e) => updateFilter('pharmaceuticalForm', e.target.value || undefined)}
              className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Wszystkie</option>
              {searchResult?.facets.pharmaceuticalForms.map(form => (
                <option key={form.name} value={form.name}>
                  {form.name} ({form.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Droga podania */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Droga podania
            </label>
            <select
              value={filters.administrationRoute || ''}
              onChange={(e) => updateFilter('administrationRoute', e.target.value || undefined)}
              className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Wszystkie</option>
              {Object.entries(administrationRouteLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* Grupa ATC */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Grupa ATC
            </label>
            <select
              value={filters.atcGroup || ''}
              onChange={(e) => updateFilter('atcGroup', e.target.value || undefined)}
              className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Wszystkie grupy</option>
              {searchResult?.facets.atcGroups.map(group => (
                <option key={group.code} value={group.code}>
                  {group.code} - {group.name} ({group.count})
                </option>
              ))}
            </select>
          </div>
          
          {/* Tylko refundowane */}
          <div className="flex items-center">
            <label className={`flex items-center space-x-2 cursor-pointer ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                checked={filters.onlyRefunded}
                onChange={(e) => updateFilter('onlyRefunded', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Tylko refundowane</span>
            </label>
          </div>
        </div>
        
        {/* Typ recepty - checkboxy */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Typ recepty
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(prescriptionTypeLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => togglePrescriptionType(type)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.prescriptionType?.includes(type)
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Przycisk filtrów zaawansowanych */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FaFilter className="w-4 h-4" />
            Filtry zaawansowane
            <FaChevronDown className={`w-4 h-4 transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`} />
          </button>
          
          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <FaTimes className="w-4 h-4" />
              Wyczyść filtry
            </button>
          )}
        </div>
      </div>
      
      {/* Filtry zaawansowane */}
      {showAdvanced && (
        <div className={`mt-4 rounded-lg border p-4 ${
          darkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Filtry zaawansowane
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Producent */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Producent
              </label>
              <select
                value={filters.manufacturer || ''}
                onChange={(e) => updateFilter('manufacturer', e.target.value || undefined)}
                className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Wszyscy producenci</option>
                {searchResult?.facets.manufacturers.slice(0, 20).map(manufacturer => (
                  <option key={manufacturer.name} value={manufacturer.name}>
                    {manufacturer.name} ({manufacturer.count})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Substancja czynna */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Substancja czynna
              </label>
              <input
                type="text"
                value={filters.activeSubstance || ''}
                onChange={(e) => updateFilter('activeSubstance', e.target.value || undefined)}
                placeholder="np. Paracetamolum"
                className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            {/* Status refundacji */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Status refundacji
              </label>
              <select
                value={filters.refundationStatus || 'all'}
                onChange={(e) => updateFilter('refundationStatus', e.target.value as any)}
                className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">Wszystkie</option>
                <option value="refunded">Refundowane</option>
                <option value="none">Bez refundacji</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Podsumowanie aktywnych filtrów */}
      {hasActiveFilters() && (
        <div className={`mt-4 p-3 rounded-lg ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <FaFilter className={`w-4 h-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Aktywne filtry:
            </span>
            <div className="flex flex-wrap gap-1">
              {filters.pharmaceuticalForm && (
                <span className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {filters.pharmaceuticalForm}
                </span>
              )}
              {filters.administrationRoute && (
                <span className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {administrationRouteLabels[filters.administrationRoute as keyof typeof administrationRouteLabels]}
                </span>
              )}
              {filters.prescriptionType?.map(type => (
                <span key={type} className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {type}
                </span>
              ))}
              {filters.onlyRefunded && (
                <span className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  Tylko refundowane
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugFilters;