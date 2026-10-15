import React from 'react';

export interface ThumbZoneOverlayProps {
  visible: boolean;
  opacity?: number; // 0.1 to 1.0
  showZones?: boolean;
}

/**
 * ThumbZoneOverlay
 * Ferramenta visual do AuraMath Dev Studio para inspecionar ergonomia móvel.
 * - Delimita o container soberano de 430px (Thumb Zone rígida)
 * - Mapeia os arcos de alcance do polegar:
 *   - Zona Natural (Verdigris #176B5B): alcance imediato a 0 esforço
 *   - Zona Confortável (Marigold #F2B84B): alcance com leve rotação
 *   - Zona de Estiramento (Coral #E76F61): topo de tela (evitar ações primárias)
 */
export const ThumbZoneOverlay: React.FC<ThumbZoneOverlayProps> = ({
  visible,
  opacity = 0.25,
  showZones = true,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transition: 'opacity 150ms ease',
      }}
    >
      {/* 430px Frame Boundary Guide */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          borderLeft: '2px dashed #176B5B',
          borderRight: '2px dashed #176B5B',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: Hard Reach Area (Stretch Zone) */}
        <div
          style={{
            height: '18%',
            backgroundColor: showZones ? 'rgba(231, 111, 97, 0.18)' : 'transparent',
            borderBottom: '1px dashed #E76F61',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#E76F61',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span>Zona de Estiramento (Hard Reach)</span>
          <span>430px Max</span>
        </div>

        {/* Center: Neutral Cognitive Zone */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(32, 37, 34, 0.4)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <span>Área de Foco Visual (80/20)</span>
        </div>

        {/* Bottom: Natural Thumb Reach & Action Anchor */}
        <div
          style={{
            height: '240px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ergonomic Natural Reach Arcs (Right & Left Hand) */}
          {showZones && (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 430 240"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0 }}
            >
              {/* Natural Reach Arc (Right Thumb) */}
              <ellipse
                cx="390"
                cy="230"
                rx="280"
                ry="180"
                fill="rgba(23, 107, 91, 0.22)"
                stroke="#176B5B"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Natural Reach Arc (Left Thumb) */}
              <ellipse
                cx="40"
                cy="230"
                rx="280"
                ry="180"
                fill="rgba(23, 107, 91, 0.12)"
                stroke="#176B5B"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>
          )}

          {/* Action Button Anchor Line (onde VERIFICAR / CONTINUAR devem nascer) */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              height: '56px',
              border: '2px solid #176B5B',
              borderRadius: '16px',
              backgroundColor: 'rgba(23, 107, 91, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800,
              color: '#176B5B',
              letterSpacing: '0.04em',
            }}
          >
            ÂNCORA TÁTIL 0ms (VERIFICAR / CONTINUAR)
          </div>
        </div>
      </div>
    </div>
  );
};
