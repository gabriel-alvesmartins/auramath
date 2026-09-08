## Purpose

O motor matemático procedural define os algoritmos computacionais responsáveis por gerar problemas de cálculo mental infinitos, determinísticos e pedagógicos baseados em propriedades algébricas estruturais, calcular etapas cognitivas intermediárias (scaffolding), gerar distratores de ordens de grandeza para aproximação e auditar telemetria temporal para prevenção de fraudes.

## ADDED Requirements

### Requirement: Geração Procedural Paramétrica de Problemas Aritméticos
O sistema SHALL fornecer geradores procedurais independentes para cada técnica dos 6 Graus da taxonomia cognitiva, recebendo parâmetros de dificuldade (Nível 1, Nível 2, Nível 3) e uma semente pseudoaleatória opcional para garantir determinismo e reprodutibilidade de partidas.

#### Scenario: Geração de multiplicação por 25 no Nível 1
- **WHEN** o motor recebe a requisição para a técnica `MULT_25` no nível `EASY`
- **THEN** o sistema SHALL gerar uma expressão matemática onde o multiplicando é um número inteiro par divisível por 4 entre 12 e 96, com gabarito exato igual a `(multiplicando / 4) * 100`

#### Scenario: Geração com semente determinística para duelos
- **WHEN** dois clientes solicitam uma partida com a mesma semente `SEED_12345`
- **THEN** o motor SHALL produzir exatamente a mesma sequência idêntica de operandos e operações para ambos os jogadores

### Requirement: Decomposição de Passos Cognitivos (Andaime / Scaffolding)
O sistema SHALL produzir, juntamente com a expressão e a resposta final, uma árvore ordenada de etapas mentais intermediárias explicando o atalho cognitivo específico daquela técnica.

#### Scenario: Geração de scaffolding para diferença de quadrados
- **WHEN** a técnica selecionada for `DIFF_OF_SQUARES` com os operandos 47 e 53
- **THEN** o motor SHALL retornar o ponto médio `50`, o semidesvio `3`, e a decomposição em etapas: `Passo 1: 50^2 = 2500`, `Passo 2: 3^2 = 9`, `Passo 3: 2500 - 9 = 2491`

#### Scenario: Validação de resposta de passo intermediário
- **WHEN** o usuário estiver no modo de andaime e submeter o valor do primeiro passo intermediário
- **THEN** o sistema SHALL validar se a resposta intermediária coincide com o cálculo estrutural esperado antes de liberar o próximo passo

### Requirement: Geração de Distratores para Estimativa e Aproximação (Módulo Fermi)
Para problemas da categoria de aproximação e cálculo rápido de vestibulares/concursos, o sistema SHALL gerar automaticamente 4 opções de múltipla escolha onde os distratores representem erros cognitivos frequentes de ordem de grandeza (fatores de 10x, 100x ou arredondamentos assimétricos).

#### Scenario: Geração de alternativas com ordens de grandeza distintas
- **WHEN** o motor gera uma questão de estimativa como `3890 / 19`
- **THEN** o sistema SHALL definir a resposta aproximada correta como `200` e os distratores como `20`, `2.000` e `20.000`, assegurando que o cálculo exato não seja necessário para discriminar a alternativa

### Requirement: Verificação de Integridade Aritmética Modular
O motor SHALL implementar validações algorítmicas de congruência módulo 9 (Prova dos Noves) e congruência módulo 11 (Prova dos Onzes) para verificar a consistência dos resultados e para uso pedagógico nas lições do Grau VI.

#### Scenario: Execução da Prova dos 11
- **WHEN** o motor valida o produto `543 * 32 = 17376`
- **THEN** o sistema SHALL calcular a soma alternada dos dígitos `(6 - 7 + 3 - 7 + 1 = -4 -> 7 mod 11)` e confirmar a congruência com os fatores `(543 mod 11 = 4)` e `(32 mod 11 = 10)`, onde `(4 * 10) mod 11 = 7`

### Requirement: Auditoria Temporal Anti-Cheat
O motor de validação SHALL registrar o timestamp de exibição da questão e o timestamp de recebimento da resposta, rejeitando pontuações geradas com latência inferior ao limiar cognitivo e motor humanamente viável.

#### Scenario: Resposta submetida abaixo do tempo mínimo humano
- **WHEN** uma resposta para uma conta de 4 dígitos for recebida em menos de 150 milissegundos após o envio da questão
- **THEN** o sistema SHALL sinalizar a resposta como suspeita (bot/script), anular a bonificação de combo e registrar o evento de telemetria anômala
