## ADDED Requirements

### Requirement: Persistência em Nuvem de Conquistas e Marcos Cognitivos
O sistema SHALL sincronizar os marcos cognitivos e conquistas comportamentais do usuário entre o cache local e a tabela `user_achievements` no banco de dados Supabase, garantindo que o desbloqueio de conquistas seja permanente.

#### Scenario: Desbloqueio e gravação de marco cognitivo
- **WHEN** o usuário atinge a meta de uma conquista comportamental (ex: primeiro insight estrutural ou sequência de 7 dias)
- **THEN** o sistema SHALL registrar a conquista como desbloqueada localmente, disparar o modal celebratório e persistir o registro com timestamp no Supabase

#### Scenario: Restauração de conquistas em novo dispositivo
- **WHEN** o usuário autentica-se em um novo dispositivo ou navegador
- **THEN** o sistema SHALL consultar a tabela de conquistas no Supabase e preencher o estado do motor de gamificação com todas as conquistas já desbloqueadas

### Requirement: Persistência de Selos de Maestria de Grau
O sistema SHALL vincular a conquista de Selos de Maestria conquistados nas Provas de Maestria à tabela `user_unlocked_badges` do usuário autenticado no banco de dados.

#### Scenario: Conquista do Selo de Maestria ao concluir a prova
- **WHEN** o usuário completa com êxito todas as etapas de uma Prova de Maestria de Grau
- **THEN** o sistema SHALL conceder o selo correspondente e salvar a referência na tabela `user_unlocked_badges`

### Requirement: Sincronização Resiliente de Progresso dos Nós da Trilha
O sistema SHALL salvar e sincronizar o progresso de cada nó da trilha (`stars_earned`, `best_accuracy`, `average_speed_ms`) na tabela `user_node_progress`, operando com cache local e envio com tolerância a falhas temporárias de conexão.

#### Scenario: Conclusão de nó com sincronização bem-sucedida
- **WHEN** uma lição de nó é finalizada com sucesso
- **THEN** o sistema SHALL atualizar o estado reativo em 0ms no armazenamento local e enviar a mutação correspondente para `user_node_progress` no Supabase

#### Scenario: Resiliência offline durante a lição
- **WHEN** a lição é finalizada enquanto o dispositivo está offline ou sem conexão com a internet
- **THEN** o sistema SHALL reter a atualização na fila de sincronização local e despachá-la automaticamente assim que a conectividade for restabelecida
