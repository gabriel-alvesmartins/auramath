## Purpose

Define a especificação normativa de design tokens, paleta cromática bioluminescente, tipografia tabular anti-layout shift, escalas dimensionais e comportamentos visuais para todas as superfícies da plataforma Auramath.

## Requirements

### Requirement: Paleta Cromática Dark Glassmorphism Bioluminescente
O sistema SHALL implementar um sistema de cores semânticas baseado em fundo cósmico profundo com superfícies translúcidas e acentos bioluminescentes de alta saturação.

#### Scenario: Aplicação dos tokens de cor de superfície e acento
- **WHEN** a interface renderiza telas de jogo, trilhas ou navegação
- **THEN** o sistema SHALL aplicar a cor de fundo Midnight Obsidian (`#07090E`), cartões em Dark Glass com preenchimento `rgba(13, 17, 26, 0.75)` com desfoque de fundo (`backdrop-filter: blur(16px)`), bordas em `rgba(255, 255, 255, 0.08)`, acentos primários em Electric Cyan (`#00F2FE`) e acentos secundários em Cosmic Violet (`#8A2BE2`).

#### Scenario: Halos dinâmicos de energia conforme combo
- **WHEN** o jogador eleva o multiplicador de combo
- **THEN** os componentes centrais da interface SHALL projetar halos de luz suave (*drop-shadow glow*) correspondentes à cor do patamar energético do mascote Aura, sem estourar o contraste do texto.

### Requirement: Pilha Tipográfica com Numerais Tabulares Anti-Layout-Shift
A tipografia de exibição numérica de equações, cronômetros e multiplicadores SHALL utilizar largura fixa por caractere (monospaced/tabular numerals) para impedir qualquer deslocamento espacial durante o cálculo.

#### Scenario: Renderização de números de múltiplos dígitos
- **WHEN** os dígitos de uma equação ou cronômetro variam dinamicamente na tela
- **THEN** o container numérico SHALL renderizar a fonte com `font-variant-numeric: tabular-nums` e largura invariável por glifo, garantindo zero deslocamento de layout (zero layout shift) para os elementos adjacentes.

#### Scenario: Hierarquia tipográfica de interface
- **WHEN** a tela exibe títulos, rótulos e textos explicativos
- **THEN** os títulos de display SHALL utilizar fonte geométrica moderna com peso bold/black (700-900), e os textos de leitura/instruções SHALL utilizar fonte neutra otimizada para telas móveis com line-height proporcional de 1.4 a 1.5.

### Requirement: Escalas Dimensionais de Espaçamento, Raio e Elevação
A interface SHALL padronizar todas as distâncias, arredondamentos e camadas de profundidade através de uma grade proporcional estrita.

#### Scenario: Aplicação da escala de espaçamento
- **WHEN** componentes de tela são dispostos
- **THEN** as margens e paddings SHALL utilizar múltiplos da escala base de 4px (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).

#### Scenario: Arredondamento de bordas squircle
- **WHEN** botões, cartões ou painéis são renderizados
- **THEN** os cantos SHALL empregar a escala de raio padronizada (`xs: 4px`, `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`, `full: 9999px`), assegurando curvaturas suaves contínuas.

### Requirement: Tratamento do Teclado In-App e Componentes Táticos
Os botões do teclado numérico in-app e seletores de resposta SHALL responder ao toque sem latência perceptível e com área física confortável para velocidade motora.

#### Scenario: Toque no teclado com micro-escala
- **WHEN** o usuário toca em uma tecla do teclado numérico in-app
- **THEN** o botão SHALL ativar seu estado visual no evento de toque imediato (`onTouchStart`), aplicando compressão elástica (`scale: 0.96`), iluminação de borda ciano e disparo da vibração tátil instantânea.

#### Scenario: Área mínima de toque em telas móveis
- **WHEN** o teclado numérico in-app é renderizado em qualquer resolução de tela
- **THEN** cada botão numérico SHALL possuir dimensões mínimas de 56x56dp com espaçamento entre teclas de 8px a 12px, prevenindo toques duplos acidentais.

### Requirement: Regra Visual de Descompressão Não-Hostil
A linguagem visual de erro SHALL adotar princípios de ergonomia psicológica e redução de ansiedade matemática, eliminando sinais punitivos agressivos.

#### Scenario: Feedback de erro empático
- **WHEN** uma resposta incorreta é submetida
- **THEN** o sistema SHALL iluminar temporariamente o campo numérico em Soft Coral (`#FB7185`) por 400ms acompanhado de suave dissipação em partículas, vedando qualquer efeito de tela inteira piscando em vermelho estridente ou trepidações violentas.

### Requirement: Arquitetura e Composição Visual das 16 Telas do Sistema
O sistema SHALL estruturar as 16 telas da plataforma em uma hierarquia tripartite consistente (Header de métricas, Arena Central focal e Dock de interação), garantindo transições de estado previsíveis e navegação intuitiva.

#### Scenario: Composição tripartite das telas de jogo
- **WHEN** qualquer tela de modalidade de jogo é carregada (Arena, Blitz, Morte Súbita, Duelo, Desafio Diário, Flash Anzan, Flow Zen ou Boss)
- **THEN** o sistema SHALL reservar o terço superior para métricas de rodada (tempo, streak, vidas, progresso), o terço médio para a exibição proeminente da equação e do mascote Aura, e o terço inferior para o teclado in-app ou dock de entrada.

#### Scenario: Transição de tela de resultado e revanche
- **WHEN** uma partida é encerrada por tempo, conclusão ou derrota
- **THEN** a interface SHALL transitar fluidamente para a `ResultVictoryScreen` em menos de 200ms com animação de fade e subida de card, apresentando métricas sumarizadas e botões primários de ação rápida para jogar novamente.

