import React from 'react';
import { TrophyIcon, UsersIcon } from '../icons/CustomIcons';
import EventCard from './EventCard';

interface Event {
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
}

interface PopularEventsProps {
  events: Event[];
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onViewDetails: (event: Event) => void;
}

const PopularEvents: React.FC<PopularEventsProps> = ({
  events,
  darkMode,
  fontSize,
  onViewDetails
}) => {
  if (events.length === 0) return null;

  // Sortuj po liczbie uczestników
  const popularEvents = [...events]
    .sort((a, b) => (b.currentParticipants || 0) - (a.currentParticipants || 0))
    .slice(0, 3);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${
          darkMode ? 'bg-yellow-500/10' : 'bg-yellow-100'
        }`}>
          <TrophyIcon size={28} color="#fbbf24" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Najpopularniejsze wydarzenia
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Wydarzenia z największą liczbą uczestników
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularEvents.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Badge popularności */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                index === 0
                  ? 'bg-yellow-500 text-black'
                  : index === 1
                    ? 'bg-gray-400 text-white'
                    : 'bg-orange-600 text-white'
              }`}>
                {index === 0 && <TrophyIcon size={12} color="currentColor" />}
                <span>#{index + 1}</span>
              </div>
            </div>

            <EventCard
              event={event}
              darkMode={darkMode}
              fontSize={fontSize}
              onViewDetails={onViewDetails}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularEvents;

