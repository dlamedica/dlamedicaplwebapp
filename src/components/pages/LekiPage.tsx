import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaPills, FaTimes, FaBuilding, FaFlask, FaCapsules, FaHeart, FaStar, FaChevronDown, FaFilter, FaEye, FaBox, FaCheckCircle, FaBan, FaPause } from 'react-icons/fa';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import Papa from 'papaparse';

interface Drug {
  id: string;
  nazwaProduktu: string;
  nazwaPowszechnieStosowana: string;
  rodzajPreparatu: string;
  moc: string;
  nazwaPostaciFarmaceutycznej: string;
  podmiotOdpowiedzialny: string;
  numerPozwolenia: string;
  kodATC: string;
  grupaATC: string;
  kategoriaDostepnosci: string;
  status: string;
  waznoscPozwolenia: string;
  kategoriaPopularna?: string;
  postaciGrupa: string;
  // Nowe pola
  opakowanie: string;
  substancjaCzynna: string;
  nazwaWytwórcy: string;
  krajWytwórcy: string;
  nazwaImportera: string;
  krajImportera: string;
  drogaPodania: string;
  typProcedury: string;
  statusRefundacji: string;
  regionPochodzenia: string;
  kategoriaWaznosci: string;
  kategoriaProcedury: string;
  drogaPodaniaGrupa: string;
}

interface LekiPageProps {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface MedicineModalProps {
  medicine: Drug;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  highContrast: boolean;
}

const MedicineModal: React.FC<MedicineModalProps> = ({ medicine, isOpen, onClose, darkMode, highContrast }) => {
  const [activeTab, setActiveTab] = useState<'podstawowe' | 'sklad' | 'opakowania' | 'refundacja'>('podstawowe');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
          highContrast ? 'bg-white' : darkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
            highContrast ? 'bg-white' : darkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <h3 className={`text-lg leading-6 font-medium mb-4 ${
                  highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {medicine.nazwaProduktu} {medicine.moc}
                </h3>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('podstawowe')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'podstawowe'
                          ? 'border-[#38b6ff] text-[#38b6ff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Podstawowe
                    </button>
                    <button
                      onClick={() => setActiveTab('sklad')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'sklad'
                          ? 'border-[#38b6ff] text-[#38b6ff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Skład
                    </button>
                    <button
                      onClick={() => setActiveTab('opakowania')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'opakowania'
                          ? 'border-[#38b6ff] text-[#38b6ff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Opakowania
                    </button>
                    <button
                      onClick={() => setActiveTab('refundacja')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'refundacja'
                          ? 'border-[#38b6ff] text-[#38b6ff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Refundacja
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {activeTab === 'podstawowe' && (
                    <div className="space-y-3">
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nazwa powszechnie stosowana:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.nazwaPowszechnieStosowana}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Postać farmaceutyczna:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.nazwaPostaciFarmaceutycznej}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Podmiot odpowiedzialny:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.podmiotOdpowiedzialny}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Numer pozwolenia:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.numerPozwolenia}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kod ATC:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.kodATC}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kategoria dostępności:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.kategoriaDostepnosci}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.status}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ważność pozwolenia:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.waznoscPozwolenia}</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'sklad' && (
                    <div className="space-y-3">
                      <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Substancje czynne: {medicine.nazwaPowszechnieStosowana}
                      </p>
                      <p className={`text-sm ${highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Moc: {medicine.moc}
                      </p>
                    </div>
                  )}
                  {activeTab === 'opakowania' && (
                    <div className="space-y-3">
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Opakowanie:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.opakowanie || 'Brak informacji'}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Droga podania:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.drogaPodania || 'Brak informacji'}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Droga podania (kategoria):</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.drogaPodaniaGrupa}</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'refundacja' && (
                    <div className="space-y-3">
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status refundacji:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.statusRefundacji}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kategoria dostępności:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.kategoriaDostepnosci}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Region pochodzenia:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.regionPochodzenia}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kraj wytwórcy:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.krajWytwórcy || 'Brak informacji'}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nazwa wytwórcy:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.nazwaWytwórcy || 'Brak informacji'}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Procedura rejestracyjna:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.kategoriaProcedury}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${highContrast ? 'text-gray-700' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kategoria ważności:</p>
                        <p className={`${highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.kategoriaWaznosci}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
            highContrast ? 'bg-gray-50' : darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#38b6ff] text-base font-medium text-white hover:bg-[#2a9fe5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38b6ff] sm:ml-3 sm:w-auto sm:text-sm"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LekiPage: React.FC<LekiPageProps> = ({ darkMode, highContrast, fontSize }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Drug | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    kategoria: 'Wszystkie',
    postac: null as string | null,
    grupaATC: null as string | null,
    popularna: null as string | null,
    pochodzenie: null as string | null,
    procedura: null as string | null,
    waznosc: null as string | null,
    drogaPodania: null as string | null
  });

  useEffect(() => {
    document.title = 'Baza Leków – DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Oficjalny rejestr produktów leczniczych - wersja 6.0.0. Znajdź informacje o lekach.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Baza Leków – DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Oficjalny rejestr produktów leczniczych - wersja 6.0.0');
    }

    // Załaduj dane z CSV
    loadMedicinesData();
  }, []);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-2xl md:text-3xl',
          subtitle: 'text-base md:text-lg',
          cardTitle: 'text-lg md:text-xl',
          cardText: 'text-sm md:text-base',
          inputText: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-4xl md:text-5xl',
          subtitle: 'text-xl md:text-2xl',
          cardTitle: 'text-2xl md:text-3xl',
          cardText: 'text-lg md:text-xl',
          inputText: 'text-lg'
        };
      default:
        return {
          title: 'text-3xl md:text-4xl',
          subtitle: 'text-lg md:text-xl',
          cardTitle: 'text-xl md:text-2xl',
          cardText: 'text-base md:text-lg',
          inputText: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  // Helper functions for processing CSV data
  const extractFirstATC = (atcString: string) => {
    if (!atcString) return '';
    // Jeśli jest kilka kodów oddzielonych przecinkami, weź pierwszy
    return atcString.split(',')[0].split(';')[0].trim();
  };

  const extractATCGroup = (atcString: string) => {
    const firstATC = extractFirstATC(atcString);
    if (!firstATC) return '';
    return firstATC.charAt(0).toUpperCase();
  };

  const determineRefundationCategory = (opakowanie: string) => {
    if (!opakowanie) return 'OTC';
    if (opakowanie.includes('Rpz')) return 'Rpz'; // Refundowane w szpitalach
    if (opakowanie.includes('Rp')) return 'Rx'; // Na receptę
    return 'OTC';
  };

  const extractRefundationStatus = (opakowanie: string) => {
    if (!opakowanie) return 'Bez refundacji';
    if (opakowanie.includes('Rpz')) return 'Refundowane (szpitale)';
    if (opakowanie.includes('Rp')) return 'Refundowane (apteki)';
    return 'Bez refundacji';
  };

  const mapCountryToRegion = (kraj: string) => {
    if (!kraj) return 'Nieznane';
    const krajLower = kraj.toLowerCase();
    if (krajLower.includes('polska')) return 'Polskie';
    if (['niemcy', 'czechy', 'austria', 'francja', 'włochy', 'holandia', 'belgia', 'szwajcaria', 'dania', 'szwecja', 'finlandia', 'węgry', 'słowacja', 'rumunia', 'bułgaria', 'chorwacja', 'słowenia', 'estonia', 'łotwa', 'litwa'].some(c => krajLower.includes(c))) {
      return 'Europejskie';
    }
    if (['usa', 'stany', 'kanada', 'ameryka'].some(c => krajLower.includes(c))) return 'Amerykańskie';
    if (['chiny', 'japonia', 'korea', 'indie', 'malezja', 'singapur', 'tajlandia', 'indonesia'].some(c => krajLower.includes(c))) return 'Azjatyckie';
    return 'Inne';
  };

  const mapValidityCategory = (waznosc: string) => {
    if (!waznosc) return 'Nieznane';
    if (waznosc.includes('Bezterminowe')) return 'Bezterminowe';
    if (waznosc.includes('2025')) return 'Wygasa 2025';
    if (waznosc.includes('2026') || waznosc.includes('2027')) return 'Wygasa do 2027';
    return 'Długoterminowe';
  };

  const mapProcedureCategory = (procedura: string) => {
    if (!procedura) return 'Nieznane';
    return procedura; // NAR, DCP, MRP, CP
  };

  const mapRouteOfAdministration = (droga: string) => {
    if (!droga) return 'Inne';
    const drogaLower = droga.toLowerCase();
    if (drogaLower.includes('doustna') || drogaLower.includes('przez usta') || drogaLower.includes('oral')) return 'Doustne';
    if (drogaLower.includes('dożylna') || drogaLower.includes('iv') || drogaLower.includes('intravenous')) return 'Dożylne';
    if (drogaLower.includes('skórę') || drogaLower.includes('miejscowo') || drogaLower.includes('topical')) return 'Miejscowe';
    if (drogaLower.includes('nos') || drogaLower.includes('donosowo') || drogaLower.includes('nasal')) return 'Donosowe';
    if (drogaLower.includes('oko') || drogaLower.includes('dooczne') || drogaLower.includes('ocular')) return 'Dooczne';
    return 'Inne';
  };

  const determineCategory = (opakowanie: string) => {
    return determineRefundationCategory(opakowanie);
  };

  const determinePopularCategory = (fields: any[]) => {
    const nazwa = (fields[1] || '').toLowerCase();
    const inn = (fields[2] || '').toLowerCase();
    const atc = fields[12] || '';
    
    if (inn.includes('paracetam') || atc.startsWith('N02BE')) return 'Przeciwbólowe';
    if (inn.includes('ibuprofen') || atc.startsWith('M01AE')) return 'Przeciwbólowe';
    if (atc.startsWith('J01')) return 'Antybiotyki';
    if (atc.startsWith('A11') || nazwa.includes('vitamin')) return 'Witaminy';
    if (atc.startsWith('D03') || nazwa.includes('krem') || nazwa.includes('maść')) return 'Kremy';
    if (atc.startsWith('R') || nazwa.includes('kaszel') || nazwa.includes('przeziębienie')) return 'Leki na przeziębienie';
    if (atc.startsWith('C')) return 'Kardiologiczne';
    if (atc.startsWith('N')) return 'Neurologiczne';
    return 'Inne';
  };

  const determineFormGroup = (postacFarmaceutyczna: string) => {
    if (!postacFarmaceutyczna) return 'Inne';
    
    const postac = postacFarmaceutyczna.toLowerCase();
    
    if (postac.includes('tabletki')) return 'Tabletki';
    if (postac.includes('kapsułki')) return 'Kapsułki';
    if (postac.includes('syrop')) return 'Syropy';
    if (postac.includes('zawiesina')) return 'Zawiesiny';
    if (postac.includes('maść') || postac.includes('krem')) return 'Maści';
    if (postac.includes('krople')) return 'Krople';
    if (postac.includes('iniekcj')) return 'Iniekcje';
    if (postac.includes('plaster')) return 'Plastry';
    
    return 'Inne';
  };

  const processMedicineData = (rawData: any[]) => {
    console.log(`Przetwarzanie ${rawData.length} rekordów...`);
    console.log('Dostępne kolumny w CSV:', Object.keys(rawData[0] || {}));
    
    return rawData.map((row, index) => { // Przetwarzanie wszystkich rekordów
      if (index < 5) console.log(`Rekord ${index}:`, row); // Debug tylko pierwszych 5 rekordów
      
      // Bezpośrednie mapowanie z nagłówków CSV
      const medicine = {
        id: row['Identyfikator Produktu Leczniczego'] || `PL${String(index + 1).padStart(6, '0')}`,
        nazwaProduktu: row['Nazwa Produktu Leczniczego'] || 'Brak nazwy',
        nazwaPowszechnieStosowana: row['Nazwa powszechnie stosowana'] || '',
        rodzajPreparatu: row['Rodzaj preparatu'] || '',
        moc: row['Moc'] || '',
        nazwaPostaciFarmaceutycznej: row['Postać farmaceutyczna'] || '',
        typProcedury: row['Typ procedury'] || '',
        numerPozwolenia: row['Numer pozwolenia'] || '',
        waznoscPozwolenia: row['Ważność pozwolenia'] || '',
        kodATC: extractFirstATC(row['Kod ATC'] || ''),
        grupaATC: extractATCGroup(row['Kod ATC'] || ''),
        podmiotOdpowiedzialny: row['Podmiot odpowiedzialny'] || '',
        opakowanie: row['Opakowanie'] || '',
        substancjaCzynna: row['Substancja czynna'] || '',
        nazwaWytwórcy: row['Nazwa wytwórcy'] || '',
        krajWytwórcy: row['Kraj wytwórcy'] || '',
        nazwaImportera: row['Nazwa importera'] || '',
        krajImportera: row['Kraj importera'] || '',
        drogaPodania: row['Droga podania - Gatunek - Tkanka - Okres karencji'] || '',
        
        // NOWE POLA - KATEGORIE DLA FILTRÓW
        kategoriaDostepnosci: determineRefundationCategory(row['Opakowanie'] || ''),
        statusRefundacji: extractRefundationStatus(row['Opakowanie'] || ''),
        regionPochodzenia: mapCountryToRegion(row['Kraj wytwórcy'] || ''),
        kategoriaWaznosci: mapValidityCategory(row['Ważność pozwolenia'] || ''),
        kategoriaProcedury: mapProcedureCategory(row['Typ procedury'] || ''),
        kategoriaPopularna: determinePopularCategory([
          row['Identyfikator Produktu Leczniczego'],
          row['Nazwa Produktu Leczniczego'],
          row['Nazwa powszechnie stosowana'],
          '', '', '', '', row['Moc'], row['Postać farmaceutyczna'],
          row['Typ procedury'], row['Numer pozwolenia'], row['Ważność pozwolenia'],
          row['Kod ATC']
        ]),
        postaciGrupa: determineFormGroup(row['Postać farmaceutyczna'] || ''),
        drogaPodaniaGrupa: mapRouteOfAdministration(row['Droga podania - Gatunek - Tkanka - Okres karencji'] || ''),
        status: 'Aktywny'
      };
      
      return medicine;
    }).filter(med => med.nazwaProduktu && med.nazwaProduktu !== 'Brak nazwy');
  };

  const loadMedicinesData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/bazaleki.csv');  // ZMIENIONA ŚCIEŻKA
      
      if (!response.ok) {
        throw new Error('Nie można załadować danych');
      }
      
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        delimiter: ';', // CSV używa średników jako separatorów
        quoteChar: '"',
        newline: '\r\n' // Obsługa znaków nowej linii w danych
      });
      
      console.log('Załadowane kolumny:', parsedData.meta.fields);
      console.log('Liczba rekordów:', parsedData.data.length);
      console.log('Pierwszy rekord:', parsedData.data[0]);
      
      const processedMedicines = processMedicineData(parsedData.data);
      setMedicines(processedMedicines);
      setLoading(false);
    } catch (err: any) {
      console.error('Błąd ładowania CSV:', err);
      setError(err.message);
      setLoading(false);
      // Fallback do przykładowych danych
      setMedicines(sampleMedicines);
    }
  };

  // Sample medicines data with extended properties (fallback)
  const sampleMedicines: Drug[] = [
    {
      id: "PL001",
      nazwaProduktu: "Apap",
      nazwaPowszechnieStosowana: "Paracetamolum", 
      rodzajPreparatu: "",
      moc: "500 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      podmiotOdpowiedzialny: "US Pharmacia Sp. z o.o.",
      numerPozwolenia: "R/1234/2020",
      kodATC: "N02BE01",
      grupaATC: "N",
      kategoriaDostepnosci: "OTC",
      status: "Aktywny",
      waznoscPozwolenia: "2030-12-31",
      kategoriaPopularna: "Przeciwbólowe",
      postaciGrupa: "Tabletki",
      opakowanie: "",
      substancjaCzynna: "Paracetamolum",
      nazwaWytwórcy: "US Pharmacia",
      krajWytwórcy: "Polska",
      nazwaImportera: "",
      krajImportera: "",
      drogaPodania: "Doustna",
      typProcedury: "NAR",
      statusRefundacji: "Bez refundacji",
      regionPochodzenia: "Polskie",
      kategoriaWaznosci: "Długoterminowe",
      kategoriaProcedury: "NAR",
      drogaPodaniaGrupa: "Doustne"
    },
    {
      id: "PL002", 
      nazwaProduktu: "Ibuprom",
      nazwaPowszechnieStosowana: "Ibuprofenum",
      rodzajPreparatu: "",
      moc: "400 mg", 
      nazwaPostaciFarmaceutycznej: "Tabletki powlekane",
      podmiotOdpowiedzialny: "Aflofarm Farmacja Polska Sp. z o.o.",
      numerPozwolenia: "R/2468/2019",
      kodATC: "M01AE01",
      grupaATC: "M",
      kategoriaDostepnosci: "OTC", 
      status: "Aktywny",
      waznoscPozwolenia: "2029-06-15",
      kategoriaPopularna: "Przeciwbólowe",
      postaciGrupa: "Tabletki",
      opakowanie: "",
      substancjaCzynna: "Ibuprofenum",
      nazwaWytwórcy: "Aflofarm",
      krajWytwórcy: "Polska",
      nazwaImportera: "",
      krajImportera: "",
      drogaPodania: "Doustna",
      typProcedury: "NAR",
      statusRefundacji: "Bez refundacji",
      regionPochodzenia: "Polskie",
      kategoriaWaznosci: "Długoterminowe",
      kategoriaProcedury: "NAR",
      drogaPodaniaGrupa: "Doustne"
    },
    {
      id: "PL003",
      nazwaProduktu: "Amoxicillin Sandoz",
      nazwaPowszechnieStosowana: "Amoxicillinum",
      rodzajPreparatu: "", moc: "250 mg/5ml", nazwaPostaciFarmaceutycznej: "Zawiesina doustna", 
      podmiotOdpowiedzialny: "Sandoz GmbH", numerPozwolenia: "R/3691/2021", kodATC: "J01CA04", grupaATC: "J",
      kategoriaDostepnosci: "Rx", status: "Aktywny", waznoscPozwolenia: "2031-03-20",
      kategoriaPopularna: "Antybiotyki", postaciGrupa: "Zawiesiny", opakowanie: "Rp", substancjaCzynna: "Amoxicillinum",
      nazwaWytwórcy: "Sandoz", krajWytwórcy: "Niemcy", nazwaImportera: "", krajImportera: "",
      drogaPodania: "Doustna", typProcedury: "DCP", statusRefundacji: "Refundowane (apteki)",
      regionPochodzenia: "Europejskie", kategoriaWaznosci: "Długoterminowe", kategoriaProcedury: "DCP", drogaPodaniaGrupa: "Doustne"
    },
    {
      id: "PL004",
      nazwaProduktu: "Concerta", 
      nazwaPowszechnieStosowana: "Methylphenidatum",
      moc: "18 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki o przedłużonym uwalnianiu",
      podmiotOdpowiedzialny: "Janssen-Cilag International NV",
      numerPozwolenia: "EU/1/03/260/001",
      kodATC: "N06BA04",
      grupaATC: "N",
      kategoriaDostepnosci: "Rx",
      status: "Aktywny",
      waznoscPozwolenia: "2028-09-12",
      kategoriaPopularna: "Psychotropowe",
      postaciGrupa: "Tabletki"
    },
    {
      id: "PL005",
      nazwaProduktu: "Aspirin C",
      nazwaPowszechnieStosowana: "Acidum acetylsalicylicum + Acidum ascorbicum", 
      moc: "400 mg + 240 mg",
      nazwaPostaciFarmaceutycznej: "Tabletki musujące",
      podmiotOdpowiedzialny: "Bayer Sp. z o.o.",
      numerPozwolenia: "R/5678/2018",
      kodATC: "N02BA01",
      grupaATC: "N",
      kategoriaDostepnosci: "OTC",
      status: "Aktywny",
      waznoscPozwolenia: "2029-11-08",
      kategoriaPopularna: "Leki na przeziębienie",
      postaciGrupa: "Tabletki"
    },
    {
      id: "PL006", 
      nazwaProduktu: "Nurofen dla dzieci",
      nazwaPowszechnieStosowana: "Ibuprofenum",
      moc: "20 mg/ml",
      nazwaPostaciFarmaceutycznej: "Zawiesina doustna",
      podmiotOdpowiedzialny: "Reckitt Benckiser Healthcare", 
      numerPozwolenia: "R/7890/2017",
      kodATC: "M01AE01",
      grupaATC: "M",
      kategoriaDostepnosci: "OTC",
      status: "Aktywny",
      waznoscPozwolenia: "2032-04-25",
      kategoriaPopularna: "Przeciwbólowe",
      postaciGrupa: "Zawiesiny"
    },
    {
      id: "PL007",
      nazwaProduktu: "Vitamin D3",
      nazwaPowszechnieStosowana: "Cholecalciferolum",
      moc: "2000 IU",
      nazwaPostaciFarmaceutycznej: "Krople doustne",
      podmiotOdpowiedzialny: "Oleofarm Sp. z o.o.",
      numerPozwolenia: "R/9999/2022",
      kodATC: "A11CC05",
      grupaATC: "A",
      kategoriaDostepnosci: "OTC",
      status: "Aktywny",
      waznoscPozwolenia: "2033-05-15",
      kategoriaPopularna: "Witaminy",
      postaciGrupa: "Krople"
    },
    {
      id: "PL008",
      nazwaProduktu: "Bepanthen Maść",
      nazwaPowszechnieStosowana: "Dexpanthenolum",
      moc: "5%",
      nazwaPostaciFarmaceutycznej: "Maść",
      podmiotOdpowiedzialny: "Bayer Sp. z o.o.",
      numerPozwolenia: "R/8888/2019",
      kodATC: "D03AX03",
      grupaATC: "D",
      kategoriaDostepnosci: "OTC",
      status: "Aktywny",
      waznoscPozwolenia: "2030-08-20",
      kategoriaPopularna: "Kremy",
      postaciGrupa: "Maści"
    }
  ];

  const atcGroups = [
    { code: 'ATC-A', name: 'Przewód pokarmowy i metabolizm' },
    { code: 'ATC-B', name: 'Krew i układ krwiotwórczy' }, 
    { code: 'ATC-C', name: 'Układ sercowo-naczyniowy' },
    { code: 'ATC-D', name: 'Leki dermatologiczne' },
    { code: 'ATC-G', name: 'Układ moczowo-płciowy' },
    { code: 'ATC-H', name: 'Hormony ogólnoustrojowe' },
    { code: 'ATC-J', name: 'Leki przeciwzakaźne ogólnie' },
    { code: 'ATC-L', name: 'Leki przeciwnowotworowe' },
    { code: 'ATC-M', name: 'Układ mięśniowo-szkieletowy' },
    { code: 'ATC-N', name: 'Układ nerwowy' },
    { code: 'ATC-P', name: 'Leki przeciwpasożytnicze' },
    { code: 'ATC-R', name: 'Układ oddechowy' },
    { code: 'ATC-S', name: 'Narządy zmysłów' },
    { code: 'ATC-V', name: 'Różne' }
  ];

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const resetFilters = () => {
    setActiveFilters({
      kategoria: 'Wszystkie',
      postac: null,
      grupaATC: null,
      popularna: null,
      pochodzenie: null,
      procedura: null,
      waznosc: null,
      drogaPodania: null
    });
  };

  const filteredMedicines = useMemo(() => {
    let filtered = [...medicines];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(med => 
        med.nazwaProduktu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.nazwaPowszechnieStosowana.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.podmiotOdpowiedzialny.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.numerPozwolenia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.substancjaCzynna.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.nazwaWytwórcy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (rozszerzone)
    if (activeFilters.kategoria !== 'Wszystkie') {
      if (activeFilters.kategoria === 'OTC' || activeFilters.kategoria === 'Rx' || activeFilters.kategoria === 'Rpz') {
        filtered = filtered.filter(med => med.kategoriaDostepnosci === activeFilters.kategoria);
      } else if (activeFilters.kategoria === 'Aktywne') {
        filtered = filtered.filter(med => med.status === 'Aktywny');
      } else if (activeFilters.kategoria === 'Wycofane') {
        filtered = filtered.filter(med => med.status === 'Wycofany');
      }
    }

    // Form filter
    if (activeFilters.postac) {
      filtered = filtered.filter(med => med.postaciGrupa === activeFilters.postac);
    }

    // ATC filter
    if (activeFilters.grupaATC) {
      const atcLetter = activeFilters.grupaATC.replace('ATC-', '');
      filtered = filtered.filter(med => med.grupaATC === atcLetter);
    }

    // Popular category filter
    if (activeFilters.popularna) {
      filtered = filtered.filter(med => med.kategoriaPopularna === activeFilters.popularna);
    }

    // Origin filter (nowe)
    if (activeFilters.pochodzenie) {
      filtered = filtered.filter(med => med.regionPochodzenia === activeFilters.pochodzenie);
    }

    // Procedure filter (nowe)
    if (activeFilters.procedura) {
      filtered = filtered.filter(med => med.kategoriaProcedury === activeFilters.procedura);
    }

    // Validity filter (nowe)
    if (activeFilters.waznosc) {
      filtered = filtered.filter(med => med.kategoriaWaznosci === activeFilters.waznosc);
    }

    // Route of administration filter (nowe)
    if (activeFilters.drogaPodania) {
      filtered = filtered.filter(med => med.drogaPodaniaGrupa === activeFilters.drogaPodania);
    }

    return filtered;
  }, [medicines, activeFilters, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setHasSearched(value.trim() !== '');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setHasSearched(false);
  };

  const toggleFavorite = (medicineId: string) => {
    setFavorites(prev => 
      prev.includes(medicineId) 
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const openMedicineModal = (medicine: Drug) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aktywny':
        return <FaCheckCircle className="text-green-500" />;
      case 'Wycofany':
        return <FaBan className="text-red-500" />;
      case 'Zawieszony':
        return <FaPause className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getFormIcon = (form: string) => {
    if (form.toLowerCase().includes('tabletki') || form.toLowerCase().includes('kapsułki')) {
      return <FaPills className="text-[#38b6ff]" />;
    } else if (form.toLowerCase().includes('syrop') || form.toLowerCase().includes('zawiesina')) {
      return <FaFlask className="text-[#38b6ff]" />;
    } else {
      return <FaCapsules className="text-[#38b6ff]" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen py-12 ${
        highContrast 
          ? 'bg-white' 
          : darkMode 
            ? 'bg-black' 
            : 'bg-white'
      } transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
              darkMode ? 'bg-blue-900' : 'bg-blue-100'
            }`}>
              <FaPills className={`h-8 w-8 animate-pulse ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${
              highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              💊 Baza Leków
            </h1>
            <p className={`mb-8 ${
              highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ładowanie rejestru produktów leczniczych...
            </p>
            
            <div className="flex justify-center mb-4">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                darkMode ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
            </div>
            <p className={`${
              highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              📁 Przetwarzanie pliku bazaleki.csv...
            </p>
            <p className={`text-sm mt-2 ${
              highContrast ? 'text-gray-500' : darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Może to potrwać kilka sekund
            </p>
            {error && (
              <div className={`mt-4 p-4 rounded-lg ${
                darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                <p>⚠️ {error}</p>
                <p className="text-sm mt-1">Używanie danych przykładowych...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${
      highContrast 
        ? 'bg-white' 
        : darkMode 
          ? 'bg-black' 
          : 'bg-white'
    } transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`font-bold ${fontSizes.title} ${
            highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-black'
          } mb-4`}>
            💊 Baza Leków
          </h1>
          <p className={`${fontSizes.subtitle} ${
            highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Oficjalny rejestr produktów leczniczych - wersja 6.0.0
          </p>
        </div>

        {/* Statistics */}
        {medicines.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-blue-900' : 'bg-blue-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>{medicines.length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Łącznie leków</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-green-900' : 'bg-green-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-green-300' : 'text-green-600'
                }`}>{medicines.filter(m => m.kategoriaDostepnosci === 'OTC').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>OTC</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-red-900' : 'bg-red-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-red-300' : 'text-red-600'
                }`}>{medicines.filter(m => m.kategoriaDostepnosci === 'Rx').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Na receptę</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-purple-900' : 'bg-purple-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>{medicines.filter(m => m.kategoriaDostepnosci === 'Rpz').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Szpitalne</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-orange-900' : 'bg-orange-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-orange-300' : 'text-orange-600'
                }`}>{medicines.filter(m => m.regionPochodzenia === 'Polskie').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Polskie</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-teal-900' : 'bg-teal-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-teal-300' : 'text-teal-600'
                }`}>{medicines.filter(m => m.kategoriaWaznosci === 'Bezterminowe').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Bezterminowe</div>
              </div>
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-indigo-900' : 'bg-indigo-50'
              }`}>
                <div className={`font-bold ${
                  darkMode ? 'text-indigo-300' : 'text-indigo-600'
                }`}>{medicines.filter(m => m.statusRefundacji !== 'Bez refundacji').length}</div>
                <div className={
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }>Refundowane</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <label className={`block text-sm font-medium mb-3 ${
              highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FaSearch className="inline mr-2 text-[#38b6ff]" />
              Szukaj leku
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Szukaj po nazwie, substancji czynnej, producencie lub numerze pozwolenia..."
                aria-label="Wyszukaj lek"
                className={`w-full px-4 py-4 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] ${fontSizes.inputText} ${
                  highContrast
                    ? 'bg-white border-2 border-black text-black placeholder-gray-600'
                    : darkMode
                      ? 'bg-black border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
                    highContrast 
                      ? 'text-black hover:bg-gray-200' 
                      : darkMode 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label="Wyczyść wyszukiwanie"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Row 1 - Basic categories (ROZSZERZONE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Wszystkie', 'OTC', 'Rx', 'Rpz', 'Aktywne', 'Wycofane'].map(kategoria => (
              <button
                key={kategoria}
                onClick={() => handleFilterChange('kategoria', kategoria)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.kategoria === kategoria
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {kategoria}
              </button>
            ))}
          </div>

          {/* Row 2 - Pharmaceutical forms */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Tabletki', 'Kapsułki', 'Syropy', 'Zawiesiny', 'Maści', 'Krople', 'Iniekcje', 'Plastry'].map(postac => (
              <button
                key={postac}
                onClick={() => handleFilterChange('postac', postac)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.postac === postac
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {postac}
              </button>
            ))}
          </div>

          {/* Row 3 - ATC Groups */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {atcGroups.map(group => (
              <button
                key={group.code}
                onClick={() => handleFilterChange('grupaATC', group.code)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeFilters.grupaATC === group.code
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                title={group.name}
              >
                {group.code}
              </button>
            ))}
          </div>

          {/* Row 4 - Popular categories (ROZSZERZONE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Przeciwbólowe', 'Antybiotyki', 'Witaminy', 'Kremy', 'Leki na przeziębienie', 'Kardiologiczne', 'Neurologiczne'].map(popularna => (
              <button
                key={popularna}
                onClick={() => handleFilterChange('popularna', popularna)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.popularna === popularna
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {popularna}
              </button>
            ))}
          </div>

          {/* Row 5 - Pochodzenie (NOWE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Polskie', 'Europejskie', 'Amerykańskie', 'Azjatyckie', 'Inne'].map(pochodzenie => (
              <button
                key={pochodzenie}
                onClick={() => handleFilterChange('pochodzenie', pochodzenie)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.pochodzenie === pochodzenie
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pochodzenie}
              </button>
            ))}
          </div>

          {/* Row 6 - Procedury rejestracyjne (NOWE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['NAR', 'DCP', 'MRP', 'CP'].map(procedura => (
              <button
                key={procedura}
                onClick={() => handleFilterChange('procedura', procedura)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.procedura === procedura
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {procedura}
              </button>
            ))}
          </div>

          {/* Row 7 - Ważność pozwoleń (NOWE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Bezterminowe', 'Wygasa 2025', 'Wygasa do 2027', 'Długoterminowe'].map(waznosc => (
              <button
                key={waznosc}
                onClick={() => handleFilterChange('waznosc', waznosc)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.waznosc === waznosc
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {waznosc}
              </button>
            ))}
          </div>

          {/* Row 8 - Drogi podania (NOWE) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {['Doustne', 'Dożylne', 'Miejscowe', 'Donosowe', 'Dooczne', 'Inne'].map(drogaPodania => (
              <button
                key={drogaPodania}
                onClick={() => handleFilterChange('drogaPodania', drogaPodania)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.drogaPodania === drogaPodania
                    ? 'bg-blue-500 text-white border-2 border-blue-500'
                    : highContrast
                      ? 'bg-white text-black border border-black hover:bg-gray-100'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {drogaPodania}
              </button>
            ))}
          </div>

          {/* Reset filters button */}
          {(activeFilters.kategoria !== 'Wszystkie' || activeFilters.postac || activeFilters.grupaATC || 
            activeFilters.popularna || activeFilters.pochodzenie || activeFilters.procedura || 
            activeFilters.waznosc || activeFilters.drogaPodania) && (
            <div className="text-center mb-4">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors inline-flex items-center gap-2"
              >
                <FaTimes className="w-4 h-4" />
                Wyczyść filtry
              </button>
            </div>
          )}
        </div>

        {/* Results counter */}
        <div className="text-center mb-6">
          <p className={`${highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            📊 Znaleziono <span className="font-semibold">{filteredMedicines.length}</span> leków
            {activeFilters.kategoria !== 'Wszystkie' && (
              <span className="text-blue-600"> • Filtr: {activeFilters.kategoria}</span>
            )}
            {activeFilters.postac && (
              <span className="text-blue-600"> • Postać: {activeFilters.postac}</span>
            )}
            {activeFilters.grupaATC && (
              <span className="text-blue-600"> • Grupa: {activeFilters.grupaATC}</span>
            )}
            {activeFilters.popularna && (
              <span className="text-blue-600"> • Kategoria: {activeFilters.popularna}</span>
            )}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((drug) => (
              <div
                key={drug.id}
                className={`rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  highContrast
                    ? 'bg-white border-2 border-black hover:border-gray-600'
                    : darkMode 
                      ? 'bg-black border border-gray-700 hover:bg-gray-800' 
                      : 'bg-white border border-gray-200 hover:shadow-xl'
                }`}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(drug.status)}
                    <h3 className={`${fontSizes.cardTitle} font-bold ${
                      highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {drug.nazwaProduktu} {drug.moc}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleFavorite(drug.id)}
                    className="text-2xl transition-colors"
                    aria-label={favorites.includes(drug.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                  >
                    {favorites.includes(drug.id) ? (
                      <HiHeart className="text-red-500" />
                    ) : (
                      <HiOutlineHeart className={highContrast ? 'text-black' : darkMode ? 'text-gray-400' : 'text-gray-400'} />
                    )}
                  </button>
                </div>

                {/* Active substance and form */}
                <p className={`${fontSizes.cardText} mb-4 ${
                  highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {drug.nazwaPowszechnieStosowana} • {drug.nazwaPostaciFarmaceutycznej}
                </p>

                {/* Icons row */}
                <div className={`flex items-center gap-4 mb-4 text-sm ${
                  highContrast ? 'text-black' : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="flex items-center gap-1">
                    <FaPills className="text-[#38b6ff]" />
                    {drug.kategoriaDostepnosci}
                  </span>
                  <span>{drug.kodATC}</span>
                  <span className="flex items-center gap-1">
                    <FaBuilding className="text-[#38b6ff]" />
                    {drug.podmiotOdpowiedzialny.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>

                {/* Refundation status */}
                <div className={`text-sm mb-3 p-2 rounded-lg ${
                  drug.statusRefundacji === 'Bez refundacji' 
                    ? darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    : drug.statusRefundacji.includes('szpitale')
                      ? darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                      : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-[#38b6ff]" />
                    {drug.statusRefundacji}
                  </span>
                </div>

                {/* Extended info row */}
                <div className={`text-xs mb-3 space-y-1 ${
                  highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>🌍 {drug.regionPochodzenia}</span>
                    <span>⚕️ {drug.kategoriaProcedury}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💊 {drug.drogaPodaniaGrupa}</span>
                    <span>📅 {drug.kategoriaWaznosci}</span>
                  </div>
                </div>

                {/* License info */}
                <div className={`text-sm mb-4 ${
                  highContrast ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="flex items-center gap-1">
                    <FaBox className="text-[#38b6ff]" />
                    {drug.numerPozwolenia} • Ważne: {new Date(drug.waznoscPozwolenia).toLocaleDateString('pl-PL')}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openMedicineModal(drug)}
                  className={`w-full py-2 px-4 ${fontSizes.cardText} font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    highContrast
                      ? 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                      : 'bg-[#38b6ff] text-white hover:bg-[#2a9fe5] shadow-md hover:shadow-lg'
                  }`}
                  aria-label={`Zobacz szczegóły leku ${drug.nazwaProduktu}`}
                >
                  <FaEye />
                  Zobacz szczegóły
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className={`text-6xl mb-6 ${
                highContrast ? 'text-gray-400' : darkMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                💊
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${
                highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Nie znaleziono leków
              </h2>
              <p className={`${
                highContrast ? 'text-gray-600' : darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Spróbuj zmienić kryteria wyszukiwania lub filtry
              </p>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className={`mt-12 rounded-lg p-6 ${
          highContrast 
            ? 'bg-white border-2 border-gray-300' 
            : darkMode 
              ? 'bg-gray-900 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            highContrast ? 'text-black' : darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Informacje o bazie leków
          </h3>
          <div className={`text-sm ${
            highContrast ? 'text-black' : darkMode ? 'text-gray-300' : 'text-gray-700'
          } space-y-2`}>
            <p>
              • Oficjalny rejestr produktów leczniczych dopuszczonych do obrotu w Polsce
            </p>
            <p>
              • Wyszukiwanie według nazwy handlowej, substancji czynnej, producenta lub numeru pozwolenia
            </p>
            <p>
              • Filtrowanie według kategorii dostępności, postaci farmaceutycznej i grup ATC
            </p>
            <p>
              • Wszystkie informacje pochodzą z oficjalnych źródeł i są regularnie aktualizowane
            </p>
          </div>
        </div>
      </div>

      {/* Medicine Modal */}
      {selectedMedicine && (
        <MedicineModal
          medicine={selectedMedicine}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedMedicine(null);
          }}
          darkMode={darkMode}
          highContrast={highContrast}
        />
      )}
    </div>
  );
};

export default LekiPage;