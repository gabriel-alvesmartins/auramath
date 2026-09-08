import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';

export default function ResultVictoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    score?: string;
    accuracy?: string;
    total?: string;
    correct?: string;
    avgSpeedMs?: string;
    maxStreak?: string;
  }>();

  const mode = params.mode || 'Partida de Fluência';
  const score = parseInt(params.score || '1200', 10);
  const accuracy = parseInt(params.accuracy || '90', 10);
  const total = parseInt(params.total || '15', 10);
  const correct = parseInt(params.correct || '14', 10);
  const avgSpeedMs = parseInt(params.avgSpeedMs || '1350', 10);
  const xpEarned = Math.round(score * 0.25) + 50;

  // Donut geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (accuracy / 100));

  const handleShare = () => {
    Alert.alert(
      'Compartilhado!',
      `Auramath: Completei ${mode} com ${accuracy}% de precisão e média de ${(avgSpeedMs / 1000).toFixed(2)}s por questão! #Auramath`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mode & Title */}
        <View style={styles.header}>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{mode.toUpperCase()}</Text>
          </View>
          <Text style={styles.victoryTitle}>Sessão Concluída!</Text>
          <Text style={styles.victorySubtitle}>Sua Aura absorveu nova energia mental</Text>
        </View>

        {/* Circular Accuracy Donut */}
        <View style={styles.donutContainer}>
          <Svg width={136} height={136} style={styles.donutSvg}>
            <Circle
              cx="68"
              cy="68"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="68"
              cy="68"
              r={radius}
              stroke={accuracy >= 80 ? colors.primaryCyan : colors.goldStellar}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 68 68)"
            />
          </Svg>
          <View style={styles.donutTextBox}>
            <Text style={styles.donutPercent}>{accuracy}%</Text>
            <Text style={styles.donutLabel}>PRECISÃO</Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.statsGrid}>
          {/* Score */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PONTUAÇÃO</Text>
            <Text style={[styles.statValue, { color: colors.goldStellar }]}>{score}</Text>
          </View>

          {/* Speed */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>VELOCIDADE MÉDIA</Text>
            <Text style={[styles.statValue, { color: colors.primaryCyan }]}>
              {(avgSpeedMs / 1000).toFixed(2)}s
            </Text>
          </View>

          {/* Correct / Total */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACERTOS</Text>
            <Text style={[styles.statValue, { color: colors.successEmerald }]}>
              {correct} / {total}
            </Text>
          </View>

          {/* XP Gained */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>EXPERIÊNCIA</Text>
            <Text style={[styles.statValue, { color: colors.accentViolet }]}>+{xpEarned} XP</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.rematchBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.rematchBtnText}>JOGAR NOVAMENTE ↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <Text style={styles.shareBtnText}>COMPARTILHAR RESULTADO 📤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.homeBtnText}>VOLTAR AO INÍCIO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
  },
  scrollContent: {
    padding: spacing.space4,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.space2,
  },
  modeBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderGlowCyan,
    marginBottom: spacing.space2,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 1,
  },
  victoryTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  victorySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  donutContainer: {
    width: 136,
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.space6,
  },
  donutSvg: {
    position: 'absolute',
  },
  donutTextBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercent: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  donutLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginTop: -2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    marginBottom: spacing.space6,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    alignItems: 'center',
    marginBottom: spacing.space3,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: typography.fontFamily.mono,
  },
  actions: {
    width: '100%',
    maxWidth: 340,
  },
  rematchBtn: {
    backgroundColor: colors.primaryCyan,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space3,
    shadowColor: colors.primaryCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  rematchBtnText: {
    color: colors.bgObsidian,
    fontSize: 15,
    fontWeight: '800',
  },
  shareBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    height: 50,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space3,
  },
  shareBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  homeBtn: {
    alignItems: 'center',
    padding: spacing.space2,
  },
  homeBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
