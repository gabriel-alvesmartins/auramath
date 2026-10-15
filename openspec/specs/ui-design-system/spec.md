## Purpose

Define a especificação normativa de design tokens, paleta cromática editorial "Caderno de Descoberta", tipografia tabular anti-layout shift, física tátil 3D e comportamentos visuais para todas as superfícies da plataforma Auramath.

## Requirements

### Requirement: Paleta Cromática Editorial e Theming Soberano
O sistema SHALL implementar um sistema de cores semânticas bidirecional baseado na metáfora do "Caderno Editorial de Descoberta Matemática" (*"Não calcule. Veja."*), eliminando fundos pretos cósmicos e neons elétricos.

#### Scenario: Aplicação dos tokens de cor de superfície e acento
- **WHEN** a interface renderiza no modo claro imediato (*cold load* padrão)
- **THEN** o sistema SHALL aplicar a cor de fundo Paper (`#F7F4EA`), superfícies elevadas em Cream (`#FFFDF6`), texto primário em Nanquim Mineral Ink (`#202522`), texto secundário em Lápis Grafite (`#5C645F`), acento de marca e nós concluídos em Verdigris (`#176B5B`), nós ativos e streak em Marigold (`#F2B84B`), acentos de relações algébricas em Iris (`#6E5AA6`) e correções pedagógicas não-punitivas em Coral (`#E76F61`).

#### Scenario: Suporte a Modo Escuro Mineral
- **WHEN** o usuário seleciona o tema escuro
- **THEN** o sistema SHALL inverter as superfícies ancorando o fundo em Ink Mineral (`#202522`) e o texto em Paper (`#F7F4EA`), mantendo o contraste de texto acima de 7:1 (WCAG AAA) e sem uso de `#000000` ou `#07090E`.

### Requirement: Botões Táteis 3D com Física de Depressão Imediata
Os botões primários e seletores SHALL implementar física tátil inspirada no Duolingo com chanfro chanfrado inferior e afundamento em tempo de resposta imperceptível.

#### Scenario: Compressão tátil 3D sem latência
- **WHEN** o usuário pressiona um botão de classe `.aura-3d-btn`
- **THEN** o botão SHALL transladar para baixo em 3px (`translateY(3px)`) e reduzir a sombra chanfrada inferior de 4px para 1px com transição de 0ms de latência perceptual, acompanhado de tick tátil de áudio Web Audio.

### Requirement: Pilha Tipográfica com Numerais Tabulares Anti-Layout-Shift
A tipografia de exibição numérica de equações, cronômetros e multiplicadores SHALL utilizar largura fixa por caractere (monospaced/tabular numerals) para impedir qualquer deslocamento espacial durante o cálculo.

#### Scenario: Renderização de números de múltiplos dígitos
- **WHEN** os dígitos de uma equação ou cronômetro variam dinamicamente na tela
- **THEN** o container numérico SHALL renderizar a fonte com `font-variant-numeric: tabular-nums` e largura invariável por glifo, garantindo zero deslocamento de layout (zero layout shift) para os elementos adjacentes.

### Requirement: Mascote Aura Vetorial em 5 Estágios Cognitivos
O mascote pedagógico Aura SHALL ser renderizado em SVG vetorial limpo com contorno nanquim e antena de ponto de observação, refletindo a evolução conceitual do aluno.

#### Scenario: Progressão de Estágios Cognitivos
- **WHEN** o aluno progride no domínio das técnicas
- **THEN** o mascote SHALL transitar visualmente entre os 5 estágios: Ponto (1), Linha (2), Forma (3), Padrão (4) e Insight (5), emitindo balões de fala em formato de tirinha de jornal.

### Requirement: Regra Visual de Descompressão Não-Punitiva
A linguagem visual de erro SHALL adotar princípios de ergonomia psicológica e redução de ansiedade matemática, eliminando sinais punitivos agressivos.

#### Scenario: Feedback de erro empático
- **WHEN** uma resposta incorreta é submetida
- **THEN** o sistema SHALL apresentar a gaveta inferior `FeedbackDrawer` em tom Coral Suave (`#F8DED9`) acompanhada da mensagem *"Veja a estrutura oculta"* com a decomposição do passo intermediário, sem flash de tela inteira nem efeitos sonoros agressivos.

### Requirement: Componentes Visuais do Funil de Onboarding na Moldura de 430px
A interface de integração de novos usuários SHALL ser estritamente contida na moldura móvel centralizada de 430px com responsividade fluida para telas menores, preservando as superfícies Paper (`#F7F4EA`) e Cream (`#FFFDF6`).

#### Scenario: Layout responsivo do assistente de onboarding
- **WHEN** o usuário interage com qualquer tela do assistente de onboarding (Boas-vindas, Escolha de Caminho, Quiz ou Meta Diária)
- **THEN** o container SHALL ocupar no máximo 430px de largura com preenchimento interno ergonômico, botões de ação situados na Thumb Zone inferior e barra de progresso no topo.

#### Scenario: Cards de seleção de caminho tripartite com física tátil 3D
- **WHEN** os 3 cards de seleção de caminho são renderizados na tela de nivelamento
- **THEN** cada card SHALL implementar chanfro chanfrado inferior de 3px, afundamento imediato no clique com tick tátil e ícones distintivos (Raio para Zero, Bússola para Diagnóstico, e Troféu para Escolha de Nível).

### Requirement: Layout e Transições da Tela de Vitória LessonCompleteView
A tela `LessonCompleteView` SHALL implementar as transições de entrada de cada fase através de animações CSS aceleradas por hardware com estados determinísticos.

#### Scenario: Transições sequenciadas sem layout shift (CLS = 0)
- **WHEN** a tela transita entre as fases 1, 2, 3, 4 e 5 da coreografia de vitória
- **THEN** as posições verticais e alturas dos containers pré-alocam seu espaço dimensional, impedindo qualquer salto repentino de layout durante a montagem dos elementos.

