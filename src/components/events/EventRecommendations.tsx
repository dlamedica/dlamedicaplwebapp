import React from 'react';
import { StarIcon, ArrowRightIcon } from '../icons/CustomIcons';
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

interface EventRecommendationsProps {
  events: Event[];
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onViewDetails: (event: Event) => void;
}

const EventRecommendations: React.FC<EventRecommendationsProps> = ({
  events,
  darkMode,
  fontSize,
  onViewDetails
}) => {
  if (events.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            darkMode ? 'bg-yellow-500/10' : 'bg-yellow-100'
          }`}>
            <StarIcon size={24} color="#fbbf24" filled={true} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Polecane dla Ciebie
            </h2>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Wydarzenia dopasowane do Twoich zainteresowań
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 3).map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            darkMode={darkMode}
            fontSize={fontSize}
            onViewDetails={onViewDetails}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default EventRecommendations;

