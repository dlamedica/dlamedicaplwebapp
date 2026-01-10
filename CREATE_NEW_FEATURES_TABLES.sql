-- ============================================
-- NOWE FUNKCJE - TABELE DO UTWORZENIA
-- Data: 2026-01-10
-- ============================================

-- ============================================
-- 1. PREFERENCJE UŻYTKOWNIKA (Dark Mode Sync)
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT false,
    high_contrast BOOLEAN DEFAULT false,
    font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    language VARCHAR(5) DEFAULT 'pl',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================
-- 2. CME - PUNKTY EDUKACYJNE
-- ============================================

-- Wymagania CME per profesja
CREATE TABLE IF NOT EXISTS cme_requirements (
    id SERIAL PRIMARY KEY,
    profession VARCHAR(50) NOT NULL UNIQUE,
    points_required INTEGER NOT NULL DEFAULT 200,
    period_years INTEGER NOT NULL DEFAULT 4,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktywności CME
CREATE TABLE IF NOT EXISTS cme_activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL, -- 'conference', 'course', 'webinar', 'publication', 'teaching'
    points DECIMAL(5,2) NOT NULL,
    duration_minutes INTEGER,
    provider VARCHAR(255),
    accreditation_number VARCHAR(100),
    category VARCHAR(100),
    specializations TEXT[], -- array of specializations
    valid_from DATE,
    valid_until DATE,
    max_participants INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cme_activities_type ON cme_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_cme_activities_category ON cme_activities(category);
CREATE INDEX IF NOT EXISTS idx_cme_activities_valid ON cme_activities(valid_until) WHERE is_active = true;

-- Postępy użytkowników w CME
CREATE TABLE IF NOT EXISTS user_cme_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES cme_activities(id) ON DELETE SET NULL,
    points_earned DECIMAL(5,2) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_url VARCHAR(500),
    notes TEXT,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by INTEGER REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_cme_progress_user ON user_cme_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cme_progress_completed ON user_cme_progress(completed_at);

-- Seed CME requirements
INSERT INTO cme_requirements (profession, points_required, period_years, description) VALUES
('lekarz', 200, 4, 'Lekarz - wymóg ustawowy 200 punktów na 4 lata'),
('lekarz_dentysta', 200, 4, 'Lekarz dentysta - wymóg 200 punktów na 4 lata'),
('pielegniarka', 200, 5, 'Pielęgniarka - wymóg 200 punktów na 5 lat'),
('polozna', 200, 5, 'Położna - wymóg 200 punktów na 5 lat'),
('farmaceuta', 100, 5, 'Farmaceuta - wymóg 100 punktów na 5 lat'),
('diagnosta', 100, 5, 'Diagnosta laboratoryjny - wymóg 100 punktów na 5 lat')
ON CONFLICT (profession) DO NOTHING;

-- ============================================
-- 3. TŁUMACZENIA ARTYKUŁÓW
-- ============================================
CREATE TABLE IF NOT EXISTS article_translations (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'uk', 'de')),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    translated_by VARCHAR(50) DEFAULT 'deepseek', -- 'deepseek', 'manual', 'google'
    quality_score DECIMAL(3,2), -- 0.00 - 1.00
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, language)
);

CREATE INDEX IF NOT EXISTS idx_article_translations_article ON article_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_article_translations_language ON article_translations(language);
CREATE INDEX IF NOT EXISTS idx_article_translations_status ON article_translations(status);

-- ============================================
-- 4. FEEDBACK SYSTEM (jeśli nie istnieje)
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('error', 'suggestion', 'contact')),
    title VARCHAR(255),
    message TEXT NOT NULL,
    url VARCHAR(500),
    browser_info JSONB,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to INTEGER REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- ============================================
-- 5. PUSH NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint VARCHAR(1000) NOT NULL UNIQUE,
    keys_p256dh VARCHAR(255),
    keys_auth VARCHAR(255),
    topics TEXT[] DEFAULT ARRAY['general'],
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- ============================================
-- GRANT PERMISSIONS (jeśli używasz ról)
-- ============================================
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO dlamedica_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dlamedica_app;

-- ============================================
-- KOMENTARZE
-- ============================================
COMMENT ON TABLE user_preferences IS 'Preferencje użytkownika (dark mode, język, powiadomienia)';
COMMENT ON TABLE cme_requirements IS 'Wymagania punktów CME dla różnych profesji medycznych';
COMMENT ON TABLE cme_activities IS 'Katalog aktywności edukacyjnych (konferencje, kursy, webinary)';
COMMENT ON TABLE user_cme_progress IS 'Śledzenie postępu CME użytkowników';
COMMENT ON TABLE article_translations IS 'Tłumaczenia artykułów na inne języki';
COMMENT ON TABLE feedback IS 'System zgłaszania błędów i sugestii';
COMMENT ON TABLE push_subscriptions IS 'Subskrypcje Web Push dla powiadomień server-side';
