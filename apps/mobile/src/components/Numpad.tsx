import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, typography, spacing } from '../theme/tokens';

interface NumpadProps {
  onPressDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  inverted?: boolean;
  accentColor?: string;
}

export const Numpad: React.FC<NumpadProps> = ({
  onPressDigit,
  onDelete,
  onClear,
  onSubmit,
  disabled = false,
  inverted = false,
  accentColor = colors.primaryCyan,
}) => {
  const triggerHaptic = (type: 'light' | 'medium') => {
    try {
      if (type === 'light') {
        Haptics.selectionAsync?.();
      } else {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Graceful fallback on web or unsupported devices
    }
  };

  // Flick Gestures (Swipe Right = Submit, Swipe Left = Clear)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 30,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 45) {
          // Flick Right -> Submit
          triggerHaptic('medium');
          onSubmit?.();
        } else if (gestureState.dx < -45) {
          // Flick Left -> Clear
          triggerHaptic('light');
          onClear();
        }
      },
    })
  ).current;

  const handlePress = (char: string) => {
    if (disabled) return;
    triggerHaptic('light');
    onPressDigit(char);
  };

  const handleDel = () => {
    if (disabled) return;
    triggerHaptic('light');
    onDelete();
  };

  const handleSubmit = () => {
    if (disabled) return;
    triggerHaptic('medium');
    onSubmit?.();
  };

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['00', '0', 'DEL'],
  ];

  return (
    <View {...panResponder.panHandlers} style={[styles.container, inverted && styles.inverted]}>
      {rows.map((row, rIdx) => (
        <View key={`row-${rIdx}`} style={styles.row}>
          {row.map((item) => {
            const isDel = item === 'DEL';
            const isDoubleZero = item === '00';

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.65}
                disabled={disabled}
                onPress={() => {
                  if (isDel) handleDel();
                  else handlePress(item);
                }}
                onLongPress={() => {
                  if (item === '0') {
                    handlePress('00');
                  }
                }}
                style={[
                  styles.button,
                  isDel && styles.delButton,
                  isDoubleZero && styles.actionButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    isDel && { color: colors.errorCoral },
                    isDoubleZero && { color: colors.textSecondary, fontSize: 18 },
                  ]}
                >
                  {isDel ? '⌫' : item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {onSubmit && (
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={disabled}
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: accentColor }]}
        >
          <Text style={styles.submitText}>CONFIRMAR ↵</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: spacing.space2,
  },
  inverted: {
    transform: [{ rotate: '180deg' }],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.space2,
  },
  button: {
    flex: 1,
    height: 58,
    marginHorizontal: spacing.space1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delButton: {
    backgroundColor: 'rgba(251, 113, 133, 0.08)',
    borderColor: 'rgba(251, 113, 133, 0.2)',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  submitButton: {
    height: 52,
    marginTop: spacing.space1,
    marginHorizontal: spacing.space1,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.bgObsidian,
    letterSpacing: 1.2,
  },
});

export default Numpad;
