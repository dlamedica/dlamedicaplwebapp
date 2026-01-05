import React, { useEffect } from 'react';
import EducationDashboard from '../education/EducationDashboard';

interface EdukacjaPageProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const EdukacjaPage: React.FC<EdukacjaPageProps> = ({ darkMode, fontSize }) => {
  useEffect(() => {
    document.title = 'Edukacja medyczna – DlaMedica.pl';
    
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Platforma edukacyjna dla medyków - kursy, moduły i quizy z anatomii, fizjologii, kardiologii i innych dziedzin medycznych.');
    }

    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', 'Edukacja medyczna – DlaMedica.pl');
    }

    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', 'Ucz się medycyny online - interaktywne kursy, quizy i materiały edukacyjne dla studentów i profesjonalistów.');
    }
  }, []);

  return (
    <EducationDashboard 
      darkMode={darkMode} 
      fontSize={fontSize} 
    />
  );
};

export default EdukacjaPage;