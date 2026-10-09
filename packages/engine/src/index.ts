/**
 * @auramath/engine - Core mental math and game mechanics
 */

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TheoryStep {
  title: string;
  formula: string;
  explanation: string;
  example: string;
  visualBreakdown: {
    from: string;
    steps: string[];
    to: string;
  };
}

export interface ScaffoldingTask {
  equation: string;
  instruction: string;
  template: string; // e.g. "48 x 52 = (50 - {a})(50 + {b}) = 2500 - {c} = {answer}"
  blanks: {
    key: string;
    label: string;
    expected: string;
  }[];
}

export interface TrackNodeData {
  id: string;
  title: string;
  subtitle: string;
  grade: GradeLevel;
  technique: string;
  prerequisites: string[];
  stars: number; // 0 to 3
  isLocked: boolean;
  order: number;
  theory: TheoryStep;
  scaffolding: ScaffoldingTask[];
  sampleEquation: string;
}

export interface GradeData {
  grade: GradeLevel;
  title: string;
  subtitle: string;
  description: string;
  masteryChallengeId: string;
  bossId?: string;
  nodes: TrackNodeData[];
}

export interface MasteryChallengeData {
  id: string;
  grade: GradeLevel;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string;
  questionsCount: number;
  targetTechniques: string[];
  badgeId: string;
  rewardBadgeTitle: string;
  xpReward: number;
  avatarColor: string;
}

export type DifficultyTier = 'easy' | 'medium' | 'hard' | 1 | 2 | 3;

export interface MasteryBadgeData {
  id: string;
  name: string;
  title: string;
  description: string;
  grade: GradeLevel;
  unlocked: boolean;
  unlockedAt?: string;
  accentColor: string;
  previewColor?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Cosmic';
}

export interface CognitiveRadar {
  speedScore: number; // 0 - 100
  fermiScore: number;
  flexibilityScore: number;
  staminaScore: number;
  memoryScore: number;
  archetypeTitle: string;
  archetypeDescription: string;
}

export interface Question {
  id: string;
  equation: string;
  prompt?: string;
  answer: number;
  options?: number[]; // For Fermi / multiple choice
  technique?: string;
  hint?: string;
  explanation?: string;
  unit?: number;
  moduleId?: string;
  moduleTitle?: string;
}

export interface PatternOption {
  id: string;
  label: string;
  isOptimal: boolean;
  explanation: string;
}

export interface PatternRecognitionQuestion {
  id: string;
  equation: string;
  technique: string;
  prompt: string;
  options: PatternOption[];
  calculatedAnswer: number;
}


export interface TeacherClassroom {
  id: string;
  name: string;
  inviteCode: string;
  studentCount: number;
  averageAccuracy: number;
  averageSpeedMs: number;
  blindSpots: {
    technique: string;
    errorRate: number; // 0 to 100
    averageLatencyMs: number;
  }[];
}

export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  targetTechniques: string[];
  requiredQuestions: number;
  dueDate: string;
  completionRate: number;
}

export interface GameResult {
  mode: string;
  score: number;
  accuracy: number;
  questionsAnswered: number;
  correctCount: number;
  avgSpeedMs: number;
  maxStreak: number;
  xpEarned: number;
  recordBroken: boolean;
  mistakes?: {
    equation: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

// ==========================================
// MOCK DATA & CURRICULUM DEFINITIONS
// ==========================================

export const TRACK_GRADES: GradeData[] = [
  {
    grade: 1,
    title: 'Grau I: Fluxo Esquerda-Direita',
    subtitle: 'Magnitude & Decomposição Posicional',
    description: 'Elimine a lentidão do "vai-um" tradicional somando e subtraindo ordens maiores primeiro.',
    masteryChallengeId: 'MASTERY_GRADE_1',
    bossId: 'BOSS_GRADE_1',
    nodes: [
      {
        id: 'ADD_LEFT_RIGHT',
        title: 'Adição da Esquerda p/ Direita',
        subtitle: 'Some as dezenas antes das unidades',
        grade: 1,
        technique: 'Positional Fusion',
        prerequisites: [],
        stars: 3,
        isLocked: false,
        order: 1,
        sampleEquation: '68 + 27 = 95',
        theory: {
          title: 'Fusão de Mercúrio',
          formula: '(a + b) = (a + 10x) + y',
          explanation: 'Ao somar 68 + 27, separe mentalmente o 27 em 20 + 7. Primeiro some 68 + 20 = 88. Depois incorpore o 7: 88 + 7 = 95. Sem carregar dígitos!',
          example: '68 + 27 -> 68 + 20 = 88 -> 88 + 7 = 95',
          visualBreakdown: {
            from: '68 + 27',
            steps: ['68 + 20 = 88', '88 + 7 = 95'],
            to: '95',
          },
        },
        scaffolding: [
          {
            equation: '54 + 38',
            instruction: 'Some as dezenas primeiro, depois as unidades:',
            template: '54 + 38 = 54 + {tens} = {partial} + 8 = {answer}',
            blanks: [
              { key: 'tens', label: 'Dezenas (30)', expected: '30' },
              { key: 'partial', label: '54 + 30', expected: '84' },
              { key: 'answer', label: '84 + 8', expected: '92' },
            ],
          },
          {
            equation: '76 + 45',
            instruction: 'Decomponha 45 em 40 + 5:',
            template: '76 + 45 = 76 + {tens} = {partial} + 5 = {answer}',
            blanks: [
              { key: 'tens', label: '40', expected: '40' },
              { key: 'partial', label: '76 + 40', expected: '116' },
              { key: 'answer', label: '116 + 5', expected: '121' },
            ],
          },
        ],
      },
      {
        id: 'SUB_COMPENSATION',
        title: 'Compensação Subtrativa',
        subtitle: 'Subtraia números redondos e devolva a folga',
        grade: 1,
        technique: 'Additive Offset',
        prerequisites: ['ADD_LEFT_RIGHT'],
        stars: 2,
        isLocked: false,
        order: 2,
        sampleEquation: '134 - 78 = 56',
        theory: {
          title: 'Ajuste de Pivô Redondo',
          formula: 'x - (p - d) = (x - p) + d',
          explanation: 'Subtrair 78 é difícil. Mas subtrair 80 é trivial! Faça 134 - 80 = 54. Como você tirou 2 a mais, devolva 2: 54 + 2 = 56.',
          example: '134 - 78 -> 134 - 80 = 54 -> 54 + 2 = 56',
          visualBreakdown: {
            from: '134 - 78',
            steps: ['134 - 80 = 54', '54 + 2 = 56'],
            to: '56',
          },
        },
        scaffolding: [
          {
            equation: '152 - 89',
            instruction: 'Subtraia 90 e some 1:',
            template: '152 - 89 = 152 - {round} = {partial} + 1 = {answer}',
            blanks: [
              { key: 'round', label: '90', expected: '90' },
              { key: 'partial', label: '152 - 90', expected: '62' },
              { key: 'answer', label: '62 + 1', expected: '63' },
            ],
          },
        ],
      },
      {
        id: 'COMPLEMENT_100',
        title: 'Complemento de Base 100',
        subtitle: 'Tudo de 9 e o último de 10',
        grade: 1,
        technique: 'Vedic Sutra',
        prerequisites: ['SUB_COMPENSATION'],
        stars: 1,
        isLocked: false,
        order: 3,
        sampleEquation: '100 - 37 = 63',
        theory: {
          title: 'Nikhilam Sutra',
          formula: '100 - ab = (9 - a)(10 - b)',
          explanation: 'Para achar o complemento de 37 até 100: subtraia o 3 de 9 (fica 6) e o 7 de 10 (fica 3). Resultado: 63 instantaneamente.',
          example: '100 - 37 -> 9 - 3 = 6 e 10 - 7 = 3 -> 63',
          visualBreakdown: {
            from: '100 - 37',
            steps: ['9 - 3 = 6', '10 - 7 = 3'],
            to: '63',
          },
        },
        scaffolding: [
          {
            equation: '100 - 64',
            instruction: 'Subtraia 6 de 9 e 4 de 10:',
            template: '9 - 6 = {first}, 10 - 4 = {second} -> {answer}',
            blanks: [
              { key: 'first', label: 'Primeiro dígito', expected: '3' },
              { key: 'second', label: 'Segundo dígito', expected: '6' },
              { key: 'answer', label: 'Total', expected: '36' },
            ],
          },
        ],
      },
      {
        id: 'DIV_4',
        title: 'Bisseção Dupla (÷ 4)',
        subtitle: 'Corte pela metade duas vezes consecutivas',
        grade: 1,
        technique: 'Double Halving',
        prerequisites: ['ADD_LEFT_RIGHT'],
        stars: 0,
        isLocked: false,
        order: 4,
        sampleEquation: '684 ÷ 4 = 171',
        theory: {
          title: 'O Corte Binário',
          formula: 'n / 4 = (n / 2) / 2',
          explanation: 'Dividir por 4 no papel exige armar chave. Mentalmente, apenas corte pela metade duas vezes seguidas! Metade de 684 é 342; metade de 342 é 171.',
          example: '684 ÷ 4 -> 684 / 2 = 342 -> 342 / 2 = 171',
          visualBreakdown: {
            from: '684 ÷ 4',
            steps: ['684 ÷ 2 = 342', '342 ÷ 2 = 171'],
            to: '171',
          },
        },
        scaffolding: [
          {
            equation: '528 ÷ 4',
            instruction: 'Corte 528 pela metade duas vezes:',
            template: '528 ÷ 2 = {half} -> {half} ÷ 2 = {answer}',
            blanks: [
              { key: 'half', label: 'Primeira metade (264)', expected: '264' },
              { key: 'answer', label: 'Segunda metade (132)', expected: '132' },
            ],
          },
        ],
      },
      {
        id: 'MULT_9_99',
        title: 'Multiplicação por 9',
        subtitle: 'Dez vezes menos o próprio número',
        grade: 1,
        technique: 'Complementary Nine',
        prerequisites: ['SUB_COMPENSATION'],
        stars: 0,
        isLocked: false,
        order: 5,
        sampleEquation: '47 × 9 = 423',
        theory: {
          title: 'A Alavanca Decimal',
          formula: 'n × 9 = 10n - n',
          explanation: '9 é quase 10! Para 47 × 9, faça 47 × 10 = 470. Depois subtraia 47: 470 - 47 = 423. Uma simples subtração em vez de tabuada complexa.',
          example: '47 × 9 -> 470 - 47 = 423',
          visualBreakdown: {
            from: '47 × 9',
            steps: ['47 × 10 = 470', '470 - 47 = 423'],
            to: '423',
          },
        },
        scaffolding: [
          {
            equation: '36 × 9',
            instruction: 'Multiplique por 10 e subtraia 36:',
            template: '36 × 10 = {ten} -> {ten} - 36 = {answer}',
            blanks: [
              { key: 'ten', label: '36 × 10', expected: '360' },
              { key: 'answer', label: '360 - 36', expected: '324' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 2,
    title: 'Grau II: Fatores Notáveis',
    subtitle: 'Divisores Decimais & Dimediação',
    description: 'Aproveite potências de 10: multiplique por 5 dividindo por 2, por 25 dividindo por 4.',
    masteryChallengeId: 'MASTERY_GRADE_2',
    bossId: 'BOSS_GRADE_2',
    nodes: [
      {
        id: 'MULT_5_50',
        title: 'Multiplicação por 5 e 50',
        subtitle: 'Metade vezes 10 ou 100',
        grade: 2,
        technique: 'Decimal Factor',
        prerequisites: ['COMPLEMENT_100'],
        stars: 0,
        isLocked: false,
        order: 6,
        sampleEquation: '48 x 5 = 240',
        theory: {
          title: 'Dimediação por 5',
          formula: 'n x 5 = (n / 2) x 10',
          explanation: 'Multiplicar por 5 é o mesmo que pegar a metade do número e adicionar um zero. Metade de 48 é 24. Com um zero: 240!',
          example: '48 x 5 -> 48 / 2 = 24 -> 24 x 10 = 240',
          visualBreakdown: {
            from: '48 x 5',
            steps: ['48 / 2 = 24', '24 x 10 = 240'],
            to: '240',
          },
        },
        scaffolding: [
          {
            equation: '86 x 5',
            instruction: 'Calcule a metade de 86 e multiplique por 10:',
            template: '86 / 2 = {half} -> {half} x 10 = {answer}',
            blanks: [
              { key: 'half', label: 'Metade de 86', expected: '43' },
              { key: 'answer', label: '43 x 10', expected: '430' },
            ],
          },
        ],
      },
      {
        id: 'DIV_5',
        title: 'Divisão Rápida por 5',
        subtitle: 'Dobre o valor e divida por 10',
        grade: 2,
        technique: 'Decimal Duplation',
        prerequisites: ['MULT_5_50'],
        stars: 0,
        isLocked: true,
        order: 7,
        sampleEquation: '240 ÷ 5 = 48',
        theory: {
          title: 'Inversão Decimal',
          formula: 'n / 5 = (2n) / 10',
          explanation: 'Dividir por 5 é difícil, mas dobrar é imediato! Dobre 240 para 480. Em seguida divida por 10 cortando o zero: 48!',
          example: '240 ÷ 5 -> 240 × 2 = 480 -> 480 / 10 = 48',
          visualBreakdown: {
            from: '240 ÷ 5',
            steps: ['240 × 2 = 480', '480 ÷ 10 = 48'],
            to: '48',
          },
        },
        scaffolding: [
          {
            equation: '340 ÷ 5',
            instruction: 'Dobre 340 e corte o zero final:',
            template: '340 × 2 = {double} -> {double} ÷ 10 = {answer}',
            blanks: [
              { key: 'double', label: 'Dobro de 340', expected: '680' },
              { key: 'answer', label: '680 ÷ 10', expected: '68' },
            ],
          },
        ],
      },
      {
        id: 'MULT_25',
        title: 'Multiplicação por 25',
        subtitle: 'Divida por 4 e adicione dois zeros',
        grade: 2,
        technique: 'Quarter Factor',
        prerequisites: ['DIV_5'],
        stars: 0,
        isLocked: true,
        order: 8,
        sampleEquation: '36 x 25 = 900',
        theory: {
          title: 'O Quarto do Cento',
          formula: 'n x 25 = (n / 4) x 100',
          explanation: 'Como 25 é 100 / 4, basta dividir por 2 duas vezes e acrescentar dois zeros.',
          example: '36 x 25 -> 36 / 4 = 9 -> 900',
          visualBreakdown: {
            from: '36 x 25',
            steps: ['36 / 4 = 9', '9 x 100 = 900'],
            to: '900',
          },
        },
        scaffolding: [
          {
            equation: '64 x 25',
            instruction: 'Divida 64 por 4 e multiplique por 100:',
            template: '64 / 4 = {quarter} -> {quarter} x 100 = {answer}',
            blanks: [
              { key: 'quarter', label: '64 / 4', expected: '16' },
              { key: 'answer', label: '16 x 100', expected: '1600' },
            ],
          },
        ],
      },
      {
        id: 'DIV_25',
        title: 'Divisão Rápida por 25',
        subtitle: 'Quadruplique e divida por 100',
        grade: 2,
        technique: 'Quarter Centum',
        prerequisites: ['MULT_25'],
        stars: 0,
        isLocked: true,
        order: 9,
        sampleEquation: '450 ÷ 25 = 18',
        theory: {
          title: 'Quadruplicação de Centena',
          formula: 'n / 25 = (4n) / 100',
          explanation: 'Como 25 é 100 / 4, quadruplique o número (dobre duas vezes) e ande duas casas decimais para trás.',
          example: '450 ÷ 25 -> 450 × 4 = 1800 -> 1800 / 100 = 18',
          visualBreakdown: {
            from: '450 ÷ 25',
            steps: ['450 × 2 = 900', '900 × 2 = 1800', '1800 ÷ 100 = 18'],
            to: '18',
          },
        },
        scaffolding: [
          {
            equation: '350 ÷ 25',
            instruction: 'Multiplique por 4 e divida por 100:',
            template: '350 × 4 = {quad} -> {quad} ÷ 100 = {answer}',
            blanks: [
              { key: 'quad', label: '350 × 4', expected: '1400' },
              { key: 'answer', label: '1400 ÷ 100', expected: '14' },
            ],
          },
        ],
      },
      {
        id: 'MULT_11',
        title: 'Multiplicação por 11',
        subtitle: 'O acordeão elástico: abra os lados e some o meio',
        grade: 2,
        technique: 'Elastic Accordion',
        prerequisites: ['DIV_25'],
        stars: 0,
        isLocked: true,
        order: 10,
        sampleEquation: '43 x 11 = 473',
        theory: {
          title: 'Acordeão Central',
          formula: 'ab x 11 = a _ (a + b) _ b',
          explanation: 'Afaste o 4 e o 3. Some 4 + 3 = 7. Insira no meio: 473!',
          example: '43 x 11 -> 4 _ (4 + 3) _ 3 = 473',
          visualBreakdown: {
            from: '43 x 11',
            steps: ['4 _ 3', '4 + 3 = 7', '4 7 3'],
            to: '473',
          },
        },
        scaffolding: [
          {
            equation: '52 x 11',
            instruction: 'Afaste os extremos e insira a soma:',
            template: '5 _ 2 com {sum} no meio -> {answer}',
            blanks: [
              { key: 'sum', label: '5 + 2', expected: '7' },
              { key: 'answer', label: 'Resultado', expected: '572' },
            ],
          },
        ],
      },
      {
        id: 'MULT_TEENS_11_19',
        title: 'Multiplicação de 11 a 19',
        subtitle: 'Sutra dos Teens: cruze a unidade e multiplique o final',
        grade: 2,
        technique: 'Cross-Addition Teens',
        prerequisites: ['MULT_11'],
        stars: 0,
        isLocked: true,
        order: 11,
        sampleEquation: '14 × 18 = 252',
        theory: {
          title: 'Sutra dos Teens',
          formula: '(10 + a)(10 + b) = 10(10 + a + b) + ab',
          explanation: 'Para 14 × 18: pegue 14 e adicione a unidade do outro (8) = 22. Multiplique por 10 = 220. Some o produto das unidades (4 × 8 = 32). Total: 220 + 32 = 252!',
          example: '14 × 18 -> (14 + 8) = 22 -> 220 + (4 × 8) = 220 + 32 = 252',
          visualBreakdown: {
            from: '14 × 18',
            steps: ['14 + 8 = 22', '22 × 10 = 220', '4 × 8 = 32', '220 + 32 = 252'],
            to: '252',
          },
        },
        scaffolding: [
          {
            equation: '13 × 17',
            instruction: 'Some a unidade do segundo ao primeiro e multiplique as unidades:',
            template: '(13 + 7) = {cross} -> {cross} × 10 = {base} + (3 × 7 = {units}) -> {answer}',
            blanks: [
              { key: 'cross', label: '13 + 7', expected: '20' },
              { key: 'base', label: '20 × 10', expected: '200' },
              { key: 'units', label: '3 × 7', expected: '21' },
              { key: 'answer', label: 'Total', expected: '221' },
            ],
          },
        ],
      },
      {
        id: 'MULT_ENDS_IN_1',
        title: 'Multiplicação com Finais em 1',
        subtitle: 'Produto de dezenas + soma de dezenas + 1',
        grade: 2,
        technique: 'Unitary One Expansion',
        prerequisites: ['MULT_TEENS_11_19'],
        stars: 0,
        isLocked: true,
        order: 12,
        sampleEquation: '41 × 71 = 2911',
        theory: {
          title: 'A Decomposição Unitária',
          formula: '(10a + 1)(10b + 1) = 100ab + 10(a + b) + 1',
          explanation: 'Para 41 × 71: multiplique as dezenas (40 × 70 = 2800). Some as dezenas (40 + 70 = 110). Some 1. Total: 2800 + 110 + 1 = 2911!',
          example: '41 × 71 -> 2800 + 110 + 1 = 2911',
          visualBreakdown: {
            from: '41 × 71',
            steps: ['40 × 70 = 2800', '40 + 70 = 110', '2800 + 110 + 1 = 2911'],
            to: '2911',
          },
        },
        scaffolding: [
          {
            equation: '31 × 51',
            instruction: 'Multiplique as dezenas, some as dezenas e adicione 1:',
            template: '30 × 50 = {tensProd} | 30 + 50 = {tensSum} -> {tensProd} + {tensSum} + 1 = {answer}',
            blanks: [
              { key: 'tensProd', label: '30 × 50', expected: '1500' },
              { key: 'tensSum', label: '30 + 50', expected: '80' },
              { key: 'answer', label: 'Total', expected: '1581' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 3,
    title: 'Grau III: Geometria & Produtos Notáveis',
    subtitle: 'Álgebra Espacial & Diferença de Quadrados',
    description: 'Resolva multiplicações complexas encontrando eixos de simetria e áreas geométricas.',
    masteryChallengeId: 'MASTERY_GRADE_3',
    bossId: 'BOSS_GRADE_3',
    nodes: [
      {
        id: 'DIFF_OF_SQUARES',
        title: 'Diferença de Quadrados',
        subtitle: 'Resolva (m - d)(m + d) = m^2 - d^2',
        grade: 3,
        technique: 'Symmetric Mirror',
        prerequisites: [],
        stars: 0,
        isLocked: true,
        order: 11,
        sampleEquation: '48 x 52 = 2496',
        theory: {
          title: 'Espelho Simétrico',
          formula: '(m - d)(m + d) = m^2 - d^2',
          explanation: '48 e 52 estão a 2 de distância do pivô 50. Faça 50^2 - 2^2 = 2500 - 4 = 2496!',
          example: '48 x 52 -> (50 - 2)(50 + 2) = 2500 - 4 = 2496',
          visualBreakdown: {
            from: '48 x 52',
            steps: ['Pivô 50, desvio 2', '50^2 = 2500', '2500 - 4 = 2496'],
            to: '2496',
          },
        },
        scaffolding: [
          {
            equation: '59 x 61',
            instruction: 'Pivô 60 com desvio 1:',
            template: '(60 - 1)(60 + 1) = {square} - 1 = {answer}',
            blanks: [
              { key: 'square', label: '60^2', expected: '3600' },
              { key: 'answer', label: '3600 - 1', expected: '3599' },
            ],
          },
        ],
      },
      {
        id: 'SQUARES_ENDING_5',
        title: 'Quadrados Terminados em 5',
        subtitle: 'Multiplique o prefixo pelo seu sucessor e termine em 25',
        grade: 3,
        technique: 'Ekadhikena',
        prerequisites: ['DIFF_OF_SQUARES'],
        stars: 0,
        isLocked: true,
        order: 12,
        sampleEquation: '75^2 = 5625',
        theory: {
          title: 'Sucessor Posicional',
          formula: '(10a + 5)^2 = 100 * a(a + 1) + 25',
          explanation: 'Para 75^2: Pegue a dezena 7. Multiplique pelo sucessor 8 (7 x 8 = 56). Anexe 25 ao final: 5625!',
          example: '75^2 -> 7 x 8 = 56 -> 5625',
          visualBreakdown: {
            from: '75^2',
            steps: ['7 x (7 + 1) = 56', 'Anexa 25'],
            to: '5625',
          },
        },
        scaffolding: [
          {
            equation: '65^2',
            instruction: 'Multiplique 6 por 7 e termine com 25:',
            template: '6 x 7 = {prefix} -> {answer}',
            blanks: [
              { key: 'prefix', label: '6 x 7', expected: '42' },
              { key: 'answer', label: '42 anexado a 25', expected: '4225' },
            ],
          },
        ],
      },
      {
        id: 'ANTYAYOREVA',
        title: 'Sutra Antyayoreva',
        subtitle: 'Dezenas iguais e unidades que somam 10',
        grade: 3,
        technique: 'Antyayoreva',
        prerequisites: ['SQUARES_ENDING_5'],
        stars: 0,
        isLocked: true,
        order: 13,
        sampleEquation: '43 × 47 = 2021',
        theory: {
          title: 'Simetria dos Extremos',
          formula: '(10a + b)(10a + c) = 100a(a + 1) + bc',
          explanation: 'Se as dezenas são iguais e as unidades somam 10: multiplique a dezena pelo sucessor 4 × 5 = 20. Multiplique as unidades 3 × 7 = 21. Junte os dois: 2021!',
          example: '43 × 47 -> 4 × 5 = 20 | 3 × 7 = 21 -> 2021',
          visualBreakdown: {
            from: '43 × 47',
            steps: ['4 × (4 + 1) = 20', '3 × 7 = 21', 'Anexa 20 e 21'],
            to: '2021',
          },
        },
        scaffolding: [
          {
            equation: '64 × 66',
            instruction: 'Dezenas iguais a 6 e unidades 4 + 6 = 10:',
            template: '6 × 7 = {lead} | 4 × 6 = {tail} -> {answer}',
            blanks: [
              { key: 'lead', label: '6 × 7', expected: '42' },
              { key: 'tail', label: '4 × 6', expected: '24' },
              { key: 'answer', label: 'Total', expected: '4224' },
            ],
          },
        ],
      },
      {
        id: 'SQUARES_NEAR_50',
        title: 'Quadrados no Pivô 50',
        subtitle: 'O atalho do 25 para números entre 40 e 60',
        grade: 3,
        technique: 'Pivot 25',
        prerequisites: ['ANTYAYOREVA'],
        stars: 0,
        isLocked: true,
        order: 14,
        sampleEquation: '47² = 2209',
        theory: {
          title: 'O Ancoradouro 25',
          formula: '(50 + d)² = 100(25 + d) + d²',
          explanation: 'Para 47²: a distância até 50 é -3. Faça 25 - 3 = 22. Depois eleve o desvio (-3)² = 09. Resultado: 2209 em 1 segundo!',
          example: '47² -> 25 - 3 = 22 | (-3)² = 09 -> 2209',
          visualBreakdown: {
            from: '47²',
            steps: ['Desvio d = -3', '25 + (-3) = 22', '(-3)² = 09'],
            to: '2209',
          },
        },
        scaffolding: [
          {
            equation: '53²',
            instruction: 'Desvio é +3 em relação a 50:',
            template: '25 + 3 = {lead} | 3² = {tail} -> {answer}',
            blanks: [
              { key: 'lead', label: '25 + 3', expected: '28' },
              { key: 'tail', label: '3² (2 dígitos: 09)', expected: '09' },
              { key: 'answer', label: 'Total', expected: '2809' },
            ],
          },
        ],
      },
      {
        id: 'YAVADUNAM_BASE_100',
        title: 'Multiplicação Base 100',
        subtitle: 'Sutra Yavadunam para fatores próximos a 100',
        grade: 3,
        technique: 'Base Deviation',
        prerequisites: ['SQUARES_NEAR_50'],
        stars: 0,
        isLocked: true,
        order: 15,
        sampleEquation: '104 × 107 = 11128',
        theory: {
          title: 'Desvios da Base 100',
          formula: '(100 + a)(100 + b) = 100(100 + a + b) + ab',
          explanation: '104 passa 4 e 107 passa 7. Some o desvio cruzado: 104 + 7 = 111. Multiplique os desvios: 4 × 7 = 28. Junte: 11128!',
          example: '104 × 107 -> 104 + 7 = 111 | 4 × 7 = 28 -> 11128',
          visualBreakdown: {
            from: '104 × 107',
            steps: ['104 + 7 = 111', '4 × 7 = 28', 'Anexa 111 e 28'],
            to: '11128',
          },
        },
        scaffolding: [
          {
            equation: '103 × 106',
            instruction: 'Desvios +3 e +6 da base 100:',
            template: '103 + 6 = {lead} | 3 × 6 = {tail} -> {answer}',
            blanks: [
              { key: 'lead', label: '103 + 6', expected: '109' },
              { key: 'tail', label: '3 × 6', expected: '18' },
              { key: 'answer', label: 'Total', expected: '10918' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 4,
    title: 'Grau IV: Olho de Fermi & Estimativa',
    subtitle: 'Ordens de Grandeza & Discriminação em 3s',
    description: 'Em concursos e na vida real, saber a ordem de grandeza exata vence o cálculo minucioso.',
    masteryChallengeId: 'MASTERY_GRADE_4',
    bossId: 'BOSS_GRADE_4',
    nodes: [
      {
        id: 'FERMI_MAGNITUDE',
        title: 'Estimativa Fermi',
        subtitle: 'Discrimine distratores de ordem de magnitude',
        grade: 4,
        technique: 'Order of Magnitude',
        prerequisites: [],
        stars: 0,
        isLocked: true,
        order: 16,
        sampleEquation: '887 x 412 ≈ 365.000',
        theory: {
          title: 'Arredondamento Fermi',
          formula: 'A x B ≈ (A_red) x (B_red)',
          explanation: '887 x 412: aproxime para 900 x 400 = 360.000. Qualquer alternativa fora dessa faixa é descartada instantaneamente!',
          example: '887 x 412 ≈ 900 x 400 = 360.000',
          visualBreakdown: {
            from: '887 x 412',
            steps: ['900 x 400 = 360.000', 'Opção real: ~365.444'],
            to: '365.444',
          },
        },
        scaffolding: [
          {
            equation: '492 x 198',
            instruction: 'Aproxime para 500 x 200:',
            template: '500 x 200 = {est} -> Resposta aproximada: {answer}',
            blanks: [
              { key: 'est', label: '500 x 200', expected: '100000' },
              { key: 'answer', label: 'Opção correta (~97.416)', expected: '97416' },
            ],
          },
        ],
      },
      {
        id: 'CUBE_ROOT_PERFECT',
        title: 'Raiz Cúbica Instantânea',
        subtitle: 'Bijeção de cubos perfeitos até 1.000.000',
        grade: 4,
        technique: 'Modular Cube Bijection',
        prerequisites: ['FERMI_MAGNITUDE'],
        stars: 0,
        isLocked: true,
        order: 17,
        sampleEquation: '∛175616 = 56',
        theory: {
          title: 'A Singularidade dos Cubos',
          formula: 'c ≡ r³ (mod 10) é bijetivo',
          explanation: 'Cada dígito de 0 a 9 tem terminação cúbica única! 175.616 termina em 6 -> unidade é 6. Descarte 616: resta 175. O maior cubo menor que 175 é 5³ (125). Resposta: 56 em 2 segundos!',
          example: '∛175616 -> termina em 6 (unidade 6), 175 fica entre 5³ e 6³ (dezena 5) -> 56',
          visualBreakdown: {
            from: '∛175616',
            steps: ['Termina em 6 -> unidade = 6', 'Descarta 616 -> resta 175', '5³ = 125 <= 175 < 6³ = 216 -> dezena = 5'],
            to: '56',
          },
        },
        scaffolding: [
          {
            equation: '∛314432',
            instruction: 'Extraia unidade e dezena da raiz cúbica:',
            template: 'Termina em 2 -> unidade {u} | 314 fica entre 6³ e 7³ -> dezena {t} -> {answer}',
            blanks: [
              { key: 'u', label: 'Unidade (8)', expected: '8' },
              { key: 't', label: 'Dezena (6)', expected: '6' },
              { key: 'answer', label: 'Raiz final', expected: '68' },
            ],
          },
        ],
      },
      {
        id: 'RULE_OF_72',
        title: 'A Regra dos 72',
        subtitle: 'Estimativa rápida de dobra em juros compostos',
        grade: 4,
        technique: 'Exponential Doubling',
        prerequisites: ['FERMI_MAGNITUDE'],
        stars: 0,
        isLocked: true,
        order: 18,
        sampleEquation: '72 ÷ 8% = 9 anos',
        theory: {
          title: 'O Atalho Exponencial',
          formula: 't_dobro ≈ 72 / taxa',
          explanation: 'Para saber quando um investimento dobra com juros compostos, divida 72 pela taxa percentual anual. A 8% a.a.: 72 ÷ 8 = 9 anos!',
          example: 'Taxa 12% a.a. -> 72 ÷ 12 = 6 anos para dobrar',
          visualBreakdown: {
            from: 'Dobrar a 12% a.a.',
            steps: ['72 ÷ 12 = 6 anos'],
            to: '6 anos',
          },
        },
        scaffolding: [
          {
            equation: 'Dobrar capital a 6% a.a.',
            instruction: 'Divida 72 pela taxa:',
            template: '72 ÷ 6 = {answer} anos',
            blanks: [
              { key: 'answer', label: 'Anos', expected: '12' },
            ],
          },
        ],
      },
      {
        id: 'MULT_125_750',
        title: 'A Família do Milhar (Fator 125 & 75)',
        subtitle: 'Escala decimal por potências de 2 (÷ 8 e ÷ 4)',
        grade: 4,
        technique: 'Thousand Factor Scaler',
        prerequisites: ['RULE_OF_72'],
        stars: 0,
        isLocked: true,
        order: 19,
        sampleEquation: '48 × 125 = 6.000',
        theory: {
          title: 'O Salto do Milhar',
          formula: 'x × 125 = (x × 1000) ÷ 8 | x × 75 = (x × 300) ÷ 4',
          explanation: '125 é exatamente um oitavo de 1000! Para 48 × 125: divida 48 por 8 = 6. Acrescente três zeros: 6000! Para 75: divida por 4 e multiplique por 300.',
          example: '48 × 125 -> (48 ÷ 8) × 1000 = 6 × 1000 = 6000',
          visualBreakdown: {
            from: '48 × 125',
            steps: ['48 ÷ 8 = 6', '6 × 1000 = 6000'],
            to: '6000',
          },
        },
        scaffolding: [
          {
            equation: '32 × 125',
            instruction: 'Divida por 8 e acrescente três zeros:',
            template: '32 ÷ 8 = {oct} -> {oct} × 1000 = {answer}',
            blanks: [
              { key: 'oct', label: '32 ÷ 8', expected: '4' },
              { key: 'answer', label: 'Total', expected: '4000' },
            ],
          },
        ],
      },
      {
        id: 'DECIMAL_FRAC_CONVERSION',
        title: 'Decimais & Frações Ocultas',
        subtitle: 'Multiplique e divida por 0.5, 0.25 e 0.2 sem medo da vírgula',
        grade: 4,
        technique: 'Unitary Fraction Inversion',
        prerequisites: ['MULT_125_750'],
        stars: 0,
        isLocked: true,
        order: 20,
        sampleEquation: '36 × 0.25 = 9 | 40 ÷ 0.2 = 200',
        theory: {
          title: 'A Fração Invisível',
          formula: 'x × 0.25 = x ÷ 4 | x ÷ 0.2 = x × 5',
          explanation: 'Multiplicar por 0.25 é o mesmo que dividir por 4. Dividir por 0.2 é multiplicar por 5. Números decimais comuns escondem frações simples que eliminam vírgulas!',
          example: '36 × 0.25 = 36 ÷ 4 = 9 | 40 ÷ 0.2 = 40 × 5 = 200',
          visualBreakdown: {
            from: '36 × 0.25',
            steps: ['0.25 = 1/4', '36 ÷ 4 = 9'],
            to: '9',
          },
        },
        scaffolding: [
          {
            equation: '48 × 0.25',
            instruction: 'Transforme o 0.25 em divisão por 4:',
            template: '48 ÷ 4 = {answer}',
            blanks: [
              { key: 'answer', label: '48 ÷ 4', expected: '12' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 5,
    title: 'Grau V: Sistemas Formais Históricos',
    subtitle: 'Védica & Trachtenberg',
    description: 'Algoritmos compactos desenvolvidos para cálculo mental puro de alta densidade.',
    masteryChallengeId: 'MASTERY_GRADE_5',
    bossId: 'BOSS_GRADE_5',
    nodes: [
      {
        id: 'VEDIC_CROSS',
        title: 'Multiplicação Cruzada Védica',
        subtitle: 'Urdhva-Tiryagbhyam: vertical e cruzado',
        grade: 5,
        technique: 'Vedic Cross',
        prerequisites: [],
        stars: 0,
        isLocked: true,
        order: 19,
        sampleEquation: '23 x 41 = 943',
        theory: {
          title: 'Verticais e Diagonais',
          formula: '(10a + b)(10c + d) = 100ac + 10(ad+bc) + bd',
          explanation: 'Multiplique as unidades (3x1=3). Some os cruzados (2x1 + 3x4 = 14, fica 4 e vai 1). Multiplique as dezenas (2x4=8 + 1 = 9). Resultado: 943!',
          example: '23 x 41 -> bd=3, ad+bc=14, ac=8 -> 943',
          visualBreakdown: {
            from: '23 x 41',
            steps: ['3 x 1 = 3', '2x1 + 3x4 = 14', '2x4 + 1 = 9'],
            to: '943',
          },
        },
        scaffolding: [
          {
            equation: '31 x 22',
            instruction: 'Calcule as partes cruzadas:',
            template: 'Unidades: {u}, Cruzado (3x2 + 1x2): {cross}, Dezenas: {d} -> {answer}',
            blanks: [
              { key: 'u', label: '1 x 2', expected: '2' },
              { key: 'cross', label: '6 + 2', expected: '8' },
              { key: 'd', label: '3 x 2', expected: '6' },
              { key: 'answer', label: 'Total', expected: '682' },
            ],
          },
        ],
      },
      {
        id: 'TRACHTENBERG_12',
        title: 'Multiplicação por 12',
        subtitle: 'Algoritmo de Trachtenberg: dobre e adicione o vizinho',
        grade: 5,
        technique: 'Trachtenberg 12',
        prerequisites: ['VEDIC_CROSS'],
        stars: 0,
        isLocked: true,
        order: 20,
        sampleEquation: '314 × 12 = 3768',
        theory: {
          title: 'O Algoritmo do Vizinho',
          formula: 'd_i = 2 × d_i + vizinho_direita',
          explanation: 'Para 314 × 12 da direita p/ esquerda: dobre 4 = 8. Dobre 1 + 4 = 6. Dobre 3 + 1 = 7. Dobre 0 + 3 = 3. Resultado: 3768 sem armar conta!',
          example: '314 × 12 -> 8, 6, 7, 3 -> 3768',
          visualBreakdown: {
            from: '314 × 12',
            steps: ['2 × 4 = 8', '2 × 1 + 4 = 6', '2 × 3 + 1 = 7', '2 × 0 + 3 = 3'],
            to: '3768',
          },
        },
        scaffolding: [
          {
            equation: '231 × 12',
            instruction: 'Dobre cada dígito e adicione o vizinho da direita:',
            template: '2×1 = {u} | 2×3+1 = {t} | 2×2+3 = {h} | 0×2+2 = {th} -> {answer}',
            blanks: [
              { key: 'u', label: 'Unidade (2)', expected: '2' },
              { key: 't', label: 'Dezena (7)', expected: '7' },
              { key: 'h', label: 'Centena (7)', expected: '7' },
              { key: 'th', label: 'Milhar (2)', expected: '2' },
              { key: 'answer', label: 'Total', expected: '2772' },
            ],
          },
        ],
      },
      {
        id: 'SQUARE_ROOT_PERFECT',
        title: 'Raiz Quadrada Instantânea',
        subtitle: 'Bijeção de quadrados perfeitos de até 4 dígitos',
        grade: 5,
        technique: 'Quadratic Pivot Framing',
        prerequisites: ['TRACHTENBERG_12'],
        stars: 0,
        isLocked: true,
        order: 23,
        sampleEquation: '√5184 = 72',
        theory: {
          title: 'O Enquadramento Quadrático',
          formula: 'q ≡ r² (mod 10) & d² ≤ (q/100) < (d+1)²',
          explanation: 'Para √5184: termina em 4, logo a raiz termina em 2 ou 8. 51 fica entre 7² (49) e 8² (64), logo a dezena é 7. Como 75² = 5625 e 5184 < 5625, a raiz é 72!',
          example: '√5184 -> termina em 4 (2 ou 8), 51 entre 49 e 64 (dezena 7). Pivô 75² = 5625 > 5184 -> raiz 72',
          visualBreakdown: {
            from: '√5184',
            steps: ['Final 4 -> terminação 2 ou 8', '51 fica entre 7²=49 e 8²=64 -> dezena 7', '75² = 5625 > 5184 -> 72'],
            to: '72',
          },
        },
        scaffolding: [
          {
            equation: '√3136',
            instruction: 'Descubra a dezena e use o pivô terminado em 5:',
            template: '31 entre 5²=25 e 6²=36 -> dezena {d} | 55² = {piv} > 3136 -> raiz {answer}',
            blanks: [
              { key: 'd', label: 'Dezena (5)', expected: '5' },
              { key: 'piv', label: '55²', expected: '3025' },
              { key: 'answer', label: 'Raiz final', expected: '56' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 6,
    title: 'Grau VI: Transcendência & Flash Anzan',
    subtitle: 'Soroban Mental & Aritmética Modular',
    description: 'Projeção visuoespacial relâmpago sem subvocalização, operando na velocidade do pensamento.',
    masteryChallengeId: 'MASTERY_GRADE_6',
    bossId: 'BOSS_GRADE_6',
    nodes: [
      {
        id: 'FLASH_ANZAN_MASTERY',
        title: 'Soroban Mental Visuoespacial',
        subtitle: 'Projeção de contas a 300ms',
        grade: 6,
        technique: 'Visuospatial Anzan',
        prerequisites: [],
        stars: 0,
        isLocked: true,
        order: 21,
        sampleEquation: '12 + 45 + 78 + 33 = 168',
        theory: {
          title: 'O Soroban Interior',
          formula: 'Sum(t_i) a 300ms',
          explanation: 'Em vez de pronunciar os números na mente, visualize as contas do ábaco movendo-se no espaço perceptual.',
          example: 'Visão relâmpago sequencial de dígitos',
          visualBreakdown: {
            from: 'Foco Mental',
            steps: ['Dígito 1 -> 300ms', 'Dígito 2 -> 300ms', 'Acúmulo perceptual'],
            to: 'Soma Total',
          },
        },
        scaffolding: [
          {
            equation: '15 + 24 + 31',
            instruction: 'Acumule a soma progressiva:',
            template: '15 + 24 = {step1} -> {step1} + 31 = {answer}',
            blanks: [
              { key: 'step1', label: '15 + 24', expected: '39' },
              { key: 'answer', label: '39 + 31', expected: '70' },
            ],
          },
          {
            equation: '22 + 18 + 45',
            instruction: 'Acumule o somatório rápido:',
            template: '22 + 18 = {step1} -> {step1} + 45 = {answer}',
            blanks: [
              { key: 'step1', label: '22 + 18', expected: '40' },
              { key: 'answer', label: '40 + 45', expected: '85' },
            ],
          },
          {
            equation: '34 + 26 + 17',
            instruction: 'Execute o somatório mental contínuo:',
            template: '34 + 26 = {step1} -> {step1} + 17 = {answer}',
            blanks: [
              { key: 'step1', label: '34 + 26', expected: '60' },
              { key: 'answer', label: '60 + 17', expected: '77' },
            ],
          },
        ],
      },
      {
        id: 'DIGITAL_ROOTS_9_11',
        title: 'Prova dos Nove e dos Onze',
        subtitle: 'Verificação Aritmética por Raízes Digitais',
        grade: 6,
        technique: 'Aritmética Modular',
        prerequisites: ['FLASH_ANZAN_MASTERY'],
        stars: 0,
        isLocked: true,
        order: 22,
        sampleEquation: 'Raiz digital (mod 9) de 4.872 = 3',
        theory: {
          title: 'Aritmética Modular dos Restos',
          formula: 'd(n) ≡ n (mod 9) | soma_alt(n) ≡ n (mod 11)',
          explanation: 'A Prova dos Nove descarta múltiplos de 9 somando os algarismos sucessivamente até obter um único dígito (raiz digital). A Prova dos Onze usa a soma alternada dos dígitos da direita para a esquerda.',
          example: '4.872 -> 4+8+7+2 = 21 -> 2+1 = 3 (mod 9)',
          visualBreakdown: {
            from: 'Número 4.872',
            steps: ['Soma dígitos: 4+8+7+2 = 21', 'Redução: 2+1 = 3', 'Resto na divisão por 9'],
            to: 'Raiz Digital 3',
          },
        },
        scaffolding: [
          {
            equation: '5.483 (mod 9)',
            instruction: 'Some os algarismos sucessivamente:',
            template: '5 + 4 + 8 + 3 = {s1} -> Redução: {answer}',
            blanks: [
              { key: 's1', label: '5+4+8+3', expected: '20' },
              { key: 'answer', label: '2+0', expected: '2' },
            ],
          },
          {
            equation: '3.828 (mod 11)',
            instruction: 'Calcule a soma alternada dos dígitos:',
            template: '(8 + 8) - (2 + 3) = 16 - 5 = {answer}',
            blanks: [
              { key: 'answer', label: '16 - 5', expected: '11' },
            ],
          },
          {
            equation: '43 × 21 = 903 (Verificação mod 9)',
            instruction: 'Verifique se Raiz(43) × Raiz(21) coincide com Raiz(903):',
            template: 'Raiz(43)={r1}, Raiz(21)={r2} -> {r1}×{r2}=21->{rProd}. Raiz(903)={answer}',
            blanks: [
              { key: 'r1', label: '4+3', expected: '7' },
              { key: 'r2', label: '2+1', expected: '3' },
              { key: 'rProd', label: '2+1', expected: '3' },
              { key: 'answer', label: '9+0+3=12->3', expected: '3' },
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 7,
    title: 'Grau VII: Porcentagens & Geometria do Cotidiano',
    subtitle: 'Pivôs Decimais, Simetria Mágica & Frações Ocultas',
    description: 'Domine o cálculo mental de porcentagens do mundo real: gorjetas, descontos e o teorema de simetria x% de y = y% de x.',
    masteryChallengeId: 'MASTERY_GRADE_7',
    bossId: 'BOSS_GRADE_7',
    nodes: [
      {
        id: 'PERCENT_PIVOT_10_1',
        title: 'Pivôs de 10% e 1%',
        subtitle: 'Deslocamento decimal para a esquerda em 1 ou 2 casas',
        grade: 7,
        technique: 'Decimal Decimal Shift',
        prerequisites: [],
        stars: 0,
        isLocked: true,
        order: 27,
        sampleEquation: '10% de 340 = 34 | 1% de 1200 = 12',
        theory: {
          title: 'O Deslocamento Decimal',
          formula: '10% de x = x ÷ 10 | 1% de x = x ÷ 100',
          explanation: 'Para calcular 10%, desloque a vírgula 1 casa para a esquerda. Para 1%, desloque 2 casas. Todo cálculo complexo de porcentagem nasce da combinação desses dois blocos!',
          example: '10% de 480 = 48 | 1% de 480 = 4,8',
          visualBreakdown: {
            from: '10% de 480',
            steps: ['480 ÷ 10', 'Desloca 1 casa', '48'],
            to: '48',
          },
        },
        scaffolding: [
          {
            equation: '10% de 560',
            instruction: 'Desloque a vírgula uma casa para a esquerda:',
            template: '560 ÷ 10 = {answer}',
            blanks: [
              { key: 'answer', label: '10%', expected: '56' },
            ],
          },
        ],
      },
      {
        id: 'PERCENT_TIP_15',
        title: 'A Regra dos 15% (Gorjeta)',
        subtitle: 'Composição de 10% + metade (5%) em contas e serviços',
        grade: 7,
        technique: 'Composite Percentage Tip',
        prerequisites: ['PERCENT_PIVOT_10_1'],
        stars: 0,
        isLocked: true,
        order: 28,
        sampleEquation: '15% de 80 = 8 + 4 = 12',
        theory: {
          title: 'A Soma dos 15%',
          formula: '15% de x = (10% de x) + (10% de x ÷ 2)',
          explanation: 'Para 15% de R$ 80: calcule 10% (8). Pegue a metade desse valor (4). Some ambos: 8 + 4 = 12. Instantâneo no restaurante!',
          example: '15% de 80 -> 10% é 8, metade é 4 -> 8 + 4 = 12',
          visualBreakdown: {
            from: '15% de 80',
            steps: ['10% de 80 = 8', '5% de 80 = 4', '8 + 4 = 12'],
            to: '12',
          },
        },
        scaffolding: [
          {
            equation: '15% de 120',
            instruction: 'Calcule 10%, a metade e some:',
            template: '10% = {p10} | Metade = {p5} -> {p10} + {p5} = {answer}',
            blanks: [
              { key: 'p10', label: '10%', expected: '12' },
              { key: 'p5', label: '5%', expected: '6' },
              { key: 'answer', label: 'Total', expected: '18' },
            ],
          },
        ],
      },
      {
        id: 'PERCENT_FRIENDLY_FRACTIONS',
        title: 'Frações Equivalentes (20%, 25%, 50%, 75%)',
        subtitle: 'Troque a porcentagem pela divisão fracionária direta',
        grade: 7,
        technique: 'Unitary Fraction Benchmark',
        prerequisites: ['PERCENT_TIP_15'],
        stars: 0,
        isLocked: true,
        order: 29,
        sampleEquation: '25% de 48 = 48 ÷ 4 = 12',
        theory: {
          title: 'A Fração Por Trás da Porcentagem',
          formula: '20% = ÷ 5 | 25% = ÷ 4 | 50% = ÷ 2 | 75% = × 3 ÷ 4',
          explanation: 'Porcentagens clássicas são apenas frações amigáveis: 20% é dividir por 5; 25% é dividir por 4; 75% é pegar 3 quartos (dividir por 4 e multiplicar por 3).',
          example: '25% de 48 -> 48 ÷ 4 = 12 | 20% de 80 -> 80 ÷ 5 = 16',
          visualBreakdown: {
            from: '25% de 48',
            steps: ['25% = 1/4', '48 ÷ 4 = 12'],
            to: '12',
          },
        },
        scaffolding: [
          {
            equation: '20% de 75',
            instruction: 'Substitua 20% pela divisão por 5:',
            template: '75 ÷ 5 = {answer}',
            blanks: [
              { key: 'answer', label: '20%', expected: '15' },
            ],
          },
        ],
      },
      {
        id: 'PERCENT_SYMMETRY',
        title: 'A Simetria Mágica (x% de y = y% de x)',
        subtitle: 'Inverta a ordem dos fatores para transformar contas impossíveis em triviais',
        grade: 7,
        technique: 'Percentage Commutative Symmetry',
        prerequisites: ['PERCENT_FRIENDLY_FRACTIONS'],
        stars: 0,
        isLocked: true,
        order: 30,
        sampleEquation: '16% de 50 = 50% de 16 = 8',
        theory: {
          title: 'O Teorema da Simetria Percentual',
          formula: 'x% × y = (x × y) ÷ 100 = y% × x',
          explanation: 'Calcular 16% de 50 de cabeça parece trabalhoso. Mas a comutatividade garante que 16% de 50 é idêntico a 50% de 16! E 50% de 16 é apenas a metade de 16: 8!',
          example: '16% de 50 = 50% de 16 = 8 | 4% de 75 = 75% de 4 = 3',
          visualBreakdown: {
            from: '16% de 50',
            steps: ['Inverte: 50% de 16', 'Metade de 16 = 8'],
            to: '8',
          },
        },
        scaffolding: [
          {
            equation: '18% de 50',
            instruction: 'Inverta a porcentagem para 50% de 18:',
            template: '50% de 18 = 18 ÷ 2 = {answer}',
            blanks: [
              { key: 'answer', label: 'Resultado', expected: '9' },
            ],
          },
        ],
      },
      {
        id: 'PERCENT_DISCOUNT_ADD',
        title: 'Acréscimos & Descontos Rápidos',
        subtitle: 'Aplicação mental de descontos comerciais e taxas em uma passada',
        grade: 7,
        technique: 'Mental Markup and Markdown',
        prerequisites: ['PERCENT_SYMMETRY'],
        stars: 0,
        isLocked: true,
        order: 31,
        sampleEquation: '80 com 20% de desconto = 80 - 16 = 64',
        theory: {
          title: 'Descontos & Acréscimos em Tempo Real',
          formula: 'V_final = V ± (V × p%)',
          explanation: 'Para aplicar 20% de desconto em R$ 80: calcule 20% (80 ÷ 5 = 16 ou 8 × 2 = 16) e subtraia: 80 - 16 = 64. Você nunca mais precisará de calculadora no shopping!',
          example: '80 - 20% -> 20% de 80 = 16 -> 80 - 16 = 64',
          visualBreakdown: {
            from: '80 com 20% desconto',
            steps: ['20% de 80 = 16', '80 - 16 = 64'],
            to: '64',
          },
        },
        scaffolding: [
          {
            equation: '120 com 10% de desconto',
            instruction: 'Calcule 10% e deduza do valor total:',
            template: '10% de 120 = {d} -> 120 - {d} = {answer}',
            blanks: [
              { key: 'd', label: '10%', expected: '12' },
              { key: 'answer', label: 'Preço final', expected: '108' },
            ],
          },
        ],
      },
    ],
  },
];

export const MASTERY_CHALLENGES: MasteryChallengeData[] = [
  {
    id: 'MASTERY_GRADE_1',
    grade: 1,
    name: 'Mestre da Decomposição Posicional',
    title: 'Prova de Maestria · Grau I',
    subtitle: 'Fundações Aritméticas e Decomposição',
    description: 'Demonstre fluência posicional e complementos de 100 resolvendo a cadeia estrutural.',
    lore: 'Aplique a decomposição esquerda-direita e o Sutra de Nikhilam (complemento de 100) sem cálculos mecânicos.',
    questionsCount: 5,
    targetTechniques: ['ADD_LEFT_RIGHT', 'SUB_COMPENSATION', 'COMPLEMENT_100'],
    badgeId: 'BADGE_DECOMPOSITION',
    rewardBadgeTitle: 'Selo de Decomposição Posicional',
    xpReward: 250,
    avatarColor: '#176B5B',
  },
  {
    id: 'MASTERY_GRADE_2',
    grade: 2,
    name: 'Mestre dos Fatores Estruturais',
    title: 'Prova de Maestria · Grau II',
    subtitle: 'Agilidade com Fatores Decimais',
    description: 'Aplique propriedades de fatores 5, 25, 11 e diferença de quadrados sem contas armadas.',
    lore: 'Enxergue o vínculo imediato entre multiplicação por 5, 25, 11 e a simetria da diferença de quadrados.',
    questionsCount: 5,
    targetTechniques: ['DIFF_OF_SQUARES', 'MULT_5_50', 'MULT_11', 'MULT_25'],
    badgeId: 'BADGE_FACTORS',
    rewardBadgeTitle: 'Selo de Fatores e Simetria',
    xpReward: 300,
    avatarColor: '#6E5AA6',
  },
  {
    id: 'MASTERY_GRADE_3',
    grade: 3,
    name: 'Mestre da Geometria Mental',
    title: 'Prova de Maestria · Grau III',
    subtitle: 'Álgebra Visual e Produtos Notáveis',
    description: 'Projete as áreas de produtos notáveis e quadrados próximos a 50 instantaneamente.',
    lore: 'Manipule as áreas dimensionais de (a+b)² e a diferença de quadrados com pivô 25 e finais em 5.',
    questionsCount: 5,
    targetTechniques: ['EXPAND_ALGEBRAIC', 'ANTYAYOREVA', 'SQUARES_ENDING_5', 'SQUARES_NEAR_50'],
    badgeId: 'BADGE_GEOMETRY',
    rewardBadgeTitle: 'Selo de Geometria Mental',
    xpReward: 350,
    avatarColor: '#F2B84B',
  },
  {
    id: 'MASTERY_GRADE_4',
    grade: 4,
    name: 'Mestre do Cruzamento Védico',
    title: 'Prova de Maestria · Grau IV',
    subtitle: 'Aritmética e Divisão Acelerada',
    description: 'Execute a multiplicação cruzada 2x2 e divisões aceleradas por 4, 5 e 25.',
    lore: 'Calcule produtos simultâneos com Urdhva-Tiryagbhyam e realize bisseções duplas instantâneas.',
    questionsCount: 5,
    targetTechniques: ['VEDIC_CROSS', 'DIV_5', 'DIV_25', 'DIV_4'],
    badgeId: 'BADGE_VEDIC',
    rewardBadgeTitle: 'Selo do Cruzamento Védico',
    xpReward: 400,
    avatarColor: '#176B5B',
  },
  {
    id: 'MASTERY_GRADE_5',
    grade: 5,
    name: 'Mestre dos Sutras e Trachtenberg',
    title: 'Prova de Maestria · Grau V',
    subtitle: 'Mestria Operacional e Base 100',
    description: 'Multiplique colado à base 100 e decodifique produtos por 12 e 99 em passada única.',
    lore: 'Una a elegância do Sutra Yavadunam para base 100 à regra direta de Trachtenberg para o 12.',
    questionsCount: 5,
    targetTechniques: ['YAVADUNAM_BASE_100', 'TRACHTENBERG_12', 'MULT_9_99'],
    badgeId: 'BADGE_OPERATIONAL',
    rewardBadgeTitle: 'Selo de Mestria Operacional',
    xpReward: 450,
    avatarColor: '#6E5AA6',
  },
  {
    id: 'MASTERY_GRADE_6',
    grade: 6,
    name: 'Mestre da Visão Axiomática',
    title: 'Prova de Maestria · Grau VI',
    subtitle: 'Flash Anzan e Raízes Cúbicas',
    description: 'Decodifique raízes cúbicas perfeitas instantaneamente e calcule ordens de grandeza de Fermi.',
    lore: 'O teste definitivo da intuição matemática: extração de raízes cúbicas e aproximações de Fermi sem palavras na mente.',
    questionsCount: 5,
    targetTechniques: ['FERMI_ESTIMATE', 'CUBE_ROOT_PERFECT', 'RULE_OF_72'],
    badgeId: 'BADGE_AXIOMATIC',
    rewardBadgeTitle: 'Selo da Visão Axiomática',
    xpReward: 500,
    avatarColor: '#E76F61',
  },
  {
    id: 'MASTERY_GRADE_7',
    grade: 7,
    name: 'Mestre das Porcentagens & Cotidiano',
    title: 'Prova de Maestria · Grau VII',
    subtitle: 'Porcentagens, Gorjetas & Simetria Financeira',
    description: 'Calcule gorjetas, pivôs de 10%/1% e inverta operações com a simetria x% de y instantaneamente.',
    lore: 'O domínio do cálculo mental aplicado: converter qualquer porcentagem em fração unitária e decodificar taxas sem esforço.',
    questionsCount: 5,
    targetTechniques: ['PERCENT_PIVOT_10_1', 'PERCENT_TIP_15', 'PERCENT_FRIENDLY_FRACTIONS', 'PERCENT_SYMMETRY', 'PERCENT_DISCOUNT_ADD'],
    badgeId: 'BADGE_PERCENTAGES',
    rewardBadgeTitle: 'Selo de Maestria Financeira',
    xpReward: 550,
    avatarColor: '#176B5B',
  },
];

export const MASTERY_BADGES: MasteryBadgeData[] = [
  {
    id: 'BADGE_DECOMPOSITION',
    name: 'Decomposição Posicional',
    title: 'Selo de Decomposição Posicional',
    description: 'Dominou adição estrutural da esquerda para a direita e complementos de 100.',
    grade: 1,
    unlocked: true,
    unlockedAt: '2026-09-08',
    accentColor: '#176B5B',
    previewColor: '#176B5B',
    rarity: 'Common',
  },
  {
    id: 'BADGE_FACTORS',
    name: 'Fatores & Simetria',
    title: 'Selo de Fatores e Simetria',
    description: 'Dominou atalhos de multiplicação por 11, 25 e diferença simétrica de quadrados.',
    grade: 2,
    unlocked: true,
    unlockedAt: '2026-09-15',
    accentColor: '#6E5AA6',
    previewColor: '#6E5AA6',
    rarity: 'Rare',
  },
  {
    id: 'BADGE_GEOMETRY',
    name: 'Geometria Mental',
    title: 'Selo de Geometria Mental',
    description: 'Dominou desdobramento de produtos notáveis (a+b)² e o pivô 25 próximo de 50.',
    grade: 3,
    unlocked: false,
    accentColor: '#F2B84B',
    previewColor: '#F2B84B',
    rarity: 'Epic',
  },
  {
    id: 'BADGE_VEDIC',
    name: 'Cruzamento Védico',
    title: 'Selo do Cruzamento Védico',
    description: 'Dominou Urdhva-Tiryagbhyam 2x2 e divisões aceleradas por 4, 5 e 25.',
    grade: 4,
    unlocked: false,
    accentColor: '#176B5B',
    previewColor: '#176B5B',
    rarity: 'Legendary',
  },
  {
    id: 'BADGE_OPERATIONAL',
    name: 'Mestria Operacional',
    title: 'Selo de Mestria Operacional',
    description: 'Dominou o método de Trachtenberg e multiplicações de base 100 (Yavadunam).',
    grade: 5,
    unlocked: false,
    accentColor: '#6E5AA6',
    previewColor: '#6E5AA6',
    rarity: 'Cosmic',
  },
  {
    id: 'BADGE_AXIOMATIC',
    name: 'Visão Axiomática',
    title: 'Selo da Visão Axiomática',
    description: 'Alcançou o ápice do cálculo mental puro: raízes cúbicas e Flash Anzan.',
    grade: 6,
    unlocked: false,
    accentColor: '#E76F61',
    previewColor: '#E76F61',
    rarity: 'Cosmic',
  },
  {
    id: 'BADGE_PERCENTAGES',
    name: 'Maestria Financeira',
    title: 'Selo de Maestria Financeira & Porcentagens',
    description: 'Dominou cálculo de gorjetas, pivôs de 10%/1% e o teorema de simetria x% de y = y% de x.',
    grade: 7,
    unlocked: false,
    accentColor: '#176B5B',
    previewColor: '#176B5B',
    rarity: 'Cosmic',
  },
];

export const MOCK_USER_PROFILE = {
  username: 'alexandre.magno',
  displayName: 'Alexandre Magno',
  title: 'Observador de Padrões',
  level: 18,
  currentXp: 8420,
  nextLevelXp: 10000,
  streakDays: 14,
  starsCount: 47,
  totalStars: 120,
  highestBlitzScore: 48,
  elo: 1540,
  radar: {
    speedScore: 92,
    fermiScore: 78,
    flexibilityScore: 88,
    staminaScore: 84,
    memoryScore: 74,
    archetypeTitle: 'Arquiteto de Estruturas',
    archetypeDescription: 'Você domina atalhos algébricos e decompõe problemas com velocidade cirúrgica da esquerda para a direita.',
  } as CognitiveRadar,
};

export const MOCK_CLASSROOMS: TeacherClassroom[] = [
  {
    id: 'CLASS_9A',
    name: '9º Ano A - Matutino',
    inviteCode: 'AURA9A',
    studentCount: 28,
    averageAccuracy: 86.4,
    averageSpeedMs: 1420,
    blindSpots: [
      { technique: 'Diferença de Quadrados', errorRate: 34.2, averageLatencyMs: 2450 },
      { technique: 'Multiplicação por 25', errorRate: 12.5, averageLatencyMs: 1100 },
      { technique: 'Compensação Subtrativa', errorRate: 18.0, averageLatencyMs: 1350 },
      { technique: 'Estimativa de Fermi', errorRate: 29.8, averageLatencyMs: 2100 },
      { technique: 'Multiplicação por 11', errorRate: 8.4, averageLatencyMs: 980 },
    ],
  },
  {
    id: 'CLASS_8B',
    name: '8º Ano B - Vespertino',
    inviteCode: 'MATH8B',
    studentCount: 24,
    averageAccuracy: 79.1,
    averageSpeedMs: 1850,
    blindSpots: [
      { technique: 'Complemento de 100', errorRate: 22.0, averageLatencyMs: 1600 },
      { technique: 'Multiplicação por 5 e 50', errorRate: 15.3, averageLatencyMs: 1250 },
      { technique: 'Diferença de Quadrados', errorRate: 48.6, averageLatencyMs: 3100 },
    ],
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ASSIGN_1',
    classroomId: 'CLASS_9A',
    title: 'Desafio Semanal: Produtos Notáveis',
    targetTechniques: ['DIFF_OF_SQUARES', 'SQUARES_ENDING_5'],
    requiredQuestions: 20,
    dueDate: '14 de Setembro',
    completionRate: 75,
  },
  {
    id: 'ASSIGN_2',
    classroomId: 'CLASS_9A',
    title: 'Treino de Fluência: Fatores 5 e 25',
    targetTechniques: ['MULT_5_50', 'MULT_25'],
    requiredQuestions: 30,
    dueDate: '20 de Setembro',
    completionRate: 42,
  },
];

// ==========================================
// DETERMINISTIC PSEUDORANDOM GENERATOR (Mulberry32)
// ==========================================

export function createSeededRandom(seed: number | string): () => number {
  let s: number;
  if (typeof seed === 'string') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
    }
    s = hash >>> 0;
  } else {
    s = seed >>> 0;
  }
  return function () {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalizeDifficulty(diff?: DifficultyTier): 1 | 2 | 3 {
  if (diff === 'easy' || diff === 1) return 1;
  if (diff === 'hard' || diff === 3) return 3;
  return 2;
}

// ==========================================
// PROCEDURAL GENERATION ENGINES
// ==========================================

export function generateComplement100Question(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  if (diff === 3) {
    const n = Math.floor(Math.random() * 800) + 112;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `1000 - ${n}`,
      answer: 1000 - n,
      technique: 'Complemento de Base 100',
      hint: 'Subtraia os primeiros dígitos de 9 e o último de 10 (Sutra de Nikhilam)',
    };
  }
  const n = diff === 1 ? Math.floor(Math.random() * 50) + 11 : Math.floor(Math.random() * 80) + 12;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `100 - ${n}`,
    answer: 100 - n,
    technique: 'Complemento de Base 100',
    hint: `9 - ${Math.floor(n / 10)} = ${9 - Math.floor(n / 10)} | 10 - ${n % 10} = ${10 - (n % 10)}`,
  };
}

export function generateSquaresEnding5Question(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  const tens = diff === 1 ? Math.floor(Math.random() * 4) + 2 : diff === 2 ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 6) + 6;
  const n = tens * 10 + 5;
  const lead = tens * (tens + 1);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n}²`,
    answer: n * n,
    technique: 'Quadrados com Final 5',
    hint: `${tens} × ${tens + 1} = ${lead} seguido de 25 -> ${lead}25`,
  };
}

export function generateVedicCrossQuestion(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  const a = diff === 1 ? Math.floor(Math.random() * 15) + 11 : diff === 2 ? Math.floor(Math.random() * 25) + 15 : Math.floor(Math.random() * 50) + 25;
  const b = diff === 1 ? Math.floor(Math.random() * 15) + 11 : diff === 2 ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 45) + 20;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b}`,
    answer: a * b,
    technique: 'Multiplicação Cruzada Védica',
    hint: 'Multiplique as unidades, some o produto cruzado das diagonais e multiplique as dezenas',
  };
}

export function generateMult11Question(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  let n: number;
  if (diff === 1) {
    const d1 = Math.floor(Math.random() * 5) + 1;
    const d2 = Math.floor(Math.random() * (9 - d1)) + 1;
    n = d1 * 10 + d2;
  } else if (diff === 2) {
    n = Math.floor(Math.random() * 70) + 25;
  } else {
    n = Math.floor(Math.random() * 800) + 115;
  }
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} × 11`,
    answer: n * 11,
    technique: 'Multiplicação por 11',
    hint: `Afaste ${Math.floor(n / 10)} e ${n % 10}, insira a soma no meio`,
  };
}

export function generateMult25Question(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  const factor = diff === 1 ? Math.floor(Math.random() * 8) + 2 : diff === 2 ? Math.floor(Math.random() * 15) + 6 : Math.floor(Math.random() * 30) + 14;
  const mult = factor * 4;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${mult} × 25`,
    answer: mult * 25,
    technique: 'Fator 25',
    hint: `Divida ${mult} por 4 (= ${mult / 4}) e adicione dois zeros`,
  };
}

export function generateMult5Question(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  const half = diff === 1 ? Math.floor(Math.random() * 15) + 4 : diff === 2 ? Math.floor(Math.random() * 35) + 12 : Math.floor(Math.random() * 80) + 30;
  const n = half * 2;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} × 5`,
    answer: n * 5,
    technique: 'Fator 5',
    hint: `Metade de ${n} é ${n / 2}, vezes 10 = ${n * 5}`,
  };
}

export function generateDiffOfSquaresQuestion(difficulty?: DifficultyTier): Question {
  const diffTier = normalizeDifficulty(difficulty);
  const pivot = diffTier === 1
    ? (Math.floor(Math.random() * 4) + 2) * 10
    : diffTier === 2
    ? (Math.floor(Math.random() * 5) + 4) * 10
    : (Math.floor(Math.random() * 4) + 7) * 10;
  const diff = diffTier === 1 ? Math.floor(Math.random() * 2) + 1 : diffTier === 2 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 5) + 2;
  const a = pivot - diff;
  const b = pivot + diff;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b}`,
    answer: a * b,
    technique: 'Diferença de Quadrados',
    hint: `${pivot}² - ${diff}² = ${pivot * pivot} - ${diff * diff}`,
  };
}

export function generateFermiQuestion(difficulty?: DifficultyTier): Question {
  const diff = normalizeDifficulty(difficulty);
  let a: number;
  let b: number;
  if (diff === 1) {
    a = (Math.floor(Math.random() * 70) + 20) * 10;   // 200..890
    b = Math.floor(Math.random() * 70) + 20;          // 20..89
  } else if (diff === 2) {
    a = Math.floor(Math.random() * 800) + 120;        // 120..919
    b = Math.floor(Math.random() * 80) + 15;          // 15..94
  } else {
    a = (Math.floor(Math.random() * 70) + 12) * 100;  // 1200..8100
    b = (Math.floor(Math.random() * 80) + 15) * 10;   // 150..940
  }

  // Calculate order of magnitude
  const roughProduct = a * b;
  const magnitudePower = Math.floor(Math.log10(roughProduct));
  const base10 = Math.pow(10, magnitudePower);
  const leadingApprox = Math.round(roughProduct / base10) * base10;

  // Distinct order-of-magnitude distractors (powers of 10), never exact arithmetic distractors
  const d1 = Math.round(leadingApprox / 10);
  const d2 = Math.round(leadingApprox * 10);
  const d3 = Math.round(leadingApprox * 100);
  const options = [leadingApprox, d1, d2, d3].sort(() => Math.random() - 0.5);

  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b} ≈ ?`,
    prompt: `Qual é a ordem de grandeza aproximada de ${a} × ${b}?`,
    answer: leadingApprox,
    options,
    technique: 'Olho de Fermi',
    hint: `Aproxime ${a} e ${b} para ordens de 10: aprox. ${leadingApprox.toLocaleString('pt-BR')}`,
  };
}

export function generateDigitalRootsQuestion(
  mode: 'nines' | 'elevens' | 'mixed' = 'mixed',
  difficulty?: DifficultyTier
): Question {
  const diff = normalizeDifficulty(difficulty);
  const isNine = mode === 'nines' ? true : mode === 'elevens' ? false : Math.random() > 0.5;

  if (isNine) {
    const min = diff === 1 ? 120 : diff === 2 ? 1120 : 12340;
    const maxSpan = diff === 1 ? 800 : diff === 2 ? 8000 : 80000;
    const n = Math.floor(Math.random() * maxSpan) + min;
    const digitalRoot = ((n - 1) % 9) + 1;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `Raiz digital (mod 9) de ${n}`,
      prompt: `Qual é a raiz digital (soma sucessiva dos dígitos mod 9) de ${n}?`,
      answer: digitalRoot,
      technique: 'Prova dos Nove',
      hint: `Some os algarismos de ${n} e reduza a um único dígito descartando os 9s: ${digitalRoot}`,
    };
  } else {
    const min = diff === 1 ? 110 : diff === 2 ? 1100 : 11000;
    const maxSpan = diff === 1 ? 880 : diff === 2 ? 8800 : 88000;
    const n = Math.floor(Math.random() * maxSpan) + min;
    const digits = String(n).split('').map(Number);
    let altSum = 0;
    for (let i = 0; i < digits.length; i++) {
      const idxFromRight = digits.length - 1 - i;
      altSum += (i % 2 === 0 ? 1 : -1) * digits[idxFromRight];
    }
    const remainder = ((altSum % 11) + 11) % 11;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `Resto de ${n} ÷ 11 (Prova dos Onze)`,
      prompt: `Qual é o resto da divisão de ${n} por 11 usando a soma alternada dos dígitos?`,
      answer: remainder,
      technique: 'Prova dos Onze',
      hint: `Soma alternada dos dígitos da direita para a esquerda: resto = ${remainder}`,
    };
  }
}

export function generateAntyayorevaQuestion(): Question {
  const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const u1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  const u2 = 10 - u1;
  const a = tens * 10 + u1;
  const b = tens * 10 + u2;
  const lead = tens * (tens + 1);
  const tail = String(u1 * u2).padStart(2, '0');
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b}`,
    answer: a * b,
    technique: 'Antyayoreva (Dezenas Iguais)',
    hint: `${tens} × ${tens + 1} = ${lead} seguido de ${u1} × ${u2} = ${tail} -> ${lead}${tail}`,
  };
}

export function generateSquaresNear50Question(): Question {
  const diffs = [-7, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 7];
  const d = diffs[Math.floor(Math.random() * diffs.length)];
  const n = 50 + d;
  const lead = 25 + d;
  const tail = String(d * d).padStart(2, '0');
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n}²`,
    answer: n * n,
    technique: 'Quadrados Próximos de 50 (Pivô 25)',
    hint: `25 + (${d}) = ${lead} | (${Math.abs(d)})² = ${tail} -> ${lead}${tail}`,
  };
}

export function generateYavadunamQuestion(): Question {
  const above = Math.random() > 0.5;
  if (above) {
    const a = Math.floor(Math.random() * 7) + 2;
    const b = Math.floor(Math.random() * 7) + 2;
    const n1 = 100 + a;
    const n2 = 100 + b;
    const tail = String(a * b).padStart(2, '0');
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n1} × ${n2}`,
      answer: n1 * n2,
      technique: 'Base 100 (Yavadunam)',
      hint: `${n1} + ${b} = ${n1 + b} seguido de ${a} × ${b} = ${tail} -> ${n1 + b}${tail}`,
    };
  }
  const a = Math.floor(Math.random() * 6) + 2;
  const b = Math.floor(Math.random() * 6) + 2;
  const n1 = 100 - a;
  const n2 = 100 - b;
  const tail = String(a * b).padStart(2, '0');
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n1} × ${n2}`,
    answer: n1 * n2,
    technique: 'Base 100 (Yavadunam)',
    hint: `${n1} - ${b} = ${n1 - b} seguido de (-${a}) × (-${b}) = ${tail} -> ${n1 - b}${tail}`,
  };
}

export function generateDiv5Question(): Question {
  const ans = Math.floor(Math.random() * 80) + 12;
  const n = ans * 5;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} ÷ 5`,
    answer: ans,
    technique: 'Divisão Rápida por 5',
    hint: `Dobre ${n} (= ${n * 2}) e divida por 10 = ${ans}`,
  };
}

export function generateDiv25Question(): Question {
  const ans = Math.floor(Math.random() * 40) + 4;
  const n = ans * 25;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} ÷ 25`,
    answer: ans,
    technique: 'Divisão Rápida por 25',
    hint: `Quadruplique ${n} (= ${n * 4}) e divida por 100 = ${ans}`,
  };
}

export function generateDiv4Question(): Question {
  const ans = Math.floor(Math.random() * 70) + 12;
  const n = ans * 4;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} ÷ 4`,
    answer: ans,
    technique: 'Bisseção Dupla (Divisão por 4)',
    hint: `Metade de ${n} é ${n / 2}, e a metade de ${n / 2} é ${ans}`,
  };
}

export function generateCubeRootQuestion(): Question {
  const nonZeroEnds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 36, 42, 43, 51, 52, 61];
  const root = nonZeroEnds[Math.floor(Math.random() * nonZeroEnds.length)];
  const cube = root * root * root;
  const lastD = cube % 10;
  const rootUnits = root % 10;
  const rootTens = Math.floor(root / 10);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `∛${cube}`,
    answer: root,
    technique: 'Raiz Cúbica Instantânea',
    hint: `Termina em ${lastD} -> unidade é ${rootUnits}. Resto ${Math.floor(cube / 1000)} fica entre ${rootTens}³ e ${(rootTens + 1)}³ -> dezena é ${rootTens}`,
  };
}

export function generateTrachtenberg12Question(): Question {
  const n = Math.floor(Math.random() * 60) + 14;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} × 12`,
    answer: n * 12,
    technique: 'Multiplicação por 12 (Trachtenberg)',
    hint: 'Dobre cada dígito e some o vizinho da direita',
  };
}

export function generateMult9or99Question(): Question {
  const is99 = Math.random() > 0.5;
  if (is99) {
    const n = Math.floor(Math.random() * 45) + 12;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} × 99`,
      answer: n * 99,
      technique: 'Multiplicação por 99',
      hint: `${n} × 100 - ${n} = ${n * 100} - ${n} = ${n * 99}`,
    };
  }
  const n = Math.floor(Math.random() * 60) + 14;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} × 9`,
    answer: n * 9,
    technique: 'Multiplicação por 9',
    hint: `${n} × 10 - ${n} = ${n * 10} - ${n} = ${n * 9}`,
  };
}

export function generateRuleOf72Question(): Question {
  const rates = [3, 4, 6, 8, 9, 12, 18, 24];
  const rate = rates[Math.floor(Math.random() * rates.length)];
  const years = 72 / rate;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `72 ÷ ${rate}%`,
    prompt: `Anos para dobrar o capital a ${rate}% a.a.?`,
    answer: years,
    technique: 'Regra dos 72',
    hint: `Regra dos 72: 72 ÷ ${rate} = ${years} anos`,
  };
}

export function generateMultTeens11to19Question(): Question {
  const a = Math.floor(Math.random() * 9) + 11; // 11 to 19
  const b = Math.floor(Math.random() * 9) + 11; // 11 to 19
  const ans = a * b;
  const cross = a + (b % 10);
  const unitsProd = (a % 10) * (b % 10);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b}`,
    answer: ans,
    technique: 'Sutra dos Teens (11 a 19)',
    hint: `(${a} + ${b % 10}) = ${cross} → ${cross} × 10 = ${cross * 10} + (${a % 10} × ${b % 10} = ${unitsProd}) = ${ans}`,
  };
}

export function generateMultEndsIn1Question(): Question {
  const tensA = Math.floor(Math.random() * 7) + 2; // 2..8
  const tensB = Math.floor(Math.random() * 7) + 2; // 2..8
  const a = tensA * 10 + 1;
  const b = tensB * 10 + 1;
  const ans = a * b;
  const prodTens = tensA * tensB * 100;
  const sumTens = (tensA + tensB) * 10;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} × ${b}`,
    answer: ans,
    technique: 'Multiplicação com Finais em 1',
    hint: `(${tensA * 10} × ${tensB * 10} = ${prodTens}) + (${tensA * 10} + ${tensB * 10} = ${sumTens}) + 1 = ${ans}`,
  };
}

export function generateMult125or750Question(): Question {
  const is125 = Math.random() > 0.4;
  if (is125) {
    const k = Math.floor(Math.random() * 9) + 2; // 2..10
    const n = k * 8;
    const ans = k * 1000;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} × 125`,
      answer: ans,
      technique: 'Família do Milhar (Fator 125)',
      hint: `${n} × 1000 ÷ 8 = (${n} ÷ 8) × 1000 = ${k} × 1000 = ${ans}`,
    };
  }
  const k = Math.floor(Math.random() * 8) + 2; // 2..9
  const n = k * 4;
  const ans = k * 300;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} × 75`,
    answer: ans,
    technique: 'Família do Milhar (Fator 75)',
    hint: `(${n} ÷ 4) × 300 = ${k} × 300 = ${ans}`,
  };
}

export function generateDecimalFracConversionQuestion(): Question {
  const modes = ['mult_025', 'mult_02', 'mult_05', 'div_05', 'div_025', 'div_02'];
  const mode = modes[Math.floor(Math.random() * modes.length)];

  if (mode === 'mult_025') {
    const k = Math.floor(Math.random() * 20) + 3;
    const n = k * 4;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} × 0.25`,
      answer: k,
      technique: 'Decimais e Frações Ocultas',
      hint: `Multiplicar por 0.25 é dividir por 4: ${n} ÷ 4 = ${k}`,
    };
  }
  if (mode === 'mult_02') {
    const k = Math.floor(Math.random() * 18) + 3;
    const n = k * 5;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} × 0.2`,
      answer: k,
      technique: 'Decimais e Frações Ocultas',
      hint: `Multiplicar por 0.2 é dividir por 5: ${n} ÷ 5 = ${k}`,
    };
  }
  if (mode === 'mult_05') {
    const k = Math.floor(Math.random() * 35) + 6;
    const n = k * 2;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} × 0.5`,
      answer: k,
      technique: 'Decimais e Frações Ocultas',
      hint: `Multiplicar por 0.5 é extrair a metade: ${n} ÷ 2 = ${k}`,
    };
  }
  if (mode === 'div_05') {
    const n = Math.floor(Math.random() * 35) + 12;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} ÷ 0.5`,
      answer: n * 2,
      technique: 'Decimais e Frações Ocultas',
      hint: `Dividir por 0.5 é dobrar: ${n} × 2 = ${n * 2}`,
    };
  }
  if (mode === 'div_025') {
    const n = Math.floor(Math.random() * 20) + 4;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${n} ÷ 0.25`,
      answer: n * 4,
      technique: 'Decimais e Frações Ocultas',
      hint: `Dividir por 0.25 é quadruplicar: ${n} × 4 = ${n * 4}`,
    };
  }
  const n = Math.floor(Math.random() * 15) + 4;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${n} ÷ 0.2`,
    answer: n * 5,
    technique: 'Decimais e Frações Ocultas',
    hint: `Dividir por 0.2 é multiplicar por 5: ${n} × 5 = ${n * 5}`,
  };
}

export function generateSquareRootPerfectQuestion(): Question {
  const roots = [12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 35, 36, 42, 45, 52, 54, 56, 62, 64, 72, 75, 84, 92];
  const root = roots[Math.floor(Math.random() * roots.length)];
  const square = root * root;
  const lastD = square % 10;
  const rootUnit = root % 10;
  const rootTen = Math.floor(root / 10);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `√${square}`,
    answer: root,
    technique: 'Raiz Quadrada Instantânea',
    hint: `Termina em ${lastD} (unidade ${rootUnit}). Dezena delimitada por ${rootTen}² = ${rootTen * rootTen}00 → ${root}`,
  };
}

export function generatePercentPivot10and1Question(): Question {
  const is10 = Math.random() > 0.4;
  if (is10) {
    const k = Math.floor(Math.random() * 85) + 5;
    const n = k * 10;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `10% de ${n}`,
      answer: k,
      technique: 'Pivô Decimal (10% e 1%)',
      hint: `Desloque a vírgula 1 casa para a esquerda: ${n} → ${k}`,
    };
  }
  const k = Math.floor(Math.random() * 45) + 3;
  const n = k * 100;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `1% de ${n}`,
    answer: k,
    technique: 'Pivô Decimal (10% e 1%)',
    hint: `Desloque a vírgula 2 casas para a esquerda: ${n} → ${k}`,
  };
}

export function generatePercentTip15Question(): Question {
  const multiples = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 240, 300, 400];
  const n = multiples[Math.floor(Math.random() * multiples.length)];
  const tip = Math.round(n * 0.15);
  const part10 = Math.round(n * 0.1);
  const part5 = Math.round(n * 0.05);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `15% de ${n}`,
    prompt: `Gorjeta de 15% em conta de R$ ${n}`,
    answer: tip,
    technique: 'Regra dos 15% (Gorjeta)',
    hint: `10% de ${n} = ${part10}. Metade disso (5%) = ${part5}. Some: ${part10} + ${part5} = ${tip}`,
  };
}

export function generatePercentFriendlyFractionsQuestion(): Question {
  const types = ['25%', '20%', '50%', '75%'];
  const t = types[Math.floor(Math.random() * types.length)];
  if (t === '25%') {
    const k = Math.floor(Math.random() * 22) + 3;
    const n = k * 4;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `25% de ${n}`,
      answer: k,
      technique: 'Frações Equivalentes (Porcentagem)',
      hint: `25% é 1/4: divida por 4 → ${n} ÷ 4 = ${k}`,
    };
  }
  if (t === '20%') {
    const k = Math.floor(Math.random() * 18) + 3;
    const n = k * 5;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `20% de ${n}`,
      answer: k,
      technique: 'Frações Equivalentes (Porcentagem)',
      hint: `20% é 1/5: divida por 5 → ${n} ÷ 5 = ${k}`,
    };
  }
  if (t === '50%') {
    const k = Math.floor(Math.random() * 45) + 6;
    const n = k * 2;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `50% de ${n}`,
      answer: k,
      technique: 'Frações Equivalentes (Porcentagem)',
      hint: `50% é a metade: divida por 2 → ${n} ÷ 2 = ${k}`,
    };
  }
  const k = Math.floor(Math.random() * 15) + 3;
  const n = k * 4;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `75% de ${n}`,
    answer: k * 3,
    technique: 'Frações Equivalentes (Porcentagem)',
    hint: `75% é 3/4: (${n} ÷ 4) × 3 = ${k} × 3 = ${k * 3}`,
  };
}

export function generatePercentSymmetryQuestion(): Question {
  const pairs = [
    { p: 16, b: 50 },
    { p: 18, b: 50 },
    { p: 14, b: 50 },
    { p: 32, b: 25 },
    { p: 48, b: 25 },
    { p: 4, b: 75 },
    { p: 8, b: 75 },
    { p: 12, b: 50 },
    { p: 44, b: 50 },
    { p: 28, b: 50 },
    { p: 24, b: 25 },
    { p: 36, b: 50 },
  ];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const ans = Math.round((pair.p * pair.b) / 100);
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${pair.p}% de ${pair.b}`,
    answer: ans,
    technique: 'Simetria Mágica (x% de y = y% de x)',
    hint: `Inverta a perspectiva: ${pair.p}% de ${pair.b} = ${pair.b}% de ${pair.p} = ${ans}`,
  };
}

export function generatePercentDiscountAddQuestion(): Question {
  const cases = [
    { base: 80, pct: 20, isDiscount: true, label: 'Desconto de 20% em R$ 80' },
    { base: 120, pct: 10, isDiscount: true, label: 'Desconto de 10% em R$ 120' },
    { base: 60, pct: 25, isDiscount: true, label: 'Desconto de 25% em R$ 60' },
    { base: 200, pct: 15, isDiscount: false, label: 'Acréscimo de 15% em R$ 200' },
    { base: 150, pct: 20, isDiscount: false, label: 'Acréscimo de 20% em R$ 150' },
    { base: 90, pct: 10, isDiscount: true, label: 'Desconto de 10% em R$ 90' },
    { base: 400, pct: 5, isDiscount: true, label: 'Desconto de 5% em R$ 400' },
    { base: 50, pct: 20, isDiscount: true, label: 'Desconto de 20% em R$ 50' },
    { base: 250, pct: 10, isDiscount: false, label: 'Acréscimo de 10% em R$ 250' },
    { base: 70, pct: 10, isDiscount: true, label: 'Desconto de 10% em R$ 70' },
  ];
  const item = cases[Math.floor(Math.random() * cases.length)];
  const delta = Math.round(item.base * (item.pct / 100));
  const ans = item.isDiscount ? item.base - delta : item.base + delta;
  return {
    id: Math.random().toString(36).substring(7),
    equation: item.isDiscount ? `${item.base} - ${item.pct}%` : `${item.base} + ${item.pct}%`,
    prompt: item.label,
    answer: ans,
    technique: 'Acréscimos e Descontos Rápidos',
    hint: `${item.pct}% de ${item.base} = ${delta}. Valor final: ${item.base} ${item.isDiscount ? '-' : '+'} ${delta} = ${ans}`,
  };
}

function generateQuestionRaw(
  mode: string = 'general',
  filters?: string[],
  difficulty?: DifficultyTier
): Question {
  const qTypes =
    filters && filters.length > 0
      ? filters
      : mode !== 'general'
      ? [mode]
      : ['addition', 'subtraction', 'multiplication', 'fermi'];
  const pickedRaw = qTypes[Math.floor(Math.random() * qTypes.length)];

  // Normalization Map connecting node.id, friendly names, and legacy keys
  const normalizer: Record<string, string> = {
    'ADD_LEFT_RIGHT': 'ADD_LEFT_RIGHT',
    'Positional Fusion': 'ADD_LEFT_RIGHT',
    'Adição Esquerda-Direita': 'ADD_LEFT_RIGHT',
    'addition': 'ADD_LEFT_RIGHT',

    'SUB_COMPENSATION': 'SUB_COMPENSATION',
    'Additive Offset': 'SUB_COMPENSATION',
    'Compensação Subtrativa': 'SUB_COMPENSATION',
    'subtraction': 'SUB_COMPENSATION',

    'COMPLEMENT_100': 'COMPLEMENT_100',
    'Vedic Sutra': 'COMPLEMENT_100',
    'Complemento de Base 100': 'COMPLEMENT_100',

    'MULT_5_50': 'MULT_5_50',
    'Decimal Factor': 'MULT_5_50',
    'Fator 5': 'MULT_5_50',
    'Fator 5 e 50': 'MULT_5_50',

    'MULT_25': 'MULT_25',
    'Quarter Factor': 'MULT_25',
    'Fator 25': 'MULT_25',

    'MULT_11': 'MULT_11',
    'Elastic Accordion': 'MULT_11',
    'Multiplicação por 11': 'MULT_11',

    'DIFF_OF_SQUARES': 'DIFF_OF_SQUARES',
    'Symmetric Mirror': 'DIFF_OF_SQUARES',
    'Diferença de Quadrados': 'DIFF_OF_SQUARES',

    'SQUARES_ENDING_5': 'SQUARES_ENDING_5',
    'Ekadhikena': 'SQUARES_ENDING_5',
    'Quadrados com Final 5': 'SQUARES_ENDING_5',

    'FERMI_MAGNITUDE': 'FERMI_MAGNITUDE',
    'Order of Magnitude': 'FERMI_MAGNITUDE',
    'fermi': 'FERMI_MAGNITUDE',
    'Olho de Fermi': 'FERMI_MAGNITUDE',

    'VEDIC_CROSS': 'VEDIC_CROSS',
    'Vedic Cross': 'VEDIC_CROSS',
    'Multiplicação Cruzada Védica': 'VEDIC_CROSS',

    'FLASH_ANZAN_MASTERY': 'FLASH_ANZAN_MASTERY',
    'Visuospatial Anzan': 'FLASH_ANZAN_MASTERY',

    'DIGITAL_ROOTS_9_11': 'DIGITAL_ROOTS_9_11',
    'digital_roots': 'DIGITAL_ROOTS_9_11',
    'Prova dos Nove': 'DIGITAL_ROOTS_9_11',
    'Prova dos Onze': 'DIGITAL_ROOTS_9_11',
    'Prova dos 9 e dos 11': 'DIGITAL_ROOTS_9_11',

    // Extended Techniques
    'ANTYAYOREVA': 'ANTYAYOREVA',
    'SQUARES_NEAR_50': 'SQUARES_NEAR_50',
    'YAVADUNAM_BASE_100': 'YAVADUNAM_BASE_100',
    'DIV_5': 'DIV_5',
    'DIV_25': 'DIV_25',
    'DIV_4': 'DIV_4',
    'CUBE_ROOT_PERFECT': 'CUBE_ROOT_PERFECT',
    'TRACHTENBERG_12': 'TRACHTENBERG_12',
    'MULT_9_99': 'MULT_9_99',
    'RULE_OF_72': 'RULE_OF_72',

    // Extra Added Techniques from Math Tricks Catalog
    'MULT_TEENS_11_19': 'MULT_TEENS_11_19',
    'Cross-Addition Teens': 'MULT_TEENS_11_19',
    'MULT_ENDS_IN_1': 'MULT_ENDS_IN_1',
    'Unitary One Expansion': 'MULT_ENDS_IN_1',
    'MULT_125_750': 'MULT_125_750',
    'Thousand Factor Scaler': 'MULT_125_750',
    'DECIMAL_FRAC_CONVERSION': 'DECIMAL_FRAC_CONVERSION',
    'Unitary Fraction Inversion': 'DECIMAL_FRAC_CONVERSION',
    'SQUARE_ROOT_PERFECT': 'SQUARE_ROOT_PERFECT',
    'Quadratic Pivot Framing': 'SQUARE_ROOT_PERFECT',
    'PERCENT_PIVOT_10_1': 'PERCENT_PIVOT_10_1',
    'Decimal Decimal Shift': 'PERCENT_PIVOT_10_1',
    'PERCENT_TIP_15': 'PERCENT_TIP_15',
    'Composite Percentage Tip': 'PERCENT_TIP_15',
    'PERCENT_FRIENDLY_FRACTIONS': 'PERCENT_FRIENDLY_FRACTIONS',
    'Unitary Fraction Benchmark': 'PERCENT_FRIENDLY_FRACTIONS',
    'PERCENT_SYMMETRY': 'PERCENT_SYMMETRY',
    'Percentage Commutative Symmetry': 'PERCENT_SYMMETRY',
    'PERCENT_DISCOUNT_ADD': 'PERCENT_DISCOUNT_ADD',
    'Mental Markup and Markdown': 'PERCENT_DISCOUNT_ADD',
  };

  const key = normalizer[pickedRaw] || pickedRaw;

  if (key === 'COMPLEMENT_100') return generateComplement100Question(difficulty);
  if (key === 'SQUARES_ENDING_5') return generateSquaresEnding5Question(difficulty);
  if (key === 'VEDIC_CROSS') return generateVedicCrossQuestion(difficulty);
  if (key === 'MULT_11') return generateMult11Question(difficulty);
  if (key === 'MULT_25') return generateMult25Question(difficulty);
  if (key === 'MULT_5_50') return generateMult5Question(difficulty);
  if (key === 'DIFF_OF_SQUARES') return generateDiffOfSquaresQuestion(difficulty);
  if (key === 'FERMI_MAGNITUDE') return generateFermiQuestion(difficulty);
  if (key === 'DIGITAL_ROOTS_9_11') return generateDigitalRootsQuestion('mixed', difficulty);
  if (key === 'ANTYAYOREVA') return generateAntyayorevaQuestion();
  if (key === 'SQUARES_NEAR_50') return generateSquaresNear50Question();
  if (key === 'YAVADUNAM_BASE_100') return generateYavadunamQuestion();
  if (key === 'DIV_5') return generateDiv5Question();
  if (key === 'DIV_25') return generateDiv25Question();
  if (key === 'DIV_4') return generateDiv4Question();
  if (key === 'CUBE_ROOT_PERFECT') return generateCubeRootQuestion();
  if (key === 'TRACHTENBERG_12') return generateTrachtenberg12Question();
  if (key === 'MULT_9_99') return generateMult9or99Question();
  if (key === 'RULE_OF_72') return generateRuleOf72Question();
  if (key === 'MULT_TEENS_11_19') return generateMultTeens11to19Question();
  if (key === 'MULT_ENDS_IN_1') return generateMultEndsIn1Question();
  if (key === 'MULT_125_750') return generateMult125or750Question();
  if (key === 'DECIMAL_FRAC_CONVERSION') return generateDecimalFracConversionQuestion();
  if (key === 'SQUARE_ROOT_PERFECT') return generateSquareRootPerfectQuestion();
  if (key === 'PERCENT_PIVOT_10_1') return generatePercentPivot10and1Question();
  if (key === 'PERCENT_TIP_15') return generatePercentTip15Question();
  if (key === 'PERCENT_FRIENDLY_FRACTIONS') return generatePercentFriendlyFractionsQuestion();
  if (key === 'PERCENT_SYMMETRY') return generatePercentSymmetryQuestion();
  if (key === 'PERCENT_DISCOUNT_ADD') return generatePercentDiscountAddQuestion();

  if (key === 'multiplication') {
    const subtype = Math.random();
    if (subtype < 0.35) return generateMult11Question(difficulty);
    if (subtype < 0.7) return generateMult25Question(difficulty);
    return generateMult5Question(difficulty);
  }

  if (key === 'SUB_COMPENSATION') {
    const diff = normalizeDifficulty(difficulty);
    const a = diff === 1 ? Math.floor(Math.random() * 50) + 40 : diff === 2 ? Math.floor(Math.random() * 90) + 60 : Math.floor(Math.random() * 200) + 120;
    const b = diff === 1 ? Math.floor(Math.random() * 20) + 18 : diff === 2 ? Math.floor(Math.random() * 40) + 28 : Math.floor(Math.random() * 80) + 48;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${a} - ${b}`,
      answer: a - b,
      technique: 'Compensação Subtrativa',
      hint: `Subtraia o redondo próximo e devolva o troco`,
    };
  }

  if (key === 'FLASH_ANZAN_MASTERY') {
    const diff = normalizeDifficulty(difficulty);
    const count = diff === 1 ? 3 : diff === 2 ? 4 : 6;
    const seq = generateFlashAnzanSequence(count);
    const sum = seq.reduce((acc, curr) => acc + curr, 0);
    return {
      id: Math.random().toString(36).substring(7),
      equation: seq.join(' + '),
      answer: sum,
      technique: 'Soroban Mental Visuoespacial',
      hint: 'Acumule a soma contínua das parcelas',
    };
  }

  // Default: Addition Left-to-Right
  const diff = normalizeDifficulty(difficulty);
  const a = diff === 1 ? Math.floor(Math.random() * 40) + 12 : diff === 2 ? Math.floor(Math.random() * 80) + 24 : Math.floor(Math.random() * 150) + 65;
  const b = diff === 1 ? Math.floor(Math.random() * 40) + 12 : diff === 2 ? Math.floor(Math.random() * 80) + 17 : Math.floor(Math.random() * 150) + 45;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} + ${b}`,
    answer: a + b,
    technique: 'Adição Esquerda-Direita',
    hint: `Some as dezenas (${Math.floor(b / 10) * 10}) primeiro!`,
  };
}

export interface QuestionModuleInfo {
  unit: number;
  moduleTitle: string;
  nodeId: string;
}

export function resolveModuleForQuestion(q: Question): QuestionModuleInfo {
  if (q.unit && q.moduleTitle && q.moduleId) {
    return { unit: q.unit, moduleTitle: q.moduleTitle, nodeId: q.moduleId };
  }

  for (const grade of TRACK_GRADES) {
    for (const node of grade.nodes) {
      if (
        (q.id && node.id === q.id) ||
        (q.technique && (node.technique === q.technique || node.title === q.technique))
      ) {
        return {
          unit: grade.grade,
          moduleTitle: node.title,
          nodeId: node.id,
        };
      }
    }
  }

  const tech = (q.technique || '').toLowerCase();
  if (tech.includes('adição') || tech.includes('subtração') || tech.includes('complemento')) {
    return { unit: 1, moduleTitle: 'Adição Esquerda-Direita', nodeId: 'ADD_LEFT_RIGHT' };
  }
  if (tech.includes('fator') || tech.includes('11') || tech.includes('quadrados')) {
    return { unit: 2, moduleTitle: 'Fatores & Simetrias', nodeId: 'DIFF_OF_SQUARES' };
  }
  if (tech.includes('anty') || tech.includes('50') || tech.includes('5')) {
    return { unit: 3, moduleTitle: 'Geometria Mental', nodeId: 'SQUARES_ENDING_5' };
  }
  if (tech.includes('védic') || tech.includes('divis')) {
    return { unit: 4, moduleTitle: 'Cruzamento Védico', nodeId: 'VEDIC_CROSS' };
  }
  if (tech.includes('trachtenberg') || tech.includes('100') || tech.includes('99')) {
    return { unit: 5, moduleTitle: 'Mestria Operacional', nodeId: 'YAVADUNAM_BASE_100' };
  }
  if (tech.includes('digital') || tech.includes('nove') || tech.includes('onze') || tech.includes('modular')) {
    return { unit: 6, moduleTitle: 'Prova dos 9 e dos 11', nodeId: 'DIGITAL_ROOTS_9_11' };
  }
  if (tech.includes('anzan') || tech.includes('soroban')) {
    return { unit: 6, moduleTitle: 'Soroban Mental Visuoespacial', nodeId: 'FLASH_ANZAN_MASTERY' };
  }
  if (
    tech.includes('porcentagem') ||
    tech.includes('gorjeta') ||
    tech.includes('desconto') ||
    tech.includes('simetria')
  ) {
    return { unit: 7, moduleTitle: 'Porcentagens & Cotidiano', nodeId: 'PERCENT_PIVOT_10_1' };
  }
  return { unit: 6, moduleTitle: 'Visão Axiomática', nodeId: 'FERMI_MAGNITUDE' };
}

export function generateQuestion(
  mode: string = 'general',
  filters?: string[],
  difficulty?: DifficultyTier
): Question {
  const q = generateQuestionRaw(mode, filters, difficulty);
  const mod = resolveModuleForQuestion(q);
  q.unit = mod.unit;
  q.moduleId = mod.nodeId;
  q.moduleTitle = mod.moduleTitle;
  return q;
}

export function generateQuestionsForNode(
  nodeId: string,
  count: number = 10,
  difficulty: DifficultyTier = 'medium'
): Question[] {
  const normCount = Math.min(20, Math.max(10, count));
  const list: Question[] = [];
  for (let i = 0; i < normCount; i++) {
    list.push(generateQuestion(nodeId, undefined, difficulty));
  }
  return list;
}

export function getNodeScaffoldingTasks(nodeId: string): ScaffoldingTask[] {
  let foundNode: TrackNodeData | undefined;
  for (const g of TRACK_GRADES) {
    const n = g.nodes.find((item) => item.id === nodeId);
    if (n) {
      foundNode = n;
      break;
    }
  }
  const tasks: ScaffoldingTask[] = foundNode?.scaffolding ? [...foundNode.scaffolding] : [];

  while (tasks.length < 3) {
    const q = generateQuestion(nodeId, undefined, 'easy');
    const ans = String(q.answer);
    tasks.push({
      equation: q.equation,
      instruction: `Aplique a técnica de ${foundNode?.title || 'atalho'} para resolver o passo guiado:`,
      template: `${q.equation} = {answer}`,
      blanks: [
        {
          key: `step_${tasks.length}`,
          label: `Resultado de ${q.equation}`,
          expected: ans,
        },
      ],
    });
  }

  return tasks.slice(0, 3);
}

export function generateQuestionForUnits(
  units: number[] = [1, 2, 3, 4, 5, 6, 7],
  difficulty?: DifficultyTier
): Question {
  const activeUnits = units && units.length > 0 ? units : [1, 2, 3, 4, 5, 6, 7];
  const unitTechniqueMap: Record<number, string[]> = {
    1: ['ADD_LEFT_RIGHT', 'SUB_COMPENSATION', 'COMPLEMENT_100', 'DIV_4', 'MULT_5_50'],
    2: ['MULT_5_50', 'MULT_25', 'MULT_11', 'DIFF_OF_SQUARES', 'DIV_5', 'MULT_TEENS_11_19', 'MULT_ENDS_IN_1'],
    3: ['SQUARES_ENDING_5', 'ANTYAYOREVA', 'SQUARES_NEAR_50', 'VEDIC_CROSS', 'DIV_25'],
    4: ['VEDIC_CROSS', 'DIV_5', 'DIV_25', 'DIV_4', 'MULT_125_750', 'DECIMAL_FRAC_CONVERSION'],
    5: ['YAVADUNAM_BASE_100', 'TRACHTENBERG_12', 'MULT_9_99', 'SQUARE_ROOT_PERFECT'],
    6: ['FERMI_MAGNITUDE', 'CUBE_ROOT_PERFECT', 'RULE_OF_72', 'FLASH_ANZAN_MASTERY', 'DIGITAL_ROOTS_9_11'],
    7: ['PERCENT_PIVOT_10_1', 'PERCENT_TIP_15', 'PERCENT_FRIENDLY_FRACTIONS', 'PERCENT_SYMMETRY', 'PERCENT_DISCOUNT_ADD'],
  };

  const pool: string[] = [];
  for (const u of activeUnits) {
    if (unitTechniqueMap[u]) {
      pool.push(...unitTechniqueMap[u]);
    }
  }

  const pickedKey = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : 'ADD_LEFT_RIGHT';
  return generateQuestion(pickedKey, undefined, difficulty);
}

export function generateDailyQuestions(seedDate: string = '2026-09-07'): Question[] {
  const rng = createSeededRandom(seedDate);
  const list: Question[] = [];
  const techniques = [
    'ADD_LEFT_RIGHT',
    'SUB_COMPENSATION',
    'COMPLEMENT_100',
    'MULT_5_50',
    'MULT_25',
    'MULT_11',
    'DIFF_OF_SQUARES',
    'SQUARES_ENDING_5',
    'PERCENT_PIVOT_10_1',
    'PERCENT_SYMMETRY',
  ];

  for (let i = 1; i <= 20; i++) {
    const tech = techniques[(i - 1) % techniques.length];
    if (tech === 'ADD_LEFT_RIGHT') {
      const a = Math.floor(rng() * 70) + 20;
      const b = Math.floor(rng() * 70) + 15;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${a} + ${b}`,
        answer: a + b,
        technique: 'Fluxo Esquerda-Direita',
        hint: `Some primeiro as dezenas: ${a} + ${Math.floor(b / 10) * 10}`,
      });
    } else if (tech === 'SUB_COMPENSATION') {
      const a = Math.floor(rng() * 60) + 40;
      const b = Math.floor(rng() * 25) + 18;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${a} - ${b}`,
        answer: a - b,
        technique: 'Compensação Subtrativa',
        hint: `Arredonde ${b} para o próximo múltiplo de 10`,
      });
    } else if (tech === 'COMPLEMENT_100') {
      const n = Math.floor(rng() * 80) + 11;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `100 - ${n}`,
        answer: 100 - n,
        technique: 'Complemento de Base 100',
        hint: `Todos de 9 e o último de 10`,
      });
    } else if (tech === 'MULT_11') {
      const n = Math.floor(rng() * 80) + 12;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${n} × 11`,
        answer: n * 11,
        technique: 'Acordeão Elástico (x11)',
        hint: `Abra os extremos e some os dígitos vizinhos`,
      });
    } else if (tech === 'MULT_25') {
      const k = Math.floor(rng() * 15) + 3;
      const n = k * 4;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${n} × 25`,
        answer: n * 25,
        technique: 'Fator Quarto (x25)',
        hint: `Divida por 4 (${k}) e anexe dois zeros`,
      });
    } else if (tech === 'MULT_5_50') {
      const k = Math.floor(rng() * 20) + 4;
      const n = k * 2;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${n} × 5`,
        answer: n * 5,
        technique: 'Metade do Décimo (x5)',
        hint: `Metade de ${n} é ${k}, depois multiplique por 10`,
      });
    } else if (tech === 'DIFF_OF_SQUARES') {
      const p = (Math.floor(rng() * 6) + 3) * 10;
      const d = Math.floor(rng() * 4) + 1;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${p - d} × ${p + d}`,
        answer: (p - d) * (p + d),
        technique: 'Diferença de Quadrados',
        hint: `${p}² - ${d}² = ${p * p} - ${d * d}`,
      });
    } else if (tech === 'SQUARES_ENDING_5') {
      const tens = Math.floor(rng() * 8) + 2;
      const n = tens * 10 + 5;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `${n}²`,
        answer: n * n,
        technique: 'Ekadhikena (Final 5)',
        hint: `${tens} × ${tens + 1} = ${tens * (tens + 1)} seguido de 25`,
      });
    } else if (tech === 'PERCENT_PIVOT_10_1') {
      const base = (Math.floor(rng() * 40) + 5) * 10;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `10% de ${base}`,
        answer: base * 0.1,
        technique: 'Pivô Decimal (10%)',
        hint: `Desloque uma casa decimal: ${base * 0.1}`,
      });
    } else {
      const mult = (Math.floor(rng() * 12) + 2) * 2;
      list.push({
        id: `daily_${seedDate}_${i}`,
        equation: `50% de ${mult}`,
        answer: mult * 0.5,
        technique: 'Simetria Percentual',
        hint: `50% de ${mult} é a metade: ${mult / 2}`,
      });
    }
  }
  return list;
}

export function generateFlashAnzanSequence(count: number = 6): number[] {
  const res: number[] = [];
  for (let i = 0; i < count; i++) {
    res.push(Math.floor(Math.random() * 89) + 11);
  }
  return res;
}

export function generatePatternRecognitionQuestion(): PatternRecognitionQuestion {
  const templates = [
    // 1. Diferença de Quadrados
    () => {
      const pivots = [30, 40, 50, 60, 70, 80, 90, 100];
      const pivot = pivots[Math.floor(Math.random() * pivots.length)];
      const diff = Math.floor(Math.random() * 4) + 1;
      const a = pivot - diff;
      const b = pivot + diff;
      const ans = a * b;
      const options: PatternOption[] = [
        {
          id: 'opt_diff_sq',
          label: `(${pivot} - ${diff})(${pivot} + ${diff}) = ${pivot * pivot} - ${diff * diff}`,
          isOptimal: true,
          explanation: `Identifique a simetria ao redor de ${pivot}: a diferença de quadrados reduz 4 multiplicações a uma subtração simples (${pivot}² - ${diff}²).`,
        },
        {
          id: 'opt_distrib',
          label: `${a} × ${pivot} + ${a} × ${diff}`,
          isOptimal: false,
          explanation: 'Distribuição válida, mas exige manter produtos assimétricos na memória de trabalho.',
        },
        {
          id: 'opt_decomp',
          label: `(${Math.floor(a / 10) * 10} + ${a % 10}) × (${Math.floor(b / 10) * 10} + ${b % 10})`,
          isOptimal: false,
          explanation: 'Decomposição em 4 parcelas cruzadas é o caminho mecânico mais demorado.',
        },
        {
          id: 'opt_approx',
          label: `${pivot} × ${pivot} - ${diff}`,
          isOptimal: false,
          explanation: 'Erro comum: subtraiu a distância linear em vez do quadrado da distância (d²).',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${a} × ${b}`,
        technique: 'Diferença de Quadrados',
        prompt: 'Qual é o atalho estrutural mais eficiente para resolver mentalmente?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 2. Porcentagem Invertida (Comutatividade)
    () => {
      const bases = [50, 25, 20, 10, 5, 200];
      const base = bases[Math.floor(Math.random() * bases.length)];
      const val = (Math.floor(Math.random() * 30) + 7) * 2;
      const ans = (val * base) / 100;
      const fractionMap: Record<number, string> = {
        50: 'metade (÷ 2)',
        25: 'um quarto (÷ 4)',
        20: 'um quinto (÷ 5)',
        10: 'um décimo (÷ 10)',
        5: 'metade de 10% (÷ 20)',
        200: 'o dobro (× 2)',
      };
      const options: PatternOption[] = [
        {
          id: 'opt_inv_perc',
          label: `${base}% de ${val} = ${val} × ${fractionMap[base]}`,
          isOptimal: true,
          explanation: `Inverta os fatores: x% de y = y% de x. Calcular ${base}% de ${val} é direto e não requer vírgulas.`,
        },
        {
          id: 'opt_direct_formula',
          label: `(${val} × ${base}) ÷ 100`,
          isOptimal: false,
          explanation: 'Fórmula clássica mecânica. Gera um número grande desnecessário antes da divisão.',
        },
        {
          id: 'opt_sum_10',
          label: `10% de ${base} + parcelas`,
          isOptimal: false,
          explanation: 'Decompor em partes decimais gera excesso de parcelas na memória.',
        },
        {
          id: 'opt_decimal_mult',
          label: `0,${val < 10 ? '0' + val : val} × ${base}`,
          isOptimal: false,
          explanation: 'Multiplicação com vírgula de papel e lápis, muito sujeita a erros de transporte.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${val}% de ${base}`,
        technique: 'Porcentagem Comutativa',
        prompt: 'Como enxergar essa porcentagem instantaneamente de cabeça?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 3. Fator 25 (Quarto de Centena)
    () => {
      const mult = (Math.floor(Math.random() * 22) + 4) * 4;
      const ans = mult * 25;
      const options: PatternOption[] = [
        {
          id: 'opt_div_4',
          label: `(${mult} ÷ 4) × 100 = ${mult / 4}00`,
          isOptimal: true,
          explanation: `Como 25 = 100 ÷ 4, basta dividir ${mult} por 4 duas vezes e acrescentar dois zeros.`,
        },
        {
          id: 'opt_mult_20_5',
          label: `${mult} × 20 + ${mult} × 5`,
          isOptimal: false,
          explanation: 'Funciona, mas exige duas multiplicações e uma soma final.',
        },
        {
          id: 'opt_decomp_tens',
          label: `${Math.floor(mult / 10) * 10} × 25 + ${mult % 10} × 25`,
          isOptimal: false,
          explanation: 'Decomposição decimal tradicional, gera etapas intermediárias na memória.',
        },
        {
          id: 'opt_div_2',
          label: `(${mult} × 100) ÷ 2`,
          isOptimal: false,
          explanation: 'Isso multiplicaria por 50, não por 25.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${mult} × 25`,
        technique: 'Fator 25 (Quarto de Centena)',
        prompt: 'Qual propriedade elimina o cálculo longo de multiplicação?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 4. Compensação por 99 / 98
    () => {
      const n = Math.floor(Math.random() * 50) + 16;
      const baseSub = Math.random() > 0.5 ? 99 : 98;
      const comp = 100 - baseSub;
      const ans = n * baseSub;
      const options: PatternOption[] = [
        {
          id: 'opt_comp_100',
          label: `${n} × (100 - ${comp}) = ${n}00 - ${n * comp}`,
          isOptimal: true,
          explanation: `Multiplicar por ${baseSub} é o mesmo que multiplicar pela base redonda 100 e subtrair ${comp} vez(es) ${n}.`,
        },
        {
          id: 'opt_distrib_90',
          label: `${n} × 90 + ${n} × ${baseSub - 90}`,
          isOptimal: false,
          explanation: `Multiplicar por 90 e por ${baseSub - 90} é trabalhoso de cabeça.`,
        },
        {
          id: 'opt_decomp_n',
          label: `${Math.floor(n / 10) * 10} × ${baseSub} + ${n % 10} × ${baseSub}`,
          isOptimal: false,
          explanation: 'Decomposição em parcelas complexas.',
        },
        {
          id: 'opt_faulty_sub',
          label: `${n} × 100 - ${comp}`,
          isOptimal: false,
          explanation: `Erro comum: subtraiu a unidade ${comp} em vez de (${comp} × ${n}).`,
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${n} × ${baseSub}`,
        technique: 'Compensação por Base 100',
        prompt: 'Qual a forma mais elegante de transformar essa conta em uma subtração simples?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 5. Quadrado de Número Terminado em 5
    () => {
      const tens = Math.floor(Math.random() * 8) + 2;
      const num = tens * 10 + 5;
      const ans = num * num;
      const next = tens + 1;
      const lead = tens * next;
      const options: PatternOption[] = [
        {
          id: 'opt_sq_five',
          label: `(${tens} × ${next}) seguido de 25 = ${lead}25`,
          isOptimal: true,
          explanation: `Regra Védica (Ekadhikena Purvena): para n5², multiplique a dezena n pelo seu sucessor (n+1) e termine com 25.`,
        },
        {
          id: 'opt_sq_binom',
          label: `(${tens * 10})² + 2(${tens * 10})(5) + 5²`,
          isOptimal: false,
          explanation: 'Expansão de binômio perfeita, mas requer somar 3 parcelas grandes mentalmente.',
        },
        {
          id: 'opt_sq_decomp',
          label: `${num} × ${tens * 10} + ${num} × 5`,
          isOptimal: false,
          explanation: 'Método distributivo clássico, exige segurar números pesados na memória.',
        },
        {
          id: 'opt_sq_diff',
          label: `(${num} - 5) × (${num} + 5)`,
          isOptimal: false,
          explanation: 'Incompleto: esqueceu de somar 5² no final para fechar a igualdade.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${num}²`,
        technique: 'Quadrados com Final 5 (Védico)',
        prompt: 'Como encontrar o quadrado desse número em menos de 1 segundo?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 6. Antyayoreva (Dezenas Iguais e Unidades que somam 10)
    () => {
      const tens = Math.floor(Math.random() * 8) + 2;
      const u1 = Math.floor(Math.random() * 8) + 1;
      const u2 = 10 - u1;
      const a = tens * 10 + u1;
      const b = tens * 10 + u2;
      const ans = a * b;
      const lead = tens * (tens + 1);
      const tail = String(u1 * u2).padStart(2, '0');
      const options: PatternOption[] = [
        {
          id: 'opt_antyayoreva',
          label: `(${tens} × ${tens + 1}) seguido de (${u1} × ${u2}) = ${lead}${tail}`,
          isOptimal: true,
          explanation: `Sutra Antyayoreva: dezenas iguais (${tens}) e unidades somando 10 (${u1} + ${u2} = 10) produzem o prefixo n(n+1) e o sufixo u1×u2.`,
        },
        {
          id: 'opt_distrib',
          label: `${a} × ${tens * 10} + ${a} × ${u2}`,
          isOptimal: false,
          explanation: 'Distribuição tradicional que exige múltiplos cálculos intermediários na memória.',
        },
        {
          id: 'opt_approx',
          label: `(${tens * 10})² + (${u1} + ${u2}) × 10`,
          isOptimal: false,
          explanation: 'Fórmula incorreta de aproximação.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${a} × ${b}`,
        technique: 'Antyayoreva (Dezenas Iguais)',
        prompt: 'Qual simetria oculta permite resolver essa multiplicação imediatamente?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 7. Quadrados Próximos de 50 (Pivô 25)
    () => {
      const diffs = [-4, -3, -2, -1, 1, 2, 3, 4, 6];
      const d = diffs[Math.floor(Math.random() * diffs.length)];
      const num = 50 + d;
      const ans = num * num;
      const lead = 25 + d;
      const tail = String(d * d).padStart(2, '0');
      const options: PatternOption[] = [
        {
          id: 'opt_pivot_25',
          label: `(25 + ${d}) seguido de (${Math.abs(d)})² = ${lead}${tail}`,
          isOptimal: true,
          explanation: `Pivô 25: para números perto de 50, (50 + d)² = 100(25 + d) + d². Uma simples soma em 25 dá a resposta!`,
        },
        {
          id: 'opt_diff_sq',
          label: `(${num} - ${d}) × (${num} + ${d})`,
          isOptimal: false,
          explanation: 'Falta somar d² ao final para completar o quadrado.',
        },
        {
          id: 'opt_distrib_50',
          label: `50² + 2(50)(${d})`,
          isOptimal: false,
          explanation: 'Fórmula de binômio válida, mas mais lenta que usar diretamente o pivô 25.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${num}²`,
        technique: 'Quadrados Próximos de 50 (Pivô 25)',
        prompt: 'Como calcular o quadrado desse número usando a base 50?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 8. Base 100 (Yavadunam)
    () => {
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 6) + 2;
      const n1 = 100 + a;
      const n2 = 100 + b;
      const ans = n1 * n2;
      const tail = String(a * b).padStart(2, '0');
      const options: PatternOption[] = [
        {
          id: 'opt_yavadunam',
          label: `(${n1} + ${b}) seguido de (${a} × ${b}) = ${n1 + b}${tail}`,
          isOptimal: true,
          explanation: `Sutra Yavadunam: para números próximos a 100, some o desvio cruzado e anexe o produto dos desvios.`,
        },
        {
          id: 'opt_distrib_100',
          label: `100 × ${n2} + ${a} × ${n2}`,
          isOptimal: false,
          explanation: 'Decomposição distributiva viável, porém mais lenta que o método de desvios da base.',
        },
        {
          id: 'opt_mult_long',
          label: `${n1} × 100 + ${n1} × ${b}`,
          isOptimal: false,
          explanation: 'Cálculo mecânico desnecessário.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${n1} × ${n2}`,
        technique: 'Base 100 (Yavadunam)',
        prompt: 'Qual a estratégia mais veloz para multiplicar fatores colados em 100?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 9. Raiz Cúbica Instantânea
    () => {
      const roots = [14, 16, 23, 27, 32, 45, 54, 62];
      const r = roots[Math.floor(Math.random() * roots.length)];
      const cube = r * r * r;
      const u = r % 10;
      const t = Math.floor(r / 10);
      const options: PatternOption[] = [
        {
          id: 'opt_cube_root',
          label: `Final ${cube % 10} -> unidade ${u} | Resto ${Math.floor(cube / 1000)} está entre ${t}³ e ${(t+1)}³ -> dezena ${t}`,
          isOptimal: true,
          explanation: `Bijeção de cubos módulo 10: a terminação única do cubo dá a unidade imediatamente, e o milhar dá a dezena!`,
        },
        {
          id: 'opt_cube_trial',
          label: 'Fatoração em números primos sucessivos por 2 e 3',
          isOptimal: false,
          explanation: 'Fatoração prima levaria dezenas de segundos no papel.',
        },
        {
          id: 'opt_cube_approx',
          label: 'Testar potências de 10 aleatoriamente',
          isOptimal: false,
          explanation: 'Tentativa e erro sem suporte das propriedades dos cubos.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `∛${cube}`,
        technique: 'Raiz Cúbica Instantânea',
        prompt: 'Como extrair a raiz cúbica desse número em menos de 2 segundos?',
        options,
        calculatedAnswer: r,
      };
    },

    // 10. Divisão Rápida por 25
    () => {
      const ans = (Math.floor(Math.random() * 20) + 4) * 2;
      const n = ans * 25;
      const options: PatternOption[] = [
        {
          id: 'opt_div_25_fast',
          label: `(${n} × 4) ÷ 100 = ${n * 4} ÷ 100 = ${ans}`,
          isOptimal: true,
          explanation: 'Dividir por 25 é equivalente a quadruplicar o dividendo e deslocar o ponto decimal 2 casas.',
        },
        {
          id: 'opt_div_traditional',
          label: 'Armar a chave de divisão por 25',
          isOptimal: false,
          explanation: 'Método escolar tradicional com divisões e subtrações sucessivas.',
        },
        {
          id: 'opt_div_sub',
          label: 'Subtrair 25 repetidamente até zerar',
          isOptimal: false,
          explanation: 'Subtração repetida é excessivamente ineficiente para cálculo mental.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${n} ÷ 25`,
        technique: 'Divisão Rápida por 25',
        prompt: 'Qual propriedade aritmética transforma essa divisão em uma simples multiplicação por 4?',
        options,
        calculatedAnswer: ans,
      };
    },

    // 11. Multiplicação por 12 (Trachtenberg)
    () => {
      const n = Math.floor(Math.random() * 40) + 14;
      const ans = n * 12;
      const options: PatternOption[] = [
        {
          id: 'opt_trachtenberg_12',
          label: 'Dobre cada dígito e adicione o vizinho da direita',
          isOptimal: true,
          explanation: 'Regra de Trachtenberg para o 12: calcula os dígitos diretamente da direita para a esquerda sem conta armada.',
        },
        {
          id: 'opt_mult_10_2',
          label: `${n} × 10 + ${n} × 2 = ${n * 10} + ${n * 2}`,
          isOptimal: false,
          explanation: 'Distribuição válida por 10 e 2, mas exige armazenar duas parcelas grandes na memória.',
        },
        {
          id: 'opt_mult_column',
          label: 'Multiplicar por 2, depois por 1 e somar com deslocamento',
          isOptimal: false,
          explanation: 'Algoritmo clássico de papel e lápis.',
        },
      ].sort(() => Math.random() - 0.5);

      return {
        id: `pattern_${Math.random().toString(36).substring(7)}`,
        equation: `${n} × 12`,
        technique: 'Multiplicação por 12 (Trachtenberg)',
        prompt: 'Como encontrar o produto por 12 em uma única passada visual?',
        options,
        calculatedAnswer: ans,
      };
    },
  ];

  const generator = templates[Math.floor(Math.random() * templates.length)];
  return generator();
}

export * from './gamification';

// ==========================================

// ==========================================
