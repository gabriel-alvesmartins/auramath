## Why

Identificamos uma falha crítica de integridade na renderização das lições tripartite do AuraMath: a partir do 2º exercício da etapa de andaime (scaffolding), a tela fica em branco para a resposta (sem caixa de digitação no DOM) e o usuário não consegue preencher nem verificar a questão. Isso ocorria porque 30 dos 32 nós de currículo tinham menos de 3 tarefas manuais definidas, e o fallback de geração sintetizava um template com marcador `{answer}` mas com a chave `step_X` na definição da lacuna, causando `findIndex === -1` e o retorno de `null` no componente de renderização.

Além disso, identificou-se um déficit pedagógico: tarefas de andaime geradas por fallback não decompunham o cálculo em etapas mentais intermediárias (violando o requisito do motor de andaimes cognitivos), e a plataforma carecia de âncoras visuais específicas por trilha para garantir a fixação do cálculo mental em memória de longo prazo.

## What Changes

- **Correção da Incompatibilidade de Chaves no Motor de Andaime**: Ajuste em `packages/engine/src/index.ts` para que geradores e templates de fallback utilizem chaves correspondentes e nunca emitam chaves descasadas.
- **Enriquecimento Curricular de Andaimes em Todos os 32 Módulos**: Adição de 3 tarefas de andaime manuais completas com decomposição cognitiva autêntica por nó (total de 96 tarefas ricas em vez de 34), eliminando o recurso a fallbacks empobrecidos.
- **Resiliência e Higienização de Estado em `DuolingoLessonView.tsx`**:
  - Limpeza imediata do estado `scaffoldAnswers` ao avançar entre etapas do andaime.
  - Tolerância de renderização com fallback automático de exibição de campo caso ocorra qualquer discrepância de chave de template.
- **Componentes Visuais de Ancoragem Cognitiva Trilha a Trilha**:
  - Criação de diagramas visuais editoriais para as trilhas do AuraMath (`PositionalJumpDiagram` para Grau I, `FactorDualityDiagram` para Grau II, `PercentDoubleRuler` para Grau VII) para visualização do método antes e durante a prática.
- **Suíte de Testes de Integridade de Currículo**: Teste automatizado que varre todos os 32 nós, 96 andaimes e geradores de questões verificando integridade de templates, precisão matemática e ausência de campos nulos.

## Capabilities

### Modified Capabilities
- `learning-track`: Garantir que cada um dos 32 nós possua obrigatoriamente 3 tarefas guiadas de andaime com campos intermediários de decomposição cognitiva plenamente funcionais e renderizáveis.
- `math-engine`: Garantir que toda tarefa de andaime forneça decomposição coerente em etapas estruturais da técnica específica, com correspondência estrita entre marcadores do template e chaves do vetor de lacunas.

## Impact

- `packages/engine/src/index.ts`: Estrutura de dados de `TRACK_GRADES`, `getNodeScaffoldingTasks`, `generateQuestionsForNode`.
- `src/views/DuolingoLessonView.tsx`: Ciclo de vida da etapa `scaffolding`, renderização de lacunas e reset de respostas parciais.
- `src/components/editorial/`: Novos componentes visuais para ancoragem de métodos de cálculo mental.
- `packages/engine/test/`: Nova suíte de testes de validação de andaimes e compatibilidade de chaves.
