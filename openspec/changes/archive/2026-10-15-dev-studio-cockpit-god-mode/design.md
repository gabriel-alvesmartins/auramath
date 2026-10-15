## Context

Atualmente o painel de desenvolvimento do AuraMath reside de forma monolítica em `src/views/DevComplianceView.tsx` (cerca de 1.900 linhas), cobrindo prioritariamente métricas estáticas de conformidade Spec-Anchored e o backlog do GitHub.
Ver `proposal.md` para a motivação completa.

## Goals / Non-Goals

**Goals:**
- Prover um **In-Game God Mode HUD** (`AuraDevHud.tsx`) desacoplado, que se comunica com lições e telas ativas via barramento leve de eventos DOM (`CustomEvent`).
- Modularizar o painel `/dev` em abas especializadas sob `src/views/dev/` (Diagram Studio, Sensory Lab, Prisma Theater, Time Machine, Save Slots).
- Garantir impacto zero no bundle de produção através de flags de ambiente (`import.meta.env.DEV`) e isolamento de rotas.
- Manter 100% dos testes existentes verdes e conformidade Spec-Anchored ativa.

**Non-Goals:**
- Alterar as regras matemáticas de produção do `@auramath/engine`.
- Introduzir dependências pesadas externas de UI/Storybook.
- Substituir ferramentas de CI ou testes E2E do Node.js.

## Decisions

### 1. Comunicação HUD ➔ Telas via Custom Events do DOM
- **Decisão**: Utilizar `window.dispatchEvent(new CustomEvent('auramath:dev-action', { detail: { action, ... } }))` e listeners correspondentes em `DuolingoLessonView`.
- **Alternativa Considerada**: Criar um React Context global (`DevContext`). Rejeitado para evitar re-renderizações desnecessárias na árvore inteira e não poluir componentes de produção com providers extras.
- **Vantagem**: O HUD pode disparar `SOLVE_CORRECT`, `FORCE_WRONG` ou `SKIP_LESSON` sem precisar ter acesso direto aos estados internos da lição.

### 2. Modularização de Abas em `src/views/dev/`
- **Decisão**: Decompor o monólito `DevComplianceView.tsx` em submódulos:
  - `DiagramStudioTab.tsx`: isolamento dos 5 diagramas com seletor de expressão e passo a passo.
  - `SensoryLabTab.tsx`: soundboard pentatônico Web Audio e mixer de 3 canais Lofi.
  - `PrismaTheaterTab.tsx`: palco interativo Rive/SVG com controle de velocidade e estados.
  - `TimeMachineTab.tsx`: simulação de data/streak no LocalStorage e disparo de modais.
  - `SaveSlotsTab.tsx`: exportação/importação e presets de usuário.
- **Alternativa Considerada**: Manter tudo dentro de um único arquivo. Rejeitado por dificultar manutenção, leitura e extensão.

### 3. Simulação Temporal via Modificação Direta de `lastActiveDate`
- **Decisão**: A Máquina do Tempo manipula o campo `lastActiveDate` em `auramath_gamification` e notifica o `gamificationEngine`, em vez de fazer monkey-patching em `Date.now()`.
- **Alternativa Considerada**: Sobrescrever `Date` globalmente. Rejeitado por causar efeitos colaterais imprevisíveis em timers do React, Web Audio e animações CSS.

### 4. Régua Ergonômica de Thumb Zone
- **Decisão**: Componente `ThumbZoneOverlay.tsx` renderizado com `pointer-events: none` contendo canvas ou SVG com gradiente translúcido demarcando o limite de 430px e a elipse de conforto do polegar.

## Risks / Trade-offs

- **[Vazamento para o Bundle de Produção]** → Mitigado: No `App.tsx`, o `AuraDevHud` só é importado dinamicamente ou condicionado a `import.meta.env.DEV` e parâmetros de hash/rota.
- **[Bloqueio de Autoplay no Web Audio]** → Mitigado: O Sensory Lab e o HUD incluem detecção do estado `audioContext.state === 'suspended'` com botão explícito de "Desbloquear Áudio".
- **[Dessincronização de Estado na Lição com Auto-Solve]** → Mitigado: O evento do HUD utiliza o mesmo ciclo de vida dos botões táteis originais (`onVerify` e `onContinue`), preservando o fluxo de scoring e telemetria.
