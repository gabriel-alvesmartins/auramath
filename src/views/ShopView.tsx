import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Check,
  Lock,
  Palette,
  AlertCircle,
} from 'lucide-react';
import { gamificationEngine, GamificationStoreState } from '../services/gamificationEngine';
import {
  DEFAULT_SHOP_ITEMS,
  DEFAULT_NOTEBOOK_THEMES,
  NotebookThemeId,
  ShopItem,
} from '../../packages/engine/src/gamification';
import { audioSynth } from '../services/audioSynth';

export interface ShopViewProps {
  onOpenFibonacciModal: () => void;
  onBack?: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onOpenFibonacciModal,
  onBack,
}) => {
  const [gamState, setGamState] = useState<GamificationStoreState>(gamificationEngine.getState());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    return gamificationEngine.subscribe((next) => {
      setGamState(next);
    });
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleBuyItem = (item: ShopItem) => {
    audioSynth.playKeypressTick();

    if (item.actionType === 'open_fibonacci_modal') {
      onOpenFibonacciModal();
      return;
    }

    const res = gamificationEngine.buyShopItem(item);
    if (res.success) {
      audioSynth.playVictoryFanfare();
      showToast(res.message, 'success');
    } else {
      audioSynth.playErrorSoftRelease();
      showToast(res.message, 'error');
    }
  };

  const handleEquipTheme = (themeId: NotebookThemeId) => {
    audioSynth.playKeypressTick();
    const res = gamificationEngine.equipTheme(themeId);
    if (res.success) {
      audioSynth.playChestReward();
      showToast(res.message, 'success');
    } else {
      audioSynth.playErrorSoftRelease();
      showToast(res.message, 'error');
    }
  };

  const catalog = gamificationEngine.getShopCatalog();
  const themes = gamificationEngine.getNotebookThemes();
  const freezes = gamState.streak.freezesAvailable;
  const isBoostActive = !!(gamState.activeXpBoost && gamState.activeXpBoost.expiresAt > Date.now());

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        paddingBottom: '88px',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 150,
            maxWidth: '380px',
            width: 'calc(100% - 32px)',
            backgroundColor:
              toastMessage.type === 'success'
                ? 'var(--color-bg-surface, #FFFDF6)'
                : '#FDF2F0',
            border:
              toastMessage.type === 'success'
                ? '1.5px solid var(--color-verdigris, #176B5B)'
                : '1.5px solid var(--color-coral, #E76F61)',
            borderRadius: '14px',
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(32, 37, 34, 0.16)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toastMessage.type === 'success' ? (
            <Check size={18} color="var(--color-verdigris, #176B5B)" strokeWidth={2.5} />
          ) : (
            <AlertCircle size={18} color="var(--color-coral, #E76F61)" />
          )}
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-text-primary, #202522)',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            }}
          >
            {toastMessage.text}
          </span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && (
            <button
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                onBack();
              }}
              className="aura-3d-btn aura-3d-btn--neutral aura-3d-btn--icon-sm"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: '1px solid var(--color-border-subtle, #D9D5C8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary, #202522)',
              }}
              aria-label="Voltar"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Loja Editorial
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
              Boutique matemática de foco e prestígio
            </span>
          </div>
        </div>

        {/* Gems Balance Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'rgba(242, 184, 75, 0.15)',
            border: '1.5px solid var(--color-marigold, #F2B84B)',
            borderRadius: '14px',
          }}
        >
          <Sparkles size={14} color="var(--color-marigold-deep, #A97A1C)" />
          <span
            className="font-mono-tabular"
            style={{
              fontSize: '0.88rem',
              fontWeight: 900,
              color: 'var(--color-marigold-deep, #A97A1C)',
            }}
          >
            {gamState.stars}
          </span>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-marigold-deep, #A97A1C)' }}>
            ✦
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 1: Aura Fibonacci Prestige Banner */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            border: '2px solid var(--color-marigold, #F2B84B)',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            padding: '18px 16px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(242, 184, 75, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Subtle golden corner arc */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(242, 184, 75, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(242, 184, 75, 0.18)',
                padding: '2px 8px',
                borderRadius: '8px',
              }}
            >
              <Sparkles size={12} color="var(--color-marigold-deep, #A97A1C)" />
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 900,
                  color: 'var(--color-marigold-deep, #A97A1C)',
                  letterSpacing: '0.06em',
                }}
              >
                PRESTÍGIO MÁXIMO
              </span>
            </div>

            {gamState.isFibonacciMember && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-verdigris, #176B5B)',
                }}
              >
                ✓ ASSINATURA ATIVA
              </span>
            )}
          </div>

          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Aura Fibonacci
            </h3>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-ink-secondary, #5C645F)',
                margin: '4px 0 0',
                lineHeight: 1.35,
              }}
            >
              Radar Cognitivo ilimitado, desafios lendários sem bloqueios, temas de caderno e selo da Espiral Áurea.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSynth.playKeypressTick();
              onOpenFibonacciModal();
            }}
            className="aura-3d-btn aura-3d-btn--marigold"
            style={{
              width: '100%',
              height: '46px',
              fontSize: '0.86rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {gamState.isFibonacciMember ? 'VER MEUS PRIVILÉGIOS ➔' : 'EXPERIMENTAR 7 DIAS GRÁTIS ➔'}
          </button>
        </div>

        {/* Section 2: Streak Protection & Consistency */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Shield size={16} color="var(--color-verdigris, #176B5B)" />
            <h2
              style={{
                fontSize: '0.94rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Ofensiva & Proteção
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Streak Freeze Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '1px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(23, 107, 91, 0.1)',
                    border: '1.5px solid var(--color-verdigris, #176B5B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Shield size={20} color="var(--color-verdigris, #176B5B)" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: 'var(--color-text-primary, #202522)',
                      fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                    }}
                  >
                    Bloqueio de Gelo
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', lineHeight: 1.25 }}>
                    Protege sua ofensiva se você não praticar hoje.
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--color-verdigris, #176B5B)',
                      marginTop: '3px',
                    }}
                  >
                    Cargas equipadas: {freezes}/2
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={freezes >= 2}
                onClick={() => {
                  const freezeItem = catalog.find((i) => i.actionType === 'buy_freeze');
                  if (freezeItem) handleBuyItem(freezeItem);
                }}
                className={freezes >= 2 ? 'aura-3d-btn aura-3d-btn--neutral' : 'aura-3d-btn aura-3d-btn--primary'}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  cursor: freezes >= 2 ? 'default' : 'pointer',
                  opacity: freezes >= 2 ? 0.6 : 1,
                }}
              >
                {freezes >= 2 ? 'MÁXIMO' : '100 ✦'}
              </button>
            </div>

            {/* Streak Wager Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '1px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(231, 111, 97, 0.1)',
                    border: '1.5px solid var(--color-coral, #E76F61)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Flame size={20} color="var(--color-coral, #E76F61)" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: 'var(--color-text-primary, #202522)',
                      fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                    }}
                  >
                    Contrato de 7 Dias
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', lineHeight: 1.25 }}>
                    Aposte 50 gemas na sua disciplina e ganhe 100 de volta.
                  </div>
                  {gamState.streak.wager?.status === 'active' && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-coral, #E76F61)', marginTop: '3px' }}>
                      Progresso: {gamState.streak.wager.daysCompleted}/7 dias
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={gamState.streak.wager?.status === 'active'}
                onClick={() => {
                  const wagerItem = catalog.find((i) => i.actionType === 'buy_wager');
                  if (wagerItem) handleBuyItem(wagerItem);
                }}
                className={gamState.streak.wager?.status === 'active' ? 'aura-3d-btn aura-3d-btn--neutral' : 'aura-3d-btn aura-3d-btn--coral'}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  cursor: gamState.streak.wager?.status === 'active' ? 'default' : 'pointer',
                  opacity: gamState.streak.wager?.status === 'active' ? 0.6 : 1,
                }}
              >
                {gamState.streak.wager?.status === 'active' ? 'ATIVO' : '50 ✦'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Cognitive Boost (XP Boost) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Zap size={16} color="var(--color-marigold-deep, #A97A1C)" />
            <h2
              style={{
                fontSize: '0.94rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Impulso Cognitivo
            </h2>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '1px solid var(--color-border-subtle, #D9D5C8)',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(242, 184, 75, 0.15)',
                  border: '1.5px solid var(--color-marigold, #F2B84B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap size={20} color="var(--color-marigold-deep, #A97A1C)" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary, #202522)',
                    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                  }}
                >
                  Poção de Foco (2x XP)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', lineHeight: 1.25 }}>
                  Dobra todos os seus pontos de XP por 15 minutos contínuos.
                </div>
                {isBoostActive && (
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--color-marigold-deep, #A97A1C)',
                      marginTop: '3px',
                    }}
                  >
                    ⚡ Bônus ativo no cabeçalho
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isBoostActive}
              onClick={() => {
                const boostItem = catalog.find((i) => i.actionType === 'buy_boost');
                if (boostItem) handleBuyItem(boostItem);
              }}
              className="aura-3d-btn aura-3d-btn--marigold"
              style={{
                height: '38px',
                padding: '0 12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                flexShrink: 0,
                cursor: isBoostActive ? 'default' : 'pointer',
                opacity: isBoostActive ? 0.6 : 1,
              }}
            >
              {isBoostActive ? 'EM USO' : '150 ✦'}
            </button>
          </div>
        </div>

        {/* Section 4: Notebook Themes & Customization */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Palette size={16} color="var(--color-iris, #6E5AA6)" />
            <h2
              style={{
                fontSize: '0.94rem',
                fontWeight: 900,
                margin: 0,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Cadernos & Personalização
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {themes.map((theme) => {
              const isEquipped = gamState.activeTheme === theme.id;
              const isLocked = theme.isExclusiveFibonacci && !gamState.isFibonacciMember && !gamState.unlockedThemes.includes(theme.id);

              return (
                <div
                  key={theme.id}
                  style={{
                    backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                    border: isEquipped
                      ? '2px solid var(--color-verdigris, #176B5B)'
                      : '1px solid var(--color-border-subtle, #D9D5C8)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Theme Swatch Preview */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: theme.previewBg,
                        border: `1.5px solid ${theme.previewBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
                        flexShrink: 0,
                      }}
                    >
                      {isLocked && <Lock size={14} color="#FFF" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary, #202522)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {theme.name}
                        {theme.isExclusiveFibonacci && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              color: 'var(--color-marigold-deep, #A97A1C)',
                              backgroundColor: 'rgba(242, 184, 75, 0.18)',
                              padding: '1px 5px',
                              borderRadius: '6px',
                            }}
                          >
                            FIBONACCI
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
                        {theme.tagline}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isEquipped ? (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: 'var(--color-verdigris, #176B5B)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Check size={14} strokeWidth={3} /> EM USO
                      </span>
                    ) : isLocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          audioSynth.playKeypressTick();
                          onOpenFibonacciModal();
                        }}
                        className="aura-3d-btn aura-3d-btn--marigold"
                        style={{
                          height: '34px',
                          padding: '0 10px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                        }}
                      >
                        LIBERAR
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEquipTheme(theme.id)}
                        className="aura-3d-btn aura-3d-btn--neutral"
                        style={{
                          height: '34px',
                          padding: '0 10px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                        }}
                      >
                        EQUIPAR
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
