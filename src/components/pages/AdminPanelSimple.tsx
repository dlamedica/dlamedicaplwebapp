import React, { useState } from 'react';
import { 
  FaUsers, FaBriefcase, FaCalendarAlt, FaChartBar, FaPills, FaUsersCog
} from 'react-icons/fa';

interface AdminPanelSimpleProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const AdminPanelSimple: React.FC<AdminPanelSimpleProps> = ({ darkMode, fontSize }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'events' | 'drugs' | 'users' | 'analytics'>('dashboard');

  const fontSizeClasses = {
    small: {
      title: 'text-lg',
      subtitle: 'text-base',
      text: 'text-sm',
      label: 'text-xs',
      button: 'text-sm px-3 py-1'
    },
    medium: {
      title: 'text-xl',
      subtitle: 'text-lg',
      text: 'text-base',
      label: 'text-sm',
      button: 'text-base px-4 py-2'
    },
    large: {
      title: 'text-2xl',
      subtitle: 'text-xl',
      text: 'text-lg',
      label: 'text-base',
      button: 'text-lg px-5 py-3'
    }
  };

  const fontSizes = fontSizeClasses[fontSize];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Panel główny', icon: FaChartBar },
              { id: 'jobs', label: 'Oferty pracy', icon: FaBriefcase },
              { id: 'events', label: 'Wydarzenia', icon: FaCalendarAlt },
              { id: 'drugs', label: 'Baza leków', icon: FaPills },
              { id: 'users', label: 'Użytkownicy', icon: FaUsersCog },
              { id: 'analytics', label: 'Analityka', icon: FaChartBar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-[#38b6ff] text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="text-center py-8">
            <h2 className={`${fontSizes.title} font-bold mb-4`}>Panel Administratora</h2>
            <p className={`${fontSizes.text} text-gray-600 mb-4`}>
              Aktywna zakładka: {activeTab}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <h3 className={`${fontSizes.subtitle} font-semibold mb-2`}>Oferty pracy</h3>
                <p className={`${fontSizes.title} font-bold text-blue-500`}>12</p>
                <p className={`${fontSizes.text} text-gray-500`}>oczekujących</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <h3 className={`${fontSizes.subtitle} font-semibold mb-2`}>Wydarzenia</h3>
                <p className={`${fontSizes.title} font-bold text-green-500`}>8</p>
                <p className={`${fontSizes.text} text-gray-500`}>oczekujących</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <h3 className={`${fontSizes.subtitle} font-semibold mb-2`}>Użytkownicy</h3>
                <p className={`${fontSizes.title} font-bold text-purple-500`}>247</p>
                <p className={`${fontSizes.text} text-gray-500`}>aktywnych</p>
              </div>
            </div>
            <div className="mt-8">
              <p className={`${fontSizes.text} text-gray-500`}>
                Zaawansowana funkcjonalność panelu administratora będzie dostępna wkrótce.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelSimple;