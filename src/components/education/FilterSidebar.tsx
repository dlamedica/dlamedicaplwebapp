import React, { useState } from 'react';
import {
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TimesIcon,
  ClockIcon,
  SignalIcon,
  UsersIcon,
  CheckCircleIcon
} from './icons/EducationIcons';
import { AnimatedSection, CountUp, RippleButton } from './components';
import './styles/educationStyles.css';

interface FilterOptions {
  difficulty: string[];
  duration: string[];
  status: string[];
  profession: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  darkMode,
  fontSize,
  onFilterChange,
  onClearFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    difficulty: true,
    duration: false,
    status: false,
    profession: false,
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

  const difficultyOptions = [
    { value: 'easy', label: '🟢 Łatwy', count: 12 },
    { value: 'medium', label: '🟡 Średni', count: 18 },
    { value: 'hard', label: '🔴 Trudny', count: 15 }
  ];

  const durationOptions = [
    { value: 'short', label: '< 50 godzin', count: 8 },
    { value: 'medium', label: '50-100 godzin', count: 22 },
    { value: 'long', label: '> 100 godzin', count: 15 }
  ];

  const statusOptions = [
    { value: 'not_started', label: 'Nie rozpoczęte', count: 25 },
    { value: 'in_progress', label: 'W trakcie', count: 12 },
    { value: 'completed', label: 'Ukończone', count: 8 }
  ];

  const professionOptions = [
    { value: 'lekarz', label: 'Lekarz', count: 45 },
    { value: 'pielęgniarka', label: 'Pielęgniarka', count: 28 },
    { value: 'fizjoterapeuta', label: 'Fizjoterapeuta', count: 15 },
    { value: 'farmaceuta', label: 'Farmaceuta', count: 12 },
    { value: 'ratownik_medyczny', label: 'Ratownik medyczny', count: 18 },
    { value: 'dietetyk', label: 'Dietetyk', count: 8 }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string, checked: boolean) => {
    const currentValues = filters[filterType];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }

    onFilterChange({
      ...filters,
      [filterType]: newValues
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.difficulty.length +
      filters.duration.length +
      filters.status.length +
      filters.profession.length
    );
  };

  const renderFilterSection = (
    title: string,
    IconComponent: React.ComponentType<{ className?: string }>,
    options: { value: string; label: string; count: number }[],
    filterKey: keyof FilterOptions,
    sectionKey: string
  ) => (
    <AnimatedSection animation="slideUp" delay={0}>
      <div className={`rounded-xl border ${darkMode ? 'border-gray-700/50 bg-gray-800/80' : 'border-gray-200/50 bg-white/80'} education-glass shadow-md overflow-hidden`}>
        <RippleButton
          onClick={() => toggleSection(sectionKey)}
          variant="outline"
          darkMode={darkMode}
          className={`w-full p-4 flex items-center justify-between ${darkMode ? 'text-white' : 'text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38b6ff] ${
            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
          }`}
        >
        <span className={`flex items-center ${fontSizes.filterText} font-semibold`}>
          <div className={`p-2 rounded-lg mr-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <IconComponent className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={18} />
          </div>
          {title}
          {filters[filterKey].length > 0 && (
            <span className="ml-2 px-2.5 py-1 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white rounded-full text-xs font-bold shadow-md">
              <CountUp end={filters[filterKey].length} duration={500} />
            </span>
          )}
        </span>
        <div className={`transition-transform duration-300 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}>
          {expandedSections[sectionKey] ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
        </div>
        </RippleButton>
      
      {expandedSections[sectionKey] && (
        <AnimatedSection animation="slideDown" delay={50}>
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} education-expandable-content expanded`}>
          <div className="space-y-2 max-h-60 overflow-y-auto education-scroll-container">
            {options.map((option, index) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 education-fade-in ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters[filterKey].includes(option.value)}
                      onChange={(e) => handleFilterChange(filterKey, option.value, e.target.checked)}
                      className="h-5 w-5 text-[#38b6ff] focus:ring-[#38b6ff] border-gray-300 rounded cursor-pointer transition-all"
                    />
                    {filters[filterKey].includes(option.value) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <CheckCircleIcon className="text-[#38b6ff] text-xs" size={12} />
                      </div>
                    )}
                  </div>
                  <span className={`${fontSizes.labelText} ml-3 font-medium`}>
                    {option.label}
                  </span>
                </div>
                <span className={`${fontSizes.labelText} px-2 py-1 rounded-full font-semibold ${
                  darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  <CountUp end={option.count} duration={800} />
                </span>
              </label>
            ))}
          </div>
          
          {filters[filterKey].length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aktywne:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters[filterKey].map((item) => {
                  const option = options.find(opt => opt.value === item);
                  return (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white rounded-lg text-xs font-semibold shadow-md transition-all hover:shadow-lg transform hover:scale-105"
                    >
                      {option?.label || item}
                      <button
                        onClick={() => handleFilterChange(filterKey, item, false)}
                        className="ml-2 text-white hover:text-red-200 focus:outline-none transition-colors"
                        aria-label={`Usuń filtr ${item}`}
                      >
                        <TimesIcon size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </AnimatedSection>
      )}
      </div>
    </AnimatedSection>
  );

  return (
    <div className="space-y-6">
      {/* Header with active filters count and clear button */}
      <div className="flex items-center justify-between p-4 rounded-xl education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 bg-gradient-to-br from-[#38b6ff] to-[#2a9fe5] education-icon-wrapper shadow-lg`}>
            <FilterIcon className="text-white" size={18} />
          </div>
          <div>
            <h3 className={`${fontSizes.filterText} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Filtry
            </h3>
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center mt-1 px-2.5 py-0.5 bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white rounded-full text-xs font-bold shadow-md">
                <CountUp end={getActiveFiltersCount()} duration={500} /> aktywnych
              </span>
            )}
          </div>
        </div>
        
        {getActiveFiltersCount() > 0 && (
          <RippleButton
            onClick={onClearFilters}
            variant="outline"
            darkMode={darkMode}
            className={`px-4 py-2 ${fontSizes.buttonText} font-semibold rounded-lg shadow-sm hover:shadow-md`}
          >
            <TimesIcon className="inline mr-1.5" size={14} />
            Wyczyść
          </RippleButton>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-4">
        {/* Difficulty */}
        {renderFilterSection(
          'Poziom trudności',
          SignalIcon,
          difficultyOptions,
          'difficulty',
          'difficulty'
        )}

        {/* Duration */}
        {renderFilterSection(
          'Czas trwania',
          ClockIcon,
          durationOptions,
          'duration',
          'duration'
        )}

        {/* Status */}
        {renderFilterSection(
          'Status nauki',
          CheckCircleIcon,
          statusOptions,
          'status',
          'status'
        )}

        {/* Profession */}
        {renderFilterSection(
          'Zawód medyczny',
          UsersIcon,
          professionOptions,
          'profession',
          'profession'
        )}
      </div>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className={`p-5 rounded-xl ${darkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50'} education-glass shadow-lg education-fade-in`}>
          <h4 className={`${fontSizes.filterText} font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <span className="w-1 h-6 bg-gradient-to-b from-[#38b6ff] to-[#2a9fe5] rounded-full mr-2"></span>
            Aktywne filtry ({getActiveFiltersCount()})
          </h4>
          <div className="space-y-3">
            {filters.difficulty.length > 0 && (
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  Poziom trudności: 
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.difficulty.map((item) => {
                    const option = difficultyOptions.find(opt => opt.value === item);
                    return (
                      <span key={`diff-${item}`} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-md">
                        {option?.label || item}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {filters.duration.length > 0 && (
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  Czas trwania: 
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.duration.map((item) => {
                    const option = durationOptions.find(opt => opt.value === item);
                    return (
                      <span key={`dur-${item}`} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-xs font-semibold shadow-md">
                        {option?.label || item}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {filters.status.length > 0 && (
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  Status nauki: 
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.status.map((item) => {
                    const option = statusOptions.find(opt => opt.value === item);
                    return (
                      <span key={`stat-${item}`} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg text-xs font-semibold shadow-md">
                        {option?.label || item}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {filters.profession.length > 0 && (
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 block`}>
                  Zawód medyczny: 
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.profession.map((item) => {
                    const option = professionOptions.find(opt => opt.value === item);
                    return (
                      <span key={`prof-${item}`} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-xs font-semibold shadow-md">
                        {option?.label || item}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;