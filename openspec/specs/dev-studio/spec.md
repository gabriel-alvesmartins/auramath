## Purpose

Fornece um ecossistema integrado de ferramentas para desenvolvedores do AuraMath, combinando o In-Game God Mode HUD com bancadas laboratoriais na rota `/dev` para teste de diagramas, áudio procedural, mascote e retenção temporal.

## Requirements

### Requirement: In-Game God Mode HUD
O sistema DEVE fornecer um widget retrátil flutuante acessível em qualquer tela durante o desenvolvimento (via atalho de teclado `Ctrl+Shift+D` ou clique triplo) permitindo manipulação instantânea de lição e inspeção de performance.

#### Scenario: Ativação e fechamento do HUD
- **WHEN** o desenvolvedor pressiona `Ctrl+Shift+D` ou clica no acionador flutuante
- **THEN** o HUD expande suavemente exibindo as ações de auto-solve, salto de lição, métricas de FPS e áudio sem bloquear a interface subjacente

#### Scenario: Auto-solve com acerto instantâneo
- **WHEN** o desenvolvedor clica em "Auto-Solve (Acerto)" durante uma questão ativa
- **THEN** a resposta correta é automaticamente inserida e submetida, disparando a nota pentatônica de sucesso, animação de eureka do Prisma e avanço imediato

#### Scenario: Forçar erro estrutural
- **WHEN** o desenvolvedor clica em "Forçar Erro" durante uma questão ativa
- **THEN** uma resposta incorreta é submetida, abrindo o `FeedbackDrawer` coral ("Veja a estrutura oculta") com dissipação sonora não-punitiva e postura reflexiva do Prisma

#### Scenario: Conclusão imediata de lição
- **WHEN** o desenvolvedor clica em "Pular Lição"
- **THEN** o sistema finaliza todas as etapas pendentes com nota máxima e transiciona diretamente para a tela `LessonCompleteView` com fanfarra e confetes

### Requirement: Overlay Ergonômico de Thumb Zone
O sistema DEVE permitir a sobreposição visual da zona ergonômica de alcance do polegar (Thumb Zone de 430px) sobre qualquer viewport ativa para verificação de posicionamento físico dos botões táteis.

#### Scenario: Alternância da Thumb Zone
- **WHEN** o desenvolvedor ativa o toggle "Thumb Zone" no HUD
- **THEN** uma máscara translúcida com a régua de 430px e curvas de alcance ergonômico é projetada na tela confirmando se os botões de ação ocupam as coordenadas padronizadas

### Requirement: Diagram Studio ("Não calcule. Veja")
A rota `/dev` DEVE disponibilizar uma bancada de teste isolada para os 5 diagramas pedagógicos do AuraMath (`FactorDualityDiagram`, `PercentDoubleRuler`, `PositionalJumpDiagram`, `StructureUnfoldingSlate`, `SymmetryRulerDiagram`).

#### Scenario: Renderização e teste de expressão matemática
- **WHEN** o desenvolvedor seleciona um tipo de diagrama e digita uma expressão algébrica ou escolhe um preset
- **THEN** o diagrama é renderizado isoladamente com controles de passo a passo de animação e validação de `font-variant-numeric: tabular-nums`

### Requirement: Sensory Lab (Soundboard & Lofi Mixer)
A rota `/dev` DEVE disponibilizar uma bancada de engenharia acústica para teste procedural de notas e síntese Lofi sem necessidade de navegação no app.

#### Scenario: Disparo de notas pentatônicas e efeitos táteis
- **WHEN** o desenvolvedor clica nas teclas virtuais da escala pentatônica maior (C4 a C7) ou nos botões de efeitos táteis
- **THEN** o `audioSynth` executa o som imediatamente com latência zero perceptual através da Web Audio API

#### Scenario: Calibração de canais do modo Zen Lofi
- **WHEN** o desenvolvedor inicia o gerador Lofi e altera os sliders de crackle de vinil, acordes de Rhodes ou chuva/sub-bass
- **THEN** os nós de ganho correspondentes no `audioSynth` são modulados em tempo real sem interrupção do fluxo sonoro

### Requirement: Prisma Staging Theater
A rota `/dev` DEVE disponibilizar um palco de ensaio para o mascote Prisma com alternância entre SVG nativo e Rive Canvas, teste dos 6 estados canônicos e balão de fala dinâmico.

#### Scenario: Inspeção de estados e velocidade
- **WHEN** o desenvolvedor seleciona um dos estados (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`) e ajusta a escala ou velocidade (0.25x a 1x)
- **THEN** o mascote transiciona suavemente de estado e atualiza seus parâmetros geométricos e balão de fala

### Requirement: Máquina do Tempo & Simulador de Retenção
A rota `/dev` DEVE permitir adiantar dias simulados (+1d, +7d, +30d) e acionar disparos manuais de modais de retenção (Streak, Conquistas, Nudges).

#### Scenario: Simulação de quebra ou congelamento de ofensiva
- **WHEN** o desenvolvedor seleciona "+1 Dia" sem realizar lição
- **THEN** o motor de gamificação consome um Streak Freeze caso disponível ou coloca a ofensiva em estado de risco, permitindo inspecionar o modal de recuperação de streak

### Requirement: Save Slots & Snapshots JSON
A rota `/dev` DEVE permitir alternar entre 4 perfis pré-configurados (Calouro, Intermediário, Veterano, Mestre) e exportar/importar o estado completo do LocalStorage via JSON.

#### Scenario: Importação de snapshot
- **WHEN** o desenvolvedor cola um payload JSON de estado válido e clica em "Importar Snapshot"
- **THEN** o LocalStorage é atualizado atomicamente e a interface do app reflete imediatamente o novo nível de progresso e estatísticas
