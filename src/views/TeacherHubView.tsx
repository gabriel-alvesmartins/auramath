import React from 'react';
import { MOCK_CLASSROOMS, MOCK_ASSIGNMENTS } from '../engine';

export function TeacherHubView() {
  const classroom = MOCK_CLASSROOMS[0];

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#8A2BE2', fontWeight: 800 }}>PAINEL INSTITUCIONAL</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0' }}>{classroom.name}</h3>
        </div>
        <div style={{
          backgroundColor: 'rgba(138, 43, 226, 0.15)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          borderRadius: '10px',
          padding: '6px 12px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>CÓDIGO DE CONVITE</span>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#C084FC', fontSize: '1.1rem' }}>
            {classroom.inviteCode}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '20px'
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
          Mapa de Calor de Pontos Cegos Cognitivos
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classroom.blindSpots.map((bs, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span>{bs.technique}</span>
                <span style={{ color: bs.errorRate >= 30 ? '#FB7185' : '#FACC15', fontWeight: 700 }}>
                  {bs.errorRate}% taxa de erro ({bs.averageLatencyMs}ms)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${bs.errorRate}%`,
                  height: '100%',
                  backgroundColor: bs.errorRate >= 30 ? '#FB7185' : '#FACC15'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.9)', borderRadius: '20px', padding: '18px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Tarefas Pedagógicas Agendadas</h4>
        {MOCK_ASSIGNMENTS.map(assign => (
          <div key={assign.id} style={{
            backgroundColor: 'rgba(19, 25, 38, 0.8)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{assign.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Prazo: {assign.dueDate} • {assign.requiredQuestions} questões</div>
            </div>
            <div style={{ color: '#00F2FE', fontWeight: 700, fontSize: '0.85rem' }}>
              {assign.completionRate}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

