import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { TRACK_GRADES, TrackNodeData, generateQuestion, Question } from '@auramath/engine';
import { AuraMascot } from '../../src/components/AuraMascot';

export default function LessonModalScreen() {
  const router = useRouter();
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();

  // Find node data
  let targetNode: TrackNodeData | undefined;
  for (const grade of TRACK_GRADES) {
    const found = grade.nodes.find((n) => n.id === nodeId);
    if (found) {
      targetNode = found;
      break;
    }
  }
  const node = targetNode || TRACK_GRADES[0].nodes[0];

  const totalQuestions = 5;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(0);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [drawerStatus, setDrawerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit' | 'supernova'>('idle');
  const [auraSpeech, setAuraSpeech] = useState<string>('Foco na velocidade! Você domina essa técnica.');
  const [isVictory, setIsVictory] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  useEffect(() => {
    const list: Question[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      list.push(generateQuestion(node.technique || 'general'));
    }
    setQuestions(list);
  }, [node.technique]);

  const currentQ = questions[currentIndex] || {
    id: 'demo',
    equation: '12 × 5',
    answer: 60,
    technique: 'Fator 5',
    hint: 'Metade de 12 é 6, vezes 10 = 60',
  };

  const handleDigit = (digit: string) => {
    if (drawerStatus !== null) return;
    if (inputVal.length >= 6) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setInputVal((prev) => prev + digit);
  };

  const handleDelete = () => {
    if (drawerStatus !== null) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setInputVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (drawerStatus !== null) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setInputVal('');
  };

  const handleVerify = () => {
    if (!inputVal || drawerStatus !== null) return;
    const num = parseInt(inputVal, 10);

    if (num === currentQ.answer) {
      // Acerto
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      const newCombo = combo + 1;
      setCombo(newCombo);
      setCorrectFirstTry((prev) => prev + 1);
      setMascotState('happy');
      setAuraSpeech(newCombo > 2 ? `Combo x${newCombo} cósmico!` : 'Sensacional! Cálculo exato!');
      setDrawerStatus('correct');
    } else {
      // Erro
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      setCombo(0);
      setMascotState('hit');
      setAuraSpeech(currentQ.hint || 'Preste atenção na decomposição.');
      setDrawerStatus('incorrect');
    }
  };

  const handleContinue = () => {
    if (hearts <= 0) {
      setDrawerStatus(null);
      setShowRechargeModal(true);
      return;
    }

    setDrawerStatus(null);
    setInputVal('');
    setMascotState('idle');

    if (currentIndex + 1 >= totalQuestions) {
      setIsVictory(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAuraSpeech('Próximo cálculo! Mantenha o ritmo.');
    }
  };

  // VICTORY SCREEN
  if (isVictory) {
    const accuracy = Math.round((correctFirstTry / totalQuestions) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.victoryContent}>
          <View style={styles.victoryMascotBox}>
            <AuraMascot size={110} state="supernova" stage={4} />
          </View>

          <Text style={styles.victoryTitle}>Lição Concluída!</Text>
          <Text style={styles.victorySubtitle}>{node.title} dominada com maestria!</Text>

          <View style={styles.statCardsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={[styles.statVal, { color: colors.primaryCyan }]}>+20</Text>
              <Text style={styles.statLbl}>XP Cósmico</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={[styles.statVal, { color: colors.successEmerald }]}>{accuracy}%</Text>
              <Text style={styles.statLbl}>Precisão</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={[styles.statVal, { color: colors.errorCoral }]}>19</Text>
              <Text style={styles.statLbl}>Dias Streak</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btn3DGreen}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Text style={styles.btn3DGreenText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercent = ((currentIndex + (drawerStatus === 'correct' ? 1 : 0)) / totalQuestions) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. DUOLINGO TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        {/* Hearts */}
        <View style={styles.heartsPill}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.heartText}>{hearts}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} bounces={false}>
        {/* 2. MASCOT AURA WITH SPEECH BUBBLE */}
        <View style={styles.mascotSection}>
          <AuraMascot size={74} state={mascotState} combo={combo} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{auraSpeech}</Text>
          </View>
        </View>

        {/* 3. EQUATION CARD */}
        <View style={styles.equationCard}>
          <Text style={styles.techniqueTag}>{currentQ.technique || 'Cálculo Mental Direto'}</Text>
          <Text style={styles.equationText}>{currentQ.equation}</Text>

          <View style={[styles.answerBox, !!inputVal && styles.answerBoxActive]}>
            <Text style={styles.answerText}>
              {inputVal || 'Digite a resposta...'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 4. TACTILE NUMPAD */}
      <View style={styles.numpadContainer}>
        <View style={styles.numpadGrid}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.numKey}
              activeOpacity={0.7}
              onPress={() => handleDigit(digit)}
            >
              <Text style={styles.numKeyText}>{digit}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.numKey, styles.numKeySpecial]} onPress={handleClear}>
            <Text style={[styles.numKeyText, { color: colors.errorCoral }]}>C</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.numKey} onPress={() => handleDigit('0')}>
            <Text style={styles.numKeyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.numKey, styles.numKeySpecial]} onPress={handleDelete}>
            <Text style={styles.numKeyText}>⌫</Text>
          </TouchableOpacity>
        </View>

        {/* VERIFY BUTTON (Only visible when drawer is closed) */}
        {drawerStatus === null && (
          <TouchableOpacity
            disabled={!inputVal}
            style={[styles.btn3DCyan, !inputVal && styles.btn3DDisabled]}
            activeOpacity={0.85}
            onPress={handleVerify}
          >
            <Text style={styles.btn3DCyanText}>VERIFICAR</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 5. SLIDE-UP FEEDBACK DRAWER */}
      {drawerStatus !== null && (
        <View
          style={[
            styles.bottomDrawer,
            drawerStatus === 'correct' ? styles.drawerCorrect : styles.drawerIncorrect,
          ]}
        >
          <View style={styles.drawerHeader}>
            <View>
              <Text
                style={[
                  styles.drawerTitle,
                  { color: drawerStatus === 'correct' ? colors.successEmerald : colors.errorCoral },
                ]}
              >
                {drawerStatus === 'correct' ? 'Sensacional!' : 'Solução Correta:'}
              </Text>
              {drawerStatus === 'incorrect' && (
                <Text style={styles.drawerSolutionText}>{currentQ.answer}</Text>
              )}
              {currentQ.hint && (
                <Text style={styles.drawerHintText}>💡 {currentQ.hint}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={drawerStatus === 'correct' ? styles.btn3DGreen : styles.btn3DCoral}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.btn3DGreenText}>
              {drawerStatus === 'correct' ? 'CONTINUAR' : 'ENTENDI'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 6. FOCUS RECHARGE MODAL (0 HEARTS) */}
      <Modal visible={showRechargeModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.rechargeCard}>
            <AuraMascot size={70} state="hit" />
            <Text style={styles.rechargeTitle}>Recarga de Foco Cósmica</Text>
            <Text style={styles.rechargeDesc}>
              Seus corações esgotaram! Pratique este cálculo rápido para recuperar toda a energia.
            </Text>
            <Text style={styles.rechargeEquation}>7 + 8 = ?</Text>
            <TouchableOpacity
              style={styles.btn3DGreen}
              activeOpacity={0.85}
              onPress={() => {
                setHearts(5);
                setShowRechargeModal(false);
                setMascotState('happy');
                setAuraSpeech('Energia restaurada! Vamos continuar!');
              }}
            >
              <Text style={styles.btn3DGreenText}>RESTAURAR 5 CORAÇÕES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    gap: spacing.space3,
  },
  closeBtn: {
    padding: spacing.space2,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '800',
  },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.successEmerald,
    borderRadius: radii.full,
  },
  heartsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 113, 133, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  heartIcon: {
    fontSize: 14,
  },
  heartText: {
    color: colors.errorCoral,
    fontWeight: '900',
    fontSize: 13,
  },
  scrollBody: {
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space3,
    alignItems: 'center',
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: spacing.space3,
  },
  speechBubble: {
    backgroundColor: 'rgba(13, 17, 26, 0.95)',
    borderWidth: 1,
    borderColor: colors.primaryCyan,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
    maxWidth: 260,
  },
  speechText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  equationCard: {
    width: '100%',
    backgroundColor: 'rgba(13, 17, 26, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    borderRadius: radii.xl,
    padding: spacing.space4,
    alignItems: 'center',
  },
  techniqueTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryCyan,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  equationText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: spacing.space2,
  },
  answerBox: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(7, 9, 14, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space2,
  },
  answerBoxActive: {
    borderColor: colors.primaryCyan,
  },
  answerText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primaryCyan,
  },
  numpadContainer: {
    paddingHorizontal: spacing.space4,
    paddingBottom: spacing.space4,
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.space3,
  },
  numKey: {
    width: '31%',
    height: 48,
    backgroundColor: 'rgba(19, 25, 38, 0.95)',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 0, 0, 0.8)',
  },
  numKeySpecial: {
    backgroundColor: 'rgba(28, 36, 54, 0.8)',
  },
  numKeyText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  btn3DCyan: {
    height: 52,
    backgroundColor: colors.primaryCyan,
    borderRadius: radii.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn3DDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  btn3DCyanText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#042F2E',
    letterSpacing: 1,
  },
  btn3DGreen: {
    height: 52,
    backgroundColor: colors.successEmerald,
    borderRadius: radii.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btn3DGreenText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#022C22',
    letterSpacing: 1,
  },
  btn3DCoral: {
    height: 52,
    backgroundColor: colors.errorCoral,
    borderRadius: radii.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#BE123C',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.space4,
    borderTopWidth: 2,
  },
  drawerCorrect: {
    backgroundColor: 'rgba(6, 44, 30, 0.98)',
    borderTopColor: colors.successEmerald,
  },
  drawerIncorrect: {
    backgroundColor: 'rgba(56, 12, 22, 0.98)',
    borderTopColor: colors.errorCoral,
  },
  drawerHeader: {
    marginBottom: spacing.space3,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  drawerSolutionText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  drawerHintText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  victoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space5,
  },
  victoryMascotBox: {
    marginBottom: spacing.space4,
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.goldStellar,
  },
  victorySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.space6,
    textAlign: 'center',
  },
  statCardsRow: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginBottom: spacing.space8,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(19, 25, 38, 0.8)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.lg,
    padding: spacing.space3,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 18,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    marginVertical: 4,
  },
  statLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  rechargeCard: {
    width: '100%',
    backgroundColor: 'rgba(13, 17, 26, 0.98)',
    borderWidth: 2,
    borderColor: colors.primaryCyan,
    borderRadius: radii.xl,
    padding: spacing.space5,
    alignItems: 'center',
  },
  rechargeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryCyan,
    marginTop: spacing.space3,
  },
  rechargeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.space3,
  },
  rechargeEquation: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.space4,
  },
});
