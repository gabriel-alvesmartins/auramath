## Purpose

A trilha de aprendizado organiza a formação em cálculo mental através de uma árvore progressiva de nós conceituais dividida em 6 Graus de maestria, com ciclo pedagógico de três etapas (teoria relâmpago, andaime interativo e bateria de fixação), controle de coroas/estrelas e desbloqueio progressivo de competências.

## ADDED Requirements

### Requirement: Estrutura em 6 Graus de Maestria
O sistema SHALL disponibilizar uma árvore de aprendizado estruturada em seis graus hierárquicos: Grau I (Magnitude e Fluxo Esquerda-Direita), Grau II (Fatores Notáveis e Divisores Decimais), Grau III (Geometria e Produtos Notáveis), Grau IV (Aproximações e Olho de Fermi), Grau V (Sistemas Formais Históricos: Védica e Trachtenberg) e Grau VI (Aritmética Modular, Soroban Anzan e Transcendência).

#### Scenario: Visualização do mapa da trilha
- **WHEN** o usuário autenticado acessa a tela principal da trilha
- **THEN** o sistema SHALL renderizar a sequência de nós ordenados por Grau, indicando o estado de cada nó (bloqueado, disponível, em progresso, dominado com 1 a 3 estrelas)

### Requirement: Ciclo Pedagógico Tripartite por Nó
Cada nó de técnica da trilha SHALL ser composto obrigatoriamente por 3 etapas sequenciais: (1) Card Teórico Interativo, (2) Exercícios de Andaime Cognitivo com preenchimento guiado dos passos mentais, e (3) Bateria de Fixação com 10 a 20 questões procedurais puras contra o relógio.

#### Scenario: Início de uma lição inédita
- **WHEN** o usuário inicia um nó pela primeira vez
- **THEN** o sistema SHALL apresentar inicialmente o card conceitual animado ilustrando a propriedade algébrica da técnica antes de permitir a entrada nos exercícios

#### Scenario: Transição para o andaime cognitivo
- **WHEN** o usuário conclui a leitura do card teórico
- **THEN** o sistema SHALL exibir de 3 a 5 exercícios guiados onde campos intermediários de decomposição devem ser preenchidos

#### Scenario: Execução da bateria de fixação
- **WHEN** o usuário conclui com sucesso a fase de andaime
- **THEN** o sistema SHALL iniciar a bateria cronometrada de 10 a 20 questões procedurais sem dicas, avaliando precisão e velocidade

### Requirement: Sistema de Maestria com Estrelas e Coroas
O sistema SHALL atribuir de 0 a 3 estrelas para cada nó concluído com base na pontuação ponderada entre percentual de acertos (mínimo de 80% para aprovação) e velocidade média de resposta.

#### Scenario: Conquista de 3 estrelas
- **WHEN** o usuário finaliza a bateria com 100% de acertos e tempo médio por questão inferior ao teto de excelência da técnica
- **THEN** o sistema SHALL premiar o nó com 3 estrelas douradas e atualizar o saldo global de pontos de maestria do perfil

#### Scenario: Falha na bateria de fixação
- **WHEN** o usuário finaliza a bateria com aproveitamento inferior a 80%
- **THEN** o sistema SHALL manter o nó em estado de revisão, exibir relatório de decomposição dos erros e não liberar o nó subsequente

### Requirement: Desbloqueio Dependente de Nós
O sistema SHALL restringir o acesso a nós avançados até que todos os nós pré-requisitos imediatos atinjam no mínimo 1 estrela de maestria.

#### Scenario: Tentativa de acesso a nó bloqueado
- **WHEN** o usuário seleciona um nó cujo pré-requisito não foi concluído
- **THEN** o sistema SHALL exibir estado bloqueado e indicar claramente quais nós anteriores precisam ser concluídos
