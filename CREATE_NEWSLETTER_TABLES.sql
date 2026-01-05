-- ===================================
-- TABELE DLA NEWSLETTERA I POWIADOMIEŃ
-- ===================================

-- Tabela newsletter_subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    subscribed BOOLEAN DEFAULT true,
    
    preferences JSONB DEFAULT '{
        "promotions": true,
        "new_products": true,
        "price_drops": false,
        "weekly_digest": true
    }'::jsonb,
    
    UNIQUE(email)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_user_id ON newsletter_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscribed ON newsletter_subscriptions(subscribed);

-- Tabela email_notifications
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'order_confirmation',
        'order_shipped',
        'order_delivered',
        'promotion',
        'price_drop',
        'new_product',
        'newsletter'
    )),
    
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    
    metadata JSONB
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_email ON email_notifications(email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent ON email_notifications(sent);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created_at ON email_notifications(created_at DESC);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą zarządzać swoimi subskrypcjami
CREATE POLICY "Users can manage own subscriptions" ON newsletter_subscriptions
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Użytkownicy mogą widzieć swoje powiadomienia
CREATE POLICY "Users can view own notifications" ON email_notifications
    FOR SELECT USING (auth.uid() = user_id);

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

CREATE TRIGGER update_newsletter_subscriptions_updated_at
    BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

