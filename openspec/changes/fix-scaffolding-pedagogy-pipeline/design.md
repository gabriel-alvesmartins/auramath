## Context

Consulte `proposal.md` para motivação e histórico do problema.
Atualmente, `DuolingoLessonView.tsx` renderiza templates decompondo strings com a expressão regular `/(\{.*?\})/g`. Ao encontrar `{chave}`, busca `currentScaffoldTask.blanks.findIndex(b => b.key === chave)`. Em paralelo, `packages/engine/src/index.ts` continha uma discrepância na síntese de fallback de `getNodeScaffoldingTasks`, na qual o template gerado utilizava `{answer}` enquanto o array `blanks` registrava `step_${tasks.length}`. Além disso, 30 dos 32 nós de currículo contavam com apenas 1 tarefa de andaime, forçando o uso do fallback quebrado.

## Goals / Non-Goals

**Goals:**
- Eliminar completamente a ocorrência de lacunas ausentes (`return null`) em qualquer lição e nó do AuraMath.
- Assegurar que cada um dos 32 nós possua 3 tarefas ricas de andaime com etapas intermediárias cognitivas autênticas.
- Limpar `scaffoldAnswers` a cada transição de etapa para evitar poluição cruzada de estado.
- Fornecer componentes visuais editoriais táteis (`PositionalJumpDiagram`, `FactorDualityDiagram`, `PercentDoubleRuler`) conectados aos tipos de nós correspondentes.
- Criar suíte de testes automatizados cobrindo 100% dos nós, garantindo que nunca mais ocorra drift ou erro de chave.

**Non-Goals:**
- Não reescrever a arquitetura completa de duelos ou matchmaking multiplayer.
- Não alterar as regras de cálculo de pontuação Elo ou persistência no Supabase.

## Decisions

### 1. Correspondência Estrita de Chaves no Motor + Tolerância na UI
- **Decisão:** Corrigir a geração em `packages/engine/src/index.ts` para que toda tarefa sintetizada use `{answer}` e `key: 'answer'`. Adicionalmente, em `DuolingoLessonView.tsx`, se uma chave não for encontrada por chave exata, verificar se existe uma única lacuna pendente e vinculá-la como fallback resiliente em vez de retornar `null`.
- **Alternativa Considerada:** Apenas corrigir a UI sem arrumar o motor. Rejeitada, pois deixaria o motor procedural emitindo dados estruturalmente incoerentes.

### 2. Criação Manual de 3 Andaimes Cognitivos para os 32 Nós
- **Decisão:** Escrever explicitamente no array `scaffolding` de cada um dos 32 nós 3 tarefas pedagógicas com passos intermediários reais (ex: em `MULT_5_50`, passos para metade e multiplicação por 10; em `SUB_COMPENSATION`, passo de arredondamento e devolução de troco).
- **Alternativa Considerada:** Gerar programaticamente em tempo de execução. Rejeitada porque a decomposição didática de cálculo mental requer frases e rótulos contextuais que soam artificiais quando montados por geradores simples.

### 3. Visualizadores Editoriais Modulares
- **Decisão:** Adicionar componentes especializados em `src/components/editorial/` para representar:
  - Reta numérica com arcos de salto (`PositionalJumpDiagram`) para nós de Adição/Subtração (Grau I).
  - Balança de equivalência decimal (`FactorDualityDiagram`) para Fatores 5, 25 e 50 (Grau II).
  - Régua dupla percentual comutada (`PercentDoubleRuler`) para Porcentagens (Grau VII).
  Renderizá-los dinamicamente no `DuolingoLessonView.tsx` baseado em `node.id` ou `node.grade`.

## Risks / Trade-offs

- [Risco: O arquivo `packages/engine/src/index.ts` é extenso (~120KB)] → Mitigação: Atualizar cirurgicamente os blocos de `TRACK_GRADES` e a função `getNodeScaffoldingTasks`, executando o build e a suíte de testes de integridade logo após a edição.
- [Risco: Build do monorepo precisar de sincronização] → Mitigação: Executar `npm run build` na raiz para compilar `packages/engine` (`dist/index.js`) garantindo que tanto o web quanto testes consumam a versão atualizada.
