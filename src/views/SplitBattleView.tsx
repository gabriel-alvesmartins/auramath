import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { generateQuestion } from '../engine';
import { audioSynth } from '../services/audioSynth';

export function SplitBattleView() {
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
      if (next >= 7) setWinner('Jogador 1 (Ciano)');
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
      if (next >= 7) setWinner('Jogador 2 (Roxo)');
      setP2Q(generateQuestion());
      setP2Input('');
    } else {
      audioSynth.playErrorSoftRelease();
      setP2Input('');
    }
  };

  return (
    <div style={{ height: '680px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Player 2 - Inverted 180° for head-to-head mobile play */}
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
          <span style={{ color: '#C084FC', fontWeight: 800, fontSize: '0.85rem' }}>JOGADOR 2 (ROXO)</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#C084FC' }}>
            {p2Score}/7
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 800 }}>
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
                borderRadius: '6px',
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

      {/* Player 1 - Normal Orientation */}
      <div style={{
        flex: 1,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 242, 254, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#00F2FE', fontWeight: 800, fontSize: '0.85rem' }}>JOGADOR 1 (CIANO)</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#00F2FE' }}>
            {p1Score}/7
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 800 }}>
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
                borderRadius: '6px',
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 9, 14, 0.92)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 80
        }}>
          <Trophy size={48} color="#FACC15" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '12px 0' }}>{winner} Venceu!</h2>
          <button
            onClick={() => {
              setP1Score(0);
              setP2Score(0);
              setWinner(null);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
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



