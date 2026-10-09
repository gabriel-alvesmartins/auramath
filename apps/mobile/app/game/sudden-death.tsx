import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';

export default function SuddenDeathScreen() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion('sudden'));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isAlive, setIsAlive] = useState(true);

  // Dynamic time per question: base 5000ms, reduces by 400ms every 5 streak, floor at 1600ms
  const getTimeLimit = (st: number) => {
    return Math.max(1600, 5000 - Math.floor(st / 5) * 400);
  };

  const currentLimit = getTimeLimit(streak);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pulse animation for heart
  const heartScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.25, duration: 400, useNativeDriver: true }),
        Animated.timing(heartScale, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, [heartScale]);

  // Restart question timer
  const startTimer = (limitMs: number) => {
    progressAnim.setValue(1);
    if (timerRef.current) clearTimeout(timerRef.current);

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: limitMs,
      useNativeDriver: false,
    }).start();

    timerRef.current = setTimeout(() => {
      handleGameOver('Tempo Esgotado!');
    }, limitMs);
  };

  useEffect(() => {
    if (isAlive) {
      startTimer(currentLimit);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentQuestion, isAlive]);

  const handleDigit = (digit: string) => {
    if (!isAlive) return;
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    const expectedStr = currentQuestion.answer.toString();
    if (nextInput.length >= expectedStr.length) {
      validateAnswer(parseInt(nextInput, 10));
    }
  };

  const validateAnswer = (ans: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (ans === currentQuestion.answer) {
      try {
        Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}

      setStatus('success');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const multiplier = Math.floor(nextStreak / 5) + 1;
      setScore((prev) => prev + 200 * multiplier);

      setTimeout(() => {
        setUserInput('');
        setStatus('idle');
        setCurrentQuestion(generateQuestion('sudden'));
      }, 200);
    } else {
      handleGameOver(`Resposta Incorreta! (${currentQuestion.equation} = ${currentQuestion.answer})`);
    }
  };

  const handleGameOver = (reason: string) => {
    setIsAlive(false);
    setStatus('error');
    if (timerRef.current) clearTimeout(timerRef.current);

    try {
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Error);
    } catch {}

    setTimeout(() => {
      router.replace({
        pathname: '/game/result',
        params: {
          mode: 'Morte Súbita (1 Vida)',
          score,
          accuracy: streak > 0 ? 100 : 0,
          total: streak + 1,
          correct: streak,
          avgSpeedMs: Math.round(currentLimit * 0.6),
          maxStreak: streak,
        },
      });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        {/* 1 Life Cosmic Heart */}
        <View style={styles.lifeBox}>
          <Animated.Text style={[styles.heartIcon, { transform: [{ scale: heartScale }] }]}>
            ❤️
          </Animated.Text>
          <Text style={styles.lifeLabel}>1 VIDA</Text>
        </View>

        {/* Streak & Score */}
        <View style={styles.statsBox}>
          <Text style={styles.streakText}>STREAK {streak}</Text>
          <Text style={styles.scoreText}>{score} PTS</Text>
        </View>
      </View>

      {/* Depleting Accelerating Timer Bar */}
      <View style={styles.timeBarTrack}>
        <Animated.View
          style={[
            styles.timeBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Arena Center */}
      <View style={styles.arena}>
        <View style={styles.speedPill}>
          <Text style={styles.speedPillText}>
            ⏱️ JANELA: {(currentLimit / 1000).toFixed(1)}s POR CONTA
          </Text>
        </View>

        <EquationDisplay
          equation={currentQuestion.equation}
          userAnswer={userInput}
          status={status}
          technique={currentQuestion.technique}
        />
      </View>

      {/* Dock */}
      <View style={styles.dock}>
        <Numpad
          disabled={!isAlive}
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
        />
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
  lifeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space3,
    paddingVertical: 5,
  },
  heartIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  lifeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.plasmaMagenta,
    fontFamily: typography.fontFamily.mono,
  },
  statsBox: {
    alignItems: 'flex-end',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  timeBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeBarFill: {
    height: '100%',
    backgroundColor: colors.plasmaMagenta,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  speedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 3,
    borderRadius: radii.full,
    marginBottom: spacing.space2,
  },
  speedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.mono,
  },
  dock: {
    paddingBottom: spacing.space3,
  },
});
