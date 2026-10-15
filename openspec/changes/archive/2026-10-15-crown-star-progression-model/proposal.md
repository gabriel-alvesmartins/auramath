## Why

Atualmente, a tela de lição (`DuolingoLessonView.tsx`) exibe um seletor manual com três botões de dificuldade (`[★ Fácil]`, `[★★ Médio]`, `[★★★ Difícil]`) dentro do drill de agilidade, e a vitória calcula de 1 a 3 estrelas baseado na acurácia percentual de uma única sessão (`accuracy >= 95 ? 3 : 2 : 1`). Esse comportamento contradiz o modelo mental de maestria em espiral consagrado pelo Duolingo (*Crown System*), onde as 3 estrelas representam os **3 níveis/estágios de consolidação do próprio nó**:
1. O usuário não deve escolher o nível de dificuldade dentro da lição; a dificuldade é intrínseca ao estágio atual do nó (`0★ -> Fácil`, `1★ -> Médio`, `2★ -> Difícil`).
2. No 1º contato (0 estrelas), o aluno necessita de ancoragem profunda (Teoria Teórica + Andaimes Cognitivos + Agilidade Fácil).
3. Nos níveis subsequentes (2ª e 3ª estrelas), forçar a repetição dos andaimes básicos gera atrito e tédio; o aluno deve entrar direto no cálculo de agilidade (nível Médio e Difícil, respectivamente), com números mais desafiadores e ritmo apurado.
4. Ao concluir uma bateria com $\ge 80\%$ de acurácia, o aluno avança para o próximo estágio e conquista **+1 estrela**, completando a coroa dourada ao atingir 3 estrelas.

## What Changes

- **Remoção do Seletor Manual Intra-Drill:** Eliminar os botões de seleção de dificuldade `[★ Fácil] [★★ Médio] [★★★ Difícil]` dentro do card de cálculo de agilidade em `DuolingoLessonView.tsx`.
- **Dificuldade Vinculada ao Progresso de Estrelas do Nó:** A dificuldade da lição passa a ser computada dinamicamente com base nas estrelas atuais do nó (`nodeProgress[nodeId]?.stars`):
  - 0 estrelas atuais $\rightarrow$ Nível Fácil (`easy`).
  - 1 estrela atual $\rightarrow$ Nível Médio (`medium`).
  - 2 ou 3 estrelas atuais $\rightarrow$ Nível Difícil (`hard`).
- **Fluxo Inicial Condicional por Estágio:**
  - Estágio 1 (0 estrelas): Inicia no ciclo tripartite completo (`theory` $\rightarrow$ `scaffolding` $\rightarrow$ `drill`).
  - Estágios 2 e 3 (1 e 2 estrelas): Inicia diretamente no `drill` de agilidade (Médio e Difícil, respectivamente), com atalho sutil de revisão para reabrir a teoria sob demanda.
- **Progressão Incremental de Estrelas:** A aprovação com $\ge 80\%$ concede a próxima estrela (`finalStars = Math.min(3, prevStars + 1)`) ao invés de calcular 1 a 3 estrelas instantâneas por acurácia em uma única sessão.
- **Feedback Visual de Estágio:** O cabeçalho do drill exibe um badge discreto e elegante indicando o estágio de maestria (`Fase 1/3 • Fácil`, `Fase 2/3 • Médio`, `Fase 3/3 • Difícil`), e a tela de vitória celebra a conquista da estrela específica obtida.

## Capabilities

### New Capabilities
<!-- Nenhuma nova capability introduzida. -->

### Modified Capabilities
- `learning-track`: Atualização dos requisitos de progressão pedagógica e do sistema de maestria por coroas/estrelas, definindo o ciclo de 3 estágios evolutivos com remoção do seletor manual de dificuldade e início direto no drill para os níveis 2 e 3.

## Impact

- `src/views/DuolingoLessonView.tsx`: Leitura do estado de estrelas do nó via `gamificationEngine`, remoção do seletor manual de dificuldade, determinação do passo inicial (`theory` vs `drill`) e badge informativo de fase.
- `src/services/gamificationEngine.ts`: Refinamento de `recordLessonCompletion` e `completeTrackNode` para progressão incremental de estrelas (`prevStars + 1` até o limite de 3) mediante $\ge 80\%$ de acurácia.
- `src/views/TrackView.tsx` / `src/App.tsx`: Garantir passagem fluida do estado atualizado do nó.
- Testes automatizados: Atualização dos testes de progressão e integridade pedagógica.
