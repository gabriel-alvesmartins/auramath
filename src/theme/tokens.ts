/**
 * ==============================================================================
 * Auramath Design System Tokens
 * File: src/theme/tokens.ts
 *
 * Provides:
 * - Sober, WCAG AA/AAA compliant color tokens for Dark Obsidian & Paper Light
 * - 3D tactile extrusion and depression depth tokens
 * - Layout constraints and elevation helpers
 * - Backward-compatible exports for existing game & UI components
 * ==============================================================================
 */

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  borderSubtle: string;
  borderBold: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  brand: string;
  brandBevel: string;
  brandText: string;
  brandSurface: string;
  success: string;
  successBevel: string;
  successSurface: string;
  alert: string;
  alertBevel: string;
  alertSurface: string;
  gold: string;
  goldBevel: string;
  goldSurface: string;
  neutralBg: string;
  neutralBevel: string;
  neutralText: string;
  // Rebrand 01.1 — "Matemática como descoberta"
  paper: string;
  cream: string;
  ink: string;
  inkSecondary: string;
  verdigris: string;
  verdigrisBevel: string;
  verdigrisSoft: string;
  marigold: string;
  marigoldBevel: string;
  marigoldSoft: string;
  coral: string;
  coralBevel: string;
  coralSoft: string;
  iris: string;
  irisBevel: string;
  irisSoft: string;
  paperBevelSubtle: string;
  paperBevelBold: string;
}

export const brandTokens = {
  paper: '#F7F4EA',
  cream: '#FFFDF6',
  ink: '#202522',
  inkSecondary: '#5C645F',
  borderSubtle: '#D9D5C8',
  borderBold: '#C2BDAE',
  paperBevelSubtle: '#D9D5C8',
  paperBevelBold: '#C2BDAE',
  verdigris: '#176B5B',
  verdigrisBevel: '#104E42',
  verdigrisSoft: '#DCEBE5',
  marigold: '#F2B84B',
  marigoldBevel: '#D49A2E',
  marigoldSoft: '#FFF0C9',
  coral: '#E76F61',
  coralBevel: '#C75144',
  coralSoft: '#F8DED9',
  iris: '#6E5AA6',
  irisBevel: '#524080',
  irisSoft: '#E8E3F3',
  paperBeige: '#EFE7D5',
  trackBg: '#EFE7D5',
  bgDesktop: '#E5DEC9',
  inkDarkBg: '#202522',
  inkDarkSurface: '#2B312D',
};

export const rebrandTokens = brandTokens;

export const darkColors: ThemeColors = {
  bgBase: '#0B0F19',
  bgSurface: '#131B2E',
  bgElevated: '#1E293B',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderBold: 'rgba(255, 255, 255, 0.16)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',
  brand: '#0284C7',
  brandBevel: '#0369A1',
  brandText: '#FFFFFF',
  brandSurface: 'rgba(2, 132, 199, 0.15)',
  success: '#059669',
  successBevel: '#047857',
  successSurface: 'rgba(5, 150, 105, 0.15)',
  alert: '#E11D48',
  alertBevel: '#9F1239',
  alertSurface: 'rgba(225, 29, 72, 0.15)',
  gold: '#D97706',
  goldBevel: '#B45309',
  goldSurface: 'rgba(217, 119, 6, 0.15)',
  neutralBg: '#1E293B',
  neutralBevel: '#0F172A',
  neutralText: '#F8FAFC',
  // Rebrand 01.1 semantic mappings (Dark mineral ink)
  paper: '#F7F4EA',
  cream: '#FFFDF6',
  ink: '#F7F4EA',
  inkSecondary: '#94A3B8',
  verdigris: '#176B5B',
  verdigrisBevel: '#104E42',
  verdigrisSoft: 'rgba(23, 107, 91, 0.25)',
  marigold: '#F2B84B',
  marigoldBevel: '#D49A2E',
  marigoldSoft: 'rgba(242, 184, 75, 0.25)',
  coral: '#E76F61',
  coralBevel: '#C75144',
  coralSoft: 'rgba(231, 111, 97, 0.25)',
  iris: '#6E5AA6',
  irisBevel: '#524080',
  irisSoft: 'rgba(110, 90, 166, 0.25)',
  paperBevelSubtle: '#D9D5C8',
  paperBevelBold: '#C2BDAE',
};

export const lightColors: ThemeColors = {
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgElevated: '#F1F5F9',
  borderSubtle: 'rgba(15, 23, 42, 0.08)',
  borderBold: 'rgba(15, 23, 42, 0.16)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#F8FAFC',
  brand: '#0284C7',
  brandBevel: '#0369A1',
  brandText: '#FFFFFF',
  brandSurface: 'rgba(2, 132, 199, 0.10)',
  success: '#059669',
  successBevel: '#047857',
  successSurface: 'rgba(5, 150, 105, 0.12)',
  alert: '#E11D48',
  alertBevel: '#9F1239',
  alertSurface: 'rgba(225, 29, 72, 0.12)',
  gold: '#D97706',
  goldBevel: '#B45309',
  goldSurface: 'rgba(217, 119, 6, 0.12)',
  neutralBg: '#E2E8F0',
  neutralBevel: '#CBD5E1',
  neutralText: '#0F172A',
  // Rebrand 01.1 semantic mappings (Paper & Cream)
  paper: '#F7F4EA',
  cream: '#FFFDF6',
  ink: '#202522',
  inkSecondary: '#5C645F',
  verdigris: '#176B5B',
  verdigrisBevel: '#104E42',
  verdigrisSoft: '#DCEBE5',
  marigold: '#F2B84B',
  marigoldBevel: '#D49A2E',
  marigoldSoft: '#FFF0C9',
  coral: '#E76F61',
  coralBevel: '#C75144',
  coralSoft: '#F8DED9',
  iris: '#6E5AA6',
  irisBevel: '#524080',
  irisSoft: '#E8E3F3',
  paperBevelSubtle: '#D9D5C8',
  paperBevelBold: '#C2BDAE',
};

export const depth = {
  extrusion: {
    sm: 3,
    md: 4,
    lg: 6,
  },
  depression: {
    sm: 2,
    md: 3,
    lg: 4,
  },
};

export const layout = {
  maxWidth: 430,
  minWidth: 320,
  statusBarHeight: 44,
  headerHeight: 52,
  bottomBarHeight: 68,
  touchTargetMin: 44,
};

export function get3DButtonShadow(bevelColor: string, extrusion: number = 4, isPressed: boolean = false): string {
  if (isPressed) {
    return `0 1px 0 ${bevelColor}`;
  }
  return `0 ${extrusion}px 0 ${bevelColor}`;
}

export function getElevationShadow(mode: ThemeMode = 'dark', level: 'sm' | 'md' | 'lg' = 'md'): string {
  const isDark = mode === 'dark';
  switch (level) {
    case 'sm':
      return isDark ? '0 2px 4px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(15, 23, 42, 0.06)';
    case 'lg':
      return isDark ? '0 12px 24px rgba(0, 0, 0, 0.6)' : '0 12px 24px rgba(15, 23, 42, 0.12)';
    case 'md':
    default:
      return isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(15, 23, 42, 0.08)';
  }
}

// --------------------------------------------------------------------------
// Backward-Compatible Component Exports
// --------------------------------------------------------------------------

export const colors = {
  // Backgrounds & Surfaces (Editorial Paper & Mineral Ink)
  bgObsidian: '#202522',
  surfaceGlass: 'rgba(255, 253, 246, 0.95)',
  surfaceGlassOpaque: '#FFFDF6',
  surfaceCard: '#FFFDF6',
  surfaceCardLight: '#FFFDF6',
  surfaceSubtle: 'rgba(32, 37, 34, 0.04)',
  surfaceSubtleHover: 'rgba(32, 37, 34, 0.08)',

  // Borders
  borderSubtle: '#D9D5C8',
  borderBold: '#C2BDAE',
  borderHighlight: '#C2BDAE',
  borderGlowCyan: 'rgba(23, 107, 91, 0.25)',
  borderGlowViolet: 'rgba(110, 90, 166, 0.25)',

  // Primary Editorial Discovery Accents
  primaryCyan: '#176B5B', // Verdigris signature
  primaryCyanDim: 'rgba(23, 107, 91, 0.15)',
  accentViolet: '#6E5AA6', // Iris structural accent
  accentVioletDim: 'rgba(110, 90, 166, 0.15)',
  plasmaMagenta: '#E76F61', // Coral adjustment accent
  plasmaMagentaDim: 'rgba(231, 111, 97, 0.15)',
  goldStellar: '#F2B84B', // Marigold insight accent
  goldStellarDim: 'rgba(242, 184, 75, 0.15)',

  // Semantic Feedback
  successEmerald: '#176B5B',
  successEmeraldDim: 'rgba(23, 107, 91, 0.15)',
  errorCoral: '#E76F61',
  errorCoralDim: 'rgba(231, 111, 97, 0.15)',

  // Typography
  textPrimary: '#202522',
  textSecondary: '#5C645F',
  textMuted: '#8A938E',
  textDisabled: '#C2BDAE',

  // Rebrand 01.1 direct color access
  paper: brandTokens.paper,
  cream: brandTokens.cream,
  ink: brandTokens.ink,
  inkSecondary: brandTokens.inkSecondary,
  paperBevelSubtle: brandTokens.paperBevelSubtle,
  paperBevelBold: brandTokens.paperBevelBold,
  verdigris: brandTokens.verdigris,
  verdigrisBevel: brandTokens.verdigrisBevel,
  verdigrisSoft: brandTokens.verdigrisSoft,
  marigold: brandTokens.marigold,
  marigoldBevel: brandTokens.marigoldBevel,
  marigoldSoft: brandTokens.marigoldSoft,
  coral: brandTokens.coral,
  coralBevel: brandTokens.coralBevel,
  coralSoft: brandTokens.coralSoft,
  iris: brandTokens.iris,
  irisBevel: brandTokens.irisBevel,
  irisSoft: brandTokens.irisSoft,
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
    display: 'Plus Jakarta Sans, sans-serif',
    mono: 'JetBrains Mono, monospace',
    body: 'Inter, sans-serif',
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
    shadowColor: '#176B5B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  violet: {
    shadowColor: '#6E5AA6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gold: {
    shadowColor: '#F2B84B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  coral: {
    shadowColor: '#E76F61',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const AURA_COMBO_STAGES = [
  { stage: 1, name: 'Dot', minCombo: 1, color: brandTokens.verdigris, label: 'Observação' },
  { stage: 2, name: 'Line', minCombo: 5, color: brandTokens.verdigris, label: 'Conexão' },
  { stage: 3, name: 'Shape', minCombo: 10, color: brandTokens.iris, label: 'Estrutura' },
  { stage: 4, name: 'Pattern', minCombo: 20, color: brandTokens.marigold, label: 'Reconhecimento' },
  { stage: 5, name: 'Insight', minCombo: 35, color: brandTokens.coral, label: 'Antecipação' },
];

export function getAuraStage(combo: number) {
  if (combo >= 35) return AURA_COMBO_STAGES[4];
  if (combo >= 20) return AURA_COMBO_STAGES[3];
  if (combo >= 10) return AURA_COMBO_STAGES[2];
  if (combo >= 5) return AURA_COMBO_STAGES[1];
  return AURA_COMBO_STAGES[0];
}

export const themeTokens = {
  dark: darkColors,
  light: lightColors,
  depth,
  layout,
};

export const tokens = {
  brandTokens,
  rebrandTokens,
  colors,
  darkColors,
  lightColors,
  spacing,
  radii,
  typography,
  glows,
  depth,
  layout,
  AURA_COMBO_STAGES,
  getAuraStage,
  get3DButtonShadow,
  getElevationShadow,
};

export default tokens;
