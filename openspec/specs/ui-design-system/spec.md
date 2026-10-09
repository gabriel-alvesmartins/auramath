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
