/**
 * @auramath/engine - Primitivas de Lição Interativas & Maestria Lendária
 * Frente B: Tap-to-Split, Match Madness & Nós Lendários Dourados
 */

// ==========================================
// 1. AVALIAÇÃO DE DESAFIO LENDÁRIO
// ==========================================

export interface LegendaryChallengeResult {
  passed: boolean;
  accuracyPct: number;
  correctCount: number;
  totalQuestions: number;
  minRequired: number;
  xpReward: number;
  feedbackMessage: string;
}

/**
 * Avalia o resultado de um Desafio Lendário.
 * Limiar normativo: acurácia >= 87.5% (ex: 7 de 8 questões corretas).
 */
export function evaluateLegendaryChallenge(
  totalQuestions: number = 8,
  correctCount: number
): LegendaryChallengeResult {
  const minRequired = Math.ceil(totalQuestions * 0.875); // 7 para 8 questões
  const accuracyPct = Math.round((correctCount / totalQuestions) * 100);
  const passed = correctCount >= minRequired;

  const feedbackMessage = passed
    ? 'MAESTRIA LENDÁRIA CONSAGRADA! Você enxergou todas as estruturas sem hesitação.'
    : `Quase lá! Para a coroa lendária são necessários ${minRequired} acertos de ${totalQuestions}. Revise e tente novamente!`;

  return {
    passed,
    accuracyPct,
    correctCount,
    totalQuestions,
    minRequired,
    xpReward: passed ? 50 : 10,
    feedbackMessage,
  };
}

// ==========================================
// 2. MATCH MADNESS - GERADOR DE PARES
// ==========================================

export interface MatchPairItem {
  id: string;
  pairId: string;
  label: string;
  side: 'left' | 'right';
  value: number;
}

export interface MatchPairDefinition {
  id: string;
  leftLabel: string;
  rightLabel: string;
  targetRelation: string; // ex: 'Soma 100', 'Produto', 'Quadrado'
}

/**
 * Gera pares complementares para Match Madness (base 100 ou 1000).
 */
export function generateComplementaryPairs(
  base: 100 | 1000 = 100,
  count: number = 10
): MatchPairDefinition[] {
  const pairs: MatchPairDefinition[] = [];
  const used = new Set<number>();

  let attempts = 0;
  while (pairs.length < count && attempts < 200) {
    attempts++;
    let a: number;
    if (base === 100) {
      // Evitar múltiplos redondos triviais tipo 50 ou 0
      a = Math.floor(Math.random() * 78) + 11; // 11 a 88
      if (a === 50) continue;
    } else {
      // Base 1000: números entre 110 e 890
      a = Math.floor(Math.random() * 780) + 110;
      if (a === 500) continue;
    }

    if (used.has(a) || used.has(base - a)) continue;
    used.add(a);
    used.add(base - a);

    const b = base - a;
    pairs.push({
      id: `pair_${base}_${a}_${b}`,
      leftLabel: String(a),
      rightLabel: String(b),
      targetRelation: `Soma ${base}`,
    });
  }

  // Fallback determinístico caso o PRNG esgote
  if (pairs.length < count) {
    const fallbacks = base === 100
      ? [[37, 63], [44, 56], [18, 82], [29, 71], [65, 35], [76, 24], [83, 17], [92, 8], [53, 47], [14, 86]]
      : [[280, 720], [450, 550], [130, 870], [340, 660], [620, 380], [710, 290], [150, 850], [480, 520]];
    
    for (const [fa, fb] of fallbacks) {
      if (pairs.length >= count) break;
      if (!used.has(fa)) {
        pairs.push({
          id: `pair_${base}_${fa}_${fb}`,
          leftLabel: String(fa),
          rightLabel: String(fb),
          targetRelation: `Soma ${base}`,
        });
        used.add(fa);
      }
    }
  }

  return pairs;
}

/**
 * Gera pares de equivalências algébricas e mentais (ex: 15 x 12 <-> 180).
 */
export function generateAlgebraicPairs(count: number = 8): MatchPairDefinition[] {
  const pool: MatchPairDefinition[] = [
    { id: 'alg_1', leftLabel: '15 × 12', rightLabel: '180', targetRelation: 'Distributiva' },
    { id: 'alg_2', leftLabel: '35²', rightLabel: '1225', targetRelation: 'Termina em 5' },
    { id: 'alg_3', leftLabel: '48 × 52', rightLabel: '2496', targetRelation: 'Dif. de Quadrados' },
    { id: 'alg_4', leftLabel: '99 × 7', rightLabel: '693', targetRelation: 'Fator 99' },
    { id: 'alg_5', leftLabel: '36 × 5', rightLabel: '180', targetRelation: 'Metade × 10' },
    { id: 'alg_6', leftLabel: '43 × 11', rightLabel: '473', targetRelation: 'Acordeão 11' },
    { id: 'alg_7', leftLabel: '684 ÷ 4', rightLabel: '171', targetRelation: 'Bisseção Dupla' },
    { id: 'alg_8', leftLabel: '75²', rightLabel: '5625', targetRelation: 'Termina em 5' },
    { id: 'alg_9', leftLabel: '100 - 37', rightLabel: '63', targetRelation: 'Complemento 100' },
    { id: 'alg_10', leftLabel: '14 × 20', rightLabel: '280', targetRelation: 'Fator Decimal' },
    { id: 'alg_11', leftLabel: '47²', rightLabel: '2209', targetRelation: 'Pivô 50' },
    { id: 'alg_12', leftLabel: '59 × 61', rightLabel: '3599', targetRelation: 'Dif. de Quadrados' },
  ];

  // Embaralhar seleção
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ==========================================
// 3. TAP-TO-SPLIT (DECOMPOSIÇÃO POR TOQUE)
// ==========================================

export interface SplitBlock {
  id: string;
  value: number;
  label: string;
  type: 'original' | 'tens' | 'units' | 'partial_sum' | 'final';
  canSplit: boolean;
  splitInto?: { value: number; label: string; type: 'tens' | 'units' }[];
  isMerged?: boolean;
}

export interface TapToSplitExercise {
  id: string;
  instruction: string;
  targetEquation: string;
  finalAnswer: number;
  initialBlocks: SplitBlock[];
  allowedMerges: {
    blockAValue: number;
    blockBValue: number;
    resultingValue: number;
    resultingLabel: string;
  }[];
}

/**
 * Cria exercícios de Decomposição por Toque (Tap-to-Split).
 */
export function createTapToSplitExercise(
  preset?: '47_plus_38' | '68_plus_27' | '98_times_6' | '76_plus_45'
): TapToSplitExercise {
  const chosen = preset || '47_plus_38';

  switch (chosen) {
    case '68_plus_27':
      return {
        id: 'split_68_27',
        targetEquation: '68 + 27',
        instruction: 'Toque nos números para separá-los em dezenas e unidades, depois combine as partes!',
        finalAnswer: 95,
        initialBlocks: [
          {
            id: 'b1',
            value: 68,
            label: '68',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 60, label: '60', type: 'tens' },
              { value: 8, label: '8', type: 'units' },
            ],
          },
          {
            id: 'b2',
            value: 27,
            label: '27',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 20, label: '20', type: 'tens' },
              { value: 7, label: '7', type: 'units' },
            ],
          },
        ],
        allowedMerges: [
          { blockAValue: 60, blockBValue: 20, resultingValue: 80, resultingLabel: '80' },
          { blockAValue: 8, blockBValue: 7, resultingValue: 15, resultingLabel: '15' },
          { blockAValue: 80, blockBValue: 15, resultingValue: 95, resultingLabel: '95' },
          // Também permite fusão progressiva 68 + 20 = 88, 88 + 7 = 95
          { blockAValue: 68, blockBValue: 20, resultingValue: 88, resultingLabel: '88' },
          { blockAValue: 88, blockBValue: 7, resultingValue: 95, resultingLabel: '95' },
        ],
      };

    case '76_plus_45':
      return {
        id: 'split_76_45',
        targetEquation: '76 + 45',
        instruction: 'Toque nos números para cindi-los e depois funda as dezenas e unidades.',
        finalAnswer: 121,
        initialBlocks: [
          {
            id: 'b1',
            value: 76,
            label: '76',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 70, label: '70', type: 'tens' },
              { value: 6, label: '6', type: 'units' },
            ],
          },
          {
            id: 'b2',
            value: 45,
            label: '45',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 40, label: '40', type: 'tens' },
              { value: 5, label: '5', type: 'units' },
            ],
          },
        ],
        allowedMerges: [
          { blockAValue: 70, blockBValue: 40, resultingValue: 110, resultingLabel: '110' },
          { blockAValue: 6, blockBValue: 5, resultingValue: 11, resultingLabel: '11' },
          { blockAValue: 110, blockBValue: 11, resultingValue: 121, resultingLabel: '121' },
          { blockAValue: 76, blockBValue: 40, resultingValue: 116, resultingLabel: '116' },
          { blockAValue: 116, blockBValue: 5, resultingValue: 121, resultingLabel: '121' },
        ],
      };

    case '98_times_6':
      return {
        id: 'split_98_6',
        targetEquation: '98 × 6',
        instruction: 'Toque no 98 para expandi-lo em (100 - 2) e multiplique distributivamente!',
        finalAnswer: 588,
        initialBlocks: [
          {
            id: 'b1',
            value: 98,
            label: '98',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 100, label: '100', type: 'tens' },
              { value: -2, label: '-2', type: 'units' },
            ],
          },
          {
            id: 'b2',
            value: 6,
            label: '× 6',
            type: 'original',
            canSplit: false,
          },
        ],
        allowedMerges: [
          { blockAValue: 100, blockBValue: 6, resultingValue: 600, resultingLabel: '600' },
          { blockAValue: -2, blockBValue: 6, resultingValue: -12, resultingLabel: '-12' },
          { blockAValue: 600, blockBValue: -12, resultingValue: 588, resultingLabel: '588' },
        ],
      };

    case '47_plus_38':
    default:
      return {
        id: 'split_47_38',
        targetEquation: '47 + 38',
        instruction: 'Toque nos números para quebrá-los em dezenas e unidades, depois some as partes!',
        finalAnswer: 85,
        initialBlocks: [
          {
            id: 'b1',
            value: 47,
            label: '47',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 40, label: '40', type: 'tens' },
              { value: 7, label: '7', type: 'units' },
            ],
          },
          {
            id: 'b2',
            value: 38,
            label: '38',
            type: 'original',
            canSplit: true,
            splitInto: [
              { value: 30, label: '30', type: 'tens' },
              { value: 8, label: '8', type: 'units' },
            ],
          },
        ],
        allowedMerges: [
          { blockAValue: 40, blockBValue: 30, resultingValue: 70, resultingLabel: '70' },
          { blockAValue: 7, blockBValue: 8, resultingValue: 15, resultingLabel: '15' },
          { blockAValue: 70, blockBValue: 15, resultingValue: 85, resultingLabel: '85' },
          { blockAValue: 47, blockBValue: 30, resultingValue: 77, resultingLabel: '77' },
          { blockAValue: 77, blockBValue: 8, resultingValue: 85, resultingLabel: '85' },
        ],
      };
  }
}

/**
 * Valida se dois blocos podem ser fundidos segundo as regras permitidas do exercício.
 */
export function validateBlockMerge(
  exercise: TapToSplitExercise,
  valA: number,
  valB: number
): { canMerge: boolean; resultingValue?: number; resultingLabel?: string } {
  const match = exercise.allowedMerges.find(
    (m) =>
      (m.blockAValue === valA && m.blockBValue === valB) ||
      (m.blockAValue === valB && m.blockBValue === valA)
  );

  if (match) {
    return {
      canMerge: true,
      resultingValue: match.resultingValue,
      resultingLabel: match.resultingLabel,
    };
  }

  return { canMerge: false };
}
