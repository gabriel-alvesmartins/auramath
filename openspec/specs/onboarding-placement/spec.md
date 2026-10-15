## Purpose

Provê o funil de primeiro acesso com onboarding acolhedor e placement test adaptativo, garantindo liberdade de escolha do usuário (iniciar do zero, descobrir nível ou selecionar nível com homologação) e reduzindo a evasão inicial.

## Requirements

### Requirement: Funil de Primeiro Acesso com Liberdade Tripartite
O sistema SHALL implementar um fluxo de integração no primeiro acesso apresentando o Mascote Aura, a filosofia editorial *"Não calcule. Veja."* e uma matriz com 3 opções independentes de nivelamento e entrada na plataforma.

#### Scenario: Caminho 1 - Iniciar do Completo Zero
- **WHEN** o usuário seleciona a opção "Iniciar do completo zero" na tela de nivelamento
- **THEN** o sistema SHALL associar o usuário ao Grau 1 (Fundações de Decomposição Aritmética) e encaminhá-lo para a tela de definição de meta diária sem testes adicionais.

#### Scenario: Caminho 2 - Descobrir o Nível com Quiz Progressivo de 10 Questões
- **WHEN** o usuário seleciona a opção "Descobrir o seu nível"
- **THEN** o sistema SHALL apresentar sequencialmente uma bateria de 10 questões progressivas ordenadas por dificuldade cognitiva crescente:
  1. Q1: Adição complementar simples ($7 + 8$)
  2. Q2: Subtração por salto ($52 - 18$)
  3. Q3: Decomposição em dezenas ($45 + 37$)
  4. Q4: Multiplicação com zero terminal ($14 \times 20$)
  5. Q5: Multiplicação por 5 com metade e dezena ($36 \times 5$)
  6. Q6: Decomposição distributiva ($15 \times 12$)
  7. Q7: Técnica do fator 99 ($99 \times 7$)
  8. Q8: Quadrado terminado em 5 ($35^2$)
  9. Q9: Diferença de termos simétricos ($48 \times 52$)
  10. Q10: Fatoração algébrica rápida ($97 \times 96$)
- **AND** computar a pontuação final (0 a 10 acertos) mapeando:
  - 0 a 2 acertos: Grau 1
  - 3 a 4 acertos: Grau 2
  - 5 a 6 acertos: Grau 3
  - 7 a 8 acertos: Grau 4
  - 9 a 10 acertos: Grau 5 ou 6

#### Scenario: Caminho 3 - Selecionar Nível com Homologação de Maestria
- **WHEN** o usuário seleciona a opção "Selecionar o seu nível" e escolhe um Grau alvo entre 1 e 6
- **THEN** o sistema SHALL aplicar um teste de homologação composto por 4 questões específicas dos pré-requisitos daquele Grau:
  - Se o usuário acertar $\ge 75\%$ (3 ou 4 questões), o Grau escolhido SHALL ser confirmado e liberado na trilha.
  - Se o usuário acertar $< 75\%$, o Mascote Aura SHALL sugerir empaticamente o Grau anterior com andaime de apoio, permitindo que o usuário aceite a recomendação ou repita a verificação.

### Requirement: Definição de Meta Diária e Ritual de Prática
O funil de onboarding SHALL solicitar ao usuário a escolha de um compromisso diário de dedicação temporal antes de ingressar na trilha.

#### Scenario: Escolha da meta diária
- **WHEN** o usuário avança para a etapa de meta de estudo
- **THEN** o sistema SHALL oferecer 3 patamares táteis:
  - "Faísca" (3 minutos por dia — 1 lição)
  - "Foco" (7 minutos por dia — 2 lições)
  - "Maestria Fibonacci" (15 minutos por dia — imersão profunda)
- **AND** armazenar a preferência de meta diária no estado de gamificação do usuário.

### Requirement: Persistência do Estado de Onboarding e Opção de Pular
O sistema SHALL registrar no armazenamento local a conclusão do primeiro acesso e oferecer saída direta para a trilha sem fricção.

#### Scenario: Persistência de conclusão
- **WHEN** o usuário conclui o fluxo de onboarding ou responde a última etapa
- **THEN** o sistema SHALL gravar a flag `auramath_onboarded = 'true'` e o nó inicial desbloqueado no `localStorage`, assegurando que visitas subsequentes abram diretamente a Trilha.

#### Scenario: Opção de pular integração
- **WHEN** o usuário toca no botão "Pular" ou "Explorar sem teste" durante o onboarding
- **THEN** o sistema SHALL registrar a conclusão padrão com Grau 1 e redirecionar imediatamente para a Trilha de Aprendizado.
