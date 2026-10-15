/**
 * @auramath/engine - Funil de Diagnóstico, Nivelamento e Homologação
 *
 * Provê:
 * 1. Bateria diagnóstica de 10 questões progressivas (Graus 1 a 6)
 * 2. Cálculo do Grau ideal com base na pontuação (0 a 10)
 * 3. Teste de homologação de 4 questões para usuários que escolhem o nível diretamente
 */

import type { Question } from './index';

export interface DiagnosticQuestion extends Question {
  level: number; // 1 a 10
  levelName: string;
  visualTip: string;
}

export interface DiagnosticPlacementResult {
  score: number;
  grade: number;
  gradeTitle: string;
  unlockedNodeId: string;
  headline: string;
  feedback: string;
}

export interface LevelVerificationResult {
  grade: number;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  recommendedGrade: number;
  headline: string;
  feedback: string;
}

/**
 * 10 Questões Progressivas do Diagnóstico Visual AuraMath
 */
export function getDiagnostic10Questions(): DiagnosticQuestion[] {
  return [
    {
      id: 'diag_q1',
      level: 1,
      levelName: 'Adição Complementar (Grau 1)',
      equation: '7 + 8',
      prompt: 'Enxergue o complemento da dezena:',
      answer: 15,
      technique: 'Complemento de Dezena',
      hint: 'Pense em 7 + 3 + 5.',
      explanation: '7 precisa de 3 para virar 10. Sobram 5 do 8. Logo, 10 + 5 = 15.',
      visualTip: '7 + [3 + 5] ➔ (7 + 3) + 5 = 10 + 5 = 15',
    },
    {
      id: 'diag_q2',
      level: 2,
      levelName: 'Subtração por Salto (Grau 1)',
      equation: '52 - 18',
      prompt: 'Subtraia a base redonda 20 primeiro:',
      answer: 34,
      technique: 'Salto e Compensação',
      hint: '52 - 20 = 32. Como tirou 2 a mais, devolva 2.',
      explanation: '52 - 20 = 32. Devolvendo os 2 tirados a mais: 32 + 2 = 34.',
      visualTip: '52 - 20 + 2 = 32 + 2 = 34',
    },
    {
      id: 'diag_q3',
      level: 3,
      levelName: 'Fusão de Dezenas (Grau 1/2)',
      equation: '45 + 37',
      prompt: 'Some as ordens maiores da esquerda para a direita:',
      answer: 82,
      technique: 'Fusão Posicional',
      hint: '40 + 30 = 70. 5 + 7 = 12.',
      explanation: '40 + 30 = 70. Depois 5 + 7 = 12. Somando 70 + 12 = 82.',
      visualTip: '(40 + 30) + (5 + 7) = 70 + 12 = 82',
    },
    {
      id: 'diag_q4',
      level: 4,
      levelName: 'Multiplicação com Zero Terminal (Grau 2)',
      equation: '14 × 20',
      prompt: 'Dobre o 14 e acrescente a ordem de magnitude:',
      answer: 280,
      technique: 'Escala Decimal',
      hint: '14 × 2 = 28.',
      explanation: '14 × 2 = 28. Com o zero terminal: 280.',
      visualTip: '(14 × 2) × 10 = 28 × 10 = 280',
    },
    {
      id: 'diag_q5',
      level: 5,
      levelName: 'Multiplicação por 5 (Grau 2)',
      equation: '36 × 5',
      prompt: 'Multiplicar por 5 é pegar a metade e multiplicar por 10:',
      answer: 180,
      technique: 'Fator 5 (Metade da Dezena)',
      hint: 'Metade de 36 é 18.',
      explanation: 'Metade de 36 é 18. Multiplicando por 10 temos 180.',
      visualTip: '(36 ÷ 2) × 10 = 18 × 10 = 180',
    },
    {
      id: 'diag_q6',
      level: 6,
      levelName: 'Decomposição Distributiva (Grau 3)',
      equation: '15 × 12',
      prompt: 'Quebre o 12 em 10 e 2:',
      answer: 180,
      technique: 'Distribuição Rápida',
      hint: '15 × 10 = 150 e 15 × 2 = 30.',
      explanation: '15 × 10 = 150. 15 × 2 = 30. 150 + 30 = 180.',
      visualTip: '15 × (10 + 2) = 150 + 30 = 180',
    },
    {
      id: 'diag_q7',
      level: 7,
      levelName: 'Compensação por Base 100 (Grau 3)',
      equation: '99 × 7',
      prompt: 'Use a base redonda 100:',
      answer: 693,
      technique: 'Compensação Fator 99',
      hint: '100 × 7 = 700. Tire 7.',
      explanation: '100 × 7 = 700. Subtraindo 7 uma vez: 700 - 7 = 693.',
      visualTip: '(100 - 1) × 7 = 700 - 7 = 693',
    },
    {
      id: 'diag_q8',
      level: 8,
      levelName: 'Quadrado Terminado em 5 (Grau 4)',
      equation: '35²',
      prompt: 'Multiplique a dezena pelo sucessor e termine em 25:',
      answer: 1225,
      technique: 'Regra de Euclides / Védica (n5²)',
      hint: '3 × 4 = 12 seguido de 25.',
      explanation: 'Dezena 3 vezes o sucessor 4 é 12. Termina com 25: 1225.',
      visualTip: '(3 × 4) | 25 = 12 | 25 = 1225',
    },
    {
      id: 'diag_q9',
      level: 9,
      levelName: 'Diferença de Quadrados Simétrica (Grau 5)',
      equation: '48 × 52',
      prompt: 'Enxergue o pivô simétrico 50:',
      answer: 2496,
      technique: 'Diferença de Quadrados (m² - d²)',
      hint: '50² - 2² = 2500 - 4.',
      explanation: '(50 - 2)(50 + 2) = 50² - 2² = 2500 - 4 = 2496.',
      visualTip: '(50 - 2)(50 + 2) = 2500 - 4 = 2496',
    },
    {
      id: 'diag_q10',
      level: 10,
      levelName: 'Fatoração de Base 100 (Grau 6)',
      equation: '97 × 96',
      prompt: 'Déficits em relação a 100: (-3 e -4):',
      answer: 9312,
      technique: 'Fatoração Cruzada Base 100',
      hint: '100 - (3 + 4) = 93. Produto dos déficits: 3 × 4 = 12.',
      explanation: 'Déficit cruzado: 97 - 4 = 93. Produto dos déficits: (-3) × (-4) = 12. Resultado: 9312.',
      visualTip: '[100 - (3 + 4)] | (3 × 4) = 93 | 12 = 9312',
    },
  ];
}

/**
 * Mapeia a pontuação do teste diagnóstico (0 a 10) para o Grau Curricular ideal
 */
export function calculateDiagnosticPlacement(score: number): DiagnosticPlacementResult {
  const safeScore = Math.max(0, Math.min(10, Math.round(score)));

  if (safeScore <= 2) {
    return {
      score: safeScore,
      grade: 1,
      gradeTitle: 'Grau I: Fluxo Esquerda-Direita',
      unlockedNodeId: 'ADD_LEFT_RIGHT',
      headline: 'Fundações de Decomposição!',
      feedback: 'Você tem ótima intuição! Vamos começar dominando a decomposição posicional para você nunca mais precisar armar conta com "vai-um".',
    };
  }

  if (safeScore <= 4) {
    return {
      score: safeScore,
      grade: 2,
      gradeTitle: 'Grau II: Fatores Notáveis',
      unlockedNodeId: 'MULT_BY_5',
      headline: 'Aritmética Ágil Identificada!',
      feedback: 'Você já resolve adições e subtrações com facilidade. Seu ponto de partida ideal é dominar os atalhos de multiplicação por 5, 25 e 99.',
    };
  }

  if (safeScore <= 6) {
    return {
      score: safeScore,
      grade: 3,
      gradeTitle: 'Grau III: Geometria & Produtos Notáveis',
      unlockedNodeId: 'DIFF_SQUARES',
      headline: 'Pensamento Algébrico Ativo!',
      feedback: 'Impressionante! Sua mente já enxerga atalhos distributivos. Vamos acelerar com simetria geométrica e produtos notáveis instantâneos.',
    };
  }

  if (safeScore <= 8) {
    return {
      score: safeScore,
      grade: 4,
      gradeTitle: 'Grau IV: Olho de Fermi & Estimativa',
      unlockedNodeId: 'FERMI_MAGNITUDE',
      headline: 'Domínio Estrutural Avançado!',
      feedback: 'Excelente intuição matemática! Você já domina quadrados e simetrias. Você começará no treino de ordens de grandeza e estimativa ultrarrápida.',
    };
  }

  return {
    score: safeScore,
    grade: 5,
    gradeTitle: 'Grau V: Sistemas Formais Históricos',
    unlockedNodeId: 'VEDIC_BASE_100',
    headline: 'Mente de Calculista Nato!',
    feedback: 'Desempenho espetacular! Você desvendou quase todas as estruturas. Seu laboratório começa nos sistemas de Trachtenberg e Matemática Védica.',
  };
}

/**
 * Questões de Homologação específicas para o Grau escolhido pelo usuário (4 questões)
 */
export function getLevelVerificationQuestions(targetGrade: number): Question[] {
  const grade = Math.max(1, Math.min(6, targetGrade));

  switch (grade) {
    case 1:
      return [
        { id: 'v1_1', equation: '46 + 28', answer: 74, hint: '40 + 20 = 60, 6 + 8 = 14', explanation: '60 + 14 = 74' },
        { id: 'v1_2', equation: '73 - 29', answer: 44, hint: '73 - 30 + 1', explanation: '43 + 1 = 44' },
        { id: 'v1_3', equation: '65 + 18', answer: 83, hint: '65 + 20 - 2', explanation: '85 - 2 = 83' },
        { id: 'v1_4', equation: '81 - 47', answer: 34, hint: '81 - 50 + 3', explanation: '31 + 3 = 34' },
      ];
    case 2:
      return [
        { id: 'v2_1', equation: '44 × 5', answer: 220, hint: 'Metade de 44 é 22, vezes 10', explanation: '22 × 10 = 220' },
        { id: 'v2_2', equation: '16 × 25', answer: 400, hint: '16 ÷ 4 = 4, vezes 100', explanation: '4 × 100 = 400' },
        { id: 'v2_3', equation: '23 × 11', answer: 253, hint: 'Separe 2 e 3, no meio coloque 2+3', explanation: '2 [5] 3 = 253' },
        { id: 'v2_4', equation: '99 × 6', answer: 594, hint: '600 - 6', explanation: '600 - 6 = 594' },
      ];
    case 3:
      return [
        { id: 'v3_1', equation: '25²', answer: 625, hint: '2 × 3 = 6 seguido de 25', explanation: '625' },
        { id: 'v3_2', equation: '19 × 21', answer: 399, hint: '20² - 1² = 400 - 1', explanation: '399' },
        { id: 'v3_3', equation: '45²', answer: 2025, hint: '4 × 5 = 20 seguido de 25', explanation: '2025' },
        { id: 'v3_4', equation: '28 × 32', answer: 896, hint: '30² - 2² = 900 - 4', explanation: '896' },
      ];
    case 4:
      return [
        { id: 'v4_1', equation: '65²', answer: 4225, hint: '6 × 7 = 42 seguido de 25', explanation: '4225' },
        { id: 'v4_2', equation: '47 × 53', answer: 2491, hint: '50² - 3² = 2500 - 9', explanation: '2491' },
        { id: 'v4_3', equation: '36 × 12', answer: 432, hint: '36 × 10 + 36 × 2 = 360 + 72', explanation: '432' },
        { id: 'v4_4', equation: '98 × 8', answer: 784, hint: '800 - 16', explanation: '784' },
      ];
    case 5:
      return [
        { id: 'v5_1', equation: '98 × 97', answer: 9506, hint: 'Déficits -2 e -3: 95 | 06', explanation: '9506' },
        { id: 'v5_2', equation: '75²', answer: 5625, hint: '7 × 8 = 56 seguido de 25', explanation: '5625' },
        { id: 'v5_3', equation: '104 × 103', answer: 10712, hint: 'Excesso +4 e +3: 107 | 12', explanation: '10712' },
        { id: 'v5_4', equation: '39 × 41', answer: 1599, hint: '40² - 1² = 1600 - 1', explanation: '1599' },
      ];
    default:
      return [
        { id: 'v6_1', equation: '95 × 94', answer: 8930, hint: 'Déficits -5 e -6: 89 | 30', explanation: '8930' },
        { id: 'v6_2', equation: '85²', answer: 7225, hint: '8 × 9 = 72 seguido de 25', explanation: '7225' },
        { id: 'v6_3', equation: '108 × 107', answer: 11556, hint: 'Excesso +8 e +7: 115 | 56', explanation: '11556' },
        { id: 'v6_4', equation: '69 × 71', answer: 4899, hint: '70² - 1² = 4900 - 1', explanation: '4899' },
      ];
  }
}

/**
 * Avalia o teste de homologação (exige >= 75%, ou seja, 3 de 4 acertos)
 */
export function evaluateLevelVerification(
  targetGrade: number,
  correctCount: number,
  totalQuestions: number = 4
): LevelVerificationResult {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 75;

  if (passed) {
    return {
      grade: targetGrade,
      score: correctCount,
      total: totalQuestions,
      percentage,
      passed: true,
      recommendedGrade: targetGrade,
      headline: `Maestria Confirmada no Grau ${targetGrade}!`,
      feedback: `Você demonstrou domínio sólido das estruturas fundamentais com ${percentage}% de precisão. O Grau ${targetGrade} foi desbloqueado com sucesso!`,
    };
  }

  const fallbackGrade = Math.max(1, targetGrade - 1);
  return {
    grade: targetGrade,
    score: correctCount,
    total: totalQuestions,
    percentage,
    passed: false,
    recommendedGrade: fallbackGrade,
    headline: `Vamos Fortalecer a Base!`,
    feedback: `Você acertou ${correctCount} de ${totalQuestions} questões (${percentage}%). Para que você tenha máxima fluência e nenhuma frustração, recomendamos começar pelo Grau ${fallbackGrade}.`,
  };
}
