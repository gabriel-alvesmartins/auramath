## Why

Após o sucesso da Frente A (Onboarding Tripartite e Cascata de Vitória), o AuraMath precisa elevar a maturidade do ciclo central de lição (*core learning loop*). Atualmente, a interação na lição depende majoritariamente de digitação no teclado numérico tátil. Para atingir o ápice da retenção dopaminérgica do Duolingo e concretizar o lema *"Não calcule. Veja."*, precisamos transformar a interação matemática em manipulação física direta através de:
1. Decomposição tátil de números com toque direto (*Tap-to-Split*), permitindo que o usuário quebre dezenas e unidades com os dedos.
2. Match Madness de pares complementares e produtos notáveis com tempo ágil, elevando a fluência e memória de trabalho.
3. Desafios de Nós Lendários Dourados (*Legendary Mastery Nodes*) na trilha de aprendizado, concedendo a coroa dourada e o halo Marigold aos nós com 3 estrelas conquistadas.

## What Changes

- **Mecânica de Decomposição por Toque (Tap-to-Split)**: Nova primitiva de exercício interativo onde números compostos (ex: $47$, $98$, $125$) podem ser tocados para se cindirem fisicamente em blocos táteis com mola elástica (ex: $[40]$ e $[7]$), permitindo operações combinatórias diretas sem digitação.
- **Modo Match Madness de Pares Mentais**: Nova modalidade no Training Hub e em lições especiais, apresentando uma grade de 2 colunas com 10 pares complementares (que somam 100, 1000 ou equivalências visuais como $15 \times 12 \leftrightarrow 180$) com contador regressivo, combo sonoro harmônico e física tátil 3D.
- **Nível Lendário na Trilha (Legendary Crown Mastery)**: Extensão do modelo de progressão de estrelas para suportar o estado `legendary` nos nós com 3 estrelas. Ao ativar o modo Lendário, o nó exibe visual dourado brilhante com esquadro de acrílico e coroa áurea, exigindo um desafio de 8 questões sem andaimes para consagrar a maestria.

## Capabilities

### Modified Capabilities
- `learning-track`: Adiciona o requisito de progressão do Nível Lendário Dourado (requisito de 3 estrelas prévias, desafio de 8 questões sem andaimes e coroa visual Marigold permanente).
- `game-modes`: Adiciona o requisito do modo Match Madness de Pares Mentais com seleção emparelhada de 2 colunas, detecção de complementares e progressão de combo com tempo dinâmico.
- `sensory-gamification`: Adiciona o requisito da mecânica tátil de Decomposição Numérica por Toque (*Tap-to-Split*), com animação elástica de cisão, união tátil e sonoplastia pentatônica na fragmentação.

## Impact

- `@auramath/engine`: Extensão dos tipos de nó (`ProgressionState`, nós com status `legendary`), novos geradores de pares para Match Madness (`generateMatchPairs`) e lógica de validação de split.
- `src/components/tactile/`: Novo componente `TapToSplitSlate.tsx`, componente `MatchMadnessGrid.tsx` e atualização de `TrackSerpentineNode.tsx` com coroa dourada e auréola Marigold.
- `src/views/`: Atualização de `DuolingoLessonView.tsx` para renderizar tipos interativos de lição e `TrackView.tsx` com modal de desafio lendário.
- Testes: Novas suites de testes unitários e E2E garantindo 100% de cobertura e conformidade Spec-Anchored.
