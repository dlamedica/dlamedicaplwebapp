import React from 'react';

interface ProfilePageSimplestProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ProfilePageSimplest: React.FC<ProfilePageSimplestProps> = ({ darkMode, fontSize }) => {
  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h1 className="text-2xl font-bold mb-4">Strona profilu działa!</h1>
          <p>Jeśli widzisz tę wiadomość, routing działa poprawnie.</p>
          <p className="mt-4">Path: {window.location.pathname}</p>
          <p>Dark mode: {darkMode ? 'ON' : 'OFF'}</p>
          <p>Font size: {fontSize}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSimplest;