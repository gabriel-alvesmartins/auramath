import React from 'react';
import { Trophy, Clock, ArrowUp, ArrowDown, Minus, Shield, Sparkles, ChevronUp } from 'lucide-react';
import { WeeklyLeagueState, LeagueParticipant, getLeagueZone, LEAGUE_TIER_CONFIG } from '../../engine';

export interface LeagueLeaderboardViewProps {
  leagueState: WeeklyLeagueState;
}

export const LeagueLeaderboardView: React.FC<LeagueLeaderboardViewProps> = ({ leagueState }) => {
  const tierConfig = LEAGUE_TIER_CONFIG[leagueState.tier] || LEAGUE_TIER_CONFIG.papiro;

  return (
    <div
      style={{
        padding: '16px',
        paddingBottom: '96px',
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
      }}
    >
      {/* 1. Header with Division Shield & Countdown */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '20px 18px',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
            border: '1px solid var(--color-verdigris, #176B5B)',
            marginBottom: '10px',
          }}
        >
          <Trophy size={14} color="var(--color-verdigris, #176B5B)" />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--color-verdigris, #176B5B)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            DIVISÃO SEMANAL
          </span>
        </div>

        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: '0 0 6px',
            color: 'var(--color-text-primary, #202522)',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
          }}
        >
          {tierConfig.name}
        </h1>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--color-ink-secondary, #5C645F)',
            margin: '0 0 14px',
            lineHeight: 1.35,
          }}
        >
          Você está competindo com 29 exploradores de ritmo similar. O top 7 avança para a próxima divisão!
        </p>

        {/* Reset Countdown Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--color-ink, #202522)',
          }}
        >
          <Clock size={14} color="var(--color-marigold-bevel, #D49A2E)" />
          <span>A rodada termina em <strong>3 dias e 14 horas</strong></span>
        </div>
      </div>

      {/* 2. User Standing Sticky Summary Card */}
      <div
        style={{
          backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
          border: '1.5px solid var(--color-verdigris, #176B5B)',
          boxShadow: '0 3px 0 var(--color-verdigris-bevel, #104E42)',
          borderRadius: '16px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="font-mono-tabular"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-verdigris, #176B5B)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            #{leagueState.userRank}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-ink, #202522)' }}>
              Sua Posição Atual
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-verdigris-bevel, #104E42)', fontWeight: 600 }}>
              {leagueState.userRank <= 7
                ? '✦ Na Zona de Promoção para a próxima liga!'
                : `${8 - leagueState.userRank} posições até a Zona de Promoção`}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="font-mono-tabular" style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-verdigris, #176B5B)' }}>
            {leagueState.participants.find((p) => p.isUser)?.xp || 420} XP
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 700 }}>
            NESTA SEMANA
          </div>
        </div>
      </div>

      {/* 3. Leaderboard 30-Learner Cohort List */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
          borderRadius: '24px',
          padding: '14px 12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {leagueState.participants.map((participant, index) => {
            const zone = getLeagueZone(participant.rank);
            const isUser = participant.isUser;
            const isTop3 = participant.rank <= 3;

            // Visual separation borders after rank 7 (promotion line) and rank 25 (relegation line)
            const showPromotionDivider = participant.rank === 7;
            const showRelegationDivider = participant.rank === 25;

            return (
              <React.Fragment key={participant.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: isUser
                      ? 'var(--color-verdigris-soft, #DCEBE5)'
                      : zone === 'promotion'
                      ? 'rgba(23, 107, 91, 0.05)'
                      : 'transparent',
                    border: isUser
                      ? '1.5px solid var(--color-verdigris, #176B5B)'
                      : '1px solid transparent',
                    boxShadow: isUser ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : 'none',
                    transform: isUser ? 'scale(1.01)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Rank & Participant Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      className="font-mono-tabular"
                      style={{
                        width: '24px',
                        fontSize: '0.86rem',
                        fontWeight: 900,
                        textAlign: 'center',
                        color:
                          participant.rank === 1
                            ? 'var(--color-marigold-bevel, #D49A2E)'
                            : participant.rank === 2
                            ? '#8A938E'
                            : participant.rank === 3
                            ? '#C2BDAE'
                            : 'var(--color-ink-secondary, #5C645F)',
                      }}
                    >
                      {participant.rank}
                    </div>

                    {/* Avatar Initials Badge */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        backgroundColor: participant.avatarColor,
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      {participant.avatarLetter}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: isUser ? 900 : 700,
                          color: isUser ? 'var(--color-verdigris, #176B5B)' : 'var(--color-text-primary, #202522)',
                        }}
                      >
                        {participant.name}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--color-ink-secondary, #5C645F)' }}>
                        {zone === 'promotion' ? (
                          <span style={{ color: 'var(--color-verdigris, #176B5B)', fontWeight: 700 }}>
                            ▲ Zona de Promoção
                          </span>
                        ) : zone === 'relegation' ? (
                          <span style={{ color: 'var(--color-coral, #E76F61)', fontWeight: 700 }}>
                            ▼ Zona de Queda
                          </span>
                        ) : (
                          'Manutenção'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* XP Metric */}
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className="font-mono-tabular"
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: isUser ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink, #202522)',
                      }}
                    >
                      {participant.xp} XP
                    </span>
                  </div>
                </div>

                {/* Promotion Line Divider */}
                {showPromotionDivider && (
                  <div
                    style={{
                      margin: '4px 0',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                      border: '1px dashed var(--color-verdigris, #176B5B)',
                      textAlign: 'center',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: 'var(--color-verdigris, #176B5B)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ▲ ZONA DE PROMOÇÃO (TOP 7 AVANÇAM) ▲
                  </div>
                )}

                {/* Relegation Line Divider */}
                {showRelegationDivider && (
                  <div
                    style={{
                      margin: '4px 0',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-coral-soft, #F8DED9)',
                      border: '1px dashed var(--color-coral, #E76F61)',
                      textAlign: 'center',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: 'var(--color-coral, #E76F61)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ▼ ZONA DE REBAIXAMENTO (ÚLTIMOS 5) ▼
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
