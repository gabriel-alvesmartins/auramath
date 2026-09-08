import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Path, G } from 'react-native-svg';
import { colors } from '../theme/tokens';

interface AuraMascotProps {
  combo?: number;
  stage?: 1 | 2 | 3 | 4 | 5;
  state?: 'idle' | 'happy' | 'hit' | 'supernova';
  size?: number;
}

export const AuraMascot: React.FC<AuraMascotProps> = ({
  combo = 1,
  stage,
  state = 'idle',
  size = 90,
}) => {
  // Compute effective stage
  const effectiveStage = stage || (combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1);

  // Colors per stage
  const stageColors = {
    1: { core: colors.primaryCyan, outer: colors.accentViolet, auraGlow: 'rgba(0, 242, 254, 0.4)' },
    2: { core: '#38BDF8', outer: '#6366F1', auraGlow: 'rgba(56, 189, 248, 0.5)' },
    3: { core: colors.accentViolet, outer: colors.plasmaMagenta, auraGlow: 'rgba(138, 43, 226, 0.6)' },
    4: { core: colors.goldStellar, outer: '#F97316', auraGlow: 'rgba(250, 204, 21, 0.7)' },
    5: { core: colors.plasmaMagenta, outer: colors.primaryCyan, auraGlow: 'rgba(225, 29, 72, 0.8)' },
  }[effectiveStage];

  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, pulseAnim]);

  const radius = size / 2;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: floatAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={stageColors.core} stopOpacity="0.9" />
            <Stop offset="60%" stopColor={stageColors.outer} stopOpacity="0.4" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="coreLight" cx="40%" cy="35%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="50%" stopColor={stageColors.core} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={stageColors.outer} stopOpacity="0.3" />
          </RadialGradient>
        </Defs>

        {/* Ambient Halo */}
        <Circle cx="50" cy="50" r="46" fill="url(#auraGlow)" />

        {/* Stage 2+ Plasma Wings */}
        {effectiveStage >= 2 && (
          <G opacity="0.7">
            <Path
              d="M20 50 Q5 35 15 20 Q30 30 35 45 Z"
              fill={stageColors.core}
              opacity="0.6"
            />
            <Path
              d="M80 50 Q95 35 85 20 Q70 30 65 45 Z"
              fill={stageColors.core}
              opacity="0.6"
            />
          </G>
        )}

        {/* Stage 3+ Gyro Rings */}
        {effectiveStage >= 3 && (
          <G stroke={stageColors.outer} strokeWidth="1.5" fill="none" opacity="0.6">
            <Circle cx="50" cy="50" r="38" strokeDasharray="6 3" />
          </G>
        )}

        {/* Stage 4+ Cosmic Spikes / Corona */}
        {effectiveStage >= 4 && (
          <G stroke={colors.goldStellar} strokeWidth="1.5" opacity="0.8">
            <Path d="M50 8 L50 2 M50 92 L50 98 M8 50 L2 50 M92 50 L98 50" />
            <Path d="M20 20 L15 15 M80 80 L85 85 M80 20 L85 15 M20 80 L15 85" />
          </G>
        )}

        {/* Central Bioluminescent Orb */}
        <Circle cx="50" cy="50" r="28" fill="url(#coreLight)" />

        {/* Bioluminescent Eyes */}
        <G fill="#FFFFFF">
          {state === 'happy' ? (
            <>
              <Path d="M40 48 Q44 42 48 48" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
              <Path d="M52 48 Q56 42 60 48" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            </>
          ) : state === 'hit' ? (
            <>
              <Path d="M40 44 L48 50 M48 44 L40 50" stroke={colors.errorCoral} strokeWidth="2" />
              <Path d="M52 44 L60 50 M60 44 L52 50" stroke={colors.errorCoral} strokeWidth="2" />
            </>
          ) : (
            <>
              <Circle cx="44" cy="46" r="3.5" />
              <Circle cx="56" cy="46" r="3.5" />
              <Circle cx="45.5" cy="44.5" r="1.2" fill={stageColors.core} />
              <Circle cx="57.5" cy="44.5" r="1.2" fill={stageColors.core} />
            </>
          )}
        </G>

        {/* Mouth */}
        {state === 'happy' ? (
          <Path d="M46 56 Q50 60 54 56" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        ) : (
          <Circle cx="50" cy="56" r="1.5" fill="#FFFFFF" opacity="0.7" />
        )}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuraMascot;
