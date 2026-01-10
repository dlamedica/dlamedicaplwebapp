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

-- ===================================
-- ROZSZERZENIE: STREAK, ODZNAKI, LIGI EDUKACYJNE
-- Data: 2026-01-10
-- ===================================

-- 11. TABELA BADGES (odznaki)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#3498db',
    category VARCHAR(30) NOT NULL CHECK (category IN ('streak', 'quiz', 'course', 'social', 'special', 'veterinary', 'medical')),
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    xp_reward INTEGER DEFAULT 0,
    requirement_type VARCHAR(30), -- 'count', 'streak', 'score', 'time', 'special'
    requirement_value INTEGER,
    is_hidden BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);

-- 12. TABELA USER_BADGES (zdobyte odznaki)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    notified BOOLEAN DEFAULT false,

    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- 13. TABELA EDUCATION_LEAGUES (ligi edukacyjne)
CREATE TABLE IF NOT EXISTS education_leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL UNIQUE,
    rank_order INTEGER NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    min_weekly_xp INTEGER DEFAULT 0,
    promotion_spots INTEGER DEFAULT 10,
    relegation_spots INTEGER DEFAULT 5
);

-- Seed lig
INSERT INTO education_leagues (name, rank_order, icon, color, min_weekly_xp, promotion_spots, relegation_spots) VALUES
('bronze', 1, 'medal', '#cd7f32', 0, 15, 0),
('silver', 2, 'medal', '#c0c0c0', 100, 10, 5),
('gold', 3, 'medal', '#ffd700', 300, 10, 5),
('platinum', 4, 'gem', '#e5e4e2', 600, 10, 5),
('diamond', 5, 'diamond', '#b9f2ff', 1000, 5, 5),
('master', 6, 'crown', '#ff4500', 2000, 0, 5)
ON CONFLICT (name) DO NOTHING;

-- 14. TABELA USER_LEAGUE_HISTORY
CREATE TABLE IF NOT EXISTS user_league_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    league VARCHAR(20) NOT NULL,
    final_position INTEGER,
    xp_earned INTEGER DEFAULT 0,
    promoted BOOLEAN DEFAULT false,
    relegated BOOLEAN DEFAULT false,

    UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_user_league_history_user ON user_league_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_league_history_week ON user_league_history(week_start);

-- 15. TABELA DAILY_STUDY_CHALLENGES (codzienne wyzwania nauki)
CREATE TABLE IF NOT EXISTS daily_study_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    date DATE NOT NULL UNIQUE,
    challenge_type VARCHAR(30) NOT NULL CHECK (challenge_type IN ('flashcard', 'quiz', 'time', 'article', 'mixed')),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    bonus_multiplier DECIMAL(3,2) DEFAULT 1.00
);

-- 16. TABELA USER_STUDY_CHALLENGES (postęp w wyzwaniach)
CREATE TABLE IF NOT EXISTS user_study_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES daily_study_challenges(id) ON DELETE CASCADE NOT NULL,
    current_value INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,

    UNIQUE(user_id, challenge_id)
);

-- 17. ROZSZERZENIE user_points o pola edukacyjne
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS last_study_date DATE;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS streak_freeze_count INTEGER DEFAULT 1;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS current_league VARCHAR(20) DEFAULT 'bronze';
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS total_flashcards_reviewed INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS total_quizzes_completed INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS total_courses_completed INTEGER DEFAULT 0;
ALTER TABLE user_points ADD COLUMN IF NOT EXISTS total_study_minutes INTEGER DEFAULT 0;

-- Seed odznak
INSERT INTO badges (code, name, description, icon, color, category, rarity, xp_reward, requirement_type, requirement_value) VALUES
-- Streak badges
('streak_3', 'Początek serii', 'Ucz się 3 dni z rzędu', 'fire', '#e74c3c', 'streak', 'common', 10, 'streak', 3),
('streak_7', 'Tydzień nauki', 'Ucz się 7 dni z rzędu', 'fire', '#e67e22', 'streak', 'uncommon', 25, 'streak', 7),
('streak_14', 'Dwa tygodnie', 'Ucz się 14 dni z rzędu', 'fire', '#f39c12', 'streak', 'rare', 50, 'streak', 14),
('streak_30', 'Miesiąc wytrwałości', 'Ucz się 30 dni z rzędu', 'fire', '#f1c40f', 'streak', 'epic', 100, 'streak', 30),
('streak_100', 'Legendarny streak', 'Ucz się 100 dni z rzędu', 'fire', '#9b59b6', 'streak', 'legendary', 500, 'streak', 100),

-- Quiz badges
('quiz_first', 'Pierwszy quiz', 'Ukończ swój pierwszy quiz', 'check-circle', '#27ae60', 'quiz', 'common', 5, 'count', 1),
('quiz_10', 'Quiz adept', 'Ukończ 10 quizów', 'clipboard-check', '#2ecc71', 'quiz', 'uncommon', 25, 'count', 10),
('quiz_50', 'Quiz mistrz', 'Ukończ 50 quizów', 'award', '#1abc9c', 'quiz', 'rare', 75, 'count', 50),
('quiz_perfect', 'Perfekcjonista', 'Zdobądź 100% w quizie', 'star', '#f1c40f', 'quiz', 'uncommon', 30, 'score', 100),
('quiz_speed', 'Błyskawica', 'Ukończ quiz w mniej niż 2 minuty', 'bolt', '#e74c3c', 'quiz', 'rare', 40, 'time', 120),

-- Flashcard badges
('flashcard_100', 'Fiszkowicz', 'Przeglądnij 100 fiszek', 'layer-group', '#3498db', 'course', 'common', 15, 'count', 100),
('flashcard_500', 'Kartkomania', 'Przeglądnij 500 fiszek', 'layer-group', '#2980b9', 'course', 'uncommon', 40, 'count', 500),
('flashcard_1000', 'Mistrz fiszek', 'Przeglądnij 1000 fiszek', 'layer-group', '#1abc9c', 'course', 'rare', 100, 'count', 1000),

-- Course badges
('course_first', 'Pierwszy krok', 'Ukończ pierwszy kurs', 'graduation-cap', '#9b59b6', 'course', 'common', 20, 'count', 1),
('course_5', 'Pilny student', 'Ukończ 5 kursów', 'book-reader', '#8e44ad', 'course', 'uncommon', 50, 'count', 5),
('course_10', 'Wieczny student', 'Ukończ 10 kursów', 'university', '#6c3483', 'course', 'rare', 100, 'count', 10),

-- Veterinary specific badges
('vet_first', 'Przyjaciel zwierząt', 'Ukończ pierwszy kurs weterynaryjny', 'paw', '#27ae60', 'veterinary', 'common', 15, 'count', 1),
('vet_small', 'Spec. małych zwierząt', 'Ukończ 5 kursów o małych zwierzętach', 'cat', '#3498db', 'veterinary', 'uncommon', 40, 'count', 5),
('vet_large', 'Spec. dużych zwierząt', 'Ukończ 5 kursów o dużych zwierzętach', 'horse', '#e67e22', 'veterinary', 'uncommon', 40, 'count', 5),
('vet_exotic', 'Egzotyk', 'Ukończ kurs o zwierzętach egzotycznych', 'dragon', '#9b59b6', 'veterinary', 'rare', 50, 'count', 1),
('vet_master', 'Mistrz weterynarii', 'Zdobądź wszystkie odznaki weterynaryjne', 'medal', '#f1c40f', 'veterinary', 'legendary', 200, 'special', 0),

-- Medical badges
('med_anatomy', 'Anatom', 'Opanuj 80% materiału z anatomii', 'bone', '#e74c3c', 'medical', 'uncommon', 35, 'score', 80),
('med_pharma', 'Farmakolog', 'Ukończ wszystkie kursy farmakologii', 'pills', '#9b59b6', 'medical', 'rare', 60, 'count', 1),
('med_cardio', 'Kardiolog', 'Opanuj materiał z kardiologii', 'heartbeat', '#e74c3c', 'medical', 'rare', 60, 'score', 80),
('med_lek', 'Zdany LEK', 'Zdaj egzamin próbny LEK na 70%+', 'certificate', '#f1c40f', 'medical', 'epic', 150, 'score', 70),

-- Social badges
('social_share', 'Społecznik', 'Udostępnij swój postęp', 'share-alt', '#00acee', 'social', 'common', 10, 'count', 1),
('social_mentor', 'Mentor', 'Pomóż 5 innym użytkownikom', 'hands-helping', '#e91e63', 'social', 'rare', 75, 'count', 5),

-- Special badges
('early_bird', 'Ranny ptaszek', 'Ucz się przed 7:00 rano', 'sun', '#f39c12', 'special', 'uncommon', 20, 'special', 0),
('night_owl', 'Nocna sowa', 'Ucz się po 23:00', 'moon', '#34495e', 'special', 'uncommon', 20, 'special', 0),
('weekend_warrior', 'Weekendowy wojownik', 'Ucz się w sobotę i niedzielę', 'calendar-week', '#e74c3c', 'special', 'common', 15, 'special', 0),
('comeback', 'Powrót bohatera', 'Wróć po 30 dniach przerwy', 'undo', '#2ecc71', 'special', 'rare', 50, 'special', 30)
ON CONFLICT (code) DO NOTHING;

-- Seed codziennych wyzwań
INSERT INTO daily_study_challenges (date, challenge_type, title, description, target_value, xp_reward, bonus_multiplier) VALUES
(CURRENT_DATE, 'flashcard', 'Fiszki dnia', 'Przejrzyj 20 fiszek', 20, 30, 1.5),
(CURRENT_DATE + 1, 'quiz', 'Quiz blitz', 'Ukończ 3 quizy', 3, 40, 1.2),
(CURRENT_DATE + 2, 'time', 'Maraton nauki', 'Ucz się przez 30 minut', 30, 50, 1.3),
(CURRENT_DATE + 3, 'article', 'Czytelnik', 'Przeczytaj 5 artykułów', 5, 35, 1.2),
(CURRENT_DATE + 4, 'mixed', 'Wszechstronność', '10 fiszek + 1 quiz', 11, 45, 1.4)
ON CONFLICT (date) DO NOTHING;

-- RLS dla nowych tabel
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_league_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_study_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_study_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view leagues" ON education_leagues FOR SELECT USING (true);
CREATE POLICY "Users can view own league history" ON user_league_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view challenges" ON daily_study_challenges FOR SELECT USING (true);
CREATE POLICY "Users can view own challenge progress" ON user_study_challenges FOR SELECT USING (auth.uid() = user_id);

