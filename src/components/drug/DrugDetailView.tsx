import React, { useState } from 'react';
import {
  FaArrowLeft, FaStar, FaRegStar, FaExternalLinkAlt, FaDownload,
  FaBarcode, FaBuilding, FaCalendarAlt, FaFlask, FaExclamationTriangle,
  FaFileAlt, FaClipboardList, FaShieldAlt, FaBook
} from 'react-icons/fa';
import { EnhancedDrug, ICD11Indication } from '../../types/drug';
import PackageTable from './PackageTable';

interface DrugDetailViewProps {
  drug: EnhancedDrug;
  onBack: () => void;
  onToggleFavorite: (drugId: string) => void;
  isFavorite: boolean;
  darkMode?: boolean;
}

type TabKey = 'basic' | 'indications' | 'composition' | 'warnings' | 'documents';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const DrugDetailView: React.FC<DrugDetailViewProps> = ({
  drug,
  onBack,
  onToggleFavorite,
  isFavorite,
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  
  const tabs: Tab[] = [
    {
      key: 'basic',
      label: 'Podstawowe informacje',
      icon: <FaClipboardList className="w-4 h-4" />
    },
    {
      key: 'indications',
      label: 'Wskazania i dawkowanie',
      icon: <FaBook className="w-4 h-4" />
    },
    {
      key: 'composition',
      label: 'Skład i postać',
      icon: <FaFlask className="w-4 h-4" />
    },
    {
      key: 'warnings',
      label: 'Przeciwwskazania i ostrzeżenia',
      icon: <FaShieldAlt className="w-4 h-4" />
    },
    {
      key: 'documents',
      label: 'Dokumenty',
      icon: <FaFileAlt className="w-4 h-4" />
    }
  ];
  
  // Formatuj datę
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  // Generuj PDF (placeholder)
  const generatePDF = () => {
    // Tu byłaby implementacja generowania PDF
    console.log('Generating PDF for drug:', drug.id);
    alert('Funkcja generowania PDF będzie dostępna wkrótce');
  };
  
  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Header */}
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Powrót */}
            <button
              onClick={onBack}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
              Powrót do wyników
            </button>
            
            {/* Akcje */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleFavorite(drug.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isFavorite ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
                {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              </button>
              
              <button
                onClick={generatePDF}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaDownload className="w-4 h-4" />
                Eksport PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Nagłówek leku */}
        <div className={`rounded-lg p-6 mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {drug.tradeName}
                {drug.strength && (
                  <span className={`ml-3 text-2xl font-medium ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {drug.strength}
                  </span>
                )}
              </h1>
              
              <p className={`text-xl mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {drug.commonName} • {drug.pharmaceuticalForm}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaBuilding className={`w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {drug.manufacturer}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className={`w-4 h-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Ważne do: {formatDate(drug.expiryDate)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status badge */}
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              drug.status === 'active' 
                ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                : drug.status === 'withdrawn'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {drug.status === 'active' ? 'Aktywny' : 
               drug.status === 'withdrawn' ? 'Wycofany' : 'Zawieszony'}
            </div>
          </div>
          
          {/* Quick info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Kod ATC
              </div>
              <div className={`font-mono text-lg ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {drug.atcCode.code}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {drug.atcCode.description}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Droga podania
              </div>
              <div className={`text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {drug.administrationRoute}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Liczba opakowań
              </div>
              <div className={`text-lg ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {drug.packages.length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Zakładki */}
        <div className={`rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          
          {/* Navigation tabs */}
          <div className={`border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : darkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            
            {/* Podstawowe informacje */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dostępne opakowania
                  </h3>
                  <PackageTable packages={drug.packages} darkMode={darkMode} />
                </div>
              </div>
            )}
            
            {/* Wskazania i dawkowanie */}
            {activeTab === 'indications' && (
              <div className="space-y-6">
                {drug.indications.length > 0 ? (
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Wskazania ICD-11
                    </h3>
                    <div className="space-y-3">
                      {drug.indications.map((indication, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          indication.category === 'primary'
                            ? darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                            : indication.category === 'secondary'
                              ? darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                              : darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className={`font-mono text-sm mb-1 ${
                                indication.category === 'primary' 
                                  ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                  : indication.category === 'secondary'
                                    ? darkMode ? 'text-green-400' : 'text-green-600'
                                    : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                              }`}>
                                {indication.code}
                              </div>
                              <div className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {indication.name}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              indication.category === 'primary' 
                                ? darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-800'
                                : indication.category === 'secondary'
                                  ? darkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-800'
                                  : darkMode ? 'bg-yellow-800 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {indication.category === 'primary' ? 'Podstawowe' :
                               indication.category === 'secondary' ? 'Dodatkowe' : 'Off-label'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBook className={`w-12 h-12 mx-auto mb-3 ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <p className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Brak dostępnych wskazań ICD-11
                    </p>
                  </div>
                )}
                
                {/* Dawkowanie */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dawkowanie
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className={`font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Dawkowanie standardowe
                      </div>
                      <div className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {drug.standardDosage || 'Brak informacji'}
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className={`font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Dawkowanie pediatryczne
                      </div>
                      <div className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {drug.pediatricDosage || 'Brak informacji'}
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <div className={`font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Dawkowanie u osób starszych
                      </div>
                      <div className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {drug.elderlyDosage || 'Brak informacji'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Skład i postać */}
            {activeTab === 'composition' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Substancje czynne
                  </h3>
                  <div className="space-y-2">
                    {drug.activeSubstances.map((substance, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <span className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {substance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Postać farmaceutyczna
                  </h3>
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {drug.pharmaceuticalForm}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Przeciwwskazania i ostrzeżenia */}
            {activeTab === 'warnings' && (
              <div className="space-y-6">
                {/* Przeciwwskazania */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Przeciwwskazania
                  </h3>
                  {drug.contraindications.length > 0 ? (
                    <div className="space-y-2">
                      {drug.contraindications.map((contraindication, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          darkMode 
                            ? 'bg-red-900/20 border-red-500' 
                            : 'bg-red-50 border-red-500'
                        }`}>
                          <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                            <span className={
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }>
                              {contraindication}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Brak dostępnych informacji o przeciwwskazaniach
                    </p>
                  )}
                </div>
                
                {/* Ostrzeżenia */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Ostrzeżenia
                  </h3>
                  {drug.warnings.length > 0 ? (
                    <div className="space-y-2">
                      {drug.warnings.map((warning, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          darkMode 
                            ? 'bg-yellow-900/20 border-yellow-500' 
                            : 'bg-yellow-50 border-yellow-500'
                        }`}>
                          <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                            <span className={
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }>
                              {warning}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Brak dostępnych ostrzeżeń
                    </p>
                  )}
                </div>
                
                {/* Interakcje */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Interakcje lekowe
                  </h3>
                  {drug.interactions.length > 0 ? (
                    <div className="space-y-3">
                      {drug.interactions.map((interaction, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          interaction.severity === 'major'
                            ? darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                            : interaction.severity === 'moderate'
                              ? darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
                              : darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className={`font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {interaction.drugName}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              interaction.severity === 'major'
                                ? 'bg-red-100 text-red-800'
                                : interaction.severity === 'moderate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {interaction.severity === 'major' ? 'Poważna' :
                               interaction.severity === 'moderate' ? 'Umiarkowana' : 'Lekka'}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {interaction.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Brak znanych interakcji lekowych
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Dokumenty */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Charakterystyka Produktu Leczniczego */}
                  <div className={`p-6 rounded-lg border-2 border-dashed ${
                    drug.spcUrl 
                      ? darkMode ? 'border-blue-600 bg-blue-900/20' : 'border-blue-300 bg-blue-50'
                      : darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <FaFileAlt className={`w-12 h-12 mx-auto mb-3 ${
                        drug.spcUrl
                          ? darkMode ? 'text-blue-400' : 'text-blue-500'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <h4 className={`text-lg font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Charakterystyka Produktu Leczniczego
                      </h4>
                      {drug.spcUrl ? (
                        <a
                          href={drug.spcUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                          Otwórz ChPL
                        </a>
                      ) : (
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Dokument niedostępny
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Ulotka dla pacjenta */}
                  <div className={`p-6 rounded-lg border-2 border-dashed ${
                    drug.pilUrl 
                      ? darkMode ? 'border-green-600 bg-green-900/20' : 'border-green-300 bg-green-50'
                      : darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <FaClipboardList className={`w-12 h-12 mx-auto mb-3 ${
                        drug.pilUrl
                          ? darkMode ? 'text-green-400' : 'text-green-500'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <h4 className={`text-lg font-medium mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Ulotka dla pacjenta
                      </h4>
                      {drug.pilUrl ? (
                        <a
                          href={drug.pilUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            darkMode
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                          Otwórz ulotkę
                        </a>
                      ) : (
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Dokument niedostępny
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Informacja o ostatniej aktualizacji */}
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className={`w-4 h-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Ostatnia aktualizacja: {formatDate(drug.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugDetailView;