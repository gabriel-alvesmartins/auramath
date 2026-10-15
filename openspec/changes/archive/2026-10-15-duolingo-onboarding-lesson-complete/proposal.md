# Proposal: Duolingo Transmutation - Onboarding Tripartite & Victory Choreography

## Why

Atualmente o AuraMath direciona o usuário frio no primeiro acesso diretamente para a Trilha de Aprendizado (`/track`), sem nenhum acolhimento conceitual, teste de nivelamento adaptativo ou contrato de meta diária. Essa carência eleva a taxa de abandono inicial (churn de D1) em comparação com o benchmark da indústria extraído das 1.103 telas do Duolingo (`01_Onboarding_and_Welcome`).

Simultaneamente, a tela de vitória de lição (`LessonCompleteView.tsx`) exibe cards estáticos de forma instantânea, perdendo a "Cachoeira de Dopamina" (coreografia temporal em 5 fases com confetes, contagem progressiva de XP com haptics, inflamação da chama de ofensiva no calendário semanal e avanço de meta diária).

Esta proposta estabelece a transmutação soberana desses dois fluxos nucleares, garantindo a liberdade de entrada do usuário em 3 caminhos e a orquestração sensorial de vitória sem introduzir elementos punitivos ou violar a filosofia editorial *"Não calcule. Veja."*.

## What Changes

- **Novo Funil de Onboarding Tripartite**:
  - Tela 1: Boas-vindas do Mascote Aura apresentando a filosofia da descoberta e o contraste do sofrimento tradicional ($98+47$) vs. atalho visual ($100+45=145$).
  - Tela 2: Matriz de Liberdade com 3 caminhos de entrada:
    1. *Iniciar do Zero*: posicionamento imediato no Grau 1 (Fundações).
    2. *Descobrir meu Nível*: bateria diagnóstica de 10 questões progressivas ordenadas por dificuldade cognitiva (aditiva, distributiva, simétrica, algébrica).
    3. *Selecionar meu Nível*: seletor direto de Grau (1 a 6) seguido por teste de homologação de 4 questões daquele nível específico ($\ge 75\%$ de acerto exigido).
  - Tela 3: Definição de Meta Diária (3 min "Faísca", 7 min "Foco", 15 min "Maestria Fibonacci").
  - Tela 4: Chegada na Trilha com o nó recomendado destravado e celebração do primeiro passo.
- **Detecção Automática de Primeiro Acesso em `src/App.tsx`**: Roteia novos visitantes para `onboarding` com persistência em `localStorage` e opção de pular direto para a Trilha a qualquer momento.
- **Coreografia em 5 Fases do `LessonCompleteView.tsx` (Dopamine Waterfall)**:
  - Fase 1 (0.0s - 0.7s): Entrada monumental do Prisma/Aura (Supernova), confetes editoriais e acorde pentatônico ascendente.
  - Fase 2 (0.8s - 1.4s): Queda elástica dos cards táteis 3D (XP, Precisão %, Segundos Poupados).
  - Fase 3 (1.4s - 2.1s): Contador de XP tabular (`.font-mono-tabular`) incrementa de 0 ao valor final com ticks de áudio sincronizados via `audioSynth`.
  - Fase 4 (2.1s - 2.8s): Card de Ofensiva inflama a chama Marigold e carimba o dia atual na régua semanal.
  - Fase 5 (2.8s - 3.5s): Barra da Meta Diária avança e botão tátil 3D "PRÓXIMO INSIGHT ➔" pulsa com foco de toque.

## Capabilities

### New Capabilities
- `onboarding-placement`: Cobre o funil completo de primeiro acesso (filosofia de boas-vindas, matriz tripartite de entrada: Iniciar do Zero, Quiz Diagnóstico de 10 Questões Progressivas, e Seletor com Homologação de Grau, mais a definição da Meta Diária).

### Modified Capabilities
- `sensory-gamification`: Atualização dos requisitos de celebração de vitória da lição para exigir a coreografia temporal sequenciada em 5 fases (dopamine waterfall) e carimbo de calendário semanal na ofensiva.
- `ui-design-system`: Requisitos para novos componentes visuais de onboarding e atualização estrutural do `LessonCompleteView` com animações em timeline CSS e CLS = 0.

## Impact

- **Código Afetado**:
  - `src/views/onboarding/OnboardingFlowView.tsx` (novo)
  - `src/views/onboarding/DiagnosticQuizView.tsx` (novo)
  - `src/views/onboarding/LevelPickerVerifyView.tsx` (novo)
  - `src/views/LessonCompleteView.tsx` (refatoração estrutural da coreografia)
  - `src/App.tsx` (adiciona rota `onboarding` e guarda de cold load)
- **APIs & Dependências**:
  - `packages/engine`: utilitários de geração de questões de diagnóstico e verificação de grau.
  - `audioSynth.ts`: sonoplastia de ticks progressivos e acorde pentatônico de celebração.
  - Zero novas dependências externas no `package.json`.
