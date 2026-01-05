// 🔒 BEZPIECZEŃSTWO: Security Timeline - unikalna linia czasu zdarzeń bezpieczeństwa

import React from 'react';

interface TimelineEvent {
  id: string;
  type: 'attack' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  ip?: string;
}

interface SecurityTimelineProps {
  events: TimelineEvent[];
}

const SecurityTimeline: React.FC<SecurityTimelineProps> = ({ events }) => {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
        ))}
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{ event: TimelineEvent; isLast: boolean }> = ({
  event,
  isLast,
}) => {
  const typeConfig = {
    attack: {
      dot: 'bg-red-500',
      ring: 'ring-red-500/30',
      border: 'border-red-500/50',
      bg: 'bg-red-500/5',
      titleColor: 'text-red-400',
    },
    warning: {
      dot: 'bg-yellow-500',
      ring: 'ring-yellow-500/30',
      border: 'border-yellow-500/50',
      bg: 'bg-yellow-500/5',
      titleColor: 'text-yellow-400',
    },
    info: {
      dot: 'bg-blue-500',
      ring: 'ring-blue-500/30',
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/5',
      titleColor: 'text-blue-400',
    },
    success: {
      dot: 'bg-green-500',
      ring: 'ring-green-500/30',
      border: 'border-green-500/50',
      bg: 'bg-green-500/5',
      titleColor: 'text-green-400',
    },
  };

  const config = typeConfig[event.type];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pl-PL'),
      time: date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date, time } = formatTime(event.timestamp);

  return (
    <div className="relative flex items-start gap-6">
      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-16 h-16 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center`}>
          <div className={`w-8 h-8 ${config.dot} rounded-full relative`}>
            {/* Inner Glow */}
            <div className={`absolute inset-0 ${config.dot} rounded-full opacity-50 blur-md`}></div>
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
          {/* Pulse Ring */}
          {event.type === 'attack' && (
            <div className={`absolute inset-0 ${config.ring} rounded-full animate-ping`}></div>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className={`flex-1 ${config.bg} border-l-4 ${config.border} rounded-r-lg p-5 shadow-lg`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-1 ${config.titleColor}`}>{event.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
            <span>{time}</span>
          </div>
          {event.ip && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <span className="font-mono">{event.ip}</span>
            </div>
          )}
        </div>

        {/* Bottom Accent */}
        <div className={`mt-3 h-0.5 ${config.dot} rounded-full opacity-30`}></div>
      </div>
    </div>
  );
};

export default SecurityTimeline;

