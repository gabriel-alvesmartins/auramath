import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Music, Activity, Play, Square,
  Sparkles, CheckCircle2, Sliders, Zap, ShieldAlert
} from 'lucide-react';
import { audioSynth, PENTATONIC_SCALE } from '../../services/audioSynth';

export const SensoryLabTab: React.FC = () => {
  const [isZenActive, setIsZenActive] = useState(false);
  const [zenStreak, setZenStreak] = useState(1);
  const [masterVolume, setMasterVolume] = useState(80);
  const [sfxVolume, setSfxVolume] = useState(90);
  const [musicVolume, setMusicVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(audioSynth.isMuted());
  const [activeNote, setActiveNote] = useState<string | null>(null);

  // Group pentatonic scale by octave
  const octave4 = PENTATONIC_SCALE.filter((n) => n.octave === 4);
  const octave5 = PENTATONIC_SCALE.filter((n) => n.octave === 5);
  const octave6 = PENTATONIC_SCALE.filter((n) => n.octave === 6);
  const octave7 = PENTATONIC_SCALE.filter((n) => n.octave === 7);

  const handlePlayNote = (freq: number, name: string) => {
    audioSynth.playDirectFrequency(freq);
    setActiveNote(name);
    setTimeout(() => setActiveNote(null), 300);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioSynth.setMuted(next);
  };

  const handleToggleZen = () => {
    if (isZenActive) {
      audioSynth.stopZenMode();
      setIsZenActive(false);
    } else {
      audioSynth.startZenMode();
      audioSynth.updateZenStreak(zenStreak);
      setIsZenActive(true);
    }
  };

  const handleZenStreakChange = (val: number) => {
    setZenStreak(val);
    if (isZenActive) {
      audioSynth.updateZenStreak(val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls Banner */}
      <div
        style={{
          backgroundColor: '#FFFDF6',
          border: '1px solid #D9D5C8',
          borderRadius: '16px',
          padding: '18px 24px',
          boxShadow: '0 2px 0 #C2BDAE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={18} color="#176B5B" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#202522' }}>
              Sensory Lab: Engenharia Acústica a 0ms e Modo Zen
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5C645F' }}>
            Audite a escala pentatônica maior (C4 a C7), eventos táteis e a síntese procedural Lofi.
          </p>
        </div>

        {/* Global Sound Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleToggleMute}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isMuted ? '#F8DED9' : '#DCEBE5',
              border: isMuted ? '1.5px solid #E76F61' : '1.5px solid #176B5B',
              boxShadow: isMuted ? '0 2px 0 #E76F61' : '0 2px 0 #176B5B',
              color: isMuted ? '#E76F61' : '#176B5B',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isMuted ? 'Áudio Mutado' : 'Áudio Ativo'}</span>
          </button>

          <div
            style={{
              backgroundColor: '#F7F4EA',
              border: '1px solid #D9D5C8',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#176B5B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Activity size={14} color="#176B5B" />
            <span>Web Audio: 0ms Latência Perceptual</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Soundboard + Lofi Mixer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Pentatonic Scale & Tactile SFX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Pentatonic Virtual Keyboard */}
          <div
            style={{
              backgroundColor: '#FFFDF6',
              border: '1px solid #D9D5C8',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 0 #C2BDAE',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#202522' }}>
                Teclado Pentatônico Maior (C-D-E-G-A)
              </div>
              <span style={{ fontSize: '0.72rem', color: '#5C645F' }}>
                Eliminação matemática absoluta de dissonâncias
              </span>
            </div>

            {/* Octaves */}
            {[
              { label: 'Oitava 4 (Base Quente / Cristal C4–A4)', notes: octave4 },
              { label: 'Oitava 5 (Harmonia Central C5–A5)', notes: octave5 },
              { label: 'Oitava 6 (Agudos Celestes C6–A6)', notes: octave6 },
              { label: 'Oitava 7 (Pico Cristalino C7)', notes: octave7 },
            ].map((group) => (
              <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5C645F' }}>{group.label}</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {group.notes.map((note) => {
                    const isPlaying = activeNote === note.name;
                    return (
                      <button
                        key={note.name}
                        onClick={() => handlePlayNote(note.frequency, note.name)}
                        style={{
                          flex: 1,
                          minWidth: '58px',
                          height: '56px',
                          borderRadius: '10px',
                          backgroundColor: isPlaying ? '#DCEBE5' : '#FFFDF6',
                          border: isPlaying ? '2px solid #176B5B' : '2px solid #202522',
                          boxShadow: isPlaying ? '0 1px 0 #176B5B' : '0 3px 0 #202522',
                          transform: isPlaying ? 'translateY(2px)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 100ms, transform 80ms',
                        }}
                      >
                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#202522' }}>{note.name}</span>
                        <span style={{ fontSize: '0.64rem', color: '#5C645F', fontFamily: 'monospace' }}>
                          {Math.round(note.frequency)}Hz
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sound Effects & Haptic Trigger Board */}
          <div
            style={{
              backgroundColor: '#FFFDF6',
              border: '1px solid #D9D5C8',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 0 #C2BDAE',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#202522' }}>
              Eventos Táteis e Resposta Sensorial
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <button
                onClick={() => audioSynth.playKeypressTick()}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FFFDF6',
                  border: '2px solid #202522',
                  boxShadow: '0 3px 0 #202522',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Zap size={15} color="#176B5B" />
                <span>Tick de Tecla (0ms)</span>
              </button>

              <button
                onClick={() => audioSynth.playErrorSoftRelease()}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#F8DED9',
                  border: '2px solid #E76F61',
                  boxShadow: '0 3px 0 #E76F61',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#BA1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <ShieldAlert size={15} />
                <span>Dissipação de Erro</span>
              </button>

              <button
                onClick={() => audioSynth.playVictoryFanfare()}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FEF9ED',
                  border: '2px solid #F2B84B',
                  boxShadow: '0 3px 0 #F2B84B',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#8A5800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={15} />
                <span>Fanfarra de Vitória</span>
              </button>

              <button
                onClick={() => audioSynth.playChestReward()}
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#F4EEFB',
                  border: '2px solid #6E5AA6',
                  boxShadow: '0 3px 0 #6E5AA6',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#4B3A7A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={15} />
                <span>Baú de Recompensa</span>
              </button>
            </div>

            {/* Mascot Milestones (1..5) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase' }}>
                Marcos de Energia Mascote Prisma (Spark ➔ Singularity):
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { level: 1, label: '1. Spark (Ping)' },
                  { level: 2, label: '2. Surge (5ª Har)' },
                  { level: 3, label: '3. Overdrive (Arp)' },
                  { level: 4, label: '4. Supernova (Quad)' },
                  { level: 5, label: '5. Singularity (Deep)' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => audioSynth.playComboMilestone(item.level as any)}
                    style={{
                      flex: 1,
                      minWidth: '110px',
                      padding: '8px 10px',
                      backgroundColor: '#FFFDF6',
                      border: '1.5px solid #D9D5C8',
                      boxShadow: '0 2px 0 #C2BDAE',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lofi Zen Mode Mixer */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '1px solid #D9D5C8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 0 #C2BDAE',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.92rem', color: '#202522' }}>
            <Sliders size={16} color="#176B5B" />
            <span>Mixer Modo Zen (Lofi Procedural)</span>
          </div>

          <button
            onClick={handleToggleZen}
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: isZenActive ? '#F8DED9' : '#176B5B',
              color: isZenActive ? '#BA1A1A' : '#FFFDF6',
              border: isZenActive ? '2px solid #E76F61' : '2px solid #176B5B',
              boxShadow: isZenActive ? '0 3px 0 #E76F61' : '0 3px 0 #0E483C',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            {isZenActive ? <Square size={16} /> : <Play size={16} />}
            <span>{isZenActive ? 'Parar Motor Lofi' : 'Iniciar Motor Lofi'}</span>
          </button>

          {/* Streak Pacing Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700 }}>
              <span>Streak Pacing (Desbloqueio de Camadas)</span>
              <span style={{ color: '#176B5B', fontWeight: 800 }}>{zenStreak}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={zenStreak}
              onChange={(e) => handleZenStreakChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#176B5B' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#5C645F', lineHeight: 1.4 }}>
              • Streak 1+: Crackle de vinil & beat sutil<br />
              • Streak 6+: Acordes Rhodes aquecidos<br />
              • Streak 13+: Chuva & sub-bass estéreo
            </div>
          </div>

          {/* Volume Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', borderTop: '1px solid #EAE6DB' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                <span>Volume Master</span>
                <span>{masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMasterVolume(val);
                  audioSynth.setMasterVolume(val / 100);
                }}
                style={{ width: '100%', accentColor: '#202522' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                <span>Volume Efeitos (SFX)</span>
                <span>{sfxVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSfxVolume(val);
                  audioSynth.setSfxVolume(val / 100);
                }}
                style={{ width: '100%', accentColor: '#176B5B' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                <span>Volume Música (Zen)</span>
                <span>{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMusicVolume(val);
                  audioSynth.setMusicVolume(val / 100);
                }}
                style={{ width: '100%', accentColor: '#6E5AA6' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
