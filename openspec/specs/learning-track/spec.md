## Purpose

A trilha de aprendizado organiza a formação em cálculo mental através de uma árvore progressiva de nós conceituais dividida em 7 Graus de maestria, com ciclo pedagógico evolutivo de três estágios de coroas/estrelas (Fácil = 1★ com Teoria e Andaimes, Médio = 2★ com Agilidade direta, Difícil = 3★ com Maestria e velocidade), controle de retenção pedagógica e desbloqueio progressivo de competências.

## Requirements

### Requirement: Estrutura em 6 Graus de Maestria
O sistema SHALL disponibilizar uma árvore de aprendizado estruturada em seis graus hierárquicos: Grau I (Magnitude e Fluxo Esquerda-Direita), Grau II (Fatores Notáveis e Divisores Decimais), Grau III (Geometria e Produtos Notáveis), Grau IV (Aproximações e Olho de Fermi), Grau V (Sistemas Formais Históricos: Védica e Trachtenberg) e Grau VI (Aritmética Modular, Soroban Anzan e Transcendência).

#### Scenario: Visualização do mapa da trilha
- **WHEN** o usuário autenticado acessa a tela principal da trilha
- **THEN** o sistema SHALL renderizar a sequência de nós ordenados por Grau, indicando o estado de cada nó (bloqueado, disponível, em progresso, dominado com 1 a 3 estrelas)

### Requirement: Ciclo Pedagógico Tripartite por Nó
Cada nó de técnica da trilha SHALL adaptar sua sequência pedagógica de acordo com o nível atual de estrelas (`0★`, `1★` ou `2★`) do aluno, eliminando qualquer seletor manual de dificuldade dentro da lição e evitando repetições cansativas de andaimes elementares em níveis avançados.

#### Scenario: Início de uma lição inédita
- **WHEN** o usuário inicia um nó pela primeira vez (0 estrelas conquistadas)
- **THEN** o sistema SHALL apresentar inicialmente o card conceitual animado ilustrando a propriedade algébrica da técnica antes de permitir a entrada nos exercícios

#### Scenario: Transição para o andaime cognitivo
- **WHEN** o usuário conclui a leitura do card teórico no nível inicial (0 estrelas)
- **THEN** o sistema SHALL exibir de 3 a 5 exercícios guiados onde campos intermediários de decomposição devem ser preenchidos

#### Scenario: Execução da bateria de fixação
- **WHEN** o usuário inicia ou avança para a bateria procedural
- **THEN** o sistema SHALL iniciar a bateria cronometrada de 10 questões no nível de dificuldade correspondente ao estágio atual (`easy` para 0★, `medium` para 1★ e `hard` para 2★/3★) sem seletores manuais intra-drill

#### Scenario: Início de nó com 1 estrela (Nível Médio)
- **WHEN** o usuário inicia um nó que já possui 1 estrela conquistada
- **THEN** o sistema SHALL iniciar diretamente na Bateria de Fixação no nível Médio (`medium`) com 10 questões procedurais sem exigir a execução prévia do card teórico nem dos andaimes elementares, mantendo disponível um atalho secundário opcional de revisão teórica

#### Scenario: Início de nó com 2 estrelas (Nível Difícil)
- **WHEN** o usuário inicia um nó que já possui 2 estrelas conquistadas
- **THEN** o sistema SHALL iniciar diretamente na Bateria de Fixação no nível Difícil (`hard`) com 10 questões desafiadoras de alta velocidade sem exigir andaimes prévios

#### Scenario: Execução de nó dominado (3 estrelas - Treino Lendário)
- **WHEN** o usuário acessa um nó com 3 estrelas já conquistadas
- **THEN** o sistema SHALL executar o Treino Lendário no nível Difícil para manutenção de ofensiva e ganho de XP sem alterar o total máximo de 3 estrelas

### Requirement: Sistema de Maestria com Estrelas e Coroas
O sistema SHALL atribuir estrelas de maestria de forma incremental por fase concluída com aproveitamento mínimo de 80%, onde cada fase vencida concede exatamente uma estrela adicional até o teto de 3 estrelas (coroa dourada).

#### Scenario: Conquista de 3 estrelas
- **WHEN** o usuário com 2 estrelas finaliza a bateria do nível Difícil com acurácia $\ge 80\%$
- **THEN** o sistema SHALL premiar o nó com a 3ª estrela dourada (`stars = 3`), coroando o nó com `[★ ★ ★]` e atualizando o saldo global de pontos de maestria do perfil

#### Scenario: Falha na bateria de fixação
- **WHEN** o usuário finaliza qualquer bateria com acurácia inferior a 80%
- **THEN** o sistema SHALL direcionar para a tela de revisão de retenção, manter o nó em estado de revisão e não conceder nova estrela

#### Scenario: Conquista da 1ª estrela (Aprovação no nível Fácil)
- **WHEN** o usuário conclui a bateria do nível Fácil com acurácia $\ge 80\%$
- **THEN** o sistema SHALL conceder a 1ª estrela ao nó (`stars = 1`), marcar o nó como completado e atualizar o estado visual do nó na trilha para `[★ ☆ ☆]`

#### Scenario: Conquista da 2ª estrela (Aprovação no nível Médio)
- **WHEN** o usuário com 1 estrela conclui a bateria do nível Médio com acurácia $\ge 80\%$
- **THEN** o sistema SHALL conceder a 2ª estrela ao nó (`stars = 2`) e atualizar o estado visual do nó na trilha para `[★ ★ ☆]`

### Requirement: Desbloqueio Dependente de Nós
O sistema SHALL restringir o acesso a nós avançados até que todos os nós pré-requisitos imediatos atinjam no mínimo 1 estrela de maestria.

#### Scenario: Tentativa de acesso a nó bloqueado
- **WHEN** o usuário seleciona um nó cujo pré-requisito não foi concluído
- **THEN** o sistema SHALL exibir estado bloqueado e indicar claramente quais nós anteriores precisam ser concluídos

### Requirement: Nível Lendário Dourado com Desafio de Maestria Suprema
O sistema SHALL disponibilizar o estágio Lendário para nós da trilha curricular que já tenham conquistado o teto de 3 estrelas, consagrando o nó com acabamento visual dourado Marigold metálico, esquadro de acrílico e coroa áurea permanente após a aprovação em um teste de maestria de alta precisão.

#### Scenario: Desbloqueio do desafio lendário
- **WHEN** o usuário seleciona um nó da trilha curricular que possui 3 estrelas (`stars = 3`)
- **THEN** o card de detalhes do nó SHALL exibir a opção "DESAFIO LENDÁRIO" destacada com borda dourada Marigold pulsante e taxa de entrada em XP/energia.

#### Scenario: Execução do teste lendário sem andaimes
- **WHEN** o usuário inicia o Desafio Lendário de um nó
- **THEN** o sistema SHALL apresentar uma bateria ininterrupta de 8 questões avançadas da técnica do nó no nível Difícil (`hard`), suprimindo qualquer andaime intermediário ou botão de revelação teórica.

#### Scenario: Homologação e coroação do Nó Lendário
- **WHEN** o usuário conclui o Desafio Lendário com acurácia $\ge 87.5\%$ (pelo menos 7 acertos em 8 questões)
- **THEN** o sistema SHALL promover o nó para o estado `legendary = true`, conceder 50 XP de bônus de Maestria Fibonacci e renderizar na trilha serpentina a coroa dourada com anéis concêntricos Marigold brilhantes.

#### Scenario: Falha no desafio lendário
- **WHEN** o usuário comete 2 ou mais erros durante o Desafio Lendário (acurácia $< 87.5\%$)
- **THEN** o desafio SHALL ser interrompido com mensagem empática de incentivo de Prisma sem degradar as 3 estrelas previamente conquistadas pelo usuário.
