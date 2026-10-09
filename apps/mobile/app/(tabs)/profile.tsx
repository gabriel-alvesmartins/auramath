import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { MOCK_USER_PROFILE, MASTERY_BADGES, MasteryBadgeData } from '@auramath/engine';
import { RadarChart } from '../../src/components/RadarChart';
import { AuraMascot } from '../../src/components/AuraMascot';

export default function ProfileScreen() {
  const [user, setUser] = useState(MOCK_USER_PROFILE);
  const [badges, setBadges] = useState<MasteryBadgeData[]>(MASTERY_BADGES);

  const xpProgress = Math.round((user.currentXp / user.nextLevelXp) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Identity Header */}
        <View style={styles.userBanner}>
          <View style={styles.avatarContainer}>
            <AuraMascot combo={20} size={76} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>NÍVEL {user.level}</Text>
              </View>
              <Text style={styles.eloText}>ELO {user.elo}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>PROGRESSO DE EXPERIÊNCIA</Text>
            <Text style={styles.xpNumbers}>
              {user.currentXp} / {user.nextLevelXp} XP
            </Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
          </View>
        </View>

        {/* Section: DNA Matemático & Radar Cognitivo */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DNA Matemático & Radar</Text>
          <Text style={styles.sectionSubtitle}>
            Mapeamento cognitivo normalizado em 5 eixos de raciocínio
          </Text>
        </View>

        <View style={styles.radarCard}>
          <RadarChart radar={user.radar} size={300} />
        </View>

        {/* Section: Selos de Maestria da Trilha */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selos de Maestria da Trilha</Text>
          <Text style={styles.sectionSubtitle}>
            Certificados oficiais obtidos ao concluir as Provas de Maestria de cada Unidade
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skinsCarousel}
        >
          {badges.map((badge) => {
            return (
              <View
                key={badge.id}
                style={[
                  styles.skinCard,
                  !badge.unlocked && styles.skinCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.skinPreviewCircle,
                    {
                      backgroundColor: `${badge.previewColor}25`,
                      borderColor: badge.previewColor,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>
                    {badge.unlocked ? badge.iconSymbol || '📜' : '🔒'}
                  </Text>
                </View>

                <View style={styles.skinRarityBadge}>
                  <Text style={[styles.skinRarityText, { color: badge.previewColor }]}>
                    GRAU {badge.grade}
                  </Text>
                </View>

                <Text style={styles.skinName}>{badge.name}</Text>
                <Text style={styles.skinDesc} numberOfLines={2}>
                  {badge.unlocked ? badge.description : badge.unlockCondition}
                </Text>

                <View
                  style={[
                    styles.equipBtn,
                    badge.unlocked && styles.equipBtnActive,
                    !badge.unlocked && styles.equipBtnLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.equipBtnText,
                      badge.unlocked && { color: colors.bgObsidian, fontWeight: '800' },
                    ]}
                  >
                    {badge.unlocked ? 'CERTIFICADO' : 'NÃO CONCLUÍDO'}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Records Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recordes Pessoais</Text>
        </View>

        <View style={styles.recordsGrid}>
          <View style={styles.recordItem}>
            <Text style={styles.recordLabel}>RECORDE NO BLITZ</Text>
            <Text style={styles.recordValue}>{user.highestBlitzScore} pts</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.recordLabel}>STREAK MÁXIMO</Text>
            <Text style={styles.recordValue}>{user.streakDays} dias</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.recordLabel}>ESTRELAS CONQUISTADAS</Text>
            <Text style={styles.recordValue}>{user.starsCount} ★</Text>
          </View>
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
    paddingBottom: 80,
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    marginBottom: spacing.space3,
  },
  avatarContainer: {
    marginRight: spacing.space3,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  username: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: spacing.space2,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderGlowCyan,
    marginRight: spacing.space2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 0.5,
  },
  eloText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  xpCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    marginBottom: spacing.space4,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  xpNumbers: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
  },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primaryCyan,
  },
  sectionHeader: {
    marginTop: spacing.space3,
    marginBottom: spacing.space2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radarCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space4,
    alignItems: 'center',
    marginBottom: spacing.space4,
  },
  skinsCarousel: {
    paddingVertical: spacing.space2,
    marginBottom: spacing.space4,
  },
  skinCard: {
    width: 170,
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    alignItems: 'center',
    marginRight: spacing.space3,
  },
  skinCardEquipped: {
    borderColor: colors.primaryCyan,
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
  },
  skinCardLocked: {
    opacity: 0.6,
  },
  skinPreviewCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space2,
  },
  skinRarityBadge: {
    marginBottom: 4,
  },
  skinRarityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  skinName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  skinDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
    height: 28,
  },
  equipBtn: {
    marginTop: spacing.space2,
    width: '100%',
    height: 32,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipBtnActive: {
    backgroundColor: colors.primaryCyan,
    borderColor: colors.primaryCyan,
  },
  equipBtnLocked: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  equipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  recordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.space4,
  },
  recordItem: {
    flex: 1,
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  recordLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
});
