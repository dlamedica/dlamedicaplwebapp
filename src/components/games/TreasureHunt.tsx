/**
 * Komponent TreasureHunt - Polowanie na Skarby
 * Użytkownicy szukają ukrytych kodów rabatowych w produktach
 */

import React, { useState, useEffect } from 'react';
import { FaMap, FaKey, FaGift, FaSearch, FaCheckCircle } from 'react-icons/fa';

interface TreasureHuntProps {
  darkMode?: boolean;
  onClose?: () => void;
}

interface Treasure {
  id: string;
  productId: string;
  productTitle: string;
  code: string;
  discount: number;
  hint: string;
  found: boolean;
  foundAt?: string;
}

const TreasureHunt: React.FC<TreasureHuntProps> = ({ darkMode = false, onClose }) => {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [foundCount, setFoundCount] = useState(0);

  // Przykładowe skarby (w rzeczywistości z bazy danych)
  useEffect(() => {
    const mockTreasures: Treasure[] = [
      {
        id: '1',
        productId: 'ebook-1',
        productTitle: 'Atlas Anatomii Człowieka',
        code: 'ANATOMIA15',
        discount: 15,
        hint: 'Szukaj w opisie produktu o anatomii',
        found: false,
      },
      {
        id: '2',
        productId: 'ebook-2',
        productTitle: 'Farmakologia Kliniczna',
        code: 'FARMA20',
        discount: 20,
        hint: 'Sprawdź sekcję o farmakologii',
        found: false,
      },
      {
        id: '3',
        productId: 'ebook-3',
        productTitle: 'Chirurgia Ogólna',
        code: 'CHIRURG10',
        discount: 10,
        hint: 'Znajdź w opisie produktu chirurgicznego',
        found: false,
      },
    ];
    setTreasures(mockTreasures);
    setFoundCount(mockTreasures.filter(t => t.found).length);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // W rzeczywistości tutaj byłoby wyszukiwanie w opisach produktów
  };

  const handleFoundTreasure = (treasureId: string) => {
    setTreasures(prev =>
      prev.map(t =>
        t.id === treasureId
          ? { ...t, found: true, foundAt: new Date().toISOString() }
          : t
      )
    );
    setFoundCount(prev => prev + 1);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-sm overflow-y-auto`}>
      <div className={`relative w-full max-w-3xl mx-4 my-8 p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMap className="text-white text-4xl" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🗺️ Polowanie na Skarby
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Znajdź ukryte kody rabatowe w opisach produktów!
          </p>
        </div>

        {/* Progress */}
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Znalezione skarby
            </span>
            <span className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {foundCount} / {treasures.length}
            </span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${
            darkMode ? 'bg-gray-600' : 'bg-gray-200'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(foundCount / treasures.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>

        {/* Treasures List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {treasures.map((treasure) => {
            const Icon = treasure.found ? FaCheckCircle : FaKey;
            return (
              <div
                key={treasure.id}
                className={`p-4 rounded-lg border-2 ${
                  treasure.found
                    ? darkMode
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-green-50 border-green-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    treasure.found
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {treasure.productTitle}
                      </h4>
                      {treasure.found && (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          darkMode ? 'bg-green-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          ZNALEZIONY
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      💡 {treasure.hint}
                    </p>
                    {treasure.found ? (
                      <div className={`p-2 rounded border-2 border-dashed ${
                        darkMode ? 'bg-gray-800 border-green-500' : 'bg-white border-green-500'
                      }`}>
                        <p className={`text-sm font-mono text-center ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                          Kod: <span className="font-bold">{treasure.code}</span> ({treasure.discount}% rabat)
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          window.history.pushState({}, '', `/sklep/ebook/${treasure.productId}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                          if (onClose) onClose();
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          darkMode
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        <FaSearch className="inline mr-2" />
                        Przejdź do produktu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className={`mt-6 p-4 rounded-lg ${
          darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm text-center ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            💡 <strong>Jak to działa?</strong> Przejrzyj opisy produktów i znajdź ukryte kody rabatowe. 
            Każdy znaleziony kod możesz wykorzystać przy zakupie!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreasureHunt;

