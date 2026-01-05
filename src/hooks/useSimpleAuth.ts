import { useAuth } from '../contexts/SimpleAuthProvider';

export const useSimpleAuth = () => {
  const { user, userProfile, loading } = useAuth();
  
  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isLoading: loading,
  };
};