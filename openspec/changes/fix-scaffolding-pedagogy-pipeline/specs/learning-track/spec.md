## MODIFIED Requirements

### Requirement: Ciclo Pedagógico Tripartite por Nó
Cada nó de técnica da trilha SHALL ser composto obrigatoriamente por 3 etapas sequenciais e funcionais: (1) Card Teórico Interativo com representação visual/editorial correspondente à técnica, (2) Andaime Cognitivo composto por no mínimo 3 exercícios guiados com correspondência estrita e completa entre lacunas do template e chaves interativas (garantindo que nenhuma etapa intermediária seja suprimida visualmente), e (3) Bateria de Fixação com 10 questões procedurais puras com seleção de dificuldade.

#### Scenario: Início de uma lição inédita
- **WHEN** o usuário inicia um nó pela primeira vez
- **THEN** o sistema SHALL apresentar inicialmente o card conceitual animado ilustrando a propriedade algébrica da técnica antes de permitir a entrada nos exercícios

#### Scenario: Transição para o andaime cognitivo
- **WHEN** o usuário conclui a leitura do card teórico
- **THEN** o sistema SHALL exibir exatamente 3 exercícios guiados onde campos intermediários de decomposição devem ser preenchidos visualmente sem qualquer ausência de caixa de entrada interativa

#### Scenario: Execução da bateria de fixação
- **WHEN** o usuário conclui com sucesso a fase de andaime
- **THEN** o sistema SHALL iniciar a bateria cronometrada de 10 a 20 questões procedurais sem dicas, avaliando precisão e velocidade
