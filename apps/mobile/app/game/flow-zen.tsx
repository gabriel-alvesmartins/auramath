import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';
import { generateQuestion, Question } from '@auramath/engine';
import { Numpad } from '../../src/components/Numpad';
import { EquationDisplay } from '../../src/components/EquationDisplay';

export default function FlowZenScreen() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion('zen'));
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [zenCount, setZenCount] = useState(0);

  // Procedural Lofi Audio Visualizer bars
  const barCount = 14;
  const barAnims = useRef(new Array(barCount).fill(0).map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const loops = barAnims.map((anim, i) => {
      const duration = 600 + (i % 5) * 200;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.2 + Math.random() * 0.8,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.2 + Math.random() * 0.4,
            duration,
            useNativeDriver: false,
          }),
        ])
      );
    });

    loops.forEach((l) => l.start());

    return () => loops.forEach((l) => l.stop());
  }, [barAnims]);

  const handleDigit = (digit: string) => {
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    const expectedStr = currentQuestion.answer.toString();
    if (nextInput.length >= expectedStr.length) {
      validateAnswer(parseInt(nextInput, 10));
    }
  };

  const validateAnswer = (ans: number) => {
    if (ans === currentQuestion.answer) {
      setStatus('success');
      setZenCount((prev) => prev + 1);

      setTimeout(() => {
        setUserInput('');
        setStatus('idle');
        setCurrentQuestion(generateQuestion('zen'));
      }, 350);
    } else {
      // Soft feedback: no punishment, just show answer softly
      setStatus('error');
      setTimeout(() => {
        setUserInput('');
        setStatus('idle');
        setCurrentQuestion(generateQuestion('zen'));
      }, 700);
    }
  };

  // Audio layers unlocked
  const hasRhodes = zenCount >= 6;
  const hasRain = zenCount >= 13;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Zen Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.exitBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.zenTitleBox}>
          <Text style={styles.zenTag}>MODO FLOW ZEN</Text>
          <Text style={styles.zenSub}>Sem tempo • Sem penalidades • Foco puro</Text>
        </View>

        <View style={styles.zenPill}>
          <Text style={styles.zenPillNumber}>{zenCount}</Text>
          <Text style={styles.zenPillLabel}>RESPIRAÇÕES</Text>
        </View>
      </View>

      {/* Procedural Lofi Audio Visualizer */}
      <View style={styles.visualizerCard}>
        <View style={styles.barsRow}>
          {barAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.vBar,
                {
                  height: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 42],
                  }),
                },
              ]}
            />
          ))}
        </View>

        {/* Instrumental Layers Badges */}
        <View style={styles.layersRow}>
          <View style={[styles.layerBadge, styles.layerActive]}>
            <Text style={styles.layerText}>🎧 Batida Lofi & Vinil</Text>
          </View>
          <View style={[styles.layerBadge, hasRhodes && styles.layerActive]}>
            <Text style={[styles.layerText, !hasRhodes && styles.layerLocked]}>
              🎹 Piano Rhodes {hasRhodes ? '' : '(6+)'}
            </Text>
          </View>
          <View style={[styles.layerBadge, hasRain && styles.layerActive]}>
            <Text style={[styles.layerText, !hasRain && styles.layerLocked]}>
              🌧️ Chuva Acústica {hasRain ? '' : '(13+)'}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Equation */}
      <View style={styles.arena}>
        <EquationDisplay
          equation={currentQuestion.equation}
          userAnswer={userInput}
          status={status}
          technique={currentQuestion.technique}
          hint={status === 'error' ? `Resposta: ${currentQuestion.answer}` : currentQuestion.hint}
        />
      </View>

      {/* Dock */}
      <View style={styles.dock}>
        <Numpad
          onPressDigit={handleDigit}
          onDelete={() => setUserInput((prev) => prev.slice(0, -1))}
          onClear={() => setUserInput('')}
          accentColor="#34D399"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050B0D', // Deeper calming cyan obsidian
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
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
  zenTitleBox: {
    alignItems: 'center',
  },
  zenTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 1.2,
  },
  zenSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  zenPill: {
    alignItems: 'center',
  },
  zenPillNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34D399',
    fontFamily: typography.fontFamily.mono,
  },
  zenPillLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  visualizerCard: {
    backgroundColor: 'rgba(20, 35, 35, 0.4)',
    marginHorizontal: spacing.space4,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    padding: spacing.space3,
    alignItems: 'center',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    marginBottom: spacing.space2,
  },
  vBar: {
    width: 6,
    backgroundColor: '#34D399',
    marginHorizontal: 3,
    borderRadius: 3,
    opacity: 0.8,
  },
  layersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  layerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space2,
    paddingVertical: 3,
    margin: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  layerActive: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
  },
  layerText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  layerLocked: {
    color: colors.textMuted,
  },
  arena: {
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
  },
  dock: {
    paddingBottom: spacing.space3,
  },
});
