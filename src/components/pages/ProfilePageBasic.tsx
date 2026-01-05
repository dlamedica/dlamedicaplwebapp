import React from 'react';

interface ProfilePageBasicProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageBasic: React.FC<ProfilePageBasicProps> = ({ darkMode, fontSize }) => {
  // Najprostsza możliwa strona profilu bez żadnych hooków
  
  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h1 className="text-2xl font-bold mb-4">Profil użytkownika</h1>
          
          <div className="mb-6">
            <p className="text-lg mb-2">Ta strona profilu działa!</p>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              To jest podstawowa wersja strony profilu bez autoryzacji.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h2 className="font-semibold mb-2">Dane użytkownika</h2>
              <p className="text-sm">Email: user@example.com</p>
              <p className="text-sm">Imię: Jan Kowalski</p>
              <p className="text-sm">Status: Aktywny</p>
            </div>
            
            <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h2 className="font-semibold mb-2">Ustawienia</h2>
              <p className="text-sm">Tryb ciemny: {darkMode ? 'Włączony' : 'Wyłączony'}</p>
              <p className="text-sm">Rozmiar czcionki: {fontSize}</p>
              <p className="text-sm">Język: Polski</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
            >
              Strona główna
            </button>
            
            <button
              onClick={() => alert('Funkcja wylogowania - do implementacji')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Wyloguj się
            </button>
          </div>

          <div className={`mt-6 p-4 rounded ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
            <p className="text-sm font-semibold">Informacja debugowania:</p>
            <p className="text-sm">Jeśli widzisz tę stronę, problem był w zależnościach oryginalnego ProfilePage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageBasic;