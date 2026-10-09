import React, { useState, useEffect } from 'react';
import {
  Compass, Zap, Swords, Shapes, User, Flame, Star, Volume2, VolumeX,
  Wifi, Battery, BookOpen
} from 'lucide-react';
import { audioSynth } from './services/audioSynth';
import { TrackView } from './views/TrackView';
import { TrainHubView } from './views/TrainHubView';
import { DuelHubView } from './views/DuelHubView';
import { ProfileHubView } from './views/ProfileHubView';
import { DuolingoLessonView } from './views/DuolingoLessonView';
import { DevComplianceView } from './views/DevComplianceView';
import { ThemeToggle } from './components/tactile/ThemeToggle';
import { gamificationEngine } from './services/gamificationEngine';
import {
  StreakPopoverModal,
  XpBoostBadge,
  AchievementUnlockModal,
  AuraNudgeToast,
} from './components/gamification';

export type AppRoute =
  | { type: 'track' }
  | { type: 'train' }
  | { type: 'duels' }
  | { type: 'profile' }
  | { type: 'lesson'; nodeId: string }
  | { type: 'dev' };

function parseRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return { type: 'track' };
  }
  const hash = (window.location?.hash || '').replace(/^#\/?/, '').trim();
  let pathname = (window.location?.pathname || '').replace(/^\//, '').trim();
  if (pathname.startsWith('auramath/')) {
    pathname = pathname.slice('auramath/'.length).trim();
  } else if (pathname === 'auramath') {
    pathname = '';
  }
  const segment = hash || pathname;

  if (segment === 'dev' || segment.startsWith('dev/')) {
    return { type: 'dev' };
  }
  if (segment.startsWith('lesson/')) {
    const nodeId = segment.slice('lesson/'.length).trim();
    if (nodeId) {
      return { type: 'lesson', nodeId };
    }
  }
  if (segment === 'train' || segment.startsWith('train/')) {
    return { type: 'train' };
  }
  if (segment === 'duels' || segment.startsWith('duels/')) {
    return { type: 'duels' };
  }
  if (segment === 'profile' || segment.startsWith('profile/')) {
    return { type: 'profile' };
  }
  return { type: 'track' };
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(parseRoute);
  const [isMuted, setIsMuted] = useState(false);
  const [gamState, setGamState] = useState(gamificationEngine.getState());
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const streak = gamState.streak.current;
  const stars = gamState.stars;
  const xp = gamState.xp;

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(parseRoute());
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      const clean = path.replace(/^#?\/?/, '');
      const isGhPages = window.location.pathname.startsWith('/auramath');
      const target = isGhPages ? `/auramath/${clean}` : `/${clean}`;
      try {
        window.history.pushState(null, '', target);
      } catch {}
      setRoute(parseRoute());
    }
  };

  useEffect(() => {
    return gamificationEngine.subscribe((next) => {
      setGamState(next);
    });
  }, []);

  useEffect(() => {
    const handleFirstTouch = () => {
      audioSynth.init();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioSynth.setMuted(next);
  };

  // ERP Mode: Accessible ONLY by URL route (/dev or #/dev)
  if (route.type === 'dev') {
    return (
      <DevComplianceView
        onReturn={() => navigateTo('/track')}
        onStartLesson={(nodeId) => navigateTo(`/lesson/${nodeId}`)}
      />
    );
  }

  const isLesson = route.type === 'lesson';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-desktop, #E5DEC9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'var(--font-body, Inter, sans-serif)',
      color: 'var(--color-text-primary, #202522)',
      transition: 'background-color 0.2s ease, color 0.2s ease'
    }}>
      {/* Centered Mobile Device Frame */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100vh',
        backgroundColor: route.type === 'track' ? 'var(--color-track-bg, #EFE7D5)' : 'var(--color-bg-base, #F7F4EA)',
        borderLeft: '1px solid var(--color-border-subtle, #D9D5C8)',
        borderRight: '1px solid var(--color-border-subtle, #D9D5C8)',
        boxShadow: '0 4px 24px rgba(32, 37, 34, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* iOS Native Status Bar */}
        <div style={{
          height: '44px',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--color-text-primary, #202522)',
          zIndex: 40,
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)'
        }}>
          <span>9:41</span>
          {/* Dynamic Island Pill */}
          <div style={{
            width: '110px',
            height: '24px',
            backgroundColor: 'var(--color-ink, #202522)',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(32, 37, 34, 0.2)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        {/* Mobile App Header (escondido durante a lição imersiva) */}
        {!isLesson && (
          <header style={{
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}>
            {/* Left Avatar & Lowercase Wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Observation Dot Avatar Badge */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-cream, #FFFDF6)',
                border: '1.5px solid var(--color-ink, #202522)',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="13" rx="8" ry="7" fill="var(--color-cream, #FFFDF6)" stroke="var(--color-ink, #202522)" strokeWidth="1.6" />
                  <circle cx="9.5" cy="12.5" r="1.3" fill="var(--color-ink, #202522)" />
                  <circle cx="14.5" cy="12.5" r="1.3" fill="var(--color-ink, #202522)" />
                  <path d="M11 15c.5.4 1.5.4 2 0" stroke="var(--color-ink, #202522)" strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M12 6v2" stroke="var(--color-ink, #202522)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="4.5" r="2.2" fill="var(--color-marigold, #F2B84B)" stroke="var(--color-ink, #202522)" strokeWidth="1.3" />
                </svg>
              </div>

              {/* Lowercase Wordmark with Observation Dot */}
              <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.03em' }}>
                <span style={{
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                  fontWeight: 800,
                  fontSize: '1.08rem',
                  color: 'var(--color-text-primary, #202522)'
                }}>
                  aura
                </span>
                <span style={{
                  display: 'inline-block',
                  margin: '0 2px',
                  fontSize: '0.78rem',
                  color: 'var(--color-verdigris, #176B5B)',
                  transform: 'translateY(-1px)'
                }}>
                  ●
                </span>
                <span style={{
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                  fontWeight: 800,
                  fontSize: '1.08rem',
                  color: 'var(--color-text-primary, #202522)'
                }}>
                  math
                </span>
              </div>
            </div>

            {/* Right Metrics, Theme Toggle & Audio Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Active XP Boost Pill */}
              {gamState.activeXpBoost && (
                <XpBoostBadge expiresAt={gamState.activeXpBoost.expiresAt} />
              )}

              {/* Streak Pill (Interactive Button to Open Streak Popover) */}
              <button
                type="button"
                onClick={() => {
                  audioSynth.playKeypressTick();
                  setIsStreakModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                  border: '1.5px solid var(--color-marigold-bevel, #D49A2E)',
                  boxShadow: '0 2px 0 var(--color-marigold-bevel, #D49A2E)',
                  borderRadius: '12px',
                  padding: '4px 9px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--color-ink, #202522)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title="Ver detalhes da sua ofensiva"
                aria-label="Ver detalhes da sua ofensiva"
              >
                <Flame size={14} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
                <span className="font-mono-tabular">{streak}</span>
              </button>

              {/* Discovery Stars Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                border: '1.5px solid var(--color-verdigris-bevel, #104E42)',
                boxShadow: '0 2px 0 var(--color-verdigris-bevel, #104E42)',
                borderRadius: '12px',
                padding: '4px 9px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--color-ink, #202522)'
              }}>
                <Star size={13} color="var(--color-verdigris-bevel, #104E42)" fill="var(--color-verdigris, #176B5B)" />
                <span className="font-mono-tabular">{stars}</span>
              </div>

              <ThemeToggle />

              {/* Audio Mute Button (Tactile 3D Neutral Button) */}
              <button
                type="button"
                onClick={toggleSound}
                className="aura-3d-btn aura-3d-btn--neutral aura-3d-btn--icon-sm"
                style={{
                  color: isMuted ? 'var(--color-text-muted, #8A938E)' : 'var(--color-verdigris, #176B5B)',
                  cursor: 'pointer'
                }}
                title={isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
                aria-label={isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </header>
        )}

        {/* Viewport Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: route.type === 'track' ? 'var(--color-track-bg, #EFE7D5)' : 'var(--color-bg-base, #F7F4EA)',
        }}>
          {route.type === 'lesson' && (
            <DuolingoLessonView
              nodeId={route.nodeId}
              onClose={() => navigateTo('/track')}
              onFinish={(stats) => {
                gamificationEngine.recordLessonCompletion(
                  stats.xpEarned,
                  stats.accuracy,
                  route.nodeId,
                  stats.stars
                );
                navigateTo('/track');
              }}
            />
          )}
          {route.type === 'track' && (
            <TrackView onStartLesson={(nodeId) => navigateTo(`/lesson/${nodeId}`)} />
          )}
          {route.type === 'train' && (
            <TrainHubView onStartLesson={(nodeId) => navigateTo(`/lesson/${nodeId}`)} />
          )}
          {route.type === 'duels' && <DuelHubView />}
          {route.type === 'profile' && <ProfileHubView />}
        </main>

        {/* Editorial Tactile Bottom Tab Bar (escondido durante a lição) */}
        {!isLesson && (
          <nav style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            maxWidth: '430px',
            height: '68px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            borderTop: '1px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 8px',
            zIndex: 50,
            boxSizing: 'border-box'
          }}>
            {[
              { id: 'track', label: 'Trilha', icon: Compass, path: '/track' },
              { id: 'train', label: 'Treino', icon: Zap, path: '/train' },
              { id: 'duels', label: 'Duelos', icon: Swords, path: '/duels' },
              { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
            ].map(tab => {
              const Icon = tab.icon;
              const isSel = route.type === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    navigateTo(tab.path);
                    audioSynth.playKeypressTick();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    color: isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{
                    padding: '4px 14px',
                    borderRadius: '12px',
                    backgroundColor: isSel ? 'var(--color-verdigris-soft, #DCEBE5)' : 'transparent',
                    border: isSel ? '1.5px solid var(--color-verdigris-bevel, #104E42)' : '1.5px solid transparent',
                    boxShadow: isSel ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isSel ? 'translateY(-1px)' : 'none',
                    transition: 'all 0.12s ease'
                  }}>
                    <Icon
                      size={19}
                      strokeWidth={isSel ? 2.6 : 1.9}
                      color={isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)'}
                    />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: isSel ? 800 : 600,
                    fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)'
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Gamification Streak & Wager Modal */}
        <StreakPopoverModal
          isOpen={isStreakModalOpen}
          onClose={() => setIsStreakModalOpen(false)}
          streakState={gamState.streak}
          starsCount={gamState.stars}
          onBuyFreeze={() => gamificationEngine.buyStreakFreeze(100)}
          onPlaceWager={(days, bet) => gamificationEngine.placeStreakWager(days, bet)}
          onSolveRescueTask={() => gamificationEngine.completeRescueStep()}
        />

        {/* Day 1 & Milestone Achievement Celebratory Modal */}
        <AchievementUnlockModal
          achievement={gamState.recentlyUnlockedAchievement}
          onClose={() => gamificationEngine.dismissAchievementModal()}
        />

        {/* Humanized Aura Mascot Nudge Toast */}
        <AuraNudgeToast
          nudge={gamState.activeNudge}
          onDismiss={() => gamificationEngine.dismissNudge()}
          onAction={(targetRoute) => navigateTo('/' + targetRoute)}
        />
      </div>
    </div>
  );
}
