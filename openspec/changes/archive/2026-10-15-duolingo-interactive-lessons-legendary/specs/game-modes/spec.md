## ADDED Requirements

### Requirement: Modo Match Madness de Pares Mentais
O sistema SHALL disponibilizar no Training Hub e em nós curriculares de fixação a modalidade "Match Madness de Pares Mentais", desafiando o usuário a conectar pares de complementares aritméticos ou relações de equivalência algébrica em uma grade interativa de 2 colunas com reposição dinâmica sob pressão de tempo.

#### Scenario: Apresentação da grade de pareamento de 2 colunas
- **WHEN** o modo Match Madness é iniciado
- **THEN** a interface SHALL renderizar duas colunas verticais com 5 botões táteis em cada coluna, contendo termos misturados de 5 pares ativos (ex: coluna esquerda com parcelas $37, 44, 18, 65, 82$ e coluna direita com complementares de 100 $56, 63, 35, 82, 18$).

#### Scenario: Seleção e conexão correta de pares complementares
- **WHEN** o usuário toca em um item da coluna A e no seu complemento correspondente na coluna B
- **THEN** ambos os botões SHALL acender em Verdigris (`#176B5B`), emitir acorde harmônico da escala pentatônica, desaparecer com efeito elástico e serem repostos imediatamente por novos pares até o esgotamento do lote da rodada.

#### Scenario: Seleção de par incorreto
- **WHEN** o usuário seleciona dois itens que não formam um par complementar
- **THEN** ambos os botões SHALL tremer suavemente com contorno Coral Suave (`#E76F61`) por 300ms, desmarcar a seleção sem perda de pontos e manter o fluxo da partida.

#### Scenario: Progressão de Combo e Aceleração Temporal
- **WHEN** o usuário conecta 5 pares consecutivos sem erro
- **THEN** o multiplicador de pontos SHALL subir para 2x (depois 3x em 10 pares) e o cronômetro visual no topo SHALL receber uma bonificação de +3 segundos por marco atingido.
