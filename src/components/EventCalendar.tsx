import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, VideoIcon, BuildingIcon, HomeIcon, ClockIcon } from './icons/CustomIcons';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  type: 'online' | 'stacjonarny';
  eventType: 'conference' | 'webinar';
  isFree: boolean;
  companyOnly?: boolean;
}

interface EventCalendarProps {
  events: Event[];
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onEventClick?: (event: Event) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, darkMode, fontSize, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small':
        return {
          title: 'text-lg',
          text: 'text-sm',
          small: 'text-xs'
        };
      case 'large':
        return {
          title: 'text-2xl',
          text: 'text-lg',
          small: 'text-base'
        };
      default:
        return {
          title: 'text-xl',
          text: 'text-base',
          small: 'text-sm'
        };
    }
  };

  const fontSizes = getFontSizeClasses();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventHover = (event: Event, e: React.MouseEvent) => {
    setHoveredEvent(event);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  // Zamknij tooltip przy scrollowaniu
  useEffect(() => {
    const handleScroll = () => {
      setHoveredEvent(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const dayNames = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDate(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } p-1 overflow-hidden ${isToday ? 'bg-[#38b6ff] bg-opacity-20' : ''}`}
      >
        <div className={`font-medium mb-1 ${fontSizes.small} ${
          isToday 
            ? 'text-[#38b6ff] font-bold' 
            : darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick?.(event)}
              onMouseEnter={(e) => handleEventHover(event, e)}
              onMouseLeave={handleEventLeave}
              className={`p-1 rounded text-xs cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                event.eventType === 'conference'
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              <div className="flex items-center space-x-1">
                {event.type === 'online' ? (
                  <VideoIcon size={10} color="currentColor" />
                ) : (
                  <BuildingIcon size={10} color="currentColor" />
                )}
                <span className="truncate">{event.name.substring(0, 15)}...</span>
              </div>
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div 
              className={`text-xs cursor-pointer hover:underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => {
                // Pokaż wszystkie wydarzenia dla tego dnia
                const firstEvent = dayEvents[0];
                if (firstEvent && onEventClick) {
                  onEventClick(firstEvent);
                }
              }}
            >
              +{dayEvents.length - 2} więcej
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-lg ${
      darkMode ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Calendar Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSizes.title} font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <CalendarIcon size={24} color="#38b6ff" className="mr-2" />
            Kalendarz wydarzeń
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Przejdź do dzisiaj"
            >
              <HomeIcon size={16} color="currentColor" />
              Dzisiaj
            </button>
            <button
              onClick={() => navigateMonth('prev')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Poprzedni miesiąc"
            >
              <ArrowLeftIcon size={16} color="currentColor" />
            </button>
            <span className={`${fontSizes.text} font-medium ${darkMode ? 'text-white' : 'text-gray-900'} min-w-[120px] text-center`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Następny miesiąc"
            >
              <ArrowRightIcon size={16} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#38b6ff] rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Konferencje</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 rounded border border-purple-200"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Webinary</span>
          </div>
          <div className="flex items-center space-x-1">
            <VideoIcon size={12} color="#6b7280" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <BuildingIcon size={12} color="#6b7280" />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Stacjonarne</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className={`text-center py-2 ${fontSizes.small} font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
      </div>

      {/* Tooltip dla wydarzeń */}
      {hoveredEvent && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 p-3 rounded-lg shadow-xl border max-w-xs pointer-events-none transition-opacity duration-200 ${
            darkMode 
              ? 'bg-gray-900 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            transform: 'translate(0, 0)'
          }}
        >
          <div className="font-semibold mb-1 text-sm">{hoveredEvent.name}</div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} color="#38b6ff" />
              <span>
                {new Date(hoveredEvent.date).toLocaleDateString('pl-PL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon size={16} color="#38b6ff" />
              <span>{hoveredEvent.time}</span>
            </div>
            <div className="flex items-center gap-2">
              {hoveredEvent.type === 'online' ? (
                <VideoIcon size={16} color="#38b6ff" />
              ) : (
                <BuildingIcon size={16} color="#38b6ff" />
              )}
              <span>{hoveredEvent.type === 'online' ? 'Online' : 'Stacjonarny'}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-300">
              <span className={`px-2 py-1 rounded text-xs ${
                hoveredEvent.eventType === 'conference'
                  ? 'bg-[#38b6ff] text-black'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {hoveredEvent.eventType === 'conference' ? 'Konferencja' : 'Webinar'}
              </span>
              {hoveredEvent.isFree && (
                <span className="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Bezpłatne
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;