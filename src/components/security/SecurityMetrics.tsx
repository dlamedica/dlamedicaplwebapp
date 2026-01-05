// 🔒 BEZPIECZEŃSTWO: Security Metrics - unikalna wizualizacja metryk bezpieczeństwa

import React from 'react';

interface MetricData {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface SecurityMetricsProps {
  metrics: MetricData[];
}

const SecurityMetrics: React.FC<SecurityMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};

const MetricCard: React.FC<{ metric: MetricData }> = ({ metric }) => {
  const percentage = (metric.value / metric.max) * 100;
  const clampedPercentage = Math.min(100, percentage);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-medium text-sm uppercase tracking-wide">
          {metric.label}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: metric.color }}
          ></div>
          <span className="text-xs text-gray-500 font-mono">
            {metric.value}/{metric.max}
          </span>
        </div>
      </div>

      {/* Value Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{metric.value}</span>
          <span className="text-lg text-gray-500">/ {metric.max}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background */}
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div
            className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              width: `${clampedPercentage}%`,
              backgroundColor: metric.color,
            }}
          >
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Percentage Label */}
        <div className="mt-2 text-right">
          <span className="text-xs text-gray-400 font-mono">
            {clampedPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Custom Visual Indicator */}
      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: 10 }).map((_, i) => {
          const segmentValue = (i + 1) * 10;
          const isActive = segmentValue <= clampedPercentage;
          return (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-20'
              }`}
              style={{
                backgroundColor: isActive ? metric.color : '#4B5563',
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityMetrics;

