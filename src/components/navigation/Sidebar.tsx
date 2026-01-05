import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { NavigationItem as NavigationItemType } from '../../types/navigation';
import { navigationConfig } from '../../types/navigation';
import StudyFieldWidget from './StudyFieldWidget';
import NavigationItem from './NavigationItem';
import { useUser } from '../../hooks/useUser';

interface SidebarProps {
  darkMode?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onNavigate?: (path: string) => void;
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  darkMode = false,
  isOpen = true,
  onToggle,
  onNavigate,
  currentPage = 'dashboard'
}) => {
  const { isAuthenticated, loading } = useUser();
  const [navigationItems, setNavigationItems] = useState(navigationConfig.items);

  // Check if we're on education page - check both currentPage prop and URL
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isEducationPage = currentPage === 'edukacja' ||
    currentPage === 'preclinical-subjects' ||
    currentPage === 'clinical-subjects' ||
    currentPage === 'specialized-subjects' ||
    currentPage === 'my-patient' ||
    currentPage === 'exams' ||
    path === '/edukacja' ||
    path === '/egzaminy' ||
    path.startsWith('/edukacja/') ||
    path.startsWith('/egzaminy/') ||
    path.startsWith('/moj-pacjent') ||
    path.includes('/edukacja');

  // Debug logging
  useEffect(() => {
    console.log('🔍 Sidebar: currentPage=', currentPage, 'path=', path, 'isEducationPage=', isEducationPage, 'isAuthenticated=', isAuthenticated, 'loading=', loading);
  }, [currentPage, path, isEducationPage, isAuthenticated, loading]);

  // Map currentPage to navigation item ID
  const getActiveItemId = (page: string) => {
    const pageToItemMap: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'home': 'dashboard',
      'preclinical-subjects': 'preclinical',
      'clinical-subjects': 'clinical',
      'specialized-subjects': 'specialist',
      'flashcards': 'flashcards',
      'flashcards-create': 'flashcards',
      'flashcards-edit': 'flashcards',
      'flashcards-study-selection': 'flashcards',
      'flashcards-classic': 'flashcards',
      'flashcards-learn': 'flashcards',
      'flashcards-write': 'flashcards',
      'flashcards-test': 'flashcards',
      'flashcards-match': 'flashcards',
      'flashcards-gravity': 'flashcards',
      'flashcards-progress': 'flashcards',
      'exams': 'exams',
      'study-plans': 'study-plans',
      'study-plans-create': 'study-plans',
      'study-plans-active': 'study-plans',
      'study-plans-templates': 'study-plans'
    };
    return pageToItemMap[page] || 'dashboard';
  };

  const activeItemId = getActiveItemId(currentPage);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          onToggle?.();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onToggle]);

  const handleToggleExpand = (itemId: string) => {
    setNavigationItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        // Close other expanded items (accordion behavior)
        if (item.children && item.isExpanded && item.id !== itemId) {
          return { ...item, isExpanded: false };
        }
        return item;
      })
    );
  };

  const handleItemClick = (item: NavigationItemType) => {
    if (item.href) {
      onNavigate?.(item.href);

      // Close mobile sidebar after navigation
      if (isMobile && onToggle) {
        onToggle();
      }
    }
  };

  const sidebarClasses = `
    fixed left-0 top-0 h-screen w-80 z-50 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${darkMode
      ? 'bg-gray-900 border-gray-700/50'
      : 'bg-white border-gray-200'
    } 
    border-r shadow-xl backdrop-blur-sm overflow-hidden flex flex-col
    ${isMobile ? 'w-full max-w-80' : ''}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div id="sidebar" className={sidebarClasses}>
        {/* Mobile Header */}
        {(isMobile || !isMobile) && (
          <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Menu
            </span>
            <button
              onClick={onToggle}
              className={`p-2 rounded-md ${darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              title="Zamknij menu"
            >
              <FaTimes size={18} />
            </button>
          </div>
        )}

        {/* Study Field Selection - Always visible as requested by user */}
        <StudyFieldWidget
          darkMode={darkMode}
          hideForUnauthenticated={false} // Widget handles unauth state internally (shows lock)
        />

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <div className="py-4">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeItemId === item.id}
                darkMode={darkMode}
                onItemClick={handleItemClick}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        </nav>

        {/* Footer - Version info or additional links */}
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
            DlaMedica Platform v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;