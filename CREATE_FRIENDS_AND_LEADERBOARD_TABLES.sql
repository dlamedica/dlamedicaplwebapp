-- ============================================================================
-- SYSTEM ZNAJOMYCH I RYWALIZACJI - PLATFORMA EDUKACYJNA
-- ============================================================================
-- Tabele do zarządzania znajomymi, zaproszeniami i rankingami

-- 1. TABELA FRIENDSHIPS (relacje znajomych)
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  requested_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- 2. TABELA FRIEND_INVITES (zaproszenia przez social media)
CREATE TABLE IF NOT EXISTS friend_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitee_email TEXT NOT NULL,
  invitee_name TEXT,
  platform VARCHAR(50) CHECK (platform IN ('email', 'facebook', 'google', 'linkedin', 'twitter')),
  invite_token TEXT UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- 3. TABELA USER_STATS (statystyki użytkowników do rankingów)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- w minutach
  completed_modules INTEGER DEFAULT 0,
  completed_quizzes INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0, -- dni z rzędu
  longest_streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb, -- tablica odznak
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA LEADERBOARDS (rankingi)
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'overall', 'weekly', 'monthly', 'friends', 'study_field'
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  rank_position INTEGER,
  points INTEGER DEFAULT 0,
  study_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, period_start)
);

-- 5. TABELA CHALLENGES (wyzwania między znajomymi)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenged_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_type VARCHAR(50) NOT NULL, -- 'study_time', 'quiz_score', 'modules_completed'
  target_value INTEGER NOT NULL,
  duration_days INTEGER DEFAULT 7,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'expired')),
  winner_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA ACTIVITY_FEED (aktywności znajomych)
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'module_completed', 'quiz_passed', 'streak_milestone', 'level_up'
  activity_data JSONB, -- dodatkowe dane aktywności
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friend_invites_inviter ON friend_invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_friend_invites_token ON friend_invites(invite_token);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_category ON leaderboards(category);
CREATE INDEX IF NOT EXISTS idx_leaderboards_points ON leaderboards(points DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_challenged ON challenges(challenged_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Policies dla friendships
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can update their friendships" ON friendships
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Policies dla friend_invites
CREATE POLICY "Users can view their invites" ON friend_invites
  FOR SELECT USING (auth.uid() = inviter_id OR invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create invites" ON friend_invites
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their invites" ON friend_invites
  FOR UPDATE USING (auth.uid() = inviter_id);

-- Policies dla user_stats
CREATE POLICY "Users can view all stats" ON user_stats
  FOR SELECT USING (true); -- Publiczne statystyki

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies dla leaderboards
CREATE POLICY "Anyone can view leaderboards" ON leaderboards
  FOR SELECT USING (true); -- Publiczne rankingi

CREATE POLICY "Users can update own leaderboard" ON leaderboards
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies dla challenges
CREATE POLICY "Users can view their challenges" ON challenges
  FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Users can create challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update their challenges" ON challenges
  FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Policies dla activity_feed
CREATE POLICY "Users can view public activities" ON activity_feed
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own activities" ON activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Funkcje pomocnicze
CREATE OR REPLACE FUNCTION update_friendship_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friendship_updated_at();

CREATE OR REPLACE FUNCTION update_user_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_updated_at();

-- Funkcja do automatycznego tworzenia statystyk przy rejestracji
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_stats_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats();

-- Komentarze
COMMENT ON TABLE friendships IS 'Relacje znajomych między użytkownikami';
COMMENT ON TABLE friend_invites IS 'Zaproszenia do znajomych przez social media';
COMMENT ON TABLE user_stats IS 'Statystyki użytkowników do rankingów';
COMMENT ON TABLE leaderboards IS 'Rankingi użytkowników';
COMMENT ON TABLE challenges IS 'Wyzwania między znajomymi';
COMMENT ON TABLE activity_feed IS 'Aktywności znajomych';

