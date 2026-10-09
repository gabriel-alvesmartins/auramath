import React from 'react';

export interface CognitiveRadarData {
  speedScore: number;
  fermiScore: number;
  flexibilityScore: number;
  staminaScore: number;
  memoryScore: number;
  archetypeTitle?: string;
  archetypeDescription?: string;
}

export interface CognitiveRadarChartProps {
  radar: CognitiveRadarData;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface RadarAxisConfig {
  key: keyof Pick<CognitiveRadarData, 'speedScore' | 'fermiScore' | 'flexibilityScore' | 'staminaScore' | 'memoryScore'>;
  label: string;
  shortLabel: string;
}

export const RADAR_AXES: RadarAxisConfig[] = [
  { key: 'speedScore', label: 'Velocidade', shortLabel: 'Velocidade' },
  { key: 'fermiScore', label: 'Fermi', shortLabel: 'Fermi' },
  { key: 'flexibilityScore', label: 'Flexibilidade', shortLabel: 'Flexibilidade' },
  { key: 'staminaScore', label: 'Resistência', shortLabel: 'Resistência' },
  { key: 'memoryScore', label: 'Memória', shortLabel: 'Memória' },
];

/**
 * Computes polar coordinates for a given radar axis index and score.
 * Formula: theta_i = -PI/2 + i * (2*PI / 5)
 */
export function computeAxisPoint(
  index: number,
  score: number,
  center: number = 130,
  maxRadius: number = 80
): { x: number; y: number; angle: number } {
  const angle = -Math.PI / 2 + index * ((2 * Math.PI) / 5);
  const safeScore = Number.isFinite(score) ? score : 0;
  const normalized = Math.max(0, Math.min(100, safeScore)) / 100;
  const r = normalized * maxRadius;
  const x = center + r * Math.cos(angle);
  const y = center + r * Math.sin(angle);
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    angle,
  };
}

/**
 * CognitiveRadarChart — Standalone 5-axis polar SVG radar chart with dual-theme tokens.
 *
 * Polar Trigonometry:
 * - 5 axes: Speed, Fermi, Flexibility, Stamina, Memory
 * - Angle theta_i = -PI/2 + i * (2*PI / 5) for i in [0..4]
 * - Concentric guideline polygons (25%, 50%, 75%, 100%) with var(--color-border-subtle)
 * - User polygon with fill="var(--color-brand-surface)" and stroke="var(--color-brand)"
 * - Tabular numeral typography formatted in JetBrains Mono (.font-mono-tabular)
 */
export const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({
  radar,
  size = 260,
  className = '',
  style,
}) => {
  const center = 130;
  const maxRadius = 78;
  const labelRadius = 106;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Calculate user data polygon points
  const userPoints = RADAR_AXES.map((axis, i) => {
    const rawScore = radar[axis.key] ?? 0;
    return computeAxisPoint(i, rawScore, center, maxRadius);
  });

  const userPolygonPoints = userPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div
      className={`cognitive-radar-chart ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 260 260"
        width={size}
        height={size}
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
        role="img"
        aria-label="Gráfico Pentagonal do Radar Cognitivo de 5 Eixos"
      >
        {/* Background Concentric Guideline Polygons (25%, 50%, 75%, 100%) */}
        {levels.map((level) => {
          const guidelinePoints = RADAR_AXES.map((_, i) => {
            const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
            const r = level * maxRadius;
            const x = (center + r * Math.cos(angle)).toFixed(2);
            const y = (center + r * Math.sin(angle)).toFixed(2);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`guide-${level}`}
              points={guidelinePoints}
              fill={level === 1.0 ? 'var(--color-bg-elevated)' : 'none'}
              fillOpacity={level === 1.0 ? 0.35 : 0}
              stroke="var(--color-border-subtle)"
              strokeWidth={level === 1.0 ? '1.5' : '1'}
              strokeDasharray={level === 1.0 ? undefined : '3 3'}
            />
          );
        })}

        {/* Axis Spokes from Center to Outer Guideline Vertex */}
        {RADAR_AXES.map((_, i) => {
          const outer = computeAxisPoint(i, 100, center, maxRadius);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--color-border-subtle)"
              strokeWidth="1"
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={userPolygonPoints}
          fill="var(--color-brand-surface)"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ transition: 'all 0.3s ease-out' }}
        />

        {/* User Data Vertex Markers */}
        {userPoints.map((pt, i) => (
          <circle
            key={`vertex-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill="var(--color-brand)"
            stroke="var(--color-bg-surface)"
            strokeWidth="2"
          />
        ))}

        {/* 5 Axis Labels with Tabular Numerals */}
        {RADAR_AXES.map((axis, i) => {
          const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
          const rawScore = radar[axis.key] ?? 0;
          const safeScore = Number.isFinite(rawScore) ? rawScore : 0;
          const score = Math.round(safeScore);

          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);

          // Anchor & Alignment calibration
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          let dy = '0.35em';

          if (i === 0) {
            // Speed (Top)
            textAnchor = 'middle';
            dy = '-0.6em';
          } else if (i === 1) {
            // Fermi (Top-Right)
            textAnchor = 'start';
            dy = '0.3em';
          } else if (i === 2) {
            // Flexibility (Bottom-Right)
            textAnchor = 'start';
            dy = '0.9em';
          } else if (i === 3) {
            // Stamina (Bottom-Left)
            textAnchor = 'end';
            dy = '0.9em';
          } else if (i === 4) {
            // Memory (Top-Left)
            textAnchor = 'end';
            dy = '0.3em';
          }

          return (
            <text
              key={`label-${axis.key}`}
              x={lx}
              y={ly}
              textAnchor={textAnchor}
              dy={dy}
              className="font-mono-tabular"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '10.5px',
                fontWeight: 600,
                userSelect: 'none',
              }}
            >
              <tspan fill="var(--color-text-secondary)">{axis.label} </tspan>
              <tspan fill="var(--color-brand)" fontWeight="800">
                ({score})
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default CognitiveRadarChart;
