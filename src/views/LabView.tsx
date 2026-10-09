import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Sparkles, Check, ChevronRight, Layers, Sliders, Eye, ArrowRight, Compass, X } from 'lucide-react';
import { Aura3DButton } from '../components/tactile';
import { audioSynth } from '../services/audioSynth';

export interface LabViewProps {
  onClose?: () => void;
  initialTab?: 'caderno' | 'lab';
}

interface StrategyEntry {
  id: string;
  category: 'Aritmética' | 'Álgebra' | 'Percentuais' | 'Geometria';
  level: number;
  title: string;
  subtitle: string;
  formula: string;
  explanation: string;
  sampleExample: string;
  practiceCount: number;
  difficulty: number; // 1 to 5
  tags: string[];
}

const STRATEGIES_CATALOG: StrategyEntry[] = [
  {
    id: 'mult_25',
    category: 'Aritmética',
    level: 1,
    title: 'Multiplicar por 25',
    subtitle: 'O Atalho da Quarta Parte',
    formula: 'x × 25 = (x × 100) ÷ 4',
    explanation: 'Como 25 é um quarto de 100, basta adicionar dois zeros e dividir por 4 duas vezes (metade da metade).',
    sampleExample: '48 × 25 → 4.800 ÷ 4 = 1.200',
    practiceCount: 18,
    difficulty: 2,
    tags: ['Base 100', 'Quarta Parte', 'Fator Amigável'],
  },
  {
    id: 'diff_squares',
    category: 'Álgebra',
    level: 2,
    title: 'Diferença de Quadrados',
    subtitle: 'Simetria Algebrizada',
    formula: '(a − b)(a + b) = a² − b²',
    explanation: 'Multiplicações equidistantes de um número redondo convertem-se na diferença entre o quadrado do centro e o quadrado da distância.',
    sampleExample: '48 × 52 → (50 − 2)(50 + 2) = 2.500 − 4 = 2.496',
    practiceCount: 24,
    difficulty: 3,
    tags: ['Simetria', 'Pivô 50', 'Produtos Notáveis'],
  },
  {
    id: 'mult_11',
    category: 'Aritmética',
    level: 1,
    title: 'Multiplicar por 11',
    subtitle: 'O Efeito Acordeão',
    formula: 'ab × 11 = a | (a + b) | b',
    explanation: 'Afaste os algarismos das pontas e insira no meio a soma dos dois algarismos.',
    sampleExample: '53 × 11 → 5 _ 3 com (5 + 3 = 8) no centro = 583',
    practiceCount: 31,
    difficulty: 1,
    tags: ['Acordeão', 'Soma Central', 'Mental Instantâneo'],
  },
  {
    id: 'reverse_percent',
    category: 'Percentuais',
    level: 2,
    title: 'Porcentagem Reversa',
    subtitle: 'A Regra da Comutatividade',
    formula: 'x% de y = y% de x',
    explanation: 'A porcentagem é uma multiplicação commutativa. 16% de 50 é idêntico e muito mais fácil de calcular como 50% de 16.',
    sampleExample: '16% de 50 → 50% de 16 = 8',
    practiceCount: 15,
    difficulty: 2,
    tags: ['Comutatividade', 'Inversão', 'Frações Notáveis'],
  },
  {
    id: 'squares_ending_5',
    category: 'Álgebra',
    level: 2,
    title: 'Quadrados Terminados em 5',
    subtitle: 'A Regra do Sucessor',
    formula: '(10a + 5)² = a(a + 1) × 100 + 25',
    explanation: 'Multiplique o algarismo das dezenas pelo seu sucessor e concatene 25 no final.',
    sampleExample: '75² → 7 × 8 = 56 concatenado com 25 = 5.625',
    practiceCount: 19,
    difficulty: 2,
    tags: ['Quadrados Rápidos', 'Sucessor', 'Exponenciação'],
  },
  {
    id: 'sub_compensation',
    category: 'Aritmética',
    level: 1,
    title: 'Compensação Subtrativa',
    subtitle: 'Pivô do Número Redondo',
    formula: 'x − (p − d) = (x − p) + d',
    explanation: 'Subtrair um número perto de uma dezena redonda é mais simples subtraindo a dezena e devolvendo a diferença.',
    sampleExample: '134 − 78 → 134 − 80 + 2 = 54 + 2 = 56',
    practiceCount: 22,
    difficulty: 1,
    tags: ['Decomposição', 'Pivô Redondo', 'Fluxo Esquerda-Direita'],
  },
  {
    id: 'div_5',
    category: 'Aritmética',
    level: 1,
    title: 'Divisão Rápida por 5',
    subtitle: 'Dobra e Desloca a Vírgula',
    formula: 'x ÷ 5 = (x × 2) ÷ 10',
    explanation: 'Dividir por 5 equivale a dobrar o número e dividir por 10 (deslocar a vírgula para a esquerda).',
    sampleExample: '240 ÷ 5 → 480 ÷ 10 = 48',
    practiceCount: 14,
    difficulty: 1,
    tags: ['Divisão Expressa', 'Fator 10', 'Dobre e Desloque'],
  },
  {
    id: 'mult_50',
    category: 'Aritmética',
    level: 1,
    title: 'Multiplicação por 50',
    subtitle: 'Metade da Centena',
    formula: 'x × 50 = (x ÷ 2) × 100',
    explanation: 'Multiplicar por 50 é pegar a metade exata do número e multiplicá-la por 100.',
    sampleExample: '64 × 50 → 32 × 100 = 3.200',
    practiceCount: 20,
    difficulty: 1,
    tags: ['Metade', 'Base 100', 'Escala Decimal'],
  },
];

export function LabView({ onClose, initialTab = 'caderno' }: LabViewProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'caderno' | 'lab'>(initialTab);

  // Search & Filter state for Caderno (Figma 1:2198)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Interactive Simulator 1 state (Euclidean Decompositions with Anchors - Figma 1:1874)
  const [baseAnchor, setBaseAnchor] = useState(100);
  const [deltaDiff, setDeltaDiff] = useState(2); // (100 - 2) = 98
  const [multiplier, setMultiplier] = useState(6);

  // Interactive Simulator 2 state ((a + b)² geometric partition)
  const [termA, setTermA] = useState(4);
  const [termB, setTermB] = useState(3);

  // Filtered Strategies
  const filteredStrategies = useMemo(() => {
    return STRATEGIES_CATALOG.filter((item) => {
      const matchCat = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div
      style={{
        padding: '16px',
        paddingBottom: onClose ? '24px' : '96px',
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
      }}
    >
      {/* Optional Top Dismiss Bar when rendered as Modal/Sheet */}
      {onClose && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--color-verdigris, #176B5B)" />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Compêndio de Descoberta & Lab
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              audioSynth.playKeypressTick();
              onClose();
            }}
            aria-label="Fechar Compêndio"
            style={{
              background: 'var(--color-bg-surface, #FFFDF6)',
              border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
              borderRadius: '10px',
              color: 'var(--color-ink-secondary, #5C645F)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* 1. Sub-Tab Segmented Switcher (Caderno vs Laboratório) */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'var(--color-paper, #F7F4EA)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '16px',
          boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('caderno');
            audioSynth.playKeypressTick();
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeSubTab === 'caderno' ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
            color: activeSubTab === 'caderno' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'caderno' ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
          }}
        >
          <BookOpen size={16} />
          Biblioteca de Macetes
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSubTab('lab');
            audioSynth.playKeypressTick();
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeSubTab === 'lab' ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
            color: activeSubTab === 'lab' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: activeSubTab === 'lab' ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.12s ease',
          }}
        >
          <Sliders size={16} />
          Laboratório Tátil
        </button>
      </div>

      {activeSubTab === 'caderno' ? (
        /* ==============================================================
           CADERNO: BIBLIOTECA DE MACETES (FIGMA SCREEN 1:2198)
           ============================================================== */
        <div>
          {/* Eyebrow & Title */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                  border: '1px solid var(--color-verdigris, #176B5B)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-verdigris, #176B5B)' }} />
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: 'var(--color-verdigris, #176B5B)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  § 04 · COMPÊNDIO DE ESTRATÉGIAS
                </span>
              </div>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ARQUIVO VIVO
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 4px',
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Meu Caderno
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-secondary, #5C645F)', margin: 0, lineHeight: 1.45 }}>
              Seu acervo pessoal de atalhos conceituais e padrões dominados.
            </p>
          </div>

          {/* Master Metrics Pill Grid (Figma 1:2214) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
                borderRadius: '20px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  INDEXADOS
                </span>
                <BookOpen size={14} color="var(--color-iris, #6E5AA6)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-mono-tabular" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-iris, #6E5AA6)', lineHeight: 1 }}>
                  14
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-ink-secondary, #5C645F)' }}>
                  Axiomas
                </span>
              </div>
              <div style={{ height: '5px', borderRadius: '4px', backgroundColor: 'var(--color-border-subtle, #D9D5C8)', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '70%', backgroundColor: 'var(--color-iris, #6E5AA6)', borderRadius: '4px' }} />
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
                borderRadius: '20px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  CRISTALIZADOS
                </span>
                <Sparkles size={14} color="var(--color-verdigris, #176B5B)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="font-mono-tabular" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-verdigris, #176B5B)', lineHeight: 1 }}>
                  03
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-ink-secondary, #5C645F)' }}>
                  Domínio Pleno
                </span>
              </div>
              <div style={{ height: '5px', borderRadius: '4px', backgroundColor: 'var(--color-border-subtle, #D9D5C8)', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '85%', backgroundColor: 'var(--color-verdigris, #176B5B)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* Search Bar (Figma 1:2244) */}
          <div
            style={{
              position: 'relative',
              marginBottom: '12px',
            }}
          >
            <Search
              size={18}
              color="var(--color-ink-secondary, #5C645F)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar uma estratégia, axioma ou atalho..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '16px',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                color: 'var(--color-text-primary, #202522)',
                fontSize: '0.84rem',
                fontFamily: 'inherit',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category Filter Pills (Figma 1:2255) */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '16px',
              scrollbarWidth: 'none',
            }}
          >
            {['Todas', 'Aritmética', 'Álgebra', 'Percentuais'].map((cat) => {
              const isSel = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    audioSynth.playKeypressTick();
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: isSel ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-subtle, #D9D5C8)',
                    backgroundColor: isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-bg-surface, #FFFDF6)',
                    color: isSel ? '#FFFFFF' : 'var(--color-text-primary, #202522)',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSel ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : '0 1px 0 var(--color-border-bold, #C2BDAE)',
                  }}
                >
                  {cat} {cat === 'Todas' ? `(${STRATEGIES_CATALOG.length})` : ''}
                </button>
              );
            })}
          </div>

          {/* List of Conceptual Strategy Cards (Figma 1:2284) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredStrategies.map((strat) => (
              <div
                key={strat.id}
                style={{
                  backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                  border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
                  borderRadius: '24px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Card Header & Metadata */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--color-verdigris, #176B5B)',
                        backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-verdigris-bevel, #104E42)',
                      }}
                    >
                      {strat.category} · Nível {strat.level}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 600 }}>
                      {strat.practiceCount}x praticado
                    </span>
                  </div>

                  {/* Difficulty pips */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map((pip) => (
                      <span
                        key={pip}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: pip <= strat.difficulty ? 'var(--color-marigold, #F2B84B)' : 'var(--color-border-subtle, #D9D5C8)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Title & Subtitle */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      margin: '0 0 2px',
                      color: 'var(--color-text-primary, #202522)',
                      fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                    }}
                  >
                    {strat.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--color-ink-secondary, #5C645F)' }}>
                    {strat.subtitle}
                  </div>
                </div>

                {/* Formal Formula Inscription Box (Figma 1:2297) */}
                <div
                  style={{
                    backgroundColor: 'var(--color-paper, #F7F4EA)',
                    border: '1px solid var(--color-border-subtle, #D9D5C8)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      FÓRMULA
                    </span>
                    <span
                      className="font-mono-tabular"
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: 'var(--color-verdigris, #176B5B)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {strat.formula}
                    </span>
                  </div>
                </div>

                {/* Didactic Breakdown & Example */}
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-primary, #202522)', margin: 0, lineHeight: 1.45 }}>
                  {strat.explanation}
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--color-bg-base, #F7F4EA)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: 'var(--color-ink-secondary, #5C645F)',
                    fontWeight: 600,
                  }}
                >
                  <strong style={{ color: 'var(--color-text-primary, #202522)' }}>Aplicação:</strong> {strat.sampleExample}
                </div>

                {/* Action CTA */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <Aura3DButton
                    variant="brand"
                    size="sm"
                    icon={<ArrowRight size={14} />}
                    onClick={() => {
                      audioSynth.playKeypressTick();
                      setActiveSubTab('lab');
                    }}
                  >
                    Simular no Laboratório
                  </Aura3DButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ==============================================================
           LABORATÓRIO TÁTIL & GEOMÉTRICO (FIGMA SCREEN 1:1808)
           ============================================================== */
        <div>
          {/* Header */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                  border: '1px solid var(--color-verdigris, #176B5B)',
                }}
              >
                <Sliders size={12} color="var(--color-verdigris, #176B5B)" />
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: 'var(--color-verdigris, #176B5B)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  § 03 · LABORATÓRIO DE ESTRATÉGIAS
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-marigold, #F2B84B)',
                  backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                }}
              >
                3/5 Hoje
              </span>
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 4px',
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Laboratório
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-secondary, #5C645F)', margin: 0, lineHeight: 1.45 }}>
              Escolha uma habilidade e veja os números revelarem sua geometria interior.
            </p>
          </div>

          {/* SIMULATOR 1: Decomposição Euclidiana com Âncoras (Figma 1:1874) */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
              boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
              borderRadius: '24px',
              padding: '18px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--color-iris, #6E5AA6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                EXPERIMENTO 01 · ÂNCORA EUCLIDIANA
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
                75% Dominado
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-primary, #202522)' }}>
              Decomposição por Âncoras Decimais
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 14px', lineHeight: 1.4 }}>
              Quebre números rígidos em âncoras redondas para calcular mentalmente sem esforço.
            </p>

            {/* Sliders for (baseAnchor - deltaDiff) * multiplier */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--color-paper, #F7F4EA)', padding: '10px', borderRadius: '14px', border: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Fator: {baseAnchor - deltaDiff}</span>
                  <span className="font-mono-tabular" style={{ color: 'var(--color-verdigris, #176B5B)' }}>({baseAnchor} − {deltaDiff})</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={deltaDiff}
                  onChange={(e) => setDeltaDiff(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-verdigris, #176B5B)' }}
                />
              </div>

              <div style={{ flex: 1, backgroundColor: 'var(--color-paper, #F7F4EA)', padding: '10px', borderRadius: '14px', border: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Multiplicador</span>
                  <span className="font-mono-tabular" style={{ color: 'var(--color-iris, #6E5AA6)' }}>× {multiplier}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="9"
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-iris, #6E5AA6)' }}
                />
              </div>
            </div>

            {/* Euclidean Visual Anchor Diagram (Figma 1:1887) */}
            <div
              style={{
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '18px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="font-mono-tabular" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-iris, #6E5AA6)' }}>
                  {baseAnchor - deltaDiff} × {multiplier}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--color-ink-secondary, #5C645F)' }}>=</span>
                <span className="font-mono-tabular" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-verdigris, #176B5B)' }}>
                  ({baseAnchor} − {deltaDiff}) × {multiplier}
                </span>
              </div>

              {/* Graphic Arcs */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0', borderTop: '1px dashed var(--color-border-subtle, #D9D5C8)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-verdigris, #176B5B)', textTransform: 'uppercase' }}>
                    Âncora Principal
                  </div>
                  <div className="font-mono-tabular" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-verdigris, #176B5B)' }}>
                    {baseAnchor * multiplier}
                  </div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
                    ({baseAnchor} × {multiplier})
                  </span>
                </div>

                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-coral, #E76F61)' }}>
                  −
                </span>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-coral, #E76F61)', textTransform: 'uppercase' }}>
                    Folga Subtrativa
                  </div>
                  <div className="font-mono-tabular" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-coral, #E76F61)' }}>
                    {deltaDiff * multiplier}
                  </div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
                    ({deltaDiff} × {multiplier})
                  </span>
                </div>

                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-ink, #202522)' }}>
                  =
                </span>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-ink, #202522)', textTransform: 'uppercase' }}>
                    Resultado Líquido
                  </div>
                  <div className="font-mono-tabular" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-ink, #202522)' }}>
                    {(baseAnchor - deltaDiff) * multiplier}
                  </div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--color-verdigris, #176B5B)', fontWeight: 800 }}>
                    Δ Exato
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: Visualização Cinética de (a + b)² */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
              boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
              borderRadius: '24px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--color-marigold, #F2B84B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                EXPERIMENTO 02 · GEOMETRIA ALGÉBRICA
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
                (a + b)² = a² + 2ab + b²
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-primary, #202522)' }}>
              Área Cinética do Quadrado da Soma
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 14px', lineHeight: 1.4 }}>
              Arraste os lados $a$ e $b$ para ver a equação desdobrar-se em blocos táteis sem decoreba.
            </p>

            {/* Sliders */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--color-paper, #F7F4EA)', padding: '10px', borderRadius: '14px', border: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Termo a</span>
                  <span className="font-mono-tabular" style={{ color: 'var(--color-verdigris, #176B5B)', fontWeight: 800 }}>{termA}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={termA}
                  onChange={(e) => setTermA(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-verdigris, #176B5B)' }}
                />
              </div>

              <div style={{ flex: 1, backgroundColor: 'var(--color-paper, #F7F4EA)', padding: '10px', borderRadius: '14px', border: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span>Termo b</span>
                  <span className="font-mono-tabular" style={{ color: 'var(--color-marigold, #F2B84B)', fontWeight: 800 }}>{termB}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={termB}
                  onChange={(e) => setTermB(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-marigold, #F2B84B)' }}
                />
              </div>
            </div>

            {/* Geometric Square Canvas */}
            <div
              style={{
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `${termA * 26}px ${termB * 26}px`,
                  gridTemplateRows: `${termA * 26}px ${termB * 26}px`,
                  gap: '4px',
                  margin: '0 auto',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* a² */}
                <div
                  style={{
                    backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                    border: '2px solid var(--color-verdigris, #176B5B)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: 'var(--color-verdigris, #176B5B)',
                  }}
                >
                  a² ({termA * termA})
                </div>

                {/* ab */}
                <div
                  style={{
                    backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                    border: '2px solid var(--color-marigold, #F2B84B)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    color: '#9C6F12',
                  }}
                >
                  ab ({termA * termB})
                </div>

                {/* ab */}
                <div
                  style={{
                    backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                    border: '2px solid var(--color-marigold, #F2B84B)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    color: '#9C6F12',
                  }}
                >
                  ab ({termA * termB})
                </div>

                {/* b² */}
                <div
                  style={{
                    backgroundColor: 'var(--color-coral-soft, #F8DED9)',
                    border: '2px solid var(--color-coral, #E76F61)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: 'var(--color-coral, #E76F61)',
                  }}
                >
                  b² ({termB * termB})
                </div>
              </div>

              {/* Equation Sum Breakdown */}
              <div
                className="font-mono-tabular"
                style={{
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary, #202522)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <span>({termA} + {termB})² =</span>
                <span style={{ color: 'var(--color-verdigris, #176B5B)' }}>{termA * termA}</span>
                <span>+</span>
                <span style={{ color: '#9C6F12' }}>2 × {termA * termB}</span>
                <span>+</span>
                <span style={{ color: 'var(--color-coral, #E76F61)' }}>{termB * termB}</span>
                <span>=</span>
                <span style={{ color: 'var(--color-ink, #202522)', textDecoration: 'underline' }}>
                  {(termA + termB) * (termA + termB)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabView;
