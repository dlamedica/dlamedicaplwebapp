import React from 'react';
import { CalendarIcon, ArrowRightIcon } from '../icons/CustomIcons';

interface UpcomingEvent {
  id: number;
  name: string;
  slug: string;
  date: string;
  time: string;
  location: string;
}

interface UpcomingEventsBannerProps {
  events: UpcomingEvent[];
  darkMode: boolean;
  onEventClick: (event: UpcomingEvent) => void;
}

const UpcomingEventsBanner: React.FC<UpcomingEventsBannerProps> = ({
  events,
  darkMode,
  onEventClick
}) => {
  if (events.length === 0) return null;

  const nextEvent = events[0];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const daysUntil = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(nextEvent.date);
    eventDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const days = daysUntil();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-8 mb-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
        darkMode
          ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5]'
          : 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5]'
      }`}
      onClick={() => onEventClick(nextEvent)}
    >
      {/* Dekoracyjne elementy */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CalendarIcon size={24} color="white" />
            </div>
            <div className="px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-white text-sm font-semibold">
                {days === 0 ? 'Dzisiaj' : days === 1 ? 'Jutro' : `Za ${days} dni`}
              </span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {nextEvent.name}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} color="white" />
              <span>{formatDate(nextEvent.date)} • {nextEvent.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{nextEvent.location}</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#38b6ff] rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
          <span>Zobacz szczegóły</span>
          <ArrowRightIcon size={20} color="#38b6ff" />
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventsBanner;

