## Why

O projeto AuraMath sofreu uma divergência crítica entre as especificações normativas (`openspec/specs/`) e a implementação pós-rebrand (eliminação de pretos cósmicos e transição para a metáfora do "Caderno Editorial de Descoberta"). Além de funcionalidades inteiras de retenção existirem no código sem nenhuma documentação (apostas, congelamentos, resgates, ligas semanais, baús com raridade e nudges), o código apresenta bugs graves (avanço da trilha congelado no nó 1, streaks hardcoded e duelos iniciando na rodada 2). Esta mudança estabelece a metodologia **Spec-Anchored**, reconcilia todas as especificações com as decisões aprovadas de produto, remove ideias canceladas (Chefes/Bosses, Troca de Skins, Duelo Fantasma) e implementa ferramentas vivas de conformidade (Dashboard Dev `/dev` e sincronização automática com GitHub Projects).

## What Changes

- **Trilha de Aprendizado**: Adota formalmente os 7 Graus no currículo (Graus I a VII com ementa detalhada); padroniza baterias de 10 a 20 questões procedurais com 3 níveis de dificuldade (1★ Fácil, 2★ Médio, 3★ Difícil); exige 3 a 5 andaimes por nó; institui retenção mandatória onde aproveitamento $< 80\%$ impede o avanço para o nó seguinte.
- **Modos de Jogo**:
  - **REMOÇÃO**: Exclui definitivamente o Modo Duelo Fantasma (Shadow Racing) e as Batalhas de Chefes Cognitivos (Bosses).
  - **MODIFICAÇÃO**: Corrige o Split-Screen Local para exibir a mesma equação simultânea para ambos os jogadores; implementa o Desafio Diário (Mathle) com 20 questões diárias via semente UTC e resumo sem spoilers em grid de emojis (🟩🟨🟥); marca 1v1 Online Realtime como fase futura.
- **Motor Matemático**:
  - Implementa determinismo por semente (PRNG) em `packages/engine`.
  - Retifica o módulo Fermi para aproximação pura por ordens de grandeza (sem gabarito de produto exato).
  - Unifica a Prova dos Nove e dos Onze como módulo pedagógico do Grau VI dentro do mesmo motor `@auramath/engine` (sem motor de backend separado).
  - Marca Auditoria Anti-Cheat como fase futura.
- **Gamificação Sensorial e Retenção**:
  - **REMOÇÃO**: Exclui definitivamente o catálogo e a troca de skins do mascote Aura.
  - **NOVA DOCUMENTAÇÃO**: Documenta formalmente os 6 pilares de retenção comportamental implementados no motor: *Streak Wagers*, *Streak Freezes*, *Rescue Tasks*, *Ligas Semanais* (5 tiers), *Baús de Descoberta* (4 raridades) e *Quests Comunitárias & Aura Nudges*.
  - Mantém o teclado gestual (*Flick Numpad*) como pendente de implementação.
- **Design System e Interface**:
  - Oficializa 4 abas ativas na navegação (Trilha, Treino, Duelos, Perfil).
  - Normatiza a paleta de rebrand (`Paper` `#F7F4EA`, `Cream` `#FFFDF6`, `Mineral Ink` `#202522`, `Verdigris` `#176B5B`, `Marigold` `#F2B84B`, `Iris` `#6E5AA6`, `Coral` `#E76F61`).
  - Remove o símbolo Delta obsoleto do cabeçalho.
  - Sincroniza dados do cabeçalho com a tela de perfil através do `gamificationEngine`.
  - Descongela a progressão da trilha persistindo o progresso de nós concluídos.
- **Módulo Escolar B2B**: Marca formalmente como postergado (backlog institucional futuro).
- **Ferramental Spec-Anchored**:
  - Cria a skill `.agents/skills/spec-anchored/SKILL.md`.
  - Cria o auditor executável `scripts/spec-compliance.mjs` (comando `npm run spec:check`).
  - Cria o Dashboard Dev In-App na rota `/dev` (`src/views/DevComplianceView.tsx`).
  - Cria o script de sincronização automatizada com o GitHub Projects / Kanban (`scripts/sync-github-backlog.mjs` via `npm run spec:sync`).

## Capabilities

### Modified Capabilities
- `learning-track`: Atualiza para 7 Graus normativos com ementa detalhada, baterias de 10 a 20 questões em 3 dificuldades (1★, 2★, 3★), 3 a 5 andaimes e regra de retenção para $< 80\%$.
- `game-modes`: Remove Shadow Racing e Bosses; retifica Split-Screen simétrico e Desafio Diário com 20 questões e emojis; posterga 1v1 realtime.
- `math-engine`: Adiciona PRNG com semente; retifica Fermi para ordem de grandeza pura; unifica Prova dos 9/11 no Grau VI; posterga anti-cheat.
- `sensory-gamification`: Remove skins; documenta os 6 pilares de retenção reais (Wagers, Freezes, Rescue, Ligas, Baús, Nudges); mantém Flick numpad pendente.
- `ui-design-system`: Oficializa 4 abas, paleta Paper/Verdigris/Mineral Ink e remove símbolo Delta.
- `classroom-b2b`: Marca formalmente como módulo postergado para fases posteriores.

## Impact

- **Código Afetado**: `packages/engine` (PRNG, geradores em 3 dificuldades, remoção de skins/bosses, Fermi puro), `src/services/gamificationEngine.ts` (persistência de progresso de nós), `src/views/TrackView.tsx`, `src/views/DuolingoLessonView.tsx`, `src/views/DuelHubView.tsx`, `src/views/ProfileHubView.tsx`, `src/App.tsx`.
- **Testes Afetados**: Limpeza de testes de skins e bosses; inclusão de testes contratuais de paridade (`npm run spec:check`).
- **Dependências**: Nenhuma dependência externa pesada adicionada; scripts em Node.js puro utilizando GitHub CLI (`gh`).
