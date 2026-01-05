import React from 'react';
import { UniversityIcon } from '../icons/UniversityIcons';

interface ExportDataButtonProps {
  data: any[];
  filename: string;
  darkMode: boolean;
  format?: 'json' | 'csv';
}

/**
 * Przycisk eksportu danych uczelni
 * Unikalny design dla DlaMedica.pl
 */
const ExportDataButton: React.FC<ExportDataButtonProps> = ({ 
  data, 
  filename, 
  darkMode,
  format = 'json' 
}) => {
  const handleExport = () => {
    if (format === 'json') {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      if (data.length === 0) return;
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value).replace(/"/g, '""');
          }).map(v => `"${v}"`).join(',')
        )
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
        darkMode
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } transform hover:scale-105`}
      title={`Eksportuj do ${format.toUpperCase()}`}
    >
      <UniversityIcon size={16} color={darkMode ? '#D1D5DB' : '#374151'} />
      <span>Eksportuj ({format.toUpperCase()})</span>
    </button>
  );
};

export default ExportDataButton;

