/**
 * Interaktywna mapa ciała (Body Map)
 * SVG z klikalnymi regionami do badania fizykalnego
 */

import React, { useState } from 'react';
import { BodyMapProps, BodyRegion, BodyView, ExamType } from '../types/physicalExam';
import { bodyRegions, heartAuscultationPoints } from '../data/bodyRegions';
import '../styles/bodyMapStyles.css';

const BodyMap: React.FC<BodyMapProps> = ({
  view,
  zoom,
  selectedExamType,
  highlightedRegion,
  examinedRegions,
  onRegionClick,
  onRegionHover,
  darkMode,
  disabled = false
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Filtruj regiony według widoku
  const visibleRegions = bodyRegions.filter(r => r.position === view);

  // Sprawdź czy region jest dostępny dla aktualnego typu badania
  const isRegionAvailable = (region: BodyRegion): boolean => {
    return region.availableExams.includes(selectedExamType);
  };

  // Sprawdź czy region był zbadany
  const isRegionExamined = (regionId: string): boolean => {
    return examinedRegions.includes(regionId);
  };

  // Obsługa hover
  const handleMouseEnter = (region: BodyRegion, e: React.MouseEvent) => {
    if (disabled) return;
    setHoveredRegion(region.id);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    onRegionHover(region);
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    onRegionHover(null);
  };

  // Obsługa kliknięcia
  const handleClick = (region: BodyRegion) => {
    if (disabled || !isRegionAvailable(region)) return;
    onRegionClick(region);
  };

  // Kolor regionu
  const getRegionColor = (region: BodyRegion): string => {
    if (!isRegionAvailable(region)) {
      return darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(156, 163, 175, 0.2)';
    }
    
    if (isRegionExamined(region.id)) {
      return darkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)';
    }
    
    if (hoveredRegion === region.id || highlightedRegion === region.id) {
      return darkMode ? 'rgba(56, 182, 255, 0.4)' : 'rgba(56, 182, 255, 0.35)';
    }
    
    if (region.isKeyPoint) {
      return darkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.15)';
    }
    
    return darkMode ? 'rgba(107, 114, 128, 0.15)' : 'rgba(209, 213, 219, 0.3)';
  };

  // Kolor obrysu
  const getStrokeColor = (region: BodyRegion): string => {
    if (!isRegionAvailable(region)) {
      return darkMode ? '#374151' : '#9ca3af';
    }
    
    if (isRegionExamined(region.id)) {
      return '#22c55e';
    }
    
    if (hoveredRegion === region.id || highlightedRegion === region.id) {
      return '#38b6ff';
    }
    
    if (region.isKeyPoint) {
      return '#fbbf24';
    }
    
    return darkMode ? '#4b5563' : '#d1d5db';
  };

  // Ikona narzędzia
  const getExamTypeIcon = (type: ExamType): string => {
    switch (type) {
      case 'auscultation': return '🩺';
      case 'palpation': return '✋';
      case 'percussion': return '🔨';
      case 'inspection': return '👁️';
      default: return '•';
    }
  };

  return (
    <div className={`body-map-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Nagłówek z przełącznikiem widoku */}
      <div className="body-map-header">
        <span className={`body-map-view-label ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {view === 'front' ? 'Widok od przodu' : 'Widok od tyłu'}
        </span>
        <span className={`body-map-tool-indicator ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {getExamTypeIcon(selectedExamType)} {selectedExamType === 'auscultation' ? 'Osłuchiwanie' : 
           selectedExamType === 'palpation' ? 'Palpacja' : 
           selectedExamType === 'percussion' ? 'Perkusja' : 'Inspekcja'}
        </span>
      </div>

      {/* SVG Mapa ciała */}
      <svg
        viewBox="0 0 100 100"
        className={`body-map-svg ${disabled ? 'disabled' : ''}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Tło sylwetki */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={darkMode ? '#1f2937' : '#f3f4f6'} />
            <stop offset="100%" stopColor={darkMode ? '#111827' : '#e5e7eb'} />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Sylwetka ciała */}
        <g className="body-silhouette">
          {view === 'front' ? (
            // Sylwetka przód
            <path
              d="M50 2
                 C45 2 42 6 42 10
                 C42 14 45 18 50 18
                 C55 18 58 14 58 10
                 C58 6 55 2 50 2
                 M50 18
                 L50 20
                 C44 20 40 22 38 24
                 L28 24
                 C26 24 24 26 24 28
                 L18 56
                 C17 58 18 60 20 60
                 L26 58
                 L28 46
                 C28 46 30 70 30 72
                 L34 98
                 C34 100 36 100 38 100
                 L46 100
                 C48 100 48 98 48 96
                 L50 72
                 L52 96
                 C52 98 52 100 54 100
                 L62 100
                 C64 100 66 100 66 98
                 L70 72
                 C70 70 72 46 72 46
                 L74 58
                 L80 60
                 C82 60 83 58 82 56
                 L76 28
                 C76 26 74 24 72 24
                 L62 24
                 C60 22 56 20 50 20"
              fill="url(#bodyGradient)"
              stroke={darkMode ? '#374151' : '#9ca3af'}
              strokeWidth="0.5"
            />
          ) : (
            // Sylwetka tył
            <path
              d="M50 2
                 C45 2 42 6 42 10
                 C42 14 45 18 50 18
                 C55 18 58 14 58 10
                 C58 6 55 2 50 2
                 M50 18
                 L50 20
                 C44 20 40 22 38 24
                 L28 24
                 C26 24 24 26 24 28
                 L18 56
                 C17 58 18 60 20 60
                 L26 58
                 L28 46
                 C28 46 30 70 30 72
                 L34 98
                 C34 100 36 100 38 100
                 L46 100
                 C48 100 48 98 48 96
                 L50 72
                 L52 96
                 C52 98 52 100 54 100
                 L62 100
                 C64 100 66 100 66 98
                 L70 72
                 C70 70 72 46 72 46
                 L74 58
                 L80 60
                 C82 60 83 58 82 56
                 L76 28
                 C76 26 74 24 72 24
                 L62 24
                 C60 22 56 20 50 20"
              fill="url(#bodyGradient)"
              stroke={darkMode ? '#374151' : '#9ca3af'}
              strokeWidth="0.5"
            />
          )}
        </g>

        {/* Regiony interaktywne */}
        <g className="body-regions">
          {visibleRegions.map(region => (
            <g key={region.id} className={`body-region ${isRegionAvailable(region) ? 'available' : 'unavailable'}`}>
              <rect
                x={region.x}
                y={region.y}
                width={region.width}
                height={region.height}
                rx="2"
                fill={getRegionColor(region)}
                stroke={getStrokeColor(region)}
                strokeWidth={hoveredRegion === region.id ? "1" : "0.5"}
                strokeDasharray={!isRegionAvailable(region) ? "2,2" : "none"}
                className={`region-rect ${isRegionExamined(region.id) ? 'examined' : ''} ${region.isKeyPoint ? 'key-point' : ''}`}
                style={{
                  cursor: isRegionAvailable(region) && !disabled ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => handleMouseEnter(region, e)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(region)}
                filter={hoveredRegion === region.id ? "url(#glow)" : "none"}
              />
              
              {/* Etykieta regionu */}
              {(hoveredRegion === region.id || isRegionExamined(region.id)) && (
                <text
                  x={region.x + region.width / 2}
                  y={region.y + region.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="region-label"
                  fill={darkMode ? '#fff' : '#1f2937'}
                  fontSize="2.5"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {isRegionExamined(region.id) ? '✓' : ''}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Punkty osłuchiwania serca (tylko dla trybu auscultation i widoku front) */}
        {selectedExamType === 'auscultation' && view === 'front' && (
          <g className="heart-points">
            {heartAuscultationPoints.map(point => (
              <g key={point.id} className="heart-point">
                <circle
                  cx={point.position.x}
                  cy={point.position.y}
                  r="2"
                  fill={examinedRegions.includes(point.id) ? '#22c55e' : '#ef4444'}
                  stroke={darkMode ? '#1f2937' : '#fff'}
                  strokeWidth="0.5"
                  className="heart-point-circle"
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                  onClick={() => !disabled && onRegionClick({
                    id: point.id,
                    name: point.fullName,
                    namePL: point.fullName,
                    type: 'heart',
                    position: 'front',
                    x: point.position.x - 2,
                    y: point.position.y - 2,
                    width: 4,
                    height: 4,
                    availableExams: ['auscultation'],
                    isKeyPoint: true
                  })}
                />
                <text
                  x={point.position.x}
                  y={point.position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="2"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {point.name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Legenda */}
        <g className="body-map-legend" transform="translate(2, 88)">
          <rect x="0" y="0" width="3" height="3" fill="rgba(251, 191, 36, 0.3)" stroke="#fbbf24" strokeWidth="0.3" rx="0.5" />
          <text x="5" y="2.5" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="2">Kluczowe</text>
          
          <rect x="18" y="0" width="3" height="3" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="0.3" rx="0.5" />
          <text x="23" y="2.5" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="2">Zbadane</text>
          
          <rect x="38" y="0" width="3" height="3" fill="rgba(56, 182, 255, 0.3)" stroke="#38b6ff" strokeWidth="0.3" rx="0.5" />
          <text x="43" y="2.5" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="2">Aktywny</text>
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredRegion && !disabled && (
        <div 
          className={`body-map-tooltip ${darkMode ? 'dark' : 'light'}`}
          style={{
            position: 'fixed',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            zIndex: 1000
          }}
        >
          {bodyRegions.find(r => r.id === hoveredRegion)?.namePL || hoveredRegion}
          {!isRegionAvailable(bodyRegions.find(r => r.id === hoveredRegion)!) && (
            <span className="tooltip-unavailable"> (niedostępne dla tego badania)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BodyMap;

