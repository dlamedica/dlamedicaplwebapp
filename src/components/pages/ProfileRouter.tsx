import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin, isCompanyAccount, isStudent, isDoctor } from '../../utils/permissions';
import StudentDashboard from './StudentDashboard';
import DoctorDashboard from './DoctorDashboard';
import CompanyDashboardEnhanced from './CompanyDashboardEnhanced';
import UserProfilePanel from './UserProfilePanel';
import AdminDashboardEnhanced from './AdminDashboardEnhanced';

interface ProfileRouterProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

/**
 * ProfileRouter - komponent routujący do odpowiedniego panelu użytkownika
 * na podstawie roli użytkownika z bazy danych
 */
const ProfileRouter: React.FC<ProfileRouterProps> = ({ darkMode, fontSize }) => {
  const { user, profile, loading } = useAuth();

  console.log('🔍 ProfileRouter: Mounting...', { 
    userId: user?.id, 
    hasProfile: !!profile, 
    profileRole: profile?.role,
    loading 
  });

  if (loading) {
    console.log('🔍 ProfileRouter: Loading state...');
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔍 ProfileRouter: No user, redirecting to login');
    // Przekieruj do logowania
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return null;
  }

  // Pobierz rolę z profilu
  const userRole = profile?.role || 'student';
  
  // Przygotuj obiekt użytkownika dla funkcji sprawdzających uprawnienia
  const userForPermissions = {
    id: user.id,
    email: user.email || '',
    role: userRole as 'admin' | 'lekarz' | 'student' | 'firma',
    ...profile
  };

  console.log('🔍 ProfileRouter: User permissions object:', userForPermissions);

  // Routing na podstawie roli
  if (isAdmin(userForPermissions)) {
    console.log('🔍 ProfileRouter: Rendering AdminDashboardEnhanced');
    return <AdminDashboardEnhanced darkMode={darkMode} fontSize={fontSize} />;
  }

  if (isDoctor(userForPermissions)) {
    console.log('🔍 ProfileRouter: Rendering DoctorDashboard');
    return <DoctorDashboard darkMode={darkMode} fontSize={fontSize} />;
  }

  if (isStudent(userForPermissions)) {
    console.log('🔍 ProfileRouter: Rendering StudentDashboard');
    return <StudentDashboard darkMode={darkMode} fontSize={fontSize} />;
  }

  if (isCompanyAccount(userForPermissions)) {
    console.log('🔍 ProfileRouter: Rendering CompanyDashboardEnhanced');
    return <CompanyDashboardEnhanced darkMode={darkMode} fontSize={fontSize} />;
  }

  console.log('🔍 ProfileRouter: Rendering Default UserProfilePanel');
  // Domyślnie - zwykły użytkownik
  return <UserProfilePanel darkMode={darkMode} fontSize={fontSize} />;
};

export default ProfileRouter;
