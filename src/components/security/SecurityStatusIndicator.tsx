// 🔒 BEZPIECZEŃSTWO: Security Status Indicator - unikalny wskaźnik statusu bezpieczeństwa

import React, { useState, useEffect } from 'react';

interface SecurityStatusIndicatorProps {
  status: 'secure' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SecurityStatusIndicator: React.FC<SecurityStatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (status === 'critical') {
      const interval = setInterval(() => setPulse((p) => !p), 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const statusConfig = {
    secure: {
      color: 'bg-green-500',
      ring: 'ring-green-500/30',
      label: 'Bezpieczne',
      textColor: 'text-green-400',
    },
    warning: {
      color: 'bg-yellow-500',
      ring: 'ring-yellow-500/30',
      label: 'Ostrzeżenie',
      textColor: 'text-yellow-400',
    },
    critical: {
      color: 'bg-red-500',
      ring: 'ring-red-500/50',
      label: 'Krytyczne',
      textColor: 'text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      {/* Custom Status Dot */}
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 ${config.ring} rounded-full ${
            pulse && status === 'critical' ? 'animate-ping' : ''
          }`}
          style={{
            width: size === 'sm' ? '12px' : size === 'md' ? '16px' : '24px',
            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '24px',
          }}
        ></div>

        {/* Main Dot */}
        <div
          className={`relative ${config.color} ${sizeClasses[size]} rounded-full shadow-lg`}
        >
          {/* Inner Glow */}
          <div
            className={`absolute inset-0 ${config.color} rounded-full opacity-50 blur-sm`}
          ></div>

          {/* Center Core */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full`}
            style={{
              width: size === 'sm' ? '4px' : size === 'md' ? '6px' : '10px',
              height: size === 'sm' ? '4px' : size === 'md' ? '6px' : '10px',
            }}
          ></div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
      )}
    </div>
  );
};

export default SecurityStatusIndicator;

