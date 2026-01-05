import { EducationSubject, DashboardStats, ActivityItem } from './mockEducationService';

export interface EducationModule {
    id: string;
    subjectId: string;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    durationMinutes?: number;
    orderIndex: number;
    isFree?: boolean;
    isCompleted?: boolean;
}

export interface IEducationService {
    getDashboardStats(): Promise<DashboardStats>;
    getRecentActivity(): Promise<ActivityItem[]>;
    getSubjects(): Promise<{
        preclinical: EducationSubject[];
        clinical: EducationSubject[];
        specialized: EducationSubject[];
    }>;
    getModules(subjectId: string): Promise<EducationModule[]>;
    saveProgress(moduleId: string, progress: any): Promise<void>;
}

import { MockEducationService } from './mockEducationService';

// Let's implement the factory here, but we might need to lazy load local DB service to avoid importing it if not needed, or just import it.


// Valid implementation check
export const educationServiceFactory = (): IEducationService => {
    // Return Mock implementation exclusively
    return MockEducationService as unknown as IEducationService;
};

export const educationService = educationServiceFactory();
