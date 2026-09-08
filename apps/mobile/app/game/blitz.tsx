import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../../../src/components/Numpad';
import { EquationDisplay } from '../../../../src/components/EquationDisplay';

export default function BlitzScreen() {
  const router = useRouter();

  // Mode filters
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'addition' | 'subtraction' | 'multiplication' | 'fermi'>('all');
  const [filterModal, setFilterModal] = useState(false);

  // Timer & Game State
  const initialSeconds = 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion('blitz'));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // 60s Countdown Timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTimeUp = () => {
    setIsPlaying(false);
    try {
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success);
    } catch {}

    setTimeout(() => {
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
      router.replace({
        pathname: '/game/result',
        params: {
          mode: 'Blitz 60 Segundos',
          score,
          accuracy,
          total: totalQuestions,
          correct: correctCount,
          avgSpeedMs: Math.round((60 * 1000) / Math.max(1, totalQuestions)),
        },
      });
    }, 500);
  };

  const handleDigit = (digit: string) => {
    if (!isPlaying) return;
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    const expectedStr = currentQuestion.answer.toString();
    if (nextInput.length >= expectedStr.length) {
      submitAnswer(parseInt(nextInput, 10));
    }
  };

  const submitAnswer = (ans: number) => {
    setTotalQuestions((prev) => prev + 1);
    const isCorrect = ans === currentQuestion.answer;

    if (isCorrect) {
      try {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      setStatus('success');
      setCombo((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
      const mult = combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
      setScore((prev) => prev + 150 * mult);

      setTimeout(() => {
        nextQuestion();
      }, 180);
    } else {
      try {
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
      } catch {}
      setStatus('error');
      setCombo(0);

      setTimeout(() => {
        nextQuestion();
      }, 350);
    }
  };

  const nextQuestion = () => {
    setUserInput('');
    setStatus('idle');
    const filters = selectedFilter === 'all' ? undefined : [selectedFilter];
    setCurrentQuestion(generateQuestion('blitz', filters));
  };

  // Timer ring progress
  const timerRadius = 32;
  const circumference = 2 * Math.PI * timerRadius;
  const strokeDashoffset = circumference - (circumference * (timeLeft / initialSeconds));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Circular Countdown Timer & Score */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        {/* Circular Timer Ring */}
        <View style={styles.timerRingContainer}>
          <Svg width={76} height={76} style={styles.timerSvg}>
            <Circle
              cx="38"
              cy="38"
              r={timerRadius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4.5"
              fill="none"
            />
            <Circle
              cx="38"
              cy="38"
              r={timerRadius}
              stroke={timeLeft <= 10 ? colors.errorCoral : colors.primaryCyan}
              strokeWidth="4.5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 38 38)"
            />
          </Svg>
          <View style={styles.timerNumberBox}>
            <Text
              style={[
                styles.timerNumber,
                timeLeft <= 10 && { color: colors.errorCoral },
              ]}
            >
              {timeLeft}s
            </Text>
          </View>
        </View>

        {/* Score & Filter Toggle */}
        <View style={styles.rightStats}>
          <Text style={styles.scoreText}>{score} PTS</Text>
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setFilterModal(true)}
          >
            <Text style={styles.filterChipText}>
              ⚙ {selectedFilter === 'all' ? 'TUDO' : selectedFilter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Blitz Arena */}
      <View style={styles.arena}>
        <View style={styles.comboPill}>
          <Text style={styles.comboText}>🔥 COMBO x{combo}</Text>
        </View>

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
          disabled={!isPlaying}
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
        />
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Filtros de Operação</Text>
            <Text style={styles.filterSub}>Selecione quais técnicas treinar no Blitz:</Text>

            {[
              { id: 'all', label: 'Todas as Operações (Mistura)' },
              { id: 'addition', label: 'Adição (Fluxo Esquerda-Direita)' },
              { id: 'subtraction', label: 'Subtração & Compensação' },
              { id: 'multiplication', label: 'Multiplicação (Fatores 11, 25, 5)' },
              { id: 'fermi', label: 'Estimativa Fermi (Ordem de Grandeza)' },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterOption,
                  selectedFilter === f.id && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setSelectedFilter(f.id as any);
                  setFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter === f.id && { color: colors.primaryCyan, fontWeight: '800' },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setFilterModal(false)}
            >
              <Text style={styles.closeModalText}>FECHAR</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  timerRingContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSvg: {
    position: 'absolute',
  },
  timerNumberBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  rightStats: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  filterChip: {
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.space2,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  comboPill: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space3,
    paddingVertical: 4,
    marginBottom: spacing.space2,
  },
  comboText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FB923C',
    fontFamily: typography.fontFamily.mono,
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
  filterCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space6,
    width: '100%',
    maxWidth: 340,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  filterSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: spacing.space2,
  },
  filterOption: {
    paddingVertical: spacing.space3,
    paddingHorizontal: spacing.space3,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.space2,
  },
  filterOptionActive: {
    borderColor: colors.primaryCyan,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  filterOptionText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  closeModalBtn: {
    backgroundColor: colors.primaryCyan,
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space3,
  },
  closeModalText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.bgObsidian,
  },
});
