import React from 'react';
import { QuestionCircleIcon } from '../icons/EducationIcons';
import Tooltip from './Tooltip';

interface InfoIconProps {
  content: React.ReactNode;
  darkMode?: boolean;
  size?: number;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoIcon: React.FC<InfoIconProps> = ({
  content,
  darkMode = false,
  size = 16,
  className = '',
  position = 'top'
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      darkMode={darkMode}
      className={className}
    >
      <button
        type="button"
        className={`inline-flex items-center justify-center rounded-full transition-colors ${
          darkMode
            ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        aria-label="Informacja"
      >
        <QuestionCircleIcon size={size} />
      </button>
    </Tooltip>
  );
};

export default InfoIcon;

