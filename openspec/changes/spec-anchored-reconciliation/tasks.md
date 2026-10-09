## 1. Motor Matemático Procedural

- [x] 1.1 Implementar PRNG determinístico (Mulberry32) em `packages/engine/src/index.ts` e verificar consistência idêntica com mesma semente.
- [x] 1.2 Atualizar `generateDailyQuestions` para consumir a data como semente e verificar geração de 20 questões procedurais diárias sem repetição estática.
- [x] 1.3 Adicionar parâmetro de 3 níveis de dificuldade (Fácil, Médio, Difícil) aos geradores dos Graus I a VII e verificar calibração de operandos.
- [x] 1.4 Retificar `generateFermiQuestion` para aproximação por ordem de grandeza pura sem exigir o cálculo exato e verificar alternativas em potências de 10.
- [x] 1.5 Implementar gerador pedagógico de raízes digitais (Prova dos 9 e dos 11) para o Grau VI em `@auramath/engine` e verificar resolução de congruência.
- [x] 1.6 Remover `AURA_SKINS` e referências obsoletas a bosses/chefes em `packages/engine` e verificar compilação via `npm run build --workspace=@auramath/engine`.

## 2. Persistência de Trilha e Sincronização de Estado

- [x] 2.1 Adicionar persistência de `nodeProgress` no `gamificationEngine.ts` com métodos `completeTrackNode` e `isNodeUnlocked` e verificar armazenamento no `localStorage`.
- [x] 2.2 Conectar `TrackView.tsx` reativamente ao `nodeProgress` do `gamificationEngine` e verificar desbloqueio contínuo de nós completados.
- [x] 2.3 Atualizar `DuolingoLessonView.tsx` para suportar 10 a 20 questões, remover streaks hardcoded (19) e aplicar regra de retenção mandatória (< 80%).
- [x] 2.4 Corrigir `ProfileHubView.tsx` para sincronizar ofensiva, estrelas e XP com `gamificationEngine` e verificar paridade com os valores do cabeçalho.
- [x] 2.5 Corrigir `DuelHubView.tsx`: iniciar Duelo ao Vivo em 0x0 na rodada 1; sincronizar Split-Screen com a mesma questão simultânea; conectar Desafio Diário com 20 questões e cópia de resumo em emojis.
- [x] 2.6 Remover o símbolo Delta obsoleto em `EditorialHeader.tsx` e unificar cabeçalho no `App.tsx`.

## 3. Infraestrutura Spec-Anchored e Automação

- [x] 3.1 Criar a skill `.agents/skills/spec-anchored/SKILL.md` com diretrizes anti-drift e padrões normativos para o agente.
- [x] 3.2 Desenvolver o script auditor `scripts/spec-compliance.mjs` que analisa `openspec/specs/` e gera `src/data/spec-compliance.json`.
- [x] 3.3 Desenvolver o Dashboard Dev In-App `src/views/DevComplianceView.tsx` na rota `/dev` e verificar renderização do radar de conformidade.
- [x] 3.4 Implementar o script `scripts/sync-github-backlog.mjs` para criar e atualizar tarefas automaticamente no GitHub Projects via `gh` CLI.
- [x] 3.5 Adicionar os comandos `"spec:check"` e `"spec:sync"` no `package.json` e integrá-los ao fluxo de verificação.

## 4. Verificação Final e Testes

- [x] 4.1 Atualizar testes de theming legados em `test/e2e/r1-foundations-theming.test.mjs` para a paleta Paper/Verdigris oficial e executar `npm test`.
- [x] 4.2 Executar auditoria de paridade via `npm run spec:check` e confirmar conformidade total sem drift.
- [x] 4.3 Executar build de produção via `npx vite build` e confirmar compilação e empacotamento sem erros.
