// 🔒 BEZPIECZEŃSTWO: Security Chart - unikalna wizualizacja danych bezpieczeństwa

import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface SecurityChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'bar' | 'line' | 'area';
}

const SecurityChart: React.FC<SecurityChartProps> = ({ data, title, type = 'bar' }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>

      {type === 'bar' && (
        <div className="space-y-4">
          {data.map((point, index) => (
            <BarItem key={index} point={point} maxValue={maxValue} />
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="relative h-64">
          <LineChart data={data} maxValue={maxValue} />
        </div>
      )}

      {type === 'area' && (
        <div className="relative h-64">
          <AreaChart data={data} maxValue={maxValue} />
        </div>
      )}
    </div>
  );
};

const BarItem: React.FC<{ point: ChartDataPoint; maxValue: number }> = ({
  point,
  maxValue,
}) => {
  const percentage = (point.value / maxValue) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 font-medium">{point.label}</span>
        <span className="text-gray-400 font-mono">{point.value}</span>
      </div>
      <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
        {/* Bar Fill */}
        <div
          className="h-full rounded-full transition-all duration-500 relative"
          style={{
            width: `${percentage}%`,
            backgroundColor: point.color,
          }}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        {/* Value Indicator */}
        {percentage > 10 && (
          <div className="absolute inset-0 flex items-center justify-end pr-2">
            <div className="w-1 h-4 bg-white/30 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const LineChart: React.FC<{ data: ChartDataPoint[]; maxValue: number }> = ({
  data,
  maxValue,
}) => {
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

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
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
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Area Fill */}
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={data[0]?.color || '#3B82F6'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={data[0]?.color || '#3B82F6'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
        fill="url(#areaGradient)"
      />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={data[0]?.color || '#3B82F6'}
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
            r="5"
            fill={point.color}
            stroke="#1F2937"
            strokeWidth="2"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="8"
            fill={point.color}
            opacity="0.2"
            className="animate-pulse"
          />
        </g>
      ))}

      {/* Labels */}
      {points.map((point, index) => (
        <text
          key={index}
          x={point.x}
          y={padding + chartHeight + 20}
          textAnchor="middle"
          className="text-xs fill-gray-400"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
};

const AreaChart: React.FC<{ data: ChartDataPoint[]; maxValue: number }> = ({
  data,
  maxValue,
}) => {
  return <LineChart data={data} maxValue={maxValue} />;
};

export default SecurityChart;

