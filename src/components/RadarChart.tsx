import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { CognitiveRadar } from '@auramath/engine';

interface RadarChartProps {
  radar: CognitiveRadar;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ radar, size = 300 }) => {
  const center = size / 2;
  const radius = size * 0.38;

  const axes = [
    { label: 'Velocidade', value: radar.speedScore },
    { label: 'Fermi', value: radar.fermiScore },
    { label: 'Flexibilidade', value: radar.flexibilityScore },
    { label: 'Resistência', value: radar.staminaScore },
    { label: 'Memória', value: radar.memoryScore },
  ];

  const totalAxes = axes.length;
  const angleStep = (2 * Math.PI) / totalAxes;
  const startAngle = -Math.PI / 2; // top

  // Function to calculate x, y coordinates
  const getCoordinates = (index: number, score: number) => {
    const angle = startAngle + index * angleStep;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Polygon points
  const polygonPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid levels (25, 50, 75, 100)
  const gridLevels = [25, 50, 75, 100];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Concentric grid polygons */}
        {gridLevels.map((lvl) => {
          const points = axes
            .map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <Polygon
              key={`grid-${lvl}`}
              points={points}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              fill={lvl === 100 ? 'rgba(13, 17, 26, 0.4)' : 'none'}
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <Polygon
          points={polygonPoints}
          fill="rgba(0, 242, 254, 0.25)"
          stroke={colors.primaryCyan}
          strokeWidth="2.5"
        />

        {/* Data Vertices */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, axis.value);
          return (
            <Circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="4.5"
              fill={colors.accentViolet}
              stroke={colors.primaryCyan}
              strokeWidth="2"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = startAngle + i * angleStep;
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle) + 4;

          return (
            <SvgText
              key={`label-${i}`}
              x={lx}
              y={ly}
              fill={colors.textSecondary}
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              {axis.label} ({axis.value})
            </SvgText>
          );
        })}
      </Svg>

      <View style={styles.archetypeCard}>
        <Text style={styles.archetypeTitle}>{radar.archetypeTitle}</Text>
        <Text style={styles.archetypeDesc}>{radar.archetypeDescription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.space2,
  },
  archetypeCard: {
    marginTop: spacing.space3,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    backgroundColor: 'rgba(138, 43, 226, 0.12)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    alignItems: 'center',
    maxWidth: 320,
  },
  archetypeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryCyan,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  archetypeDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RadarChart;
