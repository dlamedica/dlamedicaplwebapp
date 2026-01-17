-- ============================================
-- DlaMedica - Schemat bazy danych dla leadów
-- ============================================

-- Tabela główna leadów
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phones TEXT,
    websites TEXT,
    company_name VARCHAR(255),
    person_name VARCHAR(255),
    title VARCHAR(255),
    source VARCHAR(100) DEFAULT 'manual',

    -- Status i śledzenie
    status VARCHAR(50) DEFAULT 'new',
    -- new, contacted, replied, interested, converted, unsubscribed, bounced

    -- Email tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    followup_count INTEGER DEFAULT 0,
    last_followup_at TIMESTAMP,

    -- Odpowiedzi
    replied BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP,
    reply_sentiment VARCHAR(20),
    -- positive, neutral, negative

    -- Konwersja
    converted_at TIMESTAMP,
    conversion_source VARCHAR(100),

    -- Wypisanie
    unsubscribed_at TIMESTAMP,

    -- Metadane
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    tags TEXT[]
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
    source VARCHAR(100) DEFAULT 'linkedin',
    status VARCHAR(50) DEFAULT 'linkedin_lead',
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
);

-- Tabela historii emaili
CREATE TABLE IF NOT EXISTS email_history (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    email_type VARCHAR(50) NOT NULL,
    -- initial, followup_1, followup_2, followup_3, custom
    subject VARCHAR(500),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMP,
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP,
    bounced BOOLEAN DEFAULT FALSE,
    bounce_reason TEXT
);

-- Tabela konwersji
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    email VARCHAR(255),
    company_name VARCHAR(255),
    conversion_type VARCHAR(50),
    -- registration, first_job_post, premium_upgrade
    source VARCHAR(100),
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revenue DECIMAL(10, 2) DEFAULT 0
);

-- Tabela kampanii
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    -- draft, active, paused, completed
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    target_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent ON leads(email_sent);
CREATE INDEX IF NOT EXISTS idx_leads_replied ON leads(replied);
CREATE INDEX IF NOT EXISTS idx_leads_found_at ON leads(found_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_processed ON linkedin_leads(processed);
CREATE INDEX IF NOT EXISTS idx_email_history_lead_id ON email_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversions_lead_id ON conversions(lead_id);

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

-- Widok statystyk
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

-- Przykładowe dane testowe (opcjonalne)
-- INSERT INTO leads (email, company_name, source) VALUES
-- ('test@szpital-test.pl', 'Szpital Testowy', 'manual'),
-- ('hr@klinika-przyklad.pl', 'Klinika Przykładowa', 'google_search');
