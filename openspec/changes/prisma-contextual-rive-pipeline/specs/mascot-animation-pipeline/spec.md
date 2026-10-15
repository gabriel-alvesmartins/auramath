## MODIFIED Requirements

### Requirement: Arquitetura de Rigging e Interatividade Avançada Rive (State Machine & RML)
O sistema SHALL integrar o motor **Rive** via Rive CLI v1.5.1, RML (*Rive Markup Language*), editor visual Rive e pacote `@rive-app/react-canvas`, suportando múltiplos ativos binários `.riv` contextuais organizados por momento de uso, com suporte a *State Machine* contextual, inputs reativos tipados e animações a 60/120 FPS com aceleração de hardware (WebGL/WebAssembly).

#### Scenario: Compilação determinística do mascote via RML
- **WHEN** o projeto Rive em `rive/prisma/` (contendo `scene.rml` e `rive.yaml`) é compilado com a CLI local do Rive
- **THEN** o sistema SHALL produzir o ativo binário `public/mascot/prisma.riv` contendo a geometria anatômica do Prisma (crista de transferidor 180°, esquadro 30°-60°-90°, olhos telescópicos, cauda em espiral de Fibonacci e auréola solar 360°) e a máquina de estados `PrismaController` com 5 timelines (`idle`, `thinking`, `eureka`, `supernova`, `hint`).

#### Scenario: Controle reativo de estados no React
- **WHEN** o componente `PrismaMascotRive.tsx` recebe uma alteração no prop `state` (ex: `thinking`, `eureka`, `supernova`, `hint`)
- **THEN** o componente SHALL atualizar imediatamente o input numérico `state` (0 a 4) e acionar `triggerEureka` no `PrismaController`, transicionando a animação com interpolação suave sem reinstanciar a árvore DOM.

#### Scenario: Compilação determinística de ativos de contexto
- **WHEN** os subprojetos Rive em `rive/` (ex: `rive/lesson/`, `rive/victory/`, `rive/track/`) são compilados com a CLI local do Rive
- **THEN** o sistema SHALL produzir os respectivos ativos binários contextuais em `public/mascot/` (`prisma-lesson.riv`, `prisma-victory.riv`, `prisma-track.riv`), garantindo peso individual enxuto (< 50 KB para lição, < 100 KB para celebração) e isolamento completo entre State Machines.

#### Scenario: Controle reativo de estados no React por contexto
- **WHEN** um componente consumidor utiliza `PrismaLessonMascot.tsx` ou `PrismaVictoryMascot.tsx`
- **THEN** o componente SHALL mapear os estados locais semânticos (ex: `idle`, `thinking`, `correct`, `incorrect`) diretamente para os inputs da State Machine contextual do arquivo `.riv` correspondente com transição suave (*blending* de curvas) sem reinstanciar o elemento canvas.

#### Scenario: Fallback híbrido gracioso
- **WHEN** um componente Rive falha ao carregar o ativo `.riv` ou o ambiente cliente não suporta WebGL/Canvas
- **THEN** o sistema SHALL utilizar automaticamente o componente SVG nativo `PrismaMascotWeb` com micro-animações CSS como fallback de produção, impedindo qualquer quebra de interface.

#### Scenario: Estúdio de Inspeção com Rive Web Runtime
- **WHEN** o desenvolvedor ou usuário acessa a aba `4. Rive Runtime Interativo (.riv)` em `public/mascot-viewer.html`
- **THEN** o visualizador SHALL permitir alternar entre os contextos do mascote (`Lição`, `Vitória`, `Trilha`), testando interativamente os estados e triggers de cada State Machine com feedback visual em tempo real.

## ADDED Requirements

### Requirement: Arquitetura Híbrida de Mascote por Contexto de UI
O sistema SHALL estruturar as animações do mascote Prisma em três contextos de interface desacoplados, impedindo a criação de State Machines monolíticas pesadas e permitindo divisão de código (*code-splitting*) e carregamento preguiçoso (*lazy loading*).

#### Scenario: Execução em Lição Interativa
- **WHEN** o usuário inicia ou responde uma questão na tela de lição
- **THEN** o sistema SHALL instanciar exclusivamente o runtime de `prisma-lesson.riv`, mantendo alocação mínima de memória e permitindo alternância fluida entre os estados de resolução sem carregar partículas pesadas de vitória.

#### Scenario: Transição para Tela de Vitória
- **WHEN** o usuário conclui com sucesso a lição e navega para a tela de celebração
- **THEN** o sistema SHALL carregar sob demanda (*lazy load*) o ativo `prisma-victory.riv`, reproduzindo animações de alta energia (Supernova, Eureka, troféus e confetes) sem impactar o bundle da lição.

### Requirement: Ponto de Ancoragem Modular de Adereços e VFX (Anchors)
O sistema SHALL desacoplar adereços dinâmicos (ponto de interrogação 3D, anel orbital de símbolos matemáticos, partículas de Eureka e ferramentas de mão) do esqueleto anatômico básico do Prisma, conectando-os através de pontos de fixação (*Anchors* / componentes aninhados).

#### Scenario: Órbita matemática ativada durante cálculo
- **WHEN** o estado do mascote transiciona para `thinking` no contexto de lição
- **THEN** o sistema SHALL exibir o anel de símbolos matemáticos (`+`, `-`, `÷`, `%`, `×`) ancorado no nó `Anchor_HeadTop`, permitindo que os símbolos acompanhem a movimentação da cabeça sem deformar a malha do corpo.

#### Scenario: Substituição de ferramenta empunhada
- **WHEN** o mascote troca de acessório (ex: de esquadro padrão para troféu ou lápis)
- **THEN** o sistema SHALL alternar o componente posicionado no `Anchor_Hand`, mantendo a mesma cadeia de ossos e rotação de ombro sem exigir novo desenho do braço.

### Requirement: Playbook e Workflow Colaborativo 80/20% de Rigging Rive
O sistema SHALL padronizar o fluxo de trabalho de animação dividindo as responsabilidades entre automação de engenharia via IA (80%) e polimento visual tátil pelo desenvolvedor no Rive Editor (20%).

#### Scenario: Preparação de Rig pela IA
- **WHEN** um novo conjunto de poses ou contexto é solicitado para o mascote
- **THEN** a IA SHALL automatizar 80% do processo: fatiar os componentes com sobreposição anatômica (*underlap* anti-frestas), criar a hierarquia de nós/ossos (`Bones`), configurar a State Machine declarativa e subir o projeto para o Rive via CLI.

#### Scenario: Polimento Visual pelo Desenvolvedor
- **WHEN** o projeto Rive é aberto pelo desenvolvedor no editor visual (web ou desktop)
- **THEN** o desenvolvedor SHALL realizar os 20% finais: aplicar a vinculação automática de ossos à malha flexível (*Bind to Mesh*), ajustar os limites de rotação das poses-chave e selecionar curvas de aceleração com presets elásticos (*Spring / Cubic*), exportando o `.riv` final.
