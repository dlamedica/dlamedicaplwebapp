-- ============================================
-- TWORZENIE BRAKUJĄCYCH TABEL DLA DLAMEDICA
-- Data: 22 grudnia 2025
-- ============================================

-- Włącz rozszerzenie UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SCHEMATY
-- ============================================

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

-- ============================================
-- 1. TABELA auth.users (Autoryzacja)
-- ============================================

CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_password VARCHAR(255) NOT NULL,
    email_confirmed_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    role VARCHAR(50) DEFAULT 'authenticated',
    aud VARCHAR(50) DEFAULT 'authenticated',
    raw_user_meta_data JSONB DEFAULT '{}',
    is_sso_user BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMPTZ,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla auth.users
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_recovery_token ON auth.users(recovery_token) WHERE recovery_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_auth_users_deleted_at ON auth.users(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- 2. TABELA auth.sessions (Sesje)
-- ============================================

CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    aal VARCHAR(10) DEFAULT 'aal1', -- Authenticator Assurance Level
    factor_id UUID,
    not_after TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla auth.sessions
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth.sessions(user_id);

-- ============================================
-- 3. TABELA public.users (Profil użytkownika)
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    profession VARCHAR(100), -- lekarz, pielęgniarka, fizjoterapeuta, etc.
    specialization VARCHAR(100),
    experience_years INTEGER,
    license_number VARCHAR(100),
    account_type VARCHAR(50) DEFAULT 'individual', -- individual, company, university, institution
    company_name VARCHAR(255),
    company_nip VARCHAR(20),
    company_address TEXT,
    company_website VARCHAR(255),
    company_logo_url TEXT,
    company_description TEXT,
    company_size VARCHAR(50),
    city VARCHAR(100),
    voivodeship VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Polska',
    job_seeking BOOLEAN DEFAULT FALSE,
    available_for_locum BOOLEAN DEFAULT FALSE,
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla public.users
CREATE INDEX IF NOT EXISTS idx_public_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_public_users_profession ON public.users(profession);
CREATE INDEX IF NOT EXISTS idx_public_users_account_type ON public.users(account_type);
CREATE INDEX IF NOT EXISTS idx_public_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_public_users_job_seeking ON public.users(job_seeking) WHERE job_seeking = TRUE;

-- ============================================
-- 4. TABELA subjects (Przedmioty)
-- ============================================

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50) NOT NULL, -- preclinical, clinical, specialized
    difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    modules INTEGER DEFAULT 0,
    estimated_hours INTEGER DEFAULT 0,
    professions TEXT[], -- lekarz, pielęgniarka, fizjoterapeuta, etc.
    prerequisites TEXT[],
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla subjects
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category);
CREATE INDEX IF NOT EXISTS idx_subjects_is_active ON subjects(is_active) WHERE is_active = TRUE;

-- ============================================
-- 5. TABELA user_progress (Postęp w modułach)
-- ============================================

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    subject_id VARCHAR(50),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT FALSE,
    quiz_completed BOOLEAN DEFAULT FALSE,
    time_studied INTEGER DEFAULT 0, -- w minutach
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, module_id)
);

-- Indeksy dla user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject_id ON user_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(user_id, completed) WHERE completed = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON user_progress(last_accessed DESC NULLS LAST);

-- ============================================
-- 6. TABELA user_topic_progress (Postęp w tematach)
-- ============================================

CREATE TABLE IF NOT EXISTS user_topic_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    topic_id VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0, -- w minutach
    last_viewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, module_id, topic_id)
);

-- Indeksy dla user_topic_progress
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_module_id ON user_topic_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_topic_id ON user_topic_progress(topic_id);

-- ============================================
-- 7. TABELA quiz_attempts (Próby quizów)
-- ============================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id VARCHAR(100) NOT NULL,
    module_id VARCHAR(100),
    answers JSONB NOT NULL DEFAULT '[]',
    score DECIMAL(5,2) DEFAULT 0,
    max_score DECIMAL(5,2) DEFAULT 100,
    passed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0, -- w sekundach
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at DESC);

-- ============================================
-- 8. TABELA user_certificates (Certyfikaty)
-- ============================================

CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id VARCHAR(50),
    module_id VARCHAR(100),
    certificate_type VARCHAR(50) DEFAULT 'completion', -- completion, excellence, professional
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    pdf_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla user_certificates
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_verification_code ON user_certificates(verification_code);

-- ============================================
-- 9. TABELA content_views (Historia przeglądania)
-- ============================================

CREATE TABLE IF NOT EXISTS content_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id VARCHAR(100) NOT NULL,
    time_spent INTEGER DEFAULT 0, -- w minutach
    completed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla content_views
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user_content ON content_views(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_viewed_at ON content_views(viewed_at DESC);

-- ============================================
-- 10. TABELA user_notes (Notatki użytkowników)
-- ============================================

CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id VARCHAR(100) NOT NULL,
    note TEXT NOT NULL,
    highlight TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla user_notes
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_content_id ON user_notes(content_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);

-- ============================================
-- 11. TABELA companies (Firmy/Pracodawcy)
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    nip VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    voivodeship VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    size VARCHAR(50), -- 1-10, 11-50, 51-200, 201-500, 500+
    industry VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla companies
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active) WHERE is_active = TRUE;

-- ============================================
-- 12. TABELA job_offers (Oferty pracy)
-- ============================================

CREATE TABLE IF NOT EXISTS job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    profession VARCHAR(100), -- lekarz, pielęgniarka, fizjoterapeuta, etc.
    specialization VARCHAR(100),
    employment_type VARCHAR(50), -- full-time, part-time, contract, locum
    experience_level VARCHAR(50), -- junior, mid, senior
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'PLN',
    salary_period VARCHAR(20) DEFAULT 'month', -- hour, day, month, year
    location VARCHAR(255),
    city VARCHAR(100),
    voivodeship VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla job_offers
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON job_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_profession ON job_offers(profession);
CREATE INDEX IF NOT EXISTS idx_job_offers_city ON job_offers(city);
CREATE INDEX IF NOT EXISTS idx_job_offers_is_active ON job_offers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_job_offers_created_at ON job_offers(created_at DESC);

-- ============================================
-- 13. TABELA applications (Aplikacje na oferty)
-- ============================================

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, interview, accepted, rejected, withdrawn
    cover_letter TEXT,
    cv_url TEXT,
    notes TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(applicant_id, job_offer_id)
);

-- Indeksy dla applications
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_offer_id ON applications(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- ============================================
-- 14. TABELA user_favorites (Ulubione)
-- ============================================

CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_offer_id UUID REFERENCES job_offers(id) ON DELETE CASCADE,
    article_id VARCHAR(100),
    course_id VARCHAR(100),
    product_id VARCHAR(100),
    university_id VARCHAR(100),
    tool_id VARCHAR(100),
    favorite_type VARCHAR(50) NOT NULL, -- job_offer, article, course, product, university, tool
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, job_offer_id),
    UNIQUE(user_id, article_id),
    UNIQUE(user_id, course_id),
    UNIQUE(user_id, product_id)
);

-- Indeksy dla user_favorites
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_job_offer_id ON user_favorites(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_type ON user_favorites(favorite_type);

-- ============================================
-- 15. TABELA events (Wydarzenia)
-- ============================================

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- conference, webinar, workshop, training, meetup
    category VARCHAR(100),
    location VARCHAR(255),
    city VARCHAR(100),
    address TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    online_url TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'PLN',
    is_free BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla events
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active) WHERE is_active = TRUE;

-- ============================================
-- 16. TABELA event_participants (Uczestnicy wydarzeń)
-- ============================================

CREATE TABLE IF NOT EXISTS event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered', -- registered, confirmed, attended, cancelled, no_show
    payment_status VARCHAR(50) DEFAULT 'not_required', -- not_required, pending, paid, refunded
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    confirmation_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Indeksy dla event_participants
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_status ON event_participants(status);

-- ============================================
-- 17. TABELA user_points (Punkty i gamifikacja)
-- ============================================

CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    modules_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    certificates_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeksy dla user_points
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON user_points(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_level ON user_points(level DESC);

-- ============================================
-- FUNKCJE POMOCNICZE
-- ============================================

-- Funkcja aktualizująca updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERY dla updated_at
-- ============================================

-- auth.users
DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth.users;
CREATE TRIGGER update_auth_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- auth.sessions
DROP TRIGGER IF EXISTS update_auth_sessions_updated_at ON auth.sessions;
CREATE TRIGGER update_auth_sessions_updated_at
    BEFORE UPDATE ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- public.users
DROP TRIGGER IF EXISTS update_public_users_updated_at ON public.users;
CREATE TRIGGER update_public_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- subjects
DROP TRIGGER IF EXISTS update_subjects_updated_at ON subjects;
CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- user_progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- user_topic_progress
DROP TRIGGER IF EXISTS update_user_topic_progress_updated_at ON user_topic_progress;
CREATE TRIGGER update_user_topic_progress_updated_at
    BEFORE UPDATE ON user_topic_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- user_notes
DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
    BEFORE UPDATE ON user_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- job_offers
DROP TRIGGER IF EXISTS update_job_offers_updated_at ON job_offers;
CREATE TRIGGER update_job_offers_updated_at
    BEFORE UPDATE ON job_offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- applications
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- events
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- event_participants
DROP TRIGGER IF EXISTS update_event_participants_updated_at ON event_participants;
CREATE TRIGGER update_event_participants_updated_at
    BEFORE UPDATE ON event_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- user_points
DROP TRIGGER IF EXISTS update_user_points_updated_at ON user_points;
CREATE TRIGGER update_user_points_updated_at
    BEFORE UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRZYKŁADOWE DANE (OPCJONALNE)
-- ============================================

-- Wstaw przykładowe przedmioty
INSERT INTO subjects (id, name, description, icon, category, difficulty, modules, estimated_hours, professions, color)
VALUES 
    ('1', 'Anatomia', 'Budowa ciała ludzkiego - anatomia opisowa, czynnościowa i topograficzna', '🫀', 'preclinical', 'medium', 15, 120, ARRAY['lekarz', 'pielęgniarka', 'fizjoterapeuta', 'ratownik_medyczny'], '#e74c3c'),
    ('2', 'Fizjologia', 'Funkcjonowanie organizmów żywych - fizjologia ogólna, układów i wysiłku', '⚡', 'preclinical', 'hard', 12, 100, ARRAY['lekarz', 'pielęgniarka', 'fizjoterapeuta'], '#3498db'),
    ('3', 'Biochemia', 'Procesy chemiczne w organizmie - biochemia ogólna, kliniczna i żywienia', '🧪', 'preclinical', 'hard', 10, 80, ARRAY['lekarz', 'dietetyk', 'analityk_medyczny'], '#9b59b6'),
    ('5', 'Mikrobiologia', 'Drobnoustroje chorobotwórcze - bakterie, wirusy, grzyby i pasożyty', '🦠', 'preclinical', 'medium', 12, 90, ARRAY['lekarz', 'pielęgniarka', 'analityk_medyczny'], '#e67e22'),
    ('7', 'Farmakologia', 'Działanie leków na organizm - farmakologia ogólna i kliniczna', '💊', 'preclinical', 'hard', 16, 130, ARRAY['lekarz', 'farmaceuta', 'pielęgniarka'], '#2ecc71'),
    ('11', 'Kardiologia', 'Choroby serca i układu krążenia', '❤️', 'clinical', 'hard', 20, 150, ARRAY['lekarz', 'pielęgniarka_kardiologiczna'], '#e74c3c'),
    ('12', 'Pulmonologia', 'Choroby układu oddechowego', '🫁', 'clinical', 'hard', 15, 120, ARRAY['lekarz', 'fizjoterapeuta_oddechowy'], '#3498db'),
    ('101', 'EKG - Elektrokardiografia', 'Interpretacja zapisów EKG - od podstaw do zaawansowanych przypadków', '📈', 'specialized', 'medium', 8, 40, ARRAY['lekarz', 'pielęgniarka', 'ratownik_medyczny'], '#e74c3c'),
    ('102', 'Ultrasonografia', 'Badania USG - POCUS, brzucha, serca, położnicze', '🔊', 'specialized', 'hard', 15, 100, ARRAY['lekarz', 'sonografista'], '#3498db')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PODSUMOWANIE
-- ============================================

-- Wyświetl utworzone tabele
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('auth', 'public')
AND tablename IN (
    'users', 'sessions', 'subjects', 'user_progress', 'user_topic_progress',
    'quiz_attempts', 'user_certificates', 'content_views', 'user_notes',
    'companies', 'job_offers', 'applications', 'user_favorites',
    'events', 'event_participants', 'user_points'
)
ORDER BY schemaname, tablename;

-- ============================================
-- KONIEC SKRYPTU
-- ============================================
