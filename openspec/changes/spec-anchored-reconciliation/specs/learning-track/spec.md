## RENAMED Requirements

FROM: Estrutura em 6 Graus de Maestria
TO: Estrutura em 7 Graus de Maestria

## MODIFIED Requirements

### Requirement: Estrutura em 7 Graus de Maestria
O sistema SHALL disponibilizar uma árvore de aprendizado estruturada em sete graus hierárquicos:
1. **Grau I (Magnitude e Decomposição Posicional)**: Eliminação do "vai-um", fusão da esquerda para a direita, compensação subtrativa e complemento de base 100.
2. **Grau II (Fatores Notáveis e Decomposição Decimal)**: Multiplicação decimal rápida por 5, 25, 11 (acordeão elástico), fatores entre 11 e 19 e números terminados em 1.
3. **Grau III (Geometria e Produtos Notáveis)**: Visualização geométrica de áreas e simetrias algébricas ocultas, diferença de quadrados $(a-b)(a+b)$, quadrados terminados em 5 e aproximação por 50.
4. **Grau IV (Aproximações e Olho de Fermi)**: Discriminação instantânea de ordens de grandeza em potências de 10, divisão rápida por 5, 25 e 4, e frações unitárias.
5. **Grau V (Sistemas Formais Históricos)**: Matemática Védica (Yavadunam e multiplicação cruzada), método Trachtenberg para 12, raízes perfeitas e Regra do 72 para juros compostos.
6. **Grau VI (Transcendência, Flash Anzan e Prova dos 9/11)**: Eliminação do suporte verbal interno, Soroban mental visuoespacial de somatório contínuo, e técnica de raízes digitais (Prova dos Nove e Prova dos Onze).
7. **Grau VII (Porcentagens e Proporções do Cotidiano)**: Aplicação estrutural no cotidiano através de pivôs de 10% e 1%, acréscimos/descontos, gorjetas de 15% e propriedade de simetria comutativa percentual ($x\%$ de $y = y\%$ de $x$).

#### Scenario: Visualização do mapa da trilha
- **WHEN** o usuário autenticado acessa a tela principal da trilha
- **THEN** o sistema SHALL renderizar a sequência de nós ordenados pelos 7 Graus normativos, indicando o estado de cada nó (bloqueado, disponível, em progresso, dominado com 1 a 3 estrelas)

### Requirement: Ciclo Pedagógico Tripartite por Nó
Cada nó de técnica da trilha SHALL ser composto obrigatoriamente por 3 etapas sequenciais: (1) Card Teórico Interativo específico para a propriedade da técnica, (2) Exercícios de Andaime Cognitivo com preenchimento guiado dos passos mentais (3 a 5 exercícios), e (3) Bateria de Fixação com 10 a 20 questões procedurais calibradas em 3 níveis de dificuldade (1★ Fácil, 2★ Médio, 3★ Difícil).

#### Scenario: Início de uma lição inédita
- **WHEN** o usuário inicia um nó pela primeira vez
- **THEN** o sistema SHALL apresentar o card conceitual específico ilustrando a propriedade algébrica da técnica antes de permitir a entrada nos exercícios

#### Scenario: Transição para o andaime cognitivo
- **WHEN** o usuário conclui a leitura do card teórico
- **THEN** o sistema SHALL exibir de 3 a 5 exercícios guiados onde campos intermediários de decomposição devem ser preenchidos

#### Scenario: Execução da bateria de fixação
- **WHEN** o usuário conclui com sucesso a fase de andaime
- **THEN** o sistema SHALL iniciar a bateria cronometrada de 10 a 20 questões procedurais calibradas no nível de dificuldade correspondente (1★ Fácil, 2★ Médio, 3★ Difícil)

### Requirement: Sistema de Maestria com Estrelas e Coroas
O sistema SHALL atribuir de 0 a 3 estrelas para cada nó concluído com base na pontuação ponderada, exigindo no mínimo 80% de acertos para aprovação e desbloqueio do nó seguinte.

#### Scenario: Conquista de 3 estrelas
- **WHEN** o usuário finaliza a bateria com 100% de acertos e tempo médio por questão inferior ao teto de excelência da técnica
- **THEN** o sistema SHALL premiar o nó com 3 estrelas douradas e atualizar o saldo global de pontos de maestria do perfil persistindo o progresso

#### Scenario: Falha na bateria de fixação
- **WHEN** o usuário finaliza a bateria com aproveitamento inferior a 80%
- **THEN** o sistema SHALL manter o nó em estado de revisão, exibir relatório de decomposição dos erros e não liberar o nó subsequente
