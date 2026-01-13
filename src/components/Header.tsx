import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  UserIcon,
  LogoutIcon,
  LightbulbIcon,
  HeartIcon,
  CartIcon
} from './icons/CustomIcons';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { LanguageSwitcher, useTranslation } from '../plugins/translation';
import PremiumFeatureBadge from './PremiumFeatureBadge';
import NotificationSystem from './NotificationSystem';
import ToolSuggestionModal from './ToolSuggestionModal';

interface HeaderProps {
  darkMode: boolean;
  highContrast: boolean;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  toggleFontSize: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, highContrast, toggleDarkMode, toggleHighContrast, fontSize, toggleFontSize }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isToolsDropdownOpenMobile, setIsToolsDropdownOpenMobile] = useState(false);
  const [isToolSuggestionModalOpen, setIsToolSuggestionModalOpen] = useState(false);
  const { user, profile, isAuthenticated } = useUser();
  const { signOut } = useAuth();
  const { getTotalItems } = useCart();
  const { t } = useTranslation();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartItemsCount = getTotalItems();

  const navigationLinks = [
    { name: t('nav.home'), href: '/', mobileShort: t('nav.home') },
    { name: t('nav.education'), href: '/edukacja', mobileShort: t('nav.education') },
    { name: t('nav.shop'), href: '/sklep', mobileShort: t('nav.shop') },
    { name: t('nav.events'), href: '/wydarzenia', mobileShort: t('nav.events') },
    { name: t('nav.jobs'), href: '/praca', mobileShort: t('nav.jobs') },
    { name: t('nav.universities'), href: '/uczelnie', mobileShort: t('nav.universities') }
  ];

  // Sprawdź czy użytkownik to lekarz
  // Debug log dla profilu
  useEffect(() => {
    if (profile) {
      console.log('🔍 Header - User profile:', profile);
      console.log('🔍 Header - Zawód:', profile?.zawod);
      console.log('🔍 Header - Profession:', profile?.profession);
      console.log('🔍 Header - Email:', user?.email);
    }
  }, [profile, user]);

  const isDoctor = profile?.zawod === 'Lekarz' ||
    profile?.profession === 'Lekarz' ||
    profile?.zawod?.toLowerCase() === 'lekarz' ||
    profile?.profession?.toLowerCase() === 'lekarz' ||
    user?.email === 'lekarz@dlamedica.pl';

  const toolsMenuItems = [
    { name: t('tools.icd11'), href: '/icd-11', isPremium: false },
    { name: t('tools.drugDatabase'), href: '/baza-lekow', isPremium: false },
    { name: t('tools.medicalCalculators'), href: '/kalkulatory', isPremium: false },
    { name: t('tools.vaccinationCalendars'), href: '/kalendarze-szczepien', isPremium: false },
    ...(isDoctor ? [
      { name: t('tools.internshipMap'), href: '/mapa-stazy', isPremium: false },
      { name: t('tools.residencies'), href: '/rezydentury', isPremium: false },
      { name: t('tools.residencyMap'), href: '/mapa-rezydentur', isPremium: false }
    ] : [])
  ];

  const handleNavigation = (path: string) => {
    console.log('🔍 Header: Navigating to:', path);
    console.log('🔍 Header: Current location before:', window.location.pathname);
    try {
      // Użyj pushState
      window.history.pushState({}, '', path);
      console.log('🔍 Header: pushState executed, new path:', window.location.pathname);

      // Wywołaj popstate event - App.tsx powinien to przechwycić
      window.dispatchEvent(new PopStateEvent('popstate'));
      console.log('🔍 Header: popstate event dispatched');

      // Dodatkowo wywołaj jeszcze raz po krótkim opóźnieniu, na wypadek problemów z timing
      setTimeout(() => {
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('🔍 Header: popstate event dispatched again (retry)');
      }, 50);

      setIsMenuOpen(false); // Close mobile menu on navigation
      setIsUserDropdownOpen(false); // Close user dropdown on navigation
      setIsToolsDropdownOpen(false); // Close tools dropdown on navigation
      setIsToolsDropdownOpenMobile(false); // Close mobile tools dropdown on navigation
    } catch (error) {
      console.error('🚨 Header: Navigation error:', error);
      // Fallback: użyj window.location
      window.location.href = path;
    }
  };

  // Handle hover events with slight delay for better UX
  const handleMouseEnterTools = () => {
    // Clear any existing timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsToolsDropdownOpen(true);
  };

  const handleMouseLeaveTools = () => {
    // Add delay to prevent immediate close when moving mouse between button and dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsToolsDropdownOpen(false);
      dropdownTimeoutRef.current = null;
    }, 750);
  };

  // Handle click for mobile fallback - only toggle if not already open from hover
  const handleToolsClick = (e: React.MouseEvent) => {
    // Only handle click on mobile or if dropdown is not already open from hover
    if (window.innerWidth < 1024) {
      e.preventDefault();
      setIsToolsDropdownOpen(!isToolsDropdownOpen);
    }
  };

  // Handle mobile tools dropdown toggle
  const toggleToolsDropdownMobile = () => {
    setIsToolsDropdownOpenMobile(!isToolsDropdownOpenMobile);
  };

  const handleSignOut = async () => {
    try {
      console.log('Header: Attempting to sign out...');
      setIsUserDropdownOpen(false);
      await signOut(); // This will handle everything including redirect
      console.log('Header: Sign out initiated');
    } catch (error) {
      console.error('Header: Error signing out:', error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className={`w-full shadow-md ${highContrast
        ? 'bg-white border-b-2 border-black'
        : darkMode
          ? 'bg-black'
          : 'bg-white'
        } transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <button onClick={() => handleNavigation('/')} className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Logo DlaMedica.pl"
                  width={120}
                  height={120}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.svg";
                  }}
                />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="flex space-x-4">
                {navigationLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className={`text-sm font-medium hover:text-[#38b6ff] transition-colors duration-200 px-2 py-1 rounded whitespace-nowrap ${highContrast
                      ? 'text-black border-b hover:border-black'
                      : darkMode
                        ? 'text-white hover:bg-gray-900'
                        : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    {link.name}
                  </button>
                ))}

                {/* Tools Dropdown */}
                <div
                  className="relative group focus-within:outline-none"
                  onMouseEnter={handleMouseEnterTools}
                  onMouseLeave={handleMouseLeaveTools}
                >
                  <button
                    onClick={handleToolsClick}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`text-sm font-medium px-3 py-2 rounded whitespace-nowrap flex items-center cursor-pointer focus:outline-none ${highContrast
                      ? 'text-black hover:text-[#38b6ff]'
                      : darkMode
                        ? 'text-white hover:text-[#38b6ff]'
                        : 'text-black hover:text-[#38b6ff]'
                      }`}
                  >
                    {t('nav.tools')}
                    <ChevronDownIcon size={12} className="ml-1" />
                  </button>

                  {/* Invisible bridge to prevent gap - extended area for better hover */}
                  {isToolsDropdownOpen && (
                    <div
                      className="absolute top-0 left-0 right-0 h-full z-40 pointer-events-auto"
                      onMouseEnter={handleMouseEnterTools}
                      onMouseLeave={handleMouseLeaveTools}
                      style={{ background: 'transparent' }}
                    />
                  )}

                  {/* Additional hover area below button */}
                  {isToolsDropdownOpen && (
                    <div
                      className="absolute top-full left-0 w-56 h-2 z-40 pointer-events-auto"
                      onMouseEnter={handleMouseEnterTools}
                      onMouseLeave={handleMouseLeaveTools}
                      style={{ background: 'transparent' }}
                    />
                  )}

                  {/* Dropdown Menu */}
                  {isToolsDropdownOpen && (
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl border z-[60] ${darkMode
                        ? 'bg-black border-gray-700'
                        : 'bg-white border-gray-200'
                        }`}
                      onMouseEnter={handleMouseEnterTools}
                      onMouseLeave={handleMouseLeaveTools}
                    >
                      {toolsMenuItems.map((item, index) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full text-left px-4 py-3 text-sm ${darkMode
                            ? 'text-white hover:text-[#38b6ff]'
                            : 'text-black hover:text-[#38b6ff]'
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === toolsMenuItems.length - 1 ? '' : ''
                            } flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                        >
                          <span>
                            {item.name}
                          </span>
                          {item.isPremium && (
                            <PremiumFeatureBadge
                              darkMode={darkMode}
                              size="small"
                              showText={false}
                            />
                          )}
                        </button>
                      ))}
                      {/* Przycisk do propozycji pomysłów */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          setIsToolSuggestionModalOpen(true);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-b-lg ${darkMode
                          ? 'text-white hover:text-[#38b6ff] hover:bg-gray-800'
                          : 'text-black hover:text-[#38b6ff] hover:bg-gray-50'
                          } flex items-center space-x-2`}
                      >
                        <LightbulbIcon size={18} color="#eab308" />
                        <span>{t('nav.suggestIdea')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>


              {/* Controls */}
              <div className="flex items-center space-x-2">
                {/* Language Switcher */}
                <LanguageSwitcher
                  variant="compact"
                  darkMode={darkMode}
                  size="small"
                />

                {/* Font Size Toggle */}
                <button
                  onClick={toggleFontSize}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode
                    ? 'text-white hover:bg-gray-900'
                    : 'text-black hover:bg-gray-100'
                    }`}
                  aria-label="Toggle font size"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
                  </svg>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode
                    ? 'text-white hover:bg-gray-900'
                    : 'text-black hover:bg-gray-100'
                    }`}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                {/* Notification System - only show when authenticated */}
                {isAuthenticated && (
                  <NotificationSystem
                    darkMode={darkMode}
                    fontSize={fontSize}
                    userId={user?.id || 'demo_user'}
                    userType={
                      // For demo - determine user type
                      // In real app this should come from user context/database
                      user?.email === 'admin@dlamedica.pl' ? 'admin' :
                        profile?.is_company ? 'company' : 'user'
                    }
                  />
                )}

                {/* Shopping Cart Icon */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🛒 Cart button clicked!');
                    console.log('🛒 Current path:', window.location.pathname);
                    console.log('🛒 Navigating to /sklep/koszyk');

                    // Użyj handleNavigation
                    handleNavigation('/sklep/koszyk');

                    // Dodatkowe sprawdzenie po nawigacji
                    setTimeout(() => {
                      console.log('🛒 After navigation, path is:', window.location.pathname);
                    }, 100);
                  }}
                  className={`relative p-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${darkMode
                    ? 'bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-black'
                    : 'bg-gradient-to-r from-[#38b6ff] to-[#2da7ef] text-black'
                    }`}
                  aria-label={t('nav.cart')}
                  title={t('nav.cart')}
                >
                  <CartIcon size={22} color="#0f172a" className="drop-shadow-sm" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                  )}
                </button>

                {/* User Authentication */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${darkMode
                        ? 'text-white hover:bg-gray-900'
                        : 'text-black hover:bg-gray-100'
                        }`}
                      aria-label="User menu"
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="{t('nav.profile')}"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon size={16} />
                      )}
                      <span className="text-sm">{profile?.full_name || user?.email}</span>
                      <ChevronDownIcon size={12} />
                    </button>

                    {isUserDropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              handleNavigation('/profile');
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${darkMode ? 'text-white hover:bg-gray-700' : 'text-black'
                              }`}
                          >
                            <UserIcon size={16} className="inline mr-2" />
                            {t('nav.profile')}
                          </button>
                          <button
                            onClick={handleSignOut}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${darkMode ? 'text-white hover:bg-gray-700' : 'text-black'
                              }`}
                          >
                            <LogoutIcon size={16} className="inline mr-2" />
                            {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleNavigation('/login')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'text-white border border-white hover:bg-white hover:text-black'
                        : 'text-black border border-black hover:bg-black hover:text-white'
                        }`}
                    >
                      {t('nav.login')}
                    </button>
                    <button
                      onClick={() => handleNavigation('/register')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                        : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                        }`}
                    >
                      {t('nav.register')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 ${darkMode
                  ? 'text-white hover:bg-gray-900'
                  : 'text-black hover:bg-gray-100'
                  }`}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Social Media Icons - Below Navigation */}
          <div className="hidden lg:flex justify-center py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61570490863347"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="Facebook"
              >
                <FaFacebook size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.instagram.com/dlamedica.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="Instagram"
              >
                <FaInstagram size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.tiktok.com/@dlamedicapl?lang=de-DE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="TikTok"
              >
                <FaTiktok size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC6Bfr93-ilUb1ghiB6G5qJw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="YouTube"
              >
                <FaYoutube size={18} className="text-[#38b6ff]" />
              </a>
              <a
                href="https://x.com/dlamedicapl"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={18} className="text-[#38b6ff]" />
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${darkMode
              ? 'border-gray-700'
              : 'border-gray-200'
              }`}>
              <nav className="grid grid-cols-2 gap-3">
                {navigationLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className={`text-sm font-medium hover:text-[#38b6ff] transition-colors duration-200 text-left py-2 px-3 rounded-lg ${darkMode
                      ? 'text-white hover:bg-gray-900'
                      : 'text-black hover:bg-gray-100'
                      }`}
                  >
                    {link.mobileShort || link.name}
                  </button>
                ))}

                {/* Tools Dropdown in Mobile */}
                <div className="col-span-2">
                  <button
                    onClick={toggleToolsDropdownMobile}
                    className={`w-full text-sm font-medium text-left py-2 px-3 rounded-lg flex items-center justify-between ${darkMode
                      ? 'text-white hover:text-[#38b6ff]'
                      : 'text-black hover:text-[#38b6ff]'
                      }`}
                  >
                    <span>{t('nav.tools')}</span>
                    <ChevronDownIcon size={12} />
                  </button>

                  {isToolsDropdownOpenMobile && (
                    <div className="mt-2 space-y-1 ml-4">
                      {toolsMenuItems.map((tool) => (
                        <button
                          key={tool.name}
                          onClick={() => handleNavigation(tool.href)}
                          className={`w-full text-sm font-medium text-left py-2 px-3 rounded-lg flex items-center justify-between ${darkMode
                            ? 'text-white hover:text-[#38b6ff]'
                            : 'text-black hover:text-[#38b6ff]'
                            }`}
                        >
                          <span>{tool.name}</span>
                          {tool.isPremium && (
                            <PremiumFeatureBadge
                              darkMode={darkMode}
                              size="small"
                              showText={false}
                            />
                          )}
                        </button>
                      ))}
                      {/* Przycisk do propozycji pomysłów - mobile */}
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpenMobile(false);
                          setIsToolSuggestionModalOpen(true);
                        }}
                        className={`w-full text-sm font-medium text-left py-2 px-3 rounded-lg flex items-center space-x-2 ${darkMode
                          ? 'text-white hover:text-[#38b6ff]'
                          : 'text-black hover:text-[#38b6ff]'
                          }`}
                      >
                        <LightbulbIcon size={16} color="#eab308" />
                        <span>{t('nav.suggestIdea')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Social Media Icons */}
              <div className={`flex justify-center gap-2 mt-4 py-3 border-t border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'
                }`}>
                <a
                  href="https://www.facebook.com/profile.php?id=61570490863347"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} className="text-[#38b6ff]" />
                </a>
                <a
                  href="https://www.instagram.com/dlamedica.pl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} className="text-[#38b6ff]" />
                </a>
                <a
                  href="https://www.tiktok.com/@dlamedicapl?lang=de-DE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                  aria-label="TikTok"
                >
                  <FaTiktok size={18} className="text-[#38b6ff]" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UC6Bfr93-ilUb1ghiB6G5qJw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                  aria-label="YouTube"
                >
                  <FaYoutube size={18} className="text-[#38b6ff]" />
                </a>
                <a
                  href="https://x.com/dlamedicapl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:bg-[#38b6ff]/10"
                  aria-label="X (Twitter)"
                >
                  <FaXTwitter size={18} className="text-[#38b6ff]" />
                </a>
              </div>

              <div className="flex flex-col space-y-3 mt-4">
                {/* Mobile User Authentication */}
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? 'text-white bg-gray-700' : 'text-black bg-gray-100'
                      }`}>
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="{t('nav.profile')}"
                          className="w-4 h-4 rounded-full object-cover inline mr-2"
                        />
                      ) : (
                        <UserIcon size={16} className="inline mr-2" />
                      )}
                      {profile?.full_name || user?.email}
                    </div>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'text-white border border-white hover:bg-white hover:text-black'
                        : 'text-black border border-black hover:bg-black hover:text-white'
                        }`}
                    >
                      {t('nav.profile')}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'text-white border border-red-500 hover:bg-red-500 hover:text-white'
                        : 'text-red-600 border border-red-600 hover:bg-red-600 hover:text-white'
                        }`}
                    >
                      <LogoutIcon size={16} className="inline mr-2" />
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/login')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'text-white border border-white hover:bg-white hover:text-black'
                        : 'text-black border border-black hover:bg-black hover:text-white'
                        }`}
                    >
                      {t('nav.login')}
                    </button>
                    <button
                      onClick={() => handleNavigation('/register')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${darkMode
                        ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                        : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                        }`}
                    >
                      {t('nav.register')}
                    </button>
                  </>
                )}
                {/* Language Switcher - Mobile */}
                <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('common.language')}
                  </div>
                  <LanguageSwitcher
                    variant="buttons"
                    darkMode={darkMode}
                    size="small"
                    showFlag={true}
                    showName={true}
                  />
                </div>

                <button
                  onClick={toggleFontSize}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${darkMode
                    ? 'text-white border border-white hover:bg-white hover:text-black'
                    : 'text-black border border-black hover:bg-black hover:text-white'
                    }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
                  </svg>
                  <span>Aa</span>
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${darkMode
                    ? 'text-white border border-white hover:bg-white hover:text-black'
                    : 'text-black border border-black hover:bg-black hover:text-white'
                    }`}
                >
                  {darkMode ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span>{t('nav.lightMode')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span>{t('nav.darkMode')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <ToolSuggestionModal
        isOpen={isToolSuggestionModalOpen}
        onClose={() => setIsToolSuggestionModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default Header;