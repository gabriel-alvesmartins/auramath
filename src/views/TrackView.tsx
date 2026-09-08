import React, { useState } from 'react';
import { Sparkles, Star, Lock, Play, ChevronRight, CheckCircle2, BookOpen, Brain, Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRACK_GRADES, TrackNodeData, GradeLevel } from '../engine';
import { audioSynth } from '../services/audioSynth';

interface TrackViewProps {
  onStartDrill: (techniqueId: string) => void;
}

export const TrackView: React.FC<TrackViewProps> = ({ onStartDrill }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(1);
  const [activeNode, setActiveNode] = useState<TrackNodeData | null>(null);

  const gradeData = TRACK_GRADES.find(g => g.grade === selectedGrade) || TRACK_GRADES[0];

  return (
    <div style={{ paddingBottom: '90px' }}>
      {/* Grade Selector Horizontal Pills */}
      <div style={{
        padding: '12px 16px',
        overflowX: 'auto',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#07090E',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        {TRACK_GRADES.map(g => {
          const isSel = g.grade === selectedGrade;
          return (
            <button
              key={g.grade}
              onClick={() => {
                setSelectedGrade(g.grade);
                audioSynth.playKeypressTick();
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: isSel ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isSel ? 'rgba(0, 242, 254, 0.15)' : 'rgba(19, 25, 38, 0.6)',
                color: isSel ? '#00F2FE' : '#94A3B8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              Grau {g.grade}
            </button>
          );
        })}
      </div>

      {/* Grade Header Banner */}
      <div style={{ padding: '16px 20px 8px 20px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
          {gradeData.title}
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          {gradeData.description}
        </p>
      </div>

      {/* Winding Serpentine Path */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        gap: '28px',
        position: 'relative'
      }}>
        {gradeData.nodes.map((node, index) => {
          // Calculate horizontal serpentine offset: -45px, 0px, 45px, 0px...
          const offsets = [0, 45, 0, -45];
          const xOffset = offsets[index % 4];
          const isCompleted = node.stars === 3;
          const isCurrent = node.stars > 0 && node.stars < 3;
          const isLocked = node.isLocked && !isCompleted && !isCurrent;

          return (
            <div
              key={node.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `translateX(${xOffset}px)`,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                if (!isLocked) {
                  setActiveNode(node);
                  audioSynth.playKeypressTick();
                }
              }}
            >
              {/* Node Button Orb */}
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '24px',
                backgroundColor: isCompleted
                  ? '#00F2FE'
                  : isCurrent
                  ? '#8A2BE2'
                  : 'rgba(19, 25, 38, 0.9)',
                border: isCurrent
                  ? '3px solid #00F2FE'
                  : isCompleted
                  ? '3px solid #FFF'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isCurrent
                  ? '0 0 20px rgba(0, 242, 254, 0.6)'
                  : isCompleted
                  ? '0 4px 14px rgba(0, 242, 254, 0.3)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: isCompleted ? '#07090E' : isCurrent ? '#FFF' : '#64748B'
              }}>
                {isLocked ? (
                  <Lock size={22} />
                ) : isCompleted ? (
                  <CheckCircle2 size={28} strokeWidth={2.5} />
                ) : (
                  <Brain size={26} />
                )}

                {/* Stars below node */}
                <div style={{
                  position: 'absolute',
                  bottom: '-12px',
                  backgroundColor: '#07090E',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  gap: '2px'
                }}>
                  {[1, 2, 3].map(s => (
                    <Star
                      key={s}
                      size={10}
                      fill={s <= node.stars ? '#FACC15' : 'transparent'}
                      color={s <= node.stars ? '#FACC15' : '#475569'}
                    />
                  ))}
                </div>
              </div>

              {/* Node Title */}
              <span style={{
                marginTop: '16px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isLocked ? '#64748B' : '#F8FAFC',
                textAlign: 'center',
                maxWidth: '140px',
                lineHeight: 1.2
              }}>
                {node.title}
              </span>
            </div>
          );
        })}

        {/* End of Grade Boss Gate */}
        <div style={{
          marginTop: '16px',
          padding: '16px',
          width: '100%',
          maxWidth: '340px',
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <img
            src="/assets/arcanum_boss.jpg"
            alt="Boss"
            style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E11D48', letterSpacing: '0.05em' }}>
              CHEFE DO GRAU
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Arcanum Primus</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Derrote para liberar o próximo Grau</div>
          </div>
          <ChevronRight size={20} color="#E11D48" />
        </div>
      </div>

      {/* Lesson Bottom Sheet Modal */}
      {activeNode && (
        <LessonSheet
          node={activeNode}
          onClose={() => setActiveNode(null)}
          onStart={() => {
            const tech = activeNode.id;
            setActiveNode(null);
            onStartDrill(tech);
          }}
        />
      )}
    </div>
  );
};

// Bottom Sheet Component
function LessonSheet({ node, onClose, onStart }: { node: TrackNodeData; onClose: () => void; onStart: () => void }) {
  const [sheetTab, setSheetTab] = useState<'theory' | 'scaffold'>('theory');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scaffoldDone, setScaffoldDone] = useState<boolean | null>(null);

  const task = node.scaffolding[0];

  const verifyScaffold = () => {
    let ok = true;
    for (const b of task.blanks) {
      if (answers[b.key]?.trim() !== b.expected) ok = false;
    }
    setScaffoldDone(ok);
    if (ok) {
      audioSynth.playSuccessNote(4);
      confetti({ particleCount: 30, spread: 50 });
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
      backgroundColor: 'rgba(7, 9, 14, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#0D111A',
        borderTop: '1px solid rgba(0, 242, 254, 0.3)',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        padding: '24px 20px',
        maxHeight: '82vh',
        overflowY: 'auto',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px', margin: '0 auto 16px auto' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#00F2FE', fontWeight: 800 }}>TÉCNICA MENTAL</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0' }}>{node.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '2px 0 0 0' }}>{node.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setSheetTab('theory')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: sheetTab === 'theory' ? '1px solid #00F2FE' : '1px solid transparent',
              backgroundColor: sheetTab === 'theory' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: sheetTab === 'theory' ? '#00F2FE' : '#94A3B8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            1. Teoria Relâmpago
          </button>
          <button
            onClick={() => setSheetTab('scaffold')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: sheetTab === 'scaffold' ? '1px solid #00F2FE' : '1px solid transparent',
              backgroundColor: sheetTab === 'scaffold' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: sheetTab === 'scaffold' ? '#00F2FE' : '#94A3B8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            2. Andaime de Passos
          </button>
        </div>

        {sheetTab === 'theory' ? (
          <div>
            <div style={{
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '14px',
              padding: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#00F2FE',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              {node.theory.formula}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
              {node.theory.explanation}
            </p>
            <div style={{ backgroundColor: 'rgba(19, 25, 38, 0.8)', borderRadius: '14px', padding: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', color: '#8A2BE2', fontWeight: 800 }}>DECOMPOSIÇÃO VISUAL:</span>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FACC15', fontWeight: 700, marginTop: '4px' }}>
                {node.theory.example}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                {node.theory.visualBreakdown.steps.map((st, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: '#94A3B8' }}>• {st}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '12px' }}>
              {task.instruction}
            </p>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.6rem',
              fontWeight: 800,
              textAlign: 'center',
              color: '#00F2FE',
              marginBottom: '16px'
            }}>
              {task.equation}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {task.blanks.map(blank => (
                <div key={blank.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94A3B8', width: '130px' }}>{blank.label}:</label>
                  <input
                    type="text"
                    value={answers[blank.key] || ''}
                    onChange={e => setAnswers({ ...answers, [blank.key]: e.target.value })}
                    placeholder="Valor"
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

            {scaffoldDone !== null && (
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: scaffoldDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                color: scaffoldDone ? '#10B981' : '#FB7185',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '14px'
              }}>
                {scaffoldDone ? '✓ Decomposição correta!' : 'Revise os valores intermediários.'}
              </div>
            )}

            <button
              onClick={verifyScaffold}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Validar Decomposição
            </button>
          </div>
        )}

        {/* Start Drill Action */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: '#00F2FE',
            color: '#07090E',
            border: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)'
          }}
        >
          <Play size={18} fill="#07090E" />
          Iniciar Bateria de Treino
        </button>
      </div>
    </div>
  );
}
