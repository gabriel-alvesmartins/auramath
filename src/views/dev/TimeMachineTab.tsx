import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Zap, Shield, Sparkles, AlertTriangle,
  RotateCcw, CheckCircle2, Trophy, Sun, Moon
} from 'lucide-react';
import { gamificationEngine } from '../../services/gamificationEngine';
import { audioSynth } from '../../services/audioSynth';

export const TimeMachineTab: React.FC = () => {
  const [gamState, setGamState] = useState(() => gamificationEngine.getState());
  const [simulatedOffsetDays, setSimulatedOffsetDays] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    return gamificationEngine.subscribe((next) => {
      setGamState(next);
    });
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Simulate passing days without practice
  const handleFastForwardDays = (days: number) => {
    const nextOffset = simulatedOffsetDays + days;
    setSimulatedOffsetDays(nextOffset);

    // Manipulate streak state
    const current = gamificationEngine.getState();
    const streak = { ...current.streak };

    if (days >= 1) {
      if (streak.freezesAvailable > 0) {
        streak.freezesAvailable = Math.max(0, streak.freezesAvailable - 1);
        triggerFeedback(`Avanço de +${days}d: 1 Streak Freeze foi consumido para proteger a ofensiva!`);
      } else {
        streak.current = 0;
        triggerFeedback(`Avanço de +${days}d: Sem freezes disponíveis! Ofensiva zerada.`);
      }
    }

    try {
      const raw = localStorage.getItem('auramath_gamification');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.streak = streak;
        localStorage.setItem('auramath_gamification', JSON.stringify(parsed));
      }
    } catch {}

    audioSynth.playKeypressTick();
  };

  const handleResetTimeWarp = () => {
    setSimulatedOffsetDays(0);
    const raw = localStorage.getItem('auramath_gamification');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        parsed.streak.current = Math.max(1, parsed.streak.current || 7);
        parsed.streak.freezesAvailable = 2;
        parsed.streak.lastActiveDate = new Date().toISOString();
        localStorage.setItem('auramath_gamification', JSON.stringify(parsed));
      } catch {}
    }
    triggerFeedback('Máquina do Tempo reiniciada para o presente.');
    audioSynth.playKeypressTick();
  };

  const handleTriggerAchievement = () => {
    const achievements = gamState.achievements || [];
    const target = achievements[0] || {
      id: 'FIRST_INSIGHT',
      title: 'Primeira Revelação',
      description: 'Dominou o primeiro nó sem armar conta no papel.',
      icon: 'sparkles',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    };

    try {
      const raw = localStorage.getItem('auramath_gamification');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.recentlyUnlockedAchievement = target;
        localStorage.setItem('auramath_gamification', JSON.stringify(parsed));
        gamificationEngine.getState(); // Trigger update
      }
    } catch {}

    audioSynth.playVictoryFanfare();
    triggerFeedback('Modal de Conquista acionado!');
  };

  const handleTriggerNudge = () => {
    gamificationEngine.triggerRandomNudge();
    audioSynth.playKeypressTick();
    triggerFeedback('Toast de Incentivo do Mascote acionado!');
  };

  const handleAddFreeze = () => {
    gamificationEngine.buyStreakFreeze(0);
    audioSynth.playKeypressTick();
    triggerFeedback('+1 Streak Freeze adicionado ao inventário.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
            <Calendar size={18} color="#176B5B" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#202522' }}>
              Máquina do Tempo & Simulador de Retenção (Octalysis)
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5C645F' }}>
            Teste comportamentos temporais de Streak, consumo de congelamentos e ciclos circadianos sem tocar no relógio do SO.
          </p>
        </div>

        {feedbackMsg && (
          <div
            style={{
              backgroundColor: '#DCEBE5',
              border: '1.5px solid #176B5B',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#176B5B',
            }}
          >
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Main Grid: Temporal Controls + Retention Triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Time Travel Jumps */}
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
              Saltos Temporais Rápidos
            </div>
            <span
              style={{
                backgroundColor: '#F7F4EA',
                border: '1px solid #D9D5C8',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#5C645F',
              }}
            >
              Offset: +{simulatedOffsetDays} dias
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleFastForwardDays(1)}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #202522',
                boxShadow: '0 3px 0 #202522',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Clock size={16} color="#176B5B" />
              <span>+1 Dia (Amanhã)</span>
            </button>

            <button
              onClick={() => handleFastForwardDays(3)}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #202522',
                boxShadow: '0 3px 0 #202522',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Clock size={16} color="#176B5B" />
              <span>+3 Dias</span>
            </button>

            <button
              onClick={() => handleFastForwardDays(7)}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #202522',
                boxShadow: '0 3px 0 #202522',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Calendar size={16} color="#6E5AA6" />
              <span>+7 Dias (1 Semana)</span>
            </button>

            <button
              onClick={() => handleFastForwardDays(30)}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #202522',
                boxShadow: '0 3px 0 #202522',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Calendar size={16} color="#E76F61" />
              <span>+30 Dias (1 Mês)</span>
            </button>
          </div>

          <button
            onClick={handleResetTimeWarp}
            style={{
              padding: '10px',
              backgroundColor: '#F7F4EA',
              border: '1.5px solid #D9D5C8',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: '#5C645F',
            }}
          >
            <RotateCcw size={14} />
            <span>Resetar Máquina do Tempo (Voltar ao Presente)</span>
          </button>

          {/* Current State Quick Card */}
          <div
            style={{
              backgroundColor: '#F7F4EA',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
              fontSize: '0.78rem',
            }}
          >
            <div>
              <div style={{ color: '#5C645F', fontWeight: 600 }}>Ofensiva Atual</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#E76F61' }}>
                {gamState.streak.current} dias
              </div>
            </div>
            <div>
              <div style={{ color: '#5C645F', fontWeight: 600 }}>Freezes Disponíveis</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#176B5B' }}>
                {gamState.streak.freezesAvailable || 0}
              </div>
            </div>
            <div>
              <div style={{ color: '#5C645F', fontWeight: 600 }}>Estrelas Totais</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F2B84B' }}>
                {gamState.stars} ★
              </div>
            </div>
          </div>
        </div>

        {/* Right: Modals & Circumstantial Triggers */}
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
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#202522' }}>
            Disparadores Forçados de Modais
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleTriggerAchievement}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #F2B84B',
                boxShadow: '0 3px 0 #F2B84B',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#202522',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <Trophy size={18} color="#F2B84B" />
              <span>Forçar Modal de Conquista Desbloqueada</span>
            </button>

            <button
              onClick={handleTriggerNudge}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #176B5B',
                boxShadow: '0 3px 0 #176B5B',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#202522',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={18} color="#176B5B" />
              <span>Forçar Toast de Incentivo do Mascote</span>
            </button>

            <button
              onClick={handleAddFreeze}
              style={{
                padding: '12px',
                backgroundColor: '#FFFDF6',
                border: '2px solid #6E5AA6',
                boxShadow: '0 3px 0 #6E5AA6',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#202522',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <Shield size={18} color="#6E5AA6" />
              <span>Adicionar +1 Streak Freeze ao Inventário</span>
            </button>
          </div>

          {/* Circadian Chests Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #EAE6DB' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase' }}>
              Ciclos Circadianos (Baús Diários):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#F7F4EA',
                  borderRadius: '8px',
                  border: '1px solid #D9D5C8',
                  fontSize: '0.74rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#F2B84B' }}>
                  <Sun size={13} />
                  <span>Madrugador (06h–12h)</span>
                </div>
                <div style={{ color: '#5C645F', marginTop: '2px' }}>+15min Multiplicador XP</div>
              </div>

              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#F7F4EA',
                  borderRadius: '8px',
                  border: '1px solid #D9D5C8',
                  fontSize: '0.74rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#6E5AA6' }}>
                  <Moon size={13} />
                  <span>Notívago (18h–24h)</span>
                </div>
                <div style={{ color: '#5C645F', marginTop: '2px' }}>Fixação Sináptica Noturna</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
