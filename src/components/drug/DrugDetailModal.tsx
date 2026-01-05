import React, { useState } from 'react';
import { EnhancedDrug } from '../../types/drug';
import { medicalDataService } from '../../services/medicalDataService';
import { 
  FaTimes, FaFileMedical, FaCapsules, FaIndustry, 
  FaGlobe, FaFileAlt, FaUserMd, FaGraduationCap, FaBoxes,
  FaMoneyBillWave, FaInfoCircle, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaQuestionCircle, 
  FaPills, FaBan, FaExchangeAlt, FaSpinner
} from 'react-icons/fa';

interface DrugDetailModalProps {
  drug: EnhancedDrug;
  onClose: () => void;
  onFindSimilar?: (drugId: string) => void;
  onFindSubstitutes?: (drugId: string) => void;
  substitutes?: EnhancedDrug[];
  darkMode: boolean;
}

const DrugDetailModal: React.FC<DrugDetailModalProps> = ({ 
  drug, 
  onClose, 
  onFindSimilar, 
  onFindSubstitutes,
  substitutes = [],
  darkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'packages' | 'documents' | 'manufacturing' | 'clinical' | 'substitutes'>('info');

  const [isLoadingSubstitutes, setIsLoadingSubstitutes] = useState(false);
  const [hasLoadedSubstitutes, setHasLoadedSubstitutes] = useState(false);

  // Pobierz dane medyczne
  const medicalData = drug.atcCodeRaw ? medicalDataService.getMedicalDataByATC(drug.atcCodeRaw) : null;
  
  // Spróbuj także wyszukać po nazwie substancji czynnej
  const medicalDataBySubstance = !medicalData && drug.commonName ? 
    medicalDataService.searchByActiveSubstance(drug.commonName) : null;

  // Ładuj zamienniki natychmiast po otwarciu modala
  React.useEffect(() => {
    if (onFindSubstitutes && !hasLoadedSubstitutes) {
      setHasLoadedSubstitutes(true);
      onFindSubstitutes(drug.id);
    }
  }, [drug.id, onFindSubstitutes, hasLoadedSubstitutes]);

  const tabs = [
    { id: 'info', label: 'Informacje', icon: FaInfoCircle },
    { id: 'clinical', label: 'Dane kliniczne', icon: FaFileMedical },
    { id: 'substitutes', label: 'Zamienniki', icon: FaExchangeAlt },
    { id: 'packages', label: 'Opakowania', icon: FaBoxes },
    { id: 'documents', label: 'Dokumenty', icon: FaFileAlt },
    { id: 'manufacturing', label: 'Producent', icon: FaIndustry }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: 'green', icon: FaCheckCircle, label: 'Aktywny' },
      'withdrawn': { color: 'red', icon: FaTimesCircle, label: 'Wycofany' },
      'suspended': { color: 'yellow', icon: FaExclamationTriangle, label: 'Zawieszony' },
      'expired': { color: 'gray', icon: FaTimesCircle, label: 'Wygasły' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${config.color === 'green' ? 'bg-green-100 text-green-800' : ''}
        ${config.color === 'red' ? 'bg-red-100 text-red-800' : ''}
        ${config.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${config.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
      `}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPrescriptionBadge = (type: string) => {
    const prescriptionConfig = {
      'Rp': { color: 'red', label: 'Rp - Recepta' },
      'Rpz': { color: 'orange', label: 'Rpz - Recepta do zastrzeżonego stosowania' },
      'Rpw': { color: 'purple', label: 'Rpw - Recepta weterynaryjna' },
      'OTC': { color: 'green', label: 'OTC - Bez recepty' },
      'Lz': { color: 'blue', label: 'Lz - Lek zapasowy' }
    };

    const config = prescriptionConfig[type as keyof typeof prescriptionConfig] || 
                  { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
        ${config.color === 'red' ? 'bg-red-100 text-red-800' : ''}
        ${config.color === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
        ${config.color === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
        ${config.color === 'green' ? 'bg-green-100 text-green-800' : ''}
        ${config.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
        ${config.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
      `}>
        {config.label}
      </span>
    );
  };

  const getRefundationBadge = (status: string) => {
    const refundationConfig = {
      'refunded': { color: 'green', icon: FaMoneyBillWave, label: 'Refundowany' },
      'partial': { color: 'yellow', icon: FaMoneyBillWave, label: 'Częściowo refundowany' },
      'none': { color: 'gray', icon: FaTimesCircle, label: 'Bez refundacji' }
    };

    const config = refundationConfig[status as keyof typeof refundationConfig] || refundationConfig.none;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
        ${config.color === 'green' ? 'bg-green-100 text-green-800' : ''}
        ${config.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${config.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
      `}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] mx-4 rounded-lg shadow-xl overflow-hidden flex flex-col
        ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {drug.tradeName}
              </h2>
              {drug.commonName && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {drug.commonName} • {drug.strength}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(drug.status)}
                {drug.atcCodeRaw && (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ATC: {drug.atcCodeRaw}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
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

        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 font-medium transition-colors relative
                  ${activeTab === tab.id
                    ? darkMode 
                      ? 'text-blue-400 bg-gray-700/50' 
                      : 'text-blue-600 bg-blue-50'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 
                    ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Podstawowe informacje */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Podstawowe informacje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Postać farmaceutyczna
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.pharmaceuticalForm}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Droga podania
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.administrationRoute}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Numer pozwolenia
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Ważność pozwolenia
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.registrationValidity}
                    </p>
                  </div>
                </div>
              </section>

              {/* Substancje czynne */}
              <section>
                <h3 className={`text-lg font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FaCapsules className="w-5 h-5 mr-2" />
                  Substancje czynne
                </h3>
                <div className="flex flex-wrap gap-2">
                  {drug.activeSubstances.map((substance, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode 
                          ? 'bg-blue-900/50 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {substance}
                    </span>
                  ))}
                </div>
              </section>

              {/* Klasyfikacja ATC */}
              {drug.atcCode.code && (
                <section>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Klasyfikacja ATC
                  </h3>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.atcCode.code} - {drug.atcCode.description}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {drug.atcCode.level1}
                    </p>
                  </div>
                </section>
              )}

              {/* Wskazania ICD-11 */}
              {drug.indications.length > 0 && (
                <section>
                  <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Wskazania (ICD-11)
                  </h3>
                  <div className="space-y-2">
                    {drug.indications.map((indication, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          indication.category === 'primary'
                            ? darkMode ? 'bg-green-900/20' : 'bg-green-50'
                            : darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}
                      >
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {indication.name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {indication.code} • {indication.category === 'primary' ? 'Wskazanie główne' : 'Wskazanie dodatkowe'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dostępne opakowania
              </h3>
              {drug.packages.length > 0 ? (
                <div className="grid gap-4">
                  {drug.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {pkg.description || pkg.size}
                          </p>
                          {pkg.ean && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              EAN: {pkg.ean}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {getPrescriptionBadge(pkg.prescriptionType)}
                          {getRefundationBadge(pkg.refundationStatus)}
                        </div>
                      </div>
                      
                      {(pkg.price || pkg.refundationPrice || pkg.patientPayment) && (
                        <div className={`grid grid-cols-3 gap-4 pt-3 border-t ${
                          darkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          {pkg.price && (
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Cena detaliczna
                              </p>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {pkg.price.toFixed(2)} zł
                              </p>
                            </div>
                          )}
                          {pkg.refundationPercentage && (
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Poziom refundacji
                              </p>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {pkg.refundationPercentage}%
                              </p>
                            </div>
                          )}
                          {pkg.patientPayment !== undefined && (
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Odpłatność pacjenta
                              </p>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {pkg.patientPayment.toFixed(2)} zł
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Brak informacji o opakowaniach
                </p>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dokumenty
              </h3>
              
              <div className="grid gap-4">
                {/* Dokumenty podstawowe */}
                {(drug.documents.leaflet || drug.documents.spc) && (
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dokumenty podstawowe
                    </h4>
                    <div className="grid gap-3">
                      {drug.documents.leaflet && (
                        <a
                          href={drug.documents.leaflet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 rounded-lg border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <FaFileAlt className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Ulotka dla pacjenta
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Informacje o stosowaniu leku
                            </p>
                          </div>
                        </a>
                      )}
                      {drug.documents.spc && (
                        <a
                          href={drug.documents.spc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 rounded-lg border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <FaFileMedical className={`w-5 h-5 mr-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Charakterystyka produktu leczniczego
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Szczegółowe informacje dla fachowców
                            </p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Materiały edukacyjne */}
                {(drug.documents.educationalToolsHCP || drug.documents.educationalToolsPatient) && (
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Materiały edukacyjne
                    </h4>
                    <div className="grid gap-3">
                      {drug.documents.educationalToolsHCP && (
                        <a
                          href={drug.documents.educationalToolsHCP}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 rounded-lg border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <FaUserMd className={`w-5 h-5 mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Materiały dla personelu medycznego
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Przewodniki i szkolenia
                            </p>
                          </div>
                        </a>
                      )}
                      {drug.documents.educationalToolsPatient && (
                        <a
                          href={drug.documents.educationalToolsPatient}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 rounded-lg border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <FaGraduationCap className={`w-5 h-5 mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Materiały dla pacjentów
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Informacje edukacyjne
                            </p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Import równoległy */}
                {(drug.documents.parallelImportLeaflet || drug.documents.parallelImportLabelLeaflet) && (
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dokumenty importu równoległego
                    </h4>
                    <div className="grid gap-3">
                      {drug.documents.parallelImportLeaflet && (
                        <a
                          href={drug.documents.parallelImportLeaflet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 rounded-lg border transition-colors ${
                            darkMode
                              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <FaFileAlt className={`w-5 h-5 mr-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Ulotka importu równoległego
                            </p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Brak dokumentów */}
                {!drug.documents.leaflet && !drug.documents.spc && 
                 !drug.documents.educationalToolsHCP && !drug.documents.educationalToolsPatient &&
                 !drug.documents.parallelImportLeaflet && (
                  <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Brak dostępnych dokumentów
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Clinical Data Tab */}
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dane kliniczne
              </h3>

              {(medicalData || medicalDataBySubstance) ? (
                <>
                  {/* Wskazania */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaPills className="w-4 h-4 mr-2 text-green-500" />
                      Wskazania do stosowania
                    </h4>
                    <div className="space-y-2">
                      {(medicalData?.wskazania || medicalDataBySubstance?.data.wskazania || []).map((wskazanie, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <p className={`text-sm ${darkMode ? 'text-green-100' : 'text-green-800'}`}>
                            • {wskazanie}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Przeciwwskazania */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaBan className="w-4 h-4 mr-2 text-red-500" />
                      Przeciwwskazania
                    </h4>
                    <div className="space-y-2">
                      {(medicalData?.przeciwwskazania || medicalDataBySubstance?.data.przeciwwskazania || []).map((przeciwwskazanie, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <p className={`text-sm ${darkMode ? 'text-red-100' : 'text-red-800'}`}>
                            • {przeciwwskazanie}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Dawkowanie */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaCapsules className="w-4 h-4 mr-2 text-blue-500" />
                      Dawkowanie
                    </h4>
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="space-y-3">
                        <div>
                          <p className={`font-medium mb-1 ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                            Dorośli:
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                            {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.dorośli}
                          </p>
                        </div>
                        
                        {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.dzieci && (
                          <div>
                            <p className={`font-medium mb-1 ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                              Dzieci:
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                              {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.dzieci}
                            </p>
                          </div>
                        )}
                        
                        {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.osobyStarsze && (
                          <div>
                            <p className={`font-medium mb-1 ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                              Osoby starsze:
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                              {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.osobyStarsze}
                            </p>
                          </div>
                        )}
                        
                        {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.uwagi && (
                          <div className={`p-2 rounded ${darkMode ? 'bg-blue-800/50' : 'bg-blue-100'}`}>
                            <p className={`text-sm font-medium ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                              Uwagi:
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                              {(medicalData?.dawkowanie || medicalDataBySubstance?.data.dawkowanie)?.uwagi}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Ostrzeżenia */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaExclamationTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                      Ostrzeżenia i środki ostrożności
                    </h4>
                    <div className="space-y-2">
                      {(medicalData?.ostrzeżenia || medicalDataBySubstance?.data.ostrzeżenia || []).map((ostrzeżenie, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
                          }`}
                        >
                          <p className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>
                            • {ostrzeżenie}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Interakcje */}
                  {(medicalData?.interakcje || medicalDataBySubstance?.data.interakcje) && (
                    <section>
                      <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <FaExclamationTriangle className="w-4 h-4 mr-2 text-orange-500" />
                        Główne interakcje lekowe
                      </h4>
                      <div className="space-y-2">
                        {(medicalData?.interakcje || medicalDataBySubstance?.data.interakcje || []).map((interakcja, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              darkMode ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-200'
                            }`}
                          >
                            <p className={`text-sm ${darkMode ? 'text-orange-100' : 'text-orange-800'}`}>
                              • {interakcja}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <>
                  {/* Wskazania - gdy brak danych */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaFileMedical className="w-4 h-4 mr-2" />
                      Wskazania do stosowania
                    </h4>
                    {drug.indications.length > 0 ? (
                      <div className="space-y-2">
                        {drug.indications.map((indication, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              indication.category === 'primary'
                                ? darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                                : darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {indication.name}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Kod ICD-11: {indication.code} • {indication.category === 'primary' ? 'Wskazanie główne' : 'Wskazanie dodatkowe'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-start">
                          <FaInfoCircle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <div>
                            <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Wskazania dla tego leku
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Szczegółowe wskazania do stosowania tego leku znajdziesz w oficjalnej dokumentacji. 
                              Kod ATC: <span className="font-mono">{drug.atcCodeRaw}</span>
                            </p>
                            {drug.atcCode.description && (
                              <p className={`text-sm mt-1 font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Grupa terapeutyczna: {drug.atcCode.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Przeciwwskazania - gdy brak danych */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaExclamationTriangle className="w-4 h-4 mr-2" />
                      Przeciwwskazania
                    </h4>
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-start">
                        <FaExclamationTriangle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Sprawdź w ulotce dla pacjenta
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Szczegółowe przeciwwskazania znajdziesz w dokumentach urzędowych leku.
                          </p>
                        </div>
                      </div>
                      {(drug.documents.leaflet || drug.documents.spc) && (
                        <div className="mt-3 flex gap-2">
                          {drug.documents.leaflet && (
                            <a
                              href={drug.documents.leaflet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              <FaFileAlt className="w-3 h-3 mr-1" />
                              Ulotka
                            </a>
                          )}
                          {drug.documents.spc && (
                            <a
                              href={drug.documents.spc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                                darkMode
                                  ? 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              <FaFileMedical className="w-3 h-3 mr-1" />
                              Charakterystyka
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Dawkowanie - podstawowe info */}
                  <section>
                    <h4 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <FaCapsules className="w-4 h-4 mr-2" />
                      Informacje o preparacie
                    </h4>
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="grid gap-3">
                        <div>
                          <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Moc: {drug.strength}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Postać: {drug.pharmaceuticalForm}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Droga podania: {drug.administrationRoute}
                          </p>
                        </div>
                        <div className="flex items-start">
                          <FaInfoCircle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Szczegółowe dawkowanie znajdziesz w ulotce dla pacjenta
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* Ostrzeżenie prawne */}
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex items-start">
                  <FaExclamationTriangle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Ważne
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Informacje mają charakter orientacyjny. Przed zastosowaniem leku skonsultuj się z lekarzem 
                      lub farmaceutą i zapoznaj się z ulotką dla pacjenta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Substitutes Tab */}
          {activeTab === 'substitutes' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Zamienniki leku
              </h3>

              {substitutes.length > 0 ? (
                <div className="space-y-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Znaleziono {substitutes.length} zamienników z tą samą substancją czynną:
                  </p>
                  
                  <div className="grid gap-4">
                    {substitutes.map((substitute, index) => (
                      <div
                        key={substitute.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {substitute.tradeName}
                            </h4>
                            {substitute.commonName && (
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {substitute.commonName} • {substitute.strength}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(substitute.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Postać:
                            </span>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {substitute.pharmaceuticalForm}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Producent:
                            </span>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {substitute.marketingAuthorization}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Refundacja:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {substitute.packages.some(pkg => pkg.refundationStatus === 'refunded' || pkg.refundationStatus === 'partial') ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                                }`}>
                                  Refundowany
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  Bez refundacji
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {substitute.packages.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Dostępne opakowania:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {substitute.packages.slice(0, 3).map((pkg, pkgIndex) => (
                                <span
                                  key={pkgIndex}
                                  className={`text-xs px-2 py-1 rounded ${
                                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {pkg.description || pkg.size}
                                  {pkg.price && ` - ${pkg.price.toFixed(2)} zł`}
                                </span>
                              ))}
                              {substitute.packages.length > 3 && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  +{substitute.packages.length - 3} więcej
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FaExchangeAlt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Brak dostępnych zamienników</p>
                  <p className="text-sm">
                    Nie znaleziono leków z tą samą substancją czynną
                  </p>
                </div>
              )}

              {/* Informacje o zamienniках */}
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start">
                  <FaInfoCircle className={`w-5 h-5 mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      O zamienniach leków
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Zamienniki to leki zawierające tę samą substancję czynną w tej samej mocy. 
                      Przed zmianą leku zawsze skonsultuj się z lekarzem lub farmaceutą.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manufacturing Tab */}
          {activeTab === 'manufacturing' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Informacje o produkcji
              </h3>

              {/* Podmiot odpowiedzialny */}
              <section>
                <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Podmiot odpowiedzialny
                </h4>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {drug.marketingAuthorization}
                  </p>
                </div>
              </section>

              {/* Informacje o produkcji */}
              {Object.values(drug.manufacturingInfo).some(v => v) && (
                <section>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Szczegóły produkcji
                  </h4>
                  <div className="grid gap-4">
                    {drug.manufacturingInfo.manufacturer && (
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Wytwórca
                        </label>
                        <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {drug.manufacturingInfo.manufacturer}
                          {drug.manufacturingInfo.manufacturerCountry && (
                            <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              ({drug.manufacturingInfo.manufacturerCountry})
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {drug.manufacturingInfo.importer && (
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Importer
                        </label>
                        <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {drug.manufacturingInfo.importer}
                          {drug.manufacturingInfo.importerCountry && (
                            <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              ({drug.manufacturingInfo.importerCountry})
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {drug.manufacturingInfo.exportCountry && (
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Kraj eksportu
                        </label>
                        <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {drug.manufacturingInfo.exportCountry}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Procedura rejestracji */}
              <section>
                <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Procedura rejestracji
                </h4>
                <div className="grid gap-4">
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Typ procedury
                    </label>
                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {drug.procedureType || 'Nieznany'}
                    </p>
                  </div>
                  {drug.legalBasis && (
                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Podstawa prawna
                      </label>
                      <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {drug.legalBasis}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugDetailModal;