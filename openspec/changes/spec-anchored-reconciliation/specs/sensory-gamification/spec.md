## ADDED Requirements

### Requirement: Sistema Comportamental de Retenção e Ofensivas
O sistema SHALL implementar mecanismos de engajamento baseados em hábitos diários protegidos, incluindo congelamento de ofensiva (*Streak Freeze*), auto-contratos de aposta (*Streak Wagers*) e missões de resgate (*Rescue Tasks*).

#### Scenario: Aquisição e uso de congelamento de ofensiva
- **WHEN** o usuário opta por proteger sua sequência
- **THEN** o sistema SHALL permitir adquirir até 2 congelamentos mediante o custo de 100 estrelas cada, consumindo-os automaticamente em dias de inatividade sem zerar a contagem

#### Scenario: Aposta de ofensiva com multiplicador
- **WHEN** o usuário estabelece um contrato de aposta para 7 ou 14 dias consecutivos
- **THEN** o sistema SHALL bloquear o valor de estrelas apostado e premiar o usuário com multiplicador bônus ao término do período cumprido

#### Scenario: Resgate de sequência perdida
- **WHEN** a ofensiva é interrompida sem saldo de congelamentos
- **THEN** o sistema SHALL disponibilizar a mecânica de resgate composta por 3 tarefas cognitivas encadeadas para recuperar a sequência

### Requirement: Ligas Semanais Segmentadas e Baús de Descoberta
O sistema SHALL organizar os alunos em turmas competitivas semanais (*cohorts*) de 30 participantes distribuídos em 5 patamares hierárquicos (Papiro, Ábaco, Astrolábio, Compasso, Arquimedes) e recompensar a progressão na trilha através de Baús de Descoberta com 4 níveis de raridade.

#### Scenario: Classificação semanal em ligas
- **WHEN** o usuário acumula pontos de XP em lições e treinos
- **THEN** o sistema SHALL posicionar o perfil no ranking do seu cohort de 30 membros, indicando faixas de promoção, permanência e rebaixamento com encerramento semanal

#### Scenario: Coleta de Baú de Descoberta
- **WHEN** o aluno abre um baú intercalado na trilha de aprendizado
- **THEN** o sistema SHALL sortear e creditar recompensas variáveis (estrelas, multiplicador temporário de foco 2x XP e medalhas de prestígio) conforme a raridade do baú

### Requirement: Ausência de Cosméticos e Foco em Prestígio Intelectual
O sistema SHALL rejeitar skins cosméticas mercantis ou roupagens consumistas para o mascote Aura, concentrando todas as recompensas de conquistas e quests comunitárias exclusivamente em medalhas conceituais de prestígio editorial.

#### Scenario: Conclusão de grandes marcos
- **WHEN** o usuário conclui desafios avançados ou metas comunitárias globais
- **THEN** o sistema SHALL conceder medalhas de prestígio matemático permanente, sem alterar a anatomia visual canônica do mascote
