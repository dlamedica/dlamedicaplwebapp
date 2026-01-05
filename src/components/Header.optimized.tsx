import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { FaChevronDown, FaUser, FaSignOutAlt, FaFacebook, FaYoutube, FaTiktok, FaInstagram, FaLightbulb, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
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

/**
 * Zoptymalizowana wersja Header z React.memo i useMemo/useCallback
 * 
 * Optymalizacje:
 * - React.memo - zapobiega niepotrzebnym re-renderom
 * - useMemo - memoizacja kosztownych obliczeń
 * - useCallback - memoizacja funkcji przekazywanych jako props
 */
const Header: React.FC<HeaderProps> = memo(({ 
  darkMode, 
  highContrast, 
  toggleDarkMode, 
  toggleHighContrast, 
  fontSize, 
  toggleFontSize 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isToolsDropdownOpenMobile, setIsToolsDropdownOpenMobile] = useState(false);
  const [isToolSuggestionModalOpen, setIsToolSuggestionModalOpen] = useState(false);
  const { user, profile, isAuthenticated } = useUser();
  const { signOut } = useAuth();
  const { getTotalItems } = useCart();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoizacja kosztownego obliczenia
  const cartItemsCount = useMemo(() => getTotalItems(), [getTotalItems]);

  // Memoizacja tablicy linków nawigacyjnych
  const navigationLinks = useMemo(() => [
    { name: 'Strona główna', href: '/', mobileShort: 'Główna' },
    { name: 'Platforma edukacyjna', href: '/edukacja', mobileShort: 'Edukacja' },
    { name: 'Sklep', href: '/sklep', mobileShort: 'Sklep' },
    { name: 'Wydarzenia', href: '/wydarzenia', mobileShort: 'Wydarzenia' },
    { name: 'Oferty pracy', href: '/praca', mobileShort: 'Praca' },
    { name: 'Uczelnie', href: '/uczelnie', mobileShort: 'Uczelnie' }
  ], []);

  // Memoizacja funkcji callback
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleToolsDropdownToggle = useCallback(() => {
    setIsToolsDropdownOpen(prev => !prev);
  }, []);

  const handleUserDropdownToggle = useCallback(() => {
    setIsUserDropdownOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  // Debug log tylko w development
  useEffect(() => {
    if (import.meta.env.DEV && profile) {
      console.log('🔍 Header - User profile:', profile);
      console.log('🔍 Header - Zawód:', profile?.zawod);
      console.log('🔍 Header - Profession:', profile?.profession);
      console.log('🔍 Header - Email:', user?.email);
    }
  }, [profile, user]);

  // Reszta komponentu...
  // (Tutaj byłby pełny kod Header, ale dla przykładu pokazuję tylko optymalizacje)

  return (
    <header>
      {/* Header content */}
    </header>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - re-render tylko gdy zmienią się istotne props
  return (
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.highContrast === nextProps.highContrast &&
    prevProps.fontSize === nextProps.fontSize
  );
});

Header.displayName = 'Header';

export default Header;

