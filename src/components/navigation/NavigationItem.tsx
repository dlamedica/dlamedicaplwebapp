import React from 'react';
import {
  FaHome, FaBook, FaHeartbeat, FaStar, FaLayerGroup, FaChartLine,
  FaClipboardList, FaCog, FaQuestionCircle, FaUser, FaEnvelope,
  FaAward, FaFileInvoice, FaCreditCard, FaGift, FaBuilding,
  FaStickyNote, FaLifeRing, FaFileAlt, FaShieldAlt, FaBalanceScale,
  FaLock, FaChevronRight, FaChevronDown, FaUserInjured, FaGraduationCap
} from 'react-icons/fa';
import { NavigationItem as NavigationItemType } from '../../types/navigation';

interface NavigationItemProps {
  item: NavigationItemType;
  isActive: boolean;
  darkMode?: boolean;
  onItemClick: (item: NavigationItemType) => void;
  onToggleExpand?: (itemId: string) => void;
  level?: number;
}

const iconMap = {
  FaHome, FaBook, FaHeartbeat, FaStar, FaLayerGroup, FaChartLine,
  FaClipboardList, FaCog, FaQuestionCircle, FaUser, FaEnvelope,
  FaAward, FaFileInvoice, FaCreditCard, FaGift, FaBuilding,
  FaStickyNote, FaLifeRing, FaFileAlt, FaShieldAlt, FaBalanceScale,
  FaLock, FaUserInjured, FaGraduationCap
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  darkMode = false,
  onItemClick,
  onToggleExpand,
  level = 0
}) => {
  const IconComponent = iconMap[item.icon as keyof typeof iconMap];
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.isExpanded;

  const handleClick = () => {
    if (hasChildren && onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      onItemClick(item);
    }
  };

  const baseClasses = `
    flex items-center w-full px-6 py-3 text-left transition-all duration-200 group
    ${level > 0 ? 'pl-12' : ''}
    ${isActive
      ? darkMode
        ? 'bg-[#38b6ff] text-black border-r-4 border-[#2a9fe5] font-medium'
        : 'bg-[#38b6ff] text-black border-r-4 border-[#2a9fe5] font-medium'
      : darkMode
        ? 'text-gray-300 hover:bg-[#38b6ff]/10 hover:text-[#38b6ff]'
        : 'text-gray-600 hover:bg-[#38b6ff]/10 hover:text-[#2a9fe5]'
    }
    ${!hasChildren && !isActive ? 'hover:border-r-2 hover:border-[#38b6ff]/30' : ''}
  `;

  return (
    <div>
      <button
        onClick={handleClick}
        className={baseClasses}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mr-3">
          {IconComponent && (
            <IconComponent
              size={16}
              className={`transition-colors duration-200 ${isActive
                ? 'text-black'
                : darkMode
                  ? 'text-gray-400 group-hover:text-[#38b6ff]'
                  : 'text-gray-500 group-hover:text-[#2a9fe5]'
                }`}
            />
          )}
        </div>

        {/* Label */}
        <span className="flex-1 font-medium text-sm leading-relaxed">
          {item.label}
        </span>

        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? (
              <FaChevronDown
                size={14}
                className={darkMode ? 'text-gray-400' : 'text-gray-500'}
              />
            ) : (
              <FaChevronRight
                size={14}
                className={darkMode ? 'text-gray-400' : 'text-gray-500'}
              />
            )}
          </div>
        )}
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className={`${darkMode ? 'bg-gray-900/30' : 'bg-gray-50/50'
          } border-l border-l-2 ${darkMode ? 'border-gray-700/50' : 'border-gray-200'
          } ml-3`}>
          {item.children?.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              isActive={false} // Child items active state logic can be added later
              darkMode={darkMode}
              onItemClick={onItemClick}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;