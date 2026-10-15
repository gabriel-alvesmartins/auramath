import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Compass, Shield, Palette, Zap } from 'lucide-react';
import { PrismaMascotWeb } from '../PrismaMascotWeb';
import { audioSynth } from '../../services/audioSynth';

export interface AuraFibonacciModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: 'annual' | 'monthly') => void;
  isSubscribed?: boolean;
}

const AuraFibonacciModalComponent: React.FC<AuraFibonacciModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  isSubscribed = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  // Keyboard Escape dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: 'annual' | 'monthly') => {
    audioSynth.playKeypressTick();
    setSelectedPlan(plan);
  };

  const handleAction = () => {
    audioSynth.playVictoryFanfare();
    onSubscribe(selectedPlan);
  };

  const features = [
    {
      icon: Compass,
      title: 'Radar Cognitivo Ilimitado',
      desc: 'Mapeamento contínuo dos 5 eixos matemáticos e evolução de arquétipo sem travas.',
    },
    {
      icon: Shield,
      title: 'Treinos de Maestria Sem Fim',
      desc: 'Pratique desafios lendários e modos de velocidade com zero perda punitiva de energia.',
    },
    {
      icon: Palette,
      title: 'Cadernos Exclusivos de Alexandria',
      desc: 'Acesso imediato aos temas Blueprint Geométrico e Dark Obsidian de alto contraste.',
    },
    {
      icon: Sparkles,
      title: 'Selo Dourado da Espiral de Fibonacci',
      desc: 'Distinção de prestígio ao lado do seu nome nas Ligas Semanais e no Perfil.',
    },
    {
      icon: Zap,
      title: 'Gemas em Dobro nos Baús',
      desc: 'Colete 2x mais Gemas Marigold nos Baús Madrugador (06h–12h) e Notívago (18h–24h).',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(21, 24, 23, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioSynth.playKeypressTick();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '414px',
          maxHeight: '92vh',
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          borderRadius: '24px',
          border: '2px solid var(--color-marigold, #F2B84B)',
          boxShadow: '0 16px 48px rgba(32, 37, 34, 0.28), 0 0 0 1px rgba(242, 184, 75, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header Glow Ribbon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #176B5B, #F2B84B, #E76F61, #6E5AA6)',
          }}
        />

        {/* Close Button (Tactile 3D Neutral, Anti-Guilt) */}
        <button
          type="button"
          onClick={() => {
            audioSynth.playKeypressTick();
            onClose();
          }}
          className="aura-3d-btn aura-3d-btn--neutral aura-3d-btn--icon-sm"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            backgroundColor: 'var(--color-bg-base, #F7F4EA)',
            color: 'var(--color-text-muted, #727A75)',
          }}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Scrollable Content Body */}
        <div
          style={{
            overflowY: 'auto',
            padding: '24px 20px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Golden Spiral Mascot Vignette */}
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '110px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '4px',
            }}
          >
            {/* Ambient Golden Spiral SVG */}
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                width: '130px',
                height: '130px',
                opacity: 0.32,
                transform: 'rotate(-25deg)',
              }}
            >
              <path
                d="M 50,50 A 5,5 0 0,1 55,50 A 10,10 0 0,1 45,50 A 18,18 0 0,1 63,50 A 30,30 0 0,1 33,50 A 48,48 0 0,1 81,50"
                fill="none"
                stroke="var(--color-marigold, #F2B84B)"
                strokeWidth="2.4"
                strokeDasharray="3,3"
              />
              <circle cx="50" cy="50" r="3" fill="var(--color-marigold, #F2B84B)" />
            </svg>

            <PrismaMascotWeb state="supernova" size={88} showSpeechBubble={false} />
          </div>

          {/* Title & Editorial Tagline */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(242, 184, 75, 0.16)',
                border: '1.5px solid var(--color-marigold, #F2B84B)',
                borderRadius: '16px',
                padding: '4px 12px',
                marginBottom: '8px',
              }}
            >
              <Sparkles size={14} color="var(--color-marigold-deep, #A97A1C)" />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-marigold-deep, #A97A1C)',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                ASSINATURA DE PRESTÍGIO
              </span>
            </div>

            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                letterSpacing: '-0.02em',
              }}
            >
              Aura Fibonacci
            </h2>
            <p
              style={{
                fontSize: '0.84rem',
                margin: '6px 0 0',
                color: 'var(--color-ink-secondary, #5C645F)',
                lineHeight: 1.35,
              }}
            >
              Eleve sua visão matemática além dos cálculos mecânicos com a experiência editorial completa.
            </p>
          </div>

          {/* Privilege Checklist */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--color-bg-base, #F7F4EA)',
              border: '1px solid var(--color-border-subtle, #D9D5C8)',
              borderRadius: '18px',
              padding: '14px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxSizing: 'border-box',
            }}
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(23, 107, 91, 0.12)',
                      border: '1px solid var(--color-verdigris, #176B5B)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    <Check size={14} color="var(--color-verdigris, #176B5B)" strokeWidth={3} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary, #202522)',
                        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      }}
                    >
                      {feat.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--color-ink-secondary, #5C645F)',
                        lineHeight: 1.28,
                        marginTop: '1px',
                      }}
                    >
                      {feat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plan Selector Grid */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              boxSizing: 'border-box',
            }}
          >
            {/* Annual Plan */}
            <div
              onClick={() => handleSelectPlan('annual')}
              style={{
                position: 'relative',
                border: selectedPlan === 'annual'
                  ? '2px solid var(--color-marigold, #F2B84B)'
                  : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                backgroundColor: selectedPlan === 'annual'
                  ? 'rgba(242, 184, 75, 0.1)'
                  : 'var(--color-bg-base, #F7F4EA)',
                borderRadius: '16px',
                padding: '12px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: selectedPlan === 'annual' ? '0 4px 12px rgba(242, 184, 75, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Badge 7 Dias Grátis */}
              <div
                style={{
                  position: 'absolute',
                  top: '-9px',
                  right: '8px',
                  backgroundColor: 'var(--color-marigold, #F2B84B)',
                  color: '#202522',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                7 DIAS GRÁTIS
              </div>

              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary, #202522)',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                Plano Anual
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span
                  className="font-mono-tabular"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--color-verdigris, #176B5B)',
                  }}
                >
                  R$ 14,90
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-secondary, #5C645F)' }}>/mês</span>
              </div>
              <span
                className="font-mono-tabular"
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-muted, #727A75)',
                }}
              >
                R$ 178,80 / ano (-40%)
              </span>
            </div>

            {/* Monthly Plan */}
            <div
              onClick={() => handleSelectPlan('monthly')}
              style={{
                border: selectedPlan === 'monthly'
                  ? '2px solid var(--color-verdigris, #176B5B)'
                  : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                backgroundColor: selectedPlan === 'monthly'
                  ? 'rgba(23, 107, 91, 0.08)'
                  : 'var(--color-bg-base, #F7F4EA)',
                borderRadius: '16px',
                padding: '12px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: selectedPlan === 'monthly' ? '0 4px 12px rgba(23, 107, 91, 0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary, #202522)',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                Plano Mensal
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span
                  className="font-mono-tabular"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--color-text-primary, #202522)',
                  }}
                >
                  R$ 24,90
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-secondary, #5C645F)' }}>/mês</span>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-muted, #727A75)',
                }}
              >
                Flexível, sem fidelidade
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Tactile Action Drawer */}
        <div
          style={{
            padding: '14px 20px 20px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            borderTop: '1px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box',
          }}
        >
          {isSubscribed ? (
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(23, 107, 91, 0.12)',
                borderRadius: '14px',
                textAlign: 'center',
                color: 'var(--color-verdigris, #176B5B)',
                fontWeight: 800,
                fontSize: '0.88rem',
              }}
            >
              ✨ Você já é Membro Aura Fibonacci!
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAction}
              className="aura-3d-btn aura-3d-btn--marigold"
              style={{
                width: '100%',
                height: '52px',
                fontSize: '0.94rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {selectedPlan === 'annual' ? 'EXPERIMENTAR 7 DIAS GRÁTIS ➔' : 'COMEÇAR AGORA ➔'}
            </button>
          )}

          <div
            style={{
              textAlign: 'center',
              fontSize: '0.68rem',
              color: 'var(--color-text-muted, #727A75)',
              lineHeight: 1.3,
            }}
          >
            Sem compromisso. Cancele com 1 clique nas configurações antes do término do teste sem cobrança.
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuraFibonacciModal = React.memo(AuraFibonacciModalComponent);
export default AuraFibonacciModal;
