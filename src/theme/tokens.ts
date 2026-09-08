/**
 * Auramath Design System Tokens
 * Dark Glassmorphism, Bioluminescent Cyber-Cosmic Palette
 */

export const colors = {
  // Backgrounds & Surfaces
  bgObsidian: '#07090E',
  surfaceGlass: 'rgba(13, 17, 26, 0.75)',
  surfaceGlassOpaque: 'rgba(13, 17, 26, 0.95)',
  surfaceCard: 'rgba(19, 25, 38, 0.85)',
  surfaceCardLight: 'rgba(28, 36, 54, 0.7)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.04)',
  surfaceSubtleHover: 'rgba(255, 255, 255, 0.08)',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderHighlight: 'rgba(255, 255, 255, 0.16)',
  borderGlowCyan: 'rgba(0, 242, 254, 0.35)',
  borderGlowViolet: 'rgba(138, 43, 226, 0.35)',

  // Primary Bioluminescent Accents
  primaryCyan: '#00F2FE',
  primaryCyanDim: 'rgba(0, 242, 254, 0.15)',
  accentViolet: '#8A2BE2',
  accentVioletDim: 'rgba(138, 43, 226, 0.15)',
  plasmaMagenta: '#E11D48',
  plasmaMagentaDim: 'rgba(225, 29, 72, 0.15)',
  goldStellar: '#FACC15',
  goldStellarDim: 'rgba(250, 204, 21, 0.15)',

  // Semantic Feedback
  successEmerald: '#10B981',
  successEmeraldDim: 'rgba(16, 185, 129, 0.15)',
  errorCoral: '#FB7185',
  errorCoralDim: 'rgba(251, 113, 133, 0.15)',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',
};

export const spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space10: 40,
  space12: 48,
  space16: 64,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    display: 'SpaceGrotesk',
    mono: 'JetBrainsMono',
    body: 'Inter',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 32,
    equation: 52,
  },
};

export const glows = {
  cyan: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  violet: {
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  gold: {
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  coral: {
    shadowColor: '#FB7185',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const AURA_COMBO_STAGES = [
  { stage: 1, name: 'Spark', minCombo: 1, color: colors.primaryCyan, label: 'Centelha Zen' },
  { stage: 2, name: 'Surge', minCombo: 5, color: '#38BDF8', label: 'Pulso de Plasma' },
  { stage: 3, name: 'Overdrive', minCombo: 10, color: colors.accentViolet, label: 'Vórtice Hipersônico' },
  { stage: 4, name: 'Supernova', minCombo: 20, color: colors.goldStellar, label: 'Fusão Cósmica' },
  { stage: 5, name: 'Singularity', minCombo: 35, color: colors.plasmaMagenta, label: 'Godmode Quântico' },
];

export function getAuraStage(combo: number) {
  if (combo >= 35) return AURA_COMBO_STAGES[4];
  if (combo >= 20) return AURA_COMBO_STAGES[3];
  if (combo >= 10) return AURA_COMBO_STAGES[2];
  if (combo >= 5) return AURA_COMBO_STAGES[1];
  return AURA_COMBO_STAGES[0];
}

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  glows,
  AURA_COMBO_STAGES,
  getAuraStage,
};

export default tokens;
