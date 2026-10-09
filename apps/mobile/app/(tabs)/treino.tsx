import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';

export default function TreinoHubScreen() {
  const router = useRouter();

  const gameModes = [
    {
      id: 'arena',
      title: 'Arena Solo',
      subtitle: 'Treino livre com multiplicador de combo e mascote Aura reativo',
      icon: '⚡',
      route: '/game/arena',
      color: colors.primaryCyan,
      tag: 'ARCADE LIVRE',
    },
    {
      id: 'blitz',
      title: 'Blitz 60 Segundos',
      subtitle: 'Corrida frenética contra o relógio com filtros paramétricos',
      icon: '⏱️',
      route: '/game/blitz',
      color: colors.goldStellar,
      tag: 'COMPETITIVO',
    },
    {
      id: 'sudden_death',
      title: 'Morte Súbita',
      subtitle: 'Apenas 1 vida! O cronômetro acelera a cada acerto',
      icon: '💀',
      route: '/game/sudden-death',
      color: colors.plasmaMagenta,
      tag: 'SURVIVAL',
    },
    {
      id: 'split_battle',
      title: 'Batalha Local (Split)',
      subtitle: 'Duelo 2 jogadores no mesmo aparelho com tela invertida 180°',
      icon: '🔄',
      route: '/game/split-battle',
      color: '#38BDF8',
      tag: '2 PLAYERS',
    },
    {
      id: 'shadow_racing',
      title: 'Shadow Racing (1v1)',
      subtitle: 'Duelo assíncrono contra runs reais gravadas de jogadores do seu Elo',
      icon: '🏎️',
      route: '/game/shadow-racing',
      color: colors.accentViolet,
      tag: 'ONLINE GHOST',
    },
    {
      id: 'daily',
      title: 'Desafio Diário ("Mathle")',
      subtitle: '20 questões globais às 00:00 UTC com grid de emojis compartilhável',
      icon: '📅',
      route: '/game/daily',
      color: colors.successEmerald,
      tag: 'DIÁRIO',
    },
    {
      id: 'flash_anzan',
      title: 'Flash Anzan',
      subtitle: 'Cálculo visuoespacial com números piscando a cada 300ms',
      icon: '👁️',
      route: '/game/flash-anzan',
      color: '#F43F5E',
      tag: 'NEURO-TREINO',
    },
    {
      id: 'flow_zen',
      title: 'Flow Zen',
      subtitle: 'Modo contínuo sem pressão, com sintetizador generativo Lofi',
      icon: '🧘',
      route: '/game/flow-zen',
      color: '#34D399',
      tag: 'MEDITATIVO',
    },
    {
      id: 'mastery',
      title: 'Desafio de Maestria da Unidade',
      subtitle: 'Prove fluência estrutural e obtenha selos de certificação sem cronômetros punitivos',
      icon: '🎓',
      route: '/game/boss',
      color: '#10B981',
      tag: 'CERTIFICAÇÃO',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arenas & Modos de Jogo</Text>
        <Text style={styles.headerSubtitle}>
          Escolha uma modalidade para exercitar fluência, velocidade ou foco
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {gameModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeCard, { borderColor: `${mode.color}40` }]}
            activeOpacity={0.75}
            onPress={() => router.push(mode.route as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${mode.color}20` }]}>
              <Text style={styles.iconText}>{mode.icon}</Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.badgeRow}>
                <Text style={[styles.modeTag, { color: mode.color }]}>{mode.tag}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
            </View>

            <View style={styles.chevronBox}>
              <Text style={[styles.chevronText, { color: mode.color }]}>›</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.space4,
    paddingBottom: 80,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.space3,
    marginBottom: spacing.space3,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.space3,
  },
  iconText: {
    fontSize: 24,
  },
  infoBox: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  modeTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modeSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  chevronBox: {
    marginLeft: spacing.space2,
    paddingHorizontal: 4,
  },
  chevronText: {
    fontSize: 28,
    fontWeight: '300',
  },
});
