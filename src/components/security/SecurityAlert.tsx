// 🔒 BEZPIECZEŃSTWO: Security Alert - unikalny komponent alertów bezpieczeństwa

import React from 'react';

interface SecurityAlertProps {
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp?: string;
  onDismiss?: () => void;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({
  type,
  title,
  message,
  timestamp,
  onDismiss,
}) => {
  const typeStyles = {
    warning: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-500/10',
      titleColor: 'text-yellow-400',
      accent: 'bg-yellow-500',
      pattern: 'from-yellow-500/20 to-orange-500/20',
    },
    danger: {
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      titleColor: 'text-red-400',
      accent: 'bg-red-500',
      pattern: 'from-red-500/20 to-pink-500/20',
    },
    info: {
      border: 'border-blue-500',
      bg: 'bg-blue-500/10',
      titleColor: 'text-blue-400',
      accent: 'bg-blue-500',
      pattern: 'from-blue-500/20 to-cyan-500/20',
    },
    success: {
      border: 'border-green-500',
      bg: 'bg-green-500/10',
      titleColor: 'text-green-400',
      accent: 'bg-green-500',
      pattern: 'from-green-500/20 to-emerald-500/20',
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`relative border-l-4 ${style.border} ${style.bg} rounded-lg p-5 mb-4 shadow-lg backdrop-blur-sm`}
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${style.pattern} opacity-50 rounded-lg`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Custom Indicator */}
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 ${style.accent} rounded-full animate-pulse`}></div>
              <div
                className={`w-3 h-3 ${style.accent} rounded-full mt-1 opacity-50`}
                style={{ transform: 'scale(1.5)' }}
              ></div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-bold text-lg ${style.titleColor}`}>{title}</h3>
                {timestamp && (
                  <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Dismiss Button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Zamknij"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current transform rotate-45"></div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current transform -rotate-45"></div>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Bottom Accent Line */}
        <div className={`mt-4 h-0.5 ${style.accent} rounded-full opacity-30`}></div>
      </div>
    </div>
  );
};

export default SecurityAlert;

