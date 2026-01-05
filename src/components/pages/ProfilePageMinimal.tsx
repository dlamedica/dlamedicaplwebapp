import React from 'react';

interface ProfilePageMinimalProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageMinimal: React.FC<ProfilePageMinimalProps> = ({ darkMode, fontSize }) => {
  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h1 className="text-2xl font-bold mb-4">Strona Profilu</h1>
          <p className="mb-4">
            To jest minimalna strona profilu. Jeśli widzisz ten tekst, oznacza to, że routing działa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h2 className="font-semibold mb-2">Informacje debugowania</h2>
              <ul className="text-sm space-y-1">
                <li>Dark Mode: {darkMode ? 'Włączony' : 'Wyłączony'}</li>
                <li>Font Size: {fontSize}</li>
                <li>Ścieżka: {window.location.pathname}</li>
                <li>Czas: {new Date().toLocaleTimeString('pl-PL')}</li>
              </ul>
            </div>
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h2 className="font-semibold mb-2">Status</h2>
              <p className="text-sm text-green-600">✓ Strona załadowana pomyślnie</p>
              <p className="text-sm mt-2">
                Jeśli ta strona się wyświetla, problem jest w oryginalnym komponencie ProfilePage.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
            >
              Wróć do strony głównej
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageMinimal;