
/**
 * Mock Education Service
 * Replaces hardcoded data in EducationDashboard.tsx
 */

export interface EducationSubject {
    id: string;
    name: string;
    description: string;
    iconName: string; // Changed from component to string for serializable mock data
    modules: number;
    estimatedHours: number;
    difficulty: 'easy' | 'medium' | 'hard';
    progress: number;
    isEnrolled: boolean;
    color: string;
    professions: string[];
    categories: string[];
    prerequisites: string[];
    isFavorite: boolean;
    href?: string;
    isRecommended?: boolean;
}

export interface DashboardStats {
    totalModules: number;
    completedModules: number;
    studyTimeThisWeek: number;
    currentStreak: number;
}

export interface ActivityItem {
    id: number;
    type: string;
    title: string;
    time: string;
    progress?: number;
    score?: number;
}

const mockSubjectsRaw = {
    preclinical: [
        { id: '1', name: 'Anatomia', description: 'Budowa ciała ludzkiego w szczegółach.', iconName: 'AnatomyIcon', modules: 15, estimatedHours: 120, difficulty: 'medium', progress: 45, isEnrolled: true, color: '#e74c3c', professions: ['Lekarz', 'Fizjoterapeuta'], categories: ['Podstawowy'], prerequisites: [], isFavorite: true },
        { id: '2', name: 'Fizjologia', description: 'Funkcjonowanie organizmu człowieka.', iconName: 'PhysiologyIcon', modules: 12, estimatedHours: 100, difficulty: 'hard', progress: 20, isEnrolled: true, color: '#3498db', professions: ['Lekarz', 'Pielęgniarka'], categories: ['Podstawowy'], prerequisites: ['Anatomia'], isFavorite: true },
        { id: '3', name: 'Biochemia', description: 'Chemiczne aspekty życia.', iconName: 'BiochemistryIcon', modules: 10, estimatedHours: 80, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#9b59b6', professions: ['Lekarz', 'Diagnosta'], categories: ['Podstawowy'], prerequisites: [], isFavorite: false },
        { id: '4', name: 'Biofizyka', description: 'Fizyczne podstawy procesów życiowych.', iconName: 'BiophysicsIcon', modules: 8, estimatedHours: 60, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#1abc9c', professions: ['Lekarz'], categories: ['Podstawowy'], prerequisites: [], isFavorite: false },
        { id: '5', name: 'Mikrobiologia', description: 'Świat drobnoustrojów i wirusów.', iconName: 'MicrobiologyIcon', modules: 12, estimatedHours: 90, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#e67e22', professions: ['Lekarz', 'Diagnosta'], categories: ['Podstawowy'], prerequisites: [], isFavorite: false }
    ],
    clinical: [
        { id: '11', name: 'Kardiologia', description: 'Choroby serca i układu krążenia.', iconName: 'CardiologyIcon', modules: 20, estimatedHours: 150, difficulty: 'hard', progress: 15, isEnrolled: true, color: '#e74c3c', professions: ['Lekarz'], categories: ['Kliniczny'], prerequisites: ['Anatomia', 'Fizjologia'], isFavorite: true },
        { id: '12', name: 'Pulmonologia', description: 'Choroby płuc i układu oddechowego.', iconName: 'PulmonologyIcon', modules: 15, estimatedHours: 120, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#3498db', professions: ['Lekarz'], categories: ['Kliniczny'], prerequisites: [], isFavorite: false },
        { id: '13', name: 'Gastroenterologia', description: 'Choroby układu pokarmowego.', iconName: 'GastroenterologyIcon', modules: 18, estimatedHours: 140, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#f39c12', professions: ['Lekarz'], categories: ['Kliniczny'], prerequisites: [], isFavorite: false },
        { id: '14', name: 'Nefrologia', description: 'Choroby nerek i dróg moczowych.', iconName: 'NephrologyIcon', modules: 12, estimatedHours: 100, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#9b59b6', professions: ['Lekarz'], categories: ['Kliniczny'], prerequisites: [], isFavorite: false },
        { id: '15', name: 'Endokrynologia', description: 'Zaburzenia hormonalne.', iconName: 'EndocrinologyIcon', modules: 14, estimatedHours: 110, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#1abc9c', professions: ['Lekarz'], categories: ['Kliniczny'], prerequisites: [], isFavorite: false }
    ],
    specialized: [
        { id: '101', name: 'EKG - Elektrokardiografia', description: 'Interpretacja zapisu EKG w praktyce.', iconName: 'EKGIcon', modules: 8, estimatedHours: 40, difficulty: 'medium', progress: 60, isEnrolled: true, color: '#e74c3c', professions: ['Lekarz', 'Ratownik'], categories: ['Diagnostyka'], prerequisites: ['Kardiologia'], isFavorite: true },
        { id: '102', name: 'Ultrasonografia', description: 'Podstawy badania USG.', iconName: 'UltrasoundIcon', modules: 15, estimatedHours: 100, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#3498db', professions: ['Lekarz'], categories: ['Diagnostyka'], prerequisites: ['Anatomia'], isFavorite: false },
        { id: '103', name: 'Radiologia', description: 'Diagnostyka obrazowa RTG i TK.', iconName: 'RadiologyIcon', modules: 20, estimatedHours: 120, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#34495e', professions: ['Lekarz', 'Technik'], categories: ['Diagnostyka'], prerequisites: [], isFavorite: false },
        { id: '104', name: 'Odgłosy medyczne', description: 'Osłuchiwanie serca i płuc.', iconName: 'MedicalSoundsIcon', modules: 5, estimatedHours: 20, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#3498db', href: '/edukacja/odglosy-medyczne', isRecommended: true, professions: ['Lekarz', 'Ratownik'], categories: ['Praktyka'], prerequisites: [], isFavorite: false },
        { id: '105', name: 'Dermatologia Estetyczna', description: 'Podstawy zabiegów estetycznych.', iconName: 'ProfessionsIcon', modules: 10, estimatedHours: 50, difficulty: 'medium', progress: 0, isEnrolled: false, color: '#e056fd', professions: ['Lekarz'], categories: ['Specjalistyczny'], prerequisites: [], isFavorite: false },
        { id: '106', name: 'Psychiatria Dziecięca', description: 'Zaburzenia rozwojowe u dzieci.', iconName: 'ProfessionsIcon', modules: 12, estimatedHours: 60, difficulty: 'hard', progress: 0, isEnrolled: false, color: '#2ecc71', professions: ['Lekarz', 'Psycholog'], categories: ['Specjalistyczny'], prerequisites: [], isFavorite: false }
    ]
};

export const MockEducationService = {
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    getDashboardStats: async (): Promise<DashboardStats> => {
        await MockEducationService.sleep(500);
        return {
            totalModules: 25,
            completedModules: 8,
            studyTimeThisWeek: 240, // minutes
            currentStreak: 5
        };
    },

    getRecentActivity: async (): Promise<ActivityItem[]> => {
        await MockEducationService.sleep(600);
        return [
            {
                id: 1,
                type: 'module_completed',
                title: 'Anatomia Układu Krążenia',
                time: '2 godziny temu',
                progress: 100
            },
            {
                id: 2,
                type: 'quiz_passed',
                title: 'Test z kardiologii',
                time: '1 dzień temu',
                score: 85
            },
            {
                id: 3,
                type: 'module_started',
                title: 'Podstawy EKG',
                time: '3 dni temu',
                progress: 25
            }
        ];
    },

    getSubjects: async (): Promise<any> => {
        await MockEducationService.sleep(800);
        return mockSubjectsRaw;
    },

    getModules: async (subjectId: string): Promise<any[]> => {
        await MockEducationService.sleep(600);
        // Return duplicate dummy modules for testing
        return Array.from({ length: 5 }).map((_, i) => ({
            id: `module-${subjectId}-${i}`,
            subjectId,
            title: `Moduł ${i + 1}: Wprowadzenie do tematu`,
            slug: `modul-${i + 1}`,
            description: 'Krótki opis modułu i tego czego się nauczysz.',
            durationMinutes: 45,
            orderIndex: i,
            isFree: i === 0,
            isCompleted: i < 2
        }));
    },

    saveProgress: async (moduleId: string, progress: any): Promise<void> => {
        await MockEducationService.sleep(300);
        console.log(`[Mock] Progress saved for module ${moduleId}:`, progress);
    }
};
