import React, { useState, useMemo, useEffect } from 'react';
import {
  Swords, Calendar, Crown, Trophy, Check, X, Sparkles, User, Clock,
  ArrowRight, ArrowLeft, Shield, Zap, ChevronRight, Play, Lightbulb, Share2, Flame,
  type LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, generateDailyQuestions, Question, MASTERY_CHALLENGES } from '../engine';
import { audioSynth } from '../services/audioSynth';
import { Aura3DButton, MatchMadnessGrid } from '../components/tactile';
import { AuraMascotWeb } from '../components/AuraMascotWeb';
import { LeagueLeaderboardView } from '../components/gamification';
import { gamificationEngine } from '../services/gamificationEngine';
import { eloEngine, RANK_TIERS, EloMatchResult } from '../services/eloEngine';
import { ghostMatchmaker, GhostOpponent } from '../services/ghostMatchmaker';
import { useAuth } from '../contexts/AuthContext';

export type DuelSubMode = 'live' | 'daily' | 'split' | 'mastery' | 'match_madness';

interface DuelModeDefinition {
  id: DuelSubMode;
  title: string;
  tagline: string;
  category: string;
  durationLabel: string;
  icon: LucideIcon;
  color: string;
  softColor: string;
  borderColor: string;
  description: string;
  rules: string[];
  cognitiveSkills: string[];
  pedagogyQuote: string;
}

const DUEL_MODES: DuelModeDefinition[] = [
  {
    id: 'live',
    title: 'Duelo Ao Vivo',
    tagline: 'Duelo 1v1 síncrono com árbitro Aura e pontuação por antecipação.',
    category: 'Confronto Competitivo',
    durationLabel: '5 Rodadas · ELO 1.420',
    icon: Swords,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    description: 'Dispute rodadas síncronas contra oponentes calibrados pelo seu ELO cognitivo. A Aura atua como árbitro oficial na mesa, concedendo a vitória a quem reconhece o padrão estrutural primeiro.',
    rules: [
      'Melhor de 5 rodadas com equações procedurais simultâneas.',
      'Alternativas conceituais calibradas com base em atalhos simétricos.',
      'Árbitro Aura orienta o vínculo estrutural oculto em tempo real.',
      'Vitória concede +45 pontos no seu ELO Cognitivo oficial.',
    ],
    cognitiveSkills: ['Velocidade de Decisão', 'Resistência Competitiva', 'Reconhecimento Sob Pressão'],
    pedagogyQuote: 'No duelo, quem enxerga a relação antes não precisa disputar velocidade mecânica.',
  },
  {
    id: 'daily',
    title: 'Desafio do Dia',
    tagline: 'Sprint diário com 5 padrões essenciais para manter sua sequência.',
    category: 'Hábito Diário',
    durationLabel: '5 Padrões · Diário',
    icon: Calendar,
    color: 'var(--color-marigold, #F2B84B)',
    softColor: 'var(--color-marigold-soft, #FFF0C9)',
    borderColor: '#C79331',
    description: 'Edição única renovada à meia-noite. Resolva 5 questões com macetes táteis de decomposição para alimentar seu streak de ofensiva e registrar presença na rede.',
    rules: [
      'Conjunto de 5 desafios conceituais renovados diariamente.',
      'Dicas táteis de decomposição incluídas em cada etapa.',
      'Conclusão garante +100 XP e preserva seu streak diário.',
      'Histórico arquivado na sua estampa de perfil pedagógico.',
    ],
    cognitiveSkills: ['Consistência Diária', 'Retenção Espaçada', 'Fixação de Atalhos'],
    pedagogyQuote: 'Poucos minutos todos os dias constroem a intuição matemática de uma vida.',
  },
  {
    id: 'split',
    title: 'Batalha 2P Local',
    tagline: 'Dois jogadores no mesmo aparelho com tela dividida e invertida.',
    category: 'Mesa / Tabletop',
    durationLabel: 'Primeiro a 5 Pontos',
    icon: Zap,
    color: 'var(--color-iris, #6E5AA6)',
    softColor: 'var(--color-iris-soft, #E8E3F3)',
    borderColor: '#5B488C',
    description: 'Coloque o smartphone entre dois jogadores na mesa. A tela divide-se com o Jogador 2 invertido a 180°, permitindo uma disputa frente a frente instantânea sem necessidade de internet.',
    rules: [
      'Jogador 1 (Verdigris) vs Jogador 2 (Iris) no mesmo aparelho.',
      'Interface superior invertida em 180° para visualização frontal.',
      'Teclados numéricos táteis independentes com feedback auditivo.',
      'Primeiro competidor a atingir 5 acertos vence a rodada.',
    ],
    cognitiveSkills: ['Agilidade Motora', 'Reflexo Imediato', 'Concentração sob Provocação'],
    pedagogyQuote: 'A matemática aproxima pessoas quando se torna um desafio de mesa compartilhado.',
  },
  {
    id: 'mastery',
    title: 'Prova de Maestria',
    tagline: 'Desafio culminante de 5 etapas estruturais em cadeia para validar o grau.',
    category: 'Maestria da Unidade',
    durationLabel: '5 Desafios · Grau I',
    icon: Crown,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    description: 'Supere a Prova de Maestria do Grau I. Resolva 5 problemas estruturais em cadeia para demonstrar que o cálculo posicional se tornou intuição visual e conquistar o Selo de Decomposição Posicional.',
    rules: [
      '5 etapas de insight encadeadas do Grau I.',
      'Cada acerto preenche um elo do selo de maestria.',
      'Sem penalidade de tempo: o foco é rigor e elegância.',
      'Concluir o desafio confere o Selo de Decomposição Posicional.',
    ],
    cognitiveSkills: ['Cálculo Estrutural', 'Resolução de Produtos Notáveis', 'Rigor de Prova'],
    pedagogyQuote: 'A matemática atinge seu ápice quando o cálculo mecânico cede lugar à visão direta.',
  },
  {
    id: 'match_madness',
    title: 'Match Madness',
    tagline: 'Conecte pares de complementares e produtos sob pressão do relógio.',
    category: 'Velocidade & Padrões',
    durationLabel: '45s · Combo Ascendente',
    icon: Flame,
    color: 'var(--color-marigold, #F2B84B)',
    softColor: 'var(--color-marigold-soft, #FFF0C9)',
    borderColor: '#C79331',
    description: 'Conecte os 10 blocos na grade de duas colunas encontrando pares complementares de 100, 1000 ou equivalências algébricas antes do tempo esgotar. Cada marco de 5 pares rende bônus de tempo e multiplicador de XP!',
    rules: [
      'Grade móvel com 5 pares ativos simultâneos.',
      'Toque nos dois termos correspondentes para conectá-los.',
      'A cada 5 pares conectados sem erro: +3 segundos de bônus.',
      'Multiplicador de combo sobe para 2x e 3x com acertos contínuos.',
    ],
    cognitiveSkills: ['Fluência de Complemento', 'Memória de Trabalho', 'Atenção Seletiva'],
    pedagogyQuote: 'Enxergar complementos de 100 instantaneamente é a base de todo cálculo mental veloz.',
  },
];

export function DuelHubView() {
  // Navigation State: Menu vs Inspected vs Active Gameplay vs Leagues
  const [activeMode, setActiveMode] = useState<DuelSubMode | null>(null);
  const [inspectedMode, setInspectedMode] = useState<DuelModeDefinition | null>(null);
  const [hubTab, setHubTab] = useState<'modes' | 'leagues'>('modes');

  const handleStartMode = (modeId: DuelSubMode) => {
    audioSynth.playKeypressTick();
    setActiveMode(modeId);
    setInspectedMode(null);
  };

  const handleReturnToMenu = () => {
    audioSynth.playKeypressTick();
    setActiveMode(null);
    setInspectedMode(null);
  };

  // ==========================================================================
  // VIEW 1: PRE-SELECTION MODE MENU (Aba Anterior com Botões Horizontais)
  // ==========================================================================
  if (!activeMode) {
    return (
      <div
        style={{
          padding: '16px',
          paddingBottom: '96px',
          maxWidth: '430px',
          margin: '0 auto',
          backgroundColor: 'var(--color-bg-base, #F7F4EA)',
          color: 'var(--color-text-primary, #202522)',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Top Hub Tab Switcher: Modos vs Ligas */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              audioSynth.playKeypressTick();
              setHubTab('modes');
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: hubTab === 'modes' ? '1.5px solid var(--color-verdigris, #176B5B)' : '1.5px solid transparent',
              backgroundColor: hubTab === 'modes' ? 'var(--color-verdigris-soft, #DCEBE5)' : 'transparent',
              boxShadow: hubTab === 'modes' ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : 'none',
              color: hubTab === 'modes' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            <Swords size={16} />
            <span>Modos de Duelo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioSynth.playKeypressTick();
              setHubTab('leagues');
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: hubTab === 'leagues' ? '1.5px solid var(--color-verdigris, #176B5B)' : '1.5px solid transparent',
              backgroundColor: hubTab === 'leagues' ? 'var(--color-verdigris-soft, #DCEBE5)' : 'transparent',
              boxShadow: hubTab === 'leagues' ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : 'none',
              color: hubTab === 'leagues' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            <Trophy size={16} />
            <span>Ligas Semanais</span>
          </button>
        </div>

        {hubTab === 'leagues' ? (
          <LeagueLeaderboardView leagueState={gamificationEngine.getState().league} />
        ) : (
          <>
            {/* Editorial Eyebrow & Header */}
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
                  <Swords size={13} color="var(--color-verdigris, #176B5B)" />
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: 'var(--color-verdigris, #176B5B)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    § 03 · ARENA DE CONFRONTOS COGNITIVOS
                  </span>
                </div>

            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--color-ink-secondary, #5C645F)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              SELECIONE O DUELO
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
            Arena de Duelos
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-ink-secondary, #5C645F)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Escolha uma modalidade de confronto abaixo para conferir as regras e iniciar a disputa.
          </p>
        </div>

        {/* Real Elo & Rank Badge */}
        {(() => {
          const currentElo = eloEngine.getRating();
          const currentRank = eloEngine.getRankForRating(currentElo);
          return (
            <div
              style={{
                backgroundColor: currentRank.softColor,
                border: `1.5px solid ${currentRank.borderColor}`,
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: currentRank.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                  }}
                >
                  {currentRank.romanNumeral}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                    {currentRank.title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
                    {eloEngine.getMatchesPlayed()} confrontos computados
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  className="font-mono-tabular"
                  style={{ fontSize: '1.05rem', fontWeight: 900, color: currentRank.color }}
                >
                  {currentElo} ELO
                </span>
              </div>
            </div>
          );
        })()}

        {/* Stack of Horizontal Mode Buttons (Menu com botões um abaixo do outro) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DUEL_MODES.map((mode) => {
            const Icon = mode.icon;
            const isInspected = inspectedMode?.id === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  audioSynth.playKeypressTick();
                  setInspectedMode(mode);
                }}
                className="aura-3d-btn aura-3d-btn--paper"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'left',
                  backgroundColor: isInspected ? mode.softColor : 'var(--color-bg-surface, #FFFDF6)',
                  border: isInspected ? `2px solid ${mode.color}` : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  boxShadow: isInspected ? `0 4px 0 ${mode.borderColor}` : '0 3px 0 var(--color-border-bold, #C2BDAE)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Icon in styled tactile badge */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: mode.softColor,
                    border: `1.5px solid ${mode.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mode.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} strokeWidth={2.4} />
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary, #202522)',
                        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      }}
                    >
                      {mode.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: mode.softColor,
                        color: mode.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {mode.durationLabel}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.76rem',
                      color: 'var(--color-ink-secondary, #5C645F)',
                      lineHeight: 1.35,
                      fontWeight: 500,
                    }}
                  >
                    {mode.tagline}
                  </p>
                </div>

                {/* Right Action Chevron */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isInspected ? mode.color : 'var(--color-ink-secondary, #5C645F)',
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Mode Explanation Modal / Bottom Sheet (Explicação do modo quando clicar nele) */}
        {inspectedMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(32, 37, 34, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
            }}
            onClick={() => setInspectedMode(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '2px solid var(--color-ink, #202522)',
                borderRadius: '28px',
                padding: '24px 20px',
                maxWidth: '430px',
                width: '100%',
                boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: inspectedMode.softColor,
                      border: `1.5px solid ${inspectedMode.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: inspectedMode.color,
                      flexShrink: 0,
                    }}
                  >
                    <inspectedMode.icon size={26} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        color: inspectedMode.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {inspectedMode.category} · {inspectedMode.durationLabel}
                    </span>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: 'var(--color-text-primary, #202522)',
                        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      }}
                    >
                      {inspectedMode.title}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedMode(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'var(--color-ink-secondary, #5C645F)',
                  }}
                  aria-label="Fechar"
                >
                  <X size={20} strokeWidth={2.4} />
                </button>
              </div>

              {/* Description & Pedagogy Quote */}
              <div
                style={{
                  backgroundColor: inspectedMode.softColor,
                  border: `1px solid ${inspectedMode.borderColor}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-primary, #202522)', lineHeight: 1.45, fontWeight: 500 }}>
                  {inspectedMode.description}
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', fontStyle: 'italic', color: inspectedMode.color, fontWeight: 700 }}>
                  “{inspectedMode.pedagogyQuote}”
                </div>
              </div>

              {/* How it Works / Rules */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dinâmica & Regras
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {inspectedMode.rules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-primary, #202522)' }}>
                      <span style={{ color: inspectedMode.color, fontWeight: 900 }}>✓</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive Skills Chips */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Habilidades Calibradas
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {inspectedMode.cognitiveSkills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-paper, #F7F4EA)',
                        border: '1px solid var(--color-border-subtle, #D9D5C8)',
                        color: 'var(--color-text-primary, #202522)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <Aura3DButton
                  variant="brand"
                  size="lg"
                  fullWidth
                  onClick={() => handleStartMode(inspectedMode.id)}
                  icon={<Play size={16} fill="currentColor" />}
                >
                  INICIAR {inspectedMode.title.toUpperCase()} ➔
                </Aura3DButton>

                <Aura3DButton
                  variant="paper"
                  size="md"
                  fullWidth
                  onClick={() => setInspectedMode(null)}
                >
                  Voltar ao Menu
                </Aura3DButton>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: ACTIVE DUEL GAMEPLAY (Modo de Jogo em Andamento)
  // ==========================================================================
  const currentModeMeta = DUEL_MODES.find((m) => m.id === activeMode) || DUEL_MODES[0];

  return (
    <div
      style={{
        paddingBottom: '90px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
      }}
    >
      {/* Top Header Navigation: Return to Menu & Active Mode Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 1px 3px rgba(32, 37, 34, 0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 15,
        }}
      >
        <button
          type="button"
          onClick={handleReturnToMenu}
          className="aura-3d-btn aura-3d-btn--paper aura-3d-btn--sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0 10px',
            height: '32px',
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Menu de Duelos
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: currentModeMeta.softColor,
            border: `1px solid ${currentModeMeta.borderColor}`,
            fontSize: '0.74rem',
            fontWeight: 800,
            color: currentModeMeta.color,
          }}
        >
          <currentModeMeta.icon size={13} strokeWidth={2.4} />
          {currentModeMeta.title}
        </div>
      </div>

      {/* Main Duel Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeMode === 'live' && <LiveDuelComponent onReturn={handleReturnToMenu} />}
        {activeMode === 'daily' && <DailyChallengeComponent onReturn={handleReturnToMenu} />}
        {activeMode === 'split' && <SplitBattleComponent onReturn={handleReturnToMenu} />}
        {activeMode === 'mastery' && <MasteryChallengeComponent onReturn={handleReturnToMenu} />}
        {activeMode === 'match_madness' && (
          <div className="w-full max-w-[430px] mx-auto py-4">
            <MatchMadnessGrid
              onClose={handleReturnToMenu}
              onFinish={(stats) => {
                gamificationEngine.addXP(stats.xpEarned);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 1. LIVE COGNITIVE DUEL (FIGMA SCREEN 1:2834)
// ============================================================================
function LiveDuelComponent({ onReturn }: { onReturn?: () => void }) {
  const { user } = useAuth();
  const [playerRating, setPlayerRating] = useState(() => eloEngine.getRating());
  const [opponent, setOpponent] = useState<GhostOpponent>(() =>
    ghostMatchmaker.createCalibratedBot(eloEngine.getRating(), 5)
  );
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [matchOver, setMatchOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [matchOutcomeResult, setMatchOutcomeResult] = useState<EloMatchResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    ghostMatchmaker.findOpponent(eloEngine.getRating(), 5).then((opp) => {
      if (isMounted) setOpponent(opp);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic question with options
  const [currentChallenge, setCurrentChallenge] = useState(() => {
    const q = generateQuestion('general', ['multiplication', 'DIFF_OF_SQUARES']);
    const ans = q.answer;
    const distractor1 = ans + (Math.random() > 0.5 ? 10 : -10);
    const distractor2 = ans + (Math.random() > 0.5 ? 20 : -20);
    const distractor3 = ans + 5;
    const opts = [ans, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);
    return {
      equation: q.equation,
      answer: ans,
      hint: q.hint || 'Decomponha antes de calcular',
      options: opts,
      refereeAdvice: 'Observe os fatores e enxergue a estrutura oculta antes de executar.',
    };
  });

  const handleSelectOption = (opt: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt === currentChallenge.answer) {
      audioSynth.playSuccessNote(playerScore + 1);
      const nextScore = playerScore + 1;
      setPlayerScore(nextScore);

      if (nextScore >= 3 || round >= totalRounds) {
        const res = eloEngine.recordMatchOutcome(1, opponent.elo, 1.15);
        setPlayerRating(res.newRating);
        setMatchOutcomeResult(res);
        if (!user.isGuest && user.id) {
          ghostMatchmaker.saveGhostRun(user.id, res.newRating, nextScore * 100, 12000, opponent.timeline);
        }
        setTimeout(() => {
          setMatchOver(true);
          confetti({ particleCount: 45, spread: 60 });
        }, 500);
      } else {
        setTimeout(() => {
          advanceRound();
        }, 800);
      }
    } else {
      audioSynth.playErrorSoftRelease();
      const nextOppScore = opponentScore + 1;
      setOpponentScore(nextOppScore);

      if (nextOppScore >= 3 || round >= totalRounds) {
        const res = eloEngine.recordMatchOutcome(0, opponent.elo);
        setPlayerRating(res.newRating);
        setMatchOutcomeResult(res);
        setTimeout(() => {
          setMatchOver(true);
        }, 500);
      } else {
        setTimeout(() => {
          advanceRound();
        }, 800);
      }
    }
  };

  const advanceRound = () => {
    setSelectedOpt(null);
    setShowHint(false);
    setRound((prev) => Math.min(totalRounds, prev + 1));
    const nextQ = generateQuestion('general', ['multiplication', 'DIFF_OF_SQUARES']);
    const ans = nextQ.answer;
    const distractor1 = ans + (Math.random() > 0.5 ? 10 : -10);
    const distractor2 = ans + (Math.random() > 0.5 ? 20 : -20);
    const distractor3 = ans + 5;
    const opts = [ans, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);

    setCurrentChallenge({
      equation: nextQ.equation,
      answer: ans,
      hint: nextQ.hint || 'Decomponha antes de calcular',
      options: opts,
      refereeAdvice: 'Reconheça a estrutura oculta antes de executar.',
    });
  };

  const resetMatch = () => {
    setRound(1);
    setPlayerScore(0);
    setOpponentScore(0);
    setSelectedOpt(null);
    setShowHint(false);
    setMatchOver(false);
    setMatchOutcomeResult(null);
    const curElo = eloEngine.getRating();
    setPlayerRating(curElo);
    ghostMatchmaker.findOpponent(curElo, 5).then(setOpponent);
  };

  return (
    <div
      style={{
        padding: '16px',
        maxWidth: '430px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* 1. Top Match Status Bar (Figma 1:2836) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '18px',
          padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            § 06 · DUELO COGNITIVO
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
              border: '1px solid var(--color-verdigris, #176B5B)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-verdigris, #176B5B)' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
              Ao Vivo
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                border: '1px solid var(--color-border-subtle, #D9D5C8)',
                padding: '2px 8px',
                borderRadius: '8px',
                color: 'var(--color-text-primary, #202522)',
              }}
            >
              Rodada {round} de {totalRounds}
            </span>
            <span className="font-mono-tabular" style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 600 }}>
              ELO {playerRating} vs {opponent.elo}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--color-verdigris, #176B5B)', fontWeight: 600 }}>
            Aritmética Rápida · Simetrias
          </span>
        </div>

        {/* Segmented round progress bar */}
        <div style={{ display: 'flex', gap: '4px', height: '5px' }}>
          {[1, 2, 3, 4, 5].map((r) => (
            <div
              key={r}
              style={{
                flex: 1,
                height: '100%',
                borderRadius: '4px',
                backgroundColor:
                  r < round
                    ? 'var(--color-verdigris, #176B5B)'
                    : r === round
                    ? 'var(--color-marigold, #F2B84B)'
                    : 'var(--color-border-subtle, #D9D5C8)',
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Two Player Areas (YOU vs. OPPONENT) with Aura Observer (Figma 1:2865) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
          {/* Player 1 (YOU) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-verdigris, #176B5B)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 0 var(--color-verdigris-bevel, #104E42)',
                }}
              >
                {user.profile?.display_name ? user.profile.display_name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                  Você {user.profile?.display_name ? `(${user.profile.display_name})` : ''}
                </div>
                <div style={{ fontSize: '0.68rem', fontStyle: 'italic', color: 'var(--color-ink-secondary, #5C645F)' }}>
                  {eloEngine.getRankForRating(playerRating).title} · {playerRating} ELO
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                color: 'var(--color-verdigris, #176B5B)',
                fontSize: '0.66rem',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              <Check size={10} strokeWidth={3} /> Padrão Identificado
            </div>

            <div className="font-mono-tabular" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
              {playerScore} vitórias · 3,4s
            </div>
          </div>

          {/* Center Referee: Aura Observer (Figma 1:2895) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                border: '1.5px solid var(--color-ink, #202522)',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AuraMascotWeb size={30} stage={1} state="idle" showTierBadge={false} showSpeechBubble={false} />
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 900, color: 'var(--color-ink-secondary, #5C645F)', letterSpacing: '0.08em' }}>
              VS
            </span>
          </div>

          {/* Player 2 (OPPONENT) */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                  {opponent.name}
                </div>
                <div style={{ fontSize: '0.68rem', fontStyle: 'italic', color: 'var(--color-ink-secondary, #5C645F)' }}>
                  {eloEngine.getRankForRating(opponent.elo).title} · {opponent.elo} ELO
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: opponent.avatarColor,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: '2px solid #FFFFFF',
                  boxShadow: `0 2px 0 ${opponent.avatarColor}`,
                }}
              >
                {opponent.avatarLetter}
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                color: 'var(--color-ink-secondary, #5C645F)',
                fontSize: '0.66rem',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Analisando...
            </div>

            <div className="font-mono-tabular" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-iris, #6E5AA6)' }}>
              {opponentScore} vitórias · 4,1s
            </div>
          </div>
        </div>

        {/* Referee Advice from Aura */}
        <div
          style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
          }}
        >
          <div style={{ fontStyle: 'italic', color: 'var(--color-ink-secondary, #5C645F)' }}>
            <strong style={{ color: 'var(--color-marigold, #F2B84B)', fontStyle: 'normal' }}>Aura:</strong> “{currentChallenge.refereeAdvice}”
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase' }}>
            Árbitro Oficial
          </span>
        </div>
      </div>

      {/* 3. Central Mathematical Challenge Card (Hero element - Figma 1:2933) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '2px solid var(--color-border-bold, #C2BDAE)',
          boxShadow: '0 6px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '24px 20px',
          textAlign: 'center',
        }}
      >
        {currentChallenge.hint && (
          <div style={{ marginBottom: '8px' }}>
            {!showHint ? (
              <button
                type="button"
                onClick={() => {
                  audioSynth.playKeypressTick();
                  setShowHint(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--color-marigold-bevel, #C89228)',
                  backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: '1px solid #C79331',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <Lightbulb size={13} color="var(--color-marigold-bevel, #C89228)" />
                Ver Dica Estratégica
              </button>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--color-marigold, #F2B84B)',
                  backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid #C79331',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <Lightbulb size={13} color="var(--color-marigold, #F2B84B)" />
                {currentChallenge.hint}
              </span>
            )}
          </div>
        )}

        <div
          className="font-mono-tabular"
          style={{
            fontSize: '2.6rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            letterSpacing: '-0.02em',
            margin: '16px 0 8px',
          }}
        >
          {currentChallenge.equation} = ?
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 18px', fontWeight: 600 }}>
          Selecione a resolução ótima antes do oponente:
        </p>

        {/* 4 Eureka / Multiple Choice Option Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {currentChallenge.options.map((opt) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === currentChallenge.answer;

            let btnVariant: 'brand' | 'success' | 'alert' | 'paper' = 'paper';
            if (selectedOpt !== null) {
              if (isCorrect) btnVariant = 'success';
              else if (isSelected) btnVariant = 'alert';
            }

            return (
              <Aura3DButton
                key={opt}
                variant={btnVariant}
                size="lg"
                disabled={selectedOpt !== null}
                onClick={() => handleSelectOption(opt)}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                }}
              >
                {opt.toLocaleString('pt-BR')}
              </Aura3DButton>
            );
          })}
        </div>
      </div>

      {/* Match Over Modal */}
      {matchOver && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(32, 37, 34, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '2px solid var(--color-ink, #202522)',
              boxShadow: '0 6px 0 var(--color-border-bold, #C2BDAE)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Trophy size={48} color={playerScore >= opponentScore ? "var(--color-marigold, #F2B84B)" : "var(--color-ink-secondary, #5C645F)"} style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 6px', color: 'var(--color-text-primary, #202522)' }}>
              {playerScore >= opponentScore ? 'Vitória por Antecipação!' : 'Confronto Finalizado'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 16px' }}>
              {playerScore >= opponentScore ? (
                <>
                  Você reconheceu os padrões com precisão e conquistou{' '}
                  <strong style={{ color: 'var(--color-verdigris, #176B5B)' }}>
                    +{matchOutcomeResult?.delta ?? 24} ELO Cognitivo
                  </strong>
                  . Novo Elo:{' '}
                  <span className="font-mono-tabular" style={{ fontWeight: 800 }}>
                    {matchOutcomeResult?.newRating ?? playerRating}
                  </span>
                  .
                </>
              ) : (
                <>
                  O oponente foi mais veloz nesta rodada.{' '}
                  <strong style={{ color: 'var(--color-coral, #E76F61)' }}>
                    {matchOutcomeResult?.delta ?? -12} ELO
                  </strong>
                  . Novo Elo:{' '}
                  <span className="font-mono-tabular" style={{ fontWeight: 800 }}>
                    {matchOutcomeResult?.newRating ?? playerRating}
                  </span>
                  . Continue treinando!
                </>
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Aura3DButton variant="brand" size="lg" fullWidth onClick={resetMatch}>
                Próximo Duelo ➔
              </Aura3DButton>
              {onReturn && (
                <Aura3DButton variant="paper" size="md" fullWidth onClick={onReturn}>
                  Menu de Duelos
                </Aura3DButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. DESAFIO DO DIA (REBRAND 01.1 · DETERMINISMO POR DATA)
// ============================================================================
function DailyChallengeComponent({ onReturn }: { onReturn?: () => void }) {
  const todaySeed = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const dailyQuestions = useMemo(() => generateDailyQuestions(todaySeed), [todaySeed]);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [userVal, setUserVal] = useState('');

  const dailyStreak = gamificationEngine.getState().streak.current;
  const currentQ = dailyQuestions[stepIndex] || dailyQuestions[0];

  const handleNext = () => {
    const isCorrect = parseInt(userVal, 10) === currentQ.answer;
    const nextResults = [...results, isCorrect];
    setResults(nextResults);

    if (isCorrect) {
      audioSynth.playSuccessNote(stepIndex + 1);
    } else {
      audioSynth.playErrorSoftRelease();
    }

    setUserVal('');
    setShowTip(false);

    if (stepIndex + 1 >= dailyQuestions.length) {
      setDrillCompleted(true);
      const acc = Math.round((nextResults.filter(Boolean).length / dailyQuestions.length) * 100);
      gamificationEngine.recordLessonCompletion(100, acc);
      confetti({ particleCount: 50, spread: 70 });
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleCopyResults = () => {
    const accuracy = Math.round((results.filter(Boolean).length / dailyQuestions.length) * 100);
    const grid = results
      .map((r, i) => (r ? '🟩' : '🟥') + ((i + 1) % 5 === 0 ? '\n' : ' '))
      .join('')
      .trim();
    const text = `AuraMath · Desafio Diário (${todaySeed})\n${grid}\nAcurácia: ${accuracy}% · Ofensiva: ${dailyStreak + 1} dias 🔥`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    audioSynth.playKeypressTick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '430px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="var(--color-marigold, #F2B84B)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-marigold, #F2B84B)', textTransform: 'uppercase' }}>
              DESAFIO DIÁRIO · {todaySeed}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 700 }}>
            Expira à meia-noite
          </span>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 6px', color: 'var(--color-text-primary, #202522)' }}>
          Sprint Diário de Fixação
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 14px', lineHeight: 1.4 }}>
          Mantenha sua sequência ativa com questões procedurais geradas deterministicamente pelo motor Aura.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--color-paper, #F7F4EA)', borderRadius: '14px', border: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
          <Sparkles size={16} color="var(--color-verdigris, #176B5B)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
            Ofensiva: {dailyStreak} dias seguidos
          </span>
        </div>
      </div>

      {!drillCompleted ? (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
            borderRadius: '24px',
            padding: '24px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 700, marginBottom: '6px' }}>
            QUESTÃO {stepIndex + 1} DE {dailyQuestions.length}
          </div>
          <div className="font-mono-tabular" style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-text-primary, #202522)', margin: '12px 0' }}>
            {currentQ.equation}
          </div>

          {currentQ.hint && (
            <div style={{ marginBottom: '16px' }}>
              {!showTip ? (
                <button
                  type="button"
                  onClick={() => {
                    audioSynth.playKeypressTick();
                    setShowTip(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--color-verdigris, #176B5B)',
                    backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-verdigris, #176B5B)',
                    cursor: 'pointer',
                  }}
                >
                  <Lightbulb size={13} color="var(--color-verdigris, #176B5B)" />
                  Ver Dica do Dia
                </button>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--color-verdigris, #176B5B)',
                    backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-verdigris, #176B5B)',
                    fontWeight: 700,
                  }}
                >
                  <Lightbulb size={14} color="var(--color-verdigris, #176B5B)" />
                  Dica: {currentQ.hint}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', maxWidth: '280px', margin: '0 auto 16px' }}>
            <input
              type="number"
              value={userVal}
              onChange={(e) => setUserVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNext();
              }}
              placeholder="Resposta"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                border: '1.5px solid var(--color-border-bold, #C2BDAE)',
                fontSize: '1.3rem',
                fontWeight: 800,
                textAlign: 'center',
                fontFamily: 'var(--font-mono, monospace)',
                backgroundColor: 'var(--color-paper, #F7F4EA)',
              }}
            />
            <Aura3DButton variant="brand" size="md" onClick={handleNext}>
              OK
            </Aura3DButton>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '2px solid var(--color-verdigris, #176B5B)',
            boxShadow: '0 4px 0 var(--color-verdigris-bevel, #104E42)',
            borderRadius: '24px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <Trophy size={48} color="var(--color-marigold, #F2B84B)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 6px', color: 'var(--color-text-primary, #202522)' }}>
            Desafio do Dia Concluído!
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 16px' }}>
            +100 XP registrados · Acurácia: {Math.round((results.filter(Boolean).length / dailyQuestions.length) * 100)}%
          </p>

          {/* Spoiler-Free Grid */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-paper, #F7F4EA)',
              borderRadius: '14px',
              marginBottom: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              justifyContent: 'center',
            }}
          >
            {results.map((r, idx) => (
              <span key={idx} style={{ fontSize: '1.1rem' }}>
                {r ? '🟩' : '🟥'}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
            <Aura3DButton variant="marigold" size="md" fullWidth onClick={handleCopyResults} icon={<Share2 size={16} />}>
              {copied ? 'COPIADO!' : 'COMPARTILHAR RESULTADO'}
            </Aura3DButton>

            {onReturn && (
              <Aura3DButton variant="paper" size="md" fullWidth onClick={onReturn}>
                Voltar ao Menu de Duelos
              </Aura3DButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. BATALHA 2P LOCAL (SPLIT SCREEN REBRAND 01.1 · QUESTÃO IDÊNTICA SIMULTÂNEA)
// ============================================================================
function SplitBattleComponent({ onReturn }: { onReturn?: () => void }) {
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [currentQ, setCurrentQ] = useState(() => generateQuestion('general', ['multiplication', 'addition']));
  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  const handleP1Submit = () => {
    if (winner) return;
    if (parseInt(p1Input, 10) === currentQ.answer) {
      const next = p1Score + 1;
      setP1Score(next);
      audioSynth.playSuccessNote(next);
      setP1Input('');
      setP2Input('');
      if (next >= 5) {
        setWinner('Jogador 1 (Verdigris)');
        confetti({ particleCount: 40 });
      } else {
        setCurrentQ(generateQuestion('general', ['multiplication', 'addition']));
      }
    } else {
      audioSynth.playErrorSoftRelease();
      setP1Input('');
    }
  };

  const handleP2Submit = () => {
    if (winner) return;
    if (parseInt(p2Input, 10) === currentQ.answer) {
      const next = p2Score + 1;
      setP2Score(next);
      audioSynth.playSuccessNote(next);
      setP1Input('');
      setP2Input('');
      if (next >= 5) {
        setWinner('Jogador 2 (Iris)');
        confetti({ particleCount: 40 });
      } else {
        setCurrentQ(generateQuestion('general', ['multiplication', 'addition']));
      }
    } else {
      audioSynth.playErrorSoftRelease();
      setP2Input('');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '620px' }}>
      {/* Player 2 - INVERTED 180° */}
      <div
        style={{
          flex: 1,
          transform: 'rotate(180deg)',
          borderBottom: '2px dashed var(--color-border-bold, #C2BDAE)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-iris-soft, #E8E3F3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-iris, #6E5AA6)', fontWeight: 800, fontSize: '0.8rem' }}>JOGADOR 2 (IRIS)</span>
          <span className="font-mono-tabular" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-iris, #6E5AA6)' }}>
            {p2Score}/5
          </span>
        </div>
        <div style={{ textAlign: 'center', margin: '6px 0' }}>
          <div className="font-mono-tabular" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
            {currentQ.equation} = {p2Input || '_'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'C', 'OK'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'OK') handleP2Submit();
                else if (k === 'C') setP2Input('');
                else setP2Input((prev) => prev + k);
              }}
              style={{
                height: '42px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border-bold, #C2BDAE)',
                backgroundColor: k === 'OK' ? 'var(--color-iris, #6E5AA6)' : 'var(--color-bg-surface, #FFFDF6)',
                color: k === 'OK' ? '#FFF' : 'var(--color-text-primary, #202522)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Player 1 - Normal */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-verdigris, #176B5B)', fontWeight: 800, fontSize: '0.8rem' }}>JOGADOR 1 (VERDIGRIS)</span>
          <span className="font-mono-tabular" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
            {p1Score}/5
          </span>
        </div>
        <div style={{ textAlign: 'center', margin: '6px 0' }}>
          <div className="font-mono-tabular" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
            {currentQ.equation} = {p1Input || '_'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'C', 'OK'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'OK') handleP1Submit();
                else if (k === 'C') setP1Input('');
                else setP1Input((prev) => prev + k);
              }}
              style={{
                height: '42px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border-bold, #C2BDAE)',
                backgroundColor: k === 'OK' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-bg-surface, #FFFDF6)',
                color: k === 'OK' ? '#FFF' : 'var(--color-text-primary, #202522)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {winner && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(32, 37, 34, 0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            padding: '20px',
          }}
        >
          <Trophy size={48} color="var(--color-marigold, #F2B84B)" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '12px 0', color: '#FFF' }}>{winner} Venceu!</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '220px' }}>
            <Aura3DButton
              variant="brand"
              size="lg"
              fullWidth
              onClick={() => {
                setP1Score(0);
                setP2Score(0);
                setWinner(null);
              }}
            >
              Nova Batalha
            </Aura3DButton>
            {onReturn && (
              <Aura3DButton variant="paper" size="md" fullWidth onClick={onReturn}>
                Menu de Duelos
              </Aura3DButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. UNIT MASTERY CHALLENGE (PROVA DE MAESTRIA)
// ============================================================================
function MasteryChallengeComponent({ onReturn }: { onReturn?: () => void }) {
  const challenge = MASTERY_CHALLENGES[0];
  const totalSteps = challenge?.questionsCount || 5;
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5
  const [q, setQ] = useState(() => generateQuestion('general', ['ADD_LEFT_RIGHT', 'SUB_COMPENSATION', 'COMPLEMENT_100']));
  const [inputVal, setInputVal] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (parseInt(inputVal, 10) === q.answer) {
      const nextStep = currentStep + 1;
      audioSynth.playSuccessNote(nextStep);
      setCurrentStep(nextStep);
      setInputVal('');

      if (nextStep >= totalSteps) {
        setCompleted(true);
        confetti({ particleCount: 55, spread: 70 });
      } else {
        setQ(generateQuestion('general', ['ADD_LEFT_RIGHT', 'SUB_COMPENSATION', 'COMPLEMENT_100']));
      }
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '430px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)', textTransform: 'uppercase' }}>
            {challenge.title} · {challenge.name}
          </span>
          <span className="font-mono-tabular" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
            Etapa {Math.min(currentStep + 1, totalSteps)}/{totalSteps}
          </span>
        </div>

        {/* Progress Stepper Bar */}
        <div style={{ height: '8px', backgroundColor: 'var(--color-border-subtle, #D9D5C8)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ width: `${(currentStep / totalSteps) * 100}%`, height: '100%', backgroundColor: 'var(--color-verdigris, #176B5B)', transition: 'width 0.3s' }} />
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 16px', lineHeight: 1.4 }}>
          {challenge.lore}
        </p>

        {!completed ? (
          <div style={{ textAlign: 'center' }}>
            <div className="font-mono-tabular" style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--color-text-primary, #202522)', margin: '14px 0' }}>
              {q.equation} = ?
            </div>

            <div style={{ display: 'flex', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Resposta"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--color-border-bold, #C2BDAE)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono, monospace)',
                  backgroundColor: 'var(--color-paper, #F7F4EA)',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />
              <Aura3DButton variant="brand" size="md" onClick={handleSubmit}>
                Validar
              </Aura3DButton>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Crown size={48} color="var(--color-verdigris, #176B5B)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-text-primary, #202522)', margin: '0 0 6px' }}>
              Prova de Maestria Concluída!
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 16px' }}>
              Você demonstrou intuição direta no Grau I e conquistou o <strong>Selo de Decomposição Posicional</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '240px', margin: '0 auto' }}>
              <Aura3DButton
                variant="brand"
                size="md"
                fullWidth
                onClick={() => {
                  setCurrentStep(0);
                  setCompleted(false);
                  setQ(generateQuestion('general', ['ADD_LEFT_RIGHT', 'SUB_COMPENSATION', 'COMPLEMENT_100']));
                }}
              >
                Praticar Novamente
              </Aura3DButton>
              {onReturn && (
                <Aura3DButton variant="paper" size="md" fullWidth onClick={onReturn}>
                  Menu de Duelos
                </Aura3DButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DuelHubView;
