import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { TrackNodeData } from '@auramath/engine';

interface TrackNodeProps {
  node: TrackNodeData;
  onPress: (node: TrackNodeData) => void;
  isActive?: boolean;
}

export const TrackNode: React.FC<TrackNodeProps> = ({
  node,
  onPress,
  isActive = false,
}) => {
  const isCompleted = node.stars > 0;
  const isLocked = node.isLocked;

  const nodeColor = isLocked
    ? colors.textDisabled
    : isCompleted
    ? colors.goldStellar
    : colors.primaryCyan;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={isLocked}
        onPress={() => onPress(node)}
        style={[
          styles.container,
          isLocked && styles.lockedContainer,
          isActive && styles.activeContainer,
        ]}
      >
        {/* SVG Progress Ring */}
        <Svg width={76} height={76} style={styles.svgRing}>
          <Circle
            cx="38"
            cy="38"
            r="34"
            stroke={isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="3"
            fill="none"
          />
          {!isLocked && (
            <Circle
              cx="38"
              cy="38"
              r="34"
              stroke={nodeColor}
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="213"
              strokeDashoffset={213 - (213 * (node.stars / 3))}
              strokeLinecap="round"
            />
          )}
        </Svg>

        <View
          style={[
            styles.innerCircle,
            {
              backgroundColor: isLocked
                ? 'rgba(255,255,255,0.02)'
                : isCompleted
                ? 'rgba(250, 204, 21, 0.12)'
                : 'rgba(0, 242, 254, 0.12)',
            },
          ]}
        >
          {isLocked ? (
            <Text style={styles.lockIcon}>🔒</Text>
          ) : (
            <Text style={[styles.orderNumber, { color: nodeColor }]}>
              {node.order}
            </Text>
          )}
        </View>

        {/* Stars Pill */}
        {!isLocked && (
          <View style={styles.starsPill}>
            {[1, 2, 3].map((s) => (
              <Text
                key={s}
                style={[
                  styles.starText,
                  { color: s <= node.stars ? colors.goldStellar : colors.textMuted },
                ]}
              >
                ★
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoCol}>
        <Text style={[styles.title, isLocked && styles.lockedText]}>
          {node.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {node.subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: spacing.space3,
  },
  container: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    shadowColor: colors.primaryCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  lockedContainer: {
    opacity: 0.5,
  },
  svgRing: {
    position: 'absolute',
  },
  innerCircle: {
    width: 58,
    height: 58,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  lockIcon: {
    fontSize: 20,
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: typography.fontFamily.mono,
  },
  starsPill: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    backgroundColor: 'rgba(7, 9, 14, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  starText: {
    fontSize: 10,
    marginHorizontal: 1,
  },
  infoCol: {
    marginTop: spacing.space2,
    alignItems: 'center',
    maxWidth: 220,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default TrackNode;
