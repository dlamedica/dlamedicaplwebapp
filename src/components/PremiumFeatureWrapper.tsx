import React from 'react';
import { FaCrown, FaUser } from 'react-icons/fa';
import PremiumFeatureBadge from './PremiumFeatureBadge';

interface PremiumFeatureWrapperProps {
  children: React.ReactNode;
  darkMode?: boolean;
  isAuthenticated?: boolean;
  isPremium?: boolean;
  featureName: string;
  description?: string;
  onUpgrade?: () => void;
  onLogin?: () => void;
  className?: string;
}

const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({
  children,
  darkMode = false,
  isAuthenticated = false,
  isPremium = false,
  featureName,
  description,
  onUpgrade,
  onLogin,
  className = ''
}) => {
  // If user is authenticated and has premium, show full content
  if (isAuthenticated && isPremium) {
    return <div className={className}>{children}</div>;
  }

  // Show premium overlay
  return (
    <div className={`relative ${className}`}>
      {/* Blurred/disabled content */}
      <div className="pointer-events-none select-none">
        <div className="filter blur-sm opacity-50">
          {children}
        </div>
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
        darkMode ? 'bg-black/50' : 'bg-white/50'
      }`}>
        <div className={`max-w-md p-6 rounded-xl shadow-2xl text-center ${
          darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-center mb-4">
            <PremiumFeatureBadge 
              darkMode={darkMode} 
              size="large" 
              showText={true}
            />
          </div>
          
          <h3 className={`text-xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {featureName}
          </h3>
          
          {description && (
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}

          <div className="space-y-3">
            {!isAuthenticated ? (
              <>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Zaloguj się, aby uzyskać dostęp do funkcji premium
                </p>
                <button
                  onClick={onLogin}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FaUser className="w-4 h-4" />
                  Zaloguj się
                </button>
              </>
            ) : (
              <>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Uaktualnij do Premium, aby korzystać z tej funkcji
                </p>
                <button
                  onClick={onUpgrade}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-yellow-900'
                  }`}
                >
                  <FaCrown className="w-4 h-4" />
                  Uaktualnij do Premium
                </button>
              </>
            )}
          </div>

          <div className={`mt-4 pt-4 border-t text-xs ${
            darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            Tłumaczenia są dostępne za darmo - płatne są tylko zaawansowane narzędzia
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureWrapper;