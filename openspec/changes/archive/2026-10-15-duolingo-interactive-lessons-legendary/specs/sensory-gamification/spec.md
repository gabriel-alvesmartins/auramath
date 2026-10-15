## ADDED Requirements

### Requirement: Mecânica Tátil de Decomposição Numérica por Toque (Tap-to-Split)
A plataforma SHALL implementar a mecânica tátil de Decomposição Numérica por Toque (*Tap-to-Split*), permitindo que números compostos sejam fragmentados ou fundidos diretamente pelo contato dos dedos na tela com física elástica e som tátil em lições interativas.

#### Scenario: Fragmentação posicional de número composto por toque
- **WHEN** o usuário toca em um bloco numérico interativo de 2 dígitos (ex: $[47]$) em uma lição de decomposição
- **THEN** o bloco SHALL se dividir elasticamente em dois sub-blocos táteis separados ($[40]$ e $[7]$), acompanhado de micro-impacto háptico e estalo sonoro sutil.

#### Scenario: Fusão tátil de parcelas parciais
- **WHEN** o usuário toca sucessivamente em dois blocos combináveis (ex: $[40]$ e $[90]$ resultantes da decomposição de $47 + 98$)
- **THEN** os dois blocos SHALL deslizar horizontalmente para o centro, fundindo-se em um único bloco consolidado $[130]$ com nota musical pentatônica ascendente e brilho Verdigris.

#### Scenario: Desdobramento de fator de base próxima (Técnica do 99 ou 98)
- **WHEN** o exercício envolve multiplicação por base próxima (ex: $98 \times 6$) e o usuário toca no bloco $[98]$
- **THEN** o bloco SHALL se expandir com animação sanfonada revelando a expressão algébrica $[(100 - 2)]$, permitindo multiplicar $100 \times 6 = 600$ e $2 \times 6 = 12$ por toques sequenciais.
