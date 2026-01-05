export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: NavigationItem[];
  isExpanded?: boolean;
}

export interface NavigationData {
  profession: string;
  items: NavigationItem[];
}

export const navigationConfig: NavigationData = {
  profession: "LEKARZ", // placeholder
  items: [
    {
      id: 'dashboard',
      label: 'Strona główna',
      icon: 'FaHome',
      href: '/dashboard'
    },
    {
      id: 'preclinical',
      label: 'Przedmioty Przedkliniczne',
      icon: 'FaBook',
      href: '/przedmioty-przedkliniczne'
    },
    {
      id: 'clinical',
      label: 'Przedmioty Kliniczne',
      icon: 'FaHeartbeat',
      href: '/przedmioty-kliniczne'
    },
    {
      id: 'specialist',
      label: 'Przedmioty Specjalistyczne',
      icon: 'FaStar',
      href: '/przedmioty-specjalistyczne'
    },
    {
      id: 'flashcards',
      label: 'Fiszki',
      icon: 'FaLayerGroup',
      href: '/fiszki'
    },
    {
      id: 'exams',
      label: 'Egzaminy',
      icon: 'FaGraduationCap',
      href: '/egzaminy'
    },
    {
      id: 'my-patient',
      label: 'Mój pacjent',
      icon: 'FaUserInjured',
      href: '/moj-pacjent'
    },
    {
      id: 'study-plans',
      label: 'Plany nauki',
      icon: 'FaClipboardList',
      href: '/plany-nauki'
    },
    {
      id: 'settings',
      label: 'Ustawienia platformy',
      icon: 'FaCog',
      isExpanded: false,
      children: [
        {
          id: 'career-profile',
          label: 'Profile kariery i nauki',
          icon: 'FaUser',
          href: '/ustawienia/profil'
        },
        {
          id: 'contact-settings',
          label: 'Dane kontaktowe i ustawienia',
          icon: 'FaEnvelope',
          href: '/ustawienia/kontakt'
        },
        {
          id: 'membership',
          label: 'Członkostwo i licencje',
          icon: 'FaAward',
          href: '/ustawienia/czlonkostwo'
        },
        {
          id: 'invoices',
          label: 'Faktury',
          icon: 'FaFileInvoice',
          href: '/ustawienia/faktury'
        },
        {
          id: 'payments',
          label: 'Informacje o płatnościach',
          icon: 'FaCreditCard',
          href: '/ustawienia/platnosci'
        },
        {
          id: 'redeem-code',
          label: 'Zrealizuj kod',
          icon: 'FaGift',
          href: '/ustawienia/kod'
        },
        {
          id: 'institutional',
          label: 'Aktywuj licencję instytucjonalną',
          icon: 'FaBuilding',
          href: '/ustawienia/licencja'
        }
      ]
    },
    {
      id: 'help',
      label: 'Pomoc i prywatność',
      icon: 'FaQuestionCircle',
      isExpanded: false,
      children: [
        {
          id: 'help-center',
          label: 'Centrum pomocy',
          icon: 'FaLifeRing',
          href: '/pomoc/centrum'
        },
        {
          id: 'terms',
          label: 'Warunki użytkowania',
          icon: 'FaFileAlt',
          href: '/pomoc/warunki'
        },
        {
          id: 'privacy',
          label: 'Polityka prywatności',
          icon: 'FaShieldAlt',
          href: '/pomoc/prywatnosc'
        },
        {
          id: 'legal',
          label: 'Informacja prawna',
          icon: 'FaBalanceScale',
          href: '/pomoc/prawna'
        },
        {
          id: 'privacy-settings',
          label: 'Ustawienia prywatności',
          icon: 'FaLock',
          href: '/pomoc/ustawienia-prywatnosci'
        }
      ]
    }
  ]
};