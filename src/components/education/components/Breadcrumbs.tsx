import React from 'react';
import { ChevronDownIcon } from '../icons/EducationIcons';
import './breadcrumbsStyles.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string; size?: number | string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  darkMode: boolean;
  onNavigate?: (path: string) => void;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  darkMode,
  onNavigate,
  className = ''
}) => {
  const handleClick = (item: BreadcrumbItem, index: number) => {
    if (item.path && onNavigate && index < items.length - 1) {
      onNavigate(item.path);
    }
  };

  return (
    <nav className={`breadcrumbs ${darkMode ? 'breadcrumbs-dark' : 'breadcrumbs-light'} ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const IconComponent = item.icon;

          return (
            <li key={index} className="breadcrumbs-item">
              {index > 0 && (
                <div className={`breadcrumbs-separator ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              )}
              <button
                onClick={() => handleClick(item, index)}
                className={`breadcrumbs-link ${
                  isLast
                    ? 'breadcrumbs-link-active'
                    : 'breadcrumbs-link-inactive'
                } ${darkMode ? 'breadcrumbs-link-dark' : 'breadcrumbs-link-light'}`}
                disabled={isLast}
                aria-current={isLast ? 'page' : undefined}
              >
                {IconComponent && (
                  <span className="breadcrumbs-icon">
                    <IconComponent size={16} />
                  </span>
                )}
                <span className="breadcrumbs-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

