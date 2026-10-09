## 1. Infraestrutura do Catálogo e Carregador Vetorial

- [x] 1.1 Criar `src/services/mascot/animationRegistry.ts` definindo as interfaces (`MascotAnimationConfig`, `MascotFrameSequence`, `MascotState`) e o registro tipado dos 6 estados canônicos do Prisma, verificando a exportação correta de tipos.
- [x] 1.2 Criar `src/services/mascot/svgLoader.ts` implementando carregamento assíncrono, cache em memória (`Map<string, string>`) e método de pré-carregamento em lote, verificando resolução com 0ms em cache hit.
- [x] 1.3 Adicionar testes unitários para `animationRegistry` e `svgLoader` em `test/unit/mascot-loader.test.mjs`, verificando que estados inexistentes acionam fallback seguro e que requisições duplicadas usam o cache.

## 2. Motor de Sequenciamento e Componente Reativo

- [x] 2.1 Criar o hook `src/hooks/useMascotAnimation.ts` com controle de loop via `requestAnimationFrame`, avanço de quadros por delta time, suporte a modos `loop` e `once`, e callback `onAnimationComplete`.
- [x] 2.2 Criar `src/components/PrismaMascotWeb.tsx` combinando o carregador assíncrono, renderização de SVG com preservação de aspect ratio, balão de fala editorial e suporte aos 6 estados com micro-interações CSS.
- [x] 2.3 Atualizar `src/components/AuraMascotWeb.tsx` como wrapper de compatibilidade que repassa props para `PrismaMascotWeb`, garantindo que nenhuma tela existente quebre.

## 3. Integração com as Telas e Experiência do Usuário

- [x] 3.1 Conectar o mascote Prisma na Trilha de Lições (`src/views/TrackView.tsx`), ancorando-o ao lado do nó ativo com balão de fala motivacional.
- [x] 3.2 Conectar os estados dinâmicos em `src/views/DuolingoLessonView.tsx`: exibindo `thinking` durante o raciocínio e disparando transição para `eureka` no drawer de feedback de acerto.
- [x] 3.3 Conectar o estado `supernova` na tela de celebração `src/views/LessonCompleteView.tsx`, sincronizando a auréola solar giratória com o disparo de confetes.

## 4. Validação E2E, Visualizador e Homologação

- [x] 4.1 Atualizar `public/mascot-viewer.html` com painel de teste de taxa de quadros e sequenciamento de animações em tempo real.
- [x] 4.2 Criar a suíte de testes E2E `test/e2e/r8-prisma-mascot.test.mjs` verificando conformidade com a anatomia do Prisma (transferidor, esquadro, cauda áurea) e transições de estado, validando execução sem erros.
- [x] 4.3 Executar `npm test` e `npx vite build`, verificando que todos os testes passam com 100% de sucesso e que o build de produção é gerado sem erros.
