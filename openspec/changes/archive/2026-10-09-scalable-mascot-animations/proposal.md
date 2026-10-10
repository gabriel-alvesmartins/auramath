## Why

O mascote da Auramath evoluiu de um conceito abstrato para um personagem-marca proprietário ("Prisma, o Camaleão Geômetra"), demandando um sistema de animação vetorial que suporte dezenas de poses, quadros de transição e animações contínuas (como ciclos de respiração, pulo de comemoração, rotação de auréola e sequências de sprites vetoriais).

Atualmente, os componentes de mascote acoplam caminhos SVG estáticos no código ou dependem de carregamentos isolados sem um pipeline extensível. É necessário desacoplar o catálogo de ativos vetoriais do código do componente, estabelecendo uma arquitetura escalável capaz de registrar, pré-carregar, interpolar e sequenciar múltiplos arquivos SVG com consumo mínimo de memória e 60 FPS garantidos.

## What Changes

- **Arquitetura de Catálogo Vetorial Extensível (Asset Registry):** Criação de um registro central tipado (`MascotAnimationRegistry`) para associar estados, quadros de animação (frame sequences / sprite sheets) e metadados de transição (duração, curva de easing, loop vs. one-shot).
- **Pipeline de Carregamento Assíncrono com Cache em Memória:** Mecanismo de lazy-loading e inline injection de SVGs para evitar inchar o bundle inicial do Vite/React Native, mantendo renderização instantânea (0ms de atraso perceptual).
- **Motor de Transições de Estado & Sequenciador (State Machine):** Suporte a transições fluidas entre poses (ex: de `idle` para `thinking`, e de `thinking` para `eureka`) com interpolação de camadas ou troca de frames a 24/60 FPS.
- **Componente Reativo Universal `PrismaMascotWeb`:** Componente de alto nível que consome o pipeline escalável, aceitando novas variações de animação sem alterações estruturais no código-fonte.
- **Adoção Oficial do Mascote Prisma:** Atualização das especificações de gamificação sensorial para consagrar o Prisma (com crista de transferidor, esquadro e cauda de Fibonacci) como o mascote oficial em substituição ao antigo modelo provisório.

## Capabilities

### New Capabilities
- `mascot-animation-pipeline`: Subsistema para registro, carregamento sob demanda, sequenciamento de quadros (frame-by-frame) e execução de animações vetoriais SVG escaláveis com controle de reprodução e micro-interações reativas.

### Modified Capabilities
- `sensory-gamification`: Atualização do requisito do mascote para especificar formalmente a anatomia geométrica do Prisma e suas 6 reações canônicas (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`).

## Impact

- **Frontend Web (`src/components/`, `src/views/`):** Novo componente modular de mascote consumido por `TrackView`, `DuolingoLessonView` e `LessonCompleteView`.
- **Ativos Públicos (`public/mascot/`):** Organização padronizada de diretórios de animações por estado (`/public/mascot/prisma/*.svg`).
- **Performance & Bundle:** Zero impacto negativo no bundle inicial via carregamento sob demanda com cache em memória (LRU ou Map simples).
- **Testes E2E:** Atualização da suíte de testes de mascote para validar o novo pipeline e a conformidade geométrica do Prisma.
