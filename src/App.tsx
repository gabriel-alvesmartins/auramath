import React, { useState, useEffect } from 'react';
import {
  Compass, Zap, Swords, Shapes, User, Flame, Star, Volume2, VolumeX,
  Wifi, Battery, Sparkles
} from 'lucide-react';
import { audioSynth } from './services/audioSynth';
import { TrackView } from './views/TrackView';
import { TrainHubView } from './views/TrainHubView';
import { DuelHubView } from './views/DuelHubView';
import { LabView } from './views/LabView';
import { ProfileHubView } from './views/ProfileHubView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'track' | 'train' | 'duels' | 'lab' | 'profile'>('track');
  const [isMuted, setIsMuted] = useState(false);

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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030407',
      backgroundImage: 'radial-gradient(ellipse at top, rgba(138, 43, 226, 0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(0, 242, 254, 0.08), transparent 70%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#F8FAFC'
    }}>
      {/* Centered Mobile Device Frame */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100vh',
        backgroundColor: '#07090E',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 0 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 242, 254, 0.1)',
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
          color: '#F8FAFC',
          zIndex: 40,
          backgroundColor: '#07090E'
        }}>
          <span>9:41</span>
          {/* Dynamic Island Pill */}
          <div style={{
            width: '110px',
            height: '24px',
            backgroundColor: '#000',
            borderRadius: '12px',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.8)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        {/* Mobile App Header */}
        <header style={{
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(7, 9, 14, 0.95)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Left Avatar & Level */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1.5px solid #00F2FE',
              boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)'
            }}>
              <img src="/assets/aura_spark.jpg" alt="Aura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#00F2FE' }}>AURA</span>MATH
              </div>
              <span style={{ fontSize: '0.65rem', color: '#8A2BE2', fontWeight: 700 }}>Nv. 14</span>
            </div>
          </div>

          {/* Right Metrics & Audio Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(251, 113, 133, 0.12)',
              border: '1px solid rgba(251, 113, 133, 0.3)',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#FB7185'
            }}>
              <Flame size={14} fill="#FB7185" />
              <span>18</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(250, 204, 21, 0.12)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#FACC15'
            }}>
              <Star size={13} fill="#FACC15" />
              <span>48</span>
            </div>

            <button
              onClick={toggleSound}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: isMuted ? '#64748B' : '#00F2FE',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'track' && <TrackView onStartDrill={() => setActiveTab('train')} />}
          {activeTab === 'train' && <TrainHubView />}
          {activeTab === 'duels' && <DuelHubView />}
          {activeTab === 'lab' && <LabView />}
          {activeTab === 'profile' && <ProfileHubView />}
        </main>

        {/* Native Mobile Bottom Tab Bar */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          maxWidth: '430px',
          height: '68px',
          backgroundColor: 'rgba(11, 15, 25, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 8px',
          zIndex: 50,
          boxSizing: 'border-box'
        }}>
          {[
            { id: 'track', label: 'Trilha', icon: Compass },
            { id: 'train', label: 'Treino', icon: Zap },
            { id: 'duels', label: 'Duelos', icon: Swords },
            { id: 'lab', label: 'Lab', icon: Shapes },
            { id: 'profile', label: 'Perfil', icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
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
                  padding: '6px 12px',
                  borderRadius: '16px',
                  color: isSel ? '#00F2FE' : '#64748B',
                  transition: 'all 0.12s'
                }}
              >
                <div style={{
                  padding: '4px 14px',
                  borderRadius: '12px',
                  backgroundColor: isSel ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} strokeWidth={isSel ? 2.6 : 1.8} />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: isSel ? 800 : 500 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
