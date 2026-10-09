import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateQuestion, generateGhostRun, Question, GhostRun } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';

export default function ShadowRacingScreen() {
  const router = useRouter();

  const totalQuestions = 12;
  const [ghost] = useState<GhostRun>(() => generateGhostRun(1520));

  // Player state
  const [playerIndex, setPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion('racing'));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [playerCorrect, setPlayerCorrect] = useState(0);
  const startTime = useRef(Date.now()).current;

  // Ghost state
  const [ghostIndex, setGhostIndex] = useState(0);
  const [ghostAccumMs, setGhostAccumMs] = useState(0);

  // Replay ghost events in real time
  useEffect(() => {
    if (ghostIndex >= totalQuestions) return;
    const nextEvent = ghost.events[ghostIndex];
    const delay = nextEvent ? nextEvent.deltaMs : 1600;

    const timer = setTimeout(() => {
      setGhostIndex((prev) => prev + 1);
      setGhostAccumMs((prev) => prev + delay);
    }, delay);

    return () => clearTimeout(timer);
  }, [ghostIndex]);

  const handleDigit = (digit: string) => {
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    if (parseInt(nextInput, 10) === currentQuestion.answer) {
      handleCorrect();
    } else if (nextInput.length >= currentQuestion.answer.toString().length) {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    try {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    setStatus('success');
    setPlayerCorrect((prev) => prev + 1);
    const nextIdx = playerIndex + 1;
    setPlayerIndex(nextIdx);

    if (nextIdx >= totalQuestions) {
      handleRaceFinish(true);
      return;
    }

    setTimeout(() => {
      setUserInput('');
      setStatus('idle');
      setCurrentQuestion(generateQuestion('racing'));
    }, 200);
  };

  const handleWrong = () => {
    try {
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Warning);
    } catch {}

    setStatus('error');
    setTimeout(() => {
      setUserInput('');
      setStatus('idle');
    }, 350);
  };

  const handleRaceFinish = (isWin: boolean) => {
    const elapsed = Date.now() - startTime;
    const accuracy = Math.round((playerCorrect / totalQuestions) * 100);

    router.replace({
      pathname: '/game/result',
      params: {
        mode: 'Shadow Racing (1v1)',
        score: isWin ? 1850 : 920,
        accuracy,
        total: totalQuestions,
        correct: playerCorrect,
        avgSpeedMs: Math.round(elapsed / totalQuestions),
      },
    });
  };

  const playerPct = Math.round((playerIndex / totalQuestions) * 100);
  const ghostPct = Math.round((ghostIndex / totalQuestions) * 100);
  const isAhead = playerIndex >= ghostIndex;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.vsBox}>
          <Text style={styles.vsTitle}>DUELO FANTASMA ASSÍNCRONO</Text>
          <View style={[styles.deltaPill, { backgroundColor: isAhead ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 113, 133, 0.15)' }]}>
            <Text style={[styles.deltaText, { color: isAhead ? colors.successEmerald : colors.errorCoral }]}>
              {isAhead ? `+${playerIndex - ghostIndex} QUESTÕES NA FRENTE` : `${ghostIndex - playerIndex} ATRÁS`}
            </Text>
          </View>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* Dual Race Progress Bars */}
      <View style={styles.raceTracksCard}>
        {/* Player Bar */}
        <View style={styles.racerRow}>
          <View style={styles.racerInfo}>
            <Text style={styles.racerName}>👤 VOCÊ (1540)</Text>
            <Text style={styles.racerScore}>{playerIndex}/{totalQuestions}</Text>
          </View>
          <View style={styles.trackBackground}>
            <View style={[styles.trackFillPlayer, { width: `${playerPct}%` }]} />
          </View>
        </View>

        {/* Ghost Rival Bar */}
        <View style={[styles.racerRow, { marginTop: spacing.space2 }]}>
          <View style={styles.racerInfo}>
            <Text style={[styles.racerName, { color: colors.accentViolet }]}>
              👻 {ghost.opponentName} ({ghost.elo})
            </Text>
            <Text style={styles.racerScore}>{ghostIndex}/{totalQuestions}</Text>
          </View>
          <View style={styles.trackBackground}>
            <View style={[styles.trackFillGhost, { width: `${ghostPct}%` }]} />
          </View>
        </View>
      </View>

      {/* Main Equation Arena */}
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
  vsBox: {
    alignItems: 'center',
  },
  vsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  deltaPill: {
    marginTop: 4,
    paddingHorizontal: spacing.space2,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  deltaText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: typography.fontFamily.mono,
  },
  raceTracksCard: {
    backgroundColor: colors.surfaceGlass,
    marginHorizontal: spacing.space4,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
  },
  racerRow: {
    width: '100%',
  },
  racerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  racerName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryCyan,
  },
  racerScore: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.mono,
  },
  trackBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  trackFillPlayer: {
    height: '100%',
    backgroundColor: colors.primaryCyan,
  },
  trackFillGhost: {
    height: '100%',
    backgroundColor: colors.accentViolet,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  dock: {
    paddingBottom: spacing.space3,
  },
});
