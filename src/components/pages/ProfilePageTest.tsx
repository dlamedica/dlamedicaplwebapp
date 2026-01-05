import React from 'react';

interface ProfilePageTestProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageTest: React.FC<ProfilePageTestProps> = ({ darkMode, fontSize }) => {
  console.log('🔍 ProfilePageTest: Component is rendering');
  
  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h1 className="text-2xl font-bold mb-4">Test Profile Page</h1>
          <p className="mb-4">
            To jest strona testowa profilu. Jeśli widzisz ten tekst, oznacza to, że routing działa poprawnie.
          </p>
          <div className="space-y-2">
            <p>Dark Mode: {darkMode ? 'Enabled' : 'Disabled'}</p>
            <p>Font Size: {fontSize}</p>
            <p>Current Path: {window.location.pathname}</p>
            <p>Timestamp: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTest;