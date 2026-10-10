## Purpose

Mapeia com alta resolução temporal os processos cognitivos do usuário durante a resolução matemática, decompondo latências em fases biológicas, estratificando proficiência por dificuldade e identificando fortalezas e pontos cegos para estudo guiado.

## ADDED Requirements

### Requirement: Telemetria de Resolução em Duas Fases
O sistema SHALL registrar a latência de resolução de cada questão dividida em duas fases temporais independentes: Tempo de Reconhecimento de Padrão ($T_{\text{rec}}$, da renderização da questão até a primeira tecla digitada) e Tempo de Manipulação Mental ($T_{\text{exec}}$, da primeira tecla até a submissão final).

#### Scenario: Captura de primeiro toque no teclado tátil
- **WHEN** uma questão é exibida e o usuário toca no primeiro dígito do teclado
- **THEN** o sistema SHALL registrar a marca temporal exata de reconhecimento e iniciar a medição do tempo de execução

#### Scenario: Detecção de hesitação e correções intermediárias
- **WHEN** o usuário apaga dígitos via backspace ou ultrapassa 1,85x da sua linha de base pessoal de tempo
- **THEN** o evento da questão SHALL ser classificado com indicador de hesitação cognitiva para alimentar a análise de gargalos

### Requirement: Matriz de Proficiência Estratificada por Dificuldade
O sistema SHALL classificar e registrar o desempenho de cada técnica matemática em três níveis distintos de dificuldade (Tier 1 Fácil, Tier 2 Médio, Tier 3 Difícil), computando taxa de acerto e latência média para cada nível.

#### Scenario: Resolução de questão com tier de dificuldade registrado
- **WHEN** uma questão de técnica específica e nível de dificuldade informado é concluída
- **THEN** o sistema SHALL acumular as contagens de tentativas, acertos e tempos no bucket de dificuldade correspondente da técnica

#### Scenario: Detecção de queda de proficiência em problemas complexos
- **WHEN** um usuário atinge mais de 85% de acerto no Tier 1 (Fácil), mas obtém menos de 50% de acerto no Tier 3 (Difícil) para a mesma técnica
- **THEN** o sistema SHALL registrar uma discrepância de profundidade na matriz cognitiva do usuário

### Requirement: Diagnóstico de Fortalezas e Pontos Cegos Pedagógicos
O sistema SHALL analisar periodicamente a matriz de proficiência e identificar automaticamente os Pontos Fortes e Pontos Cegos do usuário, apresentando recomendações acionáveis de 2 minutos de micro-treino.

#### Scenario: Identificação de Ponto Forte
- **WHEN** uma técnica atinge acurácia igual ou superior a 85% no Tier 3 com latência abaixo de 2000ms
- **THEN** o sistema SHALL catalogar a técnica como "Fortaleza Consolidada" no painel de perfil

#### Scenario: Identificação de Ponto Cego e recomendação de estudo
- **WHEN** uma técnica apresenta taxa de erro superior a 35% ou taxa de hesitação superior a 50% em problemas avançados
- **THEN** o sistema SHALL destacar a técnica como "Ponto Cego Crítico" e disponibilizar um atalho de 1 toque para treino direcionado de 2 minutos

### Requirement: Persistência Histórica do Radar Cognitivo (DNA Matemático)
O sistema SHALL recalcular as 5 dimensões do radar (Velocidade, Estimativa de Fermi, Flexibilidade Algébrica, Resistência e Memória de Trabalho) a partir das respostas reais e persistir os snapshots na tabela `cognitive_radars` do banco de dados.

#### Scenario: Recálculo do radar após término de bloco de lições ou treino
- **WHEN** o usuário conclui uma sessão de treino ou lição com novas métricas registradas
- **THEN** o sistema SHALL recalcular as pontuações dos 5 eixos, atualizar o arquétipo intelectual do usuário e salvar um novo registro histórico no Supabase
