import React from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaPrescriptionBottleAlt, FaShieldAlt } from 'react-icons/fa';
import { getIndicationsForATC } from '../../data/atcToIcd11Mapping';

interface Drug {
  id: string;
  nazwaProduktu: string;
  nazwaPowszechnieStosowana: string;
  moc: string;
  nazwaPostaciFarmaceutycznej: string;
  kodATC: string;
  opakowanie: string;
  podmiotOdpowiedzialny: string;
  numerPozwolenia: string;
  waznoscPozwolenia: string;
  statusRefundacji: string;
  drogaPodania: string;
}

interface DrugDetailedDescriptionProps {
  drug: Drug;
  darkMode: boolean;
}

const DrugDetailedDescription: React.FC<DrugDetailedDescriptionProps> = ({ drug, darkMode }) => {
  const indications = getIndicationsForATC(drug.kodATC);
  
  // Mapowanie grup ATC na opisy
  const getTherapeuticCategory = (atcCode: string): string => {
    const categories: Record<string, string> = {
      'A': 'Leki gastroenterologiczne i metaboliczne',
      'B': 'Leki krwiopochodne i hematopoetyczne',
      'C': 'Leki kardiovaskularne',
      'D': 'Leki dermatologiczne',
      'G': 'Leki urogenitalne i hormony płciowe',
      'H': 'Preparaty hormonalne ogólnoustrojowe',
      'J': 'Antybiotyki i leki przeciwzakaźne',
      'L': 'Leki przeciwnowotworowe i immunomodulujące',
      'M': 'Leki układu mięśniowo-szkieletowego',
      'N': 'Leki układu nerwowego',
      'P': 'Leki przeciwpasożytnicze',
      'R': 'Leki układu oddechowego',
      'S': 'Leki narządów zmysłów',
      'V': 'Różne'
    };
    
    const mainGroup = atcCode.charAt(0);
    return categories[mainGroup] || 'Inne preparaty lecznicze';
  };

  const getDetailedDescription = (atcCode: string): string => {
    // Szczegółowe opisy na podstawie pełnego kodu ATC
    const detailedDescriptions: Record<string, string> = {
      'M05BA08': 'Potężny bisfosfonian trzeciej generacji stosowany w leczeniu osteoporozy i onkologii. Hamuje resorpcję kości przez osteoklosty.',
      'M01AE02': 'Niesteroidowy lek przeciwzapalny z grupy pochodnych kwasu propionowego o działaniu przeciwbólowym, przeciwzapalnym i przeciwgorączkowym.',
      'N02BE01': 'Centralnie działający analgetyk i antypiretyk. Hamuje syntezę prostaglandyn w ośrodkowym układzie nerwowym.',
      'M01AE01': 'NLPZ o działaniu przeciwzapalnym, przeciwbólowym i przeciwgorączkowym. Hamuje cyklooksygenazę.',
      'J01CA04': 'Półsyntetyczny antybiotyk beta-laktamowy o szerokim spektrum działania bakteriobójczego.',
      'D07AC13': 'Silny kortykosteroid syntetyczny do stosowania miejscowego o działaniu przeciwzapalnym i immunosupresyjnym.',
      'A11CC05': 'Prohormon witaminy D, przekształcany w organizmie do kalcytriolu - aktywnej formy witaminy D3.'
    };
    
    return detailedDescriptions[atcCode] || `Produkt leczniczy z grupy: ${getTherapeuticCategory(atcCode)}`;
  };

  return (
    <div className="space-y-6">
      {/* Podstawowy opis */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Opis produktu leczniczego
            </h3>
            <p className={`${darkMode ? 'text-blue-200' : 'text-blue-700'} leading-relaxed mb-3`}>
              {getDetailedDescription(drug.kodATC)}
            </p>
            <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <strong>Kategoria terapeutyczna:</strong> {getTherapeuticCategory(drug.kodATC)}
            </div>
          </div>
        </div>
      </div>

      {/* Wskazania */}
      {indications && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
          <div className="flex items-start gap-3">
            <FaPrescriptionBottleAlt className="text-green-500 text-xl mt-1 flex-shrink-0" />
            <div className="w-full">
              <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                Główne wskazania do stosowania
              </h3>
              
              {/* Wskazania główne */}
              {indications.primaryIndications.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Wskazania podstawowe:
                  </h4>
                  <div className="grid gap-2">
                    {indications.primaryIndications.map((indication, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-3 rounded-md ${
                        darkMode ? 'bg-green-800/30' : 'bg-green-100'
                      }`}>
                        <span className={`font-mono text-xs px-2 py-1 rounded ${
                          darkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800'
                        }`}>
                          {indication.code}
                        </span>
                        <span className={`${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                          {indication.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wskazania dodatkowe */}
              {indications.secondaryIndications.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Wskazania dodatkowe:
                  </h4>
                  <div className="grid gap-2">
                    {indications.secondaryIndications.map((indication, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-3 rounded-md ${
                        darkMode ? 'bg-green-800/20' : 'bg-green-50'
                      }`}>
                        <span className={`font-mono text-xs px-2 py-1 rounded ${
                          darkMode ? 'bg-green-800 text-green-300' : 'bg-green-300 text-green-700'
                        }`}>
                          {indication.code}
                        </span>
                        <span className={`${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          {indication.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ostrzeżenia i informacje */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'} border`}>
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className={`font-bold text-lg mb-3 ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              Ważne informacje
            </h3>
            <div className="space-y-2">
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                • Stosuj zgodnie z zaleceniami lekarza lub farmaceuty
              </p>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                • Przeczytaj ulotkę dołączoną do opakowania przed użyciem
              </p>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                • W przypadku wątpliwości skonsultuj się z lekarzem lub farmaceutą
              </p>
              <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                • Nie przekraczaj zalecanej dawki
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informacje regulacyjne */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border`}>
        <div className="flex items-center gap-2 mb-2">
          <FaShieldAlt className="text-gray-500 text-sm" />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Informacje regulacyjne
          </span>
        </div>
        <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p><strong>Numer pozwolenia:</strong> {drug.numerPozwolenia}</p>
          <p><strong>Ważność pozwolenia:</strong> {drug.waznoscPozwolenia}</p>
          <p><strong>Kod ATC:</strong> {drug.kodATC}</p>
          <p><strong>Status refundacji:</strong> {drug.statusRefundacji}</p>
        </div>
      </div>
    </div>
  );
};

export default DrugDetailedDescription;