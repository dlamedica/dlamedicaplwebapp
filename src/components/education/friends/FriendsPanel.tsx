import React, { useState, useEffect } from 'react';
import { 
  UsersIcon,
  UserPlusIcon,
  UserCheckIcon,
  UserTimesIcon,
  SearchIcon,
  TimesIcon,
  CheckIcon,
  TrophyIcon,
  ChartLineIcon,
  EnvelopeIcon,
  FacebookIcon,
  GoogleIcon,
  LinkedinIcon,
  XTwitterIcon
} from '../../icons/PlatformIcons';
import { RippleButton, CountUp, AnimatedSection, ToastContainer, LoadingSpinner, EmptyState } from '../components';
import { SkeletonCard } from '../skeletons';
import { useToast } from '../../../hooks/useToast';
import '../styles/educationStyles.css';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getFriends,
  getPendingInvites,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendSocialInvite,
  searchUsers,
  type Friend,
  type FriendInvite
} from '../../../services/friendsService';

interface FriendsPanelProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  onClose?: () => void;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ darkMode, fontSize, onClose }) => {
  const { user } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'invite' | 'search'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    platform: 'email' as 'email' | 'facebook' | 'google' | 'linkedin' | 'twitter'
  });

  useEffect(() => {
    if (user) {
      loadFriends();
      loadPendingInvites();
    }
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;
    setLoading(true);
    const friendsList = await getFriends(user.id);
    setFriends(friendsList);
    setLoading(false);
  };

  const loadPendingInvites = async () => {
    if (!user) return;
    const invites = await getPendingInvites(user.id);
    setPendingInvites(invites);
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    const results = await searchUsers(term);
    setSearchResults(results);
    setLoading(false);
  };

  const handleSendRequest = async (friendId: string) => {
    if (!user) return;
    const success = await sendFriendRequest(user.id, friendId);
    if (success) {
      showSuccess('Wysłano zaproszenie do znajomych', 3000);
      await handleSearch(searchTerm);
      await loadPendingInvites();
    } else {
      showError('Nie udało się wysłać zaproszenia', 4000);
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    const success = await acceptFriendRequest(friendshipId);
    if (success) {
      showSuccess('Zaakceptowano zaproszenie', 3000);
      await loadFriends();
      await loadPendingInvites();
    } else {
      showError('Nie udało się zaakceptować zaproszenia', 4000);
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    const success = await rejectFriendRequest(friendshipId);
    if (success) {
      showSuccess('Odrzucono zaproszenie', 3000);
      await loadPendingInvites();
    } else {
      showError('Nie udało się odrzucić zaproszenia', 4000);
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego znajomego?')) {
      const success = await removeFriend(friendshipId);
      if (success) {
        showSuccess('Usunięto znajomego', 3000);
      } else {
        showError('Nie udało się usunąć znajomego', 4000);
      }
      if (success) {
        await loadFriends();
      }
    }
  };

  const handleSendSocialInvite = async () => {
    if (!user || !inviteData.email) return;
    
    const invite = await sendSocialInvite(
      user.id,
      inviteData.email,
      inviteData.name,
      inviteData.platform
    );

    if (invite) {
      // Tutaj można wysłać email/wiadomość przez API social media
      alert(`Zaproszenie zostało wysłane do ${inviteData.email}!`);
      setShowInviteModal(false);
      setInviteData({ email: '', name: '', platform: 'email' });
    }
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'small': return { title: 'text-xl', subtitle: 'text-lg', text: 'text-sm', button: 'text-sm' };
      case 'large': return { title: 'text-3xl', subtitle: 'text-xl', text: 'text-lg', button: 'text-lg' };
      default: return { title: 'text-2xl', subtitle: 'text-lg', text: 'text-base', button: 'text-base' };
    }
  };
  const fontSizes = getFontSizeClasses();

  return (
    <AnimatedSection animation="slideDown" delay={0}>
      <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} rounded-2xl shadow-xl p-6 max-w-4xl mx-auto education-glass border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${fontSizes.title} font-bold bg-gradient-to-r ${darkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
            Znajomi i Rywalizacja
          </h2>
          {onClose && (
            <RippleButton
              onClick={onClose}
              variant="secondary"
              darkMode={darkMode}
              className="p-2 rounded-lg"
            >
              <TimesIcon size={20} />
            </RippleButton>
          )}
        </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        {[
          { id: 'friends', label: 'Znajomi', icon: UsersIcon, count: friends.length },
          { id: 'requests', label: 'Zaproszenia', icon: UserCheckIcon, count: pendingInvites.length },
          { id: 'invite', label: 'Zaproś', icon: UserPlusIcon },
          { id: 'search', label: 'Szukaj', icon: SearchIcon },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'border-[#38b6ff] text-[#38b6ff] font-semibold'
                  : `${darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-600'} hover:text-[#38b6ff]`
              }`}
            >
              <IconComponent size={18} />
              <span className={fontSizes.text}>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#38b6ff] to-[#2a9fe5] text-white shadow-md' 
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-700'
                }`}>
                  <CountUp end={tab.count} duration={1000} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading && activeTab === 'friends' ? (
          <div className="space-y-4">
            <SkeletonCard darkMode={darkMode} count={3} />
          </div>
        ) : null}
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" variant="primary" darkMode={darkMode} text="Ładowanie znajomych..." />
              </div>
            ) : friends.length === 0 ? (
              <EmptyState
                icon={<UsersIcon size={64} />}
                title="Brak znajomych"
                description="Dodaj znajomych, aby rywalizować i śledzić swoje postępy razem!"
                actionLabel="Znajdź znajomych"
                onAction={() => setActiveTab('search')}
                darkMode={darkMode}
                variant="info"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map(friend => (
                  <div
                    key={friend.id}
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {friend.friend_profile?.avatar_url ? (
                          <img
                            src={friend.friend_profile.avatar_url}
                            alt={friend.friend_profile.first_name || 'User'}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <UsersIcon className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={48} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`${fontSizes.subtitle} font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {friend.friend_profile?.first_name && friend.friend_profile?.last_name
                            ? `${friend.friend_profile.first_name} ${friend.friend_profile.last_name}`
                            : friend.friend_profile?.email || 'Użytkownik'}
                        </h3>
                        <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {friend.friend_profile?.email}
                        </p>
                      </div>
                      <RippleButton
                        onClick={() => handleRemoveFriend(friend.id)}
                        variant="outline"
                        darkMode={darkMode}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Usuń znajomego"
                      >
                        <UserTimesIcon size={18} />
                      </RippleButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {pendingInvites.length === 0 ? (
              <EmptyState
                icon={<UserCheckIcon size={64} />}
                title="Brak oczekujących zaproszeń"
                description="Wszystkie zaproszenia zostały przetworzone. Sprawdź zakładkę znajomych!"
                darkMode={darkMode}
                variant="success"
              />
            ) : (
              <div className="space-y-4">
                {pendingInvites.map(invite => (
                  <div
                    key={invite.id}
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {invite.friend_profile?.avatar_url ? (
                            <img
                              src={invite.friend_profile.avatar_url}
                              alt={invite.friend_profile.first_name || 'User'}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <UsersIcon className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={48} />
                          )}
                        </div>
                        <div>
                          <h3 className={`${fontSizes.subtitle} font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {invite.friend_profile?.first_name && invite.friend_profile?.last_name
                              ? `${invite.friend_profile.first_name} ${invite.friend_profile.last_name}`
                              : invite.friend_profile?.email || 'Użytkownik'}
                          </h3>
                          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Chce dodać Cię do znajomych
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <RippleButton
                          onClick={() => handleAcceptRequest(invite.id)}
                          variant="primary"
                          darkMode={darkMode}
                          className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg"
                          title="Zaakceptuj"
                        >
                          <CheckIcon size={16} />
                        </RippleButton>
                        <RippleButton
                          onClick={() => handleRejectRequest(invite.id)}
                          variant="primary"
                          darkMode={darkMode}
                          className="p-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg"
                          title="Odrzuć"
                        >
                          <TimesIcon size={16} />
                        </RippleButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invite Tab */}
        {activeTab === 'invite' && (
          <div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Zaproś znajomych przez social media
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { platform: 'email', icon: EnvelopeIcon, label: 'Email', color: '#38b6ff' },
                  { platform: 'facebook', icon: FacebookIcon, label: 'Facebook', color: '#1877f2' },
                  { platform: 'google', icon: GoogleIcon, label: 'Google', color: '#ea4335' },
                  { platform: 'linkedin', icon: LinkedinIcon, label: 'LinkedIn', color: '#0077b5' },
                ].map(social => (
                  <button
                    key={social.platform}
                    onClick={() => {
                      setInviteData({ ...inviteData, platform: social.platform as any });
                      setShowInviteModal(true);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                    } hover:border-[#38b6ff] hover:shadow-lg`}
                  >
                    <social.icon size={32} style={{ color: social.color }} className="mx-auto mb-2" />
                    <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {social.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Szukaj użytkowników..."
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                />
                <RippleButton
                  onClick={() => handleSearch(searchTerm)}
                  variant="primary"
                  darkMode={darkMode}
                  className="px-4 py-2 rounded-lg"
                >
                  <SearchIcon size={18} />
                </RippleButton>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard darkMode={darkMode} count={3} />
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className={fontSizes.text}>Nie znaleziono użytkowników</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.first_name || 'User'}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <UsersIcon className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={48} />
                          )}
                        </div>
                        <div>
                          <h3 className={`${fontSizes.subtitle} font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.email}
                          </h3>
                          <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className="px-4 py-2 bg-[#38b6ff] text-white rounded-lg hover:bg-[#2a9fe5] flex items-center gap-2"
                      >
                        <UserPlusIcon size={18} />
                        Dodaj
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
            <h3 className={`${fontSizes.subtitle} font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Wyślij zaproszenie przez {inviteData.platform}
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block mb-2 ${fontSizes.text} ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email znajomego
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className={`block mb-2 ${fontSizes.text} ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Imię (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
                  placeholder="Jan Kowalski"
                />
              </div>
              <div className="flex gap-2">
                <RippleButton
                  onClick={handleSendSocialInvite}
                  variant="primary"
                  darkMode={darkMode}
                  className="flex-1 px-4 py-2 rounded-lg"
                >
                  Wyślij zaproszenie
                </RippleButton>
                <RippleButton
                  onClick={() => setShowInviteModal(false)}
                  variant="secondary"
                  darkMode={darkMode}
                  className="px-4 py-2 rounded-lg"
                >
                  Anuluj
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast} 
        darkMode={darkMode}
        position="top-right"
      />
    </AnimatedSection>
  );
};

export default FriendsPanel;

