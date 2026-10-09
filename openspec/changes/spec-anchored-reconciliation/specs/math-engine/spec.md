## MODIFIED Requirements

### Requirement: Geração Procedural Paramétrica de Problemas Aritméticos
O sistema SHALL fornecer geradores procedurais independentes para cada técnica dos 7 Graus da taxonomia cognitiva, recebendo parâmetros de dificuldade (1 estrela = Fácil, 2 estrelas = Médio, 3 estrelas = Difícil) e uma semente pseudoaleatória opcional para garantir determinismo e reprodutibilidade de partidas e do Desafio Diário.

#### Scenario: Geração de multiplicação por 25 no Nível 1
- **WHEN** o motor recebe a requisição para a técnica `MULT_25` no nível 1★ (Fácil)
- **THEN** o sistema SHALL gerar uma expressão matemática onde o multiplicando é um número inteiro par divisível por 4 entre 12 e 96, com gabarito exato igual a `(multiplicando / 4) * 100`

#### Scenario: Geração com semente determinística para duelos
- **WHEN** dois clientes solicitam uma partida com a mesma semente `SEED_12345`
- **THEN** o motor SHALL produzir exatamente a mesma sequência idêntica de operandos e operações para ambos os jogadores

### Requirement: Geração de Distratores para Estimativa e Aproximação (Módulo Fermi)
Para problemas da categoria de aproximação e ordem de grandeza, o sistema SHALL gerar alternativas de múltipla escolha onde os distratores representem saltos de potências de 10 ($10\times$, $100\times$, $0{,}1\times$) e onde o gabarito correto seja a aproximação por ordem de magnitude, assegurando que o cálculo fino exato não seja exigido para resolver a questão.

#### Scenario: Geração de alternativas com ordens de grandeza distintas
- **WHEN** o motor gera uma questão de estimativa como $3890 / 19 \approx ?$
- **THEN** o sistema SHALL definir a resposta aproximada correta como $200$ e os distratores como $20$, $2000$ e $20000$, assegurando que o cálculo exato não seja necessário para discriminar a alternativa

### Requirement: Verificação de Integridade Aritmética Modular
O motor SHALL disponibilizar geradores pedagógicos para o Grau VI dedicados ao aprendizado da conferência por raízes digitais (módulo 9 e módulo 11), executados dentro do motor procedural principal `@auramath/engine` sem dependência de subsistemas paralelos.

#### Scenario: Execução da Prova dos 11
- **WHEN** o motor valida ou demonstra pedagogicamente o produto `543 * 32 = 17376`
- **THEN** o sistema SHALL calcular a soma alternada dos dígitos `(6 - 7 + 3 - 7 + 1 = -4 -> 7 mod 11)` e confirmar a congruência com os fatores `(543 mod 11 = 4)` e `(32 mod 11 = 10)`, onde `(4 * 10) mod 11 = 7`

### Requirement: Auditoria Temporal Anti-Cheat
[Fase Futura] O motor de validação SHALL registrar o timestamp de exibição da questão e o timestamp de recebimento da resposta, rejeitando pontuações geradas com latência inferior ao limiar cognitivo e motor humanamente viável (< 150ms).

#### Scenario: Resposta submetida abaixo do tempo mínimo humano
- **WHEN** uma resposta para uma conta de 4 dígitos for recebida em menos de 150 milissegundos após o envio da questão
- **THEN** o sistema SHALL sinalizar a resposta como suspeita (bot/script), anular a bonificação de combo e registrar o evento de telemetria anômala
