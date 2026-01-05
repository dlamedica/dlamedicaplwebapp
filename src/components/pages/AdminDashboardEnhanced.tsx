/**
 * Rozbudowany panel administratora z unikalnym designem
 * Wszystkie komponenty stworzone od podstaw
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/apiClient';
import { isAdmin } from '../../utils/permissions';
import {
  AdminIcon, OverviewIcon, ProfileIcon, LogoutIcon, EditIcon, SaveIcon,
  CancelIcon, StatsIcon, ActivityIcon, UsersIcon, CompanyIcon,
  CertificateIcon, SearchIcon, FilterIcon, SettingsIcon, ExportIcon,
  StudentIcon, DoctorIcon
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import { CustomProgressBar } from '../../components/ui/CustomProgressBar';

interface AdminDashboardEnhancedProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalJobOffers: number;
  pendingJobOffers: number;
  totalEvents: number;
  pendingEvents: number;
  totalCompanies: number;
  totalStudents: number;
  totalDoctors: number;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login_at?: string;
}

const AdminDashboardEnhanced: React.FC<AdminDashboardEnhancedProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'analytics' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalJobOffers: 0,
    pendingJobOffers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    totalCompanies: 0,
    totalStudents: 0,
    totalDoctors: 0
  });

  // Filters
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');

  useEffect(() => {
    document.title = 'Panel Administratora – DlaMedica.pl';
    
    if (user && profile) {
      loadAdminData();
    }
  }, [user, profile]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        // Load all users
        const { data: usersData, error: usersError } = await db
          .from('users_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (usersData) {
          setUsers(usersData);
          
          // Calculate stats
          setSystemStats({
            totalUsers: usersData.length,
            activeUsers: usersData.filter(u => u.is_active).length,
            totalJobOffers: 0, // TODO: count from job_offers
            pendingJobOffers: 0, // TODO: count from job_offers
            totalEvents: 0, // TODO: count from events
            pendingEvents: 0, // TODO: count from events
            totalCompanies: usersData.filter(u => u.role === 'firma').length,
            totalStudents: usersData.filter(u => u.role === 'student').length,
            totalDoctors: usersData.filter(u => u.role === 'lekarz').length
          });
        }

        // Load job offers count
        const { count: jobOffersCount } = await db
          .from('job_offers')
          .select('*', { count: 'exact', head: true });

        const { count: pendingJobsCount } = await db
          .from('job_offers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (jobOffersCount !== null) {
          setSystemStats(prev => ({
            ...prev,
            totalJobOffers: jobOffersCount,
            pendingJobOffers: pendingJobsCount || 0
          }));
        }
      }
    } catch (error) {
      console.error('Błąd ładowania danych admina:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'verify' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
        
        const { error } = await db
          .from('users_profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
      } else {
        const updateData: any = {};
        if (action === 'activate' || action === 'deactivate') {
          updateData.is_active = action === 'activate';
        }
        if (action === 'verify') {
          updateData.is_verified = true;
        }

        const { error } = await db
          .from('users_profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) throw error;
      }

      await loadAdminData();
    } catch (error) {
      console.error('Błąd wykonania akcji:', error);
      alert('Błąd podczas wykonywania akcji');
    }
  };

  const fontSizeClasses = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm', button: 'text-sm px-3 py-1' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base px-4 py-2' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg px-5 py-3' }
  };

  const fontSizes = fontSizeClasses[fontSize];

  const filteredUsers = users.filter(user => {
    const matchesSearch = !userSearchTerm || 
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' ||
      (userStatusFilter === 'active' && user.is_active) ||
      (userStatusFilter === 'inactive' && !user.is_active) ||
      (userStatusFilter === 'verified' && user.is_verified) ||
      (userStatusFilter === 'unverified' && !user.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statystyki systemu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <UsersIcon size={32} color="#3b82f6" />
              <CustomBadge variant="info" darkMode={darkMode} size="sm">
                {systemStats.activeUsers} aktywnych
              </CustomBadge>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Użytkownicy
            </p>
            <p className={`${fontSizes.title} font-bold`}>{systemStats.totalUsers}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CompanyIcon size={32} color="#10b981" />
              <CustomBadge variant="success" darkMode={darkMode} size="sm">
                {systemStats.pendingJobOffers} oczekuje
              </CustomBadge>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Oferty pracy
            </p>
            <p className={`${fontSizes.title} font-bold`}>{systemStats.totalJobOffers}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ActivityIcon size={32} color="#a855f7" />
              <CustomBadge variant="warning" darkMode={darkMode} size="sm">
                {systemStats.pendingEvents} oczekuje
              </CustomBadge>
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Wydarzenia
            </p>
            <p className={`${fontSizes.title} font-bold`}>{systemStats.totalEvents}</p>
          </div>
        </CustomCard>

        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <StatsIcon size={32} color="#f59e0b" />
            </div>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              Aktywność systemu
            </p>
            <p className={`${fontSizes.title} font-bold`}>
              {((systemStats.activeUsers / Math.max(systemStats.totalUsers, 1)) * 100).toFixed(0)}%
            </p>
          </div>
        </CustomCard>
      </div>

      {/* Podział użytkowników */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Podział użytkowników</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <StudentIcon size={48} color="#3b82f6" className="mx-auto mb-2" />
              <p className={`${fontSizes.title} font-bold`}>{systemStats.totalStudents}</p>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Studenci</p>
            </div>
            <div className="text-center">
              <DoctorIcon size={48} color="#10b981" className="mx-auto mb-2" />
              <p className={`${fontSizes.title} font-bold`}>{systemStats.totalDoctors}</p>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lekarze</p>
            </div>
            <div className="text-center">
              <CompanyIcon size={48} color="#a855f7" className="mx-auto mb-2" />
              <p className={`${fontSizes.title} font-bold`}>{systemStats.totalCompanies}</p>
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Firmy</p>
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Ostatnia aktywność */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Ostatnio zarejestrowani</h3>
          {users.length === 0 ? (
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center py-4`}>
              Brak użytkowników
            </p>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg border ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`${fontSizes.text} font-medium`}>
                        {u.first_name} {u.last_name} ({u.email})
                      </p>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {u.role} • {new Date(u.created_at).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CustomBadge
                        variant={u.is_active ? 'success' : 'error'}
                        darkMode={darkMode}
                        size="sm"
                      >
                        {u.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </CustomBadge>
                      {u.is_verified && (
                        <CustomBadge variant="info" darkMode={darkMode} size="sm">
                          Zweryfikowany
                        </CustomBadge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Filtry i wyszukiwanie */}
      <CustomCard darkMode={darkMode} variant="default">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <SearchIcon size={20} color={darkMode ? '#9ca3af' : '#6b7280'} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Szukaj użytkowników..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className={`w-full ${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className={`${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Wszystkie role</option>
              <option value="student">Studenci</option>
              <option value="lekarz">Lekarze</option>
              <option value="firma">Firmy</option>
              <option value="admin">Administratorzy</option>
            </select>
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className={`${fontSizes.text} ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywni</option>
              <option value="inactive">Nieaktywni</option>
              <option value="verified">Zweryfikowani</option>
              <option value="unverified">Niezweryfikowani</option>
            </select>
          </div>
        </div>
      </CustomCard>

      {/* Lista użytkowników */}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${fontSizes.title} font-bold`}>
              Użytkownicy ({filteredUsers.length})
            </h2>
            <CustomButton
              variant="outline"
              size="sm"
              darkMode={darkMode}
              icon={<ExportIcon size={18} color={darkMode ? 'white' : 'gray'} />}
            >
              Eksportuj
            </CustomButton>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon size={96} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Brak użytkowników spełniających kryteria
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-5 rounded-lg border ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`${fontSizes.subtitle} font-bold`}>
                          {u.first_name} {u.last_name}
                        </h3>
                        <CustomBadge
                          variant={
                            u.role === 'admin' ? 'error' :
                            u.role === 'lekarz' ? 'success' :
                            u.role === 'firma' ? 'info' : 'default'
                          }
                          darkMode={darkMode}
                          size="sm"
                        >
                          {u.role === 'admin' ? 'Admin' :
                           u.role === 'lekarz' ? 'Lekarz' :
                           u.role === 'firma' ? 'Firma' : 'Student'}
                        </CustomBadge>
                      </div>
                      <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        {u.email}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                          Utworzono: {new Date(u.created_at).toLocaleDateString('pl-PL')}
                        </span>
                        {u.last_login_at && (
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                            Ostatnie logowanie: {new Date(u.last_login_at).toLocaleDateString('pl-PL')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CustomBadge
                        variant={u.is_active ? 'success' : 'error'}
                        darkMode={darkMode}
                        size="sm"
                      >
                        {u.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </CustomBadge>
                      {u.is_verified && (
                        <CustomBadge variant="info" darkMode={darkMode} size="sm">
                          ✓
                        </CustomBadge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {!u.is_active && (
                      <CustomButton
                        variant="success"
                        size="sm"
                        darkMode={darkMode}
                        onClick={() => handleUserAction(u.id, 'activate')}
                      >
                        Aktywuj
                      </CustomButton>
                    )}
                    {u.is_active && (
                      <CustomButton
                        variant="secondary"
                        size="sm"
                        darkMode={darkMode}
                        onClick={() => handleUserAction(u.id, 'deactivate')}
                      >
                        Deaktywuj
                      </CustomButton>
                    )}
                    {!u.is_verified && (
                      <CustomButton
                        variant="info"
                        size="sm"
                        darkMode={darkMode}
                        onClick={() => handleUserAction(u.id, 'verify')}
                      >
                        Zweryfikuj
                      </CustomButton>
                    )}
                    <CustomButton
                      variant="danger"
                      size="sm"
                      darkMode={darkMode}
                      onClick={() => handleUserAction(u.id, 'delete')}
                    >
                      Usuń
                    </CustomButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );

  const renderContent = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Zarządzanie treścią</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Oferty pracy</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={fontSizes.text}>Wszystkie oferty</span>
                <CustomBadge variant="default" darkMode={darkMode}>
                  {systemStats.totalJobOffers}
                </CustomBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className={fontSizes.text}>Oczekujące na akceptację</span>
                <CustomBadge variant="warning" darkMode={darkMode}>
                  {systemStats.pendingJobOffers}
                </CustomBadge>
              </div>
              <CustomButton
                variant="primary"
                size="sm"
                darkMode={darkMode}
                onClick={() => {
                  window.history.pushState({}, '', '/admin?tab=jobs');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                Zarządzaj ofertami
              </CustomButton>
            </div>
          </div>
          <div>
            <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Wydarzenia</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={fontSizes.text}>Wszystkie wydarzenia</span>
                <CustomBadge variant="default" darkMode={darkMode}>
                  {systemStats.totalEvents}
                </CustomBadge>
              </div>
              <div className="flex justify-between items-center">
                <span className={fontSizes.text}>Oczekujące na akceptację</span>
                <CustomBadge variant="warning" darkMode={darkMode}>
                  {systemStats.pendingEvents}
                </CustomBadge>
              </div>
              <CustomButton
                variant="primary"
                size="sm"
                darkMode={darkMode}
                onClick={() => {
                  window.history.pushState({}, '', '/admin?tab=events');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                Zarządzaj wydarzeniami
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </CustomCard>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-6">
          <h2 className={`${fontSizes.title} font-bold mb-6`}>Analityka systemu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Aktywność użytkowników</h3>
              <CustomProgressBar
                value={(systemStats.activeUsers / Math.max(systemStats.totalUsers, 1)) * 100}
                darkMode={darkMode}
                variant="gradient"
                showLabel
                label="Aktywni użytkownicy"
              />
            </div>
            <div>
              <h3 className={`${fontSizes.subtitle} font-bold mb-4`}>Podział ról</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={fontSizes.text}>Studenci</span>
                    <span className={fontSizes.text}>
                      {((systemStats.totalStudents / Math.max(systemStats.totalUsers, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <CustomProgressBar
                    value={(systemStats.totalStudents / Math.max(systemStats.totalUsers, 1)) * 100}
                    darkMode={darkMode}
                    variant="default"
                    color="#3b82f6"
                    showLabel={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={fontSizes.text}>Lekarze</span>
                    <span className={fontSizes.text}>
                      {((systemStats.totalDoctors / Math.max(systemStats.totalUsers, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <CustomProgressBar
                    value={(systemStats.totalDoctors / Math.max(systemStats.totalUsers, 1)) * 100}
                    darkMode={darkMode}
                    variant="default"
                    color="#10b981"
                    showLabel={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={fontSizes.text}>Firmy</span>
                    <span className={fontSizes.text}>
                      {((systemStats.totalCompanies / Math.max(systemStats.totalUsers, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <CustomProgressBar
                    value={(systemStats.totalCompanies / Math.max(systemStats.totalUsers, 1)) * 100}
                    darkMode={darkMode}
                    variant="default"
                    color="#a855f7"
                    showLabel={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderSettings = () => (
    <CustomCard darkMode={darkMode} variant="elevated">
      <div className="p-6">
        <h2 className={`${fontSizes.title} font-bold mb-6`}>Ustawienia systemu</h2>
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`${fontSizes.subtitle} font-bold mb-2`}>Eksport danych</h3>
            <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Eksportuj dane użytkowników w formacie CSV
            </p>
            <CustomButton
              variant="primary"
              darkMode={darkMode}
              icon={<ExportIcon size={18} color="white" />}
            >
              Eksportuj wszystkie dane
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomCard>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`${fontSizes.text} mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie danych...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <CustomCard darkMode={darkMode} variant="elevated" className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`${fontSizes.title} font-bold flex items-center`}>
                  <AdminIcon size={32} color="#3b82f6" className="mr-3" />
                  Panel Administratora
                </h1>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Zarządzanie systemem DlaMedica
                </p>
              </div>
              <CustomButton
                variant="danger"
                size="sm"
                darkMode={darkMode}
                onClick={signOut}
                icon={<LogoutIcon size={18} color="white" />}
              >
                Wyloguj
              </CustomButton>
            </div>
          </div>
        </CustomCard>

        {/* Tabs */}
        <CustomCard darkMode={darkMode} variant="default" className="mb-6">
          <div className="p-0">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'overview', label: 'Przegląd', Icon: OverviewIcon },
                { id: 'users', label: 'Użytkownicy', Icon: UsersIcon },
                { id: 'content', label: 'Treść', Icon: ActivityIcon },
                { id: 'analytics', label: 'Analityka', Icon: StatsIcon },
                { id: 'settings', label: 'Ustawienia', Icon: SettingsIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 ${fontSizes.text} py-4 px-6 flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
                  }`}
                >
                  <tab.Icon size={20} color={activeTab === tab.id ? '#3b82f6' : 'currentColor'} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CustomCard>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;

