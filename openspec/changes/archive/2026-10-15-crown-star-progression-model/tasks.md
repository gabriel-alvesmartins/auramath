## 1. Engine & Gamification Service

- [x] 1.1 Atualizar `recordLessonCompletion` e `completeTrackNode` em `src/services/gamificationEngine.ts` para implementar o avanço incremental de estrelas (`Math.min(3, prevStars + 1)`) mediante aprovação com $\ge 80\%$, e verificar que repetições não ultrapassam 3 estrelas.
- [x] 1.2 Criar suite de testes automatizados em `test/crown-progression.test.mjs` cobrindo as transições de estágio (0★ -> 1★ no Fácil, 1★ -> 2★ no Médio, 2★ -> 3★ no Difícil e manutenção com 3★), verificando com `node test/crown-progression.test.mjs`.

## 2. Lesson View UI & Dynamic Tier Routing

- [x] 2.1 Remover os botões manuais de escolha de dificuldade `[★ Fácil] [★★ Médio] [★★★ Difícil]` dentro do container do drill em `src/views/DuolingoLessonView.tsx`.
- [x] 2.2 Conectar `selectedDifficulty` dinamicamente ao progresso de estrelas do nó consultado no `gamificationEngine` (`0★ -> easy`, `1★ -> medium`, `2★/3★ -> hard`) e definir `lessonStep` inicial (`theory` se 0★, `drill` se $\ge 1$★).
- [x] 2.3 Inserir a pílula informativa editorial de fase (`Fase X de 3 • Dificuldade`) no topo do drill e disponibilizar atalho de retorno à teoria sob demanda para fases 2 e 3.
- [x] 2.4 Atualizar a tela de celebração de vitória em `DuolingoLessonView.tsx` para apresentar a estrela específica conquistada (`★ 1ª Estrela`, `★★ 2ª Estrela`, `★★★ Coroa Dourada de Maestria`).

## 3. Verificação e Conformidade Spec-Anchored

- [x] 3.1 Executar a suíte completa de testes automatizados (`npm test`) e certificar 100% de aprovação.
- [x] 3.2 Executar `npm run build` e `npm run spec:check` para verificar ausência de erros de compilação TypeScript e conformidade total com a especificação OpenSpec.
