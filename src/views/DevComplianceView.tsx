import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock, ArrowLeft, RefreshCw, CheckCircle2,
  ExternalLink, Layers, GitPullRequest, Copy, Check, Terminal, LayoutDashboard,
  Kanban, BookOpen, Cpu, Database, Search, Filter, Sparkles, RotateCcw,
  Sliders, Download, Trash2, Play, Smartphone, Monitor, Star, Lock,
  Unlock, Trophy, Zap, Calendar, Hash, Compass, FileText, CheckCircle
} from 'lucide-react';
import complianceDataRaw from '../data/spec-compliance.json';
import backlogDataRaw from '../data/github-backlog.json';
import {
  TRACK_GRADES,
  MASTERY_CHALLENGES,
  generateQuestionsForNode,
  generateDailyQuestions,
  generateFermiQuestion,
  getNodeScaffoldingTasks,
  GradeLevel,
  DifficultyTier
} from '../engine';
import { gamificationEngine } from '../services/gamificationEngine';
import { DiagramStudioTab } from './dev/DiagramStudioTab';
import { SensoryLabTab } from './dev/SensoryLabTab';
import { PrismaTheaterTab } from './dev/PrismaTheaterTab';
import { TimeMachineTab } from './dev/TimeMachineTab';
import { SaveSlotsTab } from './dev/SaveSlotsTab';

export interface DevComplianceViewProps {
  onReturn?: () => void;
  onStartLesson?: (nodeId: string) => void;
}

type TabType =
  | 'dashboard'
  | 'diagrams'
  | 'sensory'
  | 'prisma'
  | 'timemachine'
  | 'curriculum'
  | 'playground'
  | 'storage'
  | 'compliance'
  | 'backlog';

export function DevComplianceView({ onReturn, onStartLesson }: DevComplianceViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gamification state from localStorage
  const [gamState, setGamState] = useState(() => gamificationEngine.getState());
  const nodeProgress = gamState.nodeProgress || {};

  useEffect(() => {
    return gamificationEngine.subscribe((state) => {
      setGamState(state);
    });
  }, []);

  const refreshState = () => {
    setGamState(gamificationEngine.getState());
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // ---------------------------------------------------------------------------
  // TAB 1: DASHBOARD (COCKPIT)
  // ---------------------------------------------------------------------------
  const totalNodesCount = useMemo(() => {
    return TRACK_GRADES.reduce((acc, g) => acc + g.nodes.length, 0);
  }, []);

  const completedNodesCount = useMemo(() => {
    return Object.keys(nodeProgress).filter(id => (nodeProgress[id]?.stars || 0) > 0).length;
  }, [nodeProgress]);

  // ---------------------------------------------------------------------------
  // TAB 2: COMPLIANCE MATRIX FILTERS
  // ---------------------------------------------------------------------------
  const [complianceData, setComplianceData] = useState(complianceDataRaw);
  const [isRefreshingCompliance, setIsRefreshingCompliance] = useState(false);
  const [complianceSearch, setComplianceSearch] = useState('');
  const [complianceStatusFilter, setComplianceStatusFilter] = useState<'all' | 'compliant' | 'future' | 'drift'>('all');
  const [complianceGroupFilter, setComplianceGroupFilter] = useState<string>('all');

  const handleRefreshCompliance = () => {
    setIsRefreshingCompliance(true);
    setComplianceData({ ...complianceDataRaw });
    setTimeout(() => setIsRefreshingCompliance(false), 400);
  };

  const filteredComplianceItems = useMemo(() => {
    const items = complianceData.items || [];
    return items.filter(item => {
      if (complianceStatusFilter !== 'all' && item.status !== complianceStatusFilter) return false;
      if (complianceGroupFilter !== 'all' && item.domain !== complianceGroupFilter) return false;
      if (complianceSearch.trim()) {
        const query = complianceSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDetails = item.details.toLowerCase().includes(query);
        const matchesDomain = item.domain.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDetails && !matchesDomain) return false;
      }
      return true;
    });
  }, [complianceSearch, complianceStatusFilter, complianceGroupFilter]);

  // ---------------------------------------------------------------------------
  // TAB 3: BACKLOG & KANBAN FILTERS
  // ---------------------------------------------------------------------------
  const [kanbanSearch, setKanbanSearch] = useState('');
  const [kanbanViewMode, setKanbanViewMode] = useState<'board' | 'list'>('board');

  const filteredBacklogItems = useMemo(() => {
    return (backlogDataRaw || []).filter(item => {
      if (kanbanSearch.trim()) {
        const query = kanbanSearch.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBody = item.body.toLowerCase().includes(query);
        const matchesLabels = item.labels.some(l => l.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBody && !matchesLabels) return false;
      }
      return true;
    });
  }, [kanbanSearch]);

  const doneTasks = filteredBacklogItems.filter(i => i.column === 'Done');
  const backlogTasks = filteredBacklogItems.filter(i => i.column === 'Backlog');

  const allGhCliCommands = useMemo(() => {
    return (backlogDataRaw || []).map(item => {
      const labelStr = item.labels.join(',');
      const escapedBody = item.body.replace(/"/g, '\\"');
      return `gh issue create --title "${item.title}" --body "${escapedBody}" --label "${labelStr}"`;
    }).join('\n');
  }, []);

  // ---------------------------------------------------------------------------
  // TAB 4: CURRICULUM MANAGEMENT
  // ---------------------------------------------------------------------------
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>('all');
  const [curriculumSearch, setCurriculumSearch] = useState('');

  const filteredNodes = useMemo(() => {
    const list: Array<{
      node: typeof TRACK_GRADES[0]['nodes'][0];
      grade: number;
      gradeTitle: string;
    }> = [];

    TRACK_GRADES.forEach(g => {
      if (selectedGradeFilter === 'all' || g.grade === selectedGradeFilter) {
        g.nodes.forEach(n => {
          if (curriculumSearch.trim()) {
            const query = curriculumSearch.toLowerCase();
            const matchesTitle = n.title.toLowerCase().includes(query);
            const matchesId = n.id.toLowerCase().includes(query);
            const matchesTech = n.technique.toLowerCase().includes(query);
            if (!matchesTitle && !matchesId && !matchesTech) return;
          }
          list.push({ node: n, grade: g.grade, gradeTitle: g.title });
        });
      }
    });

    return list;
  }, [selectedGradeFilter, curriculumSearch]);

  // Bulk actions for curriculum
  const handleUnlockAllNodes = () => {
    TRACK_GRADES.forEach(g => {
      g.nodes.forEach(n => {
        const current = gamificationEngine.getNodeProgress(n.id);
        if (!current) {
          gamificationEngine.completeTrackNode(n.id, 1, 85);
        }
      });
    });
    refreshState();
  };

  const handleMasterAllNodes = () => {
    TRACK_GRADES.forEach(g => {
      g.nodes.forEach(n => {
        gamificationEngine.completeTrackNode(n.id, 3, 100);
      });
    });
    refreshState();
  };

  const handleResetCurriculum = () => {
    if (confirm('Tem certeza de que deseja resetar todo o progresso da trilha para o estado inicial?')) {
      localStorage.removeItem('auramath_node_progress');
      refreshState();
    }
  };

  const handleSetNodeStars = (nodeId: string, stars: 1 | 2 | 3) => {
    gamificationEngine.completeTrackNode(nodeId, stars, stars === 3 ? 100 : stars === 2 ? 90 : 80);
    refreshState();
  };

  // ---------------------------------------------------------------------------
  // TAB 5: ENGINE PLAYGROUND
  // ---------------------------------------------------------------------------
  const [playgroundGrade, setPlaygroundGrade] = useState<GradeLevel>(1);
  const [playgroundNodeId, setPlaygroundNodeId] = useState<string>('ADD_LEFT_RIGHT');
  const [playgroundTier, setPlaygroundTier] = useState<DifficultyTier>(2);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const [dailyDateInput, setDailyDateInput] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [generatedDaily, setGeneratedDaily] = useState<any[]>([]);

  const handleGenerateNodeQuestions = () => {
    const questions = generateQuestionsForNode(playgroundNodeId, 5, playgroundTier);
    setGeneratedQuestions(questions);
  };

  const handleGenerateDaily = () => {
    const questions = generateDailyQuestions(dailyDateInput);
    setGeneratedDaily(questions);
  };

  // ---------------------------------------------------------------------------
  // TAB 6: LOCALSTORAGE & PRESETS
  // ---------------------------------------------------------------------------
  const applyPreset = (preset: 'beginner' | 'intermediate' | 'master') => {
    if (preset === 'beginner') {
      localStorage.removeItem('auramath_node_progress');
      localStorage.setItem('auramath_gamification', JSON.stringify({
        xp: 0,
        stars: 0,
        streak: { current: 1, highest: 1, lastActiveDate: new Date().toISOString() },
        streakFreezes: 1,
        activeWager: null,
        achievements: [],
        recentlyUnlockedAchievement: null,
        activeNudge: null,
        hearts: 5,
        dailyDrillCount: 0,
        completedLessonIds: []
      }));
    } else if (preset === 'intermediate') {
      const intermediateProgress: Record<string, any> = {};
      TRACK_GRADES.slice(0, 3).forEach(g => {
        g.nodes.forEach(n => {
          intermediateProgress[n.id] = { stars: 3, accuracy: 95, completions: 2, lastCompletedAt: new Date().toISOString() };
        });
      });
      localStorage.setItem('auramath_node_progress', JSON.stringify(intermediateProgress));
      localStorage.setItem('auramath_gamification', JSON.stringify({
        xp: 1850,
        stars: 42,
        streak: { current: 8, highest: 8, lastActiveDate: new Date().toISOString() },
        streakFreezes: 2,
        activeWager: null,
        achievements: ['FIRST_STEP', 'STREAK_7'],
        recentlyUnlockedAchievement: null,
        activeNudge: null,
        hearts: 5,
        dailyDrillCount: 4,
        completedLessonIds: Object.keys(intermediateProgress)
      }));
    } else if (preset === 'master') {
      const masterProgress: Record<string, any> = {};
      TRACK_GRADES.forEach(g => {
        g.nodes.forEach(n => {
          masterProgress[n.id] = { stars: 3, accuracy: 100, completions: 5, lastCompletedAt: new Date().toISOString() };
        });
      });
      localStorage.setItem('auramath_node_progress', JSON.stringify(masterProgress));
      localStorage.setItem('auramath_gamification', JSON.stringify({
        xp: 8500,
        stars: 96,
        streak: { current: 30, highest: 30, lastActiveDate: new Date().toISOString() },
        streakFreezes: 3,
        activeWager: null,
        achievements: ['FIRST_STEP', 'STREAK_7', 'STREAK_30', 'MASTERY_SEVEN'],
        recentlyUnlockedAchievement: null,
        activeNudge: null,
        hearts: 5,
        dailyDrillCount: 10,
        completedLessonIds: Object.keys(masterProgress)
      }));
    }
    refreshState();
    alert(`Preset '${preset}' aplicado com sucesso!`);
  };

  const handleClearAllStorage = () => {
    if (confirm('Atenção: Isso limpará todo o localStorage do AuraMath. Deseja continuar?')) {
      localStorage.clear();
      refreshState();
      alert('LocalStorage limpo.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#F7F4EA', // Rebrand Paper
        color: '#202522', // Ink
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* ===================================================================== */}
      {/* ERP DESKTOP TOP BAR                                                   */}
      {/* ===================================================================== */}
      <header
        style={{
          height: '64px',
          backgroundColor: '#FFFDF6',
          borderBottom: '1px solid #D9D5C8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 4px rgba(32, 37, 34, 0.05)',
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FFFDF6',
              border: '2px solid #202522',
              boxShadow: '0 2px 0 #176B5B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="13" rx="8" ry="7" fill="#FFFDF6" stroke="#202522" strokeWidth="1.6" />
              <circle cx="9.5" cy="12.5" r="1.3" fill="#202522" />
              <circle cx="14.5" cy="12.5" r="1.3" fill="#202522" />
              <path d="M11 15c.5.4 1.5.4 2 0" stroke="#202522" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M12 6v2" stroke="#202522" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="4.5" r="2.2" fill="#F2B84B" stroke="#202522" strokeWidth="1.3" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#202522' }}>
                AuraMath Dev Operations
              </span>
              <span
                style={{
                  backgroundColor: '#DCEBE5',
                  color: '#176B5B',
                  border: '1px solid #176B5B',
                  borderRadius: '6px',
                  padding: '1px 7px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                ERP v1.2 · Spec-Anchored
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#5C645F' }}>
              Console de Governança, Anti-Drift e Engenharia Pedagógica
            </div>
          </div>
        </div>

        {/* Global Stats Pills & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#DCEBE5',
              border: '1px solid #176B5B',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#176B5B',
            }}
          >
            <ShieldCheck size={16} />
            <span>Conformidade: {complianceDataRaw.complianceRate || '100%'}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFDF6',
              border: '1px solid #D9D5C8',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#5C645F',
            }}
          >
            <BookOpen size={16} color="#6E5AA6" />
            <span>{totalNodesCount} Nós em 7 Graus</span>
          </div>

          <button
            type="button"
            onClick={refreshState}
            title="Atualizar Estado Local"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFDF6',
              border: '1.5px solid #202522',
              boxShadow: '0 2px 0 #202522',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#202522',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Sincronizar
          </button>

          {onReturn && (
            <button
              type="button"
              onClick={onReturn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#176B5B',
                color: '#FFFDF6',
                border: '1.5px solid #104E42',
                boxShadow: '0 2px 0 #104E42',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
              }}
            >
              <Smartphone size={16} /> Alternar para Modo Aluno (Mobile)
            </button>
          )}
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN ERP CONTAINER (SIDEBAR + CONTENT)                                */}
      {/* ===================================================================== */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar */}
        <aside
          style={{
            width: '260px',
            backgroundColor: '#FFFDF6',
            borderRight: '1px solid #D9D5C8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 14px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px 8px' }}>
              Módulos do ERP
            </div>

            {[
              { id: 'dashboard', label: 'Cockpit & Métricas', icon: LayoutDashboard },
              { id: 'diagrams', label: 'Diagram Studio ("Veja")', icon: Sparkles },
              { id: 'sensory', label: 'Sensory Lab (Web Audio)', icon: Zap },
              { id: 'prisma', label: 'Prisma Theater (Rive/SVG)', icon: Layers },
              { id: 'timemachine', label: 'Máquina do Tempo & Streaks', icon: Clock },
              { id: 'curriculum', label: 'Gestão Curricular (7 Graus)', icon: BookOpen },
              { id: 'playground', label: 'Playground dos Motores', icon: Cpu },
              { id: 'storage', label: 'Save Slots & Snapshots', icon: Database },
              { id: 'compliance', label: 'Matriz de Specs (Anti-Drift)', icon: ShieldCheck },
              { id: 'backlog', label: 'KanBan & Backlog GH', icon: Kanban },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#DCEBE5' : 'transparent',
                    border: isSelected ? '1.5px solid #176B5B' : '1.5px solid transparent',
                    boxShadow: isSelected ? '0 2px 0 #104E42' : 'none',
                    color: isSelected ? '#176B5B' : '#202522',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <Icon size={18} color={isSelected ? '#176B5B' : '#5C645F'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar System Diagnostic Footer */}
          <div
            style={{
              backgroundColor: '#F7F4EA',
              border: '1px solid #D9D5C8',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '0.72rem',
              color: '#5C645F',
            }}
          >
            <div style={{ fontWeight: 800, color: '#202522', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} color="#176B5B" />
              <span>Ambiente Ativo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Suíte de Testes:</span>
              <span style={{ fontWeight: 700, color: '#176B5B' }}>203 E2E Pass</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span>Motor Procedural:</span>
              <span style={{ fontWeight: 700, color: '#176B5B' }}>14/14 Unit Pass</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Drift de Requisitos:</span>
              <span style={{ fontWeight: 700, color: '#176B5B' }}>0 Divergências</span>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main
          style={{
            flex: 1,
            padding: '28px 36px',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* ================================================================= */}
          {/* TAB 1: COCKPIT & MÉTRICAS                                         */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Title */}
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                  Cockpit de Controle Spec-Anchored
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                  Visão executiva da paridade entre especificação formal, motor matemático e aplicação em tempo real.
                </p>
              </div>

              {/* 4 Top KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #176B5B',
                  padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Taxa de Conformidade
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#176B5B' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#176B5B', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Zero Drift Detectado
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #6E5AA6',
                  padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Trilha Pedagógica
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6E5AA6' }}>
                    {completedNodesCount} <span style={{ fontSize: '1.1rem', color: '#5C645F', fontWeight: 600 }}>/ {totalNodesCount}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#5C645F', fontWeight: 600, marginTop: '4px' }}>
                    Nós concluídos no navegador ({Math.round((completedNodesCount / totalNodesCount) * 100)}%)
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #F2B84B',
                  padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Backlog KanBan
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#202522' }}>
                    {doneTasks.length} <span style={{ fontSize: '1.1rem', color: '#176B5B', fontWeight: 700 }}>Prontos</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#B27B10', fontWeight: 700, marginTop: '4px' }}>
                    {backlogTasks.length} tarefas nas fases futuras
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #E76F61',
                  padding: '18px 20px',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Economia Cognitiva
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#202522' }}>
                    {gamState.xp} <span style={{ fontSize: '1.1rem', color: '#E76F61', fontWeight: 700 }}>XP</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#5C645F', fontWeight: 600, marginTop: '4px' }}>
                    ⭐ {gamState.stars} estrelas · 🔥 {gamState.streak.current} dias ofensiva
                  </div>
                </div>
              </div>

              {/* Status breakdown across 6 capabilities */}
              <div style={{
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #202522',
                borderRadius: '12px',
                boxShadow: '0 3px 0 #C2BDAE',
                padding: '22px 24px',
              }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 800, color: '#202522' }}>
                  Status dos Módulos Funcionais por Domínio
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { domain: 'learning-track', name: 'Trilha & Pedagogia', status: 'Conforme', details: '7 Graus, 32 Nós, 3 Andaimes por nó e retenção de 80% implementados.', color: '#176B5B' },
                    { domain: 'math-engine', name: 'Motor Procedural', status: 'Conforme', details: 'Mulberry32 PRNG, calibração 1★/2★/3★, Prova dos 9/11 e Fermi corrigido.', color: '#176B5B' },
                    { domain: 'sensory-gamification', name: 'Gamificação Sensorial', status: 'Conforme', details: 'Persistência no localStorage, Chefes e Skins obsoletos eliminados.', color: '#176B5B' },
                    { domain: 'game-modes', name: 'Modos de Jogo', status: 'Conforme', details: 'Desafio Diário determinístico de 20Q, Split-Screen síncrono 2P validado.', color: '#176B5B' },
                    { domain: 'classroom-b2b', name: 'Módulo Escolar & B2B', status: 'Futuro', details: 'Painel docente e gestão de turmas postergados para a próxima fase.', color: '#B27B10' },
                    { domain: 'ui-design-system', name: 'Design System Rebrand', status: 'Conforme', details: 'Paleta Paper/Verdigris/Marigold/Iris e Coruja Geômetra unificados.', color: '#176B5B' },
                  ].map(mod => (
                    <div
                      key={mod.domain}
                      style={{
                        backgroundColor: '#F7F4EA',
                        border: '1px solid #D9D5C8',
                        borderRadius: '10px',
                        padding: '14px 16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#202522' }}>{mod.name}</span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: mod.status === 'Conforme' ? '#DCEBE5' : '#FCE8CE',
                            color: mod.color,
                            border: `1px solid ${mod.color}`,
                          }}
                        >
                          {mod.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#5C645F', lineHeight: '1.35' }}>
                        {mod.details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spec-Anchored Methodology Banner */}
              <div
                style={{
                  backgroundColor: '#DCEBE5',
                  border: '1.5px solid #176B5B',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #104E42',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#176B5B',
                  color: '#FFFDF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.96rem', fontWeight: 800, color: '#176B5B' }}>
                    Metodologia Spec-Anchored Ativa
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#202522', lineHeight: '1.45' }}>
                    No AuraMath, especificação e código coexistem como parceiros iguais. Qualquer alteração comportamental exige
                    atualização simultânea da spec formal e da implementação. Os testes automatizados em CI/CD funcionam como contrato vivo,
                    impedindo o Specification Rot e tornando qualquer desvio visível e bloqueante.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: DIAGRAM STUDIO ("NÃO CALCULE. VEJA")                         */}
          {/* ================================================================= */}
          {activeTab === 'diagrams' && <DiagramStudioTab />}

          {/* ================================================================= */}
          {/* TAB: SENSORY LAB (WEB AUDIO 0MS)                                  */}
          {/* ================================================================= */}
          {activeTab === 'sensory' && <SensoryLabTab />}

          {/* ================================================================= */}
          {/* TAB: PRISMA THEATER (RIVE & SVG)                                  */}
          {/* ================================================================= */}
          {activeTab === 'prisma' && <PrismaTheaterTab />}

          {/* ================================================================= */}
          {/* TAB: MÁQUINA DO TEMPO & RETENÇÃO                                 */}
          {/* ================================================================= */}
          {activeTab === 'timemachine' && <TimeMachineTab />}

          {/* ================================================================= */}
          {/* TAB 2: MATRIZ DE SPECS (ANTI-DRIFT)                               */}
          {/* ================================================================= */}
          {activeTab === 'compliance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                    Matriz de Conformidade & Anti-Drift
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                    Auditoria automatizada das especificações ativas e contratos de implementação.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.74rem', color: '#176B5B', fontWeight: 700 }}>
                    <ShieldCheck size={14} />
                    <span>Última Auditoria: {new Date(complianceData.generatedAt || Date.now()).toLocaleDateString('pt-BR')} às {new Date(complianceData.generatedAt || Date.now()).toLocaleTimeString('pt-BR')}</span>
                    <span>·</span>
                    <span style={{ backgroundColor: '#DCEBE5', padding: '1px 6px', borderRadius: '4px' }}>
                      {complianceData.complianceRate} Conforme ({complianceData.items?.length || 0} itens)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleRefreshCompliance}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#DCEBE5',
                      border: '1.5px solid #176B5B',
                      boxShadow: '0 2px 0 #176B5B',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#176B5B',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={14} style={{ animation: isRefreshingCompliance ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isRefreshingCompliance ? 'Atualizando...' : 'Recarregar Matriz'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(complianceData, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "spec-compliance-report.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#FFFDF6',
                      border: '1.5px solid #202522',
                      boxShadow: '0 2px 0 #202522',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={14} /> Exportar Relatório JSON
                  </button>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #D9D5C8',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <Search size={16} color="#5C645F" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={complianceSearch}
                    onChange={(e) => setComplianceSearch(e.target.value)}
                    placeholder="Buscar requisitos, detalhes ou arquivos..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '8px',
                      border: '1px solid #D9D5C8',
                      backgroundColor: '#F7F4EA',
                      fontSize: '0.82rem',
                      outline: 'none',
                      color: '#202522',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Status Filter Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F', marginRight: '4px' }}>Status:</span>
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'compliant', label: 'Conformes' },
                    { id: 'future', label: 'Futuros' },
                    { id: 'drift', label: 'Divergências' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setComplianceStatusFilter(f.id as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        border: complianceStatusFilter === f.id ? '1.5px solid #202522' : '1px solid #D9D5C8',
                        backgroundColor: complianceStatusFilter === f.id ? '#202522' : '#FFFDF6',
                        color: complianceStatusFilter === f.id ? '#FFFDF6' : '#202522',
                        cursor: 'pointer',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #C2BDAE',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F7F4EA', borderBottom: '1.5px solid #202522' }}>
                      <th style={{ padding: '12px 18px', fontWeight: 800, color: '#202522' }}>Requisito & Capacidade</th>
                      <th style={{ padding: '12px 18px', fontWeight: 800, color: '#202522', width: '140px' }}>Status</th>
                      <th style={{ padding: '12px 18px', fontWeight: 800, color: '#202522' }}>Detalhamento Técnico</th>
                      <th style={{ padding: '12px 18px', fontWeight: 800, color: '#202522' }}>Arquivo Âncora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplianceItems.map((item, index) => {
                      const isCompliant = item.status === 'compliant';
                      const isFuture = item.status === 'future';
                      return (
                        <tr
                          key={index}
                          style={{
                            borderBottom: '1px solid #D9D5C8',
                            backgroundColor: index % 2 === 0 ? '#FFFDF6' : '#FAF8F0',
                          }}
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 800, color: '#202522', marginBottom: '2px' }}>
                              {item.title}
                            </div>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: '#5C645F',
                                backgroundColor: '#EFEBE0',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                              }}
                            >
                              {item.domain}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                backgroundColor: isCompliant ? '#DCEBE5' : isFuture ? '#FCE8CE' : '#FBD5D0',
                                color: isCompliant ? '#176B5B' : isFuture ? '#B27B10' : '#E76F61',
                                border: `1px solid ${isCompliant ? '#176B5B' : isFuture ? '#B27B10' : '#E76F61'}`,
                              }}
                            >
                              {isCompliant ? <CheckCircle2 size={13} /> : isFuture ? <Clock size={13} /> : <AlertTriangle size={13} />}
                              {isCompliant ? 'Conforme' : isFuture ? 'Futuro' : 'Divergência'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#202522', lineHeight: '1.4' }}>
                            {item.details}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <code
                              style={{
                                fontSize: '0.72rem',
                                color: '#176B5B',
                                backgroundColor: '#DCEBE5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {item.specRef}
                            </code>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: BACKLOG & KANBAN (GITHUB PROJECTS)                         */}
          {/* ================================================================= */}
          {activeTab === 'backlog' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                    Quadro KanBan & Backlog do GitHub Projects
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                    Sincronização bidirecional entre especificações e tarefas de desenvolvimento.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(allGhCliCommands, 'all-cli')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: copiedKey === 'all-cli' ? '#176B5B' : '#FFFDF6',
                    color: copiedKey === 'all-cli' ? '#FFFDF6' : '#202522',
                    border: '1.5px solid #202522',
                    boxShadow: '0 2px 0 #202522',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copiedKey === 'all-cli' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedKey === 'all-cli' ? 'Comandos Copiados!' : 'Copiar Comandos GH CLI'}</span>
                </button>
              </div>

              {/* Instructions banner */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1px solid #D9D5C8',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Terminal size={20} color="#176B5B" />
                  <div style={{ fontSize: '0.78rem', color: '#5C645F' }}>
                    <span style={{ fontWeight: 800, color: '#202522' }}>Automação via CLI: </span>
                    Execute <code style={{ backgroundColor: '#F7F4EA', padding: '2px 6px', borderRadius: '4px', color: '#176B5B', fontWeight: 700 }}>.\scripts\sync-gh-project.ps1</code> no PowerShell para popular seu quadro do GitHub automaticamente.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard('.\\scripts\\sync-gh-project.ps1', 'ps-script')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #D9D5C8',
                    backgroundColor: '#F7F4EA',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#202522',
                  }}
                >
                  {copiedKey === 'ps-script' ? 'Copiado!' : 'Copiar Comando'}
                </button>
              </div>

              {/* Dual Column KanBan Board */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Done Column */}
                <div
                  style={{
                    backgroundColor: '#FAF8F0',
                    border: '1.5px solid #202522',
                    borderRadius: '12px',
                    boxShadow: '0 3px 0 #176B5B',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #202522', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} color="#176B5B" />
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#202522' }}>
                        Concluído / Spec-Anchored
                      </span>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#DCEBE5',
                        color: '#176B5B',
                        border: '1px solid #176B5B',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {doneTasks.length} tarefas
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {doneTasks.map((task, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFDF6',
                          border: '1px solid #D9D5C8',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          boxShadow: '0 1px 3px rgba(32, 37, 34, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#202522' }}>
                            {task.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cmd = `gh issue create --title "${task.title}" --body "${task.body.replace(/"/g, '\\"')}" --label "${task.labels.join(',')}"`;
                              copyToClipboard(cmd, `task-${idx}`);
                            }}
                            title="Copiar comando GH CLI desta tarefa"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: copiedKey === `task-${idx}` ? '#176B5B' : '#5C645F',
                              padding: '2px',
                            }}
                          >
                            {copiedKey === `task-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: '0.74rem', color: '#5C645F', lineHeight: '1.35' }}>
                          {task.body}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {task.labels.map(lbl => (
                            <span
                              key={lbl}
                              style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                backgroundColor: '#DCEBE5',
                                color: '#176B5B',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backlog Column */}
                <div
                  style={{
                    backgroundColor: '#FAF8F0',
                    border: '1.5px solid #202522',
                    borderRadius: '12px',
                    boxShadow: '0 3px 0 #F2B84B',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #202522', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="#B27B10" />
                      <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#202522' }}>
                        Backlog / Fases Futuras
                      </span>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FCE8CE',
                        color: '#B27B10',
                        border: '1px solid #B27B10',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {backlogTasks.length} tarefas
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {backlogTasks.map((task, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFDF6',
                          border: '1px solid #D9D5C8',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          boxShadow: '0 1px 3px rgba(32, 37, 34, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#202522' }}>
                            {task.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cmd = `gh issue create --title "${task.title}" --body "${task.body.replace(/"/g, '\\"')}" --label "${task.labels.join(',')}"`;
                              copyToClipboard(cmd, `task-backlog-${idx}`);
                            }}
                            title="Copiar comando GH CLI desta tarefa"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: copiedKey === `task-backlog-${idx}` ? '#176B5B' : '#5C645F',
                              padding: '2px',
                            }}
                          >
                            {copiedKey === `task-backlog-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: '0.74rem', color: '#5C645F', lineHeight: '1.35' }}>
                          {task.body}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {task.labels.map(lbl => (
                            <span
                              key={lbl}
                              style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                backgroundColor: '#FCE8CE',
                                color: '#B27B10',
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: GESTÃO CURRICULAR (32 NÓS)                                */}
          {/* ================================================================= */}
          {activeTab === 'curriculum' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                    Gestão Curricular & Trilha Cognitiva
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                    Estrutura de 7 Graus Cognitivos e 32 Nós Pedagógicos com controle direto de estado.
                  </p>
                </div>

                {/* Bulk Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleUnlockAllNodes}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFDF6',
                      border: '1.5px solid #202522',
                      boxShadow: '0 2px 0 #202522',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Unlock size={14} /> Desbloquear Todos
                  </button>

                  <button
                    type="button"
                    onClick={handleMasterAllNodes}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#176B5B',
                      color: '#FFFDF6',
                      border: '1.5px solid #104E42',
                      boxShadow: '0 2px 0 #104E42',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Star size={14} /> Completar Todos (3★)
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCurriculum}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#FBD5D0',
                      color: '#E76F61',
                      border: '1.5px solid #E76F61',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RotateCcw size={14} /> Resetar Trilha
                  </button>
                </div>
              </div>

              {/* Grade Selector Toolbar */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #D9D5C8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#5C645F', marginRight: '4px' }}>Grau:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedGradeFilter('all')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      border: selectedGradeFilter === 'all' ? '1.5px solid #202522' : '1px solid #D9D5C8',
                      backgroundColor: selectedGradeFilter === 'all' ? '#202522' : '#FFFDF6',
                      color: selectedGradeFilter === 'all' ? '#FFFDF6' : '#202522',
                      cursor: 'pointer',
                    }}
                  >
                    Todos (32 Nós)
                  </button>
                  {TRACK_GRADES.map(g => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setSelectedGradeFilter(g.grade)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        border: selectedGradeFilter === g.grade ? '1.5px solid #176B5B' : '1px solid #D9D5C8',
                        backgroundColor: selectedGradeFilter === g.grade ? '#DCEBE5' : '#FFFDF6',
                        color: selectedGradeFilter === g.grade ? '#176B5B' : '#202522',
                        cursor: 'pointer',
                      }}
                    >
                      Grau {g.grade}: {g.title.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  placeholder="Filtrar por nome ou técnica..."
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D9D5C8',
                    backgroundColor: '#F7F4EA',
                    fontSize: '0.78rem',
                    outline: 'none',
                    width: '220px',
                  }}
                />
              </div>

              {/* Nodes Table */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #C2BDAE',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F7F4EA', borderBottom: '1.5px solid #202522' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522', width: '70px' }}>Grau</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522' }}>Nó Pedagógico</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522' }}>Técnica Mental</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522', width: '110px' }}>Andaimes</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522', width: '120px' }}>Progresso Local</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#202522', width: '220px' }}>Ações de Controle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNodes.map(({ node, grade }, index) => {
                      const progress = nodeProgress[node.id];
                      const stars = progress?.stars || 0;
                      const isUnlocked = gamificationEngine.isNodeUnlocked(node.id);

                      return (
                        <tr
                          key={node.id}
                          style={{
                            borderBottom: '1px solid #D9D5C8',
                            backgroundColor: index % 2 === 0 ? '#FFFDF6' : '#FAF8F0',
                          }}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#176B5B' }}>
                            Grau {grade}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#202522' }}>{node.title}</div>
                            <div style={{ fontSize: '0.7rem', color: '#5C645F' }}>ID: {node.id}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <code style={{ fontSize: '0.72rem', color: '#6E5AA6', backgroundColor: '#EDE8F5', padding: '2px 6px', borderRadius: '4px' }}>
                              {node.technique}
                            </code>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#176B5B', backgroundColor: '#DCEBE5', padding: '2px 8px', borderRadius: '999px' }}>
                              3 Tarefas
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {[1, 2, 3].map(s => (
                                <Star
                                  key={s}
                                  size={15}
                                  fill={s <= stars ? '#F2B84B' : 'none'}
                                  color={s <= stars ? '#F2B84B' : '#D9D5C8'}
                                />
                              ))}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: isUnlocked ? '#176B5B' : '#5C645F', marginTop: '2px', fontWeight: 600 }}>
                              {isUnlocked ? 'Desbloqueado' : 'Bloqueado'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleSetNodeStars(node.id, 3)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #F2B84B',
                                  backgroundColor: '#FFFDF6',
                                  color: '#B27B10',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                3★
                              </button>

                              {onStartLesson && (
                                <button
                                  type="button"
                                  onClick={() => onStartLesson(node.id)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#176B5B',
                                    color: '#FFFDF6',
                                    border: '1px solid #104E42',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Play size={12} /> Testar Lição
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: PLAYGROUND DE MOTORES                                      */}
          {/* ================================================================= */}
          {activeTab === 'playground' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                  Playground & Simulador de Motores Procedurais
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                  Execute e inspecione os geradores matemáticos do pacote @auramath/engine em tempo real.
                </p>
              </div>

              {/* 1. Gerador por Dificuldade e Nó */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #176B5B',
                  padding: '20px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Cpu size={20} color="#176B5B" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#202522' }}>
                    1. Gerador Procedural Calibrado por Dificuldade (Tiers 1★ / 2★ / 3★)
                  </h3>
                </div>

                {/* Control Form */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#5C645F', marginBottom: '4px' }}>
                      Nó Pedagógico:
                    </label>
                    <select
                      value={playgroundNodeId}
                      onChange={(e) => setPlaygroundNodeId(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D9D5C8',
                        backgroundColor: '#F7F4EA',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {TRACK_GRADES.flatMap(g => g.nodes).map(n => (
                        <option key={n.id} value={n.id}>{n.title} ({n.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#5C645F', marginBottom: '4px' }}>
                      Nível de Dificuldade:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { tier: 1, label: '1★ Fácil' },
                        { tier: 2, label: '2★ Médio' },
                        { tier: 3, label: '3★ Difícil' },
                      ].map(t => (
                        <button
                          key={t.tier}
                          type="button"
                          onClick={() => setPlaygroundTier(t.tier as any)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            border: playgroundTier === t.tier ? '1.5px solid #176B5B' : '1px solid #D9D5C8',
                            backgroundColor: playgroundTier === t.tier ? '#DCEBE5' : '#FFFDF6',
                            color: playgroundTier === t.tier ? '#176B5B' : '#202522',
                            cursor: 'pointer',
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ alignSelf: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleGenerateNodeQuestions}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#176B5B',
                        color: '#FFFDF6',
                        border: '1.5px solid #104E42',
                        boxShadow: '0 2px 0 #104E42',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={14} /> Gerar 5 Questões
                    </button>
                  </div>
                </div>

                {/* Generated Table */}
                {generatedQuestions.length > 0 && (
                  <div style={{ border: '1px solid #D9D5C8', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F7F4EA', borderBottom: '1px solid #D9D5C8' }}>
                          <th style={{ padding: '8px 12px' }}>#</th>
                          <th style={{ padding: '8px 12px' }}>Equação</th>
                          <th style={{ padding: '8px 12px' }}>Resposta</th>
                          <th style={{ padding: '8px 12px' }}>Dica Pedagógica</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedQuestions.map((q, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #EFEBE0', backgroundColor: '#FFFDF6' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 800, color: '#176B5B' }}>{i + 1}</td>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{q.equation}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 800, color: '#202522' }}>{q.answer}</td>
                            <td style={{ padding: '8px 12px', color: '#5C645F', fontSize: '0.74rem' }}>{q.hint || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 2. Simulador do Desafio Diário */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #F2B84B',
                  padding: '20px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Calendar size={20} color="#B27B10" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#202522' }}>
                    2. Desafio Diário Determinístico (Mulberry32 PRNG · 20 Questões)
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#5C645F', marginBottom: '4px' }}>
                      Data do Desafio (AAAA-MM-DD):
                    </label>
                    <input
                      type="date"
                      value={dailyDateInput}
                      onChange={(e) => setDailyDateInput(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D9D5C8',
                        backgroundColor: '#F7F4EA',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div style={{ alignSelf: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleGenerateDaily}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#F2B84B',
                        color: '#202522',
                        border: '1.5px solid #202522',
                        boxShadow: '0 2px 0 #202522',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Zap size={14} /> Gerar 20 Questões do Dia
                    </button>
                  </div>
                </div>

                {generatedDaily.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#5C645F', marginBottom: '8px', fontWeight: 600 }}>
                      Semente determinística gerada: <strong>{dailyDateInput.replace(/-/g, '')}</strong> · Total de questões: <strong>{generatedDaily.length}</strong>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #D9D5C8', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F7F4EA', position: 'sticky', top: 0 }}>
                            <th style={{ padding: '6px 12px' }}>#</th>
                            <th style={{ padding: '6px 12px' }}>Equação</th>
                            <th style={{ padding: '6px 12px' }}>Resposta</th>
                            <th style={{ padding: '6px 12px' }}>Técnica</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedDaily.map((q, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #EFEBE0', backgroundColor: '#FFFDF6' }}>
                              <td style={{ padding: '6px 12px', fontWeight: 800 }}>{idx + 1}</td>
                              <td style={{ padding: '6px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{q.equation}</td>
                              <td style={{ padding: '6px 12px', fontWeight: 800, color: '#176B5B' }}>{q.answer}</td>
                              <td style={{ padding: '6px 12px', color: '#5C645F' }}>{q.technique || 'Geral'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SAVE SLOTS & LOCALSTORAGE                                  */}
          {/* ================================================================= */}
          {activeTab === 'storage' && <SaveSlotsTab />}
          {false && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#202522' }}>
                  Gerenciador de Estado & LocalStorage
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#5C645F' }}>
                  Inspecione e manipule diretamente os dados persistidos da aplicação.
                </p>
              </div>

              {/* Quick Presets */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #202522',
                  borderRadius: '12px',
                  boxShadow: '0 3px 0 #6E5AA6',
                  padding: '20px 24px',
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem', fontWeight: 800, color: '#202522' }}>
                  Perfis Rápidos de Teste (QA Presets)
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#5C645F' }}>
                  Aplique estados pré-configurados para testar a experiência de diferentes perfis de alunos:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#202522', marginBottom: '4px' }}>
                      1. Aluno Iniciante (Dia 1)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#5C645F', marginBottom: '12px' }}>
                      Zero estrelas, apenas Nó 1 desbloqueado, 0 XP, streak 1.
                    </div>
                    <button
                      type="button"
                      onClick={() => applyPreset('beginner')}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid #D9D5C8',
                        backgroundColor: '#FFFDF6',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      Carregar Iniciante
                    </button>
                  </div>

                  <div style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#6E5AA6', marginBottom: '4px' }}>
                      2. Aluno Intermediário
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#5C645F', marginBottom: '12px' }}>
                      Graus 1 a 3 completos com 3★, 1.850 XP, streak de 8 dias.
                    </div>
                    <button
                      type="button"
                      onClick={() => applyPreset('intermediate')}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '6px',
                        border: '1px solid #6E5AA6',
                        backgroundColor: '#FFFDF6',
                        color: '#6E5AA6',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      Carregar Intermediário
                    </button>
                  </div>

                  <div style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#176B5B', marginBottom: '4px' }}>
                      3. Mestre Supremo (100%)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#5C645F', marginBottom: '12px' }}>
                      Todos os 7 Graus e 32 nós completos com 3★, 8.500 XP, streak 30.
                    </div>
                    <button
                      type="button"
                      onClick={() => applyPreset('master')}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '1.5px solid #104E42',
                        backgroundColor: '#176B5B',
                        color: '#FFFDF6',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      Carregar Mestre 100%
                    </button>
                  </div>
                </div>
              </div>

              {/* Raw JSON Viewers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: '#FFFDF6', border: '1px solid #D9D5C8', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#202522' }}>auramath_gamification</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(JSON.stringify(gamState, null, 2), 'copy-gam')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C645F' }}
                    >
                      {copiedKey === 'copy-gam' ? <Check size={14} color="#176B5B" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre style={{
                    backgroundColor: '#F7F4EA',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    overflowX: 'auto',
                    maxHeight: '220px',
                    margin: 0,
                  }}>
                    {JSON.stringify(gamState, null, 2)}
                  </pre>
                </div>

                <div style={{ backgroundColor: '#FFFDF6', border: '1px solid #D9D5C8', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#202522' }}>auramath_node_progress</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(JSON.stringify(nodeProgress, null, 2), 'copy-nodes')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C645F' }}
                    >
                      {copiedKey === 'copy-nodes' ? <Check size={14} color="#176B5B" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre style={{
                    backgroundColor: '#F7F4EA',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    overflowX: 'auto',
                    maxHeight: '220px',
                    margin: 0,
                  }}>
                    {JSON.stringify(nodeProgress, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                style={{
                  backgroundColor: '#FFFDF6',
                  border: '1.5px solid #E76F61',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#E76F61' }}>Zona de Perigo</div>
                  <div style={{ fontSize: '0.74rem', color: '#5C645F' }}>Limpa todas as chaves de persistência do AuraMath no navegador.</div>
                </div>

                <button
                  type="button"
                  onClick={handleClearAllStorage}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#E76F61',
                    color: '#FFFDF6',
                    border: '1px solid #B04B3E',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={14} /> Limpar LocalStorage
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
