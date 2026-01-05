import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface UniversityStatsChartProps {
  data: ChartDataPoint[];
  title: string;
  darkMode: boolean;
  type?: 'bar' | 'line';
}

/**
 * Unikalny komponent wykresów dla sekcji uczelni
 * Zaprojektowany specjalnie dla DlaMedica.pl
 */
const UniversityStatsChart: React.FC<UniversityStatsChartProps> = ({ 
  data, 
  title, 
  darkMode,
  type = 'bar' 
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (type === 'bar') {
    return (
      <div className={`rounded-xl p-6 shadow-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="space-y-4">
          {data.map((point, index) => {
            const percentage = (point.value / maxValue) * 100;
            const color = point.color || '#38b6ff';
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {point.label}
                  </span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {point.value.toLocaleString('pl-PL')}
                  </span>
                </div>
                <div className={`relative h-8 rounded-full overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {/* Bar Fill with gradient */}
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                    }}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    {/* Animated indicator */}
                    {percentage > 15 && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-1 h-4 bg-white/40 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart
  const width = 600;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
    return { x, y, ...point };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const primaryColor = data[0]?.color || '#38b6ff';

  return (
    <div className={`rounded-xl p-6 shadow-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <div className="relative h-64">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + chartHeight - ratio * chartHeight;
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={darkMode ? '#374151' : '#E5E7EB'}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            );
          })}

          {/* Area Fill Gradient */}
          <defs>
            <linearGradient id={`areaGradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
            fill={`url(#areaGradient-${title})`}
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={primaryColor}
                className="animate-pulse"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
              />
              {/* Tooltip trigger area */}
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="transparent"
                className="cursor-pointer hover:fill-white/10 transition-colors"
              />
            </g>
          ))}

          {/* Labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={height - padding + 15}
              textAnchor="middle"
              fontSize="10"
              fill={darkMode ? '#9CA3AF' : '#6B7280'}
              className="font-medium"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default UniversityStatsChart;

