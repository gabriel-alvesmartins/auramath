import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateDailyQuestions, Question } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';

export default function DailyChallengeScreen() {
  const router = useRouter();

  // 20 deterministic questions for the day
  const [questions] = useState<Question[]>(() => generateDailyQuestions('2026-09-07'));
  const [qIndex, setQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Track results for the 20 questions: 'green' | 'yellow' | 'red' | 'pending'
  const [results, setResults] = useState<('green' | 'yellow' | 'red' | 'pending')[]>(
    new Array(20).fill('pending')
  );

  // Per-question latency tracking
  const [qStartTime, setQStartTime] = useState(Date.now());
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTotalElapsedMs((prev) => prev + 100);
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const currentQuestion = questions[qIndex] || questions[0];

  const handleDigit = (digit: string) => {
    if (isCompleted) return;
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    if (parseInt(nextInput, 10) === currentQuestion.answer) {
      handleAnswer(true);
    } else if (nextInput.length >= currentQuestion.answer.toString().length) {
      handleAnswer(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const responseLatency = Date.now() - qStartTime;
    const updatedResults = [...results];

    if (isCorrect) {
      try {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      setStatus('success');
      // Fast answer < 1800ms gets green 🟩, slower gets yellow 🟨
      updatedResults[qIndex] = responseLatency < 1800 ? 'green' : 'yellow';
    } else {
      try {
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      setStatus('error');
      updatedResults[qIndex] = 'red';
    }

    setResults(updatedResults);

    setTimeout(() => {
      setUserInput('');
      setStatus('idle');
      if (qIndex + 1 < questions.length) {
        setQIndex((prev) => prev + 1);
        setQStartTime(Date.now());
      } else {
        // Completed 20 questions
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setIsCompleted(true);
      }
    }, 280);
  };

  // Generate shareable emoji grid
  const generateShareText = () => {
    const emojis = results.map((r) => (r === 'green' ? '🟩' : r === 'yellow' ? '🟨' : '🟥'));
    // Break into 4 rows of 5
    const row1 = emojis.slice(0, 5).join('');
    const row2 = emojis.slice(5, 10).join('');
    const row3 = emojis.slice(10, 15).join('');
    const row4 = emojis.slice(15, 20).join('');

    const seconds = Math.round(totalElapsedMs / 1000);
    const correctCount = results.filter((r) => r === 'green' || r === 'yellow').length;

    return `Auramath Diário #42 • 07/09/2026\n${correctCount}/20 acertos em ${seconds}s\n\n${row1}\n${row2}\n${row3}\n${row4}\n\nhttps://auramath.app`;
  };

  const handleCopyShare = () => {
    Alert.alert('Copiado para a Área de Transferência!', generateShareText());
  };

  const formattedTime = (totalElapsedMs / 1000).toFixed(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTag}>DESAFIO DIÁRIO #42</Text>
          <Text style={styles.headerSub}>07 de Setembro de 2026</Text>
        </View>

        <View style={styles.stopwatchBox}>
          <Text style={styles.stopwatchText}>{formattedTime}s</Text>
        </View>
      </View>

      {/* 20 Questions Progress Grid Dots */}
      <View style={styles.dotsCard}>
        <View style={styles.dotsGrid}>
          {results.map((res, i) => {
            const isCurrent = i === qIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  res === 'green' && styles.dotGreen,
                  res === 'yellow' && styles.dotYellow,
                  res === 'red' && styles.dotRed,
                  isCurrent && styles.dotCurrent,
                ]}
              >
                <Text style={styles.dotNumber}>{i + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Main Equation */}
      <View style={styles.arena}>
        <EquationDisplay
          equation={currentQuestion.equation}
          userAnswer={userInput}
          status={status}
          technique={currentQuestion.technique}
        />
      </View>

      {/* Numpad Dock */}
      <View style={styles.dock}>
        <Numpad
          disabled={isCompleted}
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
        />
      </View>

      {/* Completion Modal with Shareable Emoji Grid */}
      <Modal visible={isCompleted} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalBadge}>DESAFIO DIÁRIO CONCLUÍDO</Text>
            <Text style={styles.modalTitle}>Desafio #42 Finalizado!</Text>
            <Text style={styles.modalStats}>
              {results.filter((r) => r === 'green' || r === 'yellow').length}/20 acertos • {formattedTime}s
            </Text>

            {/* Emoji Grid Preview */}
            <View style={styles.emojiCard}>
              <Text style={styles.emojiRow}>
                {results.slice(0, 5).map((r) => (r === 'green' ? '🟩' : r === 'yellow' ? '🟨' : '🟥')).join('')}
              </Text>
              <Text style={styles.emojiRow}>
                {results.slice(5, 10).map((r) => (r === 'green' ? '🟩' : r === 'yellow' ? '🟨' : '🟥')).join('')}
              </Text>
              <Text style={styles.emojiRow}>
                {results.slice(10, 15).map((r) => (r === 'green' ? '🟩' : r === 'yellow' ? '🟨' : '🟥')).join('')}
              </Text>
              <Text style={styles.emojiRow}>
                {results.slice(15, 20).map((r) => (r === 'green' ? '🟩' : r === 'yellow' ? '🟨' : '🟥')).join('')}
              </Text>
            </View>

            <TouchableOpacity style={styles.shareBtn} onPress={handleCopyShare}>
              <Text style={styles.shareBtnText}>📋 COPIAR GRID P/ WHATSAPP / X</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
              <Text style={styles.closeBtnText}>VOLTAR À TRILHA</Text>
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successEmerald,
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stopwatchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.space2,
    paddingVertical: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  stopwatchText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  dotsCard: {
    backgroundColor: colors.surfaceGlass,
    marginHorizontal: spacing.space4,
    padding: spacing.space2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dotGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: colors.successEmerald,
  },
  dotYellow: {
    backgroundColor: 'rgba(250, 204, 21, 0.25)',
    borderColor: colors.goldStellar,
  },
  dotRed: {
    backgroundColor: 'rgba(251, 113, 133, 0.25)',
    borderColor: colors.errorCoral,
  },
  dotCurrent: {
    borderColor: colors.primaryCyan,
    borderWidth: 2,
  },
  dotNumber: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  dock: {
    paddingBottom: spacing.space3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 14, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  modalCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.successEmerald,
    padding: spacing.space6,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  modalBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successEmerald,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  modalStats: {
    fontSize: 14,
    color: colors.goldStellar,
    marginVertical: spacing.space2,
    fontFamily: typography.fontFamily.mono,
  },
  emojiCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.space4,
    borderRadius: radii.lg,
    marginVertical: spacing.space3,
    alignItems: 'center',
  },
  emojiRow: {
    fontSize: 22,
    letterSpacing: 4,
    marginVertical: 1,
  },
  shareBtn: {
    backgroundColor: colors.primaryCyan,
    width: '100%',
    height: 50,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space2,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.bgObsidian,
  },
  closeBtn: {
    marginTop: spacing.space3,
    padding: spacing.space2,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
