## Purpose

O sistema de gamificação sensorial orquestra o feedback audiovisual e tátil em tempo real para maximizar o engajamento cognitivo, dopamina e prazer no cálculo mental, combinando animações fluidas a 60/120 FPS, sonoplastia em escala pentatônica musical harmônica, vibração háptica escalar e o mascote reativo "Aura".

## ADDED Requirements

### Requirement: Mascote Reativo Interativo "Aura"
O sistema SHALL exibir em destaque o mascote "Aura", construído em SVG vetorial por camadas com núcleo bioluminescente, cuja renderização gráfica e postura visual reagem dinamicamente aos eventos de acerto, sequências de combo, velocidade de resposta e erros do usuário através de 5 níveis de transcendência energética.

#### Scenario: Evolução do mascote durante sequência de combo (5 Níveis)
- **WHEN** o usuário atinge os patamares de combo de 1, 5, 10, 20 e 35 acertos consecutivos
- **THEN** o mascote "Aura" SHALL transitar visualmente pelos 5 estados progressivos:
  1. *Spark (Combo 1-4):* Flutuação senoidal suave, respiração zen e notas isoladas.
  2. *Surge (Combo 5-9):* Asas de plasma laterais, pulsação acelerada e eco espacial.
  3. *Overdrive (Combo 10-19):* Anéis giroscópicos em rotação, trilha de after-image e aberração cromática.
  4. *Supernova (Combo 20-34):* Olhos com brilho estelar, portal de geometria sagrada e starfield warp.
  5. *Singularity / Godmode (Combo 35+):* Disco de acreção prismático, micro hit-stop de 2 quadros (16ms) em cada acerto e partículas cósmicas radiantes.

#### Scenario: Descompressão suave ao errar
- **WHEN** o usuário erra uma questão durante qualquer patamar de combo
- **THEN** o sistema SHALL dissipar a energia acumulada em partículas lentas com um suspiro acústico suave (sem sons punitivos ou sirenes de alarme estridentes), e o mascote SHALL adotar postura empática indicando a decomposição correta.

### Requirement: Pedagogia Cinética de Decomposição Numérica
A interface visual SHALL renderizar as operações matemáticas não como texto estático, mas como partículas numéricas cinéticas animadas da esquerda para a direita, demonstrando visualmente os algoritmos cognitivos de decomposição.

#### Scenario: Animação de Fusão de Mercúrio (Adição Posicional)
- **WHEN** o usuário resolve ou visualiza o passo a passo de uma adição posicional da esquerda para a direita
- **THEN** o sistema SHALL destacar a separação do segundo operando em dezenas e unidades, animando o deslizamento da dezena para fundir-se com o primeiro número antes de incorporar a unidade restante.

#### Scenario: Animação do Acordeão Elástico (Multiplicação por 11)
- **WHEN** uma operação de multiplicação por 11 é demonstrada
- **THEN** os dígitos do multiplicando SHALL afastar-se lateralmente com efeito de mola elástica, abrindo espaço para a materialização da soma intermediária no centro e fechando-se com travamento tátil instantâneo.

#### Scenario: Animação do Espelho Simétrico (Diferença de Quadrados)
- **WHEN** uma multiplicação decomponível por diferença de quadrados é apresentada (ex: $(m - d)(m + d)$)
- **THEN** a interface SHALL destacar um eixo pivô central brilhante no valor base $m$, animando a derivação visual imediata de $m^2 - d^2$.

### Requirement: Sonoplastia Harmônica em Escala Pentatônica
O subsistema de áudio SHALL sintetizar ou disparar notas melódicas correspondentes aos graus de uma escala pentatônica maior ascendente a cada acerto consecutivo do combo, eliminando qualquer dissonância sonora em respostas rápidas.

#### Scenario: Disparo sonoro em acertos sequenciais
- **WHEN** o jogador acerta questões em sucessão imediata
- **THEN** o sistema SHALL reproduzir a sequência melódica ascendente (Dó4, Ré4, Mi4, Sol4, Lá4, Dó5...), reiniciando a base melódica caso o combo seja interrompido

#### Scenario: Modo silencioso respeitado
- **WHEN** o usuário desativa os efeitos sonoros nas configurações do app ou ativa o modo silencioso do sistema operacional
- **THEN** o sistema SHALL suprimir totalmente a execução dos gatilhos de áudio sem introduzir latência na interface

### Requirement: Resposta Tátil Háptica Escalonada
Para dispositivos móveis que suportam atuadores hápticos, o sistema SHALL emitir vibrações táteis diferenciadas conforme a relevância da ação executada pelo usuário.

#### Scenario: Digitação no teclado in-app
- **WHEN** o usuário toca em uma tecla numérica do teclado in-app
- **THEN** o dispositivo móvel SHALL acionar um pulso tátil ultraleve instantâneo (`selectionAsync`)

#### Scenario: Acerto de marco de combo ou novo recorde
- **WHEN** uma resposta correta eleva o multiplicador ou estabelece um novo recorde pessoal
- **THEN** o dispositivo móvel SHALL disparar uma vibração de impacto médio a pesado (`impactAsync(Heavy)`), confirmando fisicamente a conquista

### Requirement: Efeitos Visuais de Impacto ("Game Juice")
A interface visual SHALL utilizar interpolações aceleradas por hardware para renderizar números flutuantes de pontuação, partículas de faíscas ao redor do contador de combo e micro-trepidação de tela sutil em erros.

#### Scenario: Execução de acerto rápido com multiplicador
- **WHEN** uma questão é respondida corretamente em menos de 1,5 segundos com combo ativo
- **THEN** a tela SHALL exibir o valor dos pontos flutuando com escala aumentada e partículas de chamas ao redor do multiplicador a uma taxa de quadros alvo de 60 ou 120 FPS

### Requirement: Teclado Gestual de Alta Velocidade ("Flick Numpad")
O teclado in-app SHALL interpretar gestos táteis rápidos de deslizamento (*flick/swipe*) para acelerar o envio e correção de respostas sem exigir cliques adicionais.

#### Scenario: Submissão rápida por deslizamento para a direita
- **WHEN** o usuário desliza o dedo horizontalmente para a direita sobre o teclado numérico
- **THEN** o sistema SHALL submeter a resposta instantaneamente sem necessidade de tocar na tecla Enter/OK.

#### Scenario: Limpeza rápida por deslizamento para a esquerda
- **WHEN** o usuário desliza o dedo horizontalmente para a esquerda sobre o teclado numérico
- **THEN** o sistema SHALL apagar todo o conteúdo do visor numérico imediatamente emitindo vibração tátil leve.

#### Scenario: Inserção de zeros duplos
- **WHEN** o usuário realiza um gesto de flick vertical para baixo sobre a tecla '0'
- **THEN** o sistema SHALL inserir '00' de uma só vez no campo de resposta.

### Requirement: DNA Matemático e Radar Cognitivo de 5 Eixos
O sistema SHALL computar periodicamente a matriz de desempenho cognitivo do usuário em 5 dimensões e gerar um cartão estilizado compartilhável com seu arquétipo.

#### Scenario: Mapeamento de perfil e arquétipo
- **WHEN** o usuário atinge o mínimo de 50 questões respondidas em diferentes modalidades
- **THEN** o sistema SHALL calcular os percentis normalizados em Velocidade, Estimativa, Flexibilidade, Resistência e Memória de Trabalho, atribuindo um arquétipo temático (ex: "Arquiteto Relâmpago") e gerando um gráfico de radar renderizado em SVG exportável como imagem.

### Requirement: Laboratório Tátil de Geometria
A plataforma SHALL disponibilizar módulo experimental interativo com controles táteis onde expressões algébricas abstratas são representadas como blocos geométricos físicos com áreas proporcionais em tempo real.

#### Scenario: Decomposição geométrica de produtos notáveis
- **WHEN** o usuário move os controles deslizantes das variáveis $a$ e $b$ no módulo do quadrado da soma
- **THEN** a tela SHALL redimensionar dinamicamente a área do quadrado principal $a^2$, os dois retângulos $ab$ e o quadrado $b^2$, demonstrando visualmente que $(a+b)^2 = a^2 + 2ab + b^2$.
