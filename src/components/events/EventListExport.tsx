import React, { useState } from 'react';
import { DownloadIcon, CheckIcon } from '../icons/CustomIcons';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'stacjonarny';
  eventType: 'conference' | 'webinar';
  price: string;
}

interface EventListExportProps {
  events: Event[];
  darkMode: boolean;
}

const EventListExport: React.FC<EventListExportProps> = ({ events, darkMode }) => {
  const [exported, setExported] = useState(false);

  const exportToCSV = () => {
    const headers = ['Nazwa', 'Data', 'Godzina', 'Lokalizacja', 'Typ', 'Rodzaj', 'Cena'];
    const rows = events.map(event => [
      event.name,
      event.date,
      event.time,
      event.location,
      event.type === 'online' ? 'Online' : 'Stacjonarny',
      event.eventType === 'conference' ? 'Konferencja' : 'Webinar',
      event.price
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wydarzenia-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const exportToText = () => {
    const textContent = events.map((event, index) => {
      return `${index + 1}. ${event.name}
   Data: ${event.date} ${event.time}
   Lokalizacja: ${event.location}
   Typ: ${event.type === 'online' ? 'Online' : 'Stacjonarny'}
   Rodzaj: ${event.eventType === 'conference' ? 'Konferencja' : 'Webinar'}
   Cena: ${event.price}
   
`;
    }).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wydarzenia-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  if (events.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToCSV}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Eksportuj do CSV"
      >
        {exported ? (
          <>
            <CheckIcon size={18} color="#10b981" />
            <span>Eksportowano!</span>
          </>
        ) : (
          <>
            <DownloadIcon size={18} color="currentColor" />
            <span>Eksportuj CSV</span>
          </>
        )}
      </button>

      <button
        onClick={exportToText}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Eksportuj do TXT"
      >
        <DownloadIcon size={18} color="currentColor" />
        <span>TXT</span>
      </button>
    </div>
  );
};

export default EventListExport;

