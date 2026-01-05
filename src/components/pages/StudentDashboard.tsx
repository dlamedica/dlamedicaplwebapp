/**
 * Panel Studenta - Premium Dashboard
 * Kompletnie przebudowany zgodnie z wymaganiami UX
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/apiClient';
import { getUserPoints, getPointsHistory, getUserQuests, getLoyaltyStatus } from '../../services/gamificationService';
import { MockProfileService } from '../../services/mockProfileService';
import {
  StudentIcon, CertificateIcon, StatsIcon, LearningIcon, AchievementIcon,
  RankingIcon, ProfileIcon, OverviewIcon, LogoutIcon, EditIcon, SaveIcon,
  CancelIcon, ProgressIcon, TimeIcon, StreakIcon, PointsIcon, LevelIcon,
  BookIcon, CheckCircleIcon, ClockIcon, TrophyIcon, ChartIcon, UserIcon,
  CalendarIcon, StarIcon, ArrowRightIcon, NotificationIcon, SettingsIcon
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import { CustomProgressBar } from '../../components/ui/CustomProgressBar';

interface StudentDashboardProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface LearningProgress {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalStudyTime: number;
  averageProgress: number;
  recentQuizzes: Array<{
    id: string;
    quizId: string;
    score: number;
    passed: boolean;
    completedAt: string;
  }>;
}

interface Certificate {
  id: string;
  subjectId: string;
  subjectName: string;
  moduleId: string;
  certificateType: string;
  earnedAt: string;
  verificationCode: string;
}

interface UserPoints {
  total_points: number;
  available_points: number;
  level: number;
  experience: number;
  experience_to_next_level: number;
  streak_days: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string | null;
  unlocked: boolean;
}

interface RecentActivity {
  id: string;
  type: 'module_completed' | 'quiz_attempt' | 'course_enrolled' | 'certificate_earned' | 'achievement_unlocked';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  color: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'progress' | 'certificates' | 'achievements' | 'ranking' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editing, setEditing] = useState(false);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [loyaltyStatus, setLoyaltyStatus] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [institution, setInstitution] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    document.title = 'Panel Studenta – DlaMedica.pl';

    if (user) {
      if (profile) {
        loadStudentData();
        initializeForm();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const initializeForm = () => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setInstitution(profile.institution || '');
      setYearOfStudy(profile.year_of_study || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  };

  const loadStudentData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        // Load progress
        try {
          const progressData = await MockProfileService.getStudentProgress(user.id);
          if (progressData) {
            setProgress(progressData);
          }
        } catch (e) {
          console.log('Progress API not available, using fallback');
        }

        // Load certificates
        try {
          const certsData = await MockProfileService.getStudentCertificates(user.id);
          if (certsData) {
            setCertificates(certsData.certificates || []);
          }
        } catch (e) {
          console.log('Certificates API not available, using fallback');
        }

        // Load gamification data
        const points = await getUserPoints(user.id);
        if (points) {
          setUserPoints(points);
        }

        const history = await getPointsHistory(user.id, 20);
        setPointsHistory(history);

        const userQuests = await getUserQuests(user.id);
        setQuests(userQuests);

        const loyalty = await getLoyaltyStatus(user.id);
        setLoyaltyStatus(loyalty);

        // Mock achievements (będzie pobierane z API)
        setAchievements([
          { id: '1', title: 'Pierwsze kroki', description: 'Ukończ pierwszy moduł', icon: '🎯', earnedAt: new Date().toISOString(), unlocked: true },
          { id: '2', title: 'Quiz Master', description: 'Zdaj 10 quizów', icon: '🧠', earnedAt: new Date().toISOString(), unlocked: true },
          { id: '3', title: 'Wytrwałość', description: 'Utrzymaj 7-dniową serię', icon: '🔥', earnedAt: null, unlocked: false },
          { id: '4', title: 'Ekspert', description: 'Zdobądź 1000 punktów', icon: '⭐', earnedAt: null, unlocked: false },
          { id: '5', title: 'Perfekcjonista', description: 'Uzyskaj 100% w quizie', icon: '💯', earnedAt: null, unlocked: false },
          { id: '6', title: 'Społecznik', description: 'Pomóż 5 innym studentom', icon: '🤝', earnedAt: null, unlocked: false }
        ]);

        // Mock recent activities
        setRecentActivities([
          { id: '1', type: 'module_completed', title: 'Anatomia: Moduł 3', description: 'Ukończono moduł', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: '✅' },
          { id: '2', type: 'quiz_attempt', title: 'Interna: Test diagnostyczny', description: '85 pkt', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), icon: '📝' },
          { id: '3', type: 'course_enrolled', title: 'Biochemia: Moduł 1', description: 'Rozpoczęto moduł', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), icon: '📚' },
          { id: '4', type: 'achievement_unlocked', title: 'Quiz Master', description: 'Odblokowano osiągnięcie', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), icon: '🏆' },
          { id: '5', type: 'certificate_earned', title: 'Certyfikat z Anatomii', description: 'Zdobyto certyfikat', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), icon: '🎓' }
        ]);

        // Mock subject progress
        setSubjectProgress([
          { id: '1', name: 'Anatomia', progress: 75, totalModules: 12, completedModules: 9, color: '#3b82f6' },
          { id: '2', name: 'Biochemia', progress: 45, totalModules: 10, completedModules: 4, color: '#10b981' },
          { id: '3', name: 'Interna', progress: 30, totalModules: 15, completedModules: 4, color: '#f97316' },
          { id: '4', name: 'Chirurgia', progress: 10, totalModules: 8, completedModules: 1, color: '#a855f7' }
        ]);

        // Load leaderboard
        const { data: leaderboardData } = await db
          .from('user_points')
          .select('user_id, total_points, level, experience')
          .order('total_points', { ascending: false })
          .limit(10);

        if (leaderboardData) {
          const userIds = leaderboardData.map(l => l.user_id);
          const { data: profiles } = await db
            .from('users_profiles')
            .select('id, first_name, last_name')
            .in('id', userIds);

          const leaderboardWithNames = leaderboardData.map(l => {
            const profile = profiles?.find(p => p.id === l.user_id);
            return {
              ...l,
              name: profile ? `${profile.first_name} ${profile.last_name}` : 'Anonimowy',
              isCurrentUser: l.user_id === user.id
            };
          });
          setLeaderboard(leaderboardWithNames);
        }
      }
    } catch (error) {
      console.error('Błąd ładowania danych studenta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    try {
      const { error } = await db
        .from('users_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          institution: institution || null,
          year_of_study: yearOfStudy || null,
          phone: phone || null,
          bio: bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Profil zaktualizowany pomyślnie!');
      setEditing(false);
      await loadStudentData();
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error);
      alert('Błąd podczas aktualizacji profilu');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'przed chwilą';
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'godzinę' : diffHours < 5 ? 'godziny' : 'godzin'} temu`;
    if (diffDays === 1) return 'wczoraj';
    if (diffDays < 7) return `${diffDays} dni temu`;
    return date.toLocaleDateString('pl-PL');
  };

  const getUserRank = () => {
    const index = leaderboard.findIndex(l => l.isCurrentUser);
    return index >= 0 ? index + 1 : null;
  };

  const getPercentileBelowUser = () => {
    const rank = getUserRank();
    if (!rank || leaderboard.length === 0) return 0;
    return Math.round(((leaderboard.length - rank) / leaderboard.length) * 100);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Ładowanie panelu...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Przegląd', Icon: OverviewIcon },
    { id: 'learning', label: 'Nauka', Icon: LearningIcon },
    { id: 'progress', label: 'Postęp', Icon: ProgressIcon },
    { id: 'certificates', label: 'Certyfikaty', Icon: CertificateIcon },
    { id: 'achievements', label: 'Osiągnięcia', Icon: AchievementIcon },
    { id: 'ranking', label: 'Ranking', Icon: RankingIcon },
    { id: 'profile', label: 'Profil', Icon: ProfileIcon }
  ];

  // ============================================
  // RENDER OVERVIEW - GŁÓWNY DASHBOARD
  // ============================================
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Sekcja Statystyk - 4 karty */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Moduły */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BookIcon size={28} color="white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Moduły</p>
              <p className="text-3xl font-bold">{progress?.totalModules || 0}</p>
            </div>
          </div>
        </div>

        {/* Ukończone */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircleIcon size={28} color="white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ukończone</p>
              <p className="text-3xl font-bold text-emerald-500">{progress?.completedModules || 0}</p>
            </div>
          </div>
        </div>

        {/* Czas nauki */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <ClockIcon size={28} color="white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Czas nauki</p>
              <p className="text-3xl font-bold">{progress ? `${Math.round(progress.totalStudyTime / 60)}h` : '0h'}</p>
            </div>
          </div>
        </div>

        {/* Certyfikaty */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <CertificateIcon size={28} color="white" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Certyfikaty</p>
              <p className="text-3xl font-bold text-purple-500">{certificates.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak + Ranking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pasa uczenia (Streak) */}
        <div className={`${darkMode ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50' : 'bg-gradient-to-br from-orange-50 to-red-50'} rounded-2xl p-6 border ${darkMode ? 'border-orange-800' : 'border-orange-200'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StreakIcon size={24} color="#f97316" />
                <h3 className={`text-lg font-bold ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>Pasa nauki</h3>
              </div>
              <p className={`text-5xl font-black ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {userPoints?.streak_days || 0}
                <span className="text-2xl font-bold ml-1">dni</span>
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-orange-300/80' : 'text-orange-700'}`}>
                🔥 Kontynuuj naukę, aby utrzymać passę!
              </p>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
        </div>

        {/* Mini Ranking Widget */}
        <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-2xl p-6 border ${darkMode ? 'border-blue-800' : 'border-blue-200'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrophyIcon size={24} color="#3b82f6" />
                <h3 className={`text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Twój ranking</h3>
              </div>
              <p className={`text-5xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                #{getUserRank() || '—'}
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-blue-300/80' : 'text-blue-700'}`}>
                Lepszy od {getPercentileBelowUser()}% studentów
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Punkty</p>
              <p className="text-2xl font-bold">{userPoints?.total_points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid z Postępy + Ostatnia aktywność */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Postępy w nauce */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ChartIcon size={24} color="#3b82f6" />
              Postępy w nauce
            </h3>
            <CustomButton
              variant="outline"
              size="sm"
              darkMode={darkMode}
              onClick={() => setActiveTab('progress')}
            >
              Zobacz wszystko
            </CustomButton>
          </div>
          <div className="space-y-5">
            {subjectProgress.slice(0, 4).map((subject) => (
              <div key={subject.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{subject.name}</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {subject.completedModules}/{subject.totalModules} modułów
                  </span>
                </div>
                <div className="relative">
                  <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                    />
                  </div>
                  <span className="absolute right-0 -top-6 text-sm font-bold" style={{ color: subject.color }}>
                    {subject.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/edukacja');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className={`w-full mt-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            <LearningIcon size={20} color="white" />
            Kontynuuj naukę
          </button>
        </div>

        {/* Ostatnia aktywność */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <ClockIcon size={24} color="#f97316" />
            Ostatnia aktywność
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.title}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.description}
                  </p>
                </div>
                <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Osiągnięcia - mini preview */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AchievementIcon size={24} color="#eab308" />
            Osiągnięcia
          </h3>
          <CustomButton
            variant="outline"
            size="sm"
            darkMode={darkMode}
            onClick={() => setActiveTab('achievements')}
          >
            Zobacz wszystkie
          </CustomButton>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-xl text-center transition-all ${achievement.unlocked
                ? darkMode ? 'bg-yellow-900/30 border-2 border-yellow-500/50' : 'bg-yellow-50 border-2 border-yellow-400'
                : darkMode ? 'bg-gray-700/50 opacity-50' : 'bg-gray-100 opacity-50'
                }`}
              title={achievement.description}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className={`text-xs font-medium truncate ${achievement.unlocked
                ? darkMode ? 'text-yellow-300' : 'text-yellow-800'
                : darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                {achievement.title}
              </p>
              {!achievement.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER LEARNING
  // ============================================
  const renderLearning = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <LearningIcon size={48} color="white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Rozpocznij naukę</h2>
          <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Przejdź do sekcji edukacyjnej, aby rozpocząć naukę lub kontynuować rozpoczęte moduły.
            Mamy dla Ciebie dziesiątki kursów z różnych dziedzin medycyny!
          </p>
          <CustomButton
            variant="primary"
            darkMode={darkMode}
            onClick={() => {
              window.history.pushState({}, '', '/edukacja');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            icon={<ArrowRightIcon size={20} color="white" />}
            className="px-8 py-4 text-lg"
          >
            Przejdź do nauki
          </CustomButton>
        </div>
      </div>

      {/* Lista kursów w trakcie */}
      {subjectProgress.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className="text-xl font-bold mb-6">Kursy w trakcie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectProgress.map((subject) => (
              <div
                key={subject.id}
                className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">{subject.name}</h4>
                  <CustomBadge
                    variant={subject.progress >= 75 ? 'success' : subject.progress >= 50 ? 'warning' : 'info'}
                    darkMode={darkMode}
                    size="sm"
                  >
                    {subject.progress}%
                  </CustomBadge>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                  />
                </div>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {subject.completedModules} z {subject.totalModules} modułów ukończonych
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER PROGRESS
  // ============================================
  const renderProgress = () => (
    <div className="space-y-6">
      {/* Ogólny postęp */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className="text-xl font-bold mb-6">Ogólny postęp nauki</h3>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Średni postęp</span>
            <span className="font-bold text-blue-500">{progress?.averageProgress || 0}%</span>
          </div>
          <div className={`w-full h-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progress?.averageProgress || 0}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold">{progress?.totalModules || 0}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wszystkie moduły</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-emerald-500">{progress?.completedModules || 0}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ukończone</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-500">{progress?.inProgressModules || 0}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>W trakcie</p>
          </div>
        </div>
      </div>

      {/* Szczegółowy postęp per przedmiot */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className="text-xl font-bold mb-6">Postęp według przedmiotów</h3>
        <div className="space-y-6">
          {subjectProgress.map((subject) => (
            <div key={subject.id}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {subject.completedModules}/{subject.totalModules}
                  </span>
                  <span className="font-bold" style={{ color: subject.color }}>
                    {subject.progress}%
                  </span>
                </div>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER CERTIFICATES
  // ============================================
  const renderCertificates = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h2 className="text-2xl font-bold mb-6">Moje certyfikaty</h2>
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <CertificateIcon size={48} color={darkMode ? '#a855f7' : '#9333ea'} />
            </div>
            <h3 className="text-xl font-bold mb-2">Brak certyfikatów</h3>
            <p className={`max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Nie masz jeszcze żadnych certyfikatów. Ukończ moduły i zdaj quizy, aby je zdobyć!
            </p>
            <CustomButton
              variant="primary"
              darkMode={darkMode}
              onClick={() => setActiveTab('learning')}
              className="mt-6"
            >
              Rozpocznij naukę
            </CustomButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`p-5 rounded-xl border-2 border-purple-500/50 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
                  } hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{cert.subjectName}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(cert.earnedAt).toLocaleDateString('pl-PL')}
                    </p>
                    <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Kod: <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>{cert.verificationCode}</code>
                    </p>
                  </div>
                  <CertificateIcon size={40} color="#a855f7" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ============================================
  // RENDER ACHIEVEMENTS
  // ============================================
  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Statystyki gamifikacji */}
      {userPoints && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow">
                <PointsIcon size={24} color="white" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Punkty</p>
                <p className="text-2xl font-bold">{userPoints.total_points}</p>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow">
                <LevelIcon size={24} color="white" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Poziom</p>
                <p className="text-2xl font-bold">{userPoints.level}</p>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow">
                <StreakIcon size={24} color="white" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Seria dni</p>
                <p className="text-2xl font-bold">{userPoints.streak_days}</p>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow">
                <AchievementIcon size={24} color="white" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Osiągnięcia</p>
                <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Postęp do następnego poziomu */}
      {userPoints && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className="text-xl font-bold mb-4">Postęp do poziomu {userPoints.level + 1}</h3>
          <div className="flex justify-between mb-2">
            <span>Doświadczenie</span>
            <span className="font-bold">{userPoints.experience} / {userPoints.experience_to_next_level}</span>
          </div>
          <div className={`w-full h-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(userPoints.experience / userPoints.experience_to_next_level) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Badge'y osiągnięć */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className="text-xl font-bold mb-6">Wszystkie osiągnięcia</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-6 rounded-xl text-center transition-all hover:scale-105 ${achievement.unlocked
                ? darkMode
                  ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-2 border-yellow-500/50'
                  : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400'
                : darkMode
                  ? 'bg-gray-700/50 border border-gray-600'
                  : 'bg-gray-100 border border-gray-200'
                }`}
            >
              <div className={`text-5xl mb-3 ${!achievement.unlocked ? 'grayscale opacity-50' : ''}`}>
                {achievement.icon}
              </div>
              <h4 className={`font-bold mb-1 ${achievement.unlocked
                ? darkMode ? 'text-yellow-300' : 'text-yellow-800'
                : darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                {achievement.title}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {achievement.description}
              </p>
              {achievement.earnedAt && (
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(achievement.earnedAt).toLocaleDateString('pl-PL')}
                </p>
              )}
              {!achievement.unlocked && (
                <div className="absolute top-2 right-2 text-2xl">🔒</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aktywne misje */}
      {quests.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ProgressIcon size={24} color="#3b82f6" />
            Aktywne misje
          </h3>
          <div className="space-y-4">
            {quests.slice(0, 5).map((quest) => (
              <div key={quest.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{quest.quest?.title || 'Misja'}</h4>
                  {quest.is_completed ? (
                    <CustomBadge variant="success" darkMode={darkMode} size="sm">Ukończona</CustomBadge>
                  ) : (
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {quest.current_progress} / {quest.target_progress}
                    </span>
                  )}
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min((quest.current_progress / quest.target_progress) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER RANKING
  // ============================================
  const renderRanking = () => (
    <div className="space-y-6">
      {/* Miejsce użytkownika */}
      {userPoints && (
        <div className={`${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} rounded-2xl p-8 shadow-lg border-2 ${darkMode ? 'border-blue-500/50' : 'border-blue-400'}`}>
          <h3 className="text-xl font-bold mb-6">Twoje miejsce w rankingu</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pozycja</p>
              <p className="text-5xl font-black text-blue-500">#{getUserRank() || '?'}</p>
            </div>
            <div className="text-center">
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Punkty</p>
              <p className="text-5xl font-black">{userPoints.total_points}</p>
            </div>
            <div className="text-center">
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Poziom</p>
              <p className="text-5xl font-black text-purple-500">{userPoints.level}</p>
            </div>
          </div>
          <p className={`text-center mt-6 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            🏆 Jesteś lepszy od {getPercentileBelowUser()}% studentów na platformie!
          </p>
        </div>
      )}

      {/* Top 10 */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className="text-xl font-bold mb-6">Top 10 studentów</h3>
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <RankingIcon size={64} color={darkMode ? '#4b5563' : '#9ca3af'} className="mx-auto mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Ranking jest jeszcze pusty
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${user.isCurrentUser
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-500'
                  : darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900' :
                          darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold">
                      {user.name} {user.isCurrentUser && <span className="text-blue-500">(Ty)</span>}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Poziom {user.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{user.total_points}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>punktów</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status lojalnościowy */}
      {loyaltyStatus && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className="text-xl font-bold mb-6">Status lojalnościowy</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                {loyaltyStatus.tier === 'platinum' ? '💎 Platyna' :
                  loyaltyStatus.tier === 'gold' ? '🥇 Złoto' :
                    loyaltyStatus.tier === 'silver' ? '🥈 Srebro' : '🥉 Brąz'}
              </span>
              <span className={`font-bold ${loyaltyStatus.tier === 'platinum' ? 'text-purple-500' :
                loyaltyStatus.tier === 'gold' ? 'text-yellow-500' :
                  loyaltyStatus.tier === 'silver' ? 'text-gray-400' : 'text-orange-600'
                }`}>
                {Math.round(loyaltyStatus.progressToNext)}% do następnego
              </span>
            </div>
            <div className={`w-full h-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-4 rounded-full transition-all ${loyaltyStatus.tier === 'platinum' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  loyaltyStatus.tier === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    loyaltyStatus.tier === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                      'bg-gradient-to-r from-orange-600 to-orange-800'
                  }`}
                style={{ width: `${loyaltyStatus.progressToNext}%` }}
              />
            </div>
          </div>
          {loyaltyStatus.benefits.length > 0 && (
            <div>
              <p className="font-medium mb-2">Twoje korzyści:</p>
              <ul className="space-y-1">
                {loyaltyStatus.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon size={16} color="#10b981" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER PROFILE
  // ============================================
  const renderProfile = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mój profil</h2>
        {!editing && (
          <CustomButton
            variant="primary"
            size="sm"
            darkMode={darkMode}
            onClick={() => setEditing(true)}
            icon={<EditIcon size={18} color="white" />}
          >
            Edytuj
          </CustomButton>
        )}
      </div>

      {editing ? (
        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                  }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Nazwisko</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                  }`}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-2">Uczelnia</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                }`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Rok studiów</label>
              <input
                type="number"
                min="1"
                max="6"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value ? parseInt(e.target.value) : '')}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                  }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                  }`}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-2">O mnie</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                }`}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <CustomButton
              variant="success"
              darkMode={darkMode}
              onClick={handleUpdateProfile}
              icon={<SaveIcon size={18} color="white" />}
            >
              Zapisz zmiany
            </CustomButton>
            <CustomButton
              variant="secondary"
              darkMode={darkMode}
              onClick={() => { setEditing(false); initializeForm(); }}
              icon={<CancelIcon size={18} color={darkMode ? 'white' : 'gray'} />}
            >
              Anuluj
            </CustomButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Imię i nazwisko</p>
            <p className="text-lg font-medium">{firstName} {lastName}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uczelnia</p>
            <p className="text-lg font-medium">{institution || 'Nie podano'}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rok studiów</p>
            <p className="text-lg font-medium">{yearOfStudy || 'Nie podano'}</p>
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Telefon</p>
            <p className="text-lg font-medium">{phone || 'Nie podano'}</p>
          </div>
          {bio && (
            <div className="md:col-span-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>O mnie</p>
              <p className="text-lg">{bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* HERO SECTION */}
        <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-800/80' : 'bg-gradient-to-r from-white to-blue-50'} rounded-2xl p-6 md:p-8 shadow-xl mb-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className={`w-20 h-20 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center shadow-lg`}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <StudentIcon size={40} color="white" />
                  )}
                </div>
                {userPoints && userPoints.streak_days > 0 && (
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    🔥 {userPoints.streak_days}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Panel Studenta
                </h1>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Witaj, {firstName || user?.email}!
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Twoje postępy i aktywność na platformie
                </p>
              </div>
            </div>

            {/* Przyciski */}
            <div className="flex items-center gap-3">
              <CustomButton
                variant="outline"
                darkMode={darkMode}
                onClick={() => setActiveTab('profile')}
                icon={<EditIcon size={18} color={darkMode ? '#9ca3af' : '#6b7280'} />}
              >
                Edytuj profil
              </CustomButton>

              {/* Menu użytkownika */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <SettingsIcon size={24} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } z-50`}>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 rounded-xl transition-colors text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                    >
                      <LogoutIcon size={18} color="#ef4444" />
                      Wyloguj się
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TAB MENU */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg mb-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} sticky top-4 z-40`}>
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-max flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === tab.id
                  ? 'text-blue-500'
                  : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
              >
                <tab.Icon
                  size={20}
                  color={activeTab === tab.id ? '#3b82f6' : darkMode ? '#9ca3af' : '#6b7280'}
                />
                <span className="hidden sm:inline">{tab.label}</span>

                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'learning' && renderLearning()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'certificates' && renderCertificates()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'ranking' && renderRanking()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
