import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';
import { AuraMascot } from '../../src/components/AuraMascot';
import { ComboHUD } from '../../src/components/ComboHUD';

export default function ArenaScreen() {
  const router = useRouter();

  // Game states
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion());
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit'>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const startTime = useRef(Date.now()).current;

  // Calculate dynamic multiplier based on combo
  const multiplier = combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;

  const handleDigit = (digit: string) => {
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    // Auto-check on expected answer length
    const expectedStr = currentQuestion.answer.toString();
    if (nextInput.length >= expectedStr.length) {
      validateAnswer(parseInt(nextInput, 10));
    }
  };

  const validateAnswer = (ans: number) => {
    setQuestionsAnswered((prev) => prev + 1);
    const isCorrect = ans === currentQuestion.answer;

    if (isCorrect) {
      try {
        if (combo + 1 === 5 || combo + 1 === 10 || combo + 1 === 20 || combo + 1 === 35) {
          Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Heavy);
        } else {
          Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {}

      setStatus('success');
      setMascotState('happy');
      setCombo((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 100 * multiplier);

      setTimeout(() => {
        nextQuestion();
      }, 250);
    } else {
      try {
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
      } catch {}

      setStatus('error');
      setMascotState('hit');
      setCombo(0);

      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const nextQuestion = () => {
    setUserInput('');
    setStatus('idle');
    setMascotState('idle');
    setCurrentQuestion(generateQuestion());
  };

  const handleFinish = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const accuracy = questionsAnswered > 0 ? Math.round((correctCount / questionsAnswered) * 100) : 100;
    const avgSpeedMs = questionsAnswered > 0 ? Math.round((elapsedSeconds * 1000) / questionsAnswered) : 0;

    router.replace({
      pathname: '/game/result',
      params: {
        mode: 'Arena Solo',
        score,
        accuracy,
        total: questionsAnswered,
        correct: correctCount,
        avgSpeedMs,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top HUD */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsPaused(true)}>
          <Text style={styles.iconBtnText}>⏸</Text>
        </TouchableOpacity>

        <ComboHUD combo={combo} multiplier={multiplier} />

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      {/* Arena Center */}
      <View style={styles.arenaCenter}>
        <View style={styles.mascotContainer}>
          <AuraMascot combo={combo} state={mascotState} size={96} />
        </View>

        <EquationDisplay
          equation={currentQuestion.equation}
          userAnswer={userInput}
          status={status}
          technique={currentQuestion.technique}
          hint={currentQuestion.hint}
        />
      </View>

      {/* Numpad Dock */}
      <View style={styles.dock}>
        <Numpad
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
        />
      </View>

      {/* Pause Modal */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>Partida Pausada</Text>
            <Text style={styles.pauseScore}>Pontuação Atual: {score}</Text>
            <Text style={styles.pauseCombo}>Maior Sequência: x{combo}</Text>

            <TouchableOpacity
              style={styles.resumeBtn}
              onPress={() => setIsPaused(false)}
            >
              <Text style={styles.resumeBtnText}>CONTINUAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => {
                setIsPaused(false);
                handleFinish();
              }}
            >
              <Text style={styles.finishBtnText}>ENCERRAR E VER RESULTADO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: spacing.space2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  arenaCenter: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  mascotContainer: {
    marginBottom: spacing.space2,
  },
  dock: {
    paddingBottom: spacing.space3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  pauseCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space6,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  pauseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.space2,
  },
  pauseScore: {
    fontSize: 16,
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
    fontWeight: '700',
  },
  pauseCombo: {
    fontSize: 14,
    color: colors.primaryCyan,
    marginVertical: 4,
    fontFamily: typography.fontFamily.mono,
  },
  resumeBtn: {
    backgroundColor: colors.primaryCyan,
    width: '100%',
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space4,
  },
  resumeBtnText: {
    color: colors.bgObsidian,
    fontSize: 15,
    fontWeight: '800',
  },
  finishBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    width: '100%',
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space2,
  },
  finishBtnText: {
    color: colors.errorCoral,
    fontSize: 13,
    fontWeight: '700',
  },
});
