import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { TRACK_GRADES, MOCK_USER_PROFILE, TrackNodeData } from '@auramath/engine';
import { TrackNode } from '../../src/components/TrackNode';
import { AuraMascot } from '../../src/components/AuraMascot';

export default function HomeScreen() {
  const router = useRouter();
  const user = MOCK_USER_PROFILE;

  const handleNodePress = (node: TrackNodeData) => {
    router.push({
      pathname: '/lesson/[nodeId]',
      params: { nodeId: node.id },
    });
  };

  const handleBossPress = (bossId: string) => {
    router.push({
      pathname: '/game/boss',
      params: { bossId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Streaks & Stats */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          {/* Streak Pill */}
          <View style={styles.streakPill}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={styles.streakText}>{user.streakDays} DIAS</Text>
          </View>

          {/* Stars Pill */}
          <View style={styles.starsPill}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.starsText}>{user.starsCount}</Text>
            <Text style={styles.starsMax}>/{user.totalStars}</Text>
          </View>

          {/* Level Pill */}
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>LV.{user.level}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/teacher')}
          >
            <Text style={styles.iconBtnText}>🏫</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.iconBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Training Banner */}
        <TouchableOpacity
          style={styles.arenaBanner}
          activeOpacity={0.8}
          onPress={() => router.push('/game/arena')}
        >
          <View style={styles.arenaBannerContent}>
            <View>
              <Text style={styles.bannerBadge}>ARENA ABERTA</Text>
              <Text style={styles.bannerTitle}>Treino Rápido Solo</Text>
              <Text style={styles.bannerSubtitle}>Entre no fluxo e expanda sua Aura</Text>
            </View>
            <View style={styles.playArrowCircle}>
              <Text style={styles.playArrowText}>▶</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 6-Grade Tree Map */}
        {TRACK_GRADES.map((gradeData, gIndex) => (
          <View key={`grade-${gradeData.grade}`} style={styles.gradeSection}>
            {/* Grade Header */}
            <View style={styles.gradeHeader}>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>GRAU {gradeData.grade}</Text>
              </View>
              <Text style={styles.gradeTitle}>{gradeData.title.split(': ')[1] || gradeData.title}</Text>
              <Text style={styles.gradeSubtitle}>{gradeData.subtitle}</Text>
            </View>

            {/* Nodes Sequence com Caminho Serpenteado Duolingo */}
            <View style={styles.nodesTree}>
              {gradeData.nodes.map((node, nIndex) => {
                const offsets = [0, 42, 0, -42];
                const xOffset = offsets[nIndex % 4];

                return (
                  <React.Fragment key={node.id}>
                    <View
                      style={[
                        styles.nodeWrapper,
                        { transform: [{ translateX: xOffset }] },
                      ]}
                    >
                      {nIndex > 0 && <View style={styles.connectorLine} />}

                      {/* Floating Aura Mascot beside the active node in Grade 1 */}
                      {gIndex === 0 && nIndex === 0 && (
                        <View style={styles.auraFloatingCompanion}>
                          <AuraMascot size={52} state="idle" />
                          <View style={styles.auraSpeechPill}>
                            <Text style={styles.auraSpeechText}>Vamos treinar!</Text>
                          </View>
                        </View>
                      )}

                      <TrackNode
                        node={node}
                        onPress={handleNodePress}
                        isActive={node.order === 1}
                      />
                    </View>

                    {/* Baú de Recompensa Cósmica Intercalado */}
                    {nIndex === 1 && (
                      <View style={styles.chestWrapper}>
                        <TouchableOpacity
                          style={styles.chestButton}
                          activeOpacity={0.8}
                          onPress={() => {
                            // Quick chest interaction
                          }}
                        >
                          <Text style={styles.chestEmoji}>📦</Text>
                          <Text style={styles.chestLabel}>Caixa de Descobertas (+50 Gotas)</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Mastery Challenge Node */}
              <View style={styles.nodeWrapper}>
                <View style={styles.connectorLine} />
                <TouchableOpacity
                  style={styles.bossCard}
                  activeOpacity={0.8}
                  onPress={() => handleBossPress(gradeData.masteryChallengeId || gradeData.bossId)}
                >
                  <View style={styles.bossIconBox}>
                    <Text style={styles.bossSkull}>🎓</Text>
                  </View>
                  <View style={styles.bossTextBox}>
                    <Text style={styles.bossTag}>DESAFIO DE MAESTRIA</Text>
                    <Text style={styles.bossName}>Prova Estrutural: Grau {gradeData.grade}</Text>
                    <Text style={styles.bossReward}>Recompensa: Selo de Maestria e +250 XP</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: 'rgba(7, 9, 14, 0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space2,
    paddingVertical: 4,
    marginRight: spacing.space2,
  },
  streakFlame: {
    fontSize: 13,
    marginRight: 3,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FB923C',
    fontFamily: typography.fontFamily.mono,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space2,
    paddingVertical: 4,
    marginRight: spacing.space2,
  },
  starIcon: {
    fontSize: 12,
    color: colors.goldStellar,
    marginRight: 3,
  },
  starsText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  starsMax: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  levelPill: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.35)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space2,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentViolet,
    fontFamily: typography.fontFamily.mono,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.space2,
  },
  iconBtnText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: spacing.space4,
    paddingTop: spacing.space4,
    paddingBottom: 80,
  },
  arenaBanner: {
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderGlowCyan,
    padding: spacing.space3,
    marginBottom: spacing.space4,
  },
  arenaBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  playArrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playArrowText: {
    fontSize: 14,
    color: colors.bgObsidian,
    marginLeft: 2,
    fontWeight: '900',
  },
  gradeSection: {
    marginBottom: spacing.space8,
  },
  gradeHeader: {
    alignItems: 'center',
    marginBottom: spacing.space4,
  },
  gradeBadge: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.space3,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.4)',
    marginBottom: spacing.space1,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentViolet,
    letterSpacing: 1.2,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  gradeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  nodesTree: {
    alignItems: 'center',
  },
  nodeWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  connectorLine: {
    width: 2,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bossCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 29, 72, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(225, 29, 72, 0.35)',
    borderRadius: radii.xl,
    padding: spacing.space3,
    maxWidth: 320,
    width: '100%',
    marginTop: spacing.space2,
  },
  bossIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(225, 29, 72, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space3,
  },
  bossSkull: {
    fontSize: 22,
  },
  bossTextBox: {
    flex: 1,
  },
  bossTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.plasmaMagenta,
    letterSpacing: 1,
  },
  bossName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bossReward: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  auraFloatingCompanion: {
    position: 'absolute',
    right: -80,
    top: -10,
    alignItems: 'center',
    zIndex: 20,
  },
  auraSpeechPill: {
    backgroundColor: 'rgba(13, 17, 26, 0.95)',
    borderWidth: 1,
    borderColor: colors.primaryCyan,
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  auraSpeechText: {
    color: colors.primaryCyan,
    fontSize: 10,
    fontWeight: '800',
  },
  chestWrapper: {
    alignItems: 'center',
    marginVertical: spacing.space3,
  },
  chestButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.35)',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
  },
  chestEmoji: {
    fontSize: 24,
  },
  chestLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.goldStellar,
    marginTop: 2,
  },
});
