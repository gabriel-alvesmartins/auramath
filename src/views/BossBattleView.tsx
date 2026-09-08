import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { generateQuestion, Question, BOSS_LIST } from '../engine';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function BossBattleView() {
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
      confetti({ particleCount: 25, spread: 45 });
      setTimeout(() => setBossHit(false), 300);
      setQ(generateQuestion());
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px', textAlign: 'center' }}>
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E11D48' }}>CHEFE DO GRAU I</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0' }}>{boss.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0 0 12px 0' }}>{boss.lore}</p>

        <div style={{ height: '14px', backgroundColor: '#1E293B', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{
            width: `${(bossHp / boss.maxHp) * 100}%`,
            height: '100%',
            backgroundColor: '#E11D48',
            transition: 'width 0.2s',
            boxShadow: '0 0 10px #E11D48'
          }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#E11D48', fontWeight: 700, marginTop: '4px' }}>
          HP: {bossHp} / {boss.maxHp}
        </div>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '2.5rem',
        fontWeight: 800,
        margin: '16px 0',
        color: bossHit ? '#FB7185' : '#F8FAFC'
      }}>
        {q.equation} = {inputVal || '_'}
      </div>

      <NumpadWeb
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}



