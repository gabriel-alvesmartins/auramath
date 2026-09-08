## Purpose

Os modos de jogo fornecem modalidades competitivas e de treinamento ágil que estimulam a fluência aritmética sob pressão de tempo, incluindo partidas rápidas cronometradas, sobrevivência de alta precisão, duelos locais em tela dividida e confrontos síncronos em tempo real pela internet.

## ADDED Requirements

### Requirement: Modo 1 Minuto (Blitz) com Filtros Paramétricos
O sistema SHALL implementar uma modalidade de jogo com contagem regressiva fixa de 60 segundos, permitindo ao usuário customizar previamente quais operações ou técnicas farão parte da rodada (adição, subtração, multiplicação, divisão, estimativas ou mistura completa).

#### Scenario: Execução de partida Blitz com filtros
- **WHEN** o jogador configura a partida para apenas "Multiplicação por Fatores Notáveis" e inicia o jogo
- **THEN** o sistema SHALL iniciar o cronômetro decrescente de 60 segundos e alimentar a fila de questões exclusivamente com geradores procedurais de multiplicação notável

#### Scenario: Encerramento do tempo no Blitz
- **WHEN** o cronômetro atinge 0 segundos
- **THEN** o sistema SHALL bloquear imediatamente novas respostas, consolidar o score final, calcular o bônus de acurácia e submeter a pontuação ao ranking semanal

### Requirement: Modo Morte Súbita (Sobrevivência Infinita)
O sistema SHALL disponibilizar o modo Morte Súbita, caracterizado por tolerância zero a erros (1 vida), dificuldade e velocidade progressivas, e multiplicador exponencial de combo para acertos rápidos sucessivos.

#### Scenario: Erro de cálculo na Morte Súbita
- **WHEN** o jogador comete um único erro de digitação ou submissão
- **THEN** a partida SHALL ser encerrada imediatamente, exibindo a solução comentada da questão perdida e gravando o recorde de sequência máxima (streak)

#### Scenario: Aceleração progressiva do tempo
- **WHEN** o jogador acumula sequências de 10, 20 e 30 acertos consecutivos
- **THEN** o sistema SHALL reduzir gradativamente o tempo limite concedido por questão em 10% a cada patamar e aumentar o multiplicador de pontos em +1x

### Requirement: Modo Batalha Local (Split-Screen)
O sistema SHALL fornecer uma interface de tela dividida no mesmo dispositivo móvel ou tablet, posicionando dois painéis de jogo invertidos em 180 graus para dois jogadores competirem frente a frente.

#### Scenario: Início de duelo em tela dividida
- **WHEN** o modo Batalha Local é iniciado
- **THEN** o sistema SHALL renderizar o Jogador 1 na parte inferior e o Jogador 2 na parte superior (invertido), ambos com teclado numérico in-app independente e a mesma questão gerada simultaneamente

#### Scenario: Pontuação de corrida no Split-Screen
- **WHEN** um dos jogadores submete a resposta correta antes do adversário
- **THEN** o sistema SHALL creditar 1 ponto ao primeiro a acertar, exibir animação de impacto no lado vencedor e disparar imediatamente a próxima questão para ambos

### Requirement: Modo 1v1 Online Realtime
O sistema SHALL suportar matchmaking online rápido pareando dois usuários remotos através de canais WebSockets para disputa simultânea com a mesma semente procedural.

#### Scenario: Entrada na fila e pareamento
- **WHEN** um usuário clica em "Buscar Partida 1v1"
- **THEN** o sistema SHALL inscrever o cliente no canal de matchmaking, encontrar um adversário de elo compatível em menos de 10 segundos e negociar a semente compartilhada da partida

#### Scenario: Sincronização de progresso durante o duelo
- **WHEN** o Jogador A acerta uma questão no duelo remoto
- **THEN** o sistema SHALL transmitir via WebSocket o estado atualizado do placar para o Jogador B com latência inferior a 100ms, atualizando a barra de cabo-de-guerra visual

### Requirement: Modo Duelo Fantasma Assíncrono (Shadow Racing)
O sistema SHALL permitir partidas 1v1 imediatas contra a reprodução de partidas reais ("runs gravadas") de outros jogadores de mesmo nível de habilidade (Elo/MMR), eliminando o tempo de espera de filas síncronas.

#### Scenario: Pareamento instantâneo sem fila de espera
- **WHEN** o jogador inicia um Duelo Fantasma
- **THEN** o sistema SHALL carregar instantaneamente em menos de 300ms a série temporal de uma run gravada de um adversário com faixa de Elo equivalente ($\pm 50$ pontos), renderizando o avatar fantasma correndo no ritmo exato de sua performance original.

#### Scenario: Registro e persistência da run do jogador
- **WHEN** qualquer usuário conclui uma partida competitiva válida
- **THEN** o sistema SHALL serializar o vetor de eventos temporais `[{ q, delta_ms, correct }]` e persistir a gravação no banco de dados para alimentar futuras partidas fantasmas da comunidade.

### Requirement: Modo Desafio Diário ("Mathle") e Compartilhamento Viral
O sistema SHALL disponibilizar uma rodada diária única de 20 questões sincronizadas mundialmente às 00:00 UTC, permitindo uma única tentativa por dia por usuário e gerando um resumo visual compartilhável em redes sociais.

#### Scenario: Execução do Desafio Diário com semente global
- **WHEN** o usuário inicia o Desafio Diário do dia corrente
- **THEN** o sistema SHALL inicializar a partida com a semente determinística global do dia e travar novas tentativas após a conclusão da rodada.

#### Scenario: Geração de card compartilhável sem spoilers
- **WHEN** o usuário conclui o Desafio Diário
- **THEN** o sistema SHALL gerar um texto de compartilhamento para a área de transferência contendo o número da edição diária, tempo total, percentil global e um grid de emojis (🟩 para acertos rápidos, 🟨 para acertos lentos, 🟥 para erros) sem revelar as questões ou respostas numéricas.

### Requirement: Modo Flash Anzan Visuoespacial
O sistema SHALL implementar modalidade visuoespacial de cálculo relâmpago, projetando números sequenciais no centro visual da tela em cadência ultra-rápida sem exibição de operadores explícitos.

#### Scenario: Exibição de rajada numérica
- **WHEN** o jogador inicia uma rodada de Flash Anzan
- **THEN** o sistema SHALL exibir de 3 a 15 números em sequência fixa no centro da tela, com duração de 200ms a 400ms por número intercalados por intervalos em branco de 100ms, exibindo o campo de inserção da resposta imediatamente ao término da rajada.

#### Scenario: Validação da soma mental
- **WHEN** o usuário digita a soma total calculada
- **THEN** o sistema SHALL validar o resultado imediatamente, pontuando com base na velocidade média de projeção e na quantidade de termos processados.

### Requirement: Modo Flow Zen com Áudio Procedural Generativo
O sistema SHALL fornecer modalidade contínua e infinita voltada a relaxamento e foco, desprovida de cronômetros regressivos ou interrupções por erros.

#### Scenario: Orquestração de camadas de áudio Lofi
- **WHEN** o usuário avança em sequências de acerto no Modo Zen
- **THEN** o motor de áudio SHALL ativar gradativamente camadas instrumentais procedurais (ritmo Lofi com ruído de vinil nos acertos 1-5, piano elétrico Rhodes nos acertos 6-12, e chuva/baixo acústico nos acertos 13+).

#### Scenario: Erro sem penalidade sonora
- **WHEN** o usuário comete um erro no Modo Zen
- **THEN** o sistema SHALL apenas destacar sutilmente a solução correta sem interromper o fluxo musical ou aplicar penalidades de pontuação.

### Requirement: Batalhas de Chefes Cognitivos ("Boss Fights")
O sistema SHALL incluir confrontos climáticos de encerramento de cada um dos 6 Graus da Trilha de Aprendizado contra Chefes Arcanos com barra de pontos de vida (HP).

#### Scenario: Confronto com o Chefe Arcano
- **WHEN** o jogador atinge o nó final de um Grau
- **THEN** o sistema SHALL carregar a batalha de chefe com a barra de HP do Boss visível, temporizador de ataque regressivo por rodada (2 a 4 segundos) e mecânica de contra-ataque caso o jogador hesite.

#### Scenario: Vitória e desbloqueio de Skin da Aura
- **WHEN** o jogador reduz o HP do Chefe a zero através de acertos sucessivos da técnica do Grau
- **THEN** o sistema SHALL exibir animação de vitória em tela cheia, registrar a conclusão no perfil e desbloquear uma skin visual temática permanente para o mascote Aura.
