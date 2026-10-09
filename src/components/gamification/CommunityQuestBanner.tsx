import React from 'react';
import { Users, Award, Sparkles, Clock } from 'lucide-react';
import { CommunityQuestState } from '../../engine';

export interface CommunityQuestBannerProps {
  quest: CommunityQuestState;
}

export const CommunityQuestBanner: React.FC<CommunityQuestBannerProps> = ({ quest }) => {
  const percent = Math.min(100, Math.round((quest.currentTotal / quest.targetTotal) * 100));

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
        border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
        boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-iris-soft, #E8E3F3)',
              border: '1px solid var(--color-iris, #6E5AA6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={14} color="var(--color-iris, #6E5AA6)" />
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--color-iris, #6E5AA6)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            DESAFIO COMUNITÁRIO GLOBAL
          </span>
        </div>

        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--color-ink-secondary, #5C645F)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Clock size={12} />
          {quest.deadline}
        </span>
      </div>

      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 800,
          margin: '0 0 4px',
          color: 'var(--color-text-primary, #202522)',
          fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
        }}
      >
        {quest.title}
      </h3>

      <p
        style={{
          fontSize: '0.76rem',
          color: 'var(--color-ink-secondary, #5C645F)',
          margin: '0 0 12px',
          lineHeight: 1.35,
        }}
      >
        {quest.tagline}
      </p>

      {/* Collective Progress Bar */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, marginBottom: '4px' }}>
          <span style={{ color: 'var(--color-ink, #202522)' }}>
            {quest.currentTotal.toLocaleString('pt-BR')} / {quest.targetTotal.toLocaleString('pt-BR')} padrões
          </span>
          <span className="font-mono-tabular" style={{ color: 'var(--color-verdigris, #176B5B)' }}>
            {percent}%
          </span>
        </div>

        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              backgroundColor: 'var(--color-verdigris, #176B5B)',
              borderRadius: '6px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* User Contribution Footnote */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '6px',
          borderTop: '1px dashed var(--color-border-subtle, #D9D5C8)',
          fontSize: '0.7rem',
        }}
      >
        <span style={{ color: 'var(--color-ink-secondary, #5C645F)' }}>
          Sua contribuição: <strong style={{ color: 'var(--color-verdigris, #176B5B)' }}>{quest.userContribution} padrões</strong>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-marigold-bevel, #D49A2E)', fontWeight: 700 }}>
          <Award size={13} />
          <span>{quest.rewardBadgeTitle}</span>
        </div>
      </div>
    </div>
  );
};
