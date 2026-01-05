import React from 'react';
import { CalendarIcon, CheckIcon, ClockIcon, CloseIcon } from '../icons/CustomIcons';

interface EventHistoryItem {
  id: number;
  eventName: string;
  eventSlug: string;
  date: string;
  status: 'registered' | 'attended' | 'cancelled';
  registrationDate: string;
}

interface EventHistoryProps {
  history: EventHistoryItem[];
  darkMode: boolean;
  onEventClick: (slug: string) => void;
}

const EventHistory: React.FC<EventHistoryProps> = ({ history, darkMode, onEventClick }) => {
  if (history.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'registered':
        return { label: 'Zarejestrowany', color: 'bg-blue-500', icon: ClockIcon };
      case 'attended':
        return { label: 'Uczestniczył', color: 'bg-green-500', icon: CheckIcon };
      case 'cancelled':
        return { label: 'Anulowany', color: 'bg-red-500', icon: CloseIcon };
      default:
        return { label: 'Nieznany', color: 'bg-gray-500', icon: ClockIcon };
    }
  };

  return (
    <div className="mb-12">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Historia uczestnictwa
      </h2>
      
      <div className="space-y-4">
        {history.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div
              key={item.id}
              onClick={() => onEventClick(item.eventSlug)}
              className={`group relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'
                  : 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-lg'
              }`}
            >
              {/* Dekoracyjne tło */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${
                statusInfo.color
              }`} />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${statusInfo.color} bg-opacity-20`}>
                      <CalendarIcon size={20} color={statusInfo.color.replace('bg-', '#')} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 group-hover:text-[#38b6ff] transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.eventName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Rejestracja: {formatDate(item.registrationDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${statusInfo.color} bg-opacity-20`}>
                  <StatusIcon size={24} color={statusInfo.color.replace('bg-', '#')} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventHistory;

