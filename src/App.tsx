import React, { useState, useEffect, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { StudyFieldProvider } from './contexts/StudyFieldContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { GameProvider } from './contexts/GameContext';

// i18n initialization - must be imported before any component that uses translations
import './i18n';
import { ArticleLifecycleService } from './services/articleLifecycleService';
import { globalDataService } from './services/globalDataService';
import Header from './components/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import BugReportButton from './components/BugReportButton';
import NotificationPermissionPrompt from './components/notifications/NotificationPermissionPrompt';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingFallback from './components/LoadingFallback';
import { pageTitles } from './hooks/usePageTitle';

// Lazy-loaded komponenty stron (code splitting dla lepszej wydajności)
import * as LazyPages from './components/pages/lazyPages';

// Importy kalkulatorów (pozostają synchroniczne, bo są małe i często używane)
// Importy kalkulatorów (pozostają synchroniczne, bo są małe i często używane) (Imports removed per unused warnings)

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [currentPage, setCurrentPage] = useState('home');
  const [jobOfferSlug, setJobOfferSlug] = useState<string | null>(null);

  useEffect(() => {
    // TEMPORARY FIX: Clear old local DB session data to force mock mode
    // This runs once on mount to ensure clean state
    const hasCleared = sessionStorage.getItem('hasClearedOldSession_v3');
    if (!hasCleared) {
      console.log('🧹 App: Clearing old session cache...');
      // Wyczyść stare klucze które mogą powodować problemy
      Object.keys(localStorage).forEach(key => {
        if (key.includes('auth-token') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.setItem('hasClearedOldSession_v3', 'true');
    }
  }, []);

  // ============================================
  // OCHRONA PRZED KOPIOWANIEM
  // ============================================
  useEffect(() => {
    // Blokada menu kontekstowego (prawy przycisk)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Blokada kopiowania
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Blokada wycinania
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Blokada skrótów klawiszowych
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+X, Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'u' || e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), F12
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) || e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Blokada przeciągania
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Blokada Print Screen (ograniczona skuteczność)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  useEffect(() => {
    // Inicjalizuj serwis zarządzania cyklem życia artykułów przy starcie aplikacji
    ArticleLifecycleService.initialize();

    // Wymuś inicjalizację globalDataService i wyczyść cache
    console.log('🔄 Forcing globalDataService initialization...');
    globalDataService.forceReload('all');

    const handlePopState = () => {
      const path = window.location.pathname;
      console.log('🔍 App: handlePopState called with path:', path);
      console.log('🔍 App: Current currentPage state:', currentPage);

      // Debug: sprawdź czy routing dla koszyka jest osiągany
      if (path === '/sklep/koszyk' || path === '/sklep/cart') {
        console.log('✅ App: Routing to cart page detected!');
      }
      if (path === '/kalkulatory') {
        setCurrentPage('calculators');
        setJobOfferSlug(null);
      } else if (path.startsWith('/kalkulatory/')) {
        const slug = path.replace('/kalkulatory/', '');
        setCurrentPage('calculator-detail');
        setJobOfferSlug(slug);
      } else if (path === '/icd-11') {
        setCurrentPage('icd11');
        setJobOfferSlug(null);
      } else if (path === '/baza-lekow') {
        setCurrentPage('leki');
        setJobOfferSlug(null);
      } else if (path === '/skale' || path === '/skale-medyczne') {
        // Przekierowanie na kalkulatory medyczne (stare skale)
        window.history.pushState({}, '', '/kalkulatory');
        setCurrentPage('calculators');
        setJobOfferSlug(null);
      } else if (path.startsWith('/skale-medyczne/')) {
        // Przekierowanie poszczególnych skal na kalkulatory
        const scaleId = path.replace('/skale-medyczne/', '');
        window.history.pushState({}, '', `/kalkulatory/${scaleId}`);
        setCurrentPage('calculator-detail');
        setJobOfferSlug(scaleId);
      } else if (path === '/egzaminy' || path.startsWith('/egzaminy/')) {
        setCurrentPage('exams');
        setJobOfferSlug(null);
      } else if (path === '/edukacja') {
        setCurrentPage('edukacja');
        setJobOfferSlug(null);
      } else if (path === '/moj-pacjent' || path.startsWith('/moj-pacjent/')) {
        setCurrentPage('my-patient');
        setJobOfferSlug(null);
      } else if (path === '/praca') {
        setCurrentPage('praca');
        setJobOfferSlug(null);
      } else if (path.startsWith('/praca/')) {
        const slug = path.replace('/praca/', '');
        setCurrentPage('job-detail');
        setJobOfferSlug(slug);
      } else if (path === '/oferty-pracy') {
        setCurrentPage('praca');
        setJobOfferSlug(null);
      } else if (path.startsWith('/oferty-pracy/')) {
        const slug = path.replace('/oferty-pracy/', '');
        setCurrentPage('job-detail');
        setJobOfferSlug(slug);
      } else if (path === '/sklep/koszyk' || path === '/sklep/cart') {
        setCurrentPage('cart');
        setJobOfferSlug(null);
      } else if (path === '/sklep/checkout') {
        setCurrentPage('checkout');
        setJobOfferSlug(null);
      } else if (path === '/sklep/moje-zamowienia' || path === '/sklep/orders') {
        setCurrentPage('order-history');
        setJobOfferSlug(null);
      } else if (path === '/sklep/moje-ebooki' || path === '/sklep/my-ebooks') {
        setCurrentPage('my-ebooks');
        setJobOfferSlug(null);
      } else if (path === '/sklep/lista-zyczen' || path === '/sklep/wishlist') {
        setCurrentPage('wishlist');
        setJobOfferSlug(null);
      } else if (path.startsWith('/sklep/ebook/')) {
        // Sprawdź specyficzne ścieżki ebooków
        const ebookId = path.replace('/sklep/ebook/', '');
        setCurrentPage('ebook-detail');
        setJobOfferSlug(ebookId);
      } else if (path === '/sklep') {
        setCurrentPage('sklep');
        setJobOfferSlug(null);
      } else if (path === '/gry' || path === '/games') {
        setCurrentPage('games');
        setJobOfferSlug(null);
      } else if (path === '/admin/sklep' || path === '/admin/shop') {
        setCurrentPage('shop-admin');
        setJobOfferSlug(null);
      } else if (path === '/uczelnie') {
        setCurrentPage('uczelnie');
        setJobOfferSlug(null);
      } else if (path.startsWith('/uczelnie/')) {
        const slug = path.replace('/uczelnie/', '');
        setCurrentPage('university-detail');
        setJobOfferSlug(slug);
      } else if (path === '/wydarzenia') {
        setCurrentPage('wydarzenia');
        setJobOfferSlug(null);
      } else if (path.startsWith('/wydarzenia/')) {
        const slug = path.replace('/wydarzenia/', '');
        setCurrentPage('event-detail');
        setJobOfferSlug(slug);
      } else if (path === '/kontakt') {
        setCurrentPage('contact');
        setJobOfferSlug(null);
      } else if (path === '/faq') {
        setCurrentPage('faq');
        setJobOfferSlug(null);
      } else if (path === '/regulamin') {
        setCurrentPage('terms');
        setJobOfferSlug(null);
      } else if (path === '/polityka-prywatnosci') {
        setCurrentPage('privacy');
        setJobOfferSlug(null);
      } else if (path === '/login' || path === '/logowanie') {
        setCurrentPage('login');
        setJobOfferSlug(null);
      } else if (path === '/register' || path === '/rejestracja') {
        setCurrentPage('register');
        setJobOfferSlug(null);
      } else if (path === '/dev-login') {
        setCurrentPage('dev-login');
        setJobOfferSlug(null);
      } else if (path === '/sidebar-demo') {
        setCurrentPage('sidebar-demo');
        setJobOfferSlug(null);
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
        setJobOfferSlug(null);
      } else if (path === '/przedmioty-przedkliniczne') {
        setCurrentPage('preclinical-subjects');
        setJobOfferSlug(null);
      } else if (path === '/przedmioty-kliniczne') {
        setCurrentPage('clinical-subjects');
        setJobOfferSlug(null);
      } else if (path === '/przedmioty-specjalistyczne') {
        setCurrentPage('specialized-subjects');
        setJobOfferSlug(null);
      } else if (path === '/wybierz-zawod') {
        setCurrentPage('profession-selector');
        setJobOfferSlug(null);
      } else if (path === '/fiszki' || path === '/flashcards') {
        setCurrentPage('flashcards');
        setJobOfferSlug(null);
      } else if (path === '/fiszki/create') {
        setCurrentPage('flashcards-create');
        setJobOfferSlug(null);
      } else if (path.startsWith('/fiszki/edit/')) {
        const setId = path.replace('/fiszki/edit/', '');
        setCurrentPage('flashcards-edit');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && !path.includes('/classic') && !path.includes('/learn') && !path.includes('/write') && !path.includes('/test') && !path.includes('/match') && !path.includes('/gravity')) {
        const setId = path.replace('/fiszki/study/', '');
        setCurrentPage('flashcards-study-selection');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/classic')) {
        const setId = path.replace('/fiszki/study/', '').replace('/classic', '');
        setCurrentPage('flashcards-classic');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/learn')) {
        const setId = path.replace('/fiszki/study/', '').replace('/learn', '');
        setCurrentPage('flashcards-learn');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/write')) {
        const setId = path.replace('/fiszki/study/', '').replace('/write', '');
        setCurrentPage('flashcards-write');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/test')) {
        const setId = path.replace('/fiszki/study/', '').replace('/test', '');
        setCurrentPage('flashcards-test');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/match')) {
        const setId = path.replace('/fiszki/study/', '').replace('/match', '');
        setCurrentPage('flashcards-match');
        setJobOfferSlug(setId);
      } else if (path.startsWith('/fiszki/study/') && path.includes('/gravity')) {
        const setId = path.replace('/fiszki/study/', '').replace('/gravity', '');
        setCurrentPage('flashcards-gravity');
        setJobOfferSlug(setId);
      } else if (path === '/fiszki/progress') {
        setCurrentPage('flashcards-progress');
        setJobOfferSlug(null);
      } else if (path === '/plany-nauki' || path === '/study-plans') {
        setCurrentPage('study-plans');
        setJobOfferSlug(null);
      } else if (path === '/mapa-stazy' || path === '/postgraduate-internships') {
        setCurrentPage('postgraduate-internships');
        setJobOfferSlug(null);
      } else if (path === '/mapa-rezydentur' || path === '/residency-map') {
        setCurrentPage('residency-map');
        setJobOfferSlug(null);
      } else if (path === '/rezydentury' || path === '/residency-encyclopedia') {
        setCurrentPage('residency-encyclopedia');
        setJobOfferSlug(null);
      } else if (path === '/kalendarz-szczepien' || path === '/vaccination-calendar') {
        setCurrentPage('vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien' || path === '/vaccination-calendars') {
        setCurrentPage('vaccination-calendars');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/dzieci') {
        setCurrentPage('vaccination-calendar-children');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/dorosli') {
        setCurrentPage('vaccination-calendar-adults');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/cukrzyca') {
        setCurrentPage('vaccination-calendar-diabetes');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/nefrologia') {
        setCurrentPage('vaccination-calendar-kidney');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/podroze') {
        setCurrentPage('travel-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/seniorzy') {
        setCurrentPage('senior-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/uklad-oddechowy') {
        setCurrentPage('respiratory-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/hepatologia') {
        setCurrentPage('hepatology-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/immunologia') {
        setCurrentPage('immunology-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/pracownicy-medyczni') {
        setCurrentPage('healthcare-workers-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/ciaza') {
        setCurrentPage('pregnancy-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/kardiologia') {
        setCurrentPage('cardiology-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/asplenia') {
        setCurrentPage('aspleni-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path === '/kalendarze-szczepien/hiv') {
        setCurrentPage('hiv-vaccination-calendar');
        setJobOfferSlug(null);
      } else if (path.startsWith('/plany-nauki/')) {
        const subPath = path.replace('/plany-nauki/', '');
        if (subPath === 'create') {
          setCurrentPage('study-plans-create');
        } else if (subPath.startsWith('active/')) {
          const planId = subPath.replace('active/', '');
          setCurrentPage('study-plans-active');
          setJobOfferSlug(planId);
        } else if (subPath === 'templates') {
          setCurrentPage('study-plans-templates');
        } else {
          setCurrentPage('study-plans');
        }
        setJobOfferSlug(null);
      } else if (path === '/profile' || path === '/profile/') {
        console.log('🔍 App: Setting page to profile');
        console.log('🔍 App: Before setCurrentPage, currentPage is:', currentPage);
        setCurrentPage('profile');
        console.log('🔍 App: After setCurrentPage to profile');
        setJobOfferSlug(null);
      } else if (path === '/add-job-offer') {
        setCurrentPage('add-job-offer');
        setJobOfferSlug(null);
      } else if (path === '/add-event') {
        setCurrentPage('add-event');
        setJobOfferSlug(null);
      } else if (path === '/admin') {
        setCurrentPage('admin');
        setJobOfferSlug(null);
      } else if (path === '/auth/callback') {
        setCurrentPage('auth-callback');
        setJobOfferSlug(null);
      } else if (path.startsWith('/employer')) {
        setCurrentPage('employer');
        setJobOfferSlug(null);
      } else if (path === '/doctor' || path === '/lekarz') {
        setCurrentPage('doctor');
        setJobOfferSlug(null);
      } else {
        setCurrentPage('home');
        setJobOfferSlug(null);
      }
    };

    // Handle initial page load
    handlePopState();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handlePopState);

    // Update header navigation to use routing
    const originalPushState = history.pushState;
    history.pushState = function (state, title, url) {
      originalPushState.call(history, state, title, url);
      console.log('🔍 App: pushState intercepted, calling handlePopState for:', url);
      // Wywołaj handlePopState synchronicznie - URL jest już zaktualizowany
      handlePopState();
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleFontSize = () => {
    setFontSize(prev => {
      switch (prev) {
        case 'small':
          return 'medium';
        case 'medium':
          return 'large';
        case 'large':
          return 'small';
        default:
          return 'medium';
      }
    });
  };

  // Update page title based on current page
  useEffect(() => {
    const titleMap: { [key: string]: string } = {
      'exams': 'Egzaminy LEK, LDEK, PES - Darmowe materiały',
      'calculators': pageTitles.calculators,
      'calculator-detail': 'Kalkulator Medyczny',
      'icd11': pageTitles.icd11,
      'leki': pageTitles.drugs,
      'skale': 'Skale medyczne - kompendium skal oceny | DlaMedica.pl',
      'edukacja': pageTitles.education,
      'praca': pageTitles.jobs,
      'job-detail': pageTitles.jobs,
      'sklep': pageTitles.shop,
      'uczelnie': pageTitles.universities,
      'university-detail': pageTitles.universities,
      'wydarzenia': pageTitles.events,
      'event-detail': pageTitles.events,
      'contact': pageTitles.contact,
      'faq': 'FAQ - Najczęściej zadawane pytania | DlaMedica.pl',
      'terms': pageTitles.terms,
      'privacy': pageTitles.privacy,
      'login': pageTitles.login,
      'register': pageTitles.register,
      'profile': pageTitles.profile,
      'employer': pageTitles.employer,
      'favorites': pageTitles.favorites,
      'applications': pageTitles.applications,
      '404': pageTitles.notFound,
      'home': pageTitles.home
    };

    const title = titleMap[currentPage] || pageTitles.home;
    document.title = `${title} | DlaMedica`;
  }, [currentPage]);

  const renderPage = () => {
    console.log('🔍 App: renderPage called with currentPage:', currentPage);
    console.log('🔍 App: window.location.pathname:', window.location.pathname);

    // Wrapper dla lazy-loaded komponentów z Suspense
    const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
      <Suspense fallback={<LoadingFallback darkMode={darkMode} />}>
        {children}
      </Suspense>
    );

    switch (currentPage) {
      case 'calculators':
        return <LazyWrapper><LazyPages.CalculatorsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'calculator-detail':
        return <LazyWrapper><LazyPages.CalculatorDetailPage darkMode={darkMode} fontSize={fontSize} slug={jobOfferSlug} /></LazyWrapper>;
      case 'icd11':
        return <LazyWrapper><LazyPages.ICD11Page darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'leki':
        return <LazyWrapper><LazyPages.EnhancedDrugsPage darkMode={darkMode} highContrast={highContrast} fontSize={fontSize} /></LazyWrapper>;
      case 'exams':
        return <LazyWrapper><LazyPages.ExamsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'edukacja':
        return <LazyWrapper><LazyPages.EdukacjaPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'my-patient':
        return <LazyWrapper><LazyPages.MyPatientPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'praca':
        return <LazyWrapper><LazyPages.JobOffersPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'job-detail':
        return <LazyWrapper><LazyPages.JobOfferDetailPage darkMode={darkMode} fontSize={fontSize} slug={jobOfferSlug} /></LazyWrapper>;
      case 'sklep':
        return <LazyWrapper><LazyPages.ShopPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'games':
        return <LazyWrapper><LazyPages.GameCenterPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'ebook-detail':
        return <LazyWrapper><LazyPages.EbookDetailPage darkMode={darkMode} fontSize={fontSize} ebookId={jobOfferSlug || ''} /></LazyWrapper>;
      case 'cart':
        console.log('✅ App: Rendering CartPage');
        return <LazyWrapper><LazyPages.CartPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'checkout':
        return <LazyWrapper><LazyPages.CheckoutPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'order-history':
        return <LazyWrapper><LazyPages.OrderHistoryPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'my-ebooks':
        return <LazyWrapper><LazyPages.MyEbooksPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'shop-admin':
        return <LazyWrapper><LazyPages.ShopAdminPanel darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'wishlist':
        return <LazyWrapper><LazyPages.WishlistPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'uczelnie':
        return <LazyWrapper><LazyPages.UniversitiesPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'university-detail':
        return <LazyWrapper><LazyPages.UniversityDetailPage darkMode={darkMode} fontSize={fontSize} slug={jobOfferSlug} /></LazyWrapper>;
      case 'wydarzenia':
        return <LazyWrapper><LazyPages.EventsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'event-detail':
        return <LazyWrapper><LazyPages.EventDetailPage darkMode={darkMode} fontSize={fontSize} slug={jobOfferSlug} /></LazyWrapper>;
      case 'contact':
        return <LazyWrapper><LazyPages.ContactPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'faq':
        return <LazyWrapper><LazyPages.FAQPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'terms':
        return <LazyWrapper><LazyPages.TermsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'privacy':
        return <LazyWrapper><LazyPages.PrivacyPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'login':
        return <LazyWrapper><LazyPages.LoginPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'register':
        return <LazyWrapper><LazyPages.RegisterPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'dev-login':
        return <LazyWrapper><LazyPages.DevLoginPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'sidebar-demo':
        return <LazyWrapper><LazyPages.SidebarDemoPage darkMode={darkMode} /></LazyWrapper>;
      case 'dashboard':
        return <LazyWrapper><LazyPages.DashboardPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'preclinical-subjects':
        return <LazyWrapper><LazyPages.PreclinicalSubjectsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'clinical-subjects':
        return <LazyWrapper><LazyPages.ClinicalSubjectsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'specialized-subjects':
        return <LazyWrapper><LazyPages.SpecializedSubjectsPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'profession-selector':
        return <LazyWrapper><LazyPages.ProfessionSelectorPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'flashcards':
        return <LazyWrapper><LazyPages.FlashcardLibrary darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'flashcards-create':
        return <LazyWrapper><LazyPages.CreateFlashcardSet darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'flashcards-edit':
        return <LazyWrapper><LazyPages.FlashcardEditor darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'flashcards-study-selection':
        return <LazyWrapper><LazyPages.StudyModeSelection darkMode={darkMode} fontSize={fontSize} setId={jobOfferSlug || ''} /></LazyWrapper>;
      case 'flashcards-classic':
        return <div>ClassicFlashcards - W budowie</div>;
      case 'flashcards-learn':
        return <div>LearnMode - W budowie</div>;
      case 'flashcards-write':
        return <div>WriteMode - W budowie</div>;
      case 'flashcards-test':
        return <div>TestMode - W budowie</div>;
      case 'flashcards-match':
        return <div>MatchMode - W budowie</div>;
      case 'flashcards-gravity':
        return <div>GravityGame - W budowie</div>;
      case 'flashcards-progress':
        return <LazyWrapper><LazyPages.SRSStatsPanel darkMode={darkMode} fontSize={fontSize} totalCards={0} /></LazyWrapper>;
      case 'study-plans':
        return <LazyWrapper><LazyPages.StudyPlansLibrary darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'study-plans-create':
        return <div>CreateStudyPlan - W budowie</div>;
      case 'study-plans-active':
        return <div>StudyPlanExecution - W budowie</div>;
      case 'study-plans-templates':
        return <div>StudyPlanTemplates - W budowie</div>;
      case 'postgraduate-internships':
        return <LazyWrapper><LazyPages.PostgraduateInternshipMap darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'residency-map':
        return <LazyWrapper><LazyPages.ResidencyMap darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'residency-encyclopedia':
        return <LazyWrapper><LazyPages.ResidencyEncyclopedia darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'vaccination-calendar':
        return <LazyWrapper><LazyPages.VaccinationCalendar darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'vaccination-calendars':
        return <LazyWrapper><LazyPages.VaccinationCalendars /></LazyWrapper>;
      case 'vaccination-calendar-children':
        return <LazyWrapper><LazyPages.VaccinationCalendarChildren /></LazyWrapper>;
      case 'vaccination-calendar-adults':
        return <LazyWrapper><LazyPages.VaccinationCalendarAdults /></LazyWrapper>;
      case 'vaccination-calendar-diabetes':
        return <LazyWrapper><LazyPages.VaccinationCalendarDiabetes /></LazyWrapper>;
      case 'vaccination-calendar-kidney':
        return <LazyWrapper><LazyPages.VaccinationCalendarKidney /></LazyWrapper>;
      case 'travel-vaccination-calendar':
        return <LazyWrapper><LazyPages.TravelVaccinationCalendar /></LazyWrapper>;
      case 'senior-vaccination-calendar':
        return <LazyWrapper><LazyPages.SeniorVaccinationCalendar /></LazyWrapper>;
      case 'respiratory-vaccination-calendar':
        return <LazyWrapper><LazyPages.RespiratoryVaccinationCalendar /></LazyWrapper>;
      case 'hepatology-vaccination-calendar':
        return <LazyWrapper><LazyPages.HepatologyVaccinationCalendar /></LazyWrapper>;
      case 'immunology-vaccination-calendar':
        return <LazyWrapper><LazyPages.ImmunologyVaccinationCalendar /></LazyWrapper>;
      case 'healthcare-workers-vaccination-calendar':
        return <LazyWrapper><LazyPages.HealthcareWorkersVaccinationCalendar /></LazyWrapper>;
      case 'pregnancy-vaccination-calendar':
        return <LazyWrapper><LazyPages.PregnancyVaccinationCalendar /></LazyWrapper>;
      case 'cardiology-vaccination-calendar':
        return <LazyWrapper><LazyPages.CardiologyVaccinationCalendar /></LazyWrapper>;
      case 'aspleni-vaccination-calendar':
        return <LazyWrapper><LazyPages.AspleniVaccinationCalendar /></LazyWrapper>;
      case 'hiv-vaccination-calendar':
        return <LazyWrapper><LazyPages.HIVVaccinationCalendar /></LazyWrapper>;
      case 'profile':
        // Profil z zakładkami
        return <LazyWrapper><LazyPages.ProfileUnified darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'add-job-offer':
        return <LazyWrapper><LazyPages.AddJobOfferPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'add-event':
        return <LazyWrapper><LazyPages.AddEventPage darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'admin':
        // Panel administratora tylko dla kont z rolą 'admin'
        // W prawdziwej aplikacji pobierz z AuthContext/bazy danych
        // TESTOWANIE: Zmień 'user' na 'admin' żeby przetestować panel
        // TODO: Pobierz z AuthContext
        // const currentUserRole: 'user' | 'admin' = profile?.role === 'admin' ? 'admin' : 'user';
        const currentUserRole: 'user' | 'admin' = 'user' as 'user' | 'admin';

        if (currentUserRole !== 'admin') {
          // Przekieruj do strony głównej z komunikatem o braku uprawnień
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Brak uprawnień</h2>
                <p className="text-gray-600 mb-4">
                  Nie masz uprawnień do panelu administratora. Ta sekcja jest dostępna tylko dla administratorów.
                </p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-[#38b6ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors"
                >
                  Wróć do strony głównej
                </button>
              </div>
            </div>
          );
        }

        return <LazyWrapper><LazyPages.AdminPanel darkMode={darkMode} fontSize={fontSize} /></LazyWrapper>;
      case 'auth-callback':
        return <LazyWrapper><LazyPages.AuthCallback darkMode={darkMode} /></LazyWrapper>;
      case 'employer':
        return (
          <ProtectedRoute
            darkMode={darkMode}
            fontSize={fontSize}
            requireEmployer={true}
          >
            <LazyWrapper>
              <LazyPages.EmployerDashboard darkMode={darkMode} fontSize={fontSize} />
            </LazyWrapper>
          </ProtectedRoute>
        );
      case 'doctor':
        return (
          <ProtectedRoute
            darkMode={darkMode}
            fontSize={fontSize}
          >
            <LazyWrapper>
              <LazyPages.DoctorDashboard darkMode={darkMode} fontSize={fontSize} />
            </LazyWrapper>
          </ProtectedRoute>
        );
      case '404':
        return <LazyWrapper><LazyPages.NotFoundPage darkMode={darkMode} highContrast={highContrast} fontSize={fontSize} /></LazyWrapper>;
      default:
        return <LazyWrapper><LazyPages.Home darkMode={darkMode} highContrast={highContrast} fontSize={fontSize} /></LazyWrapper>;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <GameProvider>
            <StudyFieldProvider>
              <div className={`min-h-screen ${highContrast
                ? 'bg-white text-black'
                : darkMode
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
                }`}>
                <Header
                  darkMode={darkMode}
                  highContrast={highContrast}
                  toggleDarkMode={toggleDarkMode}
                  toggleHighContrast={toggleHighContrast}
                  fontSize={fontSize}
                  toggleFontSize={toggleFontSize}
                />

                <main>
                  {renderPage()}
                </main>

                <Footer
                  darkMode={darkMode}
                  highContrast={highContrast}
                  fontSize={fontSize}
                />

                {/* Global Components */}
                <ScrollToTop darkMode={darkMode} highContrast={highContrast} />
                <CookieConsent darkMode={darkMode} highContrast={highContrast} fontSize={fontSize} />
                <BugReportButton darkMode={darkMode} />
                <NotificationPermissionPrompt darkMode={darkMode} />
              </div>
            </StudyFieldProvider>
          </GameProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

// Rebuild trigger
export default App;