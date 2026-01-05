import React from 'react';
import { 
  FaEye, FaHeart, FaBuilding, FaPrescriptionBottleAlt, 
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaRegHeart, FaBarcode, FaCalendarAlt, FaExchangeAlt, FaPlus,
  FaPills, FaUser, FaCertificate, FaTag
} from 'react-icons/fa';
import { EnhancedDrug } from '../../types/drug';

interface DrugCardProps {
  drug: EnhancedDrug;
  onViewDetails: (drug: EnhancedDrug) => void;
  onToggleFavorite: (drugId: string) => void;
  isFavorite: boolean;
  darkMode?: boolean;
  showPackageInfo?: boolean;
  onAddToComparison?: (drug: EnhancedDrug) => void;
  isInComparison?: boolean;
}

const DrugCard: React.FC<DrugCardProps> = ({
  drug,
  onViewDetails,
  onToggleFavorite,
  isFavorite,
  darkMode = false,
  showPackageInfo = true,
  onAddToComparison,
  isInComparison = false
}) => {
  
  // Określ dominującą kategorię refundacji
  const getRefundationStatus = () => {
    if (drug.packages.length === 0) return { status: 'none', count: 0 };
    
    const refundedCount = drug.packages.filter(p => p.refundationStatus === 'refunded').length;
    const partialCount = drug.packages.filter(p => p.refundationStatus === 'partial').length;
    const noneCount = drug.packages.filter(p => p.refundationStatus === 'none').length;
    
    if (refundedCount > 0) return { status: 'refunded', count: refundedCount };
    if (partialCount > 0) return { status: 'partial', count: partialCount };
    return { status: 'none', count: noneCount };
  };
  
  const refundationInfo = getRefundationStatus();
  
  // Ikona dla statusu leku
  const getStatusIcon = () => {
    switch (drug.status) {
      case 'active':
        return <FaCheckCircle className="text-green-500" />;
      case 'withdrawn':
        return <FaTimesCircle className="text-red-500" />;
      case 'suspended':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return null;
    }
  };
  
  // Kolor dla statusu refundacji
  const getRefundationColor = () => {
    switch (refundationInfo.status) {
      case 'refunded':
        return darkMode 
          ? 'bg-green-900 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-300';
      case 'partial':
        return darkMode 
          ? 'bg-yellow-900 text-yellow-300 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return darkMode 
          ? 'bg-gray-700 text-gray-300 border-gray-600' 
          : 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };
  
  // Tekst dla statusu refundacji
  const getRefundationText = () => {
    switch (refundationInfo.status) {
      case 'refunded':
        return `Refundowane (${refundationInfo.count})`;
      case 'partial':
        return `Częściowo refundowane (${refundationInfo.count})`;
      default:
        return `Bez refundacji (${refundationInfo.count})`;
    }
  };
  
  // Formatuj datę
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pl-PL');
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className={`relative rounded-xl border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
      darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:shadow-2xl'
        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
    } overflow-hidden`}>
      
      {/* Status badge */}
      {refundationInfo.status === 'refunded' && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <FaCertificate className="w-3 h-3" />
            Refundowany
          </div>
        </div>
      )}
      
      {/* Header z nazwą i przyciskiem ulubionych */}
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className={`text-lg font-bold leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                } line-clamp-2`}>
                  {drug.tradeName}
                  {drug.strength && (
                    <span className={`ml-2 text-base font-semibold ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {drug.strength}
                    </span>
                  )}
                </h3>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } line-clamp-2`}>
              {drug.commonName}
            </p>
            
            <div className={`flex items-center gap-2 mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FaPills className="w-3 h-3" />
              <span>{drug.pharmaceuticalForm}</span>
              <span className="mx-1">•</span>
              <span>{drug.administrationRoute.substring(0, 15)}{drug.administrationRoute.length > 15 ? '...' : ''}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            {/* Ulubione */}
            <button
              onClick={() => onToggleFavorite(drug.id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 bg-red-50 scale-110' 
                  : darkMode 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            >
              {isFavorite ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
            </button>
            
            {/* Porównywanie */}
            {onAddToComparison && (
              <button
                onClick={() => onAddToComparison(drug)}
                disabled={isInComparison}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isInComparison
                    ? 'text-blue-500 bg-blue-50 cursor-not-allowed scale-110'
                    : darkMode 
                      ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' 
                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                }`}
                aria-label={isInComparison ? 'Już w porównaniu' : 'Dodaj do porównania'}
                title={isInComparison ? 'Już w porównaniu' : 'Dodaj do porównania'}
              >
                {isInComparison ? <FaExchangeAlt className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Informacje podstawowe */}
        <div className="space-y-3">
          {/* Producent */}
          <div className="flex items-center gap-2">
            <FaBuilding className={`w-3 h-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <span className={`text-xs ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } truncate`}>
              {drug.manufacturer}
            </span>
          </div>
          
          {/* Status refundacji - kompaktowy */}
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
            getRefundationColor()
          }`}>
            <FaPrescriptionBottleAlt className="w-3 h-3" />
            <span className="truncate">{getRefundationText()}</span>
          </div>
        </div>
      </div>
      
      {/* Środkowa sekcja z informacjami */}
      <div className={`px-5 py-3 border-t ${
        darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
      }`}>
        
        {/* Informacje kliniczne - kompaktowe */}
        <div className="space-y-2">
          {/* Kod ATC */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ATC:
            </span>
            <span className={`text-xs font-mono font-semibold ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {drug.atcCode.code}
            </span>
          </div>
          
          {/* Grupa ATC - skrócona */}
          <div>
            <span className={`text-xs ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            } line-clamp-2`}>
              {drug.atcCode.level1} - {drug.atcCode.description.substring(0, 50)}{drug.atcCode.description.length > 50 ? '...' : ''}
            </span>
          </div>
        </div>
        
        {/* Pakiety i recepty - kompaktowe */}
        {showPackageInfo && drug.packages.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {drug.packages.length} opakowań
              </span>
              
              {/* Typy recept - małe */}
              <div className="flex gap-1">
                {Array.from(new Set(drug.packages.map(p => p.prescriptionType))).slice(0, 3).map(type => (
                  <span
                    key={type}
                    className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                      type === 'OTC' 
                        ? darkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'
                        : type === 'Rpz'
                          ? darkMode ? 'bg-purple-800 text-purple-300' : 'bg-purple-100 text-purple-700'
                          : darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Substancje czynne - kompaktowo */}
            {drug.activeSubstances.length > 0 && (
              <div className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {drug.activeSubstances.slice(0, 2).join(', ')}
                {drug.activeSubstances.length > 2 && ' (+' + (drug.activeSubstances.length - 2) + ')'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer z przyciskiem */}
      <div className="p-5 pt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className={`w-3 h-3 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {formatDate(drug.expiryDate)}
            </span>
          </div>
          
          {/* Wskazania ICD-11 */}
          {drug.indications.length > 0 && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-indigo-800 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {drug.indications.length} wskazań
            </span>
          )}
        </div>
        
        {/* Przycisk szczegółów - nowocześniejszy */}
        <button
          onClick={() => onViewDetails(drug)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
            darkMode
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          } shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
        >
          <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Zobacz szczegóły</span>
        </button>
      </div>
      
      
      {/* Badge statusu (jeśli nie aktywny) */}
      {drug.status !== 'active' && (
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
          drug.status === 'withdrawn' 
            ? 'bg-red-500 text-white'
            : 'bg-yellow-500 text-black'
        }`}>
          {drug.status === 'withdrawn' ? 'WYCOFANY' : 'ZAWIESZONY'}
        </div>
      )}
    </div>
  );
};

export default DrugCard;