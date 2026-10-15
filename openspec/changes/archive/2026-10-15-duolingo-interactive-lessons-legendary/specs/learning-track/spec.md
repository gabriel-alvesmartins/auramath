## ADDED Requirements

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
