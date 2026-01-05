import React from 'react';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  darkMode: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, darkMode, fontSize = 'medium' }) => {
  const fontSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }[fontSize];

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      window.history.pushState({}, '', item.path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <nav className={`flex items-center gap-2 mb-4 ${fontSizes}`} aria-label="Breadcrumb">
      <button
        onClick={() => {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        className={`flex items-center gap-1 transition-colors duration-200 ${
          darkMode
            ? 'text-gray-400 hover:text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Strona główna"
      >
        <FaHome />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FaChevronRight
            className={`${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}
            size={10}
          />
          {index === items.length - 1 ? (
            <span
              className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleClick(item)}
              className={`transition-colors duration-200 ${
                darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

