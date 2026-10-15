## 1. Engine Correction and Scaffolding Enrichment

- [x] 1.1 Corrigir a função `getNodeScaffoldingTasks` em `packages/engine/src/index.ts` para que fallbacks usem `{answer}` e `key: 'answer'` estritamente coincidentes, e verificar com teste via node.
- [x] 1.2 Implementar 3 andaimes cognitivos manuais e decompostos para todos os nós do Grau 1 e Grau 2 em `packages/engine/src/index.ts`.
- [x] 1.3 Implementar 3 andaimes cognitivos manuais e decompostos para todos os nós do Grau 3, Grau 4 e Grau 5 em `packages/engine/src/index.ts`.
- [x] 1.4 Implementar 3 andaimes cognitivos manuais e decompostos para todos os nós do Grau 6 e Grau 7 em `packages/engine/src/index.ts`.

## 2. UI Resiliency and State Hygiene

- [x] 2.1 Atualizar `DuolingoLessonView.tsx` para limpar `scaffoldAnswers` ao mudar de `scaffoldTaskIndex` e adicionar fallback resiliente de renderização para chaves de template.
- [x] 2.2 Recompilar o pacote `packages/engine` (`npm run build`) e verificar que os artefatos em `packages/engine/dist/` foram atualizados com sucesso.

## 3. Visual Mental Scaffolding Components

- [x] 3.1 Criar componente `PositionalJumpDiagram.tsx` para visualização dos saltos na reta numérica e registrá-lo em `src/components/editorial/`.
- [x] 3.2 Criar componentes `FactorDualityDiagram.tsx` e `PercentDoubleRuler.tsx` e registrá-los em `src/components/editorial/`.
- [x] 3.3 Integrar os diagramas contextuais em `DuolingoLessonView.tsx` renderizando a âncora visual da trilha correspondente durante a descoberta teórica.

## 4. Verification and Automated Testing

- [x] 4.1 Criar teste automatizado em `packages/engine/test/scaffolding-integrity.test.mjs` que valida que todos os 32 nós têm no mínimo 3 andaimes, sem chaves descasadas e com gabaritos matematicamente válidos.
- [x] 4.2 Executar suíte de testes de ponta a ponta (`npm test`) e validar que todas as suítes passam com 0 erros.
