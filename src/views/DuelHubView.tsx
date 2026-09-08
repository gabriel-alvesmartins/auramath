import React, { useState, useEffect } from 'react';
import { Swords, Ghost, Calendar, Crown, Trophy, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, generateGhostRun, generateDailyQuestions, Question, BOSS_LIST } from '../engine';
import { Keypad } from '../components/Keypad';
import { audioSynth } from '../services/audioSynth';

export function DuelHubView() {
  const [duelMode, setDuelMode] = useState<'split' | 'shadow' | 'daily' | 'boss'>('split');

  return (
    <div style={{ paddingBottom: '90px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      {/* Duel Submode Segmented Control */}
      <div style={{
        display: 'flex',
        padding: '6px 12px',
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        gap: '6px',
        overflowX: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {[
          { id: 'split', label: 'Batalha 2P', icon: Swords },
          { id: 'shadow', label: 'Shadow Racing', icon: Ghost },
          { id: 'daily', label: 'Desafio Diário', icon: Calendar },
          { id: 'boss', label: 'Arcanum Boss', icon: Crown },
        ].map(item => {
          const Icon = item.icon;
          const isSel = duelMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setDuelMode(item.id as any);
                audioSynth.playKeypressTick();
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isSel ? '#00F2FE' : 'transparent',
                color: isSel ? '#07090E' : '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {duelMode === 'split' && <SplitBattleComponent />}
        {duelMode === 'shadow' && <ShadowRacingComponent />}
        {duelMode === 'daily' && <DailyChallengeComponent />}
        {duelMode === 'boss' && <BossBattleComponent />}
      </div>
    </div>
  );
}

// 1. Split Screen Local 2P
function SplitBattleComponent() {
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Q, setP1Q] = useState(() => generateQuestion());
  const [p2Q, setP2Q] = useState(() => generateQuestion());
  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [winner, setWinner] = useState<string | null>(null);

  const handleP1Submit = () => {
    if (parseInt(p1Input, 10) === p1Q.answer) {
      const next = p1Score + 1;
      setP1Score(next);
      audioSynth.playSuccessNote(next);
      if (next >= 7) {
        setWinner('Jogador 1 (Ciano)');
        confetti({ particleCount: 40 });
      }
      setP1Q(generateQuestion());
      setP1Input('');
    } else {
      audioSynth.playErrorSoftRelease();
      setP1Input('');
    }
  };

  const handleP2Submit = () => {
    if (parseInt(p2Input, 10) === p2Q.answer) {
      const next = p2Score + 1;
      setP2Score(next);
      audioSynth.playSuccessNote(next);
      if (next >= 7) {
        setWinner('Jogador 2 (Roxo)');
        confetti({ particleCount: 40 });
      }
      setP2Q(generateQuestion());
      setP2Input('');
    } else {
      audioSynth.playErrorSoftRelease();
      setP2Input('');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '620px' }}>
      {/* Player 2 - INVERTED 180° */}
      <div style={{
        flex: 1,
        transform: 'rotate(180deg)',
        borderBottom: '2px dashed rgba(255, 255, 255, 0.2)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(138, 43, 226, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#C084FC', fontWeight: 800, fontSize: '0.8rem' }}>JOGADOR 2</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#C084FC' }}>
            {p2Score}/7
          </span>
        </div>
        <div style={{ textAlign: 'center', margin: '6px 0' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.9rem', fontWeight: 800 }}>
            {p2Q.equation} = {p2Input || '_'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'C', 'OK'].map(k => (
            <button
              key={k}
              onClick={() => {
                if (k === 'OK') handleP2Submit();
                else if (k === 'C') setP2Input('');
                else setP2Input(prev => prev + k);
              }}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                backgroundColor: k === 'OK' ? '#8A2BE2' : 'rgba(19, 25, 38, 0.9)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Player 1 - Normal */}
      <div style={{
        flex: 1,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 242, 254, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#00F2FE', fontWeight: 800, fontSize: '0.8rem' }}>JOGADOR 1</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#00F2FE' }}>
            {p1Score}/7
          </span>
        </div>
        <div style={{ textAlign: 'center', margin: '6px 0' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.9rem', fontWeight: 800 }}>
            {p1Q.equation} = {p1Input || '_'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'C', 'OK'].map(k => (
            <button
              key={k}
              onClick={() => {
                if (k === 'OK') handleP1Submit();
                else if (k === 'C') setP1Input('');
                else setP1Input(prev => prev + k);
              }}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                backgroundColor: k === 'OK' ? '#00F2FE' : 'rgba(19, 25, 38, 0.9)',
                color: k === 'OK' ? '#07090E' : '#FFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {winner && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(7, 9, 14, 0.94)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40
        }}>
          <Trophy size={48} color="#FACC15" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '12px 0' }}>{winner} Venceu!</h2>
          <button
            onClick={() => {
              setP1Score(0);
              setP2Score(0);
              setWinner(null);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              backgroundColor: '#00F2FE',
              color: '#07090E',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Nova Batalha
          </button>
        </div>
      )}
    </div>
  );
}

// 2. Shadow Racing Component
function ShadowRacingComponent() {
  const [ghost] = useState(() => generateGhostRun(1480));
  const [playerProgress, setPlayerProgress] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setGhostProgress(prev => (prev >= 15 ? 15 : prev + 0.15));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (parseInt(inputVal, 10) === q.answer) {
      setPlayerProgress(prev => prev + 1);
      audioSynth.playSuccessNote(playerProgress + 1);
      setQ(generateQuestion());
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '390px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.85)', padding: '14px', borderRadius: '18px', marginBottom: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: '#00F2FE', fontWeight: 700 }}>Você</span>
            <span>{playerProgress}/15 questões</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(playerProgress / 15) * 100}%`, height: '100%', backgroundColor: '#00F2FE', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: '#94A3B8', fontWeight: 700 }}>Sombra de Gauss (1480 Elo)</span>
            <span>{Math.floor(ghostProgress)}/15 questões</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(ghostProgress / 15) * 100}%`, height: '100%', backgroundColor: '#8A2BE2', transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '14px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 800 }}>
          {q.equation} = {inputVal || '_'}
        </div>
      </div>

      <Keypad
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// 3. Daily Challenge Component
function DailyChallengeComponent() {
  const [questions] = useState(() => generateDailyQuestions('2026-09-08'));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [results, setResults] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);

  const activeQ = questions[currentIdx];
  const isFinished = currentIdx >= 5;

  const handleSubmit = () => {
    const isOk = parseInt(inputVal, 10) === activeQ.answer;
    setResults([...results, isOk]);
    if (isOk) audioSynth.playSuccessNote(results.length + 1);
    else audioSynth.playErrorSoftRelease();

    setInputVal('');
    setCurrentIdx(currentIdx + 1);
  };

  const copyEmojiResult = () => {
    const emojis = results.map(r => (r ? '🟩' : '🟥')).join('');
    const shareText = `Auramath Diário #142\n${emojis}\nPrecisão: ${results.filter(Boolean).length}/5\nhttps://auramath.app`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '390px', margin: '0 auto', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
      {!isFinished ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
            {[0, 1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: idx === currentIdx ? '2px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: results[idx] === true ? '#10B981' : results[idx] === false ? '#FB7185' : 'rgba(19, 25, 38, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>
            {activeQ.equation} = {inputVal || '_'}
          </div>

          <Keypad
            onInput={k => setInputVal(prev => prev + k)}
            onClear={() => setInputVal('')}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div style={{
          backgroundColor: 'rgba(13, 17, 26, 0.9)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '24px',
          padding: '24px'
        }}>
          <Trophy size={48} color="#FACC15" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Desafio Concluído!</h4>
          <div style={{ fontSize: '2rem', letterSpacing: '6px', margin: '14px 0' }}>
            {results.map(r => (r ? '🟩' : '🟥')).join('')}
          </div>
          <button
            onClick={copyEmojiResult}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              backgroundColor: copied ? '#10B981' : '#00F2FE',
              color: '#07090E',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copiado!' : 'Compartilhar Resultado'}
          </button>
        </div>
      )}
    </div>
  );
}

// 4. Arcanum Boss Component
function BossBattleComponent() {
  const boss = BOSS_LIST[0];
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');
  const [bossHit, setBossHit] = useState(false);

  const handleSubmit = () => {
    if (parseInt(inputVal, 10) === q.answer) {
      setBossHp(prev => Math.max(0, prev - 180));
      setBossHit(true);
      audioSynth.playBossHit(18);
      confetti({ particleCount: 30, spread: 50 });
      setTimeout(() => setBossHit(false), 300);
      setQ(generateQuestion());
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '390px', margin: '0 auto', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <img
          src="/assets/arcanum_boss.jpg"
          alt="Boss"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            objectFit: 'cover',
            boxShadow: '0 0 16px rgba(225, 29, 72, 0.5)',
            transform: bossHit ? 'scale(0.92) rotate(-5deg)' : 'scale(1)',
            transition: 'transform 0.15s'
          }}
        />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E11D48' }}>CHEFE DO GRAU I</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{boss.name}</div>
          <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{
              width: `${(bossHp / boss.maxHp) * 100}%`,
              height: '100%',
              backgroundColor: '#E11D48',
              transition: 'width 0.2s',
              boxShadow: '0 0 8px #E11D48'
            }} />
          </div>
          <div style={{ fontSize: '0.68rem', color: '#E11D48', fontWeight: 700, marginTop: '2px' }}>
            {bossHp} / {boss.maxHp} HP
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '2.5rem',
        fontWeight: 800,
        margin: '14px 0',
        color: bossHit ? '#FB7185' : '#F8FAFC'
      }}>
        {q.equation} = {inputVal || '_'}
      </div>

      <Keypad
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
