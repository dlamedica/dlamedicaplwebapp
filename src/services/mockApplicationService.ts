
import { JobApplication, JobApplicationInput, ApplicationWithJobOffer } from '../types';
import { mockJobOffers } from './mockJobService'; // Import to link applications to jobs

/**
 * Mock Application Service
 * Simulates application process without backend
 */

// Initial mock applications
let mockApplications: any[] = [
    {
        id: 'app_001',
        job_offer_id: '1', // Matches mockJobOffers[0]
        applicant_id: 'user_123', // Matches standard test user
        status: 'pending',
        applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        // Joined data simulation
        job_offers: {
            title: 'Kardiolog - Prywatna Klinika',
            company_name: 'CardioMed Center',
            city: 'Warszawa'
        }
    },
    {
        id: 'app_002',
        job_offer_id: '4', // Matches mockJobOffers[3]
        applicant_id: 'user_123',
        status: 'reviewed',
        applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        job_offers: {
            title: 'Dermatolog - Konsultacje online',
            company_name: 'TeleMed Poland',
            city: 'Zdalnie'
        }
    }
];

export const MockApplicationService = {
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    createApplication: async (applicationData: Partial<JobApplication>): Promise<JobApplication> => {
        await MockApplicationService.sleep(800);

        // Create new application
        const newApp = {
            id: `app_${Math.random().toString(36).substring(7)}`,
            ...applicationData,
            status: 'pending',
            applied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Store strictly in local memory for this session
        // In a real mock DB we would join, but here we just store raw or joined if needed
        // For getUserApplications to work properly with our simple mock, we might need to "fake join" it when reading
        // or store it "pre-joined" if the main app expects 'job_offers' property.

        // However, createApplication returns Just JobApplication usually.
        mockApplications.unshift({
            ...newApp,
            // Fake join for future gets
            job_offers: {
                title: 'Mock Job Title', // simplified
                company_name: 'Mock Company',
                city: 'Mock City'
            }
        });

        return newApp as JobApplication;
    },

    getUserApplications: async (userId: string): Promise<ApplicationWithJobOffer[]> => {
        await MockApplicationService.sleep(600);
        // Return all mock applications (assuming single user mode for simplicity or filter by userId)
        // Here strictly filtering if we cared, but for demo we just return list
        return mockApplications as unknown as ApplicationWithJobOffer[];
    },

    updateApplicationStatus: async (id: string, status: string) => {
        await MockApplicationService.sleep(400);
        const app = mockApplications.find(a => a.id === id);
        if (app) {
            app.status = status;
            app.updated_at = new Date().toISOString();
            return app;
        }
        throw new Error('Application not found');
    },

    hasUserApplied: async (userId: string, jobOfferId: string): Promise<boolean> => {
        await MockApplicationService.sleep(300);
        return mockApplications.some(a => a.job_offer_id === jobOfferId);
    },

    withdrawApplication: async (applicationId: string): Promise<void> => {
        await MockApplicationService.sleep(500);
        mockApplications = mockApplications.filter(a => a.id !== applicationId);
    },

    // File Upload Mocks
    uploadCV: async (file: File, userId: string): Promise<any> => {
        await MockApplicationService.sleep(1500); // Simulate upload
        // Mock validation
        if (file.size > 5 * 1024 * 1024) throw new Error('File too large');

        return {
            path: `cvs/${userId}/${file.name}`,
            fullPath: `cvs/${userId}/${file.name}`
        };
    },

    deleteCV: async (fileName: string): Promise<void> => {
        await MockApplicationService.sleep(500);
    }
};

export const submitApplication = async (data: JobApplicationInput) => {
    try {
        const result = await MockApplicationService.createApplication(data);
        return { data: result, error: null };
    } catch (e) {
        return { data: null, error: e };
    }
};

export const uploadCV = async (file: File, userId: string) => {
    try {
        const result = await MockApplicationService.uploadCV(file, userId);
        return { data: result, error: null };
    } catch (e) {
        return { data: null, error: e };
    }
};

export const deleteCV = MockApplicationService.deleteCV;

export const hasUserApplied = async (jobOfferId: string, userId: string) => {
    // Note: Parameter order might differ, check usage
    try {
        const applied = await MockApplicationService.hasUserApplied(userId, jobOfferId);
        return { hasApplied: applied, error: null };
    } catch (e) {
        return { hasApplied: false, error: e };
    }
};

export const getUserApplications = MockApplicationService.getUserApplications;
export const updateApplicationStatus = MockApplicationService.updateApplicationStatus;
export const withdrawApplication = MockApplicationService.withdrawApplication;
