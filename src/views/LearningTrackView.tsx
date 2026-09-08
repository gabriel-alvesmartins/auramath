import React, { useState } from 'react';
import { TRACK_GRADES, TrackNodeData } from '../engine';
import { Crown, Lock, Sparkles, Trophy, ArrowRight, Play, CheckCircle2, Flame, BookOpen, Brain, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../services/audioSynth';
import { AuraMascotWeb } from '../components/AuraMascotWeb';

export function LearningTrackView({ onStartLesson }: { onStartLesson?: (nodeId: string) => void }) {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [activeModalNode, setActiveModalNode] = useState<TrackNodeData | null>(null);
  const [modalTab, setModalTab] = useState<'theory' | 'scaffold' | 'drill'>('theory');

  // Estado do andaime interativo dentro do modal
  const [scaffoldAnswers, setScaffoldAnswers] = useState<{ [key: number]: string }>({});
  const [scaffoldFeedback, setScaffoldFeedback] = useState<{ [key: number]: boolean }>({});

  const currentGradeData = TRACK_GRADES.find(g => g.grade === selectedGrade) || TRACK_GRADES[0];

  // Cálculo de posição serpentina (ziguezague orgânico estilo Duolingo / Candy Crush)
  const getNodeOffset = (index: number) => {
    const pattern = [0, 45, 80, 45, 0, -45, -80, -45];
    return pattern[index % pattern.length];
  };

  const handleOpenNode = (node: TrackNodeData) => {
    if (node.isLocked) {
      audioSynth.playErrorSoftRelease();
      return;
    }
    audioSynth.playKeypressTick();
    setActiveModalNode(node);
    setModalTab('theory');
    setScaffoldAnswers({});
    setScaffoldFeedback({});
  };

  const handleScaffoldSubmit = (stepIdx: number, expectedVal: number) => {
    const input = parseInt(scaffoldAnswers[stepIdx] || '', 10);
    const isCorrect = input === expectedVal;
    setScaffoldFeedback(prev => ({ ...prev, [stepIdx]: isCorrect }));

    if (isCorrect) {
      audioSynth.playSuccessNote(stepIdx + 2);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    } else {
      audioSynth.playErrorSoftRelease();
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '16px 12px 100px',
      position: 'relative',
    }}>
      {/* 1. SELETOR DE GRAU CÓSMICO (TABS COM ESTILO NATIVO) */}
      <div style={{
        position: 'sticky',
        top: '64px',
        zIndex: 30,
        backgroundColor: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '10px 8px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '28px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}>
          {TRACK_GRADES.map(grade => {
            const isSelected = selectedGrade === grade.grade;
            return (
              <button
                key={grade.grade}
                onClick={() => {
                  setSelectedGrade(grade.grade);
                  audioSynth.playKeypressTick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  border: isSelected ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.06)',
                  backgroundColor: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#00F2FE' : '#94A3B8',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.3)' : 'none',
                }}
              >
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#00F2FE' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#07090E' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                }}>
                  {grade.grade}
                </span>
                <span>{grade.title.split(':')[1] || grade.title}</span>
              </button>
            );
          })}
        </div>

        {/* Resumo do Grau Selecionado */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px 4px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: '8px',
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00F2FE', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Grau {currentGradeData.grade} • Maestria Mental
            </span>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0 0', color: '#F8FAFC' }}>
              {currentGradeData.title}
            </h2>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#FACC15',
          }}>
            <Trophy size={14} />
            <span>Boss: {currentGradeData.bossId.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 2. TRILHA CÓSMICA SERPENTINA EM ZIGUEZAGUE */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0 60px',
      }}>
        {/* SVG da Linha de Conexão Órbital com Curvas Suaves */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8A2BE2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowPath">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* A linha dinâmica é gerada visualmente através das conexões verticais */}
        </svg>

        {currentGradeData.nodes.map((node, index) => {
          const isCompleted = node.stars > 0;
          const isLocked = node.isLocked;
          const isActive = !isLocked && !isCompleted;
          const offsetX = getNodeOffset(index);

          return (
            <div
              key={node.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '38px',
                transform: `translateX(${offsetX}px)`,
                transition: 'transform 0.3s ease',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Linha vertical luminosa entre os nós */}
              {index > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-38px',
                  width: '3px',
                  height: '38px',
                  background: isCompleted ? 'linear-gradient(to bottom, #00F2FE, #8A2BE2)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isCompleted ? '0 0 10px rgba(0, 242, 254, 0.6)' : 'none',
                  zIndex: 0,
                }} />
              )}

              {/* Balão de Diálogo do Mascote Aura para o nó ativo */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-46px',
                  backgroundColor: 'rgba(13, 17, 26, 0.95)',
                  border: '1px solid #00F2FE',
                  boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                  padding: '4px 12px',
                  borderRadius: '14px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#00F2FE',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  animation: 'float 3s ease-in-out infinite',
                }}>
                  <Sparkles size={13} />
                  <span>Próximo Passo • Vamos treinar!</span>
                </div>
              )}

              {/* O Nó Esférico Bioluminescente */}
              <button
                type="button"
                onClick={() => handleOpenNode(node)}
                style={{
                  width: '82px',
                  height: '82px',
                  borderRadius: '50%',
                  border: isCompleted
                    ? '3px solid #00F2FE'
                    : isActive
                    ? '3px solid #FACC15'
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isCompleted
                    ? 'rgba(0, 242, 254, 0.18)'
                    : isActive
                    ? 'rgba(250, 204, 21, 0.18)'
                    : 'rgba(13, 17, 26, 0.8)',
                  boxShadow: isActive
                    ? '0 0 32px rgba(250, 204, 21, 0.5), inset 0 0 16px rgba(250, 204, 21, 0.3)'
                    : isCompleted
                    ? '0 0 24px rgba(0, 242, 254, 0.4), inset 0 0 12px rgba(0, 242, 254, 0.2)'
                    : 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  outline: 'none',
                }}
                onMouseDown={e => !isLocked && (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={e => !isLocked && (e.currentTarget.style.transform = isActive ? 'scale(1.08)' : 'scale(1)')}
              >
                {isLocked ? (
                  <Lock size={26} color="#64748B" />
                ) : isCompleted ? (
                  <CheckCircle2 size={34} color="#00F2FE" />
                ) : (
                  <span style={{ fontSize: '2rem' }}>⚡</span>
                )}

                {/* Estrelas / Coroas no Topo do Nó */}
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    display: 'flex',
                    gap: '2px',
                    backgroundColor: '#07090E',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(250, 204, 21, 0.5)',
                  }}>
                    {Array.from({ length: node.stars }).map((_, i) => (
                      <Crown key={i} size={11} fill="#FACC15" color="#FACC15" />
                    ))}
                  </div>
                )}

                {/* Badge de Ordem */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  backgroundColor: isCompleted ? '#00F2FE' : isActive ? '#FACC15' : '#1E293B',
                  color: isCompleted || isActive ? '#07090E' : '#94A3B8',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                }}>
                  {node.order}
                </div>
              </button>

              {/* Rótulo da Técnica Pedagógica */}
              <div style={{ textAlign: 'center', marginTop: '12px', maxWidth: '160px' }}>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: isLocked ? '#64748B' : '#F8FAFC',
                  letterSpacing: '-0.01em',
                }}>
                  {node.title}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#94A3B8',
                  marginTop: '2px',
                }}>
                  {node.subtitle}
                </div>
              </div>
            </div>
          );
        })}

        {/* 3. PORTAL DO CHEFE ARCANO (BOSS PORTAL) */}
        <div style={{
          marginTop: '20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, rgba(225, 29, 72, 0.2) 60%, transparent 100%)',
            border: '2px dashed #E11D48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(225, 29, 72, 0.4)',
            cursor: 'pointer',
            animation: 'pulseGlow 2.5s infinite',
          }}>
            <span style={{ fontSize: '2.5rem' }}>👑</span>
          </div>

          <div style={{
            marginTop: '10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E11D48', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Desafio de Maestria
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F8FAFC', margin: '2px 0' }}>
              Portal Arcanum: {currentGradeData.bossId.toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Conquiste as 3 coroas para desbloquear o próximo Grau</p>
          </div>
        </div>
      </div>

      {/* 4. MODAL DA LIÇÃO TRIPARTITE (DESIGN HIGH-END) */}
      {activeModalNode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 4, 7, 0.85)',
            backdropFilter: 'blur(14px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setActiveModalNode(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#0D111A',
              border: '1.5px solid rgba(0, 242, 254, 0.35)',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.2)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00F2FE', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {activeModalNode.category.toUpperCase()} • NÓ {activeModalNode.order}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F8FAFC', margin: '4px 0 2px' }}>
                  {activeModalNode.title}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
                  {activeModalNode.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalNode(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#94A3B8',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Abas Tripartite (Teoria -> Andaime -> Drill) */}
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '4px',
              gap: '4px',
              marginBottom: '20px',
            }}>
              {[
                { id: 'theory', label: '1. Teoria Relâmpago', icon: BookOpen },
                { id: 'scaffold', label: '2. Andaime Guiado', icon: Brain },
                { id: 'drill', label: '3. Drill Rápido', icon: Zap },
              ].map(tab => {
                const isCur = modalTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setModalTab(tab.id as any);
                      audioSynth.playKeypressTick();
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isCur ? '#00F2FE' : 'transparent',
                      color: isCur ? '#07090E' : '#94A3B8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conteúdo da Aba 1: Teoria Relâmpago */}
            {modalTab === 'theory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  backgroundColor: 'rgba(0, 242, 254, 0.06)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00F2FE', textTransform: 'uppercase' }}>
                    Fórmula & Padrão Algébrico
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#F8FAFC',
                    backgroundColor: 'rgba(7, 9, 14, 0.8)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    {activeModalNode.theoryFormula}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#CBD5E1',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '16px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  {activeModalNode.theoryExplanation}
                </div>

                <button
                  type="button"
                  onClick={() => setModalTab('scaffold')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#00F2FE',
                    color: '#07090E',
                    padding: '14px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
                    marginTop: '8px',
                  }}
                >
                  <span>Praticar no Andaime</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Conteúdo da Aba 2: Andaime Cognitivo (Scaffolding Interativo) */}
            {modalTab === 'scaffold' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                  Resolva os passos intermediários do cálculo mental para internalizar a estratégia:
                </div>

                {activeModalNode.scaffoldingSteps.map((step, idx) => {
                  const isDone = scaffoldFeedback[idx] === true;
                  const isWrong = scaffoldFeedback[idx] === false;

                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: isDone
                          ? 'rgba(16, 185, 129, 0.08)'
                          : isWrong
                          ? 'rgba(251, 113, 133, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: `1.5px solid ${
                          isDone ? '#10B981' : isWrong ? '#FB7185' : 'rgba(255, 255, 255, 0.08)'
                        }`,
                        borderRadius: '18px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00F2FE' }}>
                          PASSO {idx + 1}
                        </span>
                        {isDone && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>✓ CORRETO</span>}
                        {isWrong && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FB7185' }}>TENTE NOVAMENTE</span>}
                      </div>

                      <div style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: 600 }}>
                        {step.prompt}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="number"
                          placeholder="Sua resposta"
                          value={scaffoldAnswers[idx] || ''}
                          disabled={isDone}
                          onChange={e => setScaffoldAnswers({ ...scaffoldAnswers, [idx]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && handleScaffoldSubmit(idx, step.expectedValue)}
                          style={{
                            flex: 1,
                            backgroundColor: '#07090E',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            color: '#F8FAFC',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            outline: 'none',
                          }}
                        />

                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => handleScaffoldSubmit(idx, step.expectedValue)}
                            style={{
                              backgroundColor: 'rgba(0, 242, 254, 0.2)',
                              border: '1px solid #00F2FE',
                              color: '#00F2FE',
                              borderRadius: '12px',
                              padding: '0 16px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            Verificar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setModalTab('drill')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#8A2BE2',
                    color: '#FFF',
                    padding: '14px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(138, 43, 226, 0.4)',
                    marginTop: '8px',
                  }}
                >
                  <Play size={18} fill="#FFF" />
                  <span>Iniciar Bateria de Drill</span>
                </button>
              </div>
            )}

            {/* Conteúdo da Aba 3: Drill de Fixação */}
            {modalTab === 'drill' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>⚡</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px 0' }}>
                  Bateria de Alta Velocidade
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '340px', margin: '0 auto 24px' }}>
                  Resolva uma sequência de equações aplicando a técnica de <strong>{activeModalNode.title}</strong> para conquistar 3 estrelas.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModalNode(null);
                    if (onStartLesson) onStartLesson(activeModalNode.id);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#FACC15',
                    color: '#07090E',
                    padding: '16px',
                    borderRadius: '18px',
                    border: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(250, 204, 21, 0.5)',
                  }}
                >
                  COMEÇAR DRILL AGORA
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
