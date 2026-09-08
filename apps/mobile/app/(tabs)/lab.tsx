import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography } from '../../../../src/theme/tokens';

export default function TactileGeometryLabScreen() {
  const [technique, setTechnique] = useState<'sum_sq' | 'diff_sq' | 'diff_sub_sq'>('sum_sq');

  // Dimension variables
  const [a, setA] = useState(6);
  const [b, setB] = useState(4);

  // Geometric calculations
  const aSq = a * a;
  const bSq = b * b;
  const ab = a * b;
  const sumTotal = (a + b) * (a + b);
  const diffSquaresTotal = (a - b) * (a + b);

  // Canvas scaling: map total (a + b) to pixel width
  const maxTileDimension = 220;
  const totalUnits = a + b;
  const scale = maxTileDimension / Math.max(1, totalUnits);
  const pxA = Math.round(a * scale);
  const pxB = Math.round(b * scale);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTag}>LABORATÓRIO TÁTIL DE GEOMETRIA</Text>
          <Text style={styles.headerTitle}>Álgebra Espacial Interativa</Text>
          <Text style={styles.headerSubtitle}>
            Manipule os blocos físicos para visualizar por que as identidades algébricas funcionam
          </Text>
        </View>

        {/* Technique Switcher */}
        <View style={styles.techniqueTabs}>
          {[
            { id: 'sum_sq', label: '(a + b)²' },
            { id: 'diff_sq', label: '(a - b)(a + b)' },
            { id: 'diff_sub_sq', label: '(a - b)²' },
          ].map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.tabBtn,
                technique === t.id && styles.tabBtnActive,
              ]}
              onPress={() => setTechnique(t.id as any)}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  technique === t.id && styles.tabBtnTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tactile Variable Steppers */}
        <View style={styles.controlsCard}>
          {/* Stepper for Variable A */}
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Variável a = {a}</Text>
            <View style={styles.stepperBtns}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setA((prev) => Math.max(2, prev - 1))}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValueBox}>
                <Text style={styles.stepValueText}>{a}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setA((prev) => Math.min(10, prev + 1))}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stepper for Variable B */}
          <View style={[styles.stepperRow, { marginTop: spacing.space3 }]}>
            <Text style={styles.stepperLabel}>Variável b = {b}</Text>
            <View style={styles.stepperBtns}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setB((prev) => Math.max(1, prev - 1))}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValueBox}>
                <Text style={styles.stepValueText}>{b}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setB((prev) => Math.min(a - 1, prev + 1))}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dynamic Proportional Tiles Canvas */}
        <View style={styles.canvasCard}>
          <Text style={styles.canvasTitle}>ÁREAS GEOMÉTRICAS EM TEMPO REAL</Text>

          <View style={[styles.canvasGrid, { width: maxTileDimension, height: maxTileDimension }]}>
            {/* Top Row: a^2 and ab */}
            <View style={{ flexDirection: 'row' }}>
              {/* Tile a^2 */}
              <View style={[styles.tileA2, { width: pxA, height: pxA }]}>
                <Text style={styles.tileFormula}>a²</Text>
                <Text style={styles.tileArea}>{aSq}</Text>
              </View>
              {/* Tile ab (Right) */}
              <View style={[styles.tileAB, { width: pxB, height: pxA }]}>
                <Text style={styles.tileFormula}>ab</Text>
                <Text style={styles.tileArea}>{ab}</Text>
              </View>
            </View>

            {/* Bottom Row: ab and b^2 */}
            <View style={{ flexDirection: 'row' }}>
              {/* Tile ab (Bottom) */}
              <View style={[styles.tileAB, { width: pxA, height: pxB }]}>
                <Text style={styles.tileFormula}>ab</Text>
                <Text style={styles.tileArea}>{ab}</Text>
              </View>
              {/* Tile b^2 */}
              <View style={[styles.tileB2, { width: pxB, height: pxB }]}>
                <Text style={styles.tileFormula}>b²</Text>
                <Text style={styles.tileArea}>{bSq}</Text>
              </View>
            </View>
          </View>

          {/* Dynamic Formula Inspector */}
          <View style={styles.inspectorCard}>
            <Text style={styles.inspectorEquation}>
              ({a} + {b})² = {a + b}² = {sumTotal}
            </Text>
            <View style={styles.inspectorBreakdown}>
              <Text style={styles.breakdownFormula}>
                a² + 2ab + b² = {aSq} + {2 * ab} + {bSq} = {sumTotal}
              </Text>
            </View>
          </View>
        </View>

        {/* Didactic Insight Box */}
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>💡 Intuição Geométrica</Text>
          <Text style={styles.insightText}>
            O quadrado grande de lado ({a} + {b}) é rigorosamente a união de 4 partes: o quadrado azul a² ({aSq}), dois retângulos roxos ab ({ab} cada) e o pequeno quadrado dourado b² ({bSq}). A geometria nunca mente!
          </Text>
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
  header: {
    marginBottom: spacing.space3,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  techniqueTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    padding: 3,
    marginBottom: spacing.space3,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.space2,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: colors.borderGlowCyan,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.primaryCyan,
    fontWeight: '800',
  },
  controlsCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space4,
    marginBottom: spacing.space4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  stepperBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryCyan,
  },
  stepValueBox: {
    minWidth: 44,
    alignItems: 'center',
  },
  stepValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.mono,
  },
  canvasCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space4,
    alignItems: 'center',
    marginBottom: spacing.space4,
  },
  canvasTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.space4,
  },
  canvasGrid: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: spacing.space4,
  },
  tileA2: {
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
    borderWidth: 1,
    borderColor: colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileAB: {
    backgroundColor: 'rgba(138, 43, 226, 0.25)',
    borderWidth: 1,
    borderColor: colors.accentViolet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileB2: {
    backgroundColor: 'rgba(250, 204, 21, 0.25)',
    borderWidth: 1,
    borderColor: colors.goldStellar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileFormula: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  tileArea: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.mono,
  },
  inspectorCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: radii.lg,
    padding: spacing.space3,
    alignItems: 'center',
    width: '100%',
  },
  inspectorEquation: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
  },
  inspectorBreakdown: {
    marginTop: 4,
  },
  breakdownFormula: {
    fontSize: 12,
    color: colors.primaryCyan,
    fontFamily: typography.fontFamily.mono,
    fontWeight: '700',
  },
  insightBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: spacing.space3,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.successEmerald,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
