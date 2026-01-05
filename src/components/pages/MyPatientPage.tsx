/**
 * Strona modułu "Mój pacjent"
 * Integracja z aplikacją
 */

import React, { useState } from 'react';
import { MyPatientDashboard, PatientCard, Patient } from '../my-patient';
import Sidebar from '../navigation/Sidebar';
import { useUser } from '../../hooks/useUser';

interface MyPatientPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const MyPatientPage: React.FC<MyPatientPageProps> = ({ darkMode, fontSize }) => {
  const { isAuthenticated, loading } = useUser();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Aktualizacja pacjenta
  const handleUpdatePatient = (updatedPatient: Patient) => {
    setSelectedPatient(updatedPatient);
    // Tu można dodać logikę zapisu do bazy danych
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#38b6ff] border-r-[#38b6ff] mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-[#2a9fe5] border-l-[#2a9fe5] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className={`mt-6 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Ładowanie modułu...
          </p>
        </div>
      </div>
    );
  }

  // Brak autoryzacji
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800/90 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'}`}>
            <div className="text-center">
              <div className={`inline-block p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 11l2 2 4-4" stroke="#38b6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Wymagane logowanie
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Moduł "Mój pacjent" jest dostępny tylko dla zalogowanych użytkowników. Zaloguj się, aby rozpocząć symulację przypadków klinicznych.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/logowanie');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/rejestracja');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all`}
                >
                  Zarejestruj się
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 shrink-0">
          <Sidebar
            darkMode={darkMode}
            isOpen={true}
            currentPage="moj-pacjent"
            onNavigate={(path) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          />
        </div>

        {/* Główna zawartość */}
        <div className="flex-1">
          {selectedPatient ? (
            <PatientCard
              patient={selectedPatient}
              darkMode={darkMode}
              fontSize={fontSize}
              onBack={() => setSelectedPatient(null)}
              onUpdatePatient={handleUpdatePatient}
            />
          ) : (
            <MyPatientDashboard
              darkMode={darkMode}
              fontSize={fontSize}
              onSelectPatient={setSelectedPatient}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPatientPage;
