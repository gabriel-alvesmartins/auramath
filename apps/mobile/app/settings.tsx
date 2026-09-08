import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii, typography } from '../../../src/theme/tokens';

export default function SettingsScreen() {
  const router = useRouter();

  // Audio Settings
  const [synthAudio, setSynthAudio] = useState(true);
  const [lofiMusic, setLofiMusic] = useState(true);
  const [audioVolume, setAudioVolume] = useState(80);

  // Haptic Settings
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [comboHeavyVibe, setComboHeavyVibe] = useState(true);

  // Numpad & Accessibility
  const [flickGestures, setFlickGestures] = useState(true);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleToggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    if (val) {
      try {
        Haptics.notificationAsync?.(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Redefinir Progresso?',
      'Esta ação zerará o progresso de estrelas e recordes salvos localmente no dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: () => Alert.alert('Progresso reinicializado com sucesso!'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferências & Acessibilidade</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Audio Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Síntese de Áudio & Sonoplastia</Text>
          <Text style={styles.sectionSub}>Áudio pentatônico sem latência sintetizado em tempo real</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Escala Pentatônica Harmônica</Text>
              <Text style={styles.settingDesc}>Dispara notas musicais Dó-Ré-Mi-Sol-Lá em combos</Text>
            </View>
            <Switch
              value={synthAudio}
              onValueChange={setSynthAudio}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Trilha Lofi de Fundo (Modo Zen)</Text>
              <Text style={styles.settingDesc}>Sons de vinil, piano Rhodes e chuva procedural</Text>
            </View>
            <Switch
              value={lofiMusic}
              onValueChange={setLofiMusic}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.stepperSettingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Volume da Síntese</Text>
              <Text style={styles.settingDesc}>{audioVolume}%</Text>
            </View>
            <View style={styles.volumeBtns}>
              <TouchableOpacity
                style={styles.volBtn}
                onPress={() => setAudioVolume((prev) => Math.max(0, prev - 10))}
              >
                <Text style={styles.volBtnText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.volBtn}
                onPress={() => setAudioVolume((prev) => Math.min(100, prev + 10))}
              >
                <Text style={styles.volBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Haptics Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resposta Tátil & Háptica</Text>
          <Text style={styles.sectionSub}>Pulsos físicos escalonados por relevância da jogada</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibração no Teclado In-App</Text>
              <Text style={styles.settingDesc}>Micro-pulso leve a 0ms em cada toque de tecla</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Impacto Pesado em Marcos de Combo</Text>
              <Text style={styles.settingDesc}>Pulso enfático ao atingir patamares x5, x10 e x20</Text>
            </View>
            <Switch
              value={comboHeavyVibe}
              onValueChange={setComboHeavyVibe}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>
        </View>

        {/* Numpad & Gestures Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ergonomia do Teclado & Gestos</Text>
          <Text style={styles.sectionSub}>Atalhos para digitação sem olhar</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Flick Gestures (Deslizamento Rápido)</Text>
              <Text style={styles.settingDesc}>Swipe right p/ envio, swipe left p/ limpar visor</Text>
            </View>
            <Switch
              value={flickGestures}
              onValueChange={setFlickGestures}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-submissão ao Completar Dígitos</Text>
              <Text style={styles.settingDesc}>Valida instantaneamente sem precisar pressionar Enter</Text>
            </View>
            <Switch
              value={autoSubmit}
              onValueChange={setAutoSubmit}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Modo Alto Contraste</Text>
              <Text style={styles.settingDesc}>Bordas reforçadas em 2px para maior legibilidade</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#334155', true: colors.primaryCyan }}
            />
          </View>
        </View>

        {/* Account & Reset */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conta & Armazenamento</Text>
        </View>

        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetProgress}>
            <Text style={styles.resetBtnText}>Redefinir Dados & Progresso Local</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appVersionBox}>
          <Text style={styles.appVersionText}>Auramath v1.0.0 (Edição Cósmica)</Text>
          <Text style={styles.appCreditsText}>Desenvolvido com Expo Router & Engine SDD</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.space4,
    paddingBottom: 60,
  },
  sectionHeader: {
    marginTop: spacing.space3,
    marginBottom: spacing.space2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    marginBottom: spacing.space2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.space2,
  },
  stepperSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.space2,
  },
  settingInfo: {
    flex: 1,
    paddingRight: spacing.space3,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 4,
  },
  volumeBtns: {
    flexDirection: 'row',
  },
  volBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.space1,
  },
  volBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryCyan,
  },
  resetBtn: {
    paddingVertical: spacing.space3,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.errorCoral,
  },
  appVersionBox: {
    alignItems: 'center',
    marginTop: spacing.space6,
    marginBottom: spacing.space4,
  },
  appVersionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  appCreditsText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
