import React, { useState } from 'react';
import { CalendarIcon, CheckIcon } from '../icons/CustomIcons';

interface EventCalendarExportProps {
  event: {
    id: number | string;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    address?: string;
  };
  darkMode: boolean;
}

const EventCalendarExport: React.FC<EventCalendarExportProps> = ({ event, darkMode }) => {
  const [copied, setCopied] = useState(false);

  // Formatowanie daty dla iCal
  const formatDateForICal = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 2); // Domyślnie 2 godziny

    const format = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return {
      start: format(date),
      end: format(endDate)
    };
  };

  const generateICal = () => {
    const dates = formatDateForICal(event.date, event.time);
    const location = event.address || event.location;
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DlaMedica.pl//Event Calendar//PL',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:event-${event.id}@dlamedica.pl`,
      `DTSTART:${dates.start}`,
      `DTEND:${dates.end}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateGoogleCalendarUrl = () => {
    const dates = formatDateForICal(event.date, event.time);
    const location = encodeURIComponent(event.address || event.location);
    const title = encodeURIComponent(event.name);
    const details = encodeURIComponent(event.description);
    
    // Konwersja z formatu iCal na format Google Calendar
    const startDate = dates.start.replace(/Z$/, '').replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1$2$3T$4$5$6');
    const endDate = dates.end.replace(/Z$/, '').replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1$2$3T$4$5$6');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl();
    window.open(url, '_blank');
  };

  const handleCopyICal = async () => {
    const dates = formatDateForICal(event.date, event.time);
    const location = event.address || event.location;
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DlaMedica.pl//Event Calendar//PL',
      'BEGIN:VEVENT',
      `DTSTART:${dates.start}`,
      `DTEND:${dates.end}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    try {
      await navigator.clipboard.writeText(icalContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Nie udało się skopiować');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={generateICal}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Pobierz plik .ics (iCal/Outlook)"
      >
        <CalendarIcon size={18} color="currentColor" />
        <span>Pobierz .ics</span>
      </button>

      <button
        onClick={handleGoogleCalendar}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          darkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Dodaj do Google Calendar"
      >
        <CalendarIcon size={18} color="currentColor" />
        <span>Google Calendar</span>
      </button>

      <button
        onClick={handleCopyICal}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
          copied
            ? 'bg-green-100 text-green-700'
            : darkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Kopiuj jako iCal"
      >
        {copied ? (
          <CheckIcon size={18} color="#10b981" />
        ) : (
          <CalendarIcon size={18} color="currentColor" />
        )}
        <span>{copied ? 'Skopiowano!' : 'Kopiuj iCal'}</span>
      </button>
    </div>
  );
};

export default EventCalendarExport;

