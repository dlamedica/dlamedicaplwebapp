import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | DlaMedica`;
    
    // Restore previous title on unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

// Page title configuration
export const pageTitles = {
  home: 'Twoje źródło wiedzy medycznej',
  education: 'Platforma edukacyjna dla medyków',
  shop: 'Sklep medyczny',
  events: 'Wydarzenia medyczne',
  jobs: 'Oferty pracy dla medyków',
  universities: 'Uczelnie medyczne',
  calculators: 'Kalkulatory medyczne',
  icd11: 'Klasyfikacja ICD-11',
  drugs: 'Baza leków',
  profile: 'Mój profil',
  login: 'Zaloguj się',
  register: 'Zarejestruj się',
  contact: 'Kontakt',
  privacy: 'Polityka prywatności',
  terms: 'Regulamin',
  notFound: 'Strona nie znaleziona',
  employer: 'Panel pracodawcy',
  favorites: 'Ulubione oferty pracy',
  applications: 'Moje aplikacje'
};