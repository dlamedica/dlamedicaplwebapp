import React, { useState } from 'react';
import { 
  FaTimes, FaPlus, FaDownload, FaExchangeAlt, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { EnhancedDrug } from '../../types/drug';
import PackageTable from './PackageTable';

interface DrugComparisonProps {
  drugs: EnhancedDrug[];
  onRemoveDrug: (drugIndex: number) => void;
  onAddDrug: () => void;
  onClose: () => void;
  darkMode?: boolean;
}

const DrugComparison: React.FC<DrugComparisonProps> = ({
  drugs,
  onRemoveDrug,
  onAddDrug,
  onClose,
  darkMode = false
}) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'indications' | 'packages'>('basic');
  
  const maxDrugs = 3;
  const canAddMore = drugs.length < maxDrugs;

  const exportComparison = () => {
    console.log('Exporting comparison for drugs:', drugs.map(d => d.id));
    alert('Funkcja eksportu porównania będzie dostępna wkrótce');
  };

  // Znajdź wspólne i różne wskazania
  const getIndicationComparison = () => {
    if (drugs.length < 2) return { common: [], unique: [] };
    
    const allIndications = drugs.flatMap(drug => drug.indications);
    const indicationCounts = allIndications.reduce((acc, indication) => {
      const key = `${indication.code}-${indication.name}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const common = Object.entries(indicationCounts)
      .filter(([_, count]) => count === drugs.length)
      .map(([key]) => {
        const [code, name] = key.split('-');
        return { code, name };
      });

    const unique = drugs.map(drug => 
      drug.indications.filter(indication => {
        const key = `${indication.code}-${indication.name}`;
        return indicationCounts[key] === 1;
      })
    );

    return { common, unique };
  };

  const { common: commonIndications, unique: uniqueIndications } = getIndicationComparison();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-7xl w-full max-h-[90vh] overflow-hidden rounded-lg ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } flex items-center justify-between`}>
          <div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Porównanie leków ({drugs.length}/{maxDrugs})
            </h2>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Porównaj właściwości, wskazania i opakowania wybranych leków
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportComparison}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaDownload className="w-4 h-4" />
              Eksport
            </button>
            
            <button
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaTimes className="w-4 h-4" />
              Zamknij
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className={`px-6 py-3 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex space-x-1">
            {[
              { key: 'basic', label: 'Podstawowe' },
              { key: 'indications', label: 'Wskazania' },
              { key: 'packages', label: 'Opakowania' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === key
                    ? darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Drug headers */}
          <div className="grid gap-4 p-6" style={{ gridTemplateColumns: `repeat(${Math.max(drugs.length + (canAddMore ? 1 : 0), 2)}, 1fr)` }}>
            {drugs.map((drug, index) => (
              <div key={drug.id} className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } relative`}>
                <button
                  onClick={() => onRemoveDrug(index)}
                  className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
                
                <h3 className={`font-bold text-lg mb-2 pr-8 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {drug.tradeName}
                </h3>
                
                <p className={`text-sm mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {drug.commonName}
                </p>
                
                <div className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {drug.strength} • {drug.pharmaceuticalForm}
                </div>
              </div>
            ))}
            
            {/* Add drug button */}
            {canAddMore && (
              <button
                onClick={onAddDrug}
                className={`p-8 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center min-h-[120px] ${
                  darkMode 
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-500 hover:text-gray-600'
                }`}
              >
                <FaPlus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Dodaj lek</span>
              </button>
            )}
          </div>

          {/* Content sections */}
          <div className="px-6 pb-6">
            
            {/* Basic comparison */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                {[
                  { label: 'Kod ATC', key: 'atcCode', getValue: (drug: EnhancedDrug) => drug.atcCode.code },
                  { label: 'Opis ATC', key: 'atcDescription', getValue: (drug: EnhancedDrug) => drug.atcCode.description },
                  { label: 'Droga podania', key: 'administrationRoute', getValue: (drug: EnhancedDrug) => drug.administrationRoute },
                  { label: 'Producent', key: 'manufacturer', getValue: (drug: EnhancedDrug) => drug.manufacturer },
                  { label: 'Substancje czynne', key: 'activeSubstances', getValue: (drug: EnhancedDrug) => drug.activeSubstances.join(', ') }
                ].map(({ label, key, getValue }) => (
                  <div key={key}>
                    <h4 className={`font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {label}
                    </h4>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${drugs.length}, 1fr)` }}>
                      {drugs.map((drug, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                          <span className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {getValue(drug)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Indications comparison */}
            {activeSection === 'indications' && (
              <div className="space-y-6">
                
                {/* Common indications */}
                {commonIndications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FaCheck className="w-4 h-4 text-green-500" />
                      <h4 className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Wspólne wskazania ({commonIndications.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {commonIndications.map((indication, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 border-green-500 ${
                          darkMode ? 'bg-green-900/20' : 'bg-green-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-sm ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              {indication.code}
                            </span>
                            <span className={`${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {indication.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unique indications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaExchangeAlt className="w-4 h-4 text-blue-500" />
                    <h4 className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Wskazania specyficzne dla każdego leku
                    </h4>
                  </div>
                  
                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${drugs.length}, 1fr)` }}>
                    {drugs.map((drug, drugIndex) => (
                      <div key={drug.id}>
                        <h5 className={`font-medium mb-3 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {drug.tradeName}
                        </h5>
                        <div className="space-y-2">
                          {uniqueIndications[drugIndex]?.map((indication, index) => (
                            <div key={index} className={`p-2 rounded-lg ${
                              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                            }`}>
                              <div className="text-sm">
                                <span className={`font-mono ${
                                  darkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                  {indication.code}
                                </span>
                                <div className={`mt-1 ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {indication.name}
                                </div>
                              </div>
                            </div>
                          )) || (
                            <p className={`text-sm italic ${
                              darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              Brak unikalnych wskazań
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Packages comparison */}
            {activeSection === 'packages' && (
              <div className="space-y-6">
                {drugs.map((drug, index) => (
                  <div key={drug.id}>
                    <h4 className={`font-semibold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {drug.tradeName} - Opakowania ({drug.packages.length})
                    </h4>
                    <PackageTable packages={drug.packages} darkMode={darkMode} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugComparison;