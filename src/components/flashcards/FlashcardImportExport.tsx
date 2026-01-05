import React, { useState, useRef } from 'react';
import { FaUpload, FaDownload, FaFile, FaTimes, FaCheck } from 'react-icons/fa';
import { exportToAnkiFormat, importFromAnkiFormat, type AnkiCard } from '../../services/srsService';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  explanation?: string;
  tags?: string[];
}

interface FlashcardImportExportProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  cards: Flashcard[];
  onImport: (cards: Flashcard[]) => void;
  onClose: () => void;
}

const FlashcardImportExport: React.FC<FlashcardImportExportProps> = ({
  darkMode,
  fontSize,
  cards,
  onImport,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  const handleExport = () => {
    const ankiCards: AnkiCard[] = cards.map(card => ({
      front: card.front,
      back: card.back,
      tags: card.tags || []
    }));

    const content = exportToAnkiFormat(ankiCards);
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiszki_anki_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setImportError('Wklej zawartość pliku Anki');
      return;
    }

    try {
      const ankiCards = importFromAnkiFormat(importText);
      const importedCards: Flashcard[] = ankiCards.map((card, index) => ({
        id: `imported-${Date.now()}-${index}`,
        front: card.front,
        back: card.back,
        tags: card.tags || []
      }));

      onImport(importedCards);
      setImportSuccess(true);
      setImportError(null);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      setImportError(error.message || 'Błąd podczas importu. Sprawdź format pliku.');
      setImportSuccess(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h2 className={`${fontSizes.title} font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Import / Export fiszek
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'export'
                ? 'bg-[#38b6ff] text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaDownload className="inline mr-2" />
            Eksport
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'import'
                ? 'bg-[#38b6ff] text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaUpload className="inline mr-2" />
            Import
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'export' && (
            <div>
              <div className="mb-6">
                <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Eksport do formatu Anki
                </h3>
                <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Eksportuj swoje fiszki do formatu kompatybilnego z Anki. Plik będzie zawierał {cards.length} fiszek.
                </p>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-mono text-xs`}>
                    Format: Pytanie [TAB] Odpowiedź [TAB] Tagi
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="w-full px-6 py-3 bg-[#38b6ff] text-white rounded-lg font-semibold hover:bg-[#2a9fe5] flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Pobierz plik Anki
                </button>
              </div>

              {/* Preview */}
              {cards.length > 0 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`${fontSizes.text} mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Podgląd (pierwsze 3 fiszki):
                  </p>
                  <pre className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-mono text-xs overflow-x-auto`}>
                    {cards.slice(0, 3).map(card => 
                      `${card.front}\t${card.back}\t${(card.tags || []).join(' ')}`
                    ).join('\n')}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div>
              <div className="mb-6">
                <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Import z formatu Anki
                </h3>
                <p className={`${fontSizes.text} mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Wklej zawartość pliku Anki lub wybierz plik do importu.
                </p>
                
                <div className="mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.tsv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    } flex items-center justify-center gap-2 mb-4`}
                  >
                    <FaFile />
                    Wybierz plik
                  </button>
                </div>

                <textarea
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    setImportError(null);
                    setImportSuccess(false);
                  }}
                  placeholder="Wklej tutaj zawartość pliku Anki (format: Pytanie [TAB] Odpowiedź [TAB] Tagi)..."
                  className={`w-full h-64 p-4 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } font-mono text-sm`}
                />

                {importError && (
                  <div className={`mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700`}>
                    <p className={`${fontSizes.text} text-red-700 dark:text-red-300`}>
                      {importError}
                    </p>
                  </div>
                )}

                {importSuccess && (
                  <div className={`mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 flex items-center gap-2`}>
                    <FaCheck className="text-green-700 dark:text-green-300" />
                    <p className={`${fontSizes.text} text-green-700 dark:text-green-300`}>
                      Import zakończony sukcesem!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className={`w-full mt-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    !importText.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#38b6ff] hover:bg-[#2a9fe5]'
                  } text-white flex items-center justify-center gap-2`}
                >
                  <FaUpload />
                  Importuj fiszki
                </button>
              </div>

              {/* Format Info */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
                <p className={`${fontSizes.text} font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Format pliku Anki:
                </p>
                <ul className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1 list-disc list-inside`}>
                  <li>Każda linia = jedna fiszka</li>
                  <li>Kolumny oddzielone tabulatorem (TAB)</li>
                  <li>Format: Pytanie [TAB] Odpowiedź [TAB] Tagi (opcjonalnie)</li>
                  <li>Przykład: "Co to jest serce?	Organ pompujący krew	anatomia kardiologia"</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardImportExport;

