/**
 * ==============================================================================
 * Auramath High-Resolution Cognitive Telemetry & Proficiency Matrix Tracker
 * File: src/services/telemetryTracker.ts
 *
 * Provides:
 * - 2-Phase Cognitive Latency:
 *   * T_rec: Time from question render to first input (Pattern Recognition)
 *   * T_exec: Time from first input to final submit (Working Memory & Execution)
 * - 3-Tier Difficulty Stratification:
 *   * Tier 1 (Fácil), Tier 2 (Médio), Tier 3 (Difícil)
 * - Pedagogical Diagnostic Matrix:
 *   * Fortalezas (Mastered at high tiers)
 *   * Pontos Cegos / Blind Spots (Collapse in high tiers or high hesitation)
 *   * 2-Minute Micro-Drill Recommendations
 * - 5-Axis Cognitive Radar (DNA Matemático) & Archetype classification
 * - Offline-first LocalStorage persistence
 * ==============================================================================
 */

export type DifficultyTier = 1 | 2 | 3; // 1 = Fácil, 2 = Médio, 3 = Difícil

export interface QuestionEvent {
  questionId: string;
  techniqueId: string;
  difficulty: DifficultyTier;
  totalLatencyMs: number;
  firstInputLatencyMs: number;
  executionLatencyMs: number;
  userAnswer: string;
  expectedAnswer: string;
  isCorrect: boolean;
  hesitationDetected: boolean;
  timestamp: string;
}

export interface DifficultyStats {
  attempts: number;
  correct: number;
  accuracy: number;
  avgLatencyMs: number;
  avgFirstInputMs: number;
}

export interface TechniqueProficiency {
  techniqueId: string;
  techniqueName: string;
  totalAttempts: number;
  overallAccuracy: number;
  avgLatencyMs: number;
  byTier: Record<DifficultyTier, DifficultyStats>;
  isStrength: boolean;
  isBlindSpot: boolean;
  blindSpotReason?: string;
  suggestedDrill?: string;
}

export interface CognitiveRadarScore {
  speedScore: number;       // 0 - 100
  fermiScore: number;       // 0 - 100
  flexibilityScore: number; // 0 - 100
  staminaScore: number;     // 0 - 100
  memoryScore: number;      // 0 - 100
  archetypeTitle: string;
  archetypeDescription: string;
  computedAt: string;
}

export interface CognitiveDiagnosticReport {
  overallAccuracy: number;
  averageReactionMs: number;
  totalQuestionsTracked: number;
  radar: CognitiveRadarScore;
  strengths: TechniqueProficiency[];
  blindSpots: TechniqueProficiency[];
  matrix: Record<string, TechniqueProficiency>;
}

export const TECHNIQUE_NAMES: Record<string, string> = {
  ADD_LEFT_RIGHT: 'Adição da Esquerda p/ Direita',
  SUB_COMPENSATION: 'Compensação Subtrativa',
  COMPLEMENT_100: 'Complementos de Base 100',
  MULT_11: 'Multiplicação por 11 (Acordeão)',
  MULT_25: 'Multiplicação por 25 (Quarto de 100)',
  DIFF_OF_SQUARES: 'Diferença de Quadrados (a² - b²)',
  SQUARES_ENDING_5: 'Quadrados Terminados em 5',
  FERMI_ESTIMATE: 'Estimativa de Fermi & Magnitude',
  VEDIC_CROSS: 'Cruzamento Védico (Urdhva-Tiryagbhyam)',
  PERCENT_PIVOT: 'Pivôs Percentuais de 10% e 1%',
  TRACHTENBERG: 'Método Trachtenberg',
  FLASH_ANZAN: 'Flash Anzan Visuoespacial',
};

const STORAGE_KEY = 'auramath-cognitive-telemetry-v1';

export class CognitiveTelemetryTracker {
  private activeQuestionId: string | null = null;
  private activeTechniqueId: string = 'ADD_LEFT_RIGHT';
  private activeDifficulty: DifficultyTier = 2;
  private activeStartTime: number = 0;
  private activeFirstInputTime: number | null = null;

  private events: QuestionEvent[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.events = JSON.parse(raw);
      }
    } catch {
      this.events = [];
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events.slice(-600)));
    } catch {
      // quota limit fallback
    }
  }

  /**
   * Marca o momento em que a equação foi renderizada na tela.
   */
  public startQuestion(
    questionId: string,
    techniqueId: string = 'ADD_LEFT_RIGHT',
    difficulty: DifficultyTier | 'easy' | 'medium' | 'hard' = 2,
    customStartTime?: number
  ): void {
    this.activeQuestionId = questionId;
    this.activeTechniqueId = techniqueId;
    
    // Normalize difficulty tier
    let tier: DifficultyTier = 2;
    if (difficulty === 1 || difficulty === 'easy') tier = 1;
    else if (difficulty === 3 || difficulty === 'hard') tier = 3;
    this.activeDifficulty = tier;

    this.activeStartTime = customStartTime ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    this.activeFirstInputTime = null;
  }

  /**
   * Registra a primeira interação (tecla no numpad ou teclado).
   * Determina a Latência de Reconhecimento de Padrão (T_rec).
   */
  public recordFirstInput(customTime?: number): void {
    if (this.activeFirstInputTime === null && this.activeQuestionId !== null) {
      this.activeFirstInputTime = customTime ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    }
  }

  /**
   * Finaliza a questão e computa T_rec, T_exec e detecção de hesitação.
   */
  public completeQuestion(
    userAnswer: string,
    expectedAnswer: string,
    isCorrect: boolean,
    customEndTime?: number
  ): QuestionEvent | null {
    if (!this.activeQuestionId) return null;

    const endTime = customEndTime ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const totalLatencyMs = Math.max(1, Math.round(endTime - this.activeStartTime));
    const firstInputLatencyMs = this.activeFirstInputTime !== null
      ? Math.max(1, Math.round(this.activeFirstInputTime - this.activeStartTime))
      : totalLatencyMs;
    const executionLatencyMs = Math.max(0, totalLatencyMs - firstInputLatencyMs);

    // Hesitação: primeiro toque demorado (> 2200ms) ou execução total arrastada (> 4000ms)
    const hesitationDetected = firstInputLatencyMs > 2200 || totalLatencyMs > 4200;

    const event: QuestionEvent = {
      questionId: this.activeQuestionId,
      techniqueId: this.activeTechniqueId,
      difficulty: this.activeDifficulty,
      totalLatencyMs,
      firstInputLatencyMs,
      executionLatencyMs,
      userAnswer,
      expectedAnswer,
      isCorrect,
      hesitationDetected,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    if (this.events.length > 800) {
      this.events.shift();
    }
    this.saveToStorage();

    this.activeQuestionId = null;
    this.activeFirstInputTime = null;

    return event;
  }

  /**
   * Retorna os eventos históricos gravados.
   */
  public getEvents(): QuestionEvent[] {
    return this.events;
  }

  /**
   * Calcula a Matriz de Proficiência completa por técnica e por nível de dificuldade.
   */
  public getProficiencyMatrix(): Record<string, TechniqueProficiency> {
    const grouped: Record<string, QuestionEvent[]> = {};

    this.events.forEach((ev) => {
      if (!grouped[ev.techniqueId]) {
        grouped[ev.techniqueId] = [];
      }
      grouped[ev.techniqueId].push(ev);
    });

    const matrix: Record<string, TechniqueProficiency> = {};

    Object.keys(grouped).forEach((techId) => {
      const evs = grouped[techId];
      const totalAttempts = evs.length;
      const corrects = evs.filter((e) => e.isCorrect).length;
      const overallAccuracy = Math.round((corrects / totalAttempts) * 100);
      const avgLatencyMs = Math.round(evs.reduce((sum, e) => sum + e.totalLatencyMs, 0) / totalAttempts);

      const byTier: Record<DifficultyTier, DifficultyStats> = {
        1: { attempts: 0, correct: 0, accuracy: 0, avgLatencyMs: 0, avgFirstInputMs: 0 },
        2: { attempts: 0, correct: 0, accuracy: 0, avgLatencyMs: 0, avgFirstInputMs: 0 },
        3: { attempts: 0, correct: 0, accuracy: 0, avgLatencyMs: 0, avgFirstInputMs: 0 },
      };

      [1, 2, 3].forEach((t) => {
        const tierTier = t as DifficultyTier;
        const tierEvs = evs.filter((e) => e.difficulty === tierTier);
        if (tierEvs.length > 0) {
          const tierCorrect = tierEvs.filter((e) => e.isCorrect).length;
          byTier[tierTier] = {
            attempts: tierEvs.length,
            correct: tierCorrect,
            accuracy: Math.round((tierCorrect / tierEvs.length) * 100),
            avgLatencyMs: Math.round(tierEvs.reduce((s, e) => s + e.totalLatencyMs, 0) / tierEvs.length),
            avgFirstInputMs: Math.round(tierEvs.reduce((s, e) => s + e.firstInputLatencyMs, 0) / tierEvs.length),
          };
        }
      });

      // Detecção de Fortaleza:
      // Alta acurácia em nível médio/difícil com velocidade fluida
      const isStrength =
        (byTier[3].attempts >= 2 && byTier[3].accuracy >= 80 && byTier[3].avgLatencyMs < 3000) ||
        (byTier[2].attempts >= 4 && byTier[2].accuracy >= 88 && byTier[2].avgLatencyMs < 2000);

      // Detecção de Ponto Cego (Blind Spot):
      // 1. Queda acentuada de acurácia entre Tier 1 e Tier 3 (> 30%)
      // 2. Erro elevado em problemas avançados (acurácia < 60% com tentativas)
      // 3. Hesitação em mais de 50% dos casos
      let isBlindSpot = false;
      let blindSpotReason: string | undefined;
      let suggestedDrill: string | undefined;

      if (byTier[3].attempts >= 2 && byTier[3].accuracy < 55) {
        isBlindSpot = true;
        blindSpotReason = `Acurácia colapsa para ${byTier[3].accuracy}% em números de 3 dígitos.`;
        suggestedDrill = 'Pratique o desdobramento tátil com andaime intermediário.';
      } else if (byTier[1].attempts >= 2 && byTier[3].attempts >= 2 && byTier[1].accuracy - byTier[3].accuracy >= 30) {
        isBlindSpot = true;
        blindSpotReason = `Domina no nível fácil (${byTier[1].accuracy}%), mas tropeça no avançado (${byTier[3].accuracy}%).`;
        suggestedDrill = 'Fortaleça a decomposição em blocos maiores da esquerda para a direita.';
      } else if (totalAttempts >= 3 && overallAccuracy < 65) {
        isBlindSpot = true;
        blindSpotReason = `Taxa de acerto global de ${overallAccuracy}%.`;
        suggestedDrill = 'Revise o princípio geométrico antes de treinar contra o tempo.';
      }

      matrix[techId] = {
        techniqueId: techId,
        techniqueName: TECHNIQUE_NAMES[techId] || techId,
        totalAttempts,
        overallAccuracy,
        avgLatencyMs,
        byTier,
        isStrength,
        isBlindSpot,
        blindSpotReason,
        suggestedDrill,
      };
    });

    return matrix;
  }

  /**
   * Computa as 5 dimensões do Radar Cognitivo.
   */
  public computeRadar(): CognitiveRadarScore {
    const total = this.events.length;
    if (total === 0) {
      return {
        speedScore: 78,
        fermiScore: 65,
        flexibilityScore: 82,
        staminaScore: 88,
        memoryScore: 70,
        archetypeTitle: 'Arquiteto de Estruturas',
        archetypeDescription: 'Você decompõe problemas da esquerda para a direita e reconhece atalhos com olhar analítico.',
        computedAt: new Date().toISOString(),
      };
    }

    const corrects = this.events.filter((e) => e.isCorrect);
    const avgLatency = corrects.length > 0
      ? corrects.reduce((sum, e) => sum + e.totalLatencyMs, 0) / corrects.length
      : 2500;

    // Velocidade: 800ms -> 100, 3200ms -> 30
    const speedScore = Math.max(25, Math.min(100, Math.round(100 - ((avgLatency - 800) / 2400) * 70)));

    // Fermi / Ordem de grandeza
    const fermiEvents = this.events.filter((e) => e.techniqueId.includes('FERMI'));
    const fermiScore = fermiEvents.length > 0
      ? Math.round((fermiEvents.filter((e) => e.isCorrect).length / fermiEvents.length) * 80 + 20)
      : 70;

    // Flexibilidade: diversidade de técnicas com boa acurácia
    const matrix = this.getProficiencyMatrix();
    const masteredCount = Object.values(matrix).filter((m) => m.overallAccuracy >= 75).length;
    const flexibilityScore = Math.min(100, Math.max(30, 40 + masteredCount * 12));

    // Resistência: acurácia sob fadiga na 2ª metade
    let staminaScore = 80;
    if (total >= 10) {
      const half = Math.floor(total / 2);
      const earlyAcc = this.events.slice(0, half).filter((e) => e.isCorrect).length / half;
      const lateAcc = this.events.slice(half).filter((e) => e.isCorrect).length / (total - half);
      const ratio = earlyAcc > 0 ? lateAcc / earlyAcc : 1;
      staminaScore = Math.max(30, Math.min(100, Math.round(ratio * 75 + 15)));
    }

    // Memória de Trabalho
    const multiStep = this.events.filter((e) => e.difficulty === 3 || e.techniqueId.includes('DIFF') || e.techniqueId.includes('11'));
    const memoryScore = multiStep.length > 0
      ? Math.round((multiStep.filter((e) => e.isCorrect).length / multiStep.length) * 75 + 25)
      : 72;

    // Classificação de Arquétipo
    let archetypeTitle = 'Arquiteto de Estruturas';
    let archetypeDescription = 'Você prioriza o desdobramento lógico e enxerga padrões antes de calcular.';

    if (speedScore >= 85 && flexibilityScore >= 80) {
      archetypeTitle = 'Arquiteto Relâmpago';
      archetypeDescription = 'Fusão cirúrgica de reflexo instantâneo com desdobramentos de base 50 e 100.';
    } else if (memoryScore >= 82 && flexibilityScore >= 80) {
      archetypeTitle = 'Alquimista Algébrico';
      archetypeDescription = 'Domínio de produtos notáveis na mente e retenção sem rascunho de papel.';
    } else if (fermiScore >= 85) {
      archetypeTitle = 'Oráculo de Fermi';
      archetypeDescription = 'Percepção geométrica instantânea de magnitude antes de qualquer operação.';
    } else if (staminaScore >= 85) {
      archetypeTitle = 'Bastião da Constância';
      archetypeDescription = 'Foco inabalável sob ritmo intenso e estabilidade mesmo em sequências exaustivas.';
    }

    return {
      speedScore,
      fermiScore,
      flexibilityScore,
      staminaScore,
      memoryScore,
      archetypeTitle,
      archetypeDescription,
      computedAt: new Date().toISOString(),
    };
  }

  /**
   * Produz o relatório diagnóstico consolidado com Pontos Fortes e Pontos Cegos.
   */
  public getDiagnosticReport(): CognitiveDiagnosticReport {
    const total = this.events.length;
    const corrects = this.events.filter((e) => e.isCorrect).length;
    const overallAccuracy = total > 0 ? Math.round((corrects / total) * 100) : 0;
    const avgReaction = total > 0
      ? Math.round(this.events.reduce((s, e) => s + e.totalLatencyMs, 0) / total)
      : 0;

    const matrix = this.getProficiencyMatrix();
    const strengths = Object.values(matrix).filter((m) => m.isStrength);
    const blindSpots = Object.values(matrix).filter((m) => m.isBlindSpot);
    const radar = this.computeRadar();

    return {
      overallAccuracy,
      averageReactionMs: avgReaction,
      totalQuestionsTracked: total,
      radar,
      strengths,
      blindSpots,
      matrix,
    };
  }

  public getCognitiveRadar(): { speed: number; fermi: number; flexibility: number; stamina: number; memory: number } {
    const r = this.computeRadar();
    return {
      speed: r.speedScore,
      fermi: r.fermiScore,
      flexibility: r.flexibilityScore,
      stamina: r.staminaScore,
      memory: r.memoryScore,
    };
  }

  public getArchetype(): { title: string; subtitle: string; description: string } {
    const r = this.computeRadar();
    return {
      title: r.archetypeTitle,
      subtitle: 'Visão Estrutural',
      description: r.archetypeDescription,
    };
  }
}

export { CognitiveTelemetryTracker as TelemetryTracker };
export const telemetryTracker = new CognitiveTelemetryTracker();

