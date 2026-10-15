import React from 'react';
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuraMascotWeb } from '../../components/AuraMascotWeb';
import { Aura3DButton } from '../../components/tactile/Aura3DButton';
import { audioSynth } from '../../services/audioSynth';

export interface OnboardingWelcomeStepProps {
  onStart: () => void;
  onSkip: () => void;
}

export const OnboardingWelcomeStep: React.FC<OnboardingWelcomeStepProps> = ({
  onStart,
  onSkip,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: '24px 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* Top Header / Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.03em', marginTop: '12px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            fontWeight: 800,
            fontSize: '1.45rem',
            color: 'var(--color-text-primary, #202522)',
          }}
        >
          aura
        </span>
        <span
          style={{
            display: 'inline-block',
            margin: '0 3px',
            fontSize: '1rem',
            color: 'var(--color-verdigris, #176B5B)',
            transform: 'translateY(-1px)',
          }}
        >
          ●
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            fontWeight: 800,
            fontSize: '1.45rem',
            color: 'var(--color-text-primary, #202522)',
          }}
        >
          math
        </span>
      </div>

      {/* Center Mascot & Philosophy */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '360px',
          margin: '20px 0',
        }}
      >
        <AuraMascotWeb
          size={140}
          state="happy"
          stage={1}
          speechText="Não calcule. Veja!"
          showTierBadge={false}
        />

        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            margin: '18px 0 8px',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          A matemática não é cálculo. É visão.
        </h1>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-secondary, #5C645F)',
            margin: '0 0 20px',
            lineHeight: 1.45,
          }}
        >
          A escola ensinou a virar uma calculadora mecânica. Aqui você aprende a desvendar a estrutura oculta dos números.
        </p>

        {/* The Discovery Contrast Card (98 + 47) */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
            padding: '16px',
            textAlign: 'left',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-secondary, #5C645F)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Sparkles size={14} color="var(--color-verdigris, #176B5B)" />
            <span>O Poder do Padrão Mental</span>
          </div>

          {/* Traditional Method vs Aura Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Traditional */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-coral-soft, #F8DED9)',
                border: '1px solid var(--color-coral, #E76F61)',
              }}
            >
              <AlertCircle size={16} color="var(--color-coral, #E76F61)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-coral-bevel, #C75144)' }}>
                  Método Tradicional (8 segundos):
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-primary, #202522)' }}>
                  Armar 98 sobre 47 no papel, somar 8+7=15, carregar 1, sofrer...
                </div>
              </div>
            </div>

            {/* Aura Method */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                border: '1.5px solid var(--color-verdigris, #176B5B)',
              }}
            >
              <CheckCircle2 size={16} color="var(--color-verdigris, #176B5B)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
                  Método Aura (1 segundo):
                </div>
                <div
                  className="font-mono-tabular"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary, #202522)',
                    marginTop: '2px',
                  }}
                >
                  98 + 47 = 100 + 45 = <strong>145</strong> ✦
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--color-text-secondary, #5C645F)', marginTop: '2px' }}>
                  Doe 2 para o 98 virar 100 e veja a resposta instantaneamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Skip Button */}
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Aura3DButton
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => {
            audioSynth.playKeypressTick();
            onStart();
          }}
          rightIcon={<ArrowRight size={20} strokeWidth={2.4} />}
        >
          COMEÇAR DESCOBERTA ➔
        </Aura3DButton>

        <button
          type="button"
          onClick={() => {
            audioSynth.playKeypressTick();
            onSkip();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary, #5C645F)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '8px',
            textDecoration: 'underline',
          }}
        >
          Pular e ir direto para a Trilha
        </button>
      </div>
    </div>
  );
};
