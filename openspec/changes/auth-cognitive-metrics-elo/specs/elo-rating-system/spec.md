## Purpose

Calcula e atualiza dinamicamente a pontuação de habilidade competitiva (Elo) dos usuários através de confrontos matemáticos e pareamento assíncrono baseado em Ghost Runs e bots calibrados.

## ADDED Requirements

### Requirement: Cálculo Algorítmico do Elo Cognitivo
O sistema SHALL implementar o algoritmo padrão de Elo para atualizar o rating do usuário com base no resultado da partida e na expectativa de vitória frente ao oponente, utilizando um fator $K$ adaptativo.

#### Scenario: Vitória contra oponente de Elo similar
- **WHEN** um usuário vence uma partida contra um oponente cujo Elo está a menos de 50 pontos de diferença
- **THEN** o sistema SHALL calcular a expectativa $E \approx 0.5$, aplicar a variação $K \times (1 - E)$ e somar os pontos conquistados ao Elo do perfil

#### Scenario: Fator K acelerado em partidas de calibração
- **WHEN** um usuário disputou menos de 15 partidas no histórico
- **THEN** o sistema SHALL aplicar o fator $K = 40$ para convergência rápida ao nível de habilidade real do competidor

#### Scenario: Fator K moderado em jogadores veteranos
- **WHEN** um usuário possui 15 ou mais partidas registradas
- **THEN** o sistema SHALL utilizar $K = 24$ (ou $K = 16$ para Elo $\ge 1800$) para garantir estabilidade no ranque

### Requirement: Pareamento Assíncrono com Ghost Runs e Bots Calibrados
O sistema SHALL permitir confrontos competitivos instantâneos a qualquer momento, pareando o usuário com gravações de partidas de outros jogadores (`ghost_runs`) de Elo equivalente, com fallback para bots procedurais calibrados caso não haja fantasmas na faixa.

#### Scenario: Pareamento com Ghost Run gravado
- **WHEN** o usuário inicia uma partida ranqueada e existe um ghost run registrado na faixa de $\pm 100$ pontos de Elo
- **THEN** o sistema SHALL carregar os eventos temporais desse fantasma e reproduzir sua timeline de resolução em paralelo com o jogador

#### Scenario: Fallback para Bot Calibrado
- **WHEN** não há ghost run compatível na faixa de Elo do usuário
- **THEN** o sistema SHALL sintetizar um competidor procedural cuja probabilidade de acerto e atraso de resposta sigam distribuição gaussiana compatível com o Elo alvo

### Requirement: Gravação de Ghost Run pós-partida
O sistema SHALL gravar a trilha temporal de respostas (`timeline_events`) das partidas vencidas pelo usuário na tabela `ghost_runs` para servir como desafio a futuros competidores da rede.

#### Scenario: Persistência de Ghost Run elegível
- **WHEN** um usuário autenticado conclui uma partida ranqueada válida sem violações de anti-cheat
- **THEN** o sistema SHALL salvar o snapshot com semente gerada, Elo atual, pontuação e array de eventos em `ghost_runs`
