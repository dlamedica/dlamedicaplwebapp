import React from 'react';
import { CalendarIcon, UsersIcon, ChartIcon } from '../icons/CustomIcons';

interface EventStatsProps {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalParticipants: number;
  darkMode: boolean;
}

const EventStats: React.FC<EventStatsProps> = ({
  totalEvents,
  upcomingEvents,
  pastEvents,
  totalParticipants,
  darkMode
}) => {
  const stats = [
    {
      label: 'Wszystkie wydarzenia',
      value: totalEvents,
      icon: CalendarIcon,
      color: '#38b6ff'
    },
    {
      label: 'Nadchodzące',
      value: upcomingEvents,
      icon: CalendarIcon,
      color: '#10b981'
    },
    {
      label: 'Zakończone',
      value: pastEvents,
      icon: CalendarIcon,
      color: '#6b7280'
    },
    {
      label: 'Uczestnicy',
      value: totalParticipants,
      icon: UsersIcon,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8`}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
              darkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg'
            }`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            {/* Dekoracyjne tło */}
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: stat.color }}
            />
            
            <div className="relative">
              <div
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <IconComponent size={24} color={stat.color} />
              </div>
              
              <div className={`text-3xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value.toLocaleString('pl-PL')}
              </div>
              
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventStats;

