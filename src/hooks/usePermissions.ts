import { useAuth } from '../contexts/AuthContext';
import { hasPermission, isCompanyAccount, isAdmin, isModerator, getUserDisplayName, getPermissionLevel, User } from '../utils/permissions';

/**
 * Hook for checking permissions in React components
 */
export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission: string, resource?: any): boolean => {
    return hasPermission(permission, user as User, resource);
  };

  const canCreateConference = (): boolean => {
    return checkPermission('events.create.conference');
  };

  const canCreateWebinar = (): boolean => {
    return checkPermission('events.create.webinar');
  };

  const canCreateJobOffer = (): boolean => {
    return checkPermission('jobs.create');
  };

  const canEditEvent = (event: any): boolean => {
    return checkPermission('events.edit', event);
  };

  const canDeleteEvent = (event: any): boolean => {
    return checkPermission('events.delete', event);
  };

  const canEditJobOffer = (jobOffer: any): boolean => {
    return checkPermission('jobs.edit', jobOffer);
  };

  const canViewCompanyOnlyEvent = (event: any): boolean => {
    return checkPermission('events.view.company_only', event);
  };

  const canAccessAdminPanel = (): boolean => {
    return checkPermission('admin.access');
  };

  const canModerateContent = (): boolean => {
    return checkPermission('admin.content.moderate');
  };

  const canAccessCompanyFeatures = (): boolean => {
    return checkPermission('company.features.access');
  };

  return {
    // Core permission checker
    hasPermission: checkPermission,
    
    // User type checks
    isCompany: isCompanyAccount(user as User),
    isAdmin: isAdmin(user as User),
    isModerator: isModerator(user as User),
    
    // Specific permission checks
    canCreateConference,
    canCreateWebinar,
    canCreateJobOffer,
    canEditEvent,
    canDeleteEvent,
    canEditJobOffer,
    canViewCompanyOnlyEvent,
    canAccessAdminPanel,
    canModerateContent,
    canAccessCompanyFeatures,
    
    // User info
    userDisplayName: getUserDisplayName(user as User),
    permissionLevel: getPermissionLevel(user as User),
    
    // Current user
    user: user as User
  };
}

/**
 * Hook for permission-based conditional rendering
 */
export function useConditionalRender() {
  const { hasPermission } = usePermissions();
  
  const renderIf = (permission: string, resource?: any) => {
    return (component: React.ReactNode): React.ReactNode => {
      return hasPermission(permission, resource) ? component : null;
    };
  };

  return { renderIf };
}