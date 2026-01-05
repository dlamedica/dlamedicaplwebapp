import React from 'react';
import JobOffersPage from '../../components/pages/JobOffersPage';

interface JobOffersIndexProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

/**
 * Job Offers Index Page
 * Equivalent to Next.js pages/oferty-pracy/index.tsx
 * 
 * This is the main job offers listing page that shows all available job offers
 * with filtering and search capabilities.
 */
const JobOffersIndex: React.FC<JobOffersIndexProps> = ({ darkMode, fontSize }) => {
  return (
    <JobOffersPage
      darkMode={darkMode}
      fontSize={fontSize}
    />
  );
};

export default JobOffersIndex;