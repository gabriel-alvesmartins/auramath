/**
 * ==============================================================================
 * Auramath Cognitive Latency Tracker & Hesitation Bottleneck Telemetry
 * File: apps/mobile/src/services/telemetry.ts
 *
 * Provides:
 * - High-precision question lifecycle timing (start -> first input -> completion)
 * - Technique-level cognitive latency aggregation (mean, median, standard deviation)
 * - Automatic detection of cognitive hesitation bottlenecks:
 *   * Pattern Recognition Lag (First keystroke delayed)
 *   * Working Memory Overload (Execution phase prolonged)
 *   * Accuracy Deficit (Conceptual error rate > 30%)
 *   * Speed Lag (Accurate but non-automatic, > 2x personal baseline)
 * - 5-Axis Cognitive Radar (DNA Matemático) computation & Archetype classification
 * - Prescriptive 2-minute targeted micro-drill recommendations
 * ==============================================================================
 */

// ==============================================================================
// TYPES & INTERFACES
// ==============================================================================

export type BottleneckSeverity = 'none' | 'mild' | 'moderate' | 'critical';

export type BottleneckType =
  | 'PATTERN_RECOGNITION' // Conceptual block identifying the algebraic shortcut
  | 'WORKING_MEMORY'     // Overload holding intermediate mental products
  | 'ACCURACY_DEFICIT'    // High error rate (> 25-30%)
  | 'SPEED_LAG';          // High accuracy but excessive deliberation (> 2x baseline)

export interface QuestionEvent {
  questionId: string;
  techniqueId: string;
  gradeLevel: number;
  totalLatencyMs: number;
  firstInputLatencyMs: number;
  executionLatencyMs: number;
  userAnswer: string;
  expectedAnswer: string;
  isCorrect: boolean;
  hesitationDetected: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TechniqueTelemetrySummary {
  techniqueId: string;
  techniqueName: string;
  gradeLevel: number;
  totalAttempts: number;
  correctCount: number;
  accuracyPercentage: number;
  avgLatencyMs: number;
  medianLatencyMs: number;
  fastestLatencyMs: number;
  slowestLatencyMs: number;
  stdDevMs: number;
  hesitationRate: number; // 0.0 to 1.0
  isBottleneck: boolean;
  bottleneckSeverity: BottleneckSeverity;
  bottleneckType?: BottleneckType;
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
  baselineLatencyMs: number;
  computedAt: string;
}

export interface CognitiveDiagnosticReport {
  overallAccuracy: number;
  averageReactionMs: number;
  baselineReactionMs: number;
  totalQuestionsTracked: number;
  masteredTechniques: string[];
  bottlenecks: TechniqueTelemetrySummary[];
  radar: CognitiveRadarScore;
  recommendedFocus: {
    techniqueId: string;
    reason: string;
    prescribedDrillMinutes: number;
  } | null;
}

// Friendly names dictionary for technique identifiers
export const TECHNIQUE_DISPLAY_NAMES: Record<string, string> = {
  ADD_LEFT_TO_RIGHT: 'Adição da Esquerda para a Direita',
  SUB_LEFT_TO_RIGHT: 'Subtração Posicional Direta',
  ADD_COMPENSATION: 'Compensação Aditiva',
  SUB_COMPENSATION: 'Compensação Subtrativa',
  COMPLEMENT_BASE_10: 'Complemento de Base 10ⁿ',
  MULT_5: 'Multiplicação por 5 (Metade de 10)',
  MULT_25: 'Multiplicação por 25 (Quarto de 100)',
  MULT_50: 'Multiplicação por 50',
  MULT_125: 'Multiplicação por 125 (Oitavo de 1000)',
  MULT_11_ACCORDION: 'Multiplicação por 11 (Acordeão)',
  MULT_15: 'Multiplicação por 15 (Base + Metade)',
  MULT_99: 'Multiplicação por 99 (×100 - Base)',
  HALVING_AND_DOUBLING: 'Dimediação e Dobro',
  SQUARES_ENDING_5: 'Quadrados Terminados em 5',
  MODULAR_BASE_50: 'Produtos Próximos a 50',
  MODULAR_BASE_100: 'Produtos Próximos a 100',
  DIFF_OF_SQUARES: 'Diferença de Quadrados (a² - b²)',
  FERMI_ORDER_OF_MAGNITUDE: 'Ordens de Grandeza (Fermi)',
  RATIO_APPROXIMATION: 'Aproximação de Razões',
  PERCENTAGE_BENCHMARKS: 'Marcos Percentuais Rápidos',
  RAPID_ROUNDING: 'Arredondamento Dinâmico',
  VEDIC_URDHVA_TIRYAGBHYAM: 'Sutra Védico Urdhva-Tiryagbhyam',
  TRACHTENBERG_MULT_6: 'Trachtenberg: Multiplicação por 6',
  TRACHTENBERG_MULT_7: 'Trachtenberg: Multiplicação por 7',
  TRACHTENBERG_MULT_12: 'Trachtenberg: Multiplicação por 12',
  FLASH_ANZAN_SUM: 'Flash Anzan Visuoespacial',
  CASTING_OUT_NINES: 'Prova dos Noves Modular',
  CASTING_OUT_ELEVENS: 'Prova dos Onzes Modular',
  TRANSCENDENT_MIX: 'Mix Transcendental de Alta Pressão',
};

// ==============================================================================
// COGNITIVE LATENCY TRACKER IMPLEMENTATION
// ==============================================================================

export class CognitiveLatencyTracker {
  // Current in-flight question state
  private activeQuestionId: string | null = null;
  private activeTechniqueId: string = 'UNKNOWN';
  private activeGradeLevel: number = 1;
  private activeStartTime: number = 0;
  private activeFirstInputTime: number | null = null;
  private activeMetadata: Record<string, any> = {};

  // Historical event telemetry
  private eventHistory: QuestionEvent[] = [];

  // Running aggregates by techniqueId
  private techniqueStatsMap: Map<string, { latencies: number[]; firstInputLatencies: number[]; executionLatencies: number[]; corrects: boolean[] }> =
    new Map();

  /**
   * Begins tracking a new presented question.
   * Call this the exact millisecond the question is rendered on screen.
   */
  public startQuestion(
    questionId: string,
    techniqueId: string,
    gradeLevel: number = 1,
    metadata: Record<string, any> = {}
  ): void {
    this.activeQuestionId = questionId;
    this.activeTechniqueId = techniqueId;
    this.activeGradeLevel = gradeLevel;
    this.activeStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.activeFirstInputTime = null;
    this.activeMetadata = metadata;
  }

  /**
   * Records user's first interaction with keyboard/keypad.
   * Critical for measuring Pattern Recognition Latency.
   */
  public recordFirstInput(): void {
    if (this.activeFirstInputTime === null && this.activeQuestionId !== null) {
      this.activeFirstInputTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    }
  }

  /**
   * Completes tracking for the active question.
   * Calculates latencies, detects cognitive hesitation, updates running distributions.
   */
  public completeQuestion(
    userAnswer: string,
    expectedAnswer: string,
    isCorrect: boolean
  ): QuestionEvent | null {
    if (!this.activeQuestionId) return null;

    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const totalLatencyMs = Math.max(1, Math.round(endTime - this.activeStartTime));
    const firstInputLatencyMs = this.activeFirstInputTime
      ? Math.max(1, Math.round(this.activeFirstInputTime - this.activeStartTime))
      : totalLatencyMs;
    const executionLatencyMs = Math.max(0, totalLatencyMs - firstInputLatencyMs);

    // Compute dynamic personal hesitation threshold
    const baseline = this.calculatePersonalBaseline();
    const hesitationThreshold = Math.max(2400, baseline * 1.85);
    const hesitationDetected = totalLatencyMs > hesitationThreshold || firstInputLatencyMs > 2200;

    const event: QuestionEvent = {
      questionId: this.activeQuestionId,
      techniqueId: this.activeTechniqueId,
      gradeLevel: this.activeGradeLevel,
      totalLatencyMs,
      firstInputLatencyMs,
      executionLatencyMs,
      userAnswer,
      expectedAnswer,
      isCorrect,
      hesitationDetected,
      timestamp: new Date().toISOString(),
      metadata: this.activeMetadata,
    };

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > 500) {
      this.eventHistory.shift(); // Keep rolling window
    }

    // Update technique stats
    let stat = this.techniqueStatsMap.get(this.activeTechniqueId);
    if (!stat) {
      stat = { latencies: [], firstInputLatencies: [], executionLatencies: [], corrects: [] };
      this.techniqueStatsMap.set(this.activeTechniqueId, stat);
    }
    stat.latencies.push(totalLatencyMs);
    stat.firstInputLatencies.push(firstInputLatencyMs);
    stat.executionLatencies.push(executionLatencyMs);
    stat.corrects.push(isCorrect);

    // Reset active question
    this.activeQuestionId = null;
    this.activeFirstInputTime = null;

    return event;
  }

  /**
   * Calculates the user's personal fluent baseline reaction time in ms.
   * Evaluates the 25th percentile of correct answers across all completed questions.
   */
  public calculatePersonalBaseline(): number {
    const correctLatencies = this.eventHistory
      .filter((e) => e.isCorrect)
      .map((e) => e.totalLatencyMs)
      .sort((a, b) => a - b);

    if (correctLatencies.length === 0) return 1400; // Default baseline ~1.4s

    const p25Index = Math.floor(correctLatencies.length * 0.25);
    return Math.max(500, correctLatencies[p25Index]);
  }

  /**
   * Aggregates telemetry stats for a single technique.
   */
  public getTechniqueSummary(techniqueId: string): TechniqueTelemetrySummary | null {
    const stat = this.techniqueStatsMap.get(techniqueId);
    if (!stat || stat.latencies.length === 0) return null;

    const n = stat.latencies.length;
    const correctCount = stat.corrects.filter(Boolean).length;
    const accuracyPercentage = Math.round((correctCount / n) * 100);

    const sorted = [...stat.latencies].sort((a, b) => a - b);
    const avgLatencyMs = Math.round(stat.latencies.reduce((sum, val) => sum + val, 0) / n);
    const medianLatencyMs = sorted[Math.floor(n / 2)];
    const fastestLatencyMs = sorted[0];
    const slowestLatencyMs = sorted[n - 1];

    // Standard deviation
    const variance = stat.latencies.reduce((acc, val) => acc + Math.pow(val - avgLatencyMs, 2), 0) / n;
    const stdDevMs = Math.round(Math.sqrt(variance));

    // Baseline & hesitation rate
    const baseline = this.calculatePersonalBaseline();
    const hesitationThreshold = Math.max(2400, baseline * 1.85);
    const hesitationCount = stat.latencies.filter((l) => l > hesitationThreshold).length;
    const hesitationRate = Number((hesitationCount / n).toFixed(2));

    // Avg sub-phase timings
    const avgFirstInput = stat.firstInputLatencies.reduce((a, b) => a + b, 0) / n;
    const avgExecution = stat.executionLatencies.reduce((a, b) => a + b, 0) / n;

    // Bottleneck diagnosis
    let isBottleneck = false;
    let severity: BottleneckSeverity = 'none';
    let type: BottleneckType | undefined;
    let suggestedDrill: string | undefined;

    if (n >= 3) {
      if (accuracyPercentage < 65) {
        isBottleneck = true;
        severity = 'critical';
        type = 'ACCURACY_DEFICIT';
        suggestedDrill = `Taxa de erro de ${100 - accuracyPercentage}%. Revise o card de andaime cognitivo antes de cronometrar.`;
      } else if (avgFirstInput > 2400) {
        isBottleneck = true;
        severity = 'moderate';
        type = 'PATTERN_RECOGNITION';
        suggestedDrill = 'Hesitação na identificação do atalho. Treine o reconhecimento do padrão em 2 minutos.';
      } else if (avgExecution > 2600) {
        isBottleneck = true;
        severity = 'moderate';
        type = 'WORKING_MEMORY';
        suggestedDrill = 'Sobrecarga de memória na decomposição intermediária. Foque em passos menores da esquerda para a direita.';
      } else if (avgLatencyMs > baseline * 2.2 && accuracyPercentage >= 80) {
        isBottleneck = true;
        severity = 'mild';
        type = 'SPEED_LAG';
        suggestedDrill = 'Cálculo correto porém deliberado. Execute uma bateria de fixação rápida para automatizar a técnica.';
      }
    }

    const techName = TECHNIQUE_DISPLAY_NAMES[techniqueId] || techniqueId;

    return {
      techniqueId,
      techniqueName: techName,
      gradeLevel: this.getGradeForTechnique(techniqueId),
      totalAttempts: n,
      correctCount,
      accuracyPercentage,
      avgLatencyMs,
      medianLatencyMs,
      fastestLatencyMs,
      slowestLatencyMs,
      stdDevMs,
      hesitationRate,
      isBottleneck,
      bottleneckSeverity: severity,
      bottleneckType: type,
      suggestedDrill,
    };
  }

  /**
   * Returns all techniques diagnosed as bottlenecks, sorted by severity.
   */
  public detectBottlenecks(): TechniqueTelemetrySummary[] {
    const bottlenecks: TechniqueTelemetrySummary[] = [];

    for (const techId of this.techniqueStatsMap.keys()) {
      const summary = this.getTechniqueSummary(techId);
      if (summary && summary.isBottleneck) {
        bottlenecks.push(summary);
      }
    }

    // Sort by severity (critical first, then moderate, then mild)
    const severityWeight: Record<BottleneckSeverity, number> = {
      critical: 3,
      moderate: 2,
      mild: 1,
      none: 0,
    };

    return bottlenecks.sort((a, b) => severityWeight[b.bottleneckSeverity] - severityWeight[a.bottleneckSeverity]);
  }

  /**
   * Computes the 5-Axis Cognitive Radar (DNA Matemático):
   * 1. Speed Score: Based on latency under 1500ms
   * 2. Fermi Score: Accuracy & speed on Fermi estimation
   * 3. Flexibility Score: Diversity of mastered techniques
   * 4. Stamina Score: Endurance across long streaks
   * 5. Memory Score: Multi-step decomposition retention & Flash Anzan
   */
  public computeCognitiveRadar(): CognitiveRadarScore {
    const totalEvents = this.eventHistory.length;
    const baseline = this.calculatePersonalBaseline();

    if (totalEvents === 0) {
      return {
        speedScore: 50,
        fermiScore: 50,
        flexibilityScore: 50,
        staminaScore: 50,
        memoryScore: 50,
        archetypeTitle: 'Centelha Emergente',
        archetypeDescription: 'Sua assinatura cognitiva está em formação. Complete 20 questões para revelar seu DNA Matemático.',
        baselineLatencyMs: baseline,
        computedAt: new Date().toISOString(),
      };
    }

    // 1. Speed Score: Map baseline 600ms -> 100, 3000ms -> 20
    const speedScore = Math.max(10, Math.min(100, Math.round(100 - ((baseline - 600) / 2400) * 80)));

    // 2. Fermi Score: Performance on Fermi/estimation techniques
    const fermiEvents = this.eventHistory.filter((e) => e.techniqueId.startsWith('FERMI') || e.techniqueId.includes('APPROX'));
    let fermiScore = 65;
    if (fermiEvents.length >= 3) {
      const fermiAcc = fermiEvents.filter((e) => e.isCorrect).length / fermiEvents.length;
      fermiScore = Math.round(fermiAcc * 80 + 20);
    }

    // 3. Flexibility Score: Breadth of techniques tried with >= 75% accuracy
    const masteredTechs = Array.from(this.techniqueStatsMap.keys()).filter((techId) => {
      const s = this.getTechniqueSummary(techId);
      return s && s.totalAttempts >= 3 && s.accuracyPercentage >= 75;
    });
    const flexibilityScore = Math.min(100, Math.max(20, Math.round(masteredTechs.length * 12 + 25)));

    // 4. Stamina Score: Accuracy retention on second half of long batteries
    let staminaScore = 70;
    if (totalEvents >= 16) {
      const half = Math.floor(totalEvents / 2);
      const earlyAcc = this.eventHistory.slice(0, half).filter((e) => e.isCorrect).length / half;
      const lateAcc = this.eventHistory.slice(half).filter((e) => e.isCorrect).length / (totalEvents - half);
      const retentionRatio = earlyAcc > 0 ? lateAcc / earlyAcc : 1.0;
      staminaScore = Math.max(20, Math.min(100, Math.round(retentionRatio * 75 + 15)));
    }

    // 5. Memory Score: Performance on multi-step techniques & Flash Anzan
    const memoryEvents = this.eventHistory.filter(
      (e) => e.techniqueId.includes('ACCORDION') || e.techniqueId.includes('DIFF_OF_SQUARES') || e.techniqueId.includes('FLASH_ANZAN')
    );
    let memoryScore = 65;
    if (memoryEvents.length >= 3) {
      const memAcc = memoryEvents.filter((e) => e.isCorrect).length / memoryEvents.length;
      memoryScore = Math.round(memAcc * 85 + 15);
    }

    // Classify Archetype
    const { title, description } = this.classifyArchetype(
      speedScore,
      fermiScore,
      flexibilityScore,
      staminaScore,
      memoryScore
    );

    return {
      speedScore,
      fermiScore,
      flexibilityScore,
      staminaScore,
      memoryScore,
      archetypeTitle: title,
      archetypeDescription: description,
      baselineLatencyMs: baseline,
      computedAt: new Date().toISOString(),
    };
  }

  /**
   * Classifies user into an iconic intellectual persona based on radar dimensional dominance.
   */
  private classifyArchetype(
    speed: number,
    fermi: number,
    flexibility: number,
    stamina: number,
    memory: number
  ): { title: string; description: string } {
    if (speed >= 80 && flexibility >= 75) {
      return {
        title: 'Arquiteto Relâmpago',
        description: 'Combina velocidade motora reflexa com rápida transição entre atalhos de decomposição posicional.',
      };
    }
    if (flexibility >= 80 && memory >= 75) {
      return {
        title: 'Alquimista Algébrico',
        description: 'Mestre em identidades estruturais e transformações simétricas de produtos notáveis na mente.',
      };
    }
    if (fermi >= 80 && speed >= 70) {
      return {
        title: 'Oráculo de Fermi',
        description: 'Discriminação instantânea de magnitude dimensional e aproximação rápida com intuição de ordem.',
      };
    }
    if (stamina >= 80 && speed >= 70) {
      return {
        title: 'Bastião Implacável',
        description: 'Foco inabalável sob pressão contínua, mantendo alta acurácia mesmo em sequências de combo exaustivas.',
      };
    }
    if (memory >= 85) {
      return {
        title: 'Sábio Visuoespacial',
        description: 'Capacidade extraordinária de retenção de múltiplos termos acumulados sem subvocalização.',
      };
    }
    return {
      title: 'Calculista Harmônico',
      description: 'Perfil cognitivo equilibrado em transição fluida pelos 6 Graus de maestria do Auramath.',
    };
  }

  /**
   * Generates a comprehensive analytical diagnostic report.
   */
  public generateDiagnosticReport(): CognitiveDiagnosticReport {
    const totalQuestions = this.eventHistory.length;
    const correctCount = this.eventHistory.filter((e) => e.isCorrect).length;
    const overallAccuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const avgReaction =
      totalQuestions > 0
        ? Math.round(this.eventHistory.reduce((sum, e) => sum + e.totalLatencyMs, 0) / totalQuestions)
        : 0;

    const bottlenecks = this.detectBottlenecks();
    const radar = this.computeCognitiveRadar();

    const masteredTechniques: string[] = [];
    for (const techId of this.techniqueStatsMap.keys()) {
      const s = this.getTechniqueSummary(techId);
      if (s && s.totalAttempts >= 5 && s.accuracyPercentage >= 85 && s.avgLatencyMs < 2000) {
        masteredTechniques.push(techId);
      }
    }

    let recommendedFocus: CognitiveDiagnosticReport['recommendedFocus'] = null;
    if (bottlenecks.length > 0) {
      const worst = bottlenecks[0];
      recommendedFocus = {
        techniqueId: worst.techniqueId,
        reason: worst.suggestedDrill || 'Identificado como o maior gargalo cognitivo atual.',
        prescribedDrillMinutes: 2,
      };
    }

    return {
      overallAccuracy,
      averageReactionMs: avgReaction,
      baselineReactionMs: radar.baselineLatencyMs,
      totalQuestionsTracked: totalQuestions,
      masteredTechniques,
      bottlenecks,
      radar,
      recommendedFocus,
    };
  }

  private getGradeForTechnique(techniqueId: string): number {
    if (techniqueId.startsWith('ADD_') || techniqueId.startsWith('SUB_') || techniqueId.includes('COMPLEMENT')) return 1;
    if (techniqueId.startsWith('MULT_') || techniqueId.includes('HALVING')) return 2;
    if (techniqueId.includes('SQUARES') || techniqueId.includes('MODULAR_BASE')) return 3;
    if (techniqueId.includes('FERMI') || techniqueId.includes('APPROX') || techniqueId.includes('ROUNDING')) return 4;
    if (techniqueId.includes('VEDIC') || techniqueId.includes('TRACHTENBERG')) return 5;
    return 6;
  }

  /**
   * Resets all internal tracking states (e.g. at the start of a fresh session or test).
   */
  public reset(): void {
    this.activeQuestionId = null;
    this.activeFirstInputTime = null;
    this.eventHistory = [];
    this.techniqueStatsMap.clear();
  }
}

// Global Singleton Instance
export const cognitiveTelemetry: CognitiveLatencyTracker = new CognitiveLatencyTracker();
