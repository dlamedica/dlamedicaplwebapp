import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App</h1>
      <p>Jeśli to widzisz, React działa poprawnie!</p>
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h2>Podstawowe informacje</h2>
        <p>Aplikacja została uruchomiona pomyślnie</p>
        <p>Data: {new Date().toLocaleDateString('pl-PL')}</p>
      </div>
    </div>
  );
};

export default App;