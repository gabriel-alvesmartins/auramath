## Purpose

Fornece um pipeline unificado, escalável e determinístico para registrar, carregar assincronamente com cache, vetorizar e renderizar animações de mascotes no ecossistema AuraMath (atualmente centrado no mascote oficial Prisma, o Camaleão Geômetra 🦎📐).

## Requirements

### Requirement: Registro Modular de Ativos de Animação
O sistema SHALL fornecer um registro central tipado (`MascotAnimationRegistry`) que mapeia identificadores de personagens, estados comportamentais e variantes para coleções de ativos vetoriais SVG, suportando poses únicas, sequências de quadros (frame sheets) e configurações de reprodução (duração, taxa de quadros e modo de repetição).

#### Scenario: Registro de novo estado com múltiplos quadros
- **WHEN** um novo estado com múltiplos quadros SVG é registrado no catálogo (ex: `prisma/eureka` com 5 frames)
- **THEN** o sistema SHALL aceitar a definição contendo os caminhos dos ativos, ordem sequencial dos quadros, taxa de quadros (FPS) e estratégia de reprodução (`loop` ou `once`) sem exigir alteração nos componentes consumidores.

#### Scenario: Consulta de estado não registrado com fallback elegante
- **WHEN** um componente solicita um estado ou variante inexistente no registro
- **THEN** o sistema SHALL emitir aviso de diagnóstico em desenvolvimento e renderizar imediatamente a pose canônica padrão (`idle`) como fallback seguro.

### Requirement: Carregamento Assíncrono com Cache em Memória
O sistema SHALL carregar arquivos SVG sob demanda através de carregamento assíncrono não-bloqueante e armazenar os vetores processados em um cache em memória reutilizável para eliminar latência perceptual em reproduções subsequentes.

#### Scenario: Primeiro carregamento de animação sob demanda
- **WHEN** uma animação é solicitada pela primeira vez durante uma lição
- **THEN** o sistema SHALL carregar o recurso vetorial de forma assíncrona, renderizando um marcador estático temporário até o carregamento concluir sem travar a thread principal da interface.

#### Scenario: Reutilização instantânea a partir do cache
- **WHEN** o mesmo estado ou quadro de animação é requisitado novamente após o primeiro carregamento
- **THEN** o sistema SHALL recuperar o vetor instantaneamente do cache em memória com latência inferior a 16ms (garantindo 60 FPS).

### Requirement: Pipeline Automatizado de Vetorização de Alta Fidelidade (VTracer)
O sistema SHALL disponibilizar um pipeline de script CLI (`npm run mascot:vectorize`) alimentado pelo motor VTracer em Rust/splines cúbicas, convertendo conceitos raster (PNG/JPG) em SVGs puros otimizados, com remoção de tela de fundo branco e normalização para `viewBox="0 0 1024 1024"`.

#### Scenario: Vetorização individual de pose específica
- **WHEN** o usuário executa `npm run mascot:vectorize -- [nome-da-pose]`
- **THEN** o sistema SHALL processar exclusivamente a imagem solicitada, garantindo que nenhum outro SVG já existente seja alterado ou sobrescrito.

#### Scenario: Modo incremental com proteção automática contra sobrescrita
- **WHEN** o comando em lote `npm run mascot:vectorize` é executado sem argumentos
- **THEN** o sistema SHALL detectar e ignorar (`skip`) automaticamente todas as imagens cujos SVGs já existem em `/public/mascot/`, processando apenas conceitos inéditos.

### Requirement: Arquitetura de Rigging e Interatividade Avançada Rive (State Machine & RML)
O sistema SHALL integrar o motor **Rive** via Rive CLI v1.5.1, RML (*Rive Markup Language*) e pacote `@rive-app/react-canvas`, compilando arquivos binários ultra-leves `.riv` (~4.9 KB) com suporte a *State Machine* (`PrismaController`), inputs reativos (`state: number`, `triggerEureka: trigger`) e animações procedurais a 60 FPS com aceleração de hardware (WebGL/WebAssembly).

#### Scenario: Compilação determinística do mascote via RML
- **WHEN** o projeto Rive em `rive/prisma/` (contendo `scene.rml` e `rive.yaml`) é compilado com a CLI local do Rive
- **THEN** o sistema SHALL produzir o ativo binário `public/mascot/prisma.riv` contendo a geometria anatômica do Prisma (crista de transferidor 180°, esquadro 30°-60°-90°, olhos telescópicos, cauda em espiral de Fibonacci e auréola solar 360°) e a máquina de estados `PrismaController` com 5 timelines (`idle`, `thinking`, `eureka`, `supernova`, `hint`).

#### Scenario: Controle reativo de estados no React
- **WHEN** o componente `PrismaMascotRive.tsx` recebe uma alteração no prop `state` (ex: `thinking`, `eureka`, `supernova`, `hint`)
- **THEN** o componente SHALL atualizar imediatamente o input numérico `state` (0 a 4) e acionar `triggerEureka` no `PrismaController`, transicionando a animação com interpolação suave sem reinstanciar a árvore DOM.

#### Scenario: Fallback híbrido gracioso
- **WHEN** um componente `PrismaMascotRive` falha ao carregar o ativo `.riv` ou o ambiente não suporta WebGL/Canvas
- **THEN** o sistema SHALL utilizar automaticamente o componente SVG nativo `PrismaMascotWeb` com micro-animações CSS como fallback de produção, impedindo qualquer quebra de interface.

#### Scenario: Estúdio de Inspeção com Rive Web Runtime
- **WHEN** o desenvolvedor ou usuário acessa a aba `4. Rive Runtime Interativo (.riv)` em `public/mascot-viewer.html`
- **THEN** o visualizador SHALL carregar o runtime Rive localmente (via `public/vendor/rive/rive.js` e `rive.wasm`) e permitir alternar interativamente entre os 5 estados da State Machine com feedback visual em tempo real.

