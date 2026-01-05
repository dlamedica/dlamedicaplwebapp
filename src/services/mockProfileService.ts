import { UserProfile } from '../lib/apiClient'; // Assuming typical types, adapting as needed

// Mock Data Definitions
const MOCK_EDUCATION_OVERVIEW = {
    modulesCompleted: 14,
    modulesTotal: 25,
    studyTimeHours: 128,
    streakDays: 12,
    certificatesCount: 3,
    averageScore: 88,
};

const MOCK_CAREER_OVERVIEW = {
    savedOffersCount: 5,
    applicationsCount: 2,
    activeAlertsCount: 1,
    applications: [
        { id: '1', position_title: 'Młodszy Lekarz', applied_at: '2023-12-10', status: 'in_review' },
        { id: '2', position_title: 'Stażysta', applied_at: '2023-11-05', status: 'rejected' },
    ],
    savedOffers: [
        { id: '101', position_title: 'Rezydentura Kardiologia' },
        { id: '102', position_title: 'Lekarz POZ' },
    ],
    alerts: [
        { id: 'a1', specialization: 'Kardiologia', location: 'Warszawa', salary_range_from: 10000, salary_range_to: 15000, is_active: true },
    ]
};

const MOCK_EVENTS_OVERVIEW = {
    upcomingCount: 3,
    nextEvent: {
        id: 'e1',
        title: 'Webinar: Nowoczesna Kardiologia',
        date: '2023-12-28',
        type: 'online'
    },
    upcoming: [
        { id: 'e1', title: 'Webinar: Nowoczesna Kardiologia', date: '2023-12-28', type: 'online' },
        { id: 'e2', title: 'Warsztaty EKG', date: '2024-01-15', type: 'stacjonarne' },
    ],
    history: [
        { id: 'h1', title: 'Konferencja Internistyczna', date: '2023-10-10', status: 'attended' },
    ]
};

const MOCK_STORE_OVERVIEW = {
    lastOrderNumber: '#ORD-2023-889',
    downloadsAvailable: 2,
    orders: [
        { id: 'o1', order_number: '#ORD-2023-889', created_at: '2023-12-01', total_amount: '149.00 PLN', status: 'completed' },
        { id: 'o2', order_number: '#ORD-2023-750', created_at: '2023-11-15', total_amount: '49.00 PLN', status: 'completed' }
    ],
    downloads: [
        { product_id: 'p1', title: 'E-book: EKG w pigułce', download_url: '#' },
        { product_id: 'p2', title: 'Checklista: Badanie przedmiotowe', download_url: '#' }
    ]
};

const MOCK_FAVORITES_SUMMARY = {
    articles: 12,
    courses: 4,
    products: 7,
    universities: 2,
    jobOffers: 5,
    tools: 3
};

const MOCK_TOOLS_DATA = {
    pinned: [
        { tool_id: 't1', name: 'Kalkulator BMI', key: 'bmi' },
        { tool_id: 't2', name: 'Interakcje Leków', key: 'interactions' }
    ],
    recent: [
        { tool_id: 't1', name: 'Kalkulator BMI', key: 'bmi' },
        { tool_id: 't3', name: 'Skala Glasgow', key: 'gcs' },
        { tool_id: 't2', name: 'Interakcje Leków', key: 'interactions' }
    ]
};

const MOCK_ACCOUNT_DATA = (user: any) => ({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || 'Jan',
    lastName: user?.user_metadata?.full_name?.split(' ')[1] || 'Kowalski',
    email: user?.email || 'test@dlamedica.pl',
    profession: user?.user_metadata?.zawod || user?.user_metadata?.role || 'Lekarz',
    city: 'Warszawa',
    phone: '+48 123 456 789'
});

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockProfileService = {
    getOverview: async (user: any) => {
        await delay(600); // Simulate latency
        return {
            education: MOCK_EDUCATION_OVERVIEW,
            career: MOCK_CAREER_OVERVIEW,
            events: MOCK_EVENTS_OVERVIEW,
            store: MOCK_STORE_OVERVIEW,
            favorites: MOCK_FAVORITES_SUMMARY,
            tools: MOCK_TOOLS_DATA
        };
    },

    getCareer: async () => {
        await delay(500);
        return MOCK_CAREER_OVERVIEW;
    },

    getEvents: async () => {
        await delay(400);
        return MOCK_EVENTS_OVERVIEW;
    },

    getStore: async () => {
        await delay(450);
        return MOCK_STORE_OVERVIEW;
    },

    getFavorites: async () => {
        await delay(300);
        return MOCK_FAVORITES_SUMMARY;
    },

    getTools: async () => {
        await delay(350);
        return MOCK_TOOLS_DATA;
    },

    getAccount: async (user: any) => {
        await delay(300);
        return MOCK_ACCOUNT_DATA(user);
    },

    // For Student Dashboard
    getStudentProgress: async (userId: string) => {
        await delay(700);
        return {
            totalModules: 25,
            completedModules: 14,
            inProgressModules: 3,
            totalStudyTime: 128 * 60, // in minutes
            averageProgress: 65,
            recentQuizzes: [
                { id: 'q1', quizId: 'anat-1', score: 90, passed: true, completedAt: new Date().toISOString() }
            ]
        };
    },

    getStudentCertificates: async (userId: string) => {
        await delay(500);
        return {
            certificates: [
                { id: 'c1', subjectId: 's1', subjectName: 'Anatomia', moduleId: 'm1', certificateType: 'gold', earnedAt: '2023-11-20', verificationCode: 'CERT-123' },
                { id: 'c2', subjectId: 's2', subjectName: 'Kardiologia', moduleId: 'm2', certificateType: 'silver', earnedAt: '2023-12-05', verificationCode: 'CERT-456' },
                { id: 'c3', subjectId: 's3', subjectName: 'Farmakologia', moduleId: 'm3', certificateType: 'participation', earnedAt: '2023-12-15', verificationCode: 'CERT-789' }
            ]
        };
    }
};
