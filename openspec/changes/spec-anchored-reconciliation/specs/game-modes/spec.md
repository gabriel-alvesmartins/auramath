## MODIFIED Requirements

### Requirement: Modo Batalha Local (Split-Screen)
O sistema SHALL fornecer uma interface de tela dividida no mesmo dispositivo móvel ou tablet, posicionando dois painéis de jogo frente a frente, com a mesma questão matemática gerada simultaneamente para ambos os jogadores.

#### Scenario: Início de duelo em tela dividida
- **WHEN** o modo Batalha Local é iniciado
- **THEN** o sistema SHALL renderizar o Jogador 1 na parte inferior e o Jogador 2 na parte superior, ambos com teclado numérico independente e exatamente a mesma questão gerada simultaneamente

#### Scenario: Pontuação de corrida no Split-Screen
- **WHEN** um dos jogadores submete a resposta correta antes do adversário
- **THEN** o sistema SHALL creditar 1 ponto ao primeiro a acertar e disparar imediatamente a próxima questão simultânea para ambos

### Requirement: Modo Desafio Diário ("Mathle") e Compartilhamento Viral
O sistema SHALL disponibilizar uma rodada diária única de 20 questões sincronizadas mundialmente às 00:00 UTC geradas por semente determinística, permitindo uma única tentativa por dia por usuário e gerando um resumo visual compartilhável em redes sociais sem spoilers.

#### Scenario: Execução do Desafio Diário com semente global
- **WHEN** o usuário inicia o Desafio Diário do dia corrente
- **THEN** o sistema SHALL inicializar a partida com a semente determinística global do dia alimentando 20 questões e travar novas tentativas após a conclusão da rodada

#### Scenario: Geração de card compartilhável sem spoilers
- **WHEN** o usuário conclui o Desafio Diário
- **THEN** o sistema SHALL gerar um texto de compartilhamento para a área de transferência contendo o número da edição diária, tempo total, percentil global e um grid de emojis (🟩 para acertos rápidos, 🟨 para acertos lentos, 🟥 para erros) sem revelar as questões ou respostas numéricas

### Requirement: Modo 1v1 Online Realtime
[Fase Futura] O sistema SHALL suportar matchmaking online rápido pareando dois usuários remotos através de canais WebSockets para disputa simultânea com a mesma semente procedural.

#### Scenario: Entrada na fila e pareamento
- **WHEN** [Fase Futura] a infraestrutura de tempo real for ativada e o usuário buscar partida 1v1
- **THEN** o sistema SHALL parear os competidores em canal WebSocket com semente compartilhada

#### Scenario: Sincronização de progresso durante o duelo
- **WHEN** [Fase Futura] um competidor pontuar no duelo remoto
- **THEN** o sistema SHALL sincronizar o cabo-de-guerra visual via WebSocket com latência inferior a 100ms

## REMOVED Requirements

### Requirement: Modo Duelo Fantasma Assíncrono (Shadow Racing)
**Reason**: Funcionalidade cancelada por decisão de produto. A complexidade de gravação e reprodução assíncrona de séries temporais não se alinha ao foco prioritário de consolidação dos modos core de treinamento e duelo presencial.
**Migration**: Usuários competem através da Batalha Local Split-Screen e das Ligas Semanais Segmentadas.

### Requirement: Batalhas de Chefes Cognitivos ("Boss Fights")
**Reason**: Funcionalidade cancelada. O modelo de monstros/chefes arcanos com temporizador punitivo de contra-ataque e barra de HP foi descontinuado em favor da Prova de Maestria pedagógica elegante do Caderno de Descoberta.
**Migration**: Ao término de cada Grau, os alunos realizam a Prova de Maestria da Trilha.
