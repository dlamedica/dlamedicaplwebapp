import React from 'react';
import ASACalculator from './ASACalculator';
import BristolCalculator from './BristolCalculator';
import GDSCalculator from './GDSCalculator';
import KillipCalculator from './KillipCalculator';
import LownCalculator from './LownCalculator';
import TNMCalculator from './TNMCalculator';
import RansonCalculator from './RansonCalculator';
import MMSECalculator from './MMSECalculator';
import PediatricGCSCalculator from './PediatricGCSCalculator';
import AldretaCalculator from './AldretaCalculator';
import AlvaradoCalculator from './AlvaradoCalculator';
import ApfelCalculator from './ApfelCalculator';
import ApgarCalculator from './ApgarCalculator';
import AVPUCalculator from './AVPUCalculator';
import BiaterveldCalculator from './BiaterveldCalculator';
import BishopCalculator from './BishopCalculator';
import BurchWartofksyCalculator from './BurchWartofksyCalculator';
import CCSCalculator from './CCSCalculator';
import CEAPCalculator from './CEAPCalculator';
import CentorCalculator from './CentorCalculator';
import CHADSCalculator from './CHADSCalculator';
import ChildPughCalculator from './ChildPughCalculator';
import ISSCalculator from './ISSCalculator';
import BeckDepressionCalculator from './BeckDepressionCalculator';
import NotFoundPage from './NotFoundPage';

interface CalculatorRouterProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  slug: string | null;
}

const CalculatorRouter: React.FC<CalculatorRouterProps> = ({ darkMode, fontSize, slug }) => {
  if (!slug) {
    return <NotFoundPage darkMode={darkMode} highContrast={false} fontSize={fontSize} />;
  }

  // Map slug to calculator component
  const calculatorComponents: Record<string, React.ReactNode> = {
    'asa': <ASACalculator />,
    'bristol': <BristolCalculator />,
    'gds': <GDSCalculator />,
    'killip': <KillipCalculator />,
    'lown': <LownCalculator />,
    'tnm': <TNMCalculator />,
    'ranson': <RansonCalculator />,
    'mmse': <MMSECalculator />,
    'pediatric-gcs': <PediatricGCSCalculator />,
    'aldreta': <AldretaCalculator />,
    'alvarado': <AlvaradoCalculator />,
    'apfel': <ApfelCalculator />,
    'apgar': <ApgarCalculator />,
    'avpu': <AVPUCalculator />,
    'biaterveld': <BiaterveldCalculator />,
    'bishop': <BishopCalculator />,
    'burch-wartofksy': <BurchWartofksyCalculator />,
    'ccs': <CCSCalculator />,
    'ceap': <CEAPCalculator />,
    'centor': <CentorCalculator />,
    'chads': <CHADSCalculator />,
    'child-pugh': <ChildPughCalculator />,
    'iss': <ISSCalculator />,
    'beck-depression': <BeckDepressionCalculator />
  };

  const calculatorComponent = calculatorComponents[slug];

  if (!calculatorComponent) {
    return <NotFoundPage darkMode={darkMode} highContrast={false} fontSize={fontSize} />;
  }

  return <>{calculatorComponent}</>;
};

export default CalculatorRouter;