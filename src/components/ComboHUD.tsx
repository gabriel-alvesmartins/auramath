import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, getAuraStage } from '../theme/tokens';

interface ComboHUDProps {
  combo: number;
  multiplier?: number;
}

export const ComboHUD: React.FC<ComboHUDProps> = ({ combo, multiplier = 1 }) => {
  const stageInfo = getAuraStage(combo);

  return (
    <View style={[styles.container, { borderColor: stageInfo.color }]}>
      <View style={styles.leftCol}>
        <View style={styles.multiplierRow}>
          <Text style={[styles.comboText, { color: stageInfo.color }]}>
            {combo > 0 ? `×${combo}` : '0'}
          </Text>
          <Text style={styles.comboLabel}>COMBO</Text>
        </View>
        <Text style={[styles.stageBadge, { color: stageInfo.color }]}>
          {stageInfo.name.toUpperCase()}
        </Text>
      </View>

      <View style={styles.rightCol}>
        <View style={[styles.multiplierPill, { backgroundColor: `${stageInfo.color}22` }]}>
          <Text style={[styles.multiplierText, { color: stageInfo.color }]}>
            {multiplier > 1 ? `${multiplier}x BÔNUS` : '1.0x'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 17, 26, 0.85)',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    minWidth: 170,
  },
  leftCol: {
    alignItems: 'flex-start',
  },
  multiplierRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  comboText: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: typography.fontFamily.mono,
    marginRight: 4,
  },
  comboLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  stageBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: -2,
  },
  rightCol: {
    marginLeft: spacing.space2,
  },
  multiplierPill: {
    paddingHorizontal: spacing.space2,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '800',
  },
});

export default ComboHUD;
