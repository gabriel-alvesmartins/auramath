## Context

Veja `proposal.md` para a motivação e os objetivos gerais. Atualmente, o frontend Web opera como um SPA em Vite/React com lógica procedural centralizada em `@auramath/engine`. O estado de retenção reside em `localStorage` através de `gamificationEngine.ts`, mas o progresso da trilha estava desacoplado, congelando o avanço do jogador.

## Goals / Non-Goals

**Goals:**
- Implementar o mecanismo Spec-Anchored: parser de specs, auditor executável (`scripts/spec-compliance.mjs`) e teste de paridade no CI (`npm run spec:check`).
- Disponibilizar Dashboard Dev In-App na rota `/dev` (`DevComplianceView.tsx`) para inspeção de conformidade em tempo de desenvolvimento.
- Automatizar o sincronismo do backlog com GitHub Projects (`scripts/sync-github-backlog.mjs` via `gh`).
- Unificar a persistência do progresso da trilha no `gamificationEngine` para permitir que o usuário avance normalmente nó a nó.
- Corrigir a divergência de dados entre o cabeçalho e a tela de perfil.
- Implementar PRNG determinístico e calibração de 3 dificuldades em `@auramath/engine`.
- Remover resquícios de ideias canceladas (Chefes/Bosses, Troca de Skins, Duelo Fantasma).

**Non-Goals:**
- Atualizar ou refatorar a aplicação mobile (`apps/mobile`) nesta etapa (o app mobile permanece congelado até a consolidação da versão Web).
- Implementar infraestrutura de WebSockets ou matchmaking em tempo real para 1v1.
- Implementar as interfaces institucionais de professor e salas de aula B2B.

## Decisions

### 1. Algoritmo de PRNG Determinístico no Engine
- **Decisão**: Implementar gerador Mulberry32 de 32-bit em TypeScript puro dentro de `@auramath/engine` sem bibliotecas externas.
- **Racional**: Garante reprodutibilidade idêntica de partidas em qualquer ambiente com custo computacional nulo e sem inflar o bundle.
- **Alternativa considerada**: `seedrandom` (npm). Descartada para evitar novas dependências no monorepo.

### 2. Persistência de Progresso da Trilha Unificada
- **Decisão**: Integrar o mapa `nodeProgress: Record<string, { completed: boolean; stars: number; score: number }>` diretamente na interface `GamificationStoreState` do `gamificationEngine.ts`.
- **Racional**: Elimina a dissociação onde `App.tsx` não passava o progresso para `TrackView.tsx`. Ao concluir uma lição em `DuolingoLessonView.tsx`, `gamificationEngine.recordLessonCompletion` grava o nó e notifica os ouvintes reativamente.
- **Alternativa considerada**: Manter uma chave separada de localStorage em `TrackView`. Descartada por manter o estado fragmentado.

### 3. Mecanismo de Auditoria e Detector de Drift Spec-Anchored
- **Decisão**: O script `scripts/spec-compliance.mjs` fará o parsing direto das especificações em `openspec/specs/` procurando blocos `### Requirement:` e `#### Scenario:`, comparando-os com o manifesto de cobertura e gerando `src/data/spec-compliance.json`.
- **Racional**: Permite que a conformidade seja validada no terminal (`npm test` / CI) e lida diretamente pelo dashboard dev visual `/dev` sem overhead de servidores extras.

### 4. Integração Automatizada com GitHub Projects / Kanban
- **Decisão**: Script Node.js `scripts/sync-github-backlog.mjs` consumindo o GitHub CLI oficial (`gh`).
- **Racional**: O `gh` já gerencia credenciais e tokens do usuário de forma segura, permitindo criar issues com labels sem exigir hardcode de tokens no repositório.

## Risks / Trade-offs

- **[Risco] Quebra dos testes legados de theming R1 que exigiam `#0B0F19`** → *Mitigação*: Atualizar as asserções de `test/e2e/r1-foundations-theming.test.mjs` para refletir a paleta normativa pós-rebrand (`Paper` `#F7F4EA` e `Mineral Ink` `#202522`).
- **[Risco] Usuário sem login no `gh` no momento de rodar `npm run spec:sync`** → *Mitigação*: O script captura a ausência de autenticação e exibe orientações passo a passo para `gh auth login`.
