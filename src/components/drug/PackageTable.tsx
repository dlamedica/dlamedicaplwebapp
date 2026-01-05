import React, { useState } from 'react';
import { 
  FaBarcode, FaPrescriptionBottleAlt, FaCheckCircle, 
  FaTimesCircle, FaExclamationCircle, FaCopy, FaSort,
  FaSortUp, FaSortDown
} from 'react-icons/fa';
import { DrugPackage } from '../../types/drug';

interface PackageTableProps {
  packages: DrugPackage[];
  darkMode?: boolean;
  className?: string;
}

type SortField = 'size' | 'prescriptionType' | 'refundationStatus' | 'registrationNumber';
type SortDirection = 'asc' | 'desc';

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  darkMode = false,
  className = ""
}) => {
  const [sortField, setSortField] = useState<SortField>('size');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [copiedEan, setCopiedEan] = useState<string | null>(null);
  
  // Sortowanie pakietów
  const sortedPackages = [...packages].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortField) {
      case 'size':
        aValue = a.size.toLowerCase();
        bValue = b.size.toLowerCase();
        break;
      case 'prescriptionType':
        aValue = a.prescriptionType;
        bValue = b.prescriptionType;
        break;
      case 'refundationStatus':
        const statusOrder = { 'refunded': 0, 'partial': 1, 'none': 2 };
        aValue = statusOrder[a.refundationStatus];
        bValue = statusOrder[b.refundationStatus];
        break;
      case 'registrationNumber':
        aValue = a.registrationNumber.toLowerCase();
        bValue = b.registrationNumber.toLowerCase();
        break;
      default:
        aValue = a.size.toLowerCase();
        bValue = b.size.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FaSort className="w-3 h-3 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <FaSortUp className="w-3 h-3" />
      : <FaSortDown className="w-3 h-3" />;
  };
  
  // Kopiowanie EAN do schowka
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEan(text);
      setTimeout(() => setCopiedEan(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  // Ikona dla typu recepty
  const getPrescriptionIcon = (type: string) => {
    switch (type) {
      case 'OTC':
        return <FaCheckCircle className="text-green-500" />;
      case 'Rp':
        return <FaPrescriptionBottleAlt className="text-blue-500" />;
      case 'Rpz':
        return <FaPrescriptionBottleAlt className="text-purple-500" />;
      case 'Lz':
        return <FaExclamationCircle className="text-orange-500" />;
      default:
        return <FaPrescriptionBottleAlt className="text-gray-500" />;
    }
  };
  
  // Kolor dla statusu refundacji
  const getRefundationColor = (status: string) => {
    switch (status) {
      case 'refunded':
        return darkMode 
          ? 'text-green-400 bg-green-900/20' 
          : 'text-green-700 bg-green-100';
      case 'partial':
        return darkMode 
          ? 'text-yellow-400 bg-yellow-900/20' 
          : 'text-yellow-700 bg-yellow-100';
      default:
        return darkMode 
          ? 'text-gray-400 bg-gray-800' 
          : 'text-gray-600 bg-gray-100';
    }
  };
  
  // Tekst dla statusu refundacji
  const getRefundationText = (pkg: DrugPackage) => {
    switch (pkg.refundationStatus) {
      case 'refunded':
        return pkg.refundationPercentage 
          ? `${pkg.refundationPercentage}% refundacji`
          : 'Refundowane';
      case 'partial':
        return pkg.refundationPercentage 
          ? `${pkg.refundationPercentage}% refundacji`
          : 'Częściowo refundowane';
      default:
        return 'Bez refundacji';
    }
  };
  
  // Etykiety dla typów recept
  const getPrescriptionLabel = (type: string) => {
    const labels = {
      'OTC': 'Bez recepty',
      'Rp': 'Na receptę',
      'Rpz': 'Recepta szpitalna',
      'Lz': 'Lek zagrożenia'
    };
    return labels[type as keyof typeof labels] || type;
  };
  
  if (packages.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <FaPrescriptionBottleAlt className={`w-12 h-12 mx-auto mb-3 ${
          darkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <p className={`text-lg font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Brak dostępnych opakowań
        </p>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className={`rounded-lg border overflow-hidden ${
        darkMode ? 'border-gray-600' : 'border-gray-200'
      }`}>
        
        {/* Nagłówek tabeli */}
        <div className={`${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        } border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium">
            
            {/* Wielkość opakowania */}
            <button
              onClick={() => handleSort('size')}
              className={`col-span-3 flex items-center gap-2 text-left transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Wielkość opakowania
              {getSortIcon('size')}
            </button>
            
            {/* EAN */}
            <div className={`col-span-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              EAN
            </div>
            
            {/* Typ recepty */}
            <button
              onClick={() => handleSort('prescriptionType')}
              className={`col-span-2 flex items-center gap-2 text-left transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Typ recepty
              {getSortIcon('prescriptionType')}
            </button>
            
            {/* Status refundacji */}
            <button
              onClick={() => handleSort('refundationStatus')}
              className={`col-span-3 flex items-center gap-2 text-left transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Status refundacji
              {getSortIcon('refundationStatus')}
            </button>
            
            {/* Numer pozwolenia */}
            <button
              onClick={() => handleSort('registrationNumber')}
              className={`col-span-2 flex items-center gap-2 text-left transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Nr pozwolenia
              {getSortIcon('registrationNumber')}
            </button>
          </div>
        </div>
        
        {/* Wiersze tabeli */}
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {sortedPackages.map((pkg, index) => (
            <div
              key={`${pkg.ean}-${index}`}
              className={`grid grid-cols-12 gap-4 p-4 transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              
              {/* Wielkość opakowania */}
              <div className="col-span-3">
                <div className={`font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {pkg.size || pkg.description}
                </div>
                {pkg.description && pkg.size !== pkg.description && (
                  <div className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {pkg.description.length > 50 
                      ? `${pkg.description.substring(0, 50)}...`
                      : pkg.description
                    }
                  </div>
                )}
              </div>
              
              {/* EAN */}
              <div className="col-span-2">
                {pkg.ean ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FaBarcode className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`font-mono text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {pkg.ean}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(pkg.ean)}
                      className={`p-1 rounded transition-colors ${
                        copiedEan === pkg.ean
                          ? 'text-green-500'
                          : darkMode 
                            ? 'text-gray-400 hover:text-white' 
                            : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title={copiedEan === pkg.ean ? 'Skopiowano!' : 'Kopiuj EAN'}
                    >
                      <FaCopy className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Brak EAN
                  </span>
                )}
              </div>
              
              {/* Typ recepty */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  {getPrescriptionIcon(pkg.prescriptionType)}
                  <div>
                    <div className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {pkg.prescriptionType}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {getPrescriptionLabel(pkg.prescriptionType)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status refundacji */}
              <div className="col-span-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  getRefundationColor(pkg.refundationStatus)
                }`}>
                  {getRefundationText(pkg)}
                </span>
                {pkg.price && (
                  <div className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Cena: {pkg.price.toFixed(2)} zł
                  </div>
                )}
              </div>
              
              {/* Numer pozwolenia */}
              <div className="col-span-2">
                <div className={`font-mono text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {pkg.registrationNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Podsumowanie */}
      <div className={`mt-4 p-3 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Łącznie: {packages.length} {packages.length === 1 ? 'opakowanie' : 'opakowań'}
          </span>
          
          <div className="flex items-center gap-4">
            {/* Statystyki typów recept */}
            {Array.from(new Set(packages.map(p => p.prescriptionType))).map(type => {
              const count = packages.filter(p => p.prescriptionType === type).length;
              return (
                <span key={type} className={`flex items-center gap-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {getPrescriptionIcon(type)}
                  {type}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTable;