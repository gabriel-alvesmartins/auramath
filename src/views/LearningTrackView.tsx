import React, { useState } from 'react';
import { TRACK_GRADES, TrackNodeData } from '../engine';
import { ChevronRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../services/audioSynth';

export function LearningTrackView() {
  const [selectedNode, setSelectedNode] = useState<TrackNodeData | null>(null);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(to right, #00F2FE, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Trilha do Arquiteto Cognitivo
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>6 Graus de maestria mental: da decomposição posicional ao Flash Anzan</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {TRACK_GRADES.map(grade => (
          <div key={grade.grade} style={{
            backgroundColor: 'rgba(13, 17, 26, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '18px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00F2FE', letterSpacing: '0.05em' }}>
                  GRAU {grade.grade}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '2px 0 0 0' }}>{grade.title}</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>{grade.description}</p>
              </div>
              <div style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(138, 43, 226, 0.15)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                color: '#C084FC',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Boss: {grade.bossId}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {grade.nodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    audioSynth.playKeypressTick();
                  }}
                  style={{
                    backgroundColor: 'rgba(19, 25, 38, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#00F2FE';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{node.title}</div>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '2px 0 6px 0' }}>{node.subtitle}</p>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3].map(s => (
                        <span key={s} style={{ color: s <= node.stars ? '#FACC15' : '#334155', fontSize: '0.85rem' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 242, 254, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00F2FE'
                  }}>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedNode && (
        <LessonModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}

function LessonModal({ node, onClose }: { node: TrackNodeData; onClose: () => void }) {
  const [modalTab, setModalTab] = useState<'theory' | 'scaffold' | 'drill'>('theory');
  const [scaffoldAnswers, setScaffoldAnswers] = useState<Record<string, string>>({});
  const [scaffoldValidated, setScaffoldValidated] = useState<boolean | null>(null);

  const currentTask = node.scaffolding[0];

  const handleValidateScaffold = () => {
    let allCorrect = true;
    for (const b of currentTask.blanks) {
      if (scaffoldAnswers[b.key]?.trim() !== b.expected) {
        allCorrect = false;
      }
    }
    setScaffoldValidated(allCorrect);
    if (allCorrect) {
      audioSynth.playSuccessNote(5);
      confetti({ particleCount: 40, spread: 60 });
    } else {
      audioSynth.playErrorSoftRelease();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#0D111A',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 0 35px rgba(0, 242, 254, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#00F2FE', fontWeight: 800 }}>TÉCNICA PEDAGÓGICA</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0' }}>{node.title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'theory', label: '1. Teoria Relâmpago' },
            { id: 'scaffold', label: '2. Andaime Cognitivo' },
            { id: 'drill', label: '3. Drill de Fixação' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setModalTab(t.id as any)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: modalTab === t.id ? 700 : 500,
                backgroundColor: modalTab === t.id ? '#00F2FE' : 'rgba(255, 255, 255, 0.05)',
                color: modalTab === t.id ? '#07090E' : '#94A3B8',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {modalTab === 'theory' && (
          <div>
            <div style={{
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.1rem',
              color: '#00F2FE',
              textAlign: 'center',
              marginBottom: '14px'
            }}>
              {node.theory.formula}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '14px' }}>
              {node.theory.explanation}
            </p>
            <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.8)', borderRadius: '12px', padding: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8A2BE2', fontWeight: 700 }}>EXEMPLO DE DECOMPOSIÇÃO:</span>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FACC15', margin: '4px 0' }}>{node.theory.example}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                {node.theory.visualBreakdown.steps.map((st, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: '#94A3B8' }}>• {st}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {modalTab === 'scaffold' && (
          <div>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '12px' }}>
              {currentTask.instruction}
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.4rem',
              textAlign: 'center',
              color: '#00F2FE',
              margin: '16px 0',
              fontWeight: 700
            }}>
              {currentTask.equation}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {currentTask.blanks.map(blank => (
                <div key={blank.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94A3B8', width: '130px' }}>{blank.label}:</label>
                  <input
                    type="text"
                    value={scaffoldAnswers[blank.key] || ''}
                    onChange={e => setScaffoldAnswers({ ...scaffoldAnswers, [blank.key]: e.target.value })}
                    placeholder="Sua resposta"
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(19, 25, 38, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#F8FAFC',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              ))}
            </div>

            {scaffoldValidated !== null && (
              <div style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: scaffoldValidated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                color: scaffoldValidated ? '#10B981' : '#FB7185',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '14px'
              }}>
                {scaffoldValidated ? '✓ Decomposição perfeita! Passos validados.' : 'Reavalie os valores intermediários com calma.'}
              </div>
            )}

            <button
              onClick={handleValidateScaffold}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#00F2FE',
                color: '#07090E',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Verificar Passos
            </button>
          </div>
        )}

        {modalTab === 'drill' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Zap size={36} color="#00F2FE" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Bateria de Fixação Cronometrada</h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '18px' }}>
              Resolva problemas em sequência para consolidar o atalho no córtex parietal.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#00F2FE',
                color: '#07090E',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Pronto para Treinar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



