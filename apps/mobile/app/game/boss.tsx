import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { BOSS_LIST, BossData, generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';
import { AuraMascot } from '../../src/components/AuraMascot';

export default function BossBattleScreen() {
  const router = useRouter();
  const { bossId } = useLocalSearchParams<{ bossId: string }>();

  const boss: BossData = BOSS_LIST.find((b) => b.id === bossId) || BOSS_LIST[0];

  // Battle State
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [playerShields, setPlayerShields] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => generateQuestion('boss'));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);

  // Attack timer animation
  const attackAnim = useRef(new Animated.Value(1)).current;
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Aura attack beam visual
  const [showBeam, setShowBeam] = useState(false);

  const startAttackTimer = () => {
    attackAnim.setValue(1);
    if (attackTimerRef.current) clearTimeout(attackTimerRef.current);

    Animated.timing(attackAnim, {
      toValue: 0,
      duration: boss.attackTimeoutMs,
      useNativeDriver: false,
    }).start();

    attackTimerRef.current = setTimeout(() => {
      handleBossAttack();
    }, boss.attackTimeoutMs);
  };

  useEffect(() => {
    if (!isVictory && !isDefeat) {
      startAttackTimer();
    }
    return () => {
      if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
    };
  }, [currentQuestion, isVictory, isDefeat]);

  const handleBossAttack = () => {
    try {
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Error);
    } catch {}

    setPlayerShields((prev) => {
      const nextShields = prev - 1;
      if (nextShields <= 0) {
        setIsDefeat(true);
      }
      return nextShields;
    });

    setStatus('error');
    setTimeout(() => {
      setUserInput('');
      setStatus('idle');
      setCurrentQuestion(generateQuestion('boss'));
    }, 400);
  };

  const handleDigit = (digit: string) => {
    if (isVictory || isDefeat) return;
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    if (parseInt(nextInput, 10) === currentQuestion.answer) {
      handlePlayerHit();
    } else if (nextInput.length >= currentQuestion.answer.toString().length) {
      handleWrong();
    }
  };

  const handlePlayerHit = () => {
    if (attackTimerRef.current) clearTimeout(attackTimerRef.current);

    try {
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}

    setStatus('success');
    setShowBeam(true);

    const damage = 150;
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);

    setTimeout(() => {
      setShowBeam(false);
      if (nextHp <= 0) {
        setIsVictory(true);
        return;
      }

      setUserInput('');
      setStatus('idle');
      setCurrentQuestion(generateQuestion('boss'));
    }, 300);
  };

  const handleWrong = () => {
    setStatus('error');
    setTimeout(() => {
      setUserInput('');
      setStatus('idle');
    }, 300);
  };

  const hpPercent = Math.round((bossHp / boss.maxHp) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header: Boss Name & Status */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.bossIdentity}>
          <Text style={styles.bossBadge}>CHEFE DO GRAU {boss.grade}</Text>
          <Text style={styles.bossName}>{boss.name}</Text>
        </View>

        {/* Player Shields */}
        <View style={styles.shieldsBox}>
          {[1, 2, 3].map((s) => (
            <Text
              key={s}
              style={[
                styles.shieldIcon,
                { color: s <= playerShields ? colors.primaryCyan : colors.textMuted },
              ]}
            >
              🛡️
            </Text>
          ))}
        </View>
      </View>

      {/* Boss Health Bar & Attack Countdown */}
      <View style={styles.bossCard}>
        <View style={styles.hpRow}>
          <Text style={styles.hpLabel}>PONTOS DE VIDA DO CHEFE</Text>
          <Text style={styles.hpValue}>{bossHp} / {boss.maxHp} HP</Text>
        </View>
        <View style={styles.hpTrack}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${hpPercent}%`,
                backgroundColor: hpPercent < 30 ? colors.errorCoral : colors.plasmaMagenta,
              },
            ]}
          />
        </View>

        {/* Boss Attack Countdown Timer */}
        <View style={styles.attackBarRow}>
          <Text style={styles.attackLabel}>TEMPO DE CONTRA-ATAQUE:</Text>
          <View style={styles.attackTrack}>
            <Animated.View
              style={[
                styles.attackFill,
                {
                  width: attackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Arena Center with Aura Beam */}
      <View style={styles.arena}>
        <View style={styles.mascotRow}>
          <AuraMascot combo={25} state="supernova" size={88} />
          {showBeam && (
            <View style={styles.attackBeam}>
              <Text style={styles.beamParticle}>⚡💥⚡</Text>
            </View>
          )}
        </View>

        <EquationDisplay
          equation={currentQuestion.equation}
          userAnswer={userInput}
          status={status}
          technique={boss.weakness}
        />
      </View>

      {/* Dock */}
      <View style={styles.dock}>
        <Numpad
          disabled={isVictory || isDefeat}
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
        />
      </View>

      {/* Victory Modal */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.victoryCard}>
            <Text style={styles.victoryIcon}>🎓</Text>
            <Text style={styles.victoryTitle}>MAESTRIA COMPROVADA!</Text>
            <Text style={styles.victorySub}>
              Você dominou as técnicas do Grau {boss.grade}: {boss.name}!
            </Text>

            <View style={styles.rewardCard}>
              <Text style={styles.rewardTag}>NOVO SELO DE MAESTRIA</Text>
              <Text style={styles.rewardName}>Certificado de Domínio Estrutural (+250 XP)</Text>
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                router.replace({
                  pathname: '/game/result',
                  params: {
                    mode: `Maestria: ${boss.name}`,
                    score: 3500,
                    accuracy: 100,
                    total: 8,
                    correct: 8,
                    avgSpeedMs: 1450,
                  },
                });
              }}
            >
              <Text style={styles.continueBtnText}>REIVINDICAR SELO ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Defeat Modal */}
      <Modal visible={isDefeat} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.defeatCard}>
            <Text style={styles.victoryIcon}>💀</Text>
            <Text style={[styles.victoryTitle, { color: colors.errorCoral }]}>
              ESCUDOS ESGOTADOS!
            </Text>
            <Text style={styles.victorySub}>
              O contra-ataque de {boss.name} sobrecarregou sua Aura. Pratique a técnica e tente novamente!
            </Text>

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setBossHp(boss.maxHp);
                setPlayerShields(3);
                setIsDefeat(false);
                setCurrentQuestion(generateQuestion('boss'));
              }}
            >
              <Text style={styles.continueBtnText}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exitDefeatBtn} onPress={() => router.back()}>
              <Text style={styles.exitDefeatText}>VOLTAR À TRILHA</Text>
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
  bossIdentity: {
    alignItems: 'center',
  },
  bossBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.plasmaMagenta,
    letterSpacing: 1,
  },
  bossName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  shieldsBox: {
    flexDirection: 'row',
  },
  shieldIcon: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  bossCard: {
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
    marginHorizontal: spacing.space4,
    padding: spacing.space3,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
  },
  hpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  hpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  hpValue: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.plasmaMagenta,
    fontFamily: typography.fontFamily.mono,
  },
  hpTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.space2,
  },
  hpFill: {
    height: '100%',
  },
  attackBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attackLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  attackTrack: {
    flex: 1,
    marginLeft: spacing.space2,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  attackFill: {
    height: '100%',
    backgroundColor: colors.goldStellar,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  mascotRow: {
    alignItems: 'center',
    marginBottom: spacing.space2,
  },
  attackBeam: {
    position: 'absolute',
    top: -15,
  },
  beamParticle: {
    fontSize: 24,
  },
  dock: {
    paddingBottom: spacing.space3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 14, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  victoryCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.goldStellar,
    padding: spacing.space6,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  defeatCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.errorCoral,
    padding: spacing.space6,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  victoryIcon: {
    fontSize: 48,
    marginBottom: spacing.space2,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.goldStellar,
    textAlign: 'center',
  },
  victorySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.space2,
    lineHeight: 18,
  },
  rewardCard: {
    backgroundColor: 'rgba(250, 204, 21, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: radii.lg,
    padding: spacing.space3,
    marginVertical: spacing.space4,
    width: '100%',
    alignItems: 'center',
  },
  rewardTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.goldStellar,
    letterSpacing: 1,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: colors.primaryCyan,
    width: '100%',
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtn: {
    backgroundColor: colors.errorCoral,
    width: '100%',
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space4,
  },
  continueBtnText: {
    color: colors.bgObsidian,
    fontSize: 14,
    fontWeight: '800',
  },
  exitDefeatBtn: {
    marginTop: spacing.space3,
    padding: spacing.space2,
  },
  exitDefeatText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
