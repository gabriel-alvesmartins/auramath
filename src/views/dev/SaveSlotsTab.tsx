import React, { useState } from 'react';
import {
  Database, Download, Upload, Copy, Check, RotateCcw,
  Sparkles, Trash2, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { TRACK_GRADES } from '../../engine';
import { gamificationEngine } from '../../services/gamificationEngine';
import { audioSynth } from '../../services/audioSynth';

export const SaveSlotsTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const applyPreset = (preset: 'beginner' | 'intermediate' | 'veteran' | 'master') => {
    if (preset === 'beginner') {
      localStorage.removeItem('auramath_node_progress');
      localStorage.setItem('auramath_onboarded', 'true');
      localStorage.setItem(
        'auramath_gamification',
        JSON.stringify({
          xp: 0,
          stars: 0,
          weeklyXp: 0,
          streak: { current: 1, highest: 1, freezesAvailable: 1, lastActiveDate: new Date().toISOString() },
          circadianChests: {
            earlyBird: { id: 'early_bird', title: 'Baú Matinal', availableFromHour: 6, availableToHour: 12, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
            nightOwl: { id: 'night_owl', title: 'Baú Noturno', availableFromHour: 18, availableToHour: 24, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
          },
          league: { tier: 'papiro', tierName: 'Liga Papiro', cohortId: 'cohort-1', userRank: 15, participants: [] },
          achievements: [],
          recentlyUnlockedAchievement: null,
          activeNudge: null,
          nodeProgress: {},
        })
      );
      notify('Preset "Aluno Calouro (Zero KM)" aplicado!');
    } else if (preset === 'intermediate') {
      const intermediateProgress: Record<string, any> = {};
      TRACK_GRADES.slice(0, 3).forEach((g) => {
        g.nodes.forEach((n) => {
          intermediateProgress[n.id] = { nodeId: n.id, completed: true, stars: 3, bestAccuracy: 95, completedAt: new Date().toISOString() };
        });
      });
      localStorage.setItem('auramath_node_progress', JSON.stringify(intermediateProgress));
      localStorage.setItem('auramath_onboarded', 'true');
      localStorage.setItem(
        'auramath_gamification',
        JSON.stringify({
          xp: 1850,
          weeklyXp: 540,
          stars: 42,
          streak: { current: 8, highest: 8, freezesAvailable: 2, lastActiveDate: new Date().toISOString() },
          circadianChests: {
            earlyBird: { id: 'early_bird', title: 'Baú Matinal', availableFromHour: 6, availableToHour: 12, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
            nightOwl: { id: 'night_owl', title: 'Baú Noturno', availableFromHour: 18, availableToHour: 24, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
          },
          league: { tier: 'bronze', tierName: 'Liga Bronze', cohortId: 'cohort-2', userRank: 4, participants: [] },
          achievements: [{ id: 'FIRST_INSIGHT', unlocked: true }, { id: 'TITANIUM_STREAK_7', unlocked: true }],
          recentlyUnlockedAchievement: null,
          activeNudge: null,
          nodeProgress: intermediateProgress,
        })
      );
      notify('Preset "Veterano Grau 1-3" aplicado!');
    } else if (preset === 'veteran') {
      const veteranProgress: Record<string, any> = {};
      TRACK_GRADES.slice(0, 5).forEach((g) => {
        g.nodes.forEach((n) => {
          veteranProgress[n.id] = { nodeId: n.id, completed: true, stars: 3, bestAccuracy: 98, completedAt: new Date().toISOString() };
        });
      });
      localStorage.setItem('auramath_node_progress', JSON.stringify(veteranProgress));
      localStorage.setItem('auramath_onboarded', 'true');
      localStorage.setItem(
        'auramath_gamification',
        JSON.stringify({
          xp: 4800,
          weeklyXp: 1200,
          stars: 72,
          streak: { current: 30, highest: 30, freezesAvailable: 0, lastActiveDate: new Date().toISOString() },
          circadianChests: {
            earlyBird: { id: 'early_bird', title: 'Baú Matinal', availableFromHour: 6, availableToHour: 12, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
            nightOwl: { id: 'night_owl', title: 'Baú Noturno', availableFromHour: 18, availableToHour: 24, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
          },
          league: { tier: 'ouro', tierName: 'Liga Ouro', cohortId: 'cohort-3', userRank: 2, participants: [] },
          achievements: [{ id: 'FIRST_INSIGHT', unlocked: true }, { id: 'TITANIUM_STREAK_7', unlocked: true }],
          recentlyUnlockedAchievement: null,
          activeNudge: null,
          nodeProgress: veteranProgress,
        })
      );
      notify('Preset "Veterano Grau 1-5 (Streak em Risco)" aplicado!');
    } else if (preset === 'master') {
      const masterProgress: Record<string, any> = {};
      TRACK_GRADES.forEach((g) => {
        g.nodes.forEach((n) => {
          masterProgress[n.id] = { nodeId: n.id, completed: true, stars: 3, bestAccuracy: 100, completedAt: new Date().toISOString() };
        });
      });
      localStorage.setItem('auramath_node_progress', JSON.stringify(masterProgress));
      localStorage.setItem('auramath_onboarded', 'true');
      localStorage.setItem(
        'auramath_gamification',
        JSON.stringify({
          xp: 8500,
          weeklyXp: 2400,
          stars: 96,
          streak: { current: 60, highest: 60, freezesAvailable: 3, lastActiveDate: new Date().toISOString() },
          circadianChests: {
            earlyBird: { id: 'early_bird', title: 'Baú Matinal', availableFromHour: 6, availableToHour: 12, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
            nightOwl: { id: 'night_owl', title: 'Baú Noturno', availableFromHour: 18, availableToHour: 24, isUnlocked: true, isClaimedToday: false, boostMinutes: 15, bonusMarigoldGems: 25 },
          },
          league: { tier: 'diamante', tierName: 'Liga Diamante', cohortId: 'cohort-4', userRank: 1, participants: [] },
          achievements: [{ id: 'FIRST_INSIGHT', unlocked: true }, { id: 'TITANIUM_STREAK_7', unlocked: true }],
          recentlyUnlockedAchievement: null,
          activeNudge: null,
          nodeProgress: masterProgress,
        })
      );
      notify('Preset "Mestre Grau 1-7 (100% Dominado)" aplicado!');
    }

    gamificationEngine.getState(); // refresh
    audioSynth.playVictoryFanfare();
  };

  const handleExportJson = () => {
    const dump: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('auramath')) {
        dump[k] = localStorage.getItem(k);
      }
    }
    const jsonStr = JSON.stringify(dump, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    notify('Snapshot copiado para a área de transferência!');
  };

  const handleImportJson = () => {
    if (!importJson.trim()) {
      notify('Por favor, cole um JSON válido primeiro.', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(importJson);
      Object.keys(parsed).forEach((k) => {
        if (k.startsWith('auramath')) {
          localStorage.setItem(k, typeof parsed[k] === 'string' ? parsed[k] : JSON.stringify(parsed[k]));
        }
      });
      gamificationEngine.getState();
      audioSynth.playVictoryFanfare();
      notify('Snapshot importado com sucesso!');
      setImportJson('');
    } catch {
      notify('Erro ao processar JSON: formato inválido.', 'error');
    }
  };

  const handleClearAll = () => {
    if (confirm('Atenção: Isso limpará todos os dados do LocalStorage do AuraMath. Continuar?')) {
      localStorage.clear();
      gamificationEngine.getState();
      audioSynth.playKeypressTick();
      notify('LocalStorage limpo.');
    }
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
            <Database size={18} color="#176B5B" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#202522' }}>
              Save Slots & LocalStorage Vault
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5C645F' }}>
            Alterne entre perfis de teste ou exporte/importe snapshots completos de sessão em 1 clique.
          </p>
        </div>

        {statusMsg && (
          <div
            style={{
              backgroundColor: statusMsg.type === 'success' ? '#DCEBE5' : '#F8DED9',
              border: statusMsg.type === 'success' ? '1.5px solid #176B5B' : '1.5px solid #E76F61',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: statusMsg.type === 'success' ? '#176B5B' : '#BA1A1A',
            }}
          >
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* Main Grid: Presets + JSON Importer/Exporter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: 4 Preset Profiles */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '1px solid #D9D5C8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 0 #C2BDAE',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#202522' }}>
            Perfis de Teste (1 Clique)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => applyPreset('beginner')}
              style={{
                padding: '12px 14px',
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #D9D5C8',
                boxShadow: '0 2px 0 #C2BDAE',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#202522' }}>
                1. Aluno Calouro (Zero KM)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#5C645F', marginTop: '2px' }}>
                Onboarded, 0 nós completados, 0 XP, Streak 1 dia, 1 freeze.
              </div>
            </button>

            <button
              onClick={() => applyPreset('intermediate')}
              style={{
                padding: '12px 14px',
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #176B5B',
                boxShadow: '0 2px 0 #176B5B',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#176B5B' }}>
                2. Veterano Graus 1–3
              </div>
              <div style={{ fontSize: '0.74rem', color: '#5C645F', marginTop: '2px' }}>
                1.850 XP, 42 estrelas, Streak 8 dias, 2 freezes, Graus 1 a 3 100% dominados.
              </div>
            </button>

            <button
              onClick={() => applyPreset('veteran')}
              style={{
                padding: '12px 14px',
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #E76F61',
                boxShadow: '0 2px 0 #E76F61',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#E76F61' }}>
                3. Veterano Graus 1–5 (Streak em Risco)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#5C645F', marginTop: '2px' }}>
                4.800 XP, 72 estrelas, Streak 30 dias com 0 freezes (crítico).
              </div>
            </button>

            <button
              onClick={() => applyPreset('master')}
              style={{
                padding: '12px 14px',
                backgroundColor: '#FFFDF6',
                border: '1.5px solid #F2B84B',
                boxShadow: '0 2px 0 #F2B84B',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#8A5800' }}>
                4. Mestre Graus 1–7 (100% Dominado)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#5C645F', marginTop: '2px' }}>
                8.500 XP, 96 estrelas, Streak 60 dias, 3 freezes, todos os 42 nós 3★.
              </div>
            </button>
          </div>

          <button
            onClick={handleClearAll}
            style={{
              marginTop: '6px',
              padding: '10px',
              backgroundColor: '#F8DED9',
              border: '1.5px solid #E76F61',
              borderRadius: '8px',
              color: '#BA1A1A',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>Limpar Todo o LocalStorage (Reset Completo)</span>
          </button>
        </div>

        {/* Right: Export & Import JSON */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '1px solid #D9D5C8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 0 #C2BDAE',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#202522' }}>
              Snapshot JSON (Exportar / Importar)
            </div>
            <button
              onClick={handleExportJson}
              style={{
                padding: '6px 12px',
                backgroundColor: '#DCEBE5',
                border: '1px solid #176B5B',
                borderRadius: '6px',
                color: '#176B5B',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copiado!' : 'Exportar Snapshot'}</span>
            </button>
          </div>

          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Cole aqui o JSON de um snapshot para restaurar o estado..."
            rows={8}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #D9D5C8',
              fontFamily: 'monospace',
              fontSize: '0.74rem',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />

          <button
            onClick={handleImportJson}
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
            <Upload size={16} color="#176B5B" />
            <span>Restaurar / Importar Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
