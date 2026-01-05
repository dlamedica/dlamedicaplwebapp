import React, { useState, useEffect } from 'react';
import { NotificationIcon, CheckIcon, CloseIcon } from '../icons/CustomIcons';

interface EventNotification {
  id: string;
  eventId: number;
  eventName: string;
  eventSlug: string;
  type: 'reminder' | 'new' | 'cancelled' | 'updated';
  message: string;
  date: string;
  read: boolean;
}

interface EventNotificationsProps {
  notifications: EventNotification[];
  darkMode: boolean;
  onNotificationClick: (slug: string) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const EventNotifications: React.FC<EventNotificationsProps> = ({
  notifications,
  darkMode,
  onNotificationClick,
  onMarkAsRead,
  onDismiss
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-500';
      case 'new':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'updated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diff < 1) return 'Przed chwilą';
    if (diff < 24) return `${diff} godz. temu`;
    if (diff < 48) return 'Wczoraj';
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-blue-500/10' : 'bg-blue-100'
          }`}>
            <NotificationIcon size={20} color="#3b82f6" />
          </div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Powiadomienia
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
              notification.read
                ? darkMode
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-gray-50 border border-gray-200'
                : darkMode
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)} bg-opacity-20 flex-shrink-0`}>
                <NotificationIcon size={18} color={getNotificationColor(notification.type).replace('bg-', '#')} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4
                    onClick={() => onNotificationClick(notification.eventSlug)}
                    className={`text-sm font-semibold cursor-pointer hover:text-[#38b6ff] transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {notification.eventName}
                  </h4>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Oznacz jako przeczytane"
                      >
                        <CheckIcon size={14} color="#10b981" />
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                      title="Odrzuć"
                    >
                      <CloseIcon size={14} color={darkMode ? '#9ca3af' : '#6b7280'} />
                    </button>
                  </div>
                </div>

                <p className={`text-sm mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {formatDate(notification.date)}
                  </span>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventNotifications;

