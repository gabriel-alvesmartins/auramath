import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Lock, Check, TrendingUp, Compass, Award, Shield, Eye, Brain, Zap, Clock } from 'lucide-react';
import { MOCK_USER_PROFILE, MASTERY_BADGES, MOCK_CLASSROOMS } from '../engine';
import { audioSynth } from '../services/audioSynth';
import { Aura3DButton, CognitiveRadarChart } from '../components/tactile';
import { AuraMascotWeb } from '../components/AuraMascotWeb';
import { gamificationEngine } from '../services/gamificationEngine';

export function ProfileHubView() {
  const profile = MOCK_USER_PROFILE;
  const { radar } = profile;
  const classroom = MOCK_CLASSROOMS[0];
  const [vol, setVol] = useState(80);
  const [gamState, setGamState] = useState(() => gamificationEngine.getState());

  useEffect(() => {
    return gamificationEngine.subscribe((next) => {
      setGamState(next);
    });
  }, []);

  const dimensionCards = [
    {
      title: 'Velocidade de Decomposição',
      score: radar.speedScore,
      icon: Zap,
      status: 'Dominado',
      color: 'var(--color-verdigris, #176B5B)',
      description: 'Eliminação do transporte algorítmico tradicional somando e decompondo da esquerda para a direita.',
    },
    {
      title: 'Flexibilidade Algébrica',
      score: radar.flexibilityScore,
      icon: Compass,
      status: 'Dominado',
      color: 'var(--color-iris, #6E5AA6)',
      description: 'Detecção imediata de simetrias ocultas, produtos notáveis e atalhos de base 50 e 100.',
    },
    {
      title: 'Estimativa de Fermi',
      score: radar.fermiScore,
      icon: Eye,
      status: 'Em Expansão',
      color: 'var(--color-marigold, #F2B84B)',
      description: 'Percepção instantânea da ordem de grandeza antes de executar qualquer conta mecânica.',
    },
    {
      title: 'Resistência & Tenacidade',
      score: radar.staminaScore,
      icon: Shield,
      status: 'Dominado',
      color: 'var(--color-verdigris, #176B5B)',
      description: 'Estabilidade de foco sob ritmo acelerado e manutenção de acurácia em sessões longas.',
    },
    {
      title: 'Memória de Trabalho',
      score: radar.memoryScore,
      icon: Brain,
      status: 'Em Expansão',
      color: 'var(--color-coral, #E76F61)',
      description: 'Retenção transitória de sub-resultados sem necessidade de papel, anotações ou rascunho.',
    },
  ];

  return (
    <div
      style={{
        padding: '16px',
        paddingBottom: '96px',
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
      }}
    >
      {/* 1. Archive Index Stamp & Editorial Header (Figma 1:2562) */}
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
              § 05 · ÍNDICE DE PERCEPÇÃO COGNITIVA
            </span>
          </div>

          <span
            className="font-mono-tabular"
            style={{
              fontSize: '0.68rem',
              color: 'var(--color-text-muted, #8A938E)',
              fontWeight: 700,
            }}
          >
            REG. #AU-8420-C
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
          Meu olho matemático
        </h1>
        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--color-ink-secondary, #5C645F)',
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          Mapeamento contínuo da sua intuição geométrica, velocidade de decomposição e rigor estrutural.
        </p>
      </div>

      {/* 2. Score Card & Aura Mascot Presentation (Figma 1:2576) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px 16px 12px',
          marginBottom: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          {/* Avatar Medallion with Aura Mascot */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-cream, #FFFDF6)',
              border: '2px solid var(--color-ink, #202522)',
              boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <AuraMascotWeb size={70} stage={4} state="idle" showTierBadge={false} showSpeechBubble={false} />
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                padding: '2px 8px',
                backgroundColor: 'var(--color-iris, #6E5AA6)',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid #FFFFFF',
              }}
            >
              Grau IV
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--color-ink-secondary, #5C645F)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '2px',
              }}
            >
              ÍNDICE MEI (MATHEMATICAL EYE)
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                className="font-mono-tabular"
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary, #202522)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                842
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-verdigris, #176B5B)',
                  backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-verdigris-bevel, #104E42)',
                }}
              >
                Top 4% Global
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                fontSize: '0.74rem',
                color: 'var(--color-ink-secondary, #5C645F)',
                fontWeight: 600,
              }}
            >
              <TrendingUp size={13} color="var(--color-verdigris, #176B5B)" />
              <strong style={{ color: 'var(--color-text-primary, #202522)' }}>+38 pts</strong> neste ciclo · 42 axiomas consolidados
            </div>
          </div>
        </div>

        {/* Mascot Subtitle Ribbon */}
        <div
          style={{
            margin: '0 -16px -12px',
            padding: '8px 16px',
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            borderTop: '1px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--color-marigold, #F2B84B)', fontSize: '0.8rem' }}>●</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary, #202522)' }}>
              Prisma Síntese: Visão Espacial Ativa
            </span>
          </div>
          <span
            className="font-mono-tabular"
            style={{ fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}
          >
            {gamState.xp} XP Cognitivo
          </span>
        </div>
      </div>

      {/* 3. Section 2: Cognitive Radar Visualization (Figma 1:2622) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px 16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              margin: 0,
              color: 'var(--color-text-primary, #202522)',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            }}
          >
            Assinatura Cognitiva
          </h3>
          <span
            style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              color: 'var(--color-ink-secondary, #5C645F)',
              backgroundColor: 'var(--color-paper, #F7F4EA)',
              border: '1px solid var(--color-border-subtle, #D9D5C8)',
              padding: '2px 8px',
              borderRadius: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            5 DIMENSÕES
          </span>
        </div>
        <p
          style={{
            fontSize: '0.76rem',
            color: 'var(--color-ink-secondary, #5C645F)',
            margin: '0 0 16px',
            lineHeight: 1.4,
          }}
        >
          Harmonia estrutural entre intuição direta, tenacidade e precisão de ordem de magnitude.
        </p>

        {/* Embedded Cognitive Radar Chart with polar coordinates */}
        {/* <polygon points="..." /> */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px' }}>
          <CognitiveRadarChart radar={profile.radar} size={250} />
        </div>

        {/* Dimension Breakdown Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {dimensionCards.map((dim) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.title}
                style={{
                  backgroundColor: 'var(--color-bg-base, #F7F4EA)',
                  border: '1px solid var(--color-border-subtle, #D9D5C8)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} color={dim.color} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                      {dim.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: dim.status === 'Dominado' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-marigold, #F2B84B)',
                        backgroundColor: dim.status === 'Dominado' ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-marigold-soft, #FFF0C9)',
                        padding: '1px 6px',
                        borderRadius: '6px',
                      }}
                    >
                      {dim.status}
                    </span>
                    <span
                      className="font-mono-tabular"
                      style={{ fontSize: '0.85rem', fontWeight: 800, color: dim.color }}
                    >
                      {dim.score}/100
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '5px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(32, 37, 34, 0.08)',
                    overflow: 'hidden',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${dim.score}%`,
                      backgroundColor: dim.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', margin: 0, lineHeight: 1.35 }}>
                  {dim.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Selos de Maestria & Certificados da Trilha (Rebrand 01.1) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px 16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Selos de Maestria da Trilha
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '2px 0 0' }}>
              Reconhecimentos obtidos ao concluir as provas de maestria de cada grau.
            </p>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-verdigris, #176B5B)',
              fontWeight: 700,
              backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
              padding: '2px 8px',
              borderRadius: '8px',
            }}
          >
            {MASTERY_BADGES.filter((b) => b.unlocked).length}/{MASTERY_BADGES.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MASTERY_BADGES.map((badge) => {
            return (
              <div
                key={badge.id}
                style={{
                  backgroundColor: badge.unlocked ? 'var(--color-bg-surface, #FFFDF6)' : 'var(--color-bg-base, #F7F4EA)',
                  border: badge.unlocked ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-subtle, #D9D5C8)',
                  boxShadow: badge.unlocked ? '0 3px 0 var(--color-verdigris-bevel, #104E42)' : '0 2px 0 var(--color-border-bold, #C2BDAE)',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: badge.unlocked ? 1 : 0.72,
                }}
              >
                {/* Badge Icon / Seal Socket */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: badge.unlocked ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-paper, #F7F4EA)',
                    border: badge.unlocked ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-bold, #C2BDAE)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {badge.unlocked ? (
                    <Award size={22} color="var(--color-verdigris, #176B5B)" />
                  ) : (
                    <Lock size={18} color="var(--color-ink-secondary, #5C645F)" />
                  )}
                </div>

                {/* Badge Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                      {badge.title}
                    </div>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: 'var(--color-ink-secondary, #5C645F)',
                        backgroundColor: 'var(--color-paper, #F7F4EA)',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border-subtle, #D9D5C8)',
                      }}
                    >
                      Grau {badge.grade}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', marginTop: '2px', lineHeight: 1.3 }}>
                    {badge.description}
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{ flexShrink: 0 }}>
                  {badge.unlocked ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--color-verdigris, #176B5B)',
                        backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-verdigris, #176B5B)',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                      Concluído
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--color-ink-secondary, #5C645F)',
                        backgroundColor: 'var(--color-border-subtle, #D9D5C8)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                      }}
                    >
                      Pendente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Marcos & Conquistas de Retenção (Dia 1 e Desafios Escalados) */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px 16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Marcos Cognitivos & Desafios
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '2px 0 0' }}>
              Conquistas do Dia 1 e desafios progressivos de maestria visual.
            </p>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-marigold-bevel, #D49A2E)',
              fontWeight: 700,
              backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
              padding: '2px 8px',
              borderRadius: '8px',
            }}
          >
            {gamificationEngine.getState().achievements.filter((a) => a.unlocked).length}/{gamificationEngine.getState().achievements.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {gamificationEngine.getState().achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                backgroundColor: ach.unlocked ? 'var(--color-bg-surface, #FFFDF6)' : 'var(--color-bg-base, #F7F4EA)',
                border: ach.unlocked ? '1.5px solid var(--color-marigold-bevel, #D49A2E)' : '1px solid var(--color-border-subtle, #D9D5C8)',
                boxShadow: ach.unlocked ? '0 3px 0 var(--color-marigold-bevel, #D49A2E)' : '0 2px 0 var(--color-border-bold, #C2BDAE)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: ach.unlocked ? 1 : 0.72,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: ach.unlocked ? 'var(--color-marigold-soft, #FFF0C9)' : 'var(--color-paper, #F7F4EA)',
                  border: ach.unlocked ? '1.5px solid var(--color-marigold-bevel, #D49A2E)' : '1px solid var(--color-border-bold, #C2BDAE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ach.unlocked ? (
                  <Sparkles size={20} color="var(--color-marigold-bevel, #D49A2E)" />
                ) : (
                  <Lock size={16} color="var(--color-ink-secondary, #5C645F)" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                    {ach.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: 'var(--color-ink-secondary, #5C645F)',
                      backgroundColor: 'var(--color-paper, #F7F4EA)',
                      padding: '1px 5px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border-subtle, #D9D5C8)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {ach.category === 'day1' ? 'Dia 1' : ach.tier}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '2px 0 0', lineHeight: 1.3 }}>
                  {ach.description}
                </p>
              </div>

              <div style={{ flexShrink: 0 }}>
                {ach.unlocked ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: 'var(--color-marigold-bevel, #D49A2E)',
                      backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-marigold-bevel, #D49A2E)',
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                    Desbloqueado
                  </span>
                ) : (
                  <span
                    className="font-mono-tabular"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--color-ink-secondary, #5C645F)',
                    }}
                  >
                    {ach.progress}/{ach.targetValue}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Classroom Link Card */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                border: '1px solid var(--color-verdigris, #176B5B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-verdigris, #176B5B)',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-primary, #202522)' }}>
                {classroom.name}
              </div>
              <div className="font-mono-tabular" style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary, #5C645F)', marginTop: '2px' }}>
                Código: {classroom.inviteCode}
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-verdigris, #176B5B)',
              backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
              border: '1px solid var(--color-verdigris-bevel, #104E42)',
              padding: '3px 8px',
              borderRadius: '8px',
              fontWeight: 800,
            }}
          >
            Turma Ativa
          </span>
        </div>
      </div>

      {/* 6. Audio Volume Slider Card */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '8px' }}>
          <span style={{ color: 'var(--color-text-primary, #202522)' }}>
            Volume do Sintetizador Acústico
          </span>
          <span className="font-mono-tabular" style={{ color: 'var(--color-verdigris, #176B5B)', fontWeight: 800 }}>
            {vol}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={vol}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setVol(v);
            audioSynth.setMasterVolume(v / 100);
          }}
          style={{
            width: '100%',
            accentColor: 'var(--color-verdigris, #176B5B)',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
}

export default ProfileHubView;
