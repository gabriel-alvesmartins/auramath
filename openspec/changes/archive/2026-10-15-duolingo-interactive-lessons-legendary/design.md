## Context

Após a conclusão da Frente A, a infraestrutura de onboarding e a tela de vitória estão consolidadas. O ciclo central de lição em `DuolingoLessonView.tsx` agora precisa evoluir de perguntas baseadas puramente em teclado numérico para manipulação tátil direta inspirada no Duolingo Math e no Match Madness, além de consolidar o topo da pirâmide de maestria na trilha (`TrackView.tsx`) com o status Lendário Dourado.

## Goals / Non-Goals

**Goals:**
- Implementar a mecânica interativa `TapToSplitSlate` para cisão tátil de números ($47 \rightarrow 40 + 7$) e fusão de parcelas sem digitação.
- Implementar o modo `MatchMadnessGrid` (grade móvel de 2 colunas com 5 pares simultâneos, buffer deslizante e combo ascendente) tanto como modo independente quanto como drill em lições.
- Suportar o estado `legendary: boolean` no motor de progresso (`@auramath/engine`), atualizando o componente visual `TrackSerpentineNode.tsx` com coroa dourada flamejante e anel Marigold metálico.
- Implementar o fluxo `LegendaryChallengeView` com bateria de 8 questões no nível Difícil e homologação com limiar $\ge 87.5\%$ (7/8).

**Non-Goals:**
- Não incluir bibliotecas de física pesadas (ex: Matter.js); manter animações estritamente em CSS acelerado por GPU (`transform: translate3d/scale`) e Web Animations API.
- Não alterar as regras de retenção já ancoradas (80% para aprovação de nós normais).
- Não criar modos multiplayer online para o Match Madness neste ciclo (focado na experiência local solista ultra-responsiva).

## Decisions

### 1. Primitiva Interativa `TapToSplitSlate` Integrada à Lição
- **Decisão:** Quando uma questão da lição possuir a propriedade `interactionType: 'tap_to_split'`, o visor oculta o `TactileNumpad` e renderiza o quadro cinético `TapToSplitSlate`.
- **Dinâmica:**
  1. O usuário vê a equação (ex: $47 + 38$).
  2. Ao tocar no bloco $[47]$, uma animação elástica o divide em $[40]$ e $[7]$.
  3. Ao tocar no bloco $[38]$, ele se divide em $[30]$ e $[8]$.
  4. O usuário toca em $[40]$ e $[30]$ para fundi-los em $[70]$; depois $[7]$ e $[8]$ para $[15]$; e por fim $[70] + [15] = [85]$.
- **Alternativa Rejeitada:** Drag-and-drop livre em tela inteira. *Motivo:* No mobile de 430px, o toque direto (*tap*) é mais rápido, menos propenso a falhas de pontaria e possui latência perceptual zero em comparação ao arrasto contínuo.

### 2. Match Madness com Janela Deslizante de 5 Pares Ativos
- **Decisão:** Manter uma grade de 2 colunas com exatamente 5 linhas (10 botões táteis no total). Conforme o usuário conecta um par correto, os 2 botões acendem em Verdigris, desaparecem e são repostos imediatamente por novos itens de uma fila de 15 a 20 pares pré-gerados.
- **Estrutura de Gerador:**
  - `generateComplementaryPairs(targetSum = 100, count = 15)`
  - `generateMultiplicationPairs(technique = 'factors_11', count = 15)`
- **Alternativa Rejeitada:** Exibir todos os 15 pares de uma vez. *Motivo:* Inviável ergonomicamente na moldura móvel de 430px sem rolagem e com alto risco de *layout shift*.

### 3. Extensão do Modelo de Maestria para Nós Lendários
- **Decisão:** O tipo de dados `ProgressionNode` no pacote `@auramath/engine` recebe o campo opcional `legendary?: boolean`.
- **Desbloqueio:** O nó precisa ter `stars === 3`. Ao tocar no nó, o popover oferece o botão dourado "DESAFIO LENDÁRIO (8 Questões)".
- **Visual:** Quando `legendary === true`, o nó ganha a classe CSS `.node-legendary`, exibindo uma coroa dourada 3D Marigold sobre o topo, contorno iluminado com brilho pulsante e confetes ao ser clicado.

## Risks / Trade-offs

- **[Risco: Concorrência e toques múltiplos rápidos no Match Madness]** $\rightarrow$ *Mitigação:* Usar controle de estado imutável com trava de transição (lock de 150ms no par selecionado) para evitar desseleção indevida ou condições de corrida nos arrays de reposição.
- **[Risco: Deslocamento de Layout (CLS) na reposição de botões]** $\rightarrow$ *Mitigação:* As 5 linhas da grade possuem altura fixa estrita (`min-height: 56px`), com animação `opacity` e `transform: scale` in-place, garantindo CLS = 0.
