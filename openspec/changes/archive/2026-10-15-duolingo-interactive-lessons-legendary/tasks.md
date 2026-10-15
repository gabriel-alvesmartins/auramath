## 1. Motor e Geradores Matemáticos (@auramath/engine)

- [x] 1.1 Estender tipos de dados de nós (`ProgressionNode`, `NodeProgress`) com o campo `legendary?: boolean` e função avaliadora do Desafio Lendário ($\ge 87.5\%$ acertos)
- [x] 1.2 Implementar gerador procedural de pares para Match Madness (`generateComplementaryPairs` para base 100/1000 e equivalências algébricas) e verificar integridade dos pares
- [x] 1.3 Implementar lógica e validação dos passos de decomposição tátil (*Tap-to-Split*) e fusão de parcelas

## 2. Componente de Decomposição Tátil (TapToSplitSlate)

- [x] 2.1 Criar componente `TapToSplitSlate.tsx` com renderização de blocos táteis, animação de mola elástica na fragmentação de dezenas/unidades e fusão de parcelas
- [x] 2.2 Integrar sonoplastia pentatônica harmônica e micro-impacto tátil nos eventos de cisão e fusão
- [x] 2.3 Integrar `TapToSplitSlate` como tipo de interação alternativo ao teclado em `DuolingoLessonView.tsx`

## 3. Modo Match Madness de Pares Mentais (MatchMadnessGrid)

- [x] 3.1 Criar componente `MatchMadnessGrid.tsx` com grade móvel de 2 colunas $\times$ 5 linhas, seleção de pares, detecção de acerto/erro e reposição sem layout shift (CLS = 0)
- [x] 3.2 Implementar contador regressivo com combo progressivo (+3s por marco de 5 pares e multiplicador de XP)
- [x] 3.3 Integrar `MatchMadnessView` como nova modalidade acessível no Training Hub (`DuelHubView.tsx`)

## 4. Nós Lendários Dourados na Trilha de Aprendizado

- [x] 4.1 Atualizar `TrackSerpentineNode.tsx` com coroa dourada 3D Marigold, auréola cintilante e acabamento metálico para nós com `legendary === true`
- [x] 4.2 Implementar tela/modal `LegendaryChallengeView.tsx` com bateria de 8 questões sem andaimes e homologação de maestria
- [x] 4.3 Conectar a finalização do Desafio Lendário no `TrackView.tsx`, persistindo o status lendário e acionando comemoração do mascote Prisma

## 5. Verificação Automatizada e Qualidade

- [x] 5.1 Criar suite de testes automatizados `test/e2e/duolingo-interactive-legendary.test.mjs` cobrindo Tap-to-Split, Match Madness e Nós Lendários
- [x] 5.2 Executar `npm test` e verificar que todas as suítes passam com 100% de sucesso
- [x] 5.3 Executar `npm run spec:check` e `npx vite build` verificando conformidade Spec-Anchored e zero erros de bundle
