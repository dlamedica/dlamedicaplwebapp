import { db } from '../lib/apiClient';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  requested_by: string;
  created_at: string;
  friend_profile?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface FriendInvite {
  id: string;
  inviter_id: string;
  invitee_email: string;
  invitee_name?: string;
  platform: 'email' | 'facebook' | 'google' | 'linkedin' | 'twitter';
  invite_token: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_points: number;
  total_study_time: number;
  completed_modules: number;
  completed_quizzes: number;
  correct_answers: number;
  total_answers: number;
  current_streak: number;
  longest_streak: number;
  badges: string[];
  level: number;
  experience_points: number;
  last_active_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  rank_position: number;
  points: number;
  study_time: number;
  profile?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  challenge_type: 'study_time' | 'quiz_score' | 'modules_completed';
  target_value: number;
  duration_days: number;
  status: 'pending' | 'active' | 'completed' | 'expired';
  winner_id?: string;
  started_at: string;
  expires_at: string;
  completed_at?: string;
}

// Pobierz wszystkich znajomych użytkownika
export const getFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const { data, error } = await db
      .from('friendships')
      .select(`
        *,
        friend_profile:users_profiles!friendships_friend_id_fkey(id, email, first_name, last_name, avatar_url)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;

    // Mapuj dane, aby zawsze zwracać friend_id jako ID znajomego
    return (data || []).map((friendship: any) => ({
      ...friendship,
      friend_id: friendship.user_id === userId ? friendship.friend_id : friendship.user_id,
      friend_profile: friendship.friend_profile || friendship.user_profile,
    }));
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};

// Pobierz zaproszenia oczekujące
export const getPendingInvites = async (userId: string): Promise<Friend[]> => {
  try {
    const { data, error } = await db
      .from('friendships')
      .select(`
        *,
        friend_profile:users_profiles!friendships_friend_id_fkey(id, email, first_name, last_name, avatar_url),
        requester_profile:users_profiles!friendships_requested_by_fkey(id, email, first_name, last_name, avatar_url)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'pending');

    if (error) throw error;

    return (data || []).map((friendship: any) => ({
      ...friendship,
      friend_profile: friendship.friend_id === userId 
        ? friendship.requester_profile 
        : friendship.friend_profile,
    }));
  } catch (error) {
    console.error('Error fetching pending invites:', error);
    return [];
  }
};

// Wyślij zaproszenie do znajomych
export const sendFriendRequest = async (
  userId: string,
  friendId: string
): Promise<boolean> => {
  try {
    const { error } = await db
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        requested_by: userId,
        status: 'pending',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
};

// Zaakceptuj zaproszenie
export const acceptFriendRequest = async (friendshipId: string): Promise<boolean> => {
  try {
    const { error } = await db
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return false;
  }
};

// Odrzuć zaproszenie
export const rejectFriendRequest = async (friendshipId: string): Promise<boolean> => {
  try {
    const { error } = await db
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return false;
  }
};

// Usuń znajomego
export const removeFriend = async (friendshipId: string): Promise<boolean> => {
  try {
    const { error } = await db
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
};

// Wyślij zaproszenie przez social media
export const sendSocialInvite = async (
  userId: string,
  email: string,
  name: string,
  platform: 'email' | 'facebook' | 'google' | 'linkedin' | 'twitter'
): Promise<FriendInvite | null> => {
  try {
    const inviteToken = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await db
      .from('friend_invites')
      .insert({
        inviter_id: userId,
        invitee_email: email,
        invitee_name: name,
        platform,
        invite_token: inviteToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending social invite:', error);
    return null;
  }
};

// Pobierz statystyki użytkownika
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const { data, error } = await db
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

// Zaktualizuj statystyki użytkownika
export const updateUserStats = async (
  userId: string,
  updates: Partial<UserStats>
): Promise<boolean> => {
  try {
    const { error } = await db
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
};

// Pobierz ranking
export const getLeaderboard = async (
  category: 'overall' | 'weekly' | 'monthly' | 'friends',
  userId?: string,
  limit: number = 100
): Promise<LeaderboardEntry[]> => {
  try {
    let query = db
      .from('leaderboards')
      .select(`
        user_id,
        rank_position,
        points,
        study_time,
        profile:users_profiles!leaderboards_user_id_fkey(id, email, first_name, last_name, avatar_url)
      `)
      .eq('category', category)
      .order('rank_position', { ascending: true })
      .limit(limit);

    if (category === 'friends' && userId) {
      // Pobierz tylko znajomych
      const friends = await getFriends(userId);
      const friendIds = friends.map(f => f.friend_id);
      if (friendIds.length > 0) {
        query = query.in('user_id', friendIds);
      } else {
        return [];
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map((entry: any) => ({
      ...entry,
      profile: entry.profile,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Utwórz wyzwanie
export const createChallenge = async (
  challengerId: string,
  challengedId: string,
  challengeType: 'study_time' | 'quiz_score' | 'modules_completed',
  targetValue: number,
  durationDays: number = 7
): Promise<Challenge | null> => {
  try {
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    
    const { data, error } = await db
      .from('challenges')
      .insert({
        challenger_id: challengerId,
        challenged_id: challengedId,
        challenge_type: challengeType,
        target_value: targetValue,
        duration_days: durationDays,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating challenge:', error);
    return null;
  }
};

// Pobierz wyzwania użytkownika
export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  try {
    const { data, error } = await db
      .from('challenges')
      .select('*')
      .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};

// Wyszukaj użytkowników
export const searchUsers = async (searchTerm: string, limit: number = 20): Promise<any[]> => {
  try {
    const { data, error } = await db
      .from('users_profiles')
      .select('id, email, first_name, last_name, avatar_url')
      .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Dodaj punkty użytkownikowi
export const addPoints = async (userId: string, points: number, reason: string): Promise<boolean> => {
  try {
    // Pobierz aktualne statystyki
    const stats = await getUserStats(userId);
    if (!stats) return false;

    const newPoints = stats.total_points + points;
    const newXP = stats.experience_points + points;
    const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP = 1 poziom

    await updateUserStats(userId, {
      total_points: newPoints,
      experience_points: newXP,
      level: newLevel,
    });

    // Zaktualizuj ranking
    await updateLeaderboard(userId, 'overall', newPoints, stats.total_study_time);
    
    return true;
  } catch (error) {
    console.error('Error adding points:', error);
    return false;
  }
};

// Zaktualizuj ranking
export const updateLeaderboard = async (
  userId: string,
  category: 'overall' | 'weekly' | 'monthly',
  points: number,
  studyTime: number
): Promise<boolean> => {
  try {
    const periodStart = category === 'weekly' 
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      : category === 'monthly'
      ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const periodEnd = new Date().toISOString();

    const { error } = await db
      .from('leaderboards')
      .upsert({
        user_id: userId,
        category,
        period_start: periodStart,
        period_end: periodEnd,
        points,
        study_time: studyTime,
      }, {
        onConflict: 'user_id,category,period_start',
      });

    if (error) throw error;

    // Przelicz pozycje w rankingu
    await recalculateLeaderboardRanks(category);
    
    return true;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return false;
  }
};

// Przelicz pozycje w rankingu
const recalculateLeaderboardRanks = async (category: string): Promise<void> => {
  try {
    const { data, error } = await db
      .from('leaderboards')
      .select('id, points')
      .eq('category', category)
      .order('points', { ascending: false });

    if (error) throw error;

    // Zaktualizuj pozycje
    const updates = (data || []).map((entry, index) => ({
      id: entry.id,
      rank_position: index + 1,
    }));

    for (const update of updates) {
      await db
        .from('leaderboards')
        .update({ rank_position: update.rank_position })
        .eq('id', update.id);
    }
  } catch (error) {
    console.error('Error recalculating leaderboard ranks:', error);
  }
};

