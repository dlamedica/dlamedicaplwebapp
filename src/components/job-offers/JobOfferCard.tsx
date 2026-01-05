import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaBriefcase, FaBuilding, FaPaperPlane, FaFire, FaHeart } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';

interface JobOfferCardProps {
  id: string;
  company: string;
  position: string;
  contractType: string;
  location: string;
  category: string;
  salary?: string;
  salaryType?: string;
  facilityType?: string;
  logo?: string;
  timeAgo?: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClick: () => void;
  onQuickApply?: () => void;
  isUrgent?: boolean;
}

const JobOfferCard: React.FC<JobOfferCardProps> = ({
  id,
  company,
  position,
  contractType,
  location,
  category,
  salary,
  salaryType,
  facilityType,
  logo,
  timeAgo,
  darkMode,
  fontSize,
  onClick,
  onQuickApply,
  isUrgent,
}) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-base md:text-lg',
          text: 'text-sm',
          small: 'text-xs',
        };
      case 'large':
        return {
          title: 'text-xl md:text-2xl',
          text: 'text-base md:text-lg',
          small: 'text-sm',
        };
      default:
        return {
          title: 'text-lg md:text-xl',
          text: 'text-sm md:text-base',
          small: 'text-xs',
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const getFacilityTypeColor = (type?: string) => {
    if (!type) return '';
    
    switch (type) {
      case 'Prywatna placówka':
        return darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'Szpital publiczny':
        return darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
      case 'Publiczna placówka':
        return darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800';
      case 'Apteka':
        return darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lekarze':
        return '👨‍⚕️';
      case 'Pielęgniarki':
        return '👩‍⚕️';
      case 'Fizjoterapeuci':
        return '💪';
      case 'Farmaceuci':
        return '💊';
      case 'Technicy':
        return '🔬';
      case 'Ratownicy':
        return '🚑';
      default:
        return '🏥';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'Umowa o pracę':
        return darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
      case 'B2B':
        return darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'Kontrakt':
        return darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800';
      case 'Umowa zlecenie':
        return darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative rounded-2xl p-4 md:p-5 shadow-sm transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col
        ${darkMode 
          ? 'bg-gray-800 border border-gray-700 hover:border-[#38b6ff]/50' 
          : 'bg-white border border-gray-200 hover:border-[#38b6ff]/50'
        }
      `}
      role="article"
      aria-label={`Oferta pracy: ${position} w ${company}`}
    >
      {/* Urgent Badge */}
      {isUrgent && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
            <FaFire className="text-xs" />
            Pilne!
          </div>
        </div>
      )}

      {/* Header with Logo/Icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
            ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          {logo ? (
            <img
              src={logo}
              alt={`Logo ${company}`}
              className="w-10 h-10 object-contain rounded-lg"
            />
          ) : (
            <span>{getCategoryIcon(category)}</span>
          )}
        </div>
        
        {/* Favorite Button */}
        <FavoriteButton
          jobOfferId={id}
          darkMode={darkMode}
          size="medium"
        />
      </div>

      {/* Position Title */}
      <h3 className={`${fontSizes.title} font-bold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {position}
      </h3>

      {/* Company Name */}
      <p className={`${fontSizes.text} mb-3 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {company}
      </p>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Contract Type */}
        <span className={`${fontSizes.small} px-2 py-1 rounded-full font-medium ${getContractTypeColor(contractType)}`}>
          {contractType}
        </span>
        
        {/* Facility Type */}
        {facilityType && (
          <span className={`${fontSizes.small} px-2 py-1 rounded-full font-medium ${getFacilityTypeColor(facilityType)}`}>
            {facilityType}
          </span>
        )}
      </div>

      {/* Info Grid */}
      <div className="space-y-2 flex-grow">
        {/* Location */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#38b6ff] text-sm shrink-0" />
          <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
            {location}
          </span>
        </div>

        {/* Salary */}
        {salary && salary !== 'Nie podano' ? (
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-[#38b6ff] text-sm shrink-0" />
            <span className={`${fontSizes.text} font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {salary}
            </span>
            {salaryType && salaryType !== 'Nie podano' && (
              <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ({salaryType})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-gray-400 text-sm shrink-0" />
            <span className={`${fontSizes.small} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Wynagrodzenie do uzgodnienia
            </span>
          </div>
        )}

        {/* Time Ago */}
        {timeAgo && (
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#38b6ff] text-sm shrink-0" />
            <span className={`${fontSizes.small} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {timeAgo}
            </span>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-[#38b6ff] text-xs" />
            <span className={`${fontSizes.small} font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {category}
            </span>
          </div>
          <span className={`${fontSizes.small} text-[#38b6ff] font-medium group-hover:underline`}>
            Zobacz ofertę →
          </span>
        </div>
        
        {/* Quick Apply Button */}
        {onQuickApply && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickApply();
            }}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-2.5 ${fontSizes.text} font-semibold 
              rounded-xl transition-all duration-200 
              bg-[#38b6ff] text-black hover:bg-[#2a9fe5] 
              shadow-md hover:shadow-lg
            `}
          >
            <FaPaperPlane className="text-sm" />
            <span>Aplikuj szybko</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default JobOfferCard;
