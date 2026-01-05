import React, { useState, useEffect } from 'react';
import { 
  FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo, FaCheckCircle, 
  FaBriefcase, FaCalendarAlt, FaUser, FaCogs, FaGraduationCap, FaPills, 
  FaCalculator, FaShoppingCart, FaEnvelope, FaUniversity, FaHeart, 
  FaLock, FaCrown, FaTrophy, FaClock, FaUsers, FaFlask, FaCertificate,
  FaWrench, FaExclamation, FaBookOpen, FaMedkit
} from 'react-icons/fa';
import { notificationService, Notification, UserType } from '../services/notificationService';

interface NotificationSystemProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  userId?: string;
  userType?: UserType;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  darkMode, 
  fontSize, 
  userId = 'user1', // Default for demo
  userType = 'user' // Default for demo
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fontSizeClasses = {
    small: {
      text: 'text-sm',
      title: 'text-base',
      badge: 'text-xs'
    },
    medium: {
      text: 'text-base',
      title: 'text-lg',
      badge: 'text-sm'
    },
    large: {
      text: 'text-lg',
      title: 'text-xl',
      badge: 'text-base'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  // Load notifications from service
  const loadNotifications = () => {
    const userNotifications = notificationService.getNotificationsForUser(userId, userType);
    const unread = notificationService.getUnreadCount(userId, userType);
    
    setNotifications(userNotifications);
    setUnreadCount(unread);
  };

  useEffect(() => {
    loadNotifications();
    
    // Set up interval to refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, userType]);

  const getNotificationIcon = (notification: Notification) => {
    const iconClass = "w-5 h-5";
    
    // First, check category for specific icons
    switch (notification.category) {
      case 'application':
        return <FaBriefcase className={`${iconClass} text-blue-500`} />;
      case 'job_offer':
        return <FaBriefcase className={`${iconClass} text-green-500`} />;
      case 'event':
        return <FaCalendarAlt className={`${iconClass} text-purple-500`} />;
      case 'profile':
        return <FaUser className={`${iconClass} text-orange-500`} />;
      case 'admin':
        return <FaCogs className={`${iconClass} text-red-500`} />;
      case 'education':
        return <FaGraduationCap className={`${iconClass} text-indigo-500`} />;
      case 'drug_database':
        return <FaPills className={`${iconClass} text-pink-500`} />;
      case 'calculator':
        return <FaCalculator className={`${iconClass} text-teal-500`} />;
      case 'shop':
        return <FaShoppingCart className={`${iconClass} text-amber-500`} />;
      case 'newsletter':
        return <FaEnvelope className={`${iconClass} text-blue-600`} />;
      case 'university':
        return <FaUniversity className={`${iconClass} text-slate-600`} />;
      case 'favorites':
        return <FaHeart className={`${iconClass} text-rose-500`} />;
      case 'security':
        return <FaLock className={`${iconClass} text-red-600`} />;
      case 'subscription':
        return <FaCrown className={`${iconClass} text-yellow-500`} />;
      case 'achievement':
        return <FaTrophy className={`${iconClass} text-gold-500`} />;
      case 'reminder':
        return <FaClock className={`${iconClass} text-orange-400`} />;
      case 'collaboration':
        return <FaUsers className={`${iconClass} text-cyan-500`} />;
      case 'research':
        return <FaFlask className={`${iconClass} text-emerald-500`} />;
      case 'certification':
        return <FaCertificate className={`${iconClass} text-violet-500`} />;
      case 'system':
        return <FaWrench className={`${iconClass} text-gray-500`} />;
      default:
        // Fallback to type-based icons
        switch (notification.type) {
          case 'success':
            return <FaCheckCircle className={`${iconClass} text-green-500`} />;
          case 'error':
            return <FaExclamationTriangle className={`${iconClass} text-red-500`} />;
          case 'warning':
            return <FaExclamationTriangle className={`${iconClass} text-yellow-500`} />;
          case 'info':
            return <FaInfo className={`${iconClass} text-blue-500`} />;
          default:
            return <FaBell className={`${iconClass} text-gray-500`} />;
        }
    }
  };

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    loadNotifications(); // Refresh from service
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead(userId, userType);
    loadNotifications(); // Refresh from service
  };

  const removeNotification = (notificationId: string) => {
    notificationService.removeNotification(notificationId);
    loadNotifications(); // Refresh from service
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours}h temu`;
    } else {
      return `${diffDays} dni temu`;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      window.history.pushState({}, '', notification.action_url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          darkMode 
            ? 'hover:bg-gray-700 text-white' 
            : 'hover:bg-gray-100 text-black'
        }`}
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 ${fontSizes.badge} bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg border z-50 ${
          darkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`${fontSizes.title} font-semibold`}>Powiadomienia</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`${fontSizes.text} text-[#38b6ff] hover:text-blue-600`}
                >
                  Oznacz wszystkie
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <FaBell className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Brak powiadomień
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b transition-colors cursor-pointer ${
                    darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } ${!notification.read ? (darkMode ? 'bg-gray-750' : 'bg-blue-50') : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`${fontSizes.text} font-medium ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`${fontSizes.text} mt-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-2 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {formatTimestamp(notification.created_at)}
                          </p>
                          {notification.action_text && (
                            <button className="text-xs text-[#38b6ff] hover:text-blue-600 mt-1">
                              {notification.action_text}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#38b6ff] rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              darkMode 
                                ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                                : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={`p-3 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.history.pushState({}, '', '/profile');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className={`${fontSizes.text} text-[#38b6ff] hover:text-blue-600`}
              >
                Zobacz wszystkie powiadomienia
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationSystem;