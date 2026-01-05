import React, { useState } from 'react';
import { 
  FaFilter, 
  FaChevronDown, 
  FaChevronUp, 
  FaTimes,
  FaStethoscope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaFileContract,
  FaMoneyBillWave,
  FaCalendarAlt
} from 'react-icons/fa';

export interface JobFilters {
  professions: string[];
  locations: string[];
  experience: string[];
  salaryTypes: string[];
  dateRange: string;
  contractTypes: string[];
}

interface JobOfferFiltersProps {
  filters: JobFilters;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onFilterChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

const JobOfferFilters: React.FC<JobOfferFiltersProps> = ({
  filters,
  darkMode,
  fontSize,
  onFilterChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    professions: false,
    locations: false,
    experience: false,
    salaryTypes: false,
    contractTypes: false,
    dateRange: false,
  });

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          filterText: 'text-sm',
          buttonText: 'text-sm',
          labelText: 'text-xs',
        };
      case 'large':
        return {
          filterText: 'text-lg',
          buttonText: 'text-lg',
          labelText: 'text-base',
        };
      default:
        return {
          filterText: 'text-base',
          buttonText: 'text-base',
          labelText: 'text-sm',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Polish regions (voivodeships)
  const polishRegions = [
    'dolnośląskie',
    'kujawsko-pomorskie',
    'lubelskie',
    'lubuskie',
    'łódzkie',
    'małopolskie',
    'mazowieckie',
    'opolskie',
    'podkarpackie',
    'podlaskie',
    'pomorskie',
    'śląskie',
    'świętokrzyskie',
    'warmińsko-mazurskie',
    'wielkopolskie',
    'zachodniopomorskie',
    'zagranica',
  ];


  // Medical professions / key specialties used for filtering (full list from constants)
  const medicalProfessions = [
    'Alergolog',
    'Alergolog dziecięcy',
    'Androlog',
    'Anestezjolog',
    'Angiochirurg',
    'Angiolog',
    'Asystent weterynaryjny',
    'Audiolog/foniatra',
    'Bariatra',
    'Chirurg',
    'Chirurg dziecięcy',
    'Chirurg naczyniowy',
    'Chirurg onkologiczny',
    'Chirurg plastyczny',
    'Chirurg stomatologiczny',
    'Chirurg szczękowo-twarzowy',
    'Dermatolog',
    'Dermatolog dziecięcy',
    'Diabetolog',
    'Diabetolog dziecięcy',
    'Diagnosta laboratoryjny',
    'Dietetyk',
    'Endokrynolog',
    'Endokrynolog dziecięcy',
    'Ergoterapeuta',
    'Farmaceuta',
    'Fizjoterapeuta',
    'Flebolog',
    'Gastrolog',
    'Gastrolog dziecięcy',
    'Genetyk',
    'Geriatra',
    'Ginekolog',
    'Ginekolog dziecięcy',
    'Ginekolog onkologiczny',
    'Hematolog',
    'Hematolog dziecięcy',
    'Hepatolog',
    'Higienistka stomatologiczna',
    'Hipertensjolog',
    'Immunolog',
    'Internista',
    'Kardiochirurg',
    'Kardiolog',
    'Kardiolog dziecięcy',
    'Kosmetolog',
    'Laryngolog',
    'Laryngolog dziecięcy',
    'Lekarz bez specjalizacji',
    'Lekarz chorób zakaźnych',
    'Lekarz medycyny estetycznej',
    'Lekarz medycyny nuklearnej',
    'Lekarz medycyny paliatywnej',
    'Lekarz medycyny pracy',
    'Lekarz rehabilitacji medycznej',
    'Lekarz rodzinny',
    'Lekarz sportowy',
    'Lekarz w trakcie specjalizacji',
    'Lekarz weterynarii',
    'Logopeda',
    'Neonatolog',
    'Nefrolog',
    'Nefrolog dziecięcy',
    'Neurochirurg',
    'Neurolog',
    'Neurolog dziecięcy',
    'Okulista',
    'Okulista dziecięcy',
    'Onkolog',
    'Onkolog dziecięcy',
    'Opiekun medyczny',
    'Optometrysta',
    'Ortodonta',
    'Ortopeda',
    'Ortopeda dziecięcy',
    'Osteopata',
    'Perfuzjonista',
    'Periodontolog',
    'Pielęgniarka/Pielęgniarz',
    'Położna/Położny',
    'Proktolog',
    'Protetyk',
    'Protetyk słuchu',
    'Protetyk stomatologiczny',
    'Psychiatra',
    'Psychiatra dziecięcy',
    'Psychoonkolog',
    'Psycholog',
    'Psycholog dziecięcy',
    'Psychoterapeuta',
    'Psychotraumatolog',
    'Pulmonolog',
    'Pulmonolog dziecięcy',
    'Radiolog',
    'Ratownik medyczny',
    'Reumatolog',
    'Reumatolog dziecięcy',
    'Seksuolog',
    'Specjalista medycyny naturalnej',
    'Stomatolog',
    'Stomatolog dziecięcy',
    'Technik dentystyczny',
    'Technik farmaceutyczny',
    'Technik medycyny nuklearnej',
    'Technik ortopedyczny',
    'Technik weterynarii',
    'Terapeuta',
    'Terapeuta zajęciowy',
    'Ultrasonografista',
    'Urolog',
    'Urolog dziecięcy',
    'Wenerolog',
    'Zoofizjoterapeuta',
  ];

  const experienceLevels = [
    'Specjalista',
    'W trakcie specjalizacji',
    'Absolwent',
  ];

  const salaryTypes = [
    '% od wizyty',
    'Stawka za godzinę lub wizytę',
    'Stawka za miesiąc',
  ];

  const contractTypes = [
    'Umowa o pracę',
    'Umowa zlecenie',
    'Umowa o dzieło',
    'B2B',
    'Kontrakt',
    'Praktyki/Staż'
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleArrayFilterChange = (filterKey: keyof JobFilters, value: string, checked: boolean) => {
    if (filterKey === 'dateRange') {
      // Special handling for dateRange - only one value can be selected
      onFilterChange({
        ...filters,
        dateRange: checked ? value : ''
      });
      return;
    }

    const currentValues = filters[filterKey] as string[];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }

    onFilterChange({
      ...filters,
      [filterKey]: newValues
    });
  };

  const dateRangeOptions = [
    'Ostatnie 24h',
    'Ostatni tydzień', 
    'Ostatni miesiąc',
    'Ostatnie 3 miesiące'
  ];

  const getActiveFiltersCount = () => {
    return (
      filters.professions.length +
      filters.locations.length +
      filters.experience.length +
      filters.salaryTypes.length +
      filters.contractTypes.length +
      (filters.dateRange ? 1 : 0)
    );
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  const renderCheckboxGroup = (
    title: string,
    IconComponent: React.ComponentType<{ className?: string }>,
    items: string[],
    selectedItems: string[],
    filterKey: keyof JobFilters,
    sectionKey: string
  ) => (
    <div className={`rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full p-4 flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
      >
        <span className={`flex items-center ${fontSizes.filterText} font-medium`}>
          <IconComponent className="mr-2 text-lg" />
          {title}
          {selectedItems.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-[#38b6ff] text-black rounded-full text-xs font-semibold">
              {selectedItems.length}
            </span>
          )}
        </span>
        {expandedSections[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <label
                key={item}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <input
                  type={filterKey === 'dateRange' ? 'radio' : 'checkbox'}
                  name={filterKey === 'dateRange' ? 'dateRange' : undefined}
                  checked={selectedItems.includes(item)}
                  onChange={(e) => handleArrayFilterChange(filterKey, item, e.target.checked)}
                  className="h-4 w-4 text-[#38b6ff] focus:ring-[#38b6ff] border-gray-300 rounded mr-3"
                />
                <span className={`${fontSizes.labelText} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
          
          {selectedItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2 py-1 bg-[#38b6ff] text-black rounded-full text-xs"
                  >
                    {item}
                    <button
                      onClick={() => handleArrayFilterChange(filterKey, item, false)}
                      className="ml-1 text-black hover:text-red-600 focus:outline-none"
                      aria-label={`Usuń filtr ${item}`}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // allProfessions is now the medicalProfessions array since it's already sorted
  const allProfessions = medicalProfessions;

  return (
    <div className="mb-8">
      {/* Header with active filters count and clear button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className={`${fontSizes.filterText} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FaFilter className="inline mr-2" />
            Filtry
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span className="ml-3 px-3 py-1 bg-[#38b6ff] text-black rounded-full text-sm font-semibold">
              {getActiveFiltersCount()} aktywnych
            </span>
          )}
        </div>
        
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className={`px-4 py-2 ${fontSizes.buttonText} font-medium rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-gray-500'
                : 'bg-gray-100 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-gray-400'
            } focus:outline-none`}
          >
            <FaTimes className="inline mr-2" />
            Wyczyść wszystko
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professions */}
        {renderCheckboxGroup(
          'Zawody medyczne',
          FaStethoscope,
          allProfessions,
          filters.professions,
          'professions',
          'professions'
        )}

        {/* Locations */}
        {renderCheckboxGroup(
          'Lokalizacje',
          FaMapMarkerAlt,
          polishRegions,
          filters.locations,
          'locations',
          'locations'
        )}

        {/* Experience */}
        {renderCheckboxGroup(
          'Doświadczenie',
          FaBriefcase,
          experienceLevels,
          filters.experience,
          'experience',
          'experience'
        )}

        {/* Date Range - Dropdown like other filters */}
        {renderCheckboxGroup(
          'Data publikacji',
          FaCalendarAlt,
          dateRangeOptions,
          filters.dateRange ? [filters.dateRange] : [],
          'dateRange',
          'dateRange'
        )}

        {/* Contract Types */}
        {renderCheckboxGroup(
          'Typy umów',
          FaFileContract,
          contractTypes,
          filters.contractTypes,
          'contractTypes',
          'contractTypes'
        )}

        {/* Salary Types */}
        {renderCheckboxGroup(
          'Typy wynagrodzeń',
          FaMoneyBillWave,
          salaryTypes,
          filters.salaryTypes,
          'salaryTypes',
          'salaryTypes'
        )}
      </div>


      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
          <h4 className={`${fontSizes.filterText} font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            Aktywne filtry ({getActiveFiltersCount()}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.professions.map((item) => (
              <span key={`prof-${item}`} className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                Zawód: {item}
                <button
                  onClick={() => handleArrayFilterChange('professions', item, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.locations.map((item) => (
              <span key={`loc-${item}`} className="inline-flex items-center px-2 py-1 bg-purple-500 text-white rounded-full text-xs">
                Lokalizacja: {item}
                <button
                  onClick={() => handleArrayFilterChange('locations', item, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.experience.map((item) => (
              <span key={`exp-${item}`} className="inline-flex items-center px-2 py-1 bg-orange-500 text-white rounded-full text-xs">
                Doświadczenie: {item}
                <button
                  onClick={() => handleArrayFilterChange('experience', item, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.contractTypes.map((item) => (
              <span key={`contract-${item}`} className="inline-flex items-center px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                Umowa: {item}
                <button
                  onClick={() => handleArrayFilterChange('contractTypes', item, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.salaryTypes.map((item) => (
              <span key={`salary-${item}`} className="inline-flex items-center px-2 py-1 bg-yellow-500 text-white rounded-full text-xs">
                Wynagrodzenie: {item}
                <button
                  onClick={() => handleArrayFilterChange('salaryTypes', item, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.dateRange && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-500 text-white rounded-full text-xs">
                Data: {filters.dateRange}
                <button
                  onClick={() => handleArrayFilterChange('dateRange', filters.dateRange, false)}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOfferFilters;
