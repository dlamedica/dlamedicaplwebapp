-- ===================================
-- TABELE DLA SYSTEMU GAMIFIKACJI
-- ===================================

-- 1. TABELA USER_POINTS (punkty użytkowników)
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Punkty
    total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
    available_points INTEGER DEFAULT 0 CHECK (available_points >= 0),
    spent_points INTEGER DEFAULT 0 DEFAULT 0 CHECK (spent_points >= 0),
    
    -- Poziom i doświadczenie
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    experience_to_next_level INTEGER DEFAULT 100 CHECK (experience_to_next_level > 0),
    
    -- Statystyki
    total_purchases INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0, -- dni z rzędu logowania
    last_checkin_date DATE,
    
    CONSTRAINT valid_points CHECK (total_points = available_points + spent_points)
);

-- Indeksy dla user_points
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_level ON user_points(level);

-- 2. TABELA POINTS_HISTORY (historia punktów)
CREATE TABLE IF NOT EXISTS points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Punkty
    points INTEGER NOT NULL, -- może być ujemne dla wydatków
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    
    -- Typ transakcji
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'purchase', 'daily_checkin', 'review', 'share', 'referral', 
        'spin_wheel', 'scratch_card', 'quest_complete', 'level_up',
        'redeem_discount', 'admin_adjustment'
    )),
    
    -- Opis
    description TEXT,
    
    -- Powiązane obiekty (opcjonalne)
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    quest_id UUID,
    reward_id UUID
);

-- Indeksy dla points_history
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON points_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_history_type ON points_history(transaction_type);

-- 3. TABELA DAILY_REWARDS (codzienne nagrody)
CREATE TABLE IF NOT EXISTS daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Data nagrody
    reward_date DATE NOT NULL,
    
    -- Nagroda
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('points', 'discount', 'free_product')),
    reward_value TEXT NOT NULL, -- JSON z wartością nagrody
    points_awarded INTEGER DEFAULT 0,
    
    -- Status
    is_claimed BOOLEAN DEFAULT false,
    claimed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, reward_date)
);

-- Indeksy dla daily_rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_id ON daily_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_date ON daily_rewards(reward_date DESC);

-- 4. TABELA GAME_REWARDS (nagrody z gier)
CREATE TABLE IF NOT EXISTS game_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Typ gry
    game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('spin_wheel', 'scratch_card', 'lucky_draw')),
    
    -- Nagroda
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('points', 'discount_code', 'free_product', 'nothing')),
    reward_value TEXT NOT NULL, -- JSON z wartością nagrody
    discount_code VARCHAR(50), -- jeśli to kod rabatowy
    discount_percentage DECIMAL(5,2), -- jeśli to procent rabatu
    points_awarded INTEGER DEFAULT 0,
    
    -- Status
    is_claimed BOOLEAN DEFAULT false,
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Indeksy dla game_rewards
CREATE INDEX IF NOT EXISTS idx_game_rewards_user_id ON game_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_game_rewards_game_type ON game_rewards(game_type);
CREATE INDEX IF NOT EXISTS idx_game_rewards_claimed ON game_rewards(is_claimed);

-- 5. TABELA DISCOUNT_CODES (kody rabatowe)
CREATE TABLE IF NOT EXISTS discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Kod
    code VARCHAR(50) NOT NULL UNIQUE,
    
    -- Typ rabatu
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    
    -- Limity
    max_uses INTEGER, -- NULL = bez limitu
    used_count INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    
    -- Daty ważności
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    -- Minimalna kwota zamówienia
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Opis
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indeksy dla discount_codes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active) WHERE is_active = true;

-- 6. TABELA USER_DISCOUNT_CODES (użyte kody przez użytkowników)
CREATE TABLE IF NOT EXISTS user_discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Kod rabatowy
    discount_code_id UUID REFERENCES discount_codes(id) ON DELETE CASCADE NOT NULL,
    
    -- Zamówienie (jeśli użyty)
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Status
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    
    UNIQUE(user_id, discount_code_id, order_id)
);

-- Indeksy dla user_discount_codes
CREATE INDEX IF NOT EXISTS idx_user_discount_codes_user_id ON user_discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_discount_codes_code_id ON user_discount_codes(discount_code_id);

-- 7. TABELA QUESTS (misje)
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Informacje o misji
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    
    -- Typ misji
    quest_type VARCHAR(50) NOT NULL CHECK (quest_type IN (
        'purchase', 'purchase_amount', 'add_to_cart', 'add_to_wishlist',
        'review', 'share', 'referral', 'daily_checkin', 'level_up'
    )),
    
    -- Wymagania
    target_value INTEGER NOT NULL, -- np. ilość produktów, kwota, dni
    target_metric VARCHAR(50), -- 'count', 'amount', 'days'
    
    -- Nagroda
    reward_points INTEGER DEFAULT 0,
    reward_discount_code_id UUID REFERENCES discount_codes(id) ON DELETE SET NULL,
    
    -- Czas trwania
    quest_period VARCHAR(20) DEFAULT 'permanent' CHECK (quest_period IN ('daily', 'weekly', 'monthly', 'permanent')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Indeksy dla quests
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(quest_type);
CREATE INDEX IF NOT EXISTS idx_quests_active ON quests(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_quests_period ON quests(quest_period);

-- 8. TABELA USER_QUESTS (postęp użytkowników w misjach)
CREATE TABLE IF NOT EXISTS user_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Misja
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
    
    -- Postęp
    current_progress INTEGER DEFAULT 0,
    target_progress INTEGER NOT NULL,
    
    -- Status
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    
    -- Nagroda
    reward_claimed BOOLEAN DEFAULT false,
    reward_claimed_at TIMESTAMPTZ,
    
    -- Okres (dla misji okresowych)
    period_start DATE,
    period_end DATE,
    
    UNIQUE(user_id, quest_id, period_start)
);

-- Indeksy dla user_quests
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_quest_id ON user_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_completed ON user_quests(is_completed);

-- 9. TABELA REFERRAL_CODES (kody polecające)
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Użytkownik (twórca kodu)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Kod
    code VARCHAR(50) NOT NULL UNIQUE,
    
    -- Statystyki
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0, -- zakończone zakupem
    
    -- Nagrody
    reward_points_per_referral INTEGER DEFAULT 100,
    reward_points_per_purchase INTEGER DEFAULT 500
);

-- Indeksy dla referral_codes
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);

-- 10. TABELA REFERRALS (historia poleceń)
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Kod polecający
    referral_code_id UUID REFERENCES referral_codes(id) ON DELETE CASCADE NOT NULL,
    
    -- Użytkownik polecony
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Status
    has_made_purchase BOOLEAN DEFAULT false,
    first_purchase_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    first_purchase_at TIMESTAMPTZ,
    
    -- Nagrody
    referrer_reward_claimed BOOLEAN DEFAULT false,
    referred_reward_claimed BOOLEAN DEFAULT false,
    
    UNIQUE(referral_code_id, referred_user_id)
);

-- Indeksy dla referrals
CREATE INDEX IF NOT EXISTS idx_referrals_code_id ON referrals(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON referrals(referred_user_id);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Włącz RLS dla wszystkich tabel
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Polityki dla user_points
CREATE POLICY "Users can view own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own points" ON user_points
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert user points" ON user_points
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla points_history
CREATE POLICY "Users can view own points history" ON points_history
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points history" ON points_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla daily_rewards
CREATE POLICY "Users can view own daily rewards" ON daily_rewards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own daily rewards" ON daily_rewards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert daily rewards" ON daily_rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla game_rewards
CREATE POLICY "Users can view own game rewards" ON game_rewards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own game rewards" ON game_rewards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert game rewards" ON game_rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla discount_codes (publiczne odczyty, ale tylko właściciel/admin może edytować)
CREATE POLICY "Anyone can view active discount codes" ON discount_codes
    FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own discount codes" ON discount_codes
    FOR SELECT USING (created_by = auth.uid());

-- Polityki dla user_discount_codes
CREATE POLICY "Users can view own discount code usage" ON user_discount_codes
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert discount code usage" ON user_discount_codes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla quests (publiczne)
CREATE POLICY "Anyone can view active quests" ON quests
    FOR SELECT USING (is_active = true);

-- Polityki dla user_quests
CREATE POLICY "Users can view own quests" ON user_quests
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON user_quests
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert user quests" ON user_quests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityki dla referral_codes
CREATE POLICY "Users can view own referral codes" ON referral_codes
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view referral codes by code" ON referral_codes
    FOR SELECT USING (true); -- dla weryfikacji kodu

-- Polityki dla referrals
CREATE POLICY "Users can view own referrals" ON referrals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM referral_codes
            WHERE referral_codes.id = referrals.referral_code_id
            AND referral_codes.user_id = auth.uid()
        ) OR referred_user_id = auth.uid()
    );

-- ===================================
-- FUNKCJE POMOCNICZE
-- ===================================

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery dla updated_at
CREATE TRIGGER update_user_points_updated_at
    BEFORE UPDATE ON user_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
    BEFORE UPDATE ON discount_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at
    BEFORE UPDATE ON quests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_quests_updated_at
    BEFORE UPDATE ON user_quests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Funkcja do obliczania doświadczenia potrzebnego na następny poziom
CREATE OR REPLACE FUNCTION calculate_exp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN 100 * POWER(1.5, level_num - 1)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Funkcja do inicjalizacji punktów użytkownika
CREATE OR REPLACE FUNCTION initialize_user_points(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_points (user_id, experience_to_next_level)
    VALUES (user_uuid, calculate_exp_for_level(1))
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

