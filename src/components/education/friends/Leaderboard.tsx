import React, { useState, useEffect } from 'react';
import { TrophyIcon, ChartLineIcon, UsersIcon, CrownIcon, MedalIcon, AwardIcon } from '../../icons/PlatformIcons';
import { useAuth } from '../../../contexts/AuthContext';
import { getLeaderboard, getUserStats, type LeaderboardEntry, type UserStats } from '../../../services/friendsService';
import { CountUp, AnimatedSection, RippleButton } from '../components';
import { SkeletonCard } from '../skeletons';
import '../styles/educationStyles.css';

interface LeaderboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  category?: 'overall' | 'weekly' | 'monthly' | 'friends';
}

const Leaderboard: React.FC<LeaderboardProps> = ({ darkMode, fontSize, category = 'overall' }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'overall' | 'weekly' | 'monthly' | 'friends'>(category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
    if (user) {
      loadUserStats();
    }
  }, [activeCategory, user]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard(activeCategory, user?.id);
    setLeaderboard(data);
    
    // Znajdź pozycję użytkownika
    if (user) {
      const userEntry = data.find(entry => entry.user_id === user.id);
      setUserRank(userEntry?.rank_position || null);
    }
    
    setLoading(false);
  };

  const loadUserStats = async () => {
    if (!user) return;
    const stats = await getUserStats(user.id);
    setUserStats(stats);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <CrownIcon size={32} className="text-yellow-500 drop-shadow-lg" />;
    if (rank === 2) return <MedalIcon size={28} className="text-gray-400 drop-shadow-md" />;
    if (rank === 3) return <MedalIcon size={28} className="text-amber-600 drop-shadow-md" />;
    return <AwardIcon size={24} className="text-gray-500" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return darkMode 
      ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
      : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg shadow-yellow-200/50';
    if (rank === 2) return darkMode 
      ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/30 border-gray-500/50 shadow-md shadow-gray-500/10' 
      : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 shadow-md shadow-gray-200/30';
    if (rank === 3) return darkMode 
      ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/50 shadow-md shadow-amber-500/15' 
      : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-md shadow-amber-200/40';
    return darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-gray-200/50';
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}min`;
    return `${mins}min`;
  };

  return (
    <AnimatedSection animation="slideDown" delay={0}>
      <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} rounded-2xl shadow-xl p-6 education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${fontSizes.title} font-bold bg-gradient-to-r ${darkMode ? 'from-yellow-400 to-amber-500' : 'from-yellow-600 to-amber-700'} bg-clip-text text-transparent flex items-center gap-2`}>
            <TrophyIcon size={28} className="text-yellow-500 drop-shadow-lg" />
            Ranking
          </h2>
        </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-300">
        {[
          { id: 'overall', label: 'Ogólny' },
          { id: 'weekly', label: 'Tygodniowy' },
          { id: 'monthly', label: 'Miesięczny' },
          { id: 'friends', label: 'Znajomi' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeCategory === tab.id
                ? 'border-[#38b6ff] text-[#38b6ff]'
                : `${darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-600'} hover:text-[#38b6ff]`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Stats Card */}
      {userStats && (
        <div className={`mb-6 p-4 rounded-lg border-2 border-[#38b6ff] ${
          darkMode ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`${fontSizes.subtitle} font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Twoje statystyki
              </h3>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Poziom: <span className="font-bold text-[#38b6ff]"><CountUp end={userStats.level} duration={1000} /></span>
                  </p>
                </div>
                <div>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Punkty: <span className="font-bold text-[#38b6ff]"><CountUp end={userStats.total_points} duration={1500} /></span>
                  </p>
                </div>
                <div>
                  <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Czas nauki: <span className="font-bold text-[#38b6ff]">{formatTime(userStats.total_study_time)}</span>
                  </p>
                </div>
                {userRank && (
                  <div>
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pozycja: <span className="font-bold text-[#38b6ff]">#<CountUp end={userRank} duration={1000} /></span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userStats.current_streak}
              </div>
              <div className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                dni z rzędu 🔥
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38b6ff] mx-auto"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <TrophyIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p className={fontSizes.text}>Brak danych w rankingu</p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <SkeletonCard darkMode={darkMode} count={5} />
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 20).map((entry, index) => {
            const isCurrentUser = entry.user_id === user?.id;
            return (
              <div
                key={entry.user_id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentUser
                    ? 'border-[#38b6ff] bg-blue-50 dark:bg-blue-900'
                    : getRankColor(entry.rank_position)
                } ${darkMode && !isCurrentUser ? 'bg-gray-800 border-gray-700' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    {entry.rank_position <= 3 ? (
                      getRankIcon(entry.rank_position)
                    ) : (
                      <span className={`${fontSizes.subtitle} font-bold ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        #{entry.rank_position}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {entry.profile?.avatar_url ? (
                      <img
                        src={entry.profile.avatar_url}
                        alt={entry.profile.first_name || 'User'}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <UsersIcon className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={48} />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className={`${fontSizes.subtitle} font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {entry.profile?.first_name && entry.profile?.last_name
                        ? `${entry.profile.first_name} ${entry.profile.last_name}`
                        : entry.profile?.email || 'Użytkownik'}
                      {isCurrentUser && (
                        <span className="ml-2 text-[#38b6ff]">(Ty)</span>
                      )}
                    </h3>
                    <div className="flex gap-4 mt-1">
                      <span className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <ChartLineIcon size={16} className="inline mr-1" />
                        <CountUp end={entry.points} duration={1000} /> pkt
                      </span>
                      <span className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTime(entry.study_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </AnimatedSection>
    );
  };

export default Leaderboard;

