import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateFlashAnzanSequence } from '@auramath/engine';
import { Numpad } from '../../../../src/components/Numpad';

export default function FlashAnzanScreen() {
  const router = useRouter();

  // Settings
  const flashDurationMs = 300;
  const blankGapMs = 120;
  const termsCount = 6;

  // Flash Burst State
  const [numbers, setNumbers] = useState<number[]>(() => generateFlashAnzanSequence(termsCount));
  const [currentTermIndex, setCurrentTermIndex] = useState(-1);
  const [isFlashing, setIsFlashing] = useState(true);
  const [displayedNumber, setDisplayedNumber] = useState<number | null>(null);

  // User input state (revealed after flash)
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const totalSum = numbers.reduce((acc, curr) => acc + curr, 0);

  // Run flash sequence
  useEffect(() => {
    if (!isFlashing) return;

    let index = 0;
    setCurrentTermIndex(0);

    const runStep = () => {
      if (index < numbers.length) {
        setDisplayedNumber(numbers[index]);
        setCurrentTermIndex(index + 1);

        // Blank gap after flashDurationMs
        setTimeout(() => {
          setDisplayedNumber(null);

          // Next number after blankGapMs
          setTimeout(() => {
            index++;
            runStep();
          }, blankGapMs);
        }, flashDurationMs);
      } else {
        // Flash burst finished! Reveal input
        setIsFlashing(false);
      }
    };

    // Small pre-burst countdown delay
    const startTimeout = setTimeout(() => {
      runStep();
    }, 800);

    return () => clearTimeout(startTimeout);
  }, [numbers, isFlashing]);

  const handleDigit = (digit: string) => {
    if (isFlashing) return;
    setUserInput((prev) => prev + digit);
  };

  const handleVerify = () => {
    const val = parseInt(userInput, 10);
    if (val === totalSum) {
      try {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {}

      setStatus('success');
      setScore((prev) => prev + 500);

      setTimeout(() => {
        nextBurst();
      }, 700);
    } else {
      try {
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Error);
      } catch {}

      setStatus('error');
      setTimeout(() => {
        nextBurst();
      }, 1200);
    }
  };

  const nextBurst = () => {
    setUserInput('');
    setStatus('idle');
    setDisplayedNumber(null);
    setNumbers(generateFlashAnzanSequence(termsCount));
    setIsFlashing(true);
    setRound((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.burstInfo}>
          <Text style={styles.burstTag}>FLASH ANZAN VISUOESPACIAL</Text>
          <Text style={styles.burstSub}>
            Cadência: {flashDurationMs}ms • Rodada {round}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{score} PTS</Text>
        </View>
      </View>

      {/* Center Projector */}
      <View style={styles.projectorContainer}>
        {isFlashing ? (
          <View style={styles.flashCenter}>
            <View style={styles.progressTermBox}>
              <Text style={styles.progressTermText}>
                TERMO {currentTermIndex} / {termsCount}
              </Text>
            </View>

            <View style={styles.numberProjector}>
              <Text style={styles.flashingNumber}>
                {displayedNumber !== null ? displayedNumber : ''}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.answerPromptCard}>
            <Text style={styles.promptTitle}>Qual foi a soma total acumulada?</Text>
            <View
              style={[
                styles.answerInputBox,
                status === 'error' && styles.answerInputError,
                status === 'success' && styles.answerInputSuccess,
              ]}
            >
              <Text style={styles.answerInputValue}>{userInput || '?'}</Text>
            </View>
            {status === 'error' && (
              <Text style={styles.solutionText}>
                A soma correta era: {totalSum}
              </Text>
            )}
            {status === 'success' && (
              <Text style={styles.correctText}>Excelente! Projeção precisa!</Text>
            )}
          </View>
        )}
      </View>

      {/* Dock */}
      <View style={styles.dock}>
        {isFlashing ? (
          <View style={styles.flashingNotice}>
            <Text style={styles.flashingNoticeText}>
              🧠 Visualize as contas no Soroban sem subvocalizar...
            </Text>
          </View>
        ) : (
          <Numpad
            onPressDigit={handleDigit}
            onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
            onClear={() => setUserInput('')}
            onSubmit={handleVerify}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  burstInfo: {
    alignItems: 'center',
  },
  burstTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.plasmaMagenta,
    letterSpacing: 1,
  },
  burstSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  projectorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space4,
  },
  flashCenter: {
    alignItems: 'center',
  },
  progressTermBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: spacing.space6,
  },
  progressTermText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  numberProjector: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashingNumber: {
    fontSize: 78,
    fontWeight: '900',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
    letterSpacing: 2,
  },
  answerPromptCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    padding: spacing.space5,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.space3,
  },
  answerInputBox: {
    width: 140,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerInputError: {
    borderColor: colors.errorCoral,
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
  },
  answerInputSuccess: {
    borderColor: colors.successEmerald,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  answerInputValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  solutionText: {
    marginTop: spacing.space2,
    fontSize: 13,
    color: colors.errorCoral,
    fontWeight: '700',
  },
  correctText: {
    marginTop: spacing.space2,
    fontSize: 13,
    color: colors.successEmerald,
    fontWeight: '700',
  },
  dock: {
    paddingBottom: spacing.space3,
  },
  flashingNotice: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space6,
  },
  flashingNoticeText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
