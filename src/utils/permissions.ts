// Permission system for DlaMedica application

export type UserRole = 'admin' | 'lekarz' | 'student' | 'firma';
export type AccountType = 'personal' | 'company';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_company?: boolean;
  account_type?: AccountType;
  company_name?: string;
  company_nip?: string;
  company_address?: string;
  company_industry?: string;
  specialization?: string;
  institution?: string;
  year_of_study?: number;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface PermissionContext {
  user?: User | null;
  resource?: any;
  action: string;
}

// Permission definitions
const PERMISSIONS = {
  // Event permissions
  'events.create.conference': (ctx: PermissionContext): boolean => {
    // Only company accounts can create conferences
    return ctx.user?.is_company === true || ctx.user?.account_type === 'company';
  },

  'events.create.webinar': (ctx: PermissionContext): boolean => {
    // All authenticated users can create webinars
    return ctx.user !== null && ctx.user !== undefined;
  },

  'events.edit': (ctx: PermissionContext): boolean => {
    // Users can edit their own events, admins can edit all
    if (ctx.user?.role === 'admin') return true;
    return ctx.user?.id === ctx.resource?.creator_id;
  },

  'events.delete': (ctx: PermissionContext): boolean => {
    // Users can delete their own events, admins can delete all
    if (ctx.user?.role === 'admin') return true;
    return ctx.user?.id === ctx.resource?.creator_id;
  },

  'events.view.company_only': (ctx: PermissionContext): boolean => {
    // Company-only events can only be viewed by companies or admins
    if (ctx.user?.role === 'admin') return true;
    if (ctx.resource?.company_only === true) {
      return ctx.user?.is_company === true || ctx.user?.account_type === 'company';
    }
    return true; // Non-company-only events can be viewed by everyone
  },

  // Job offer permissions
  'jobs.create': (ctx: PermissionContext): boolean => {
    // Only company accounts can create job offers
    return ctx.user?.is_company === true || ctx.user?.account_type === 'company';
  },

  'jobs.edit': (ctx: PermissionContext): boolean => {
    // Users can edit their own job offers, admins can edit all
    if (ctx.user?.role === 'admin') return true;
    return ctx.user?.id === ctx.resource?.employer_id;
  },

  'jobs.delete': (ctx: PermissionContext): boolean => {
    // Users can delete their own job offers, admins can delete all
    if (ctx.user?.role === 'admin') return true;
    return ctx.user?.id === ctx.resource?.employer_id;
  },

  // Application permissions
  'applications.view': (ctx: PermissionContext): boolean => {
    // Users can view their own applications, employers can view applications for their jobs
    if (ctx.user?.role === 'admin') return true;
    if (ctx.user?.id === ctx.resource?.user_id) return true;
    // Check if user is the employer of the job
    return ctx.user?.id === ctx.resource?.job_offer?.employer_id;
  },

  'applications.create': (ctx: PermissionContext): boolean => {
    // All authenticated users can apply for jobs
    return ctx.user !== null && ctx.user !== undefined;
  },

  // Admin permissions
  'admin.access': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'admin';
  },

  'admin.users.manage': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'admin';
  },

  'admin.content.moderate': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'admin';
  },

  // Profile permissions
  'profile.edit': (ctx: PermissionContext): boolean => {
    // Users can edit their own profile, admins can edit any profile
    if (ctx.user?.role === 'admin') return true;
    return ctx.user?.id === ctx.resource?.id;
  },

  // Company-specific permissions
  'company.features.access': (ctx: PermissionContext): boolean => {
    // Only company accounts can access company features
    return ctx.user?.role === 'firma' || ctx.user?.is_company === true || ctx.user?.account_type === 'company';
  },

  'company.analytics.view': (ctx: PermissionContext): boolean => {
    // Only company accounts can view analytics
    return ctx.user?.role === 'firma' || ctx.user?.is_company === true || ctx.user?.account_type === 'company';
  },

  // Student-specific permissions
  'student.learning.access': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'student' || ctx.user?.role === 'lekarz';
  },

  'student.certificates.view': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'student' || ctx.user?.role === 'lekarz';
  },

  // Doctor-specific permissions
  'doctor.verification.request': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'lekarz';
  },

  'doctor.specializations.manage': (ctx: PermissionContext): boolean => {
    return ctx.user?.role === 'lekarz' || ctx.user?.role === 'admin';
  }
};

/**
 * Check if a user has permission to perform an action
 */
export function hasPermission(
  permission: string, 
  user?: User | null, 
  resource?: any
): boolean {
  const permissionCheck = PERMISSIONS[permission as keyof typeof PERMISSIONS];
  
  if (!permissionCheck) {
    console.warn(`Unknown permission: ${permission}`);
    return false;
  }

  return permissionCheck({ user, resource, action: permission });
}

/**
 * Assert that a user has permission, throw error if not
 */
export function assertPermission(
  permission: string, 
  user?: User | null, 
  resource?: any,
  errorMessage?: string
): void {
  if (!hasPermission(permission, user, resource)) {
    throw new Error(errorMessage || `Access denied: ${permission}`);
  }
}

/**
 * Check if user is a company account
 */
export function isCompanyAccount(user?: User | null): boolean {
  return user?.role === 'firma' || user?.is_company === true || user?.account_type === 'company';
}

/**
 * Check if user is a student
 */
export function isStudent(user?: User | null): boolean {
  return user?.role === 'student';
}

/**
 * Check if user is a doctor
 */
export function isDoctor(user?: User | null): boolean {
  return user?.role === 'lekarz';
}

/**
 * Check if user is an admin
 */
export function isAdmin(user?: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Check if user is a moderator or admin (deprecated - use isAdmin)
 */
export function isModerator(user?: User | null): boolean {
  return user?.role === 'admin';
}

/**
 * Get user's display name
 */
export function getUserDisplayName(user?: User | null): string {
  if (!user) return 'Gość';
  
  if (user.is_company || user.account_type === 'company') {
    return user.company_name || user.full_name || 'Firma';
  }
  
  return user.full_name || user.email || 'Użytkownik';
}

/**
 * Check if user owns a resource
 */
export function isOwner(user?: User | null, resource?: any): boolean {
  if (!user || !resource) return false;
  
  // Check common ownership fields
  return user.id === resource.creator_id || 
         user.id === resource.user_id || 
         user.id === resource.employer_id ||
         user.id === resource.author_id;
}

/**
 * Get permission level for display
 */
export function getPermissionLevel(user?: User | null): string {
  if (!user) return 'guest';
  if (user.role === 'admin') return 'admin';
  if (user.role === 'firma') return 'company';
  if (user.role === 'lekarz') return 'doctor';
  if (user.role === 'student') return 'student';
  if (user.is_company || user.account_type === 'company') return 'company';
  return 'user';
}

/**
 * Permission-based component wrapper
 */
export function withPermission<T>(
  permission: string,
  user?: User | null,
  resource?: any
): (component: T) => T | null {
  return (component: T): T | null => {
    return hasPermission(permission, user, resource) ? component : null;
  };
}

// Export permission keys for type safety
export const PERMISSION_KEYS = Object.keys(PERMISSIONS) as Array<keyof typeof PERMISSIONS>;