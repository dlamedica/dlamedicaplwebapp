import React from 'react';

interface AdBannerProps {
  darkMode: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ darkMode }) => {
  return (
    <section className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div 
            className={`w-full max-w-[728px] h-[90px] border-2 border-dashed rounded-lg flex items-center justify-center ${
              darkMode 
                ? 'border-gray-600 bg-gray-800 text-gray-400' 
                : 'border-gray-300 bg-white text-gray-500'
            }`}
          >
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Google AdSense</div>
              <div className="text-xs">728 x 90</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;