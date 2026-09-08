import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, glows } from '../theme/tokens';

interface EquationDisplayProps {
  equation: string;
  userAnswer?: string;
  status?: 'idle' | 'success' | 'error';
  hint?: string;
  technique?: string;
}

export const EquationDisplay: React.FC<EquationDisplayProps> = ({
  equation,
  userAnswer = '',
  status = 'idle',
  hint,
  technique,
}) => {
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const borderColor = isError
    ? colors.errorCoral
    : isSuccess
    ? colors.successEmerald
    : colors.borderSubtle;

  const glowStyle = isError
    ? glows.coral
    : isSuccess
    ? { shadowColor: colors.successEmerald, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 }
    : undefined;

  return (
    <View style={[styles.card, { borderColor }, glowStyle]}>
      {technique && (
        <View style={styles.badgeContainer}>
          <Text style={styles.techniqueBadge}>{technique.toUpperCase()}</Text>
        </View>
      )}

      {/* Main Equation Container (Fixed min height 64dp to prevent CLS) */}
      <View style={styles.equationRow}>
        <Text style={styles.equationText}>{equation}</Text>
        <Text style={styles.equalsText}>=</Text>
        <View
          style={[
            styles.answerBox,
            isError && styles.answerBoxError,
            isSuccess && styles.answerBoxSuccess,
          ]}
        >
          <Text
            style={[
              styles.answerText,
              userAnswer.length === 0 && styles.placeholderText,
              isError && { color: colors.errorCoral },
              isSuccess && { color: colors.successEmerald },
            ]}
          >
            {userAnswer.length > 0 ? userAnswer : '?'}
          </Text>
        </View>
      </View>

      {hint ? (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>💡 {hint}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 120,
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.space3,
  },
  badgeContainer: {
    marginBottom: spacing.space2,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space1,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  techniqueBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryCyan,
    letterSpacing: 1,
  },
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  equationText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
    letterSpacing: 1,
  },
  equalsText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textSecondary,
    marginHorizontal: spacing.space2,
  },
  answerBox: {
    minWidth: 84,
    height: 54,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space2,
  },
  answerBoxError: {
    borderColor: colors.errorCoral,
    backgroundColor: 'rgba(251, 113, 133, 0.12)',
  },
  answerBoxSuccess: {
    borderColor: colors.successEmerald,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  answerText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  placeholderText: {
    color: colors.textMuted,
    opacity: 0.6,
  },
  hintContainer: {
    marginTop: spacing.space2,
    paddingHorizontal: spacing.space2,
  },
  hintText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EquationDisplay;
