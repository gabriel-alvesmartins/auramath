import React, { useState, useEffect } from 'react';
import { CheckCircle2, Play, Lock, Star, X, Zap, Crown } from 'lucide-react';
import { TrackNodeData } from '../../engine';
import { audioSynth } from '../../services/audioSynth';
import { Aura3DButton } from './Aura3DButton';
import { AuraMascotWeb } from '../AuraMascotWeb';

export interface TrackSerpentineNodeProps {
  node: TrackNodeData;
  index?: number;
  isCurrent?: boolean;
  isActive?: boolean;
  isCompleted?: boolean;
  stars?: number; // 0 to 3
  isLegendary?: boolean;
  onClick?: (node: TrackNodeData) => void;
  onStartLesson?: (node: TrackNodeData) => void;
  onStartLegendary?: (node: TrackNodeData) => void;
  showMascot?: boolean;
  mascotSpeech?: string;
  isPopoverOpen?: boolean;
  onClosePopover?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TrackSerpentineNode — Duolingo-inspired 3D circular node with progress ring, star crown, and popover.
 *
 * Characteristics:
 * - 80x80px 3D circular node with 6px bottom bevel, sinking 4px on press
 * - Concentric SVG progress ring animating 0% to 100%
 * - Star Orbit Crown with 3 stars docked at node bottom
 * - Action popover card with title, XP reward, and full-width Aura3DButton to launch lesson
 * - Anchored Mascot Socket for companion Aura floating beside active node
 */
const TrackSerpentineNodeComponent: React.FC<TrackSerpentineNodeProps> = ({
  node,
  index = 0,
  isCurrent = false,
  isActive: propIsActive,
  isCompleted: propIsCompleted,
  stars: propStars,
  isLegendary: propIsLegendary,
  onClick,
  onStartLesson,
  onStartLegendary,
  showMascot = false,
  mascotSpeech,
  isPopoverOpen: controlledPopoverOpen,
  onClosePopover,
  className = '',
  style,
}) => {
  const [internalPopoverOpen, setInternalPopoverOpen] = useState(false);

  const effectiveStars = propStars !== undefined ? propStars : node.stars;
  const isCompleted = propIsCompleted !== undefined ? propIsCompleted : effectiveStars > 0;
  const isLocked = node.isLocked && !isCompleted;
  const isActive = propIsActive !== undefined ? propIsActive : (!isLocked || isCurrent);

  const popoverOpen = controlledPopoverOpen !== undefined ? controlledPopoverOpen : internalPopoverOpen;

  const handleNodeClick = () => {
    if (isLocked) {
      audioSynth.playErrorSoftRelease();
      return;
    }

    audioSynth.playKeypressTick();

    if (onClick) {
      onClick(node);
    }

    if (controlledPopoverOpen === undefined) {
      setInternalPopoverOpen((prev) => !prev);
    }
  };

  const handleClosePopover = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onClosePopover) {
      onClosePopover();
    }
    if (controlledPopoverOpen === undefined) {
      setInternalPopoverOpen(false);
    }
  };

  useEffect(() => {
    if (!popoverOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePopover();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [popoverOpen]);

  const handleLaunchLesson = () => {
    handleClosePopover();
    if (effectiveStars === 3 && onStartLegendary) {
      onStartLegendary(node);
      return;
    }
    if (onStartLesson) {
      onStartLesson(node);
    }
  };

  // SVG Ring Math: r = 44, circumference = 2 * PI * 44 ≈ 276.46
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressRatio = isCompleted ? 1 : effectiveStars > 0 ? effectiveStars / 3 : 0;
  const strokeDashoffset = ringCircumference - ringCircumference * progressRatio;

  const isLegendary = propIsLegendary !== undefined ? propIsLegendary : Boolean(node.legendary || (isCompleted && effectiveStars === 3));

  // Node Color Schemes (Rebrand 01.1: Verdigris & Marigold)
  const getNodeStyles = () => {
    if (isCompleted) {
      return {
        bg: 'var(--color-verdigris, #176B5B)',
        bevel: isLegendary ? 'var(--color-marigold-bevel, #D49A2E)' : 'var(--color-verdigris-bevel, #104E42)',
        glow: isLegendary ? '0 0 12px rgba(242, 184, 75, 0.45)' : 'none',
        ringColor: isLegendary ? 'var(--color-marigold, #F2B84B)' : 'var(--color-verdigris, #176B5B)',
      };
    }
    if (isActive) {
      return {
        bg: 'var(--color-marigold, #F2B84B)',
        bevel: 'var(--color-marigold-bevel, #D49A2E)',
        glow: 'none',
        ringColor: 'var(--color-marigold, #F2B84B)',
      };
    }
    return {
      bg: 'var(--color-cream, #FFFDF6)',
      bevel: 'var(--color-border-bold, #C2BDAE)',
      glow: 'none',
      ringColor: 'var(--color-border-subtle, #D9D5C8)',
    };
  };

  const nodeStyle = getNodeStyles();

  return (
    <div
      className={`track-serpentine-node ${popoverOpen ? 'is-popover-open' : ''} ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        zIndex: popoverOpen ? 35 : 5,
        ...style,
      }}
    >
      {/* 1. Anchored Mascot Companion Socket */}
      {showMascot && (
        <div
          className="mascot-socket"
          style={{
            position: 'absolute',
            right: '-115px',
            top: '-15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <AuraMascotWeb
            size={68}
            state={isCompleted ? 'happy' : 'idle'}
            speechText={mascotSpeech || 'Vamos treinar!'}
            showTierBadge={false}
          />
        </div>
      )}

      {/* 2. 80x80 3D Circular Node Chassis */}
      <div style={{ position: 'relative', width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Concentric SVG Progress Ring */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '96px',
            height: '96px',
            pointerEvents: 'none',
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background Ring Track */}
          <circle
            cx="48"
            cy="48"
            r={ringRadius}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="3.5"
          />
          {/* Animated Active Progress Ring */}
          {!isLocked && (
            <circle
              cx="48"
              cy="48"
              r={ringRadius}
              fill="none"
              stroke={nodeStyle.ringColor}
              strokeWidth="4"
              strokeDasharray={ringCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          )}
        </svg>

        {/* 3D Circular Button with 6px extrusion and 4px depression */}
        <button
          type="button"
          disabled={isLocked}
          onClick={handleNodeClick}
          aria-label={`${node.title} - ${isLocked ? 'Bloqueado' : isCompleted ? 'Completado' : 'Disponível'}`}
          className={`aura-3d-btn ${isLocked ? 'is-disabled' : ''}`}
          style={{
            width: '80px',
            height: '80px',
            minWidth: '80px',
            minHeight: '80px',
            borderRadius: '50%',
            padding: 0,
            border: '2px solid var(--color-ink, #202522)',
            backgroundColor: nodeStyle.bg,
            // 6px bottom bevel, sinking 4px
            ['--btn-extrusion' as string]: 'var(--extrusion-lg, 6px)',
            ['--btn-depression' as string]: 'var(--depression-lg, 4px)',
            ['--btn-bevel' as string]: nodeStyle.bevel,
            ['--btn-bg' as string]: nodeStyle.bg,
            boxShadow: `0 6px 0 ${nodeStyle.bevel}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            zIndex: 2,
          }}
        >
          {isCompleted ? (
            isLegendary ? (
              <Crown size={34} color="#FFF0C9" strokeWidth={2.4} fill="#F2B84B" />
            ) : (
              <CheckCircle2 size={36} color="#FFFFFF" strokeWidth={2.8} />
            )
          ) : isActive ? (
            <Play size={32} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: '4px' }} />
          ) : (
            <Lock size={26} color="var(--color-text-muted)" />
          )}
        </button>

        {/* 3. Star Orbit Crown (3 Stars Docked at Bottom) */}
        {!isLocked && (
          <div
            className="star-orbit-crown"
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backgroundColor: 'var(--color-cream, #FFFDF6)',
              border: '1.5px solid var(--color-ink, #202522)',
              borderRadius: '12px',
              padding: '2px 8px',
              boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
              zIndex: 3,
            }}
          >
            {[1, 2, 3].map((starNum) => {
              const isEarned = starNum <= effectiveStars;
              return (
                <Star
                  key={starNum}
                  size={12}
                  strokeWidth={2.2}
                  fill={isEarned ? 'var(--color-gold)' : 'none'}
                  color={isEarned ? 'var(--color-gold)' : 'var(--color-border-bold, #C2BDAE)'}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Node Title Label */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '0.84rem',
          fontWeight: 800,
          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          textAlign: 'center',
          maxWidth: '130px',
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </div>

      {/* Click-outside transparent dismissal backdrop */}
      {popoverOpen && (
        <div
          className="node-popover-backdrop"
          onClick={handleClosePopover}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 35,
            background: 'transparent',
            cursor: 'default',
          }}
        />
      )}

      {/* 4. Action Popover Card (Duolingo Style - Optimized & Hardware Accelerated) */}
      {popoverOpen && (
        <div
          role="dialog"
          aria-label={`Lição ${index + 1}: ${node.title}`}
          className="node-action-popover"
          style={{
            position: 'absolute',
            top: '105px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-cream, #FFFDF6)',
            border: '2px solid var(--color-ink, #202522)',
            borderRadius: '20px',
            padding: '16px',
            width: '264px',
            maxWidth: 'min(280px, calc(100vw - 32px))',
            boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE), 0 6px 20px rgba(32, 37, 34, 0.14)',
            zIndex: 40,
            boxSizing: 'border-box',
          }}
        >
          {/* Duolingo Caret Pointer */}
          <div className="node-action-popover-caret" aria-hidden="true" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-verdigris, #176B5B)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Lição {index + 1}
              </div>
              <div
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  color: 'var(--color-ink, #202522)',
                  letterSpacing: '-0.01em',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                {node.title}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClosePopover}
              aria-label="Fechar detalhes da lição"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
              margin: '0 0 14px',
              lineHeight: 1.35,
            }}
          >
            {node.subtitle || 'Domine esta técnica mental com cálculo direto de alta velocidade.'}
          </p>

          <Aura3DButton
            variant={effectiveStars === 3 ? 'marigold' : 'verdigris'}
            fullWidth
            size="md"
            icon={effectiveStars === 3 ? <Crown size={16} /> : <Zap size={16} />}
            onClick={handleLaunchLesson}
          >
            {node.legendary
              ? 'TREINO LENDÁRIO (+30 XP)'
              : effectiveStars === 3
              ? 'DESAFIO LENDÁRIO (+50 XP) 👑'
              : isCompleted
              ? 'REVISAR (+15 XP)'
              : 'COMEÇAR (+15 XP)'}
          </Aura3DButton>
        </div>
      )}
    </div>
  );
};

export const TrackSerpentineNode = React.memo(TrackSerpentineNodeComponent);
export default TrackSerpentineNode;
