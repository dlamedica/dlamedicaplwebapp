import React, { useEffect } from 'react';
import EducationDashboard from '../education/EducationDashboard';

interface EducationPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const EducationPage: React.FC<EducationPageProps> = ({ darkMode, fontSize }) => {
  useEffect(() => {
    // Set page title and meta tags
    document.title = 'Edukacja medyczna - DlaMedica.pl';
    
    const metaDescription = document.querySelector('meta[name=\"description\"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Platforma edukacyjna dla medyków - kursy, moduły i quizy z anatomii, fizjologii, kardiologii i innych dziedzin medycznych.');
    }

    const ogTitle = document.querySelector('meta[property=\"og:title\"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Edukacja medyczna - DlaMedica.pl');
    }

    const ogDescription = document.querySelector('meta[property=\"og:description\"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Ucz się medycyny online - interaktywne kursy, quizy i materiały edukacyjne dla studentów i profesjonalistów.');
    }
  }, []);

  return (
    <EducationDashboard 
      darkMode={darkMode} 
      fontSize={fontSize} 
    />
  );
};

export default EducationPage;