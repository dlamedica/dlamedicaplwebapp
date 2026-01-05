import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';

interface SidebarDemoPageProps {
  darkMode?: boolean;
}

const SidebarDemoPage: React.FC<SidebarDemoPageProps> = ({ 
  darkMode = false 
}) => {
  const [currentDarkMode, setCurrentDarkMode] = useState(darkMode);

  return (
    <MainLayout darkMode={currentDarkMode} showSidebar={true}>
      <div className={`p-8 ${currentDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Nawigacja główna platformy DlaMedica
            </h1>
            <p className={`text-lg ${currentDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nowa struktura nawigacji wzorowana na wzorcu AMBOSS
            </p>
          </div>

          {/* Demo Controls */}
          <div className={`p-6 rounded-lg mb-8 ${
            currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          } border`}>
            <h2 className="text-xl font-semibold mb-4">Kontrolki demonstracyjne</h2>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentDarkMode(!currentDarkMode)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Przełącz na tryb {currentDarkMode ? 'jasny' : 'ciemny'}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Struktura kompletna</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Wszystkie wymagane pozycje menu w dokładnej kolejności zgodnie ze specyfikacją
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Wyświetlanie zawodu</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Na górze sidebara wyświetla się wybrany zawód medyczny (obecnie placeholder)
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Sekcje rozwijane</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Biblioteka, Ustawienia i Pomoc mają podpozycje z płynną animacją
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Design AMBOSS-like</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Minimalistyczny design z ikonami, hover effects i hierarchią wizualną
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Responsywność</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Automatyczne dostosowanie do mobile z overlay i przyciskiem zamknięcia
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              currentDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h3 className="text-lg font-semibold mb-3">✅ Smooth transitions</h3>
              <p className={currentDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Płynne animacje rozwijania/zwijania i hover effects
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className={`p-6 rounded-lg ${
            currentDarkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
          } border`}>
            <h2 className="text-xl font-semibold mb-4">Instrukcje testowania</h2>
            <ul className={`space-y-2 ${currentDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Kliknij pozycje z ikonami strzałek, aby rozwinąć/zwinąć sekcje</li>
              <li>• Przetestuj responsywność zmieniając rozmiar okna przeglądarki</li>
              <li>• Na mobile użyj przycisku hamburger w górnej belce</li>
              <li>• Przełącz tryb ciemny/jasny przyciskiem powyżej</li>
              <li>• Zwróć uwagę na smooth transitions i hover effects</li>
            </ul>
          </div>

          {/* Technical Info */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Informacje techniczne</h2>
            <div className={`p-4 rounded-md font-mono text-sm ${
              currentDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <div>Stack: React + TypeScript + Tailwind CSS + Lucide Icons</div>
              <div>Komponenty: Sidebar + NavigationItem + ProfessionDisplay + MainLayout</div>
              <div>Features: Responsive design, Dark mode, Smooth animations, Keyboard navigation</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SidebarDemoPage;