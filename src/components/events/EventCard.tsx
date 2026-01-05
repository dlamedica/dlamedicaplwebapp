import React from 'react';
import { CalendarIcon, LocationIcon, UsersIcon, VideoIcon, BuildingIcon } from '../icons/CustomIcons';
import EventFavoriteButton from './EventFavoriteButton';
import EventShareButton from './EventShareButton';

interface EventCardProps {
  event: {
    id: number;
    name: string;
    slug: string;
    date: string;
    time: string;
    location: string;
    type: 'online' | 'stacjonarny';
    eventType: 'conference' | 'webinar';
    description: string;
    price: string;
    isFree: boolean;
    maxParticipants?: number;
    currentParticipants?: number;
  };
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onViewDetails: (event: any) => void;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  darkMode, 
  fontSize, 
  onViewDetails,
  index 
}) => {
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg md:text-xl',
          text: 'text-sm md:text-base',
          button: 'text-sm'
        };
      case 'large':
        return {
          title: 'text-2xl md:text-3xl',
          text: 'text-lg md:text-xl',
          button: 'text-lg'
        };
      default:
        return {
          title: 'text-xl md:text-2xl',
          text: 'text-base md:text-lg',
          button: 'text-base'
        };
    }
  };

  const fontSizes = getFontSizeClasses();
  const isPast = new Date(event.date) < new Date();
  const isFullyBooked = event.currentParticipants === event.maxParticipants;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700' 
          : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-lg hover:shadow-2xl'
      }`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Dekoracyjne tło */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-30 ${
        event.eventType === 'conference' 
          ? 'bg-[#38b6ff]' 
          : 'bg-purple-500'
      }`} />

      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {isPast && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 backdrop-blur-sm">
            Zakończone
          </span>
        )}
        {isFullyBooked && !isPast && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white backdrop-blur-sm">
            Wyprzedane
          </span>
        )}
      </div>

      <div className="relative p-6">
        {/* Typ wydarzenia */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-xl ${
            event.type === 'online' 
              ? 'bg-blue-500/10' 
              : 'bg-green-500/10'
          }`}>
            {event.type === 'online' ? (
              <VideoIcon size={20} color={darkMode ? '#60a5fa' : '#3b82f6'} />
            ) : (
              <BuildingIcon size={20} color={darkMode ? '#34d399' : '#10b981'} />
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            event.eventType === 'conference' 
              ? 'bg-[#38b6ff] text-black' 
              : 'bg-purple-500 text-white'
          }`}>
            {event.eventType === 'conference' ? 'Konferencja' : 'Webinar'}
          </span>
        </div>

        {/* Tytuł */}
        <h3 className={`${fontSizes.title} font-bold mb-4 leading-tight ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {event.name}
        </h3>

        {/* Informacje */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <CalendarIcon size={18} color={darkMode ? '#38b6ff' : '#38b6ff'} />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatDate(event.date)}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {event.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <LocationIcon size={18} color={darkMode ? '#38b6ff' : '#38b6ff'} />
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {event.location}
            </p>
          </div>

          {event.maxParticipants && (
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <UsersIcon size={18} color={darkMode ? '#38b6ff' : '#38b6ff'} />
              </div>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {event.currentParticipants}/{event.maxParticipants} uczestników
              </p>
            </div>
          )}
        </div>

        {/* Opis */}
        <p className={`${fontSizes.text} line-clamp-2 mb-6 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {event.description}
        </p>

        {/* Cena i akcje */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <span className={`text-xl font-bold ${
            event.isFree 
              ? 'text-green-500' 
              : darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {event.price}
          </span>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <EventFavoriteButton
              eventId={event.id}
              darkMode={darkMode}
              size="small"
            />
            <EventShareButton
              event={{
                id: event.id,
                name: event.name,
                slug: event.slug,
                date: event.date,
                description: event.description
              }}
              darkMode={darkMode}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        darkMode 
          ? 'from-black/80 via-transparent to-transparent' 
          : 'from-white/80 via-transparent to-transparent'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Przycisk akcji */}
      <button
        onClick={() => onViewDetails(event)}
        className={`absolute bottom-6 left-6 right-6 py-3 px-6 ${fontSizes.button} font-bold rounded-xl transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-lg hover:shadow-xl`}
      >
        Zobacz szczegóły
      </button>
    </div>
  );
};

export default EventCard;

