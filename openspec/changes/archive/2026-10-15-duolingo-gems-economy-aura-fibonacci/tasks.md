## 1. Core Engine & Gamification Service Extension

- [x] 1.1 Estender os tipos do `@auramath/engine` em `packages/engine/src/gamification.ts` com o catálogo da loja (`ShopItem`), tipos de temas de caderno (`NotebookTheme`) e campos de assinatura (`isFibonacciMember`, `fibonacciPlan`, `fibonacciTrialEndsAt`, `activeTheme`, `unlockedThemes`). Verificar compilação com `npm test`.
- [x] 1.2 Implementar funções puras de transação econômica no `@auramath/engine` (`buyStreakFreezeItem`, `buyXpBoostItem`, `activateFibonacciSubscription`, `setNotebookTheme`). Verificar com novos testes unitários no engine.
- [x] 1.3 Estender o `gamificationEngine.ts` com métodos da Loja Editorial (`buyShopItem`, `activateXpBoost`, `setFibonacciSubscription`, `equipTheme`), unificação do saldo de gemas/estrelas e persistência no `localStorage`. Verificar atualização atômica de subscribers.

## 2. Component Implementation: Loja Editorial & Aura Fibonacci Modal

- [x] 2.1 Criar o componente `src/components/editorial/AuraFibonacciModal.tsx` com vetor da Espiral Áurea de Fibonacci, mascote Prisma em postura de prestígio (`supernova`), seletor de ciclo anual/mensal com 7 dias grátis, checklist de privilégios e botões 3D com extrusão chanfrada de 4px e 0ms de latência. Verificar renderização tátil isolada.
- [x] 2.2 Criar a view da Loja Editorial `src/views/ShopView.tsx` organizada em 4 seções de prestígio: Banner de Degustação Fibonacci, Ofensiva & Congelamento, Impulso Cognitivo (XP Boost) e Papelaria & Temas de Caderno. Verificar Thumb Zone de 430px e CLS = 0.
- [x] 2.3 Criar o componente de contador regressivo `src/components/editorial/ActiveXpBoostPill.tsx` para exibição no topo do app (`MM:SS`) em JetBrains Mono (`tabular-nums`). Verificar contagem fluida a cada segundo e expiração graciosa.

## 3. App Shell Integration & Navigation

- [x] 3.1 Atualizar o roteador em `src/App.tsx` para incluir a rota canônica `/shop` e transformar o contador de Gemas do cabeçalho em botão tátil 3D que navega para a loja. Verificar som de tick e transição de tela.
- [x] 3.2 Integrar o `AuraFibonacciModal` no `src/App.tsx`, permitindo abertura contextual a partir da Loja Editorial, do selo Fibonacci e de treinos avançados. Verificar fechamento suave pelo botão "X" sem *dark patterns*.
- [x] 3.3 Conectar a aplicação do tema ativo de caderno (`papiro`, `blueprint`, `obsidian`) às superfícies de papel milimetrado em `App.tsx` e `TrackView.tsx`. Verificar transição cromática respeitando a paleta soberana.

## 4. Verification, Testing & Compliance

- [x] 4.1 Criar suite de teste ponta a ponta `test/e2e/duolingo-gems-fibonacci.test.mjs` cobrindo compra de Streak Freeze, limite de 2 cargas, ativação de XP Boost 2x por 15 min, contratação simulada do Aura Fibonacci e desbloqueio de temas. Verificar execução com exit code 0.
- [x] 4.2 Executar suite de testes global do projeto com `npm test` e verificar 100% de aprovação (todos os testes verdes).
- [x] 4.3 Validar integridade dos contratos com `npm run spec:check` e `npx openspec validate --specs`.
- [x] 4.4 Executar build de produção com `npx vite build` para garantir zero erros de bundle ou tipagem.
