import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../../../src/components/Numpad';

export default function SplitBattleScreen() {
  const router = useRouter();

  // Target points to win
  const targetScore = 10;
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion('split'));

  // Player 1 (Bottom) state
  const [p1Score, setP1Score] = useState(0);
  const [p1Input, setP1Input] = useState('');
  const [p1Status, setP1Status] = useState<'idle' | 'success' | 'error'>('idle');

  // Player 2 (Top, Inverted 180°) state
  const [p2Score, setP2Score] = useState(0);
  const [p2Input, setP2Input] = useState('');
  const [p2Status, setP2Status] = useState<'idle' | 'success' | 'error'>('idle');

  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);

  // P1 input handlers
  const handleP1Digit = (digit: string) => {
    if (winner) return;
    const nextInput = p1Input + digit;
    setP1Input(nextInput);

    if (parseInt(nextInput, 10) === currentQuestion.answer) {
      handlePlayerPoint(1);
    } else if (nextInput.length >= currentQuestion.answer.toString().length) {
      setP1Status('error');
      setTimeout(() => {
        setP1Input('');
        setP1Status('idle');
      }, 350);
    }
  };

  // P2 input handlers
  const handleP2Digit = (digit: string) => {
    if (winner) return;
    const nextInput = p2Input + digit;
    setP2Input(nextInput);

    if (parseInt(nextInput, 10) === currentQuestion.answer) {
      handlePlayerPoint(2);
    } else if (nextInput.length >= currentQuestion.answer.toString().length) {
      setP2Status('error');
      setTimeout(() => {
        setP2Input('');
        setP2Status('idle');
      }, 350);
    }
  };

  const handlePlayerPoint = (player: 1 | 2) => {
    try {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}

    if (player === 1) {
      setP1Status('success');
      const newScore = p1Score + 1;
      setP1Score(newScore);
      if (newScore >= targetScore) {
        setWinner('p1');
        return;
      }
    } else {
      setP2Status('success');
      const newScore = p2Score + 1;
      setP2Score(newScore);
      if (newScore >= targetScore) {
        setWinner('p2');
        return;
      }
    }

    setTimeout(() => {
      setP1Input('');
      setP2Input('');
      setP1Status('idle');
      setP2Status('idle');
      setCurrentQuestion(generateQuestion('split'));
    }, 300);
  };

  // Tug of war percentage
  const totalScore = p1Score + p2Score;
  const p1TugPercent = totalScore === 0 ? 50 : Math.round((p1Score / (totalScore || 1)) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* PLAYER 2 PANEL (TOP - INVERTED 180°) */}
      <View style={[styles.playerHalf, styles.inverted]}>
        <View style={styles.playerHeader}>
          <Text style={[styles.playerBadge, { color: colors.accentViolet }]}>
            JOGADOR 2
          </Text>
          <Text style={styles.playerScore}>{p2Score} / {targetScore}</Text>
        </View>

        <View style={styles.equationRow}>
          <Text style={styles.equationText}>{currentQuestion.equation}</Text>
          <Text style={styles.equalsText}>=</Text>
          <View style={[styles.inputBox, p2Status === 'error' && styles.boxError]}>
            <Text style={styles.inputText}>{p2Input || '?'}</Text>
          </View>
        </View>

        <Numpad
          onPressDigit={handleP2Digit}
          onDelete={() => setP2Input((prev) => prev.slice(0, -1))}
          onClear={() => setP2Input('')}
          accentColor={colors.accentViolet}
        />
      </View>

      {/* CENTER DIVIDER (TUG-OF-WAR BAR & EXIT) */}
      <View style={styles.centerDivider}>
        <View style={styles.tugTrack}>
          <View style={[styles.tugP2Fill, { width: `${100 - p1TugPercent}%` }]} />
          <View style={[styles.tugP1Fill, { width: `${p1TugPercent}%` }]} />
        </View>

        <View style={styles.dividerControls}>
          <Text style={styles.scoreP2Label}>J2: {p2Score}</Text>
          <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
            <Text style={styles.exitBtnText}>✕ SAIR</Text>
          </TouchableOpacity>
          <Text style={styles.scoreP1Label}>J1: {p1Score}</Text>
        </View>
      </View>

      {/* PLAYER 1 PANEL (BOTTOM - NORMAL) */}
      <View style={styles.playerHalf}>
        <View style={styles.playerHeader}>
          <Text style={[styles.playerBadge, { color: colors.primaryCyan }]}>
            JOGADOR 1
          </Text>
          <Text style={styles.playerScore}>{p1Score} / {targetScore}</Text>
        </View>

        <View style={styles.equationRow}>
          <Text style={styles.equationText}>{currentQuestion.equation}</Text>
          <Text style={styles.equalsText}>=</Text>
          <View style={[styles.inputBox, p1Status === 'error' && styles.boxError]}>
            <Text style={styles.inputText}>{p1Input || '?'}</Text>
          </View>
        </View>

        <Numpad
          onPressDigit={handleP1Digit}
          onDelete={() => setP1Input((prev) => prev.slice(0, -1))}
          onClear={() => setP1Input('')}
          accentColor={colors.primaryCyan}
        />
      </View>

      {/* Winner Overlay Modal */}
      {winner && (
        <View style={styles.winnerOverlay}>
          <View style={styles.winnerCard}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.winnerText}>
              {winner === 'p1' ? 'JOGADOR 1 VENCEU!' : 'JOGADOR 2 VENCEU!'}
            </Text>
            <Text style={styles.winnerScore}>
              Placar Final: {p1Score} vs {p2Score}
            </Text>

            <TouchableOpacity
              style={styles.rematchBtn}
              onPress={() => {
                setP1Score(0);
                setP2Score(0);
                setP1Input('');
                setP2Input('');
                setWinner(null);
                setCurrentQuestion(generateQuestion('split'));
              }}
            >
              <Text style={styles.rematchText}>JOGAR NOVAMENTE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exitBattleBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.exitBattleText}>VOLTAR AO MENU</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
    justifyContent: 'space-between',
  },
  playerHalf: {
    flex: 1,
    paddingHorizontal: spacing.space3,
    justifyContent: 'center',
  },
  inverted: {
    transform: [{ rotate: '180deg' }],
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space1,
    paddingHorizontal: spacing.space2,
  },
  playerBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  playerScore: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space2,
  },
  equationText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  equalsText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textSecondary,
    marginHorizontal: spacing.space2,
  },
  inputBox: {
    minWidth: 70,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space2,
  },
  boxError: {
    borderColor: colors.errorCoral,
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
  },
  inputText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  centerDivider: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: 'rgba(13, 17, 26, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: spacing.space3,
  },
  tugTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  tugP2Fill: {
    height: '100%',
    backgroundColor: colors.accentViolet,
  },
  tugP1Fill: {
    height: '100%',
    backgroundColor: colors.primaryCyan,
  },
  dividerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreP2Label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accentViolet,
    fontFamily: typography.fontFamily.mono,
  },
  scoreP1Label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  exitBtn: {
    paddingHorizontal: spacing.space3,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radii.full,
  },
  exitBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  winnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 9, 14, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  winnerCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.goldStellar,
    padding: spacing.space6,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  trophy: {
    fontSize: 48,
    marginBottom: spacing.space2,
  },
  winnerText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.goldStellar,
    textAlign: 'center',
  },
  winnerScore: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: spacing.space2,
    fontFamily: typography.fontFamily.mono,
  },
  rematchBtn: {
    backgroundColor: colors.primaryCyan,
    width: '100%',
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space3,
  },
  rematchText: {
    color: colors.bgObsidian,
    fontSize: 14,
    fontWeight: '800',
  },
  exitBattleBtn: {
    marginTop: spacing.space2,
    padding: spacing.space2,
  },
  exitBattleText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
