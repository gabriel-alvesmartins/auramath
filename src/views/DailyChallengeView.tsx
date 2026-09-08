import React, { useState } from 'react';
import { Trophy, Copy, Check } from 'lucide-react';
import { generateDailyQuestions } from '../engine';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function DailyChallengeView() {
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
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Desafio Diário Global</h3>
      <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '20px' }}>
        Semente global das 00:00 UTC sincronizada para todos os estudantes
      </p>

      {!isFinished ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
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

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 800, margin: '24px 0' }}>
            {activeQ.equation} = {inputVal || '_'}
          </div>

          <NumpadWeb
            onInput={k => setInputVal(prev => prev + k)}
            onClear={() => setInputVal('')}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div style={{
          backgroundColor: 'rgba(13, 17, 26, 0.9)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '24px'
        }}>
          <Trophy size={48} color="#FACC15" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Desafio Concluído!</h4>
          <div style={{ fontSize: '2rem', letterSpacing: '6px', margin: '14px 0' }}>
            {results.map(r => (r ? '🟩' : '🟥')).join('')}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '18px' }}>
            Você acertou {results.filter(Boolean).length} de 5 questões.
          </p>
          <button
            onClick={copyEmojiResult}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
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
            {copied ? 'Copiado para o Clipboard!' : 'Compartilhar Resultado'}
          </button>
        </div>
      )}
    </div>
  );
}



