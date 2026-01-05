
import { JobOffer } from '../types';

/**
 * Mock Job Service
 * Provides static mock data for job offers to replace local backend.
 */

// Mock Data
export const mockJobOffers: JobOffer[] = [
    {
        id: '1',
        employer_id: 'emp_001',
        title: 'Kardiolog - Prywatna Klinika',
        company_name: 'CardioMed Center',
        description: 'Poszukujemy doświadczonego kardiologa do naszego zespołu w nowoczesnej klinice w centrum Warszawy. Oferujemy pracę w przyjaznym zespole i dostęp do najnowszego sprzętu diagnostycznego.',
        requirements: 'Specjalizacja z kardiologii, min. 5 lat doświadczenia, znajomość języka angielskiego w stopniu komunikatywnym.',
        benefits: 'Atrakcyjne wynagrodzenie, prywatna opieka medyczna dla rodziny, dofinansowanie do szkoleń.',
        city: 'Warszawa',
        is_remote: false,
        medical_specialty: 'Kardiologia',
        contract_type: 'B2B',
        job_type: 'contract',
        salary_min: 25000,
        salary_max: 35000,
        salary_currency: 'PLN',
        salary_period: 'month',
        experience_level: 'Senior',
        status: 'approved',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        featured: true,
        is_urgent: false,
        views_count: 145,
        position: 'Kardiolog - Prywatna Klinika',
        company: 'CardioMed Center',
        location: 'Warszawa',
        contractType: 'contract',
        category: 'Kardiologia',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        salary: '25 000 - 35 000 PLN',
        salaryType: 'month',
        facilityType: 'Private Clinic',
        logo: 'https://via.placeholder.com/100?text=CMC',
        employer_logo_url: 'https://via.placeholder.com/100?text=CMC',
        zamow_medyczny: true,
        experience: 'Senior',
        timeAgo: '2 dni temu',
        zawod_medyczny: 'Lekarz'
    },
    {
        id: '2',
        employer_id: 'emp_002',
        title: 'Pediatra w POZ',
        company_name: 'Przychodnia Rodzinna "Zdrowie"',
        description: 'Zatrudnimy lekarza pediatrę do pracy w Podstawowej Opiece Zdrowotnej. Elastyczne godziny pracy, możliwość częściowego etatu.',
        requirements: 'Specjalizacja z pediatrii lub w trakcie (ostatnie lata), empatia i dobre podejście do małych pacjentów.',
        benefits: 'Elastyczny grafik, karta Multisport, ubezpieczenie grupowe.',
        city: 'Kraków',
        is_remote: false,
        medical_specialty: 'Pediatria',
        contract_type: 'Umowa o pracę',
        job_type: 'full_time',
        salary_min: 12000,
        salary_max: 18000,
        salary_currency: 'PLN',
        salary_period: 'month',
        experience_level: 'Mid',
        status: 'approved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        featured: false,
        is_urgent: true,
        views_count: 89,
        position: 'Pediatra w POZ',
        company: 'Przychodnia Rodzinna "Zdrowie"',
        location: 'Kraków',
        contractType: 'full_time',
        category: 'Pediatria',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        salary: '12 000 - 18 000 PLN',
        salaryType: 'month',
        facilityType: 'Clinic',
        logo: 'https://via.placeholder.com/100?text=PRZ',
        employer_logo_url: 'https://via.placeholder.com/100?text=PRZ',
        zamow_medyczny: true,
        experience: 'Mid',
        timeAgo: '5 dni temu',
        zawod_medyczny: 'Lekarz'
    },
    {
        id: '3',
        employer_id: 'emp_003',
        title: 'Anestezjolog - Dyżury',
        company_name: 'Szpital Miejski nr 4',
        description: 'Szpital Miejski poszukuje lekarzy anestezjologów do pełnienia dyżurów kontraktowych na OIT oraz bloku operacyjnym.',
        requirements: 'Specjalizacja z anestezjologii i intensywnej terapii, aktualne prawo wykonywania zawodu.',
        benefits: 'Wysoka stawka godzinowa, nowoczesny sprzęt, możliwość rozwoju naukowego.',
        city: 'Poznań',
        is_remote: false,
        medical_specialty: 'Anestezjologia',
        contract_type: 'Kontrakt',
        job_type: 'contract',
        salary_min: 150,
        salary_max: 200,
        salary_currency: 'PLN',
        salary_period: 'hour',
        experience_level: 'Senior',
        status: 'approved',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        featured: false,
        is_urgent: false,
        views_count: 210,
        position: 'Anestezjolog - Dyżury',
        company: 'Szpital Miejski nr 4',
        location: 'Poznań',
        contractType: 'contract',
        category: 'Anestezjologia',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        salary: '150 - 200 PLN/h',
        salaryType: 'hour',
        facilityType: 'Hospital',
        logo: 'https://via.placeholder.com/100?text=SM4',
        employer_logo_url: 'https://via.placeholder.com/100?text=SM4',
        zamow_medyczny: true,
        experience: 'Senior',
        timeAgo: '1 dzień temu',
        zawod_medyczny: 'Lekarz'
    },
    {
        id: '4',
        employer_id: 'emp_004',
        title: 'Dermatolog - Konsultacje online',
        company_name: 'TeleMed Poland',
        description: 'Dołącz do dynamicznie rozwijającej się platformy telemedycznej. Oferujemy pracę w pełni zdalną przy konsultacjach dermatologicznych.',
        requirements: 'Specjalizacja z dermatologii, dobra obsługa komputera, umiejętność pracy zdalnej.',
        benefits: 'Praca 100% zdalna, elastyczny grafik, system premiowy.',
        city: 'Cała Polska',
        is_remote: true,
        medical_specialty: 'Dermatologia',
        contract_type: 'B2B / UZ',
        job_type: 'part_time',
        salary_min: 8000,
        salary_max: 15000,
        salary_currency: 'PLN',
        salary_period: 'month',
        experience_level: 'Mid',
        status: 'approved',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        featured: true,
        is_urgent: false,
        views_count: 350,
        position: 'Dermatolog - Konsultacje online',
        company: 'TeleMed Poland',
        location: 'Zdalnie',
        contractType: 'part_time',
        category: 'Dermatologia',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        salary: '8 000 - 15 000 PLN',
        salaryType: 'month',
        facilityType: 'Telemedicine',
        logo: 'https://via.placeholder.com/100?text=TMP',
        employer_logo_url: 'https://via.placeholder.com/100?text=TMP',
        zamow_medyczny: true,
        experience: 'Mid',
        timeAgo: '3 dni temu',
        zawod_medyczny: 'Lekarz'
    },
    {
        id: '5',
        employer_id: 'emp_005',
        title: 'Rezydent - Okulistyka',
        company_name: 'Klinika Oczna "Widok"',
        description: 'Prywatna klinika okulistyczna nawiąże współpracę z lekarzem w trakcie specjalizacji z okulistyki. Oferujemy wsparcie merytoryczne i możliwość wykonywania zabiegów.',
        requirements: 'Rozpoczęta specjalizacja z okulistyki, chęć nauki i rozwoju.',
        benefits: 'Dofinansowanie do zjazdów i konferencji, premie od zabiegów.',
        city: 'Gdańsk',
        is_remote: false,
        medical_specialty: 'Okulistyka',
        contract_type: 'Umowa o pracę',
        job_type: 'full_time',
        salary_min: 8000,
        salary_max: 10000,
        salary_currency: 'PLN',
        salary_period: 'month',
        experience_level: 'Junior',
        status: 'approved',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        featured: false,
        is_urgent: true,
        views_count: 112,
        position: 'Rezydent - Okulistyka',
        company: 'Klinika Oczna "Widok"',
        location: 'Gdańsk',
        contractType: 'full_time',
        category: 'Okulistyka',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        salary: '8 000 - 10 000 PLN',
        salaryType: 'month',
        facilityType: 'Private Clinic',
        logo: 'https://via.placeholder.com/100?text=KOW',
        employer_logo_url: 'https://via.placeholder.com/100?text=KOW',
        zamow_medyczny: true,
        experience: 'Junior',
        timeAgo: '4 dni temu',
        zawod_medyczny: 'Lekarz'
    }
];

export const MockJobService = {
    // Simulate network delay
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    getJobOffers: async (filters?: any): Promise<JobOffer[]> => {
        await MockJobService.sleep(500);
        let filtered = [...mockJobOffers];

        // Simple filter logic
        if (filters) {
            if (filters.category) {
                filtered = filtered.filter(job => job.medical_specialty === filters.category);
            }
            if (filters.city) {
                filtered = filtered.filter(job => job.city === filters.city);
            }
        }

        return filtered;
    },

    getJobOffer: async (id: string): Promise<JobOffer | null> => {
        await MockJobService.sleep(300);
        const offer = mockJobOffers.find(o => o.id === id);
        return offer || null;
    },

    // In the current setup, getJobOfferBySlug often receives an ID or a slug.
    // Our backend logic tries to match ID.
    // In the current setup, getJobOfferBySlug often receives an ID or a slug.
    // Our backend logic tries to match ID.
    getJobOfferBySlug: async (slug: string): Promise<JobOffer | null> => {
        await MockJobService.sleep(300);
        const offer = mockJobOffers.find(o => o.id === slug);
        return offer || null;
    },

    createJobOffer: async (jobData: Partial<JobOffer>): Promise<JobOffer> => {
        await MockJobService.sleep(600);
        const newOffer: JobOffer = {
            ...mockJobOffers[0], // Base on existing structure
            ...jobData,
            id: Math.random().toString(36).substring(7),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as unknown as JobOffer;

        mockJobOffers.unshift(newOffer);
        return newOffer;
    },

    updateJobOffer: async (id: string, jobData: Partial<JobOffer>): Promise<JobOffer> => {
        await MockJobService.sleep(400);
        const index = mockJobOffers.findIndex(o => o.id === id);
        if (index === -1) throw new Error('Job not found');

        const updated = { ...mockJobOffers[index], ...jobData, updated_at: new Date().toISOString() } as unknown as JobOffer;
        mockJobOffers[index] = updated;
        return updated;
    },

    deleteJobOffer: async (id: string): Promise<void> => {
        await MockJobService.sleep(400);
        const index = mockJobOffers.findIndex(o => o.id === id);
        if (index !== -1) {
            mockJobOffers.splice(index, 1);
        }
    }
};

export const getJobOffers = MockJobService.getJobOffers;
export const getJobOffer = MockJobService.getJobOffer;
export const getJobOfferBySlug = MockJobService.getJobOfferBySlug;
export const createJobOffer = MockJobService.createJobOffer;
export const updateJobOffer = MockJobService.updateJobOffer;
export const deleteJobOffer = MockJobService.deleteJobOffer;
export const generateSlug = (position: string, location: string) => {
    return `${position}-${location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
