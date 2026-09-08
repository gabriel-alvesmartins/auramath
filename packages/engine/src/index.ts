/**
 * @auramath/engine - Core mental math and game mechanics
 */

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

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
  bossId: string;
  nodes: TrackNodeData[];
}

export interface BossData {
  id: string;
  grade: GradeLevel;
  name: string;
  title: string;
  lore: string;
  maxHp: number;
  attackTimeoutMs: number;
  rewardSkinId: string;
  avatarColor: string;
  weakness: string;
}

export interface SkinData {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Cosmic';
  unlocked: boolean;
  previewColor: string;
  accentColor: string;
  levelRequired?: number;
  unlockCondition?: string;
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
}

export interface GhostRunEvent {
  q: number;
  deltaMs: number;
  correct: boolean;
  input: string;
}

export interface GhostRun {
  opponentName: string;
  elo: number;
  avatar: string;
  events: GhostRunEvent[];
  totalScore: number;
  totalTimeMs: number;
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
    ],
  },
  {
    grade: 2,
    title: 'Grau II: Fatores Notáveis',
    subtitle: 'Divisores Decimais & Dimediação',
    description: 'Aproveite potências de 10: multiplique por 5 dividindo por 2, por 25 dividindo por 4.',
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
        order: 4,
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
        id: 'MULT_25',
        title: 'Multiplicação por 25',
        subtitle: 'Divida por 4 e adicione dois zeros',
        grade: 2,
        technique: 'Quarter Factor',
        prerequisites: ['MULT_5_50'],
        stars: 0,
        isLocked: true,
        order: 5,
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
        id: 'MULT_11',
        title: 'Multiplicação por 11',
        subtitle: 'O acordeão elástico: abra os lados e some o meio',
        grade: 2,
        technique: 'Elastic Accordion',
        prerequisites: ['MULT_25'],
        stars: 0,
        isLocked: true,
        order: 6,
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
    ],
  },
  {
    grade: 3,
    title: 'Grau III: Geometria & Produtos Notáveis',
    subtitle: 'Álgebra Espacial & Diferença de Quadrados',
    description: 'Resolva multiplicações complexas encontrando eixos de simetria e áreas geométricas.',
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
        order: 7,
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
        order: 8,
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
    ],
  },
  {
    grade: 4,
    title: 'Grau IV: Olho de Fermi & Estimativa',
    subtitle: 'Ordens de Grandeza & Discriminação em 3s',
    description: 'Em concursos e na vida real, saber a ordem de grandeza exata vence o cálculo minucioso.',
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
        order: 9,
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
    ],
  },
  {
    grade: 5,
    title: 'Grau V: Sistemas Formais Históricos',
    subtitle: 'Védica & Trachtenberg',
    description: 'Algoritmos compactos desenvolvidos para cálculo mental puro de alta densidade.',
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
        order: 10,
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
    ],
  },
  {
    grade: 6,
    title: 'Grau VI: Transcendência & Flash Anzan',
    subtitle: 'Soroban Mental & Aritmética Modular',
    description: 'Projeção visuoespacial relâmpago sem subvocalização, operando na velocidade do pensamento.',
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
        order: 11,
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
        ],
      },
    ],
  },
];

export const BOSS_LIST: BossData[] = [
  {
    id: 'BOSS_GRADE_1',
    grade: 1,
    name: 'Chronos, o Guardião do Fluxo',
    title: 'Arquimago do Tempo Posicional',
    lore: 'Chronos desafia sua velocidade na decomposição esquerda-direita. Acerte antes que ele inverta as correntes temporais!',
    maxHp: 500,
    attackTimeoutMs: 3500,
    rewardSkinId: 'SKIN_CHRONOS_AURA',
    avatarColor: '#00F2FE',
    weakness: 'Adição Direta e Compensação',
  },
  {
    id: 'BOSS_GRADE_2',
    grade: 2,
    name: 'O Vórtice dos Fatores',
    title: 'Colosso dos Decimais',
    lore: 'O Vórtice engole quem hesita ao dividir por 4 ou ao dobrar e cortar na metade.',
    maxHp: 750,
    attackTimeoutMs: 3200,
    rewardSkinId: 'SKIN_FACTOR_VORTEX',
    avatarColor: '#8A2BE2',
    weakness: 'Fatores 5, 25 e 11',
  },
  {
    id: 'BOSS_GRADE_3',
    grade: 3,
    name: 'O Arquiteto da Geometria',
    title: 'Mestre dos Quadrados Sagrados',
    lore: 'Manipula as áreas dimensionais de (a+b)^2 e a diferença simétrica de quadrados.',
    maxHp: 1000,
    attackTimeoutMs: 3000,
    rewardSkinId: 'SKIN_SACRED_GEOMETRY',
    avatarColor: '#FACC15',
    weakness: 'Diferença de Quadrados',
  },
  {
    id: 'BOSS_GRADE_4',
    grade: 4,
    name: 'Titã de Fermi',
    title: 'Devorador de Ordens de Grandeza',
    lore: 'Não perca tempo com unidades: estime a magnitude exata em menos de 3 segundos!',
    maxHp: 1200,
    attackTimeoutMs: 2800,
    rewardSkinId: 'SKIN_FERMI_EYE',
    avatarColor: '#FB7185',
    weakness: 'Aproximação de Ordem de Grandeza',
  },
  {
    id: 'BOSS_GRADE_5',
    grade: 5,
    name: 'Mestre Védico dos Sutras',
    title: 'Guardião dos Segredos Antigos',
    lore: 'Ele calcula por diagonais simultâneas. Cruze os produtos antes que o contra-ataque atinja.',
    maxHp: 1500,
    attackTimeoutMs: 2500,
    rewardSkinId: 'SKIN_VEDIC_MYSTIC',
    avatarColor: '#10B981',
    weakness: 'Urdhva-Tiryagbhyam',
  },
  {
    id: 'BOSS_GRADE_6',
    grade: 6,
    name: 'A Singularidade Primordial',
    title: 'Entidade de Flash Anzan',
    lore: 'O teste definitivo da consciência matemática: calcule na velocidade da luz sem palavras na mente.',
    maxHp: 2000,
    attackTimeoutMs: 2000,
    rewardSkinId: 'SKIN_GODMODE_SINGULARITY',
    avatarColor: '#E11D48',
    weakness: 'Soroban Visuoespacial',
  },
];

export const AURA_SKINS: SkinData[] = [
  {
    id: 'SKIN_DEFAULT',
    name: 'Orbe Zen',
    description: 'Aura original em ciano e violeta bioluminescente.',
    rarity: 'Common',
    unlocked: true,
    previewColor: '#00F2FE',
    accentColor: '#8A2BE2',
  },
  {
    id: 'SKIN_CHRONOS_AURA',
    name: 'Guardião do Tempo',
    description: 'Desbloqueado ao derrotar o Chefe do Grau I.',
    rarity: 'Rare',
    unlocked: true,
    previewColor: '#00F2FE',
    accentColor: '#38BDF8',
    unlockCondition: 'Derrote Chronos no Grau I',
  },
  {
    id: 'SKIN_FACTOR_VORTEX',
    name: 'Pulso de Plasma',
    description: 'Desbloqueado ao derrotar o Chefe do Grau II.',
    rarity: 'Epic',
    unlocked: false,
    previewColor: '#8A2BE2',
    accentColor: '#C084FC',
    unlockCondition: 'Derrote o Vórtice no Grau II',
  },
  {
    id: 'SKIN_SACRED_GEOMETRY',
    name: 'Supernova Estelar',
    description: 'Forjada nos templos da geometria algébrica.',
    rarity: 'Legendary',
    unlocked: false,
    previewColor: '#FACC15',
    accentColor: '#FEF08A',
    unlockCondition: 'Derrote o Arquiteto no Grau III',
  },
  {
    id: 'SKIN_GODMODE_SINGULARITY',
    name: 'Singularidade Quântica',
    description: 'A skin suprema dos mestres de Flash Anzan.',
    rarity: 'Cosmic',
    unlocked: false,
    previewColor: '#E11D48',
    accentColor: '#00F2FE',
    unlockCondition: 'Derrote a Singularidade no Grau VI',
  },
];

export const MOCK_USER_PROFILE = {
  username: 'auranauta',
  displayName: 'Alexandre Magno',
  title: 'Arquiteto Relâmpago',
  level: 18,
  currentXp: 8420,
  nextLevelXp: 10000,
  streakDays: 14,
  starsCount: 47,
  totalStars: 120,
  highestBlitzScore: 48,
  equippedSkinId: 'SKIN_DEFAULT',
  elo: 1540,
  radar: {
    speedScore: 92,
    fermiScore: 78,
    flexibilityScore: 88,
    staminaScore: 84,
    memoryScore: 74,
    archetypeTitle: 'Arquiteto Relâmpago',
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
// PROCEDURAL GENERATION ENGINES
// ==========================================

export function generateQuestion(mode: string = 'general', filters?: string[]): Question {
  const qTypes = filters && filters.length > 0
    ? filters
    : (mode !== 'general' ? [mode] : ['addition', 'subtraction', 'multiplication', 'fermi']);
  const picked = qTypes[Math.floor(Math.random() * qTypes.length)];

  if (picked === 'multiplication' || picked === 'MULT_25' || picked === 'MULT_11' || picked === 'MULT_5_50') {
    const subtype = Math.random();
    if (subtype < 0.35) {
      // 11x
      const n = Math.floor(Math.random() * 80) + 12;
      return {
        id: Math.random().toString(36).substring(7),
        equation: `${n} × 11`,
        answer: n * 11,
        technique: 'Multiplicação por 11',
        hint: `Afaste ${Math.floor(n/10)} e ${n%10}, insira a soma no meio`,
      };
    } else if (subtype < 0.7) {
      // 25x
      const mult = (Math.floor(Math.random() * 20) + 3) * 4;
      return {
        id: Math.random().toString(36).substring(7),
        equation: `${mult} × 25`,
        answer: mult * 25,
        technique: 'Fator 25',
        hint: `Divida ${mult} por 4 e adicione dois zeros`,
      };
    } else {
      // 5x
      const n = (Math.floor(Math.random() * 45) + 6) * 2;
      return {
        id: Math.random().toString(36).substring(7),
        equation: `${n} × 5`,
        answer: n * 5,
        technique: 'Fator 5',
        hint: `Metade de ${n} é ${n/2}, vezes 10`,
      };
    }
  }

  if (picked === 'DIFF_OF_SQUARES') {
    const pivot = (Math.floor(Math.random() * 6) + 3) * 10; // 30, 40, 50, etc.
    const diff = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4
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

  if (picked === 'fermi' || picked === 'FERMI_MAGNITUDE') {
    const a = Math.floor(Math.random() * 800) + 120;
    const b = Math.floor(Math.random() * 80) + 15;
    const realAns = a * b;
    const distractor1 = Math.round(realAns * 0.1);
    const distractor2 = Math.round(realAns * 10);
    const distractor3 = Math.round(realAns * 0.5);
    const options = [realAns, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${a} × ${b} ≈ ?`,
      answer: realAns,
      options,
      technique: 'Olho de Fermi',
      hint: `Aproxime ${a} e ${b} para ordens de 10`,
    };
  }

  if (picked === 'subtraction' || picked === 'SUB_COMPENSATION') {
    const a = Math.floor(Math.random() * 90) + 60;
    const b = Math.floor(Math.random() * 40) + 18;
    return {
      id: Math.random().toString(36).substring(7),
      equation: `${a} - ${b}`,
      answer: a - b,
      technique: 'Compensação Subtrativa',
      hint: `Subtraia o redondo próximo e devolva o troco`,
    };
  }

  // Default: Addition Left-to-Right
  const a = Math.floor(Math.random() * 80) + 24;
  const b = Math.floor(Math.random() * 80) + 17;
  return {
    id: Math.random().toString(36).substring(7),
    equation: `${a} + ${b}`,
    answer: a + b,
    technique: 'Adição Esquerda-Direita',
    hint: `Some as dezenas (${Math.floor(b/10)*10}) primeiro!`,
  };
}

export function generateDailyQuestions(seedDate: string = '2026-09-07'): Question[] {
  const list: Question[] = [];
  for (let i = 1; i <= 20; i++) {
    const a = 12 + ((i * 17) % 73);
    const b = 15 + ((i * 23) % 49);
    if (i % 3 === 0) {
      list.push({
        id: `daily_${i}`,
        equation: `${a} × 11`,
        answer: a * 11,
        technique: 'Acordeão Elástico (x11)',
      });
    } else if (i % 4 === 0) {
      const p = 50;
      const d = (i % 4) + 1;
      list.push({
        id: `daily_${i}`,
        equation: `${p - d} × ${p + d}`,
        answer: (p - d) * (p + d),
        technique: 'Diferença de Quadrados',
      });
    } else {
      list.push({
        id: `daily_${i}`,
        equation: `${a} + ${b}`,
        answer: a + b,
        technique: 'Fluxo Esquerda-Direita',
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

export function generateGhostRun(targetElo: number = 1500): GhostRun {
  const events: GhostRunEvent[] = [];
  let accumTime = 0;
  for (let i = 1; i <= 15; i++) {
    const delta = Math.floor(Math.random() * 800) + 1200;
    accumTime += delta;
    const isCorrect = Math.random() > 0.12;
    events.push({
      q: i,
      deltaMs: delta,
      correct: isCorrect,
      input: isCorrect ? 'OK' : 'MIS',
    });
  }
  return {
    opponentName: 'Sombra de Newton',
    elo: targetElo,
    avatar: '👻',
    events,
    totalScore: events.filter(e => e.correct).length * 100,
    totalTimeMs: accumTime,
  };
}
