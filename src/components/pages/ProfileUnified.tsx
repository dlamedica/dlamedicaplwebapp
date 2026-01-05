/**
 * Unified Profile Page (/profil)
 * Jeden spójny schemat profilu dla wszystkich ról z zakładkami.
 */

import { MockProfileService } from '../../services/mockProfileService';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  OverviewIcon,
  LearningIcon,
  BriefcaseIcon,
  CalendarIcon,
  CartIcon,
  HeartIcon,
  SettingsIcon,
  ChainIcon,
  StatsIcon,
  CertificateIcon,
  CheckCircleIcon,
  ClockIcon,
  StreakIcon,
  PointsIcon,
  LevelIcon,
  AchievementIcon,
  RankingIcon,
  LogoutIcon,
  EditIcon,
  DownloadIcon,
} from '../../components/icons/CustomIcons';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomBadge } from '../../components/ui/CustomBadge';
import StudentDashboard from './StudentDashboard';

interface ProfileUnifiedProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

type TabId =
  | 'overview'
  | 'education'
  | 'career'
  | 'events'
  | 'shop'
  | 'favorites'
  | 'tools'
  | 'settings';

const ProfileUnified: React.FC<ProfileUnifiedProps> = ({ darkMode, fontSize }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState<{ [K in TabId]?: boolean }>({ overview: true });
  const [errors, setErrors] = useState<{ [K in TabId]?: string }>({});

  // Edycja profilu
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    profession: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [careerData, setCareerData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [toolsData, setToolsData] = useState<any>(null);
  const [accountData, setAccountData] = useState<any>(null);

  const fontSizeClasses = {
    small: { title: 'text-lg', subtitle: 'text-base', text: 'text-sm' },
    medium: { title: 'text-xl', subtitle: 'text-lg', text: 'text-base' },
    large: { title: 'text-2xl', subtitle: 'text-xl', text: 'text-lg' },
  };
  const fontSizes = fontSizeClasses[fontSize];

  const toolsSummaryFallback = {
    pinned: [],
    recent: [],
  };

  const tabs = useMemo(() => {
    const base: Array<{ id: TabId; label: string; Icon: React.FC<any> }> = [
      { id: 'overview', label: 'Przegląd', Icon: OverviewIcon },
      { id: 'education', label: 'Edukacja', Icon: LearningIcon },
      { id: 'career', label: 'Praca i kariera', Icon: BriefcaseIcon },
      { id: 'events', label: 'Wydarzenia', Icon: CalendarIcon },
      { id: 'shop', label: 'Sklep i zakupy', Icon: CartIcon },
      { id: 'favorites', label: 'Ulubione', Icon: HeartIcon },
      { id: 'tools', label: 'Narzędzia', Icon: ChainIcon },
      { id: 'settings', label: 'Ustawienia konta', Icon: SettingsIcon },
    ];
    // Widoczność warunkowa (w razie potrzeby można filtrować po roli)
    return base;
  }, []);


  const loadOverview = async () => {
    setLoading((s) => ({ ...s, overview: true }));
    setErrors((s) => ({ ...s, overview: undefined }));
    try {
      // Use MockProfileService
      const data = await MockProfileService.getOverview(user);
      setOverviewData(data);
    } catch (e: any) {
      console.error('Profile load error:', e);
      setErrors((s) => ({ ...s, overview: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, overview: false }));
    }
  };

  const loadCareer = async () => {
    if (careerData || loading.career) return;
    setLoading((s) => ({ ...s, career: true }));
    setErrors((s) => ({ ...s, career: undefined }));
    try {
      const data = await MockProfileService.getCareer();
      setCareerData(data);
    } catch (e: any) {
      setErrors((s) => ({ ...s, career: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, career: false }));
    }
  };

  const loadEvents = async () => {
    if (eventsData || loading.events) return;
    setLoading((s) => ({ ...s, events: true }));
    setErrors((s) => ({ ...s, events: undefined }));
    try {
      const data = await MockProfileService.getEvents();
      setEventsData(data);
    } catch (e: any) {
      setErrors((s) => ({ ...s, events: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, events: false }));
    }
  };

  const loadStore = async () => {
    if (storeData || loading.shop) return;
    setLoading((s) => ({ ...s, shop: true }));
    setErrors((s) => ({ ...s, shop: undefined }));
    try {
      const data = await MockProfileService.getStore();
      setStoreData(data);
    } catch (e: any) {
      setErrors((s) => ({ ...s, shop: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, shop: false }));
    }
  };

  const loadFavorites = async () => {
    if (overviewData?.favorites || loading.favorites) return; // favorities usually loaded with overview
    setLoading((s) => ({ ...s, favorites: true }));
    setErrors((s) => ({ ...s, favorites: undefined }));
    try {
      const data = await MockProfileService.getFavorites();
      setOverviewData((prev: any) => ({ ...(prev || {}), favorites: data }));
    } catch (e: any) {
      setErrors((s) => ({ ...s, favorites: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, favorites: false }));
    }
  };

  const loadTools = async () => {
    if (toolsData || loading.tools) return;
    setLoading((s) => ({ ...s, tools: true }));
    setErrors((s) => ({ ...s, tools: undefined }));
    try {
      const data = await MockProfileService.getTools();
      setToolsData(data);
    } catch (e: any) {
      setErrors((s) => ({ ...s, tools: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, tools: false }));
    }
  };

  const loadAccount = async () => {
    if (accountData || loading.settings) return;
    setLoading((s) => ({ ...s, settings: true }));
    setErrors((s) => ({ ...s, settings: undefined }));
    try {
      const data = await MockProfileService.getAccount(user);
      setAccountData(data);
    } catch (e: any) {
      setErrors((s) => ({ ...s, settings: e?.message || 'Błąd ładowania' }));
    } finally {
      setLoading((s) => ({ ...s, settings: false }));
    }
  };

  useEffect(() => {
    if (user) {
      loadOverview();
    }
  }, [user]);

  // Inicjalizuj formularz edycji gdy profil się załaduje
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        profession: profile.profession || '',
      });
    }
  }, [profile]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
    // Przywróć oryginalne wartości
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        profession: profile.profession || '',
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await updateProfile(editForm);
      if (error) {
        setSaveError(error.message || 'Błąd podczas zapisywania');
      } else {
        setSaveSuccess(true);
        setIsEditing(false);
        // Odśwież dane
        loadOverview();
        loadAccount();
      }
    } catch (e: any) {
      setSaveError(e.message || 'Nieoczekiwany błąd');
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'career') loadCareer();
    if (activeTab === 'events') loadEvents();
    if (activeTab === 'shop') loadStore();
    if (activeTab === 'favorites') loadFavorites();
    if (activeTab === 'tools') loadTools();
    if (activeTab === 'settings') loadAccount();
  }, [activeTab]);

  const renderOverview = () => (
    <div className="space-y-4">
      {loading.overview && (
        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} py-4`}>Ładowanie danych...</div>
      )}
      {errors.overview && (
        <div className="text-red-500 py-2 text-sm">Nie udało się załadować danych. {errors.overview}</div>
      )}
      {!overviewData && !loading.overview && (
        <div className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} py-4`}>Brak danych do wyświetlenia.</div>
      )}

      <div className="space-y-6">
        {/* Boxy skrótów */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <StatsIcon size={24} color="#3b82f6" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Edukacja</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Ukończone</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {overviewData?.education?.modulesCompleted || 0}/{overviewData?.education?.modulesTotal || 0}
                  </p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Czas (tyg.)</p>
                  <p className="text-2xl font-bold text-blue-500">{overviewData?.education?.studyTimeHours || 0}h</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Streak</p>
                  <p className="text-2xl font-bold text-orange-500">{overviewData?.education?.streakDays || 0} dni</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Certyfikaty</p>
                  <p className="text-2xl font-bold text-purple-500">{overviewData?.education?.certificatesCount || 0}</p>
                </div>
              </div>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('education')}
              >
                Przejdź do edukacji
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <BriefcaseIcon size={24} color="#10b981" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Praca</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Zapisane</p>
                  <p className="text-2xl font-bold text-emerald-500">{overviewData?.career?.savedOffersCount || 0}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Wysłane</p>
                  <p className="text-2xl font-bold text-blue-500">{overviewData?.career?.applicationsCount || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className={`${fontSizes.text} text-gray-500`}>Alerty pracy</p>
                  <p className="text-lg font-semibold">{overviewData?.career?.activeAlertsCount || 0} aktywne</p>
                </div>
              </div>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('career')}
              >
                Zobacz oferty
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <CalendarIcon size={24} color="#f97316" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Wydarzenia</h3>
              </div>
              <div className="space-y-2">
                <p className={`${fontSizes.text} text-gray-500`}>Najbliższe</p>
                <p className="font-semibold">{overviewData?.events?.nextEvent?.title || 'Brak wydarzeń'}</p>
                <p className={`${fontSizes.text} text-gray-500`}>{overviewData?.events?.nextEvent?.date || '—'}</p>
                <p className={`${fontSizes.text} text-gray-500`}>Zapisane: {overviewData?.events?.upcomingCount || 0}</p>
              </div>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('events')}
              >
                Przejdź do wydarzeń
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <CartIcon size={24} color="#3b82f6" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Sklep</h3>
              </div>
              <p className={`${fontSizes.text} text-gray-500`}>Ostatni zakup</p>
              <p className="font-semibold">{overviewData?.store?.lastOrderNumber || 'Brak zamówień'}</p>
              <p className={`${fontSizes.text} text-gray-500`}>Do pobrania: {overviewData?.store?.downloadsAvailable || 0}</p>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('shop')}
              >
                Moje zakupy
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <HeartIcon size={24} color="#ef4444" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Ulubione</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Artykuły</p>
                  <p className="text-xl font-bold">{overviewData?.favorites?.articles || 0}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Kursy</p>
                  <p className="text-xl font-bold">{overviewData?.favorites?.courses || 0}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Produkty</p>
                  <p className="text-xl font-bold">{overviewData?.favorites?.products || 0}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Oferty pracy</p>
                  <p className="text-xl font-bold">{overviewData?.favorites?.jobOffers || 0}</p>
                </div>
              </div>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('favorites')}
              >
                Zobacz ulubione
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard darkMode={darkMode} variant="elevated">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <ChainIcon size={24} color="#8b5cf6" />
                <h3 className={`${fontSizes.subtitle} font-bold`}>Narzędzia</h3>
              </div>
              <p className={`${fontSizes.text} text-gray-500`}>Przypięte</p>
              <div className="flex flex-wrap gap-2">
                {(overviewData?.tools?.pinned || toolsSummaryFallback.pinned).map((tool, idx) => (
                  <CustomBadge key={tool.tool_id || idx} variant="info" darkMode={darkMode} size="sm">
                    {tool.name || tool.key || 'Narzędzie'}
                  </CustomBadge>
                ))}
              </div>
              <p className={`${fontSizes.text} text-gray-500`}>Ostatnio użyte</p>
              <div className="flex flex-wrap gap-2">
                {(toolsData?.recent || toolsSummaryFallback.recent).slice(0, 3).map((tool, idx) => (
                  <CustomBadge key={tool.tool_id || idx} variant="default" darkMode={darkMode} size="sm">
                    {tool.name || tool.key || 'Narzędzie'}
                  </CustomBadge>
                ))}
              </div>
              <CustomButton
                variant="primary"
                darkMode={darkMode}
                onClick={() => setActiveTab('tools')}
              >
                Otwórz narzędzia
              </CustomButton>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      {/* Osadzony panel studenta – pełny układ */}
      <StudentDashboard darkMode={darkMode} fontSize={fontSize} />
    </div>
  );

  const renderCareer = () => (
    <div className="space-y-6">
      {loading.career && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.career && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.career}</p>}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <BriefcaseIcon size={24} color="#3b82f6" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Moje aplikacje</h3>
          </div>
          <div className="space-y-3">
            {(careerData?.applications || []).map((app: any) => (
              <div
                key={app.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <div>
                  <p className="font-medium">{app.position_title || app.positionTitle}</p>
                  <p className={`${fontSizes.text} text-gray-500`}>{app.applied_at || app.appliedAt}</p>
                </div>
                <CustomBadge
                  variant={app.status === 'in_review' ? 'warning' : app.status === 'rejected' ? 'error' : 'info'}
                  darkMode={darkMode}
                  size="sm"
                >
                  {app.status}
                </CustomBadge>
              </div>
            ))}
            {!(careerData?.applications || []).length && !loading.career && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak aplikacji.</p>
            )}
          </div>
        </div>
      </CustomCard>

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <HeartIcon size={20} color="#ef4444" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Zapisane oferty</h3>
          </div>
          <div className="space-y-2">
            {(careerData?.savedOffers || []).map((offer: any) => (
              <div
                key={offer.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <span className="font-medium">{offer.position_title || offer.positionTitle}</span>
                <CustomButton variant="outline" size="sm" darkMode={darkMode}>
                  Otwórz
                </CustomButton>
              </div>
            ))}
            {!(careerData?.savedOffers || []).length && !loading.career && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak zapisanych ofert.</p>
            )}
          </div>
        </div>
      </CustomCard>

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <StatsIcon size={20} color="#10b981" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Alerty pracy</h3>
          </div>
          <div className="space-y-2">
            {(careerData?.alerts || []).map((alert: any) => (
              <div
                key={alert.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <span className="font-medium">
                  {alert.specialization} • {alert.location} {alert.salary_range_from ? `• ${alert.salary_range_from}-${alert.salary_range_to || ''}` : ''}
                </span>
                <CustomBadge variant="success" darkMode={darkMode} size="sm">
                  {alert.is_active ? 'ON' : 'OFF'}
                </CustomBadge>
              </div>
            ))}
            {!(careerData?.alerts || []).length && !loading.career && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak alertów pracy.</p>
            )}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      {loading.events && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.events && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.events}</p>}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <CalendarIcon size={24} color="#3b82f6" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Nadchodzące wydarzenia</h3>
          </div>
          <div className="space-y-2">
            {(eventsData?.upcoming || []).map((event: any) => (
              <div
                key={event.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className={`${fontSizes.text} text-gray-500`}>{event.date}</p>
                </div>
                <CustomBadge variant="info" darkMode={darkMode} size="sm">
                  {event.type}
                </CustomBadge>
              </div>
            ))}
            {!(eventsData?.upcoming || []).length && !loading.events && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak nadchodzących wydarzeń.</p>
            )}
          </div>
        </div>
      </CustomCard>

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <CertificateIcon size={20} color="#a855f7" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Historia wydarzeń</h3>
          </div>
          <div className="space-y-2">
            {(eventsData?.history || []).map((item: any) => (
              <div
                key={item.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.title}</span>
                  <CustomBadge variant={item.status === 'attended' ? 'success' : 'default'} darkMode={darkMode} size="sm">
                    {item.status}
                  </CustomBadge>
                </div>
              </div>
            ))}
            {!(eventsData?.history || []).length && !loading.events && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak historii wydarzeń.</p>
            )}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-6">
      {loading.shop && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.shop && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.shop}</p>}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <CartIcon size={24} color="#3b82f6" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Moje zakupy</h3>
          </div>
          <div className="space-y-2">
            {(storeData?.orders || []).map((order: any) => (
              <div
                key={order.id}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <div>
                  <p className="font-medium">{order.order_number || order.orderNumber}</p>
                  <p className={`${fontSizes.text} text-gray-500`}>{order.created_at} • {order.total_amount || order.totalAmount}</p>
                </div>
                <CustomBadge variant="success" darkMode={darkMode} size="sm">
                  {order.status}
                </CustomBadge>
              </div>
            ))}
            {!(storeData?.orders || []).length && !loading.shop && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak zamówień.</p>
            )}
          </div>
        </div>
      </CustomCard>

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <DownloadIcon size={20} color="#10b981" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Produkty do pobrania</h3>
          </div>
          <div className="space-y-2">
            {(storeData?.downloads || []).map((item: any) => (
              <div
                key={item.product_id || item.productId}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <span>{item.title}</span>
                <CustomButton variant="primary" size="sm" darkMode={darkMode} onClick={() => { window.open(item.download_url || item.downloadUrl, '_blank'); }}>
                  Pobierz
                </CustomButton>
              </div>
            ))}
            {!(storeData?.downloads || []).length && !loading.shop && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak plików do pobrania.</p>
            )}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      {loading.favorites && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.favorites && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.favorites}</p>}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <HeartIcon size={24} color="#ef4444" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Ulubione</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['Artykuły', overviewData?.favorites?.articles || 0],
              ['Kursy', overviewData?.favorites?.courses || 0],
              ['Produkty', overviewData?.favorites?.products || 0],
              ['Uczelnie', overviewData?.favorites?.universities || 0],
              ['Oferty pracy', overviewData?.favorites?.jobOffers || 0],
              ['Narzędzia', overviewData?.favorites?.tools || 0],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} p-3 rounded-lg border flex items-center justify-between`}
              >
                <span className="font-medium">{label}</span>
                <span className="text-xl font-bold">{value as number}</span>
              </div>
            ))}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderTools = () => (
    <div className="space-y-6">
      {loading.tools && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.tools && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.tools}</p>}
      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <ChainIcon size={24} color="#8b5cf6" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Przypięte narzędzia</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(toolsData?.pinned || []).map((tool, idx) => (
              <CustomBadge key={tool.tool_id || tool.key || idx} variant="info" darkMode={darkMode} size="md">
                {tool.name || tool.key || 'Narzędzie'}
              </CustomBadge>
            ))}
            {!toolsData?.pinned?.length && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak przypiętych narzędzi</p>
            )}
          </div>
        </div>
      </CustomCard>

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <StatsIcon size={24} color="#3b82f6" />
            <h3 className={`${fontSizes.subtitle} font-bold`}>Ostatnio używane</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(toolsData?.recent || []).map((tool, idx) => (
              <CustomBadge key={tool.tool_id || tool.key || idx} variant="default" darkMode={darkMode} size="md">
                {tool.name || tool.key || 'Narzędzie'}
              </CustomBadge>
            ))}
            {!toolsData?.recent?.length && (
              <p className={`${fontSizes.text} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Brak ostatnich narzędzi</p>
            )}
          </div>
        </div>
      </CustomCard>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {loading.settings && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ładowanie...</p>}
      {errors.settings && <p className="text-red-500 text-sm">Nie udało się załadować danych: {errors.settings}</p>}

      {/* Komunikaty sukcesu/błędu */}
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Profil został zaktualizowany!
        </div>
      )}
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {saveError}
        </div>
      )}

      <CustomCard darkMode={darkMode} variant="elevated">
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SettingsIcon size={24} color="#3b82f6" />
              <h3 className={`${fontSizes.subtitle} font-bold`}>Dane konta</h3>
            </div>
            {!isEditing && (
              <CustomButton variant="outline" darkMode={darkMode} onClick={handleStartEdit} icon={<EditIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />}>
                Edytuj
              </CustomButton>
            )}
          </div>

          {isEditing ? (
            /* TRYB EDYCJI */
            <div className="space-y-4">
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Imię i nazwisko</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label className={`block ${fontSizes.text} font-medium mb-1`}>Zawód</label>
                <select
                  value={editForm.profession}
                  onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Wybierz zawód</option>
                  <option value="lekarz">Lekarz</option>
                  <option value="pielęgniarka">Pielęgniarka/Pielęgniarz</option>
                  <option value="fizjoterapeuta">Fizjoterapeuta</option>
                  <option value="farmaceuta">Farmaceuta</option>
                  <option value="ratownik_medyczny">Ratownik medyczny</option>
                  <option value="diagnosta">Diagnosta laboratoryjny</option>
                  <option value="student">Student medycyny</option>
                  <option value="inne">Inne</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <CustomButton
                  variant="primary"
                  darkMode={darkMode}
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </CustomButton>
                <CustomButton variant="outline" darkMode={darkMode} onClick={handleCancelEdit}>
                  Anuluj
                </CustomButton>
              </div>
            </div>
          ) : (
            /* TRYB PODGLĄDU */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Imię i nazwisko</p>
                  <p className="font-semibold">{profile?.full_name || '—'}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Email</p>
                  <p className="font-semibold">{user?.email || '—'}</p>
                </div>
                <div>
                  <p className={`${fontSizes.text} text-gray-500`}>Zawód</p>
                  <p className="font-semibold">{profile?.profession || '—'}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <CustomButton variant="danger" darkMode={darkMode} onClick={signOut} icon={<LogoutIcon size={18} color="white" />}>
                  Wyloguj się
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </CustomCard>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="max-w-[1280px] mx-auto px-4 py-6 space-y-4">
        {/* HERO */}
        <CustomCard darkMode={darkMode} variant="elevated">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center text-white font-bold text-xl`}>
                {profile?.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className={`${fontSizes.title} font-bold`}>Twój profil</h1>
                <p className={`${fontSizes.text} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Witaj, {profile?.first_name || user?.email}!
                </p>
                <p className="text-sm text-blue-500">Jeden profil dla edukacji, pracy, wydarzeń i zakupów</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CustomButton
                variant="outline"
                darkMode={darkMode}
                icon={<EditIcon size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />}
                onClick={() => { setActiveTab('settings'); handleStartEdit(); }}
              >
                Edytuj profil
              </CustomButton>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className={`p-3 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <SettingsIcon size={22} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </button>
                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      } z-50`}
                  >
                    <button
                      onClick={() => { setShowUserMenu(false); signOut(); }}
                      className={`w-full text-left px-4 py-3 text-red-500 flex items-center gap-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <LogoutIcon size={18} color="#ef4444" />
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CustomCard>

        {/* TABS */}
        <CustomCard darkMode={darkMode} variant="default">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max px-5 py-4 flex items-center justify-center gap-2 font-medium transition-colors relative ${activeTab === tab.id
                  ? 'text-blue-500'
                  : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
                  }`}
              >
                <tab.Icon size={18} color={activeTab === tab.id ? '#3b82f6' : darkMode ? '#9ca3af' : '#6b7280'} />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
            ))}
          </div>
        </CustomCard>

        {/* CONTENT */}
        <div className="pb-10">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'career' && renderCareer()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'shop' && renderShop()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'tools' && renderTools()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default ProfileUnified;

