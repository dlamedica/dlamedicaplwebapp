import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../navigation/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  darkMode?: boolean;
  showSidebar?: boolean;
  currentPage?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  darkMode = false,
  showSidebar = true,
  currentPage = 'dashboard'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path: string) => {
    // Integrate with existing routing system
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNavigate={handleNavigation}
        currentPage={currentPage}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen && !isMobile ? 'ml-80' : 'ml-0'
      }`}>
        {/* Top Bar with Menu Toggle */}
        <div className={`flex items-center px-4 py-3 border-b ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={handleSidebarToggle}
            className={`p-2 rounded-md mr-4 ${
              darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle sidebar"
          >
            <FaBars size={18} />
          </button>
          
          {/* Additional top bar content can be added here */}
          <div className="flex-1">
            {/* Page title or breadcrumbs */}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;