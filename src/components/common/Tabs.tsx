import React, { memo, useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  darkMode?: boolean;
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * Reusable Tabs component
 * Optimized with React.memo
 */
const Tabs: React.FC<TabsProps> = memo(({
  tabs,
  defaultTab,
  onChange,
  className = '',
  darkMode = false,
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabs.find(t => t.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const variantStyles = {
    default: {
      tab: (isActive: boolean, isDisabled: boolean) =>
        `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          isActive
            ? darkMode
              ? 'bg-gray-800 text-white border-b-2 border-[#38b6ff]'
              : 'bg-white text-[#38b6ff] border-b-2 border-[#38b6ff]'
            : darkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-800'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
    pills: {
      tab: (isActive: boolean, isDisabled: boolean) =>
        `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          isActive
            ? darkMode
              ? 'bg-[#38b6ff] text-white'
              : 'bg-[#38b6ff] text-white'
            : darkMode
            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
    underline: {
      tab: (isActive: boolean, isDisabled: boolean) =>
        `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          isActive
            ? darkMode
              ? 'border-[#38b6ff] text-white'
              : 'border-[#38b6ff] text-[#38b6ff]'
            : darkMode
            ? 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`flex ${
          variant === 'pills' ? 'gap-2' : 'border-b'
        } ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled || false;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              onClick={() => handleTabChange(tab.id)}
              className={styles.tab(isActive, isDisabled)}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className={`mt-4 ${
          darkMode ? 'text-gray-200' : 'text-gray-900'
        }`}
        role="tabpanel"
      >
        {activeTabContent}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.tabs === nextProps.tabs &&
    prevProps.defaultTab === nextProps.defaultTab &&
    prevProps.variant === nextProps.variant &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.className === nextProps.className
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;

