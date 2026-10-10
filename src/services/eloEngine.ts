/**
 * ==============================================================================
 * Auramath Real Elo Rating Engine & Rank Hierarchy
 * File: src/services/eloEngine.ts
 *
 * Implements:
 * - Classical Elo formula with dynamic K-factor
 * - Speed bonus multiplier for decisive rapid victories
 * - Rank tiers (Papiro -> Ábaco -> Astrônomo -> Alquimista -> Arquimedes)
 * - LocalStorage state with cloud synchronization capability
 * ==============================================================================
 */

export interface RankTier {
  id: string;
  title: string;
  minElo: number;
  maxElo: number;
  color: string;
  softColor: string;
  borderColor: string;
  romanNumeral: string;
  description: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    id: 'papiro',
    title: 'Iniciado do Papiro',
    minElo: 0,
    maxElo: 1199,
    color: 'var(--color-ink-secondary, #5C645F)',
    softColor: 'var(--color-paper, #F7F4EA)',
    borderColor: 'var(--color-border-bold, #C2BDAE)',
    romanNumeral: 'I',
    description: 'Primeiros passos no cálculo da esquerda para a direita.',
  },
  {
    id: 'abaco',
    title: 'Geômetra do Ábaco',
    minElo: 1200,
    maxElo: 1499,
    color: 'var(--color-marigold, #F2B84B)',
    softColor: 'var(--color-marigold-soft, #FFF0C9)',
    borderColor: 'var(--color-marigold-bevel, #D49A2E)',
    romanNumeral: 'II',
    description: 'Domínio de atalhos de base 10 e compensação aditiva.',
  },
  {
    id: 'astronomo',
    title: 'Astrônomo de Órbitas',
    minElo: 1500,
    maxElo: 1799,
    color: 'var(--color-iris, #6E5AA6)',
    softColor: 'var(--color-iris-soft, #E8E3F3)',
    borderColor: 'var(--color-iris-bevel, #524080)',
    romanNumeral: 'III',
    description: 'Visualização veloz de produtos notáveis e simetrias.',
  },
  {
    id: 'alquimista',
    title: 'Alquimista Algébrico',
    minElo: 1800,
    maxElo: 2099,
    color: 'var(--color-coral, #E76F61)',
    softColor: 'var(--color-coral-soft, #F8DED9)',
    borderColor: 'var(--color-coral-bevel, #C75144)',
    romanNumeral: 'IV',
    description: 'Precisão cirúrgica sem subvocalização sob alta pressão.',
  },
  {
    id: 'arquimedes',
    title: 'Mestre Arquimedes',
    minElo: 2100,
    maxElo: 9999,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    romanNumeral: 'V',
    description: 'Ápice da intuição geométrica e cálculo mental puro.',
  },
];

export interface EloMatchResult {
  previousRating: number;
  newRating: number;
  delta: number;
  opponentRating: number;
  winExpectancy: number;
  kFactor: number;
}

const STORAGE_KEY = 'auramath-elo-rating-v1';

export class EloRatingEngine {
  private userRating: number = 1200;
  private matchesPlayed: number = 0;

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.userRating = parsed.userRating ?? 1200;
        this.matchesPlayed = parsed.matchesPlayed ?? 0;
      }
    } catch {
      this.userRating = 1200;
      this.matchesPlayed = 0;
    }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userRating: this.userRating,
          matchesPlayed: this.matchesPlayed,
        })
      );
    } catch {}
  }

  public getRating(): number {
    return this.userRating;
  }

  public getMatchesPlayed(): number {
    return this.matchesPlayed;
  }

  public setRating(newRating: number): void {
    this.userRating = Math.max(100, Math.round(newRating));
    this.saveState();
  }

  /**
   * Calcula a expectativa matemática de vitória (0.0 a 1.0)
   */
  public calculateWinExpectancy(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  /**
   * Fator K dinâmico:
   * - Novatos (< 15 partidas): K = 40 (calibração rápida)
   * - Veteranos (Rating >= 1800): K = 16 (estabilidade)
   * - Padrão: K = 24
   */
  public getAdaptiveKFactor(matchesPlayed: number, rating: number): number {
    if (matchesPlayed < 15) return 40;
    if (rating >= 1800) return 16;
    return 24;
  }

  /**
   * Processa o resultado de uma partida e retorna a nova pontuação.
   * @param outcome: 1 = Vitória, 0.5 = Empate, 0 = Derrota
   * @param opponentRating: Elo do adversário
   * @param speedBonusMultiplier: multiplicador caso a vitória seja com ampla folga de tempo (1.0 a 1.2)
   */
  public recordMatchOutcome(
    outcome: 1 | 0.5 | 0,
    opponentRating: number,
    speedBonusMultiplier: number = 1.0
  ): EloMatchResult {
    const prev = this.userRating;
    const expectancy = this.calculateWinExpectancy(prev, opponentRating);
    const k = this.getAdaptiveKFactor(this.matchesPlayed, prev);

    // Variação básica
    let delta = k * (outcome - expectancy);

    // Bônus moderado por velocidade em vitórias
    if (outcome === 1 && speedBonusMultiplier > 1.0) {
      delta *= Math.min(1.2, speedBonusMultiplier);
    }

    const roundedDelta = Math.round(delta);
    const updated = Math.max(100, prev + roundedDelta);

    this.userRating = updated;
    this.matchesPlayed += 1;
    this.saveState();

    return {
      previousRating: prev,
      newRating: updated,
      delta: roundedDelta,
      opponentRating,
      winExpectancy: Number(expectancy.toFixed(3)),
      kFactor: k,
    };
  }

  /**
   * Mapeia qualquer pontuação de Elo para sua divisão de ranque correspondente.
   */
  public getRankForRating(rating: number = this.userRating): RankTier {
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
      if (rating >= RANK_TIERS[i].minElo) {
        return RANK_TIERS[i];
      }
    }
    return RANK_TIERS[0];
  }
}

export const eloEngine = new EloRatingEngine();
