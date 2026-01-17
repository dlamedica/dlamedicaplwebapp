-- ============================================
-- DlaMedica - Schemat bazy danych dla leadów
-- ROZSZERZONY o typy placówek medycznych
-- ============================================

-- Typy placówek medycznych (ENUM)
DO $$ BEGIN
    CREATE TYPE facility_type_enum AS ENUM (
        'szpital',
        'klinika',
        'przychodnia',
        'apteka/farmacja',
        'laboratorium',
        'gabinet stomatologiczny',
        'centrum rehabilitacji',
        'gabinet lekarski',
        'centrum medyczne',
        'hospicjum',
        'sanatorium/uzdrowisko',
        'dom opieki',
        'ratownictwo medyczne',
        'opieka pielęgniarska',
        'zdrowie psychiczne',
        'krwiodawstwo',
        'medycyna pracy',
        'służby mundurowe',
        'instytut medyczny',
        'weterynaria',
        'sieć medyczna',
        'placówka medyczna'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela główna leadów (ROZSZERZONA)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phones TEXT,
    websites TEXT,
    company_name VARCHAR(255),
    person_name VARCHAR(255),
    title VARCHAR(255),

    -- Źródło i typ placówki
    source VARCHAR(100) DEFAULT 'manual',
    source_query TEXT,  -- Zapytanie które znalazło lead
    facility_type VARCHAR(100) DEFAULT 'placówka medyczna',

    -- Status i śledzenie
    status VARCHAR(50) DEFAULT 'new',
    -- new, contacted, replied, interested, converted, unsubscribed, bounced

    -- Email tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    email_subject TEXT,  -- Temat wysłanego emaila
    followup_count INTEGER DEFAULT 0,
    last_followup_at TIMESTAMP,

    -- Odpowiedzi
    replied BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP,
    reply_sentiment VARCHAR(20),
    -- positive, neutral, negative
    reply_content TEXT,

    -- Konwersja
    converted_at TIMESTAMP,
    conversion_source VARCHAR(100),

    -- Wypisanie
    unsubscribed_at TIMESTAMP,

    -- Metadane
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    tags TEXT[],

    -- Dane dodatkowe z personalizacji
    personalization_data JSONB
);

-- Tabela leadów LinkedIn (oddzielna dla lepszej organizacji)
CREATE TABLE IF NOT EXISTS linkedin_leads (
    id SERIAL PRIMARY KEY,
    person_name VARCHAR(255),
    title VARCHAR(255),
    company_name VARCHAR(255),
    linkedin_url VARCHAR(500) UNIQUE,
    estimated_email VARCHAR(255),
    verified_email VARCHAR(255),
    facility_type VARCHAR(100),
    source VARCHAR(100) DEFAULT 'linkedin',
    status VARCHAR(50) DEFAULT 'linkedin_lead',
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
);

-- Tabela historii emaili
CREATE TABLE IF NOT EXISTS email_history (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    -- initial, followup_1, followup_2, followup_3, custom
    subject VARCHAR(500),
    body_preview TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMP,
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP,
    bounced BOOLEAN DEFAULT FALSE,
    bounce_reason TEXT,
    personalization_used JSONB
);

-- Tabela konwersji
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    email VARCHAR(255),
    company_name VARCHAR(255),
    facility_type VARCHAR(100),
    conversion_type VARCHAR(50),
    -- registration, first_job_post, premium_upgrade
    source VARCHAR(100),
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revenue DECIMAL(10, 2) DEFAULT 0,
    notes TEXT
);

-- Tabela kampanii
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    -- draft, active, paused, completed
    target_facility_types TEXT[],  -- Które typy placówek targetujemy
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    target_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settings JSONB
);

-- Tabela statystyk dziennych (dla szybszych raportów)
CREATE TABLE IF NOT EXISTS daily_stats (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    new_leads INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    positive_replies INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    unsubscribes INTEGER DEFAULT 0,
    by_facility_type JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent ON leads(email_sent);
CREATE INDEX IF NOT EXISTS idx_leads_replied ON leads(replied);
CREATE INDEX IF NOT EXISTS idx_leads_found_at ON leads(found_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_facility_type ON leads(facility_type);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent_at ON leads(email_sent_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_processed ON linkedin_leads(processed);
CREATE INDEX IF NOT EXISTS idx_email_history_lead_id ON email_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_history_sent_at ON email_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_conversions_lead_id ON conversions(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);

-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger dla automatycznej aktualizacji
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Funkcja do aktualizacji dziennych statystyk
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS void AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    facility_stats JSONB;
BEGIN
    -- Oblicz statystyki według typu placówki
    SELECT jsonb_object_agg(facility_type, cnt)
    INTO facility_stats
    FROM (
        SELECT facility_type, COUNT(*) as cnt
        FROM leads
        WHERE DATE(found_at) = today_date
        GROUP BY facility_type
    ) sub;

    INSERT INTO daily_stats (date, new_leads, emails_sent, replies, positive_replies, conversions, unsubscribes, by_facility_type)
    SELECT
        today_date,
        COUNT(*) FILTER (WHERE DATE(found_at) = today_date),
        COUNT(*) FILTER (WHERE email_sent = true AND DATE(email_sent_at) = today_date),
        COUNT(*) FILTER (WHERE replied = true AND DATE(replied_at) = today_date),
        COUNT(*) FILTER (WHERE reply_sentiment = 'positive' AND DATE(replied_at) = today_date),
        COUNT(*) FILTER (WHERE status = 'converted' AND DATE(converted_at) = today_date),
        COUNT(*) FILTER (WHERE status = 'unsubscribed' AND DATE(unsubscribed_at) = today_date),
        COALESCE(facility_stats, '{}'::jsonb)
    FROM leads
    ON CONFLICT (date) DO UPDATE SET
        new_leads = EXCLUDED.new_leads,
        emails_sent = EXCLUDED.emails_sent,
        replies = EXCLUDED.replies,
        positive_replies = EXCLUDED.positive_replies,
        conversions = EXCLUDED.conversions,
        unsubscribes = EXCLUDED.unsubscribes,
        by_facility_type = EXCLUDED.by_facility_type;
END;
$$ LANGUAGE plpgsql;

-- Widok statystyk według typu placówki
CREATE OR REPLACE VIEW lead_stats_by_facility AS
SELECT
    facility_type,
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
    COUNT(*) FILTER (WHERE replied = true) as replies,
    COUNT(*) FILTER (WHERE reply_sentiment = 'positive') as positive_replies,
    COUNT(*) FILTER (WHERE status = 'converted') as conversions,
    ROUND(
        COUNT(*) FILTER (WHERE replied = true)::numeric /
        NULLIF(COUNT(*) FILTER (WHERE email_sent = true), 0) * 100,
        2
    ) as reply_rate,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'converted')::numeric /
        NULLIF(COUNT(*) FILTER (WHERE email_sent = true), 0) * 100,
        2
    ) as conversion_rate
FROM leads
GROUP BY facility_type
ORDER BY total_leads DESC;

-- Widok statystyk dziennych
CREATE OR REPLACE VIEW lead_statistics AS
SELECT
    DATE_TRUNC('day', found_at) as date,
    COUNT(*) as new_leads,
    COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
    COUNT(*) FILTER (WHERE replied = true) as replies,
    COUNT(*) FILTER (WHERE status = 'converted') as conversions,
    COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribes,
    ROUND(
        COUNT(*) FILTER (WHERE replied = true)::numeric /
        NULLIF(COUNT(*) FILTER (WHERE email_sent = true), 0) * 100,
        2
    ) as reply_rate,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'converted')::numeric /
        NULLIF(COUNT(*) FILTER (WHERE email_sent = true), 0) * 100,
        2
    ) as conversion_rate
FROM leads
GROUP BY DATE_TRUNC('day', found_at)
ORDER BY date DESC;

-- Widok leadów do kontaktu
CREATE OR REPLACE VIEW leads_to_contact AS
SELECT *
FROM leads
WHERE status IN ('new', 'interested')
  AND email_sent = false
  AND (status != 'unsubscribed')
ORDER BY
    CASE
        WHEN reply_sentiment = 'positive' THEN 1
        WHEN status = 'interested' THEN 2
        ELSE 3
    END,
    found_at ASC;

-- Widok do follow-up
CREATE OR REPLACE VIEW leads_for_followup AS
SELECT *
FROM leads
WHERE status = 'contacted'
  AND replied = false
  AND followup_count < 3
  AND email_sent_at < NOW() - INTERVAL '3 days'
ORDER BY email_sent_at ASC;

-- Widok hot leadów (pozytywne odpowiedzi)
CREATE OR REPLACE VIEW hot_leads AS
SELECT *
FROM leads
WHERE reply_sentiment = 'positive'
  AND status NOT IN ('converted', 'unsubscribed')
ORDER BY replied_at DESC;

-- Widok podsumowania tygodniowego
CREATE OR REPLACE VIEW weekly_summary AS
SELECT
    DATE_TRUNC('week', found_at) as week_start,
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
    COUNT(*) FILTER (WHERE replied = true) as total_replies,
    COUNT(*) FILTER (WHERE reply_sentiment = 'positive') as positive_replies,
    COUNT(*) FILTER (WHERE status = 'converted') as conversions,
    array_agg(DISTINCT facility_type) as facility_types_contacted
FROM leads
WHERE found_at >= NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', found_at)
ORDER BY week_start DESC;

-- Przykładowe dane testowe (opcjonalne - odkomentuj jeśli potrzebujesz)
/*
INSERT INTO leads (email, company_name, facility_type, source) VALUES
('rekrutacja@szpital-test.pl', 'Szpital Testowy', 'szpital', 'manual'),
('hr@klinika-przyklad.pl', 'Klinika Przykładowa', 'klinika', 'google_search'),
('praca@przychodnia-demo.pl', 'Przychodnia Demo', 'przychodnia', 'google_search'),
('kontakt@apteka-test.pl', 'Apteka Testowa', 'apteka/farmacja', 'google_search'),
('lab@diagnostyka-test.pl', 'Laboratorium Testowe', 'laboratorium', 'google_search');
*/

-- Komentarz: Uruchom ten plik za pomocą:
-- psql -U your_user -d your_database -f database-schema.sql
