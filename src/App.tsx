import React, { useState, useEffect } from 'react';
import {
  Sparkles, Flame, Award, Trophy, Volume2, VolumeX, Smartphone, Monitor
} from 'lucide-react';
import { audioSynth } from './services/audioSynth';
import { LearningTrackView } from './views/LearningTrackView';
import { ArenaView } from './views/ArenaView';
import { SplitBattleView } from './views/SplitBattleView';
import { ShadowRacingView } from './views/ShadowRacingView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { FlashAnzanView } from './views/FlashAnzanView';
import { FlowZenView } from './views/FlowZenView';
import { BossBattleView } from './views/BossBattleView';
import { TactileGeometryLabView } from './views/TactileGeometryLabView';
import { ProfileRadarView } from './views/ProfileRadarView';
import { TeacherHubView } from './views/TeacherHubView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('track');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
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
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynth.setMuted(nextMuted);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090E', color: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        backgroundColor: 'rgba(13, 17, 26, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #8A2BE2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.5)'
          }}>
            <Sparkles size={20} color="#07090E" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #00F2FE, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AURAMATH
              </span>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', fontWeight: 700, border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                COGNITIVE ENGINE v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Cálculo Mental de Alta Velocidade & Fluxo Esquerda-Direita</p>
          </div>
        </div>

        {/* Global User Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Flame size={16} color="#FB7185" />
            <span style={{ fontWeight: 700, color: '#FB7185' }}>18</span>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>dias</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Award size={16} color="#FACC15" />
            <span style={{ fontWeight: 700, color: '#FACC15' }}>48</span>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>★</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Trophy size={16} color="#38BDF8" />
            <span style={{ fontWeight: 700, color: '#38BDF8' }}>1,540</span>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Elo</span>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <button
            onClick={toggleSound}
            title={isMuted ? "Ativar Áudio Procedural" : "Silenciar"}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: isMuted ? '#64748B' : '#00F2FE',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Mudo' : 'Som 0ms'}</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? "Modo Tela Cheia" : "Modo Smartphone"}
            style={{
              background: isMobileFrame ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isMobileFrame ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isMobileFrame ? '#00F2FE' : '#94A3B8',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem'
            }}
          >
            {isMobileFrame ? <Monitor size={16} /> : <Smartphone size={16} />}
            <span>{isMobileFrame ? 'Expandir' : 'Frame Mobile'}</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div style={{
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '6px 16px',
        overflowX: 'auto',
        display: 'flex',
        gap: '8px',
        whiteSpace: 'nowrap'
      }}>
        {[
          { id: 'track', label: '🗺️ Trilha de Graus' },
          { id: 'arena', label: '⚡ Arena Solo' },
          { id: 'blitz', label: '⏱️ Blitz (60s)' },
          { id: 'sudden', label: '💀 Morte Súbita' },
          { id: 'split', label: '🤼 Split 2P' },
          { id: 'shadow', label: '👻 Shadow Racing' },
          { id: 'daily', label: '📅 Desafio Diário' },
          { id: 'anzan', label: '👁️ Flash Anzan' },
          { id: 'zen', label: '🧘 Flow Zen' },
          { id: 'boss', label: '👑 Arcanum Boss' },
          { id: 'lab', label: '📐 Lab Geometria' },
          { id: 'profile', label: '🧬 DNA Cognitivo' },
          { id: 'teacher', label: '🏫 Turma B2B' },
          { id: 'settings', label: '⚙️ Ajustes' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              audioSynth.playKeypressTick();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: activeTab === item.id ? 700 : 500,
              backgroundColor: activeTab === item.id ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: activeTab === item.id ? '#00F2FE' : '#94A3B8',
              border: activeTab === item.id ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: isMobileFrame ? '20px 0' : '20px',
        overflowY: 'auto'
      }}>
        {isMobileFrame ? (
          <div style={{
            width: '390px',
            minHeight: '780px',
            maxHeight: '844px',
            backgroundColor: '#07090E',
            borderRadius: '40px',
            border: '8px solid #1E293B',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Notch */}
            <div style={{
              width: '120px',
              height: '24px',
              backgroundColor: '#000',
              borderRadius: '12px',
              margin: '8px auto 4px auto',
              zIndex: 30,
              flexShrink: 0
            }} />
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <RenderActiveTab tab={activeTab} />
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '1080px' }}>
            <RenderActiveTab tab={activeTab} />
          </div>
        )}
      </main>
    </div>
  );
}

function RenderActiveTab({ tab }: { tab: string }) {
  switch (tab) {
    case 'track': return <LearningTrackView />;
    case 'arena': return <ArenaView mode="arena" />;
    case 'blitz': return <ArenaView mode="blitz" />;
    case 'sudden': return <ArenaView mode="sudden" />;
    case 'split': return <SplitBattleView />;
    case 'shadow': return <ShadowRacingView />;
    case 'daily': return <DailyChallengeView />;
    case 'anzan': return <FlashAnzanView />;
    case 'zen': return <FlowZenView />;
    case 'boss': return <BossBattleView />;
    case 'lab': return <TactileGeometryLabView />;
    case 'profile': return <ProfileRadarView />;
    case 'teacher': return <TeacherHubView />;
    case 'settings': return <SettingsView />;
    default: return <LearningTrackView />;
  }
}


