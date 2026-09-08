import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { TRACK_GRADES, TrackNodeData, generateQuestion } from '@auramath/engine';
import { Numpad } from '../../../../src/components/Numpad';
import { EquationDisplay } from '../../../../src/components/EquationDisplay';
import { AuraMascot } from '../../../../src/components/AuraMascot';

export default function LessonModalScreen() {
  const router = useRouter();
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();

  // Find node data across grades
  let targetNode: TrackNodeData | undefined;
  for (const grade of TRACK_GRADES) {
    const found = grade.nodes.find((n) => n.id === nodeId);
    if (found) {
      targetNode = found;
      break;
    }
  }

  // Fallback to first node if not found
  const node = targetNode || TRACK_GRADES[0].nodes[0];

  // Tripartite step state: 1 = Theory, 2 = Scaffolding, 3 = Drill
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Scaffolding Step state
  const [scaffoldIdx, setScaffoldIdx] = useState(0);
  const currentScaffold = node.scaffolding[scaffoldIdx] || node.scaffolding[0];
  const [scaffoldAnswers, setScaffoldAnswers] = useState<Record<string, string>>({});
  const [activeBlankKey, setActiveBlankKey] = useState<string>(
    currentScaffold?.blanks[0]?.key || ''
  );
  const [scaffoldFeedback, setScaffoldFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  // Drill Step state
  const totalDrillQuestions = 10;
  const [drillIdx, setDrillIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion(node.technique));
  const [drillInput, setDrillInput] = useState('');
  const [drillFeedback, setDrillFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Numpad input for Scaffolding
  const handleScaffoldDigit = (digit: string) => {
    if (!activeBlankKey) return;
    setScaffoldAnswers((prev) => ({
      ...prev,
      [activeBlankKey]: (prev[activeBlankKey] || '') + digit,
    }));
  };

  const handleScaffoldDelete = () => {
    if (!activeBlankKey) return;
    setScaffoldAnswers((prev) => ({
      ...prev,
      [activeBlankKey]: (prev[activeBlankKey] || '').slice(0, -1),
    }));
  };

  const handleScaffoldClear = () => {
    if (!activeBlankKey) return;
    setScaffoldAnswers((prev) => ({
      ...prev,
      [activeBlankKey]: '',
    }));
  };

  const handleVerifyScaffold = () => {
    let allCorrect = true;
    for (const b of currentScaffold.blanks) {
      if ((scaffoldAnswers[b.key] || '').trim() !== b.expected.trim()) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setScaffoldFeedback('success');
      setTimeout(() => {
        if (scaffoldIdx + 1 < node.scaffolding.length) {
          setScaffoldIdx((prev) => prev + 1);
          setScaffoldAnswers({});
          setActiveBlankKey(node.scaffolding[scaffoldIdx + 1].blanks[0].key);
          setScaffoldFeedback('idle');
        } else {
          // Finished scaffolding -> move to Step 3 Drill
          setStep(3);
          setScaffoldFeedback('idle');
        }
      }, 700);
    } else {
      setScaffoldFeedback('error');
      setTimeout(() => setScaffoldFeedback('idle'), 800);
    }
  };

  // Drill input handling
  const handleDrillDigit = (digit: string) => {
    const updated = drillInput + digit;
    setDrillInput(updated);

    // Auto submit if answer length matches
    if (parseInt(updated, 10) === currentQuestion.answer) {
      setDrillFeedback('success');
      setCorrectCount((prev) => prev + 1);
      setTimeout(() => {
        proceedDrill(true);
      }, 300);
    } else if (updated.length >= currentQuestion.answer.toString().length) {
      setDrillFeedback('error');
      setTimeout(() => {
        proceedDrill(false);
      }, 500);
    }
  };

  const proceedDrill = (wasCorrect: boolean) => {
    setDrillInput('');
    setDrillFeedback('idle');
    if (drillIdx + 1 < totalDrillQuestions) {
      setDrillIdx((prev) => prev + 1);
      setCurrentQuestion(generateQuestion(node.technique));
    } else {
      // Completed drill -> navigate to Result screen
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const acc = Math.round(((correctCount + (wasCorrect ? 1 : 0)) / totalDrillQuestions) * 100);
      router.replace({
        pathname: '/game/result',
        params: {
          mode: `Lição: ${node.title}`,
          score: (correctCount + (wasCorrect ? 1 : 0)) * 100,
          accuracy: acc,
          total: totalDrillQuestions,
          correct: correctCount + (wasCorrect ? 1 : 0),
          avgSpeedMs: Math.round((elapsed * 1000) / totalDrillQuestions),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {/* 3 Steps Indicator */}
        <View style={styles.stepsIndicator}>
          {[
            { num: 1, label: 'Teoria' },
            { num: 2, label: 'Andaime' },
            { num: 3, label: 'Fixação' },
          ].map((s) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;
            return (
              <View key={s.num} style={styles.stepPillWrapper}>
                <View
                  style={[
                    styles.stepPill,
                    isCurrent && styles.stepPillActive,
                    isDone && styles.stepPillDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNum,
                      (isCurrent || isDone) && { color: colors.bgObsidian },
                    ]}
                  >
                    {isDone ? '✓' : s.num}
                  </Text>
                  <Text
                    style={[
                      styles.stepLabel,
                      (isCurrent || isDone) && { color: colors.bgObsidian },
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* STEP 1: LIGHTNING THEORY CARD */}
      {step === 1 && (
        <ScrollView contentContainerStyle={styles.contentCard} showsVerticalScrollIndicator={false}>
          <View style={styles.mascotRow}>
            <AuraMascot combo={3} size={84} />
          </View>

          <View style={styles.theoryTag}>
            <Text style={styles.theoryTagText}>PASSO 1 DE 3 • TEORIA RELÂMPAGO</Text>
          </View>

          <Text style={styles.lessonTitle}>{node.theory.title}</Text>
          <Text style={styles.techniqueName}>{node.title}</Text>

          {/* Formula Display Box */}
          <View style={styles.formulaBox}>
            <Text style={styles.formulaText}>{node.theory.formula}</Text>
          </View>

          <Text style={styles.explanationText}>{node.theory.explanation}</Text>

          {/* Kinetic Breakdown Demonstration */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownLabel}>FLUXO VISUAL PASSO A PASSO</Text>
            <View style={styles.breakdownSteps}>
              <View style={styles.fromBox}>
                <Text style={styles.fromText}>{node.theory.visualBreakdown.from}</Text>
              </View>
              {node.theory.visualBreakdown.steps.map((st, i) => (
                <View key={i} style={styles.arrowStepRow}>
                  <Text style={styles.arrowDown}>↓</Text>
                  <Text style={styles.stepBubble}>{st}</Text>
                </View>
              ))}
              <Text style={styles.arrowDown}>↓</Text>
              <View style={styles.resultPill}>
                <Text style={styles.resultPillText}>
                  = {node.theory.visualBreakdown.to}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => setStep(2)}
          >
            <Text style={styles.primaryBtnText}>ENTENDI! PRATICAR ANDAIME ➔</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* STEP 2: INTERACTIVE SCAFFOLDING */}
      {step === 2 && currentScaffold && (
        <View style={styles.scaffoldContainer}>
          <View style={styles.scaffoldHeader}>
            <Text style={styles.scaffoldProgress}>
              EXERCÍCIO {scaffoldIdx + 1} DE {node.scaffolding.length}
            </Text>
            <Text style={styles.scaffoldInstruction}>
              {currentScaffold.instruction}
            </Text>
          </View>

          {/* Scaffolding Blanks Form */}
          <View
            style={[
              styles.scaffoldEquationCard,
              scaffoldFeedback === 'error' && styles.cardError,
              scaffoldFeedback === 'success' && styles.cardSuccess,
            ]}
          >
            <Text style={styles.mainEq}>{currentScaffold.equation}</Text>

            <View style={styles.blanksList}>
              {currentScaffold.blanks.map((b) => {
                const isActive = activeBlankKey === b.key;
                const value = scaffoldAnswers[b.key] || '';
                return (
                  <TouchableOpacity
                    key={b.key}
                    activeOpacity={0.7}
                    onPress={() => setActiveBlankKey(b.key)}
                    style={[
                      styles.blankRow,
                      isActive && styles.blankRowActive,
                    ]}
                  >
                    <Text style={styles.blankLabel}>{b.label}:</Text>
                    <View style={styles.blankBox}>
                      <Text style={styles.blankValue}>
                        {value.length > 0 ? value : '_'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Numpad for Scaffolding */}
          <Numpad
            onPressDigit={handleScaffoldDigit}
            onDelete={handleScaffoldDelete}
            onClear={handleScaffoldClear}
            onSubmit={handleVerifyScaffold}
          />
        </View>
      )}

      {/* STEP 3: TIMED DRILL */}
      {step === 3 && (
        <View style={styles.drillContainer}>
          <View style={styles.drillHeader}>
            <Text style={styles.drillProgress}>
              QUESTÃO {drillIdx + 1} DE {totalDrillQuestions}
            </Text>
            <Text style={styles.drillSub}>Fixação Rápida da Técnica</Text>
          </View>

          <EquationDisplay
            equation={currentQuestion.equation}
            userAnswer={drillInput}
            status={drillFeedback}
            technique={node.technique}
            hint={currentQuestion.hint}
          />

          <Numpad
            onPressDigit={handleDrillDigit}
            onDelete={() => setDrillInput((prev) => prev.slice(0, -1))}
            onClear={() => setDrillInput('')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  stepsIndicator: {
    flexDirection: 'row',
  },
  stepPillWrapper: {
    marginHorizontal: 3,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  stepPillActive: {
    backgroundColor: colors.primaryCyan,
    borderColor: colors.primaryCyan,
  },
  stepPillDone: {
    backgroundColor: colors.successEmerald,
    borderColor: colors.successEmerald,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
    marginRight: 4,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  contentCard: {
    padding: spacing.space4,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mascotRow: {
    marginVertical: spacing.space2,
  },
  theoryTag: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderGlowCyan,
    marginBottom: spacing.space2,
  },
  theoryTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 1,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  techniqueName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.space3,
  },
  formulaBox: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(138, 43, 226, 0.4)',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    marginBottom: spacing.space3,
    width: '100%',
    alignItems: 'center',
  },
  formulaText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  explanationText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.space4,
  },
  breakdownCard: {
    width: '100%',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space4,
    alignItems: 'center',
    marginBottom: spacing.space4,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.space3,
  },
  breakdownSteps: {
    alignItems: 'center',
    width: '100%',
  },
  fromBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  fromText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  arrowStepRow: {
    alignItems: 'center',
    marginVertical: 2,
  },
  arrowDown: {
    color: colors.primaryCyan,
    fontSize: 16,
    marginVertical: 2,
  },
  stepBubble: {
    fontSize: 14,
    color: colors.primaryCyan,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  resultPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: spacing.space4,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.successEmerald,
  },
  resultPillText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.successEmerald,
    fontFamily: typography.fontFamily.mono,
  },
  primaryBtn: {
    backgroundColor: colors.primaryCyan,
    width: '100%',
    height: 54,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    color: colors.bgObsidian,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scaffoldContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.space4,
    paddingBottom: spacing.space2,
  },
  scaffoldHeader: {
    alignItems: 'center',
  },
  scaffoldProgress: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentViolet,
    letterSpacing: 1,
  },
  scaffoldInstruction: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  scaffoldEquationCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    padding: spacing.space4,
    alignItems: 'center',
    marginVertical: spacing.space2,
  },
  cardError: {
    borderColor: colors.errorCoral,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  cardSuccess: {
    borderColor: colors.successEmerald,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  mainEq: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
    marginBottom: spacing.space3,
  },
  blanksList: {
    width: '100%',
  },
  blankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    marginBottom: spacing.space2,
  },
  blankRowActive: {
    borderColor: colors.primaryCyan,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
  },
  blankLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  blankBox: {
    minWidth: 70,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space2,
  },
  blankValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  drillContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.space4,
    paddingBottom: spacing.space2,
  },
  drillHeader: {
    alignItems: 'center',
  },
  drillProgress: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.goldStellar,
    letterSpacing: 1,
  },
  drillSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
