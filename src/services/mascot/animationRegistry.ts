/**
 * Mascot Animation Registry — Auramath
 * Centralized, typed catalog of mascot states, SVG asset paths, frame sequences and playback metadata.
 */

export type PrismaMascotState =
  | 'idle'
  | 'thinking'
  | 'hint'
  | 'eureka'
  | 'supernova'
  | 'camouflaged'
  | 'happy'       // Alias for eureka
  | 'encouraging' // Alias for hint
  | 'hit';        // Alias for thinking

export interface MascotAnimationConfig {
  id: string;
  state: PrismaMascotState;
  title: string;
  svgPath: string;
  loop: boolean;
  frameRate?: number;
  nextState?: PrismaMascotState;
  description: string;
}

export const PRISMA_ANIMATIONS: Record<string, MascotAnimationConfig> = {
  idle: {
    id: 'prisma-idle',
    state: 'idle',
    title: 'Idle (Observação Geométrica)',
    svgPath: '/mascot/prisma-idle.svg',
    loop: true,
    description: 'Postura canônica em repouso com esquadro na mão e cauda áurea.',
  },
  thinking: {
    id: 'prisma-thinking',
    state: 'thinking',
    title: 'Thinking (Investigação & Dúvida)',
    svgPath: '/mascot/prisma-thinking.svg',
    loop: true,
    description: 'Esquadro no queixo, língua para fora e ponto de interrogação.',
  },
  hint: {
    id: 'prisma-hint',
    state: 'hint',
    title: 'Hint (Dica Pedagógica)',
    svgPath: '/mascot/prisma-hint.svg',
    loop: false,
    nextState: 'idle',
    description: 'Apontando o esquadro como agulha com vetor dourado pontilhado.',
  },
  eureka: {
    id: 'prisma-eureka',
    state: 'eureka',
    title: 'Eureka (Acerto & Salto)',
    svgPath: '/mascot/prisma-eureka.svg',
    loop: false,
    nextState: 'idle',
    description: 'Salto no ar erguendo o esquadro como troféu com estrelas nos olhos.',
  },
  supernova: {
    id: 'prisma-supernova',
    state: 'supernova',
    title: 'Supernova (Vitória de Fase & Streak)',
    svgPath: '/mascot/prisma-supernova.svg',
    loop: true,
    description: 'Auréola solar geométrica de 360° com confetes e braços abertos.',
  },
  camouflaged: {
    id: 'prisma-camouflaged',
    state: 'camouflaged',
    title: 'Camouflaged (Streak em Risco)',
    svgPath: '/mascot/prisma-camouflaged.svg',
    loop: true,
    description: 'Corpo desbotado em ardósia com contorno pontilhado sumindo.',
  },
};

/**
 * Normalizes legacy or aliased states into a canonical Prisma state.
 */
export function resolvePrismaState(state?: string): PrismaMascotState {
  if (!state) return 'idle';
  const lower = state.toLowerCase();
  if (lower === 'happy') return 'eureka';
  if (lower === 'encouraging') return 'hint';
  if (lower === 'hit') return 'thinking';
  if (PRISMA_ANIMATIONS[lower]) return lower as PrismaMascotState;
  return 'idle';
}

/**
 * Returns configuration for a given state.
 */
export function getMascotConfig(state?: string): MascotAnimationConfig {
  const resolved = resolvePrismaState(state);
  return PRISMA_ANIMATIONS[resolved] || PRISMA_ANIMATIONS.idle;
}

/**
 * Resolves an asset path taking into account subpath hosting (such as GitHub Pages /auramath/).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.replace(/^\//, '');

  // 1. In browser, check if pathname starts with /auramath
  if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/auramath')) {
    return `/auramath/${cleanPath}`;
  }

  // 2. Vite compile-time BASE_URL if configured
  const viteBase = typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL;
  if (viteBase && viteBase !== './' && viteBase !== '/') {
    const baseWithSlash = viteBase.endsWith('/') ? viteBase : `${viteBase}/`;
    return `${baseWithSlash}${cleanPath}`;
  }

  return `/${cleanPath}`;
}
