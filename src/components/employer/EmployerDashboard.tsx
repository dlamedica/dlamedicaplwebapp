import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobPostingForm from './JobPostingForm';
import MyJobListings from './MyJobListings';
import ApplicationsManager from './ApplicationsManager';

interface EmployerDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface DashboardStats {
  totalJobOffers: number;
  activeJobOffers: number;
  totalApplications: number;
  newApplications: number;
  viewsThisMonth: number;
  responseRate: number;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ darkMode, fontSize }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'post-job' | 'my-listings' | 'applications'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalJobOffers: 0,
    activeJobOffers: 0,
    totalApplications: 0,
    newApplications: 0,
    viewsThisMonth: 0,
    responseRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalJobOffers: 12,
          activeJobOffers: 8,
          totalApplications: 156,
          newApplications: 23,
          viewsThisMonth: 2847,
          responseRate: 68
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchStats();
  }, []);

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ${
          fontSize === 'large' ? 'text-2xl' : fontSize === 'medium' ? 'text-xl' : 'text-lg'
        }`}>
          Witaj, {user?.user_metadata?.company_name || 'Pracodawco'}!
        </h2>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
          Zarządzaj swoimi ofertami pracy i kandydatami w jednym miejscu.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`rounded-lg p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Aktywne oferty
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.activeJobOffers}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Nowe aplikacje
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.newApplications}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wyświetlenia w tym miesiącu
              </p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.viewsThisMonth.toLocaleString('pl-PL')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-lg p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
          Szybkie akcje
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('post-job')}
            className="flex items-center p-4 rounded-lg bg-[#38b6ff] text-black hover:bg-[#2a9fe5] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Dodaj ofertę
          </button>
          
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`flex items-center p-4 rounded-lg border-2 transition-colors duration-200 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Moje oferty
          </button>
          
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center p-4 rounded-lg border-2 transition-colors duration-200 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Aplikacje
          </button>
          
          <button className={`flex items-center p-4 rounded-lg border-2 transition-colors duration-200 ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white' 
              : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statystyki
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-lg p-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} ${fontSizeClasses[fontSize]}`}>
          Ostatnia aktywność
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              Nowa aplikacja na stanowisko "Lekarz internista"
            </p>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              2 godziny temu
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              Opublikowano ofertę "Pielęgniarka oddziałowa"
            </p>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              1 dzień temu
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
              Zaktualizowano profil firmy
            </p>
            <span className={`ml-auto text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              3 dni temu
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie panelu pracodawcy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${
            fontSize === 'large' ? 'text-4xl' : fontSize === 'medium' ? 'text-3xl' : 'text-2xl'
          } font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Panel Pracodawcy
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${fontSizeClasses[fontSize]}`}>
            Zarządzaj ofertami pracy i kandydatami
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Przegląd', icon: '📊' },
              { key: 'post-job', label: 'Dodaj ofertę', icon: '➕' },
              { key: 'my-listings', label: 'Moje oferty', icon: '📋' },
              { key: 'applications', label: 'Aplikacje', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center px-3 py-2 font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? darkMode
                      ? 'text-[#38b6ff] border-b-2 border-[#38b6ff]'
                      : 'text-[#1976d2] border-b-2 border-[#1976d2]'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                } ${fontSizeClasses[fontSize]}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'post-job' && (
            <JobPostingForm
              darkMode={darkMode}
              fontSize={fontSize}
              onJobCreated={(jobOffer) => {
                console.log('New job offer created:', jobOffer);
                setActiveTab('my-listings');
              }}
            />
          )}
          {activeTab === 'my-listings' && (
            <MyJobListings
              darkMode={darkMode}
              fontSize={fontSize}
            />
          )}
          {activeTab === 'applications' && (
            <ApplicationsManager
              darkMode={darkMode}
              fontSize={fontSize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;