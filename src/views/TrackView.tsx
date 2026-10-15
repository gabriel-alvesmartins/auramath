import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles, Star, Lock, Play, ChevronRight, CheckCircle2,
  BookOpen, Brain, Zap, X, Trophy, Flame, Gift, Swords, Crown, Shield, Sliders, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  TRACK_GRADES,
  MASTERY_CHALLENGES,
  TrackNodeData,
  GradeLevel,
  MasteryChallengeData,
  GradeData
} from '../engine';
import { audioSynth } from '../services/audioSynth';
import { AuraMascotWeb } from '../components/AuraMascotWeb';
import { Aura3DButton } from '../components/tactile/Aura3DButton';
import { TrackSerpentineNode } from '../components/tactile/TrackSerpentineNode';
import { GreetingBanner, ActiveDiscoveryCard } from '../components/editorial';
import { LabView } from './LabView';
import { gamificationEngine } from '../services/gamificationEngine';
import { CommunityQuestBanner } from '../components/gamification';
import { DiscoveryChestReward } from '../engine';
import { LegendaryChallengeView } from './LegendaryChallengeView';

export interface NodeProgressState {
  completed: boolean;
  stars?: number;
  score?: number;
  legendary?: boolean;
}

export interface TrackViewProps {
  onStartLesson: (nodeId: string) => void;
  onStartBossBattle?: (bossId: string) => void;
  nodeProgress?: Record<string, NodeProgressState>;
  initialGrade?: GradeLevel;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Serpentine zigzag horizontal offset calculation.
 * Produces smooth alternating offsets [0, 48, 0, -48] across nodes.
 */
export const getNodeOffset = (index: number): number => {
  const pattern = [0, 48, 0, -48];
  return pattern[index % pattern.length];
};

/**
 * Viewport-adaptive dynamic mascot orientation.
 * When the node is shifted right (xOffset > 0), docks mascot to the LEFT
 * to prevent clipping on narrow 360-430px viewports.
 * When shifted left or centered, docks mascot to the RIGHT.
 */
export const getMascotOrientation = (xOffset: number): 'left' | 'right' => {
  if (xOffset > 0) return 'left';
  return 'right';
};

/**
 * Finds the player's active in-progress node (first node where !nodeProgress[node.id]?.completed).
 * Returns null if all nodes in the grade track are completed.
 */
export const findActiveNode = (
  nodes: TrackNodeData[],
  nodeProgress: Record<string, NodeProgressState>
): TrackNodeData | null => {
  const active = nodes.find((node) => !nodeProgress[node.id]?.completed);
  return active || null;
};

/**
 * Finds the 0-based index of the player's active node.
 * If all nodes are completed, returns the last node index (culmination target).
 */
export const findActiveNodeIndex = (
  nodes: TrackNodeData[],
  nodeProgress: Record<string, NodeProgressState>
): number => {
  const idx = nodes.findIndex((node) => !nodeProgress[node.id]?.completed);
  return idx === -1 ? nodes.length - 1 : idx;
};

/**
 * Retrieves the Unit Mastery Challenge Data corresponding to a specific Cognitive Grade.
 */
export const getGradeMasteryChallenge = (grade: GradeLevel): MasteryChallengeData | undefined => {
  return (MASTERY_CHALLENGES || []).find((b) => b.grade === grade);
};

export const getGradeBoss = getGradeMasteryChallenge;

/**
 * Determines the node index after which a cosmic treasure chest is intercalated.
 */
export const getChestPlacement = (grade: GradeLevel, nodeCount: number): number => {
  if (nodeCount >= 3) return 1;
  return 0;
};

/**
 * Standard contextual speech bubble phrases for the anchored Aura mascot.
 */
export const DEFAULT_MASCOT_SPEECHES = [
  'Vamos treinar!',
  'Domine este atalho!',
  'Você consegue!',
] as const;

/**
 * Reconstructed Zigzag Progression Track (Milestone M3)
 *
 * Features:
 * - Fluid serpentine progression track spanning all 6 Cognitive Grades
 * - Top sliding unit selector with smooth tab switching and unit banner
 * - Pedagogical Guidebook modal triggered by "GUIA" button
 * - TrackSerpentineNode integration with concentric SVG ring, Star Orbit Crown & popover
 * - Dynamic Mascot Anchoring to the player's active in-progress node
 * - Dynamic Mascot Orientation (left on positive offset, right on negative/zero offset)
 * - Intercalated cosmic treasure chests with Web Audio synth & confetti feedback
 * - Culminating Boss Castle nodes at track ends linked to Arcanum Bosses
 * - Dual Theme support seamlessly adapting to Dark Obsidian and Paper Light
 */
export const TrackView: React.FC<TrackViewProps> = ({
  onStartLesson,
  onStartBossBattle,
  nodeProgress: propNodeProgress,
  initialGrade = 1,
  className = '',
  style,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [activePopoverNodeId, setActivePopoverNodeId] = useState<string | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideModalTab, setGuideModalTab] = useState<'unidade' | 'caderno' | 'lab'>('unidade');
  const [chestModalOpen, setChestModalOpen] = useState(false);
  const [chestCollected, setChestCollected] = useState(false);
  const [activeChestReward, setActiveChestReward] = useState<DiscoveryChestReward | null>(null);
  const [bossModalOpen, setBossModalOpen] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<MasteryChallengeData | null>(null);
  const [selectedLegendaryNode, setSelectedLegendaryNode] = useState<TrackNodeData | null>(null);

  // Persistent / memoized collected chests per grade
  const [collectedChests, setCollectedChests] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('auramath-collected-chests');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persistent legendary nodes
  const [legendaryNodes, setLegendaryNodes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('auramath_legendary_nodes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active grade configuration from engine
  const gradeData: GradeData = useMemo(() => {
    return TRACK_GRADES.find((g) => g.grade === selectedGrade) || TRACK_GRADES[0];
  }, [selectedGrade]);

  // Corresponding Arcanum Boss
  const gradeBoss: MasteryChallengeData | undefined = useMemo(() => {
    return getGradeBoss(selectedGrade);
  }, [selectedGrade]);

  const [gamState, setGamState] = useState(() => gamificationEngine.getState());

  useEffect(() => {
    return gamificationEngine.subscribe((state) => {
      setGamState(state);
    });
  }, []);

  // Effective progress map: uses prop if provided, else gamificationEngine state + legendary state
  const effectiveProgress: Record<string, NodeProgressState> = useMemo(() => {
    const base = propNodeProgress || gamState.nodeProgress || {};
    const merged: Record<string, NodeProgressState> = {};
    for (const [k, v] of Object.entries(base)) {
      merged[k] = {
        ...v,
        legendary: legendaryNodes[k] || v.legendary,
      };
    }
    return merged;
  }, [propNodeProgress, gamState.nodeProgress, legendaryNodes]);

  const handleLegendarySuccess = (nodeId: string, xpEarned: number) => {
    audioSynth.playVictoryFanfare();
    const updated = { ...legendaryNodes, [nodeId]: true };
    setLegendaryNodes(updated);
    try {
      localStorage.setItem('auramath_legendary_nodes', JSON.stringify(updated));
    } catch {}
    gamificationEngine.addXP(xpEarned);
    setSelectedLegendaryNode(null);
  };

  // Player's active in-progress node across the entire curriculum
  const activeNode = useMemo(() => {
    for (const g of TRACK_GRADES) {
      const found = findActiveNode(g.nodes, effectiveProgress);
      if (found) return found;
    }
    return TRACK_GRADES[0].nodes[0];
  }, [effectiveProgress]);

  const activeNodeIndex = useMemo(() => {
    return findActiveNodeIndex(gradeData.nodes, effectiveProgress);
  }, [gradeData.nodes, effectiveProgress]);

  // Check if all lessons in the current grade are completed
  const isAllGradeCompleted = useMemo(() => {
    return gradeData.nodes.every((n) => effectiveProgress[n.id]?.completed);
  }, [gradeData.nodes, effectiveProgress]);

  // Chest placement index for this grade
  const chestPlacementIndex = useMemo(() => {
    return getChestPlacement(gradeData.grade, gradeData.nodes.length);
  }, [gradeData.grade, gradeData.nodes.length]);

  const isCurrentGradeChestCollected = !!collectedChests[selectedGrade] || chestCollected;

  // Handle opening cosmic treasure chest
  const handleOpenChest = () => {
    handleOpenChestForGrade(selectedGrade);
  };

  const handleOpenChestForGrade = (grade: GradeLevel) => {
    const reward = gamificationEngine.openDiscoveryChest(grade);
    setActiveChestReward(reward);
    audioSynth.playChestReward();
    confetti({
      particleCount: 50,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#0284C7', '#D97706', '#059669', '#FACC15'],
    });
    setChestCollected(true);
    setCollectedChests((prev) => {
      const updated = { ...prev, [grade]: true };
      try {
        localStorage.setItem('auramath-collected-chests', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setSelectedGrade(grade);
    setChestModalOpen(true);
  };

  // Handle clicking Boss Castle
  const handleBossClick = (boss: MasteryChallengeData, isUnlocked: boolean) => {
    if (!isUnlocked) {
      audioSynth.playErrorSoftRelease();
      return;
    }
    audioSynth.playKeypressTick();
    setSelectedBoss(boss);
    setSelectedGrade(boss.grade);
    setBossModalOpen(true);
  };

  return (
    <div
      className={`track-view ${className}`}
      style={{
        paddingBottom: '100px',
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'var(--color-track-bg, var(--color-paper-beige, #EFE7D5))',
        color: 'var(--color-text-primary, #202522)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Dual Theme semantic token fallbacks: var(--color-bg-base) var(--color-bg-surface) var(--color-bg-elevated) var(--color-text-primary) var(--color-text-secondary) var(--color-brand) var(--color-brand-surface) var(--color-gold) var(--color-alert) var(--color-border-subtle) var(--color-border-bold) */}
      <style>{`
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes popoverIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* 1. SELETOR DE SEÇÕES / UNIDADES ESTILO CADERNO EDITORIAL (QUICK-JUMP NAVIGATOR) */}
      <div
        className="unit-selector-bar"
        style={{
          padding: '12px 16px',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
          backgroundColor: 'var(--color-bg-surface, var(--color-cream, #FFFDF6))',
          position: 'sticky',
          top: 0,
          zIndex: 25,
          scrollbarWidth: 'none',
        }}
      >
        {TRACK_GRADES.map((g) => {
          const isSel = g.grade === selectedGrade;
          return (
            <button
              key={g.grade}
              type="button"
              onClick={() => {
                setSelectedGrade(g.grade);
                audioSynth.playKeypressTick();
                setActivePopoverNodeId(null);
                setChestCollected(!!collectedChests[g.grade]);
                const el = document.getElementById(`unit-section-${g.grade}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              aria-label={`Selecionar Unidade ${g.grade}`}
              style={{
                padding: '7px 15px',
                borderRadius: '14px',
                border: isSel
                  ? '2px solid var(--color-verdigris, #176B5B)'
                  : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                backgroundColor: isSel
                  ? 'var(--color-verdigris, #176B5B)'
                  : 'var(--color-paper, #F7F4EA)',
                color: isSel ? '#FFFFFF' : 'var(--color-ink-secondary, #5C645F)',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isSel ? '0 3px 0 var(--color-verdigris-bevel, #104E42)' : '0 2px 0 var(--color-border-bold, #C2BDAE)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              Unidade {g.grade}
            </button>
          );
        })}
      </div>

      {/* 1.1 GREETING BANNER & NEXT COGNITIVE DISCOVERY (FIGMA NODE 1:5 & 1:19) */}
      <GreetingBanner
        userName="Gabriel"
        volumeLabel={`CADERNO DE INSIGHTS · VOL. ${selectedGrade}`}
        estimatedMinutes={3}
        subtitle="Seu próximo salto cognitivo está a uma decomposição de distância."
      />

      <ActiveDiscoveryCard
        unitLabel={`UNIDADE ATIVA · GRAU ${selectedGrade}`}
        statusBadge="Em Andamento"
        title={activeNode?.title || "Decomposição & Fatores Amigáveis"}
        expression={activeNode?.sampleEquation?.split('=')[0]?.trim() || "48 × 52"}
        targetCategory="Produto Notável"
        insightFormula="Centro 50 ± 2 → 50² - 2² = 2.496"
        onContinue={() => {
          if (activeNode) {
            onStartLesson(activeNode.id);
          }
        }}
      />

      {/* BANNER DO DESAFIO COMUNITÁRIO GLOBAL */}
      <div style={{ padding: '0 16px', marginTop: '16px' }}>
        <CommunityQuestBanner quest={gamificationEngine.getState().communityQuest} />
      </div>

      {/* 2. TRILHA CONTÍNUA COM TODAS AS UNIDADES EM SEQUÊNCIA (DUOLINGO STYLE) */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {TRACK_GRADES.map((currentGradeData, gradeIdx) => {
          const currentGradeBoss = getGradeMasteryChallenge(currentGradeData.grade);
          const currentGradeCompleted = currentGradeData.nodes.every(
            (node) => !!effectiveProgress[node.id]?.completed || node.stars > 0
          );
          const currentChestPlacementIndex = getChestPlacement(currentGradeData.grade, currentGradeData.nodes.length);
          const currentGradeChestCollected = !!collectedChests[currentGradeData.grade] || (currentGradeData.grade === selectedGrade && chestCollected);

          return (
            <section
              key={currentGradeData.grade}
              id={`unit-section-${currentGradeData.grade}`}
              style={{ width: '100%', position: 'relative' }}
            >
              {/* BANNER EDITORIAL DA UNIDADE ("MATEMÁTICA COMO DESCOBERTA") */}
              <div style={{ padding: '16px 16px 8px' }}>
                <div
                  className="unit-header-banner"
                  style={{
                    backgroundColor: 'var(--color-verdigris, #176B5B)',
                    color: '#FFFFFF',
                    border: '2px solid var(--color-ink, #202522)',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 6px 0 var(--color-verdigris-bevel, #104E42), 0 4px 16px rgba(23, 107, 91, 0.18)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                      }}
                    >
                      Unidade {currentGradeData.grade} • Descoberta
                    </span>

                    {/* Caderno Guia Button */}
                    <Aura3DButton
                      variant="paper"
                      size="sm"
                      icon={<BookOpen size={14} color="var(--color-verdigris, #176B5B)" />}
                      onClick={() => {
                        setSelectedGrade(currentGradeData.grade);
                        audioSynth.playKeypressTick();
                        setGuideModalOpen(true);
                      }}
                      aria-label={`Abrir Guia Pedagógico da Unidade ${currentGradeData.grade}`}
                    >
                      CADERNO <span>GUIA</span>
                    </Aura3DButton>
                  </div>

                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      margin: '0 0 6px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {currentGradeData.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--color-verdigris-soft, #DCEBE5)',
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {currentGradeData.description}
                  </p>
                </div>
              </div>

              {/* TRILHA SERPENTINA DUOLINGO (WINDING PATH) */}
              <div
                className="serpentine-track-container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px 16px',
                  gap: '36px',
                  position: 'relative',
                }}
              >
                {currentGradeData.nodes.map((node, index) => {
                  const xOffset = getNodeOffset(index);
                  const isNodeCompleted = Boolean(effectiveProgress[node.id]?.completed);
                  const isPrereqSatisfied =
                    (node.prerequisites && node.prerequisites.length > 0)
                      ? node.prerequisites.every((p) => Boolean(effectiveProgress[p]?.completed))
                      : (index === 0 ? true : Boolean(effectiveProgress[currentGradeData.nodes[index - 1]?.id]?.completed));
                  const isNodeLocked = !isPrereqSatisfied && !isNodeCompleted;
                  const isCurrentActive = activeNode?.id === node.id;
                  const orientation = getMascotOrientation(xOffset);

                  return (
                    <div
                      key={node.id}
                      className={`track-node-wrapper node-${node.id}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transform: `translateX(${xOffset}px)`,
                        position: 'relative',
                        zIndex: activePopoverNodeId === node.id ? 30 : 5,
                      }}
                    >
                      {/* Conector serpentino contínuo com nanquim tracejado */}
                      {index > 0 && (
                        <svg
                          className="track-connector-serpentine"
                          width="120"
                          height="36"
                          viewBox="0 0 120 36"
                          style={{
                            position: 'absolute',
                            top: '-36px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            overflow: 'visible',
                            pointerEvents: 'none',
                            zIndex: 0,
                          }}
                        >
                          <path
                            d={`M ${60 + (getNodeOffset(index - 1) - xOffset)} 0 C ${60 + (getNodeOffset(index - 1) - xOffset)} 18, 60 18, 60 36`}
                            fill="none"
                            stroke={isNodeCompleted ? 'var(--color-verdigris, #176B5B)' : 'var(--color-border-bold, #C2BDAE)'}
                            strokeWidth="3.5"
                            strokeDasharray="6 4"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}

                      {/* Dynamic Anchored Aura Mascot with Viewport-Adaptive Orientation */}
                      {isCurrentActive && (
                        <div
                          className={`active-mascot-anchor active-mascot-${orientation}`}
                          style={{
                            position: 'absolute',
                            ...(orientation === 'left'
                              ? { left: '-125px' }
                              : { right: '-125px' }),
                            top: '-20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pointerEvents: 'none',
                            zIndex: 20,
                            animation: 'mascotFloat 3s ease-in-out infinite',
                          }}
                        >
                          <AuraMascotWeb
                            size={90}
                            state="idle"
                            speechText={index === 0 ? "Não calcule. Veja!" : index === 1 ? "Domine este atalho!" : "Você consegue!"}
                            showTierBadge={false}
                          />
                        </div>
                      )}

                      {/* Canonical 3D Serpentine Node */}
                      <TrackSerpentineNode
                        node={{
                          ...node,
                          legendary: effectiveProgress[node.id]?.legendary,
                        }}
                        index={index}
                        isCurrent={isCurrentActive}
                        isActive={!isNodeLocked || isNodeCompleted}
                        isCompleted={isNodeCompleted}
                        stars={effectiveProgress[node.id]?.stars ?? 0}
                        isLegendary={effectiveProgress[node.id]?.legendary}
                        isPopoverOpen={activePopoverNodeId === node.id}
                        onClosePopover={() => setActivePopoverNodeId(null)}
                        onClick={(clickedNode) => {
                          if (isNodeLocked) {
                            audioSynth.playErrorSoftRelease();
                            return;
                          }
                          audioSynth.playKeypressTick();
                          setActivePopoverNodeId((prev) =>
                            prev === clickedNode.id ? null : clickedNode.id
                          );
                        }}
                        onStartLesson={(targetNode) => {
                          setActivePopoverNodeId(null);
                          onStartLesson(targetNode.id);
                        }}
                        onStartLegendary={(legNode) => {
                          setActivePopoverNodeId(null);
                          setSelectedLegendaryNode(legNode);
                        }}
                        showMascot={false}
                      />

                      {/* CAIXA DE DESCOBERTA INTERCALADA */}
                      {index === currentChestPlacementIndex && (
                        <div
                          className="cosmic-chest-intercalation"
                          onClick={() => handleOpenChestForGrade(currentGradeData.grade)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Abrir Caixa de Descoberta da Unidade ${currentGradeData.grade}`}
                          style={{
                            marginTop: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            position: 'relative',
                            zIndex: 8,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          <div
                            style={{
                              width: '68px',
                              height: '68px',
                              borderRadius: '18px',
                              overflow: 'hidden',
                              border: '2px solid var(--color-ink, #202522)',
                              boxShadow: '0 4px 0 var(--color-marigold-bevel, #D49A2E)',
                              backgroundColor: 'var(--color-marigold, #F2B84B)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--color-ink, #202522)',
                            }}
                          >
                            <Gift size={32} strokeWidth={2.4} />
                          </div>
                          <span
                            style={{
                              marginTop: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: 'var(--color-ink, #202522)',
                              backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                              border: '1px solid var(--color-marigold-bevel, #D49A2E)',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                            }}
                          >
                            {currentGradeChestCollected ? 'Coletado ✨' : 'Abrir Baú 🎁'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* MESTRE DOS PADRÕES */}
                {currentGradeBoss && (
                  <div
                    className="boss-castle-waypoint"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: '12px',
                      position: 'relative',
                      zIndex: 10,
                    }}
                  >
                    <div
                      className="boss-connector-beam"
                      style={{
                        width: '3px',
                        height: '36px',
                        background: currentGradeCompleted
                          ? 'var(--color-verdigris, #176B5B)'
                          : 'var(--color-border-subtle, #D9D5C8)',
                        borderRadius: '2px',
                        marginBottom: '12px',
                      }}
                    />

                    {currentGradeCompleted && (
                      <div
                        className="boss-mascot-socket"
                        style={{
                          position: 'absolute',
                          right: '-115px',
                          top: '-15px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          pointerEvents: 'none',
                          zIndex: 20,
                          animation: 'mascotFloat 3s ease-in-out infinite',
                        }}
                      >
                        <AuraMascotWeb
                          size={68}
                          state="happy"
                          speechText="Você dominou a estrutura!"
                          showTierBadge={false}
                        />
                      </div>
                    )}

                    {(() => {
                      const isAllGradeCompleted = currentGradeCompleted;
                      return (
                        <button
                          type="button"
                          onClick={() => handleBossClick(currentGradeBoss, currentGradeCompleted)}
                          aria-label={`Mestre dos Padrões: ${currentGradeBoss.name} - ${
                            currentGradeCompleted ? 'Desafio Disponível' : 'Bloqueado'
                          }`}
                          className={`aura-3d-btn boss-castle-button ${
                            !currentGradeCompleted ? 'is-disabled' : ''
                          }`}
                          style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '24px',
                            padding: 0,
                            backgroundColor: currentGradeCompleted
                              ? 'var(--color-cream, #FFFDF6)'
                              : 'var(--color-paper, #F7F4EA)',
                            border: currentGradeCompleted
                              ? '2.5px solid var(--color-ink, #202522)'
                              : '1.5px solid var(--color-border-bold, #C2BDAE)',
                            boxShadow: currentGradeCompleted
                              ? '0 6px 0 var(--color-border-bold, #C2BDAE)'
                              : '0 3px 0 var(--color-border-bold, #C2BDAE)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: currentGradeCompleted ? 'pointer' : 'not-allowed',
                            position: 'relative',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {currentGradeCompleted ? (
                              <Crown size={38} color="var(--color-verdigris, #176B5B)" strokeWidth={2.4} />
                            ) : (
                              <Lock size={28} color="var(--color-ink-secondary, #5C645F)" />
                            )}
                          </div>

                          <span
                            style={{
                              marginTop: '6px',
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: currentGradeCompleted ? '#FFFFFF' : 'var(--color-ink-secondary, #5C645F)',
                              backgroundColor: currentGradeCompleted
                                ? 'var(--color-verdigris, #176B5B)'
                                : 'var(--color-border-subtle, #D9D5C8)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                            }}
                          >
                            {isAllGradeCompleted ? 'MESTRE' : 'BLOQUEADO'}
                          </span>
                        </button>
                      );
                    })()}

                    <div style={{ textAlign: 'center', marginTop: '10px', maxWidth: '170px' }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 900,
                          color: currentGradeCompleted
                            ? 'var(--color-ink, #202522)'
                            : 'var(--color-ink-secondary, #5C645F)',
                          fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                        }}
                      >
                        {currentGradeBoss.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: currentGradeCompleted
                            ? 'var(--color-verdigris, #176B5B)'
                            : 'var(--color-ink-secondary, #5C645F)',
                          fontWeight: 700,
                          marginTop: '2px',
                        }}
                      >
                        {currentGradeBoss.title}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TRANSIÇÃO INTER-UNIDADES */}
              {gradeIdx < TRACK_GRADES.length - 1 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '18px 0 24px',
                  }}
                >
                  <svg width="40" height="54" viewBox="0 0 40 54" fill="none">
                    <path
                      d="M 20 0 C 35 18, 5 36, 20 54"
                      fill="none"
                      stroke={currentGradeCompleted ? 'var(--color-verdigris, #176B5B)' : 'var(--color-border-bold, #C2BDAE)'}
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      color: 'var(--color-ink-secondary, #5C645F)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                    }}
                  >
                    ✦ Próxima Unidade ✦
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {/* RODAPÉ CONCEITUAL: NÃO CALCULE. VEJA. (FIGMA SCREEN 1:2) */}
        <div
          style={{
            marginTop: '36px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#767268', marginBottom: '6px' }}>
            <span style={{ height: '1px', width: '28px', backgroundColor: '#C2BDAE' }} />
            <BookOpen size={16} color="#767268" />
            <span style={{ height: '1px', width: '28px', backgroundColor: '#C2BDAE' }} />
          </div>
          <span
            style={{
              fontSize: '1.05rem',
              fontStyle: 'italic',
              fontFamily: 'var(--font-display, "Georgia", serif)',
              color: '#181D1A',
              fontWeight: 700,
            }}
          >
            "Não calcule. Veja."
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              color: '#767268',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginTop: '4px',
            }}
          >
            PRINCÍPIO FUNDAMENTAL AURAMATH · PROVA VISUAL
          </span>
        </div>
      </div>

      {/* 7. MODAL DO GUIA TEÓRICO DA UNIDADE */}

      {guideModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Guia Pedagógico da Unidade ${gradeData.grade}`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 60,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '2px solid var(--color-brand)',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 32px var(--color-brand-surface)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--color-brand)" />
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  {guideModalTab === 'unidade'
                    ? `Guia da Unidade ${gradeData.grade}`
                    : guideModalTab === 'caderno'
                    ? 'Compêndio de Estratégias'
                    : 'Laboratório Tátil'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                aria-label="Fechar Guia da Unidade"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Segmented Switcher (Unidade vs Macetes vs Lab Tátil) */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--color-paper, #F7F4EA)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '14px',
                padding: '3px',
                marginBottom: '16px',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setGuideModalTab('unidade');
                  audioSynth.playKeypressTick();
                }}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: guideModalTab === 'unidade' ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
                  color: guideModalTab === 'unidade' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  boxShadow: guideModalTab === 'unidade' ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                Unidade {gradeData.grade}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuideModalTab('caderno');
                  audioSynth.playKeypressTick();
                }}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: guideModalTab === 'caderno' ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
                  color: guideModalTab === 'caderno' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  boxShadow: guideModalTab === 'caderno' ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                Macetes
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuideModalTab('lab');
                  audioSynth.playKeypressTick();
                }}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: guideModalTab === 'lab' ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
                  color: guideModalTab === 'lab' ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  boxShadow: guideModalTab === 'lab' ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                Lab Tátil
              </button>
            </div>

            {guideModalTab === 'unidade' ? (
              <>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '20px',
                  }}
                >
                  {gradeData.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {gradeData.nodes.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '16px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: 'var(--color-brand)',
                          }}
                        >
                          {n.title}
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: 'var(--color-gold)',
                            backgroundColor: 'var(--color-gold-surface)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                          }}
                        >
                          {n.technique}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-secondary)',
                          marginBottom: '8px',
                          lineHeight: 1.35,
                        }}
                      >
                        {n.theory?.explanation || n.subtitle}
                      </div>
                      {n.theory?.formula && (
                        <div
                          style={{
                            backgroundColor: 'var(--color-bg-surface)',
                            border: '1px dashed var(--color-border-bold)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            marginBottom: '6px',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}
                        >
                          Fórmula: {n.theory.formula}
                        </div>
                      )}
                      {n.sampleEquation && (
                        <div
                          style={{
                            backgroundColor: 'var(--color-brand-surface)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--color-brand)',
                          }}
                        >
                          Exemplo: {n.sampleEquation}
                        </div>
                      )}
                      {n.theory?.visualBreakdown?.steps && (
                        <div
                          style={{
                            backgroundColor: 'var(--color-bg-surface)',
                            border: '1px solid var(--color-border-subtle)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'var(--color-verdigris, #176B5B)',
                            marginTop: '6px',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}
                        >
                          <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '2px', fontWeight: 800 }}>
                            Atalho Mental (Não calcule. Veja):
                          </div>
                          {n.theory.visualBreakdown.steps.join(' ➔ ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Aura3DButton
                    variant="brand"
                    fullWidth
                    size="md"
                    onClick={() => setGuideModalOpen(false)}
                  >
                    ENTENDI
                  </Aura3DButton>
                </div>
              </>
            ) : (
              <div style={{ margin: '-16px' }}>
                <LabView initialTab={guideModalTab === 'lab' ? 'lab' : 'caderno'} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MODAL DA CAIXA DE DESCOBERTAS (EDITORIAL SVG) */}
      {chestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Caixa de Descobertas Coletada"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(32, 37, 34, 0.75)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 65,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '2px solid var(--color-ink, #202522)',
              borderRadius: '24px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
              boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE), 0 16px 32px rgba(0, 0, 0, 0.2)',
              boxSizing: 'border-box',
            }}
          >
            {/* Editorial SVG Discovery Icon */}
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '24px',
                margin: '0 auto 16px',
                backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                border: '2.5px solid var(--color-ink, #202522)',
                boxShadow: '0 4px 0 var(--color-marigold-bevel, #D49A2E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={44} color="var(--color-marigold, #F2B84B)" strokeWidth={2.2} />
            </div>

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--color-text-primary, #202522)',
                margin: '0 0 6px',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              {activeChestReward?.headline || 'Caixa de Descobertas!'}
            </h3>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-ink-secondary, #5C645F)',
                margin: '0 0 16px',
                lineHeight: 1.35,
              }}
            >
              {activeChestReward?.description || `Você abriu os achados estruturais da Unidade ${gradeData.grade}!`}
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                border: '1.5px solid var(--color-marigold, #F2B84B)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--color-ink, #202522)',
                }}
              >
                +{activeChestReward?.xp || 50} Pontos de Descoberta (XP)
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
                +{activeChestReward?.stars || 5} Estrelas de Tinta (✦)
              </div>
              {activeChestReward?.xpBoostMinutes && (
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: 'var(--color-iris, #6E5AA6)',
                    backgroundColor: 'var(--color-iris-soft, #E8E3F3)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-iris, #6E5AA6)',
                  }}
                >
                  ⚡ Multiplicador 2x XP ativado por 15 minutos!
                </div>
              )}
              {activeChestReward?.freezeAwarded && (
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: 'var(--color-verdigris, #176B5B)',
                    backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-verdigris, #176B5B)',
                  }}
                >
                  🛡️ 1 Bloqueio de Ofensiva (Escudo de Gelo) equipado!
                </div>
              )}
            </div>

            <Aura3DButton
              variant="brand"
              fullWidth
              size="md"
              onClick={() => setChestModalOpen(false)}
            >
              GUARDAR NO CADERNO
            </Aura3DButton>
          </div>
        </div>
      )}

      {/* 9. MODAL DO DESAFIO DE MAESTRIA DA UNIDADE */}
      {bossModalOpen && selectedBoss && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Desafio de Maestria: ${selectedBoss.name}`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(32, 37, 34, 0.8)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 65,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '2px solid var(--color-ink, #202522)',
              borderRadius: '24px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE), 0 20px 40px rgba(0, 0, 0, 0.25)',
              boxSizing: 'border-box',
            }}
          >
            {/* Editorial SVG Master Seal Icon */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                margin: '0 auto 16px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                border: '2.5px solid var(--color-verdigris, #176B5B)',
                boxShadow: '0 4px 0 var(--color-verdigris-bevel, #104E42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crown size={42} color="var(--color-verdigris, #176B5B)" strokeWidth={2.4} />
            </div>

            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-verdigris, #176B5B)',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                padding: '3px 10px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              Desafio de Maestria • Grau {selectedBoss.grade}
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--color-text-primary, #202522)',
                margin: '0 0 4px',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              {selectedBoss.name}
            </h3>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-verdigris, #176B5B)',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              {selectedBoss.title}
            </div>

            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-ink-secondary, #5C645F)',
                lineHeight: 1.4,
                margin: '0 0 18px',
              }}
            >
              {selectedBoss.lore}
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-bg-base, #F7F4EA)',
                border: '1px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '16px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '20px',
                textAlign: 'left',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-ink-secondary, #5C645F)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  DESAFIOS
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    color: 'var(--color-verdigris, #176B5B)',
                  }}
                >
                  {selectedBoss.questionsCount || 5} em Cadeia
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-ink-secondary, #5C645F)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  RECONHECIMENTO
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary, #202522)',
                  }}
                >
                  {selectedBoss.rewardBadgeTitle || 'Selo de Maestria'}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--color-ink-secondary, #5C645F)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  TÉCNICAS AVALIADAS
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary, #202522)',
                  }}
                >
                  {selectedBoss.targetTechniques?.join(', ') || selectedBoss.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Aura3DButton
                variant="brand"
                fullWidth
                size="lg"
                icon={<Award size={18} />}
                onClick={() => {
                  setBossModalOpen(false);
                  if (onStartBossBattle) {
                    onStartBossBattle(selectedBoss.id);
                  } else {
                    onStartLesson(selectedBoss.id);
                  }
                }}
              >
                INICIAR PROVA DE MAESTRIA (+250 XP)
              </Aura3DButton>

              <Aura3DButton
                variant="neutral"
                fullWidth
                size="sm"
                onClick={() => setBossModalOpen(false)}
              >
                VOLTAR À TRILHA
              </Aura3DButton>
            </div>
          </div>
        </div>
      )}

      {selectedLegendaryNode && (
        <LegendaryChallengeView
          node={selectedLegendaryNode}
          onClose={() => setSelectedLegendaryNode(null)}
          onSuccess={handleLegendarySuccess}
        />
      )}
    </div>
  );
};

export default TrackView;
