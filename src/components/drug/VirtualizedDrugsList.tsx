import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { FaBuilding, FaCertificate } from 'react-icons/fa';

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

interface VirtualizedDrugsListProps {
  drugs: Drug[];
  onDrugClick: (drug: Drug) => void;
  darkMode: boolean;
  generateDrugDescription: (drug: Drug) => string;
}

interface DrugRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    drugs: Drug[];
    onDrugClick: (drug: Drug) => void;
    darkMode: boolean;
    generateDrugDescription: (drug: Drug) => string;
  };
}

const DrugRow: React.FC<DrugRowProps> = ({ index, style, data }) => {
  const { drugs, onDrugClick, darkMode, generateDrugDescription } = data;
  const drug = drugs[index];

  if (!drug) return null;

  return (
    <div style={style} className="px-4">
      <div
        className={`grid grid-cols-12 gap-4 p-4 rounded-lg border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
            : 'bg-white border-gray-200 hover:shadow-lg'
        } transition-all cursor-pointer shadow-md mb-4`}
        onClick={() => onDrugClick(drug)}
      >
        {/* Nazwa i substancja - 5 kolumn */}
        <div className="col-span-5">
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {drug.nazwaProduktu} {drug.moc}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {drug.nazwaPowszechnieStosowana} • {drug.nazwaPostaciFarmaceutycznej}
          </p>
          <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {generateDrugDescription(drug)}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <FaBuilding className="inline w-3 h-3 mr-1" />
            {drug.podmiotOdpowiedzialny.substring(0, 30)}...
          </p>
        </div>

        {/* Informacje kliniczne - 3 kolumny */}
        <div className="col-span-3 flex items-center">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>
              {drug.kodATC}
            </span>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {drug.drogaPodania}
            </p>
          </div>
        </div>

        {/* Status refundacji - 2 kolumny */}
        <div className="col-span-2 flex items-center">
          <div className={`text-sm font-medium flex items-center ${
            drug.statusRefundacji === 'Bez refundacji' 
              ? 'text-gray-500'
              : drug.statusRefundacji.includes('szpitale')
              ? 'text-purple-500'
              : 'text-green-500'
          }`}>
            <FaCertificate className="inline w-4 h-4 mr-2" />
            {drug.statusRefundacji}
          </div>
        </div>

        {/* Przycisk akcji - 2 kolumny */}
        <div className="col-span-2 flex items-center justify-end">
          <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } w-full`}>
            Zobacz szczegóły
          </button>
        </div>
      </div>
    </div>
  );
};

const VirtualizedDrugsList: React.FC<VirtualizedDrugsListProps> = ({ 
  drugs, 
  onDrugClick, 
  darkMode, 
  generateDrugDescription 
}) => {
  const itemData = useMemo(() => ({
    drugs,
    onDrugClick,
    darkMode,
    generateDrugDescription
  }), [drugs, onDrugClick, darkMode, generateDrugDescription]);

  if (drugs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`text-6xl mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          💊
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Nie znaleziono leków
        </h3>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Spróbuj zmienić kryteria wyszukiwania
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <List
        height={600}
        itemCount={drugs.length}
        itemSize={140} // Zwiększono wysokość dla nowego layoutu
        itemData={itemData}
        width="100%"
      >
        {DrugRow}
      </List>
    </div>
  );
};

export default VirtualizedDrugsList;