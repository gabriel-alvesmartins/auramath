## MODIFIED Requirements

### Requirement: Decomposição de Passos Cognitivos (Andaime / Scaffolding)
O sistema SHALL produzir, juntamente com a expressão e a resposta final de cada técnica, uma árvore ordenada de etapas mentais intermediárias modeladas em templates estruturados, onde cada marcador `{chave}` possua obrigatoriamente um objeto descritor correspondente no array de lacunas `blanks` com valor esperado e rótulo explicativo, sem qualquer divergência entre o identificador do template e a chave da lacuna.

#### Scenario: Geração de scaffolding para diferença de quadrados
- **WHEN** a técnica selecionada for `DIFF_OF_SQUARES` com os operandos 47 e 53
- **THEN** o motor SHALL retornar o ponto médio `50`, o semidesvio `3`, e a decomposição em etapas: `Passo 1: 50^2 = 2500`, `Passo 2: 3^2 = 9`, `Passo 3: 2500 - 9 = 2491`, com todas as lacunas correspondendo exatamente às chaves do template

#### Scenario: Validação de resposta de passo intermediário
- **WHEN** o usuário estiver no modo de andaime e submeter o valor do primeiro passo intermediário
- **THEN** o sistema SHALL validar se a resposta intermediária coincide com o cálculo estrutural esperado antes de liberar o próximo passo

#### Scenario: Ausência de lacunas órfãs ou templates sem campos
- **WHEN** qualquer nó da trilha for consultado para obtenção de andaimes cognitivos
- **THEN** o motor SHALL garantir que todo marcador entre chaves no template possua uma lacuna no vetor de `blanks` e que nenhuma lacuna fique invisível no DOM
