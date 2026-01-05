// Centralized Type Definitions

// User & Auth Types
export interface User {
    id: string;
    email?: string;
    aud?: string;
    role?: string;
    email_confirmed_at?: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    app_metadata?: {
        provider?: string;
        providers?: string[];
        [key: string]: any;
    };
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    };
    created_at: string;
    updated_at?: string;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: User | null;
}

export interface UserProfile {
    id: string;
    user_id: string;
    email?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    profession?: string;
    zawod?: string;
    specialization?: string;
    custom_profession?: string;
    city?: string;
    phone?: string;
    bio?: string;
    avatar_url?: string;
    profile_image_url?: string; // Alias dla avatar_url
    is_employer?: boolean;
    is_company?: boolean;
    role?: string;
    company_name?: string;
    company_website?: string;
    company_logo_url?: string;
    company_bio?: string;
    company_description?: string; // To samo co company_bio
    company_address?: string;
    company_nip?: string;
    company_industry?: string;
    company_size?: string;
    newsletter_consent?: boolean;
    created_at?: string;
    updated_at?: string;
    study_field?: string;
    country?: string;
}

// Job Offer Types
export interface JobOffer {
    id: string
    employer_id?: string
    title: string
    company_name: string
    description: string
    requirements: string
    benefits: string
    city: string
    is_remote: boolean
    medical_specialty: string
    contract_type: string
    job_type: string
    salary_min?: number
    salary_max?: number
    salary_currency: string
    salary_period: string
    experience_level?: string
    status: string
    expires_at?: string
    application_url?: string
    application_email?: string
    application_deadline?: string
    created_at: string
    updated_at: string
    featured: boolean
    is_urgent: boolean
    views_count: number
    // Frontend props
    position: string
    company: string
    location: string
    contractType: string
    category: string
    postedDate: string
    salary?: string
    salaryType?: string
    facilityType?: string
    employer_logo_url?: string
    logo?: string
    zamow_medyczny?: boolean
    experience: string
    timeAgo: string
    zawod_medyczny: string
}

export interface JobOfferInput {
    employer_id?: string
    title: string
    company_name: string
    description: string
    requirements: string
    benefits: string
    city: string
    voivodeship?: string
    address?: string
    is_remote: boolean
    hybrid_work?: boolean
    medical_category: string
    medical_specialty?: string
    specialization?: string
    facility_type?: string
    department?: string
    contract_type: string
    employment_type?: string
    shift_type?: string
    salary_min?: number
    salary_max?: number
    salary_currency: string
    salary_period: string
    salary_negotiable?: boolean
    experience_required?: string
    min_experience_years?: number
    languages_required?: string[]
    certifications_required?: string[]
    status: string
    expires_at?: string
    applications_deadline?: string
    start_date?: string
    slug?: string
    keywords?: string[]
    featured: boolean
    urgent?: boolean
}

// Event Types
export interface Event {
    id: string
    title: string
    description: string
    event_type: 'conference' | 'webinar' | 'training' | 'workshop' | 'seminar' | 'other'
    start_date: string
    end_date?: string
    location?: string
    online_url?: string
    is_online: boolean
    max_participants?: number
    current_participants?: number
    registration_url?: string
    price?: number
    currency?: string
    organizer?: string
    contact_email?: string
    image_url?: string
    status: 'pending' | 'approved' | 'rejected' | 'draft'
    created_at: string
    updated_at: string
}

export interface EventInput {
    title: string
    description: string
    type: 'conference' | 'webinar'
    date: string
    start_time: string
    end_time?: string
    location?: string
    online_url?: string
    is_online: boolean
    max_participants?: number
    registration_fee?: number
    is_free: boolean
    contact_email: string
    contact_phone?: string
    registration_deadline?: string
    target_audience: string[]
    speakers?: string
    program?: string
    certificates_available: boolean
    cme_points?: number
    organizer_id: string
    organizer_name: string
    organizer_type: 'company' | 'individual'
}

// Application Types
export interface JobApplication {
    id: string
    job_offer_id: string
    applicant_id: string
    candidate_name?: string
    candidate_email?: string
    candidate_phone?: string
    cover_letter?: string
    resume_url?: string
    cv_url?: string
    status: string
    applied_at: string
    updated_at: string
}

export interface JobApplicationInput {
    job_offer_id: string
    candidate_name: string
    candidate_email: string
    candidate_phone: string
    cover_letter?: string
    cv_url?: string
    resume_url?: string
}

export interface ApplicationWithJobOffer extends JobApplication {
    job_offers: {
        title: string
        company_name: string
        city: string
    }
}

// Favorite Types
export interface Favorite {
    id: string
    user_id: string
    job_offer_id: string
    created_at: string
}

export interface FavoriteWithJobOffer extends Favorite {
    job_offers: JobOffer
}
