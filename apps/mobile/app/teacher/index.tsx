import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radii, typography, glows } from '../../../../src/theme/tokens';
import { MOCK_CLASSROOMS, MOCK_ASSIGNMENTS, TeacherClassroom, Assignment } from '@auramath/engine';

export default function TeacherHubScreen() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState<TeacherClassroom[]>(MOCK_CLASSROOMS);
  const [selectedClassId, setSelectedClassId] = useState(MOCK_CLASSROOMS[0].id);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);

  // Modal for new assignment
  const [createModal, setCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestions, setNewQuestions] = useState('20');

  const activeClass = classrooms.find((c) => c.id === selectedClassId) || classrooms[0];

  const handleCopyInvite = () => {
    Alert.alert(
      'Código de Convite Copiado!',
      `Compartilhe o código ${activeClass.inviteCode} com seus alunos para ingressarem na turma.`
    );
  };

  const handleCreateAssignment = () => {
    if (!newTitle.trim()) return;

    const newAssign: Assignment = {
      id: `assign_${Date.now()}`,
      classroomId: activeClass.id,
      title: newTitle,
      targetTechniques: ['ADD_LEFT_RIGHT', 'DIFF_OF_SQUARES'],
      requiredQuestions: parseInt(newQuestions, 10) || 20,
      dueDate: '25 de Setembro',
      completionRate: 0,
    };

    setAssignments((prev) => [newAssign, ...prev]);
    setNewTitle('');
    setCreateModal(false);
    Alert.alert('Tarefa Criada!', 'A nova tarefa foi distribuída para todos os alunos da turma.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.hubBadge}>AURAMATH EDUCAÇÃO B2B</Text>
            <Text style={styles.hubTitle}>Painel do Professor</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Classroom Tabs Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.classroomsList}
        >
          {classrooms.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.classTab,
                selectedClassId === c.id && styles.classTabActive,
              ]}
              onPress={() => setSelectedClassId(c.id)}
            >
              <Text
                style={[
                  styles.classTabText,
                  selectedClassId === c.id && styles.classTabTextActive,
                ]}
              >
                {c.name}
              </Text>
              <Text style={styles.studentCountText}>{c.studentCount} alunos</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Invite Code Card */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteInfo}>
            <Text style={styles.inviteLabel}>CÓDIGO DE ACESSO DA TURMA</Text>
            <Text style={styles.inviteCode}>{activeClass.inviteCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyInvite}>
            <Text style={styles.copyBtnText}>COPIAR CÓDIGO 📋</Text>
          </TouchableOpacity>
        </View>

        {/* Class Analytics Overview */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>PRECISÃO MÉDIA</Text>
            <Text style={[styles.metricValue, { color: colors.successEmerald }]}>
              {activeClass.averageAccuracy}%
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>VELOCIDADE MÉDIA</Text>
            <Text style={[styles.metricValue, { color: colors.primaryCyan }]}>
              {(activeClass.averageSpeedMs / 1000).toFixed(2)}s
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ALUNOS ATIVOS</Text>
            <Text style={[styles.metricValue, { color: colors.goldStellar }]}>
              {activeClass.studentCount}
            </Text>
          </View>
        </View>

        {/* Cognitive Heatmap of Blind Spots */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mapa de Calor: Pontos Cegos</Text>
          <Text style={styles.sectionSubtitle}>
            Identificação automática de técnicas com maior índice de hesitação e erros
          </Text>
        </View>

        <View style={styles.heatmapCard}>
          {activeClass.blindSpots.map((spot, i) => {
            const isSevere = spot.errorRate >= 30;
            const isModerate = spot.errorRate >= 15 && spot.errorRate < 30;
            const barColor = isSevere
              ? colors.errorCoral
              : isModerate
              ? colors.goldStellar
              : colors.successEmerald;

            return (
              <View key={i} style={styles.heatmapItem}>
                <View style={styles.spotHeader}>
                  <Text style={styles.techniqueTitle}>{spot.technique}</Text>
                  <Text style={[styles.errorPercent, { color: barColor }]}>
                    {spot.errorRate}% erro • {(spot.averageLatencyMs / 1000).toFixed(1)}s
                  </Text>
                </View>

                {/* Visual heat progress */}
                <View style={styles.heatTrack}>
                  <View
                    style={[
                      styles.heatFill,
                      { width: `${spot.errorRate}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Active Assignments */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Tarefas & Desafios</Text>
            <Text style={styles.sectionSubtitle}>Baterias de cálculo distribuídas</Text>
          </View>
          <TouchableOpacity
            style={styles.newAssignBtn}
            onPress={() => setCreateModal(true)}
          >
            <Text style={styles.newAssignBtnText}>+ NOVA TAREFA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assignmentsList}>
          {assignments.map((assign) => (
            <View key={assign.id} style={styles.assignCard}>
              <View style={styles.assignHeader}>
                <Text style={styles.assignTitle}>{assign.title}</Text>
                <Text style={styles.assignDue}>Prazo: {assign.dueDate}</Text>
              </View>

              <Text style={styles.assignMeta}>
                {assign.requiredQuestions} questões • Conclusão: {assign.completionRate}%
              </Text>

              <View style={styles.completionTrack}>
                <View
                  style={[
                    styles.completionFill,
                    { width: `${assign.completionRate}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal to Create New Assignment */}
      <Modal visible={createModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Nova Tarefa</Text>
            <Text style={styles.modalSub}>
              Distribua um treino para a turma {activeClass.name}
            </Text>

            <Text style={styles.inputLabel}>Título da Tarefa</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Treino de Fatores 5 e 25"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabel}>Quantidade de Questões</Text>
            <TextInput
              style={styles.textInput}
              placeholder="20"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={newQuestions}
              onChangeText={setNewQuestions}
            />

            <TouchableOpacity
              style={styles.confirmCreateBtn}
              onPress={handleCreateAssignment}
            >
              <Text style={styles.confirmCreateText}>DISTRIBUIR TAREFA ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setCreateModal(false)}
            >
              <Text style={styles.cancelText}>CANCELAR</Text>
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
  },
  scrollContent: {
    padding: spacing.space4,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 26,
    color: colors.textPrimary,
    marginTop: -2,
  },
  headerCenter: {
    alignItems: 'center',
  },
  hubBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryCyan,
    letterSpacing: 1.2,
  },
  hubTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  classroomsList: {
    paddingVertical: spacing.space2,
    marginBottom: spacing.space3,
  },
  classTab: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    marginRight: spacing.space2,
  },
  classTabActive: {
    borderColor: colors.primaryCyan,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  classTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  classTabTextActive: {
    color: colors.primaryCyan,
    fontWeight: '800',
  },
  studentCountText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(138, 43, 226, 0.12)',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.35)',
    padding: spacing.space3,
    marginBottom: spacing.space4,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.goldStellar,
    fontFamily: typography.fontFamily.mono,
    marginTop: 2,
  },
  copyBtn: {
    backgroundColor: colors.accentViolet,
    paddingHorizontal: spacing.space3,
    paddingVertical: 8,
    borderRadius: radii.md,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.space4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space2,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: typography.fontFamily.mono,
  },
  sectionHeader: {
    marginBottom: spacing.space2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.space4,
    marginBottom: spacing.space2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  newAssignBtn: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: spacing.space3,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primaryCyan,
  },
  newAssignBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryCyan,
  },
  heatmapCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
  },
  heatmapItem: {
    marginVertical: spacing.space2,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  techniqueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorPercent: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: typography.fontFamily.mono,
  },
  heatTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  heatFill: {
    height: '100%',
  },
  assignmentsList: {
    marginTop: spacing.space2,
  },
  assignCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space3,
    marginBottom: spacing.space2,
  },
  assignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  assignDue: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  assignMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginVertical: 4,
  },
  completionTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.primaryCyan,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 9, 14, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.space4,
  },
  modalContent: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.space5,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: spacing.space3,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: spacing.space2,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    paddingHorizontal: spacing.space3,
    paddingVertical: spacing.space2,
    color: colors.textPrimary,
    fontSize: 14,
  },
  confirmCreateBtn: {
    backgroundColor: colors.primaryCyan,
    height: 46,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.space4,
  },
  confirmCreateText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.bgObsidian,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: spacing.space2,
    marginTop: 4,
  },
  cancelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
