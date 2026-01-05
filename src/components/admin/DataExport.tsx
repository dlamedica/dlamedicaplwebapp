import React, { useState } from 'react';
import { FaDownload, FaFileExcel, FaFileCsv, FaFilePdf, FaSpinner } from 'react-icons/fa';

interface DataExportProps {
  darkMode: boolean;
  data: any[];
  dataType: 'orders' | 'products' | 'customers' | 'revenue';
}

const DataExport: React.FC<DataExportProps> = ({ darkMode, data, dataType }) => {
  const [exporting, setExporting] = useState<'csv' | 'excel' | 'pdf' | null>(null);

  const exportToCSV = () => {
    setExporting('csv');
    
    try {
      if (data.length === 0) {
        alert('Brak danych do eksportu');
        setExporting(null);
        return;
      }

      // Konwertuj dane do CSV
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            // Escape wartości zawierające przecinki lub cudzysłowy
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${dataType}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExporting(null);
    } catch (error) {
      console.error('Błąd podczas eksportu do CSV:', error);
      alert('Wystąpił błąd podczas eksportu danych');
      setExporting(null);
    }
  };

  const exportToExcel = () => {
    setExporting('excel');
    
    // W rzeczywistej aplikacji użyj biblioteki jak xlsx
    // Na razie eksportujemy jako CSV z rozszerzeniem .xlsx (symulacja)
    exportToCSV();
    
    // W rzeczywistości:
    // import * as XLSX from 'xlsx';
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    // XLSX.writeFile(workbook, `${dataType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setTimeout(() => setExporting(null), 1000);
  };

  const exportToPDF = () => {
    setExporting('pdf');
    
    // W rzeczywistej aplikacji użyj biblioteki jak jsPDF lub pdfmake
    alert('Eksport do PDF wymaga dodatkowej biblioteki (np. jsPDF). Na razie użyj eksportu CSV.');
    setExporting(null);
    
    // Przykład z jsPDF:
    // import jsPDF from 'jspdf';
    // import 'jspdf-autotable';
    // const doc = new jsPDF();
    // doc.autoTable({ head: [headers], body: data.map(row => headers.map(h => row[h])) });
    // doc.save(`${dataType}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold mb-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Eksport danych
          </h3>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {data.length} {data.length === 1 ? 'rekord' : 'rekordów'} dostępnych
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            disabled={exporting !== null}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              exporting === 'csv'
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            title="Eksport do CSV"
          >
            {exporting === 'csv' ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaFileCsv />
            )}
            CSV
          </button>
          <button
            onClick={exportToExcel}
            disabled={exporting !== null}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              exporting === 'excel'
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            title="Eksport do Excel"
          >
            {exporting === 'excel' ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaFileExcel />
            )}
            Excel
          </button>
          <button
            onClick={exportToPDF}
            disabled={exporting !== null}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              exporting === 'pdf'
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            title="Eksport do PDF"
          >
            {exporting === 'pdf' ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaFilePdf />
            )}
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExport;

