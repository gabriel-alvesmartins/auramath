## Context

O frontend do Auramath utiliza Vite + React 18 com suporte a SVG estático em `public/mascot/`. Com a introdução do mascote Prisma e a necessidade de animações fluidas multi-quadro (spritesheets de 4 a 6 quadros por ação, como pulo Eureka, ciclo de respiração e reflexo prismático), acoplar dezenas de SVGs diretamente em componentes React causaria inchaço no bundle JS e tornaria a adição de novos frames um processo manual e propenso a erros.

## Goals / Non-Goals

**Goals:**
- **Escalabilidade Declarativa:** Permitir que novos conjuntos de SVGs (novas poses, skins, quadros de animação) sejam adicionados simplesmente registrando uma entrada de metadados no catálogo, sem reescrever código de componentes.
- **Carregamento Otimizado & Cache:** Suporte a carregamento assíncrono via `fetch` ou import dinâmico com cache em memória (Map `url -> svgString`) e sanitização rápida.
- **Controle Preciso de Taxa de Quadros (FPS):** Hook `useMascotAnimation` que gerencia loops temporizados (`requestAnimationFrame` com delta time) para animações multi-quadro e gatilhos de eventos (`onComplete`).
- **Retrocompatibilidade Total:** Manter as interfaces e propriedades existentes (`size`, `state`, `combo`, `speechText`), garantindo que `TrackView`, `DuolingoLessonView` e `LessonCompleteView` funcionem imediatamente.

**Non-Goals:**
- Não incluirá runtimes pesados de terceiros (como bibliotecas completas de física ou players de vídeo). A solução permanecerá baseada em SVG nativo + CSS / rAF.
- Não converterá o mascote para modelos 3D ou WebGL dentro da aplicação.

## Decisions

### D1: Catálogo Estruturado de Metadados (`src/services/mascot/animationRegistry.ts`)
* **Decisão:** Centralizar todas as animações em um registro tipado que define:
  * `id`: Identificador único da animação (ex: `prisma_idle`, `prisma_eureka_jump`).
  * `frames`: Array ordenado de caminhos SVG (`/mascot/prisma/eureka_f1.svg`, etc.).
  * `frameRate`: Taxa de quadros alvo (ex: 12 ou 24 FPS para animação tradicional).
  * `loop`: Booleano indicando repetição ou execução única (`once`).
  * `nextState`: Estado de transição automática ao terminar uma animação `once` (ex: `eureka` -> `idle`).
* **Alternativas Consideradas:**
  * *Codificar cada frame como componente React TSX separado:* Rejeitado porque criaria centenas de arquivos TypeScript pesados e inflaria o bundle JavaScript inicial.
  * *Usar arquivo GIF ou MP4:* Rejeitado porque perde a nitidez vetorial infinita e impede estilização dinâmica via CSS.

### D2: Carregador Assíncrono com Cache em Memória (`src/services/mascot/svgLoader.ts`)
* **Decisão:** Implementar um serviço singleton que executa `fetch(url)` sob demanda e armazena o SVG raw em um `Map<string, string>`. O componente injeta o SVG via container sanitizado ou renderiza através de tags `<img>` otimizadas para SVGs estáticos.
* **Alternativas Consideradas:**
  * *Vite glob import síncrono:* Rejeitado para pacotes com dezenas de frames grandes para evitar carregar 2 MB de vetores na inicialização da página.

### D3: Hook Especializado `useMascotAnimation` (`src/hooks/useMascotAnimation.ts`)
* **Decisão:** Um hook customizado que gerencia o loop de quadros baseado em `requestAnimationFrame`, controlando o índice do quadro atual, tempo decorrido, reprodução, pausa e disparo do callback `onAnimationComplete`.
* **Alternativas Consideradas:**
  * *CSS `@keyframes` com `steps()`:* Excelente para spritesheets unificados, mas menos flexível para eventos de lógica de jogo (como sincronizar sonoplastia ou trocar para o estado de repouso no final exato do pulo).

### D4: Transição Suave e Compatibilidade de Componentes
* **Decisão:** Criar `src/components/PrismaMascotWeb.tsx` com a nova arquitetura e manter `src/components/AuraMascotWeb.tsx` como um alias/wrapper de compatibilidade para evitar quebras nas telas existentes.

## Risks / Trade-offs

- **[Flicker no primeiro carregamento de frame]** → Mitigação: O `svgLoader` implementa pré-carregamento do estado seguinte (ex: ao entrar em uma lição, pré-carrega em background os frames de `eureka` e `hint`).
- **[Uso de memória com muitos frames em cache]** → Mitigação: Cada SVG do Prisma pesa entre 10 KB e 200 KB; um cache de 30 frames consome menos de 4 MB de RAM, perfeitamente seguro para web e mobile.
