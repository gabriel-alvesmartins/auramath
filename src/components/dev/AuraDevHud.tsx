import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, CheckCircle2, AlertTriangle, FastForward, Star, Heart,
  Smartphone, ExternalLink, Minimize2, Maximize2, Activity, Volume2, VolumeX
} from 'lucide-react';
import { gamificationEngine } from '../../services/gamificationEngine';
import { audioSynth } from '../../services/audioSynth';
import { ThumbZoneOverlay } from './ThumbZoneOverlay';

export interface AuraDevHudProps {
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

export type DevHudActionType = 'SOLVE_CORRECT' | 'FORCE_WRONG' | 'SKIP_LESSON';

export const AuraDevHud: React.FC<AuraDevHudProps> = ({ onNavigate, currentRoute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [showThumbZone, setShowThumbZone] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'active' | 'suspended' | 'muted'>('active');
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  // FPS Ticker
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (time: number) => {
      frameCountRef.current++;
      if (time - lastTimeRef.current >= 500) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current));
        setFps(measuredFps);
        frameCountRef.current = 0;
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Keyboard Shortcut: Ctrl + Shift + D or ~
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) || e.key === '`') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio Context Inspector
  useEffect(() => {
    const checkAudio = () => {
      if (audioSynth.isMuted()) {
        setAudioStatus('muted');
      } else {
        setAudioStatus('active');
      }
    };
    const interval = setInterval(checkAudio, 1500);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setLastActionToast(msg);
    setTimeout(() => setLastActionToast(null), 2000);
  };

  const dispatchDevAction = (action: DevHudActionType) => {
    window.dispatchEvent(
      new CustomEvent('auramath:dev-action', {
        detail: { action, timestamp: Date.now() },
      })
    );
    if (action === 'SOLVE_CORRECT') triggerToast('⚡ Auto-Solve (Acerto)');
    if (action === 'FORCE_WRONG') triggerToast('⚠️ Forçar Erro Injetado');
    if (action === 'SKIP_LESSON') triggerToast('⏩ Avançando para Vitória');
  };

  const handleAddXp = () => {
    gamificationEngine.addXp(100);
    audioSynth.playKeypressTick();
    triggerToast('+100 XP Concedido');
  };

  const handleAddStar = () => {
    gamificationEngine.addStars(1);
    audioSynth.playKeypressTick();
    triggerToast('+1 Estrela Concedida');
  };

  const handleRestoreHearts = () => {
    gamificationEngine.resetHearts();
    audioSynth.playKeypressTick();
    triggerToast('Corações Restaurados');
  };

  return (
    <>
      {/* 430px Thumb Zone Overlay */}
      <ThumbZoneOverlay visible={showThumbZone} opacity={0.3} />

      {/* Action Toast Feedback */}
      {lastActionToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10001,
            backgroundColor: '#202522',
            color: '#FFFDF6',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <Zap size={14} color="#F2B84B" />
          <span>{lastActionToast}</span>
        </div>
      )}

      {/* Floating Minimized Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Abrir AuraDev HUD (Ctrl+Shift+D)"
          style={{
            position: 'fixed',
            bottom: '18px',
            right: '18px',
            zIndex: 10000,
            height: '38px',
            padding: '0 12px',
            borderRadius: '999px',
            backgroundColor: '#FFFDF6',
            border: '2px solid #202522',
            boxShadow: '0 3px 0 #202522',
            color: '#202522',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 800,
            userSelect: 'none',
          }}
        >
          <Zap size={15} color="#176B5B" />
          <span>AuraDev</span>
          <span
            style={{
              backgroundColor: fps >= 55 ? '#DCEBE5' : '#F8DED9',
              color: fps >= 55 ? '#176B5B' : '#E76F61',
              padding: '1px 6px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 800,
            }}
          >
            {fps} FPS
          </span>
        </button>
      )}

      {/* Expanded Dev HUD Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '18px',
            right: '18px',
            zIndex: 10000,
            width: '320px',
            backgroundColor: '#FFFDF6',
            border: '2px solid #202522',
            borderRadius: '16px',
            boxShadow: '0 6px 0 #202522, 0 12px 24px rgba(0,0,0,0.15)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#202522',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: '#DCEBE5',
                  border: '1.5px solid #176B5B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={15} color="#176B5B" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.1 }}>AuraDev HUD</div>
                <div style={{ fontSize: '10px', color: '#5C645F' }}>God Mode & Telemetria</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  backgroundColor: fps >= 55 ? '#DCEBE5' : '#F8DED9',
                  color: fps >= 55 ? '#176B5B' : '#E76F61',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                {fps} FPS
              </span>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimizar (Ctrl+Shift+D)"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#5C645F',
                }}
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Quick Lesson Solvers (In-Game God Mode) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase' }}>
              Manipulação de Lição
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                onClick={() => dispatchDevAction('SOLVE_CORRECT')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#DCEBE5',
                  border: '1.5px solid #176B5B',
                  boxShadow: '0 2px 0 #176B5B',
                  borderRadius: '8px',
                  color: '#176B5B',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={13} />
                <span>Auto-Solve</span>
              </button>

              <button
                onClick={() => dispatchDevAction('FORCE_WRONG')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#F8DED9',
                  border: '1.5px solid #E76F61',
                  boxShadow: '0 2px 0 #E76F61',
                  borderRadius: '8px',
                  color: '#E76F61',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <AlertTriangle size={13} />
                <span>Forçar Erro</span>
              </button>
            </div>

            <button
              onClick={() => dispatchDevAction('SKIP_LESSON')}
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #202522',
                boxShadow: '0 2px 0 #202522',
                borderRadius: '8px',
                color: '#202522',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <FastForward size={14} color="#6E5AA6" />
              <span>Pular Lição para Vitória</span>
            </button>
          </div>

          {/* Quick Boosters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase' }}>
              Booster de Estado
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                onClick={handleAddXp}
                style={{
                  padding: '6px',
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #F2B84B',
                  boxShadow: '0 2px 0 #F2B84B',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#202522',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Zap size={12} color="#F2B84B" />
                <span>+100 XP</span>
              </button>

              <button
                onClick={handleAddStar}
                style={{
                  padding: '6px',
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #6E5AA6',
                  boxShadow: '0 2px 0 #6E5AA6',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#202522',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Star size={12} color="#6E5AA6" />
                <span>+1 Star</span>
              </button>

              <button
                onClick={handleRestoreHearts}
                style={{
                  padding: '6px',
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #E76F61',
                  boxShadow: '0 2px 0 #E76F61',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#202522',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Heart size={12} color="#E76F61" fill="#E76F61" />
                <span>Full ❤️</span>
              </button>
            </div>
          </div>

          {/* Viewport Ergonomics & Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid #D9D5C8',
            }}
          >
            <button
              onClick={() => setShowThumbZone((prev) => !prev)}
              style={{
                background: showThumbZone ? '#DCEBE5' : 'transparent',
                border: showThumbZone ? '1px solid #176B5B' : '1px solid #D9D5C8',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                color: showThumbZone ? '#176B5B' : '#5C645F',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <Smartphone size={12} />
              <span>Thumb Zone</span>
            </button>

            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/dev');
                } else {
                  window.location.hash = '#/dev';
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#176B5B',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <span>Abrir /dev Studio</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
