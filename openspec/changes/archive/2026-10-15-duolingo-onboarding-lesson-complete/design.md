# Technical Design: Duolingo Transmutation - Onboarding & Lesson Victory Choreography

## Context

Atualmente o AuraMath gerencia seu ciclo de vida em `src/App.tsx` através de uma máquina de rotas simples (`track`, `train`, `duels`, `profile`, `lesson`, `dev`). Não há rota ou estado para receber novos usuários nem verificar seu nível cognitivo de cálculo mental. Além disso, `LessonCompleteView.tsx` renderiza todos os cards de forma síncrona no primeiro quadro, sem orquestração temporal.

Este design formaliza a arquitetura dos novos componentes de onboarding e a reestruturação da tela de vitória, obedecendo às leis do compêndio Duolingo ➔ AuraMath (`docs/DUOLINGO_TO_AURAMATH_MASTER_COMPENDIUM.md`) e à skill `duolingo-transmutation`.

## Goals / Non-Goals

**Goals:**
- Implementar a máquina de estados do Onboarding Tripartite (`welcome`, `mode_select`, `diagnostic_quiz`, `level_picker_verify`, `daily_goal`, `celebrate_placement`).
- Construir o motor do Quiz Diagnóstico de 10 Questões Progressivas mapeando pontuação para Graus 1 a 6.
- Construir o Seletor de Nível com Homologação de Maestria (4 questões específicas, limiar de 75%).
- Refatorar o `LessonCompleteView.tsx` em uma timeline de 5 fases (0.0s a 3.5s) com contagem de XP tabular e carimbo semanal da ofensiva.
- Adicionar opção de avanço rápido (tap to skip to end) na vitória para não atrasar usuários avançados.
- Garantir zero layout shift (CLS = 0) e física tátil 3D a 0ms com `audioSynth.playKeypressTick()`.

**Non-Goals:**
- Implementar o backend completo de sincronização em nuvem do placement test (o estado é local-first persistido via `localStorage` e integrado ao `AuthContext`).
- Implementar as novas primitivas de lição (Tile Decomposition e Match Madness), que fazem parte da Frente B posterior.
- Implementar paywall real de cartão de crédito para o Aura Fibonacci neste momento (apenas o modelo de dados de metas e tags de prestígio).

## Decisions

### Decisão 1: Máquina de Estados Local para o Onboarding (`OnboardingFlowView.tsx`)
- **Escolha:** Encapsular todas as etapas do onboarding em um componente controlador com máquina de estados interna (`step: 'welcome' | 'mode_select' | 'diagnostic' | 'level_picker' | 'goal' | 'complete'`) em vez de criar 5 rotas hash separadas no browser (`#/onboarding/1`, `#/onboarding/2`...).
- **Justificativa:** Elimina problemas com o botão de voltar do navegador desregulando o fluxo e garante transições suaves de fade/slide entre as etapas sem recarregamentos.
- **Alternativa Considerada:** Sub-rotas via URL — descartada pela instabilidade em navegadores móveis e potencial perda de estado em recarregamentos involuntários.

### Decisão 2: Banco de Questões do Diagnóstico Progressivo
- **Escolha:** Gerar as 10 questões a partir de templates determinísticos cobrindo o espectro curricular:
  1. Soma complementar (Grau 1)
  2. Subtração por salto (Grau 1)
  3. Decomposição em dezenas (Grau 2)
  4. Multiplicação por zero terminal (Grau 2)
  5. Multiplicação por 5 (Grau 3)
  6. Decomposição distributiva (Grau 3)
  7. Técnica do fator 99 (Grau 4)
  8. Quadrados terminados em 5 (Grau 4)
  9. Produto simétrico $(a-b)(a+b)$ (Grau 5)
  10. Fatoração rápida de base 100 (Grau 6)
- **Justificativa:** Permite avaliar de forma precisa tanto iniciantes quanto calculistas avançados em menos de 2 minutos.
- **Alternativa Considerada:** Algoritmo IRT (Teoria de Resposta ao Item) complexo — descartado pelo excesso de latência e complexidade desnecessária para o escopo inicial.

### Decisão 3: Orquestração Temporal do `LessonCompleteView` com Fast-Forward
- **Escolha:** Utilizar um temporizador interno com `setTimeout` encadeado para cada fase (Fase 1 ➔ Fase 5), com um manipulador global de clique/espaço que imediatamente força o estado para `ready` caso o usuário queira pular a animação.
- **Justificativa:** Respeita o princípio da neurociência da retenção (recompensa dopaminérgica) sem frustrar usuários experientes que desejam ir logo para a próxima lição.
- **Alternativa Considerada:** Animação pura via CSS sem sincronização de estado React — descartada porque o disparo de áudio dos ticks de XP e confetes precisa ser orquestrado por código TypeScript imperativo.

## Risks / Trade-offs

- **[Risco: Abandono durante as 10 questões do diagnóstico]**  
  *Mitigação:* Exibir uma barra de progresso visual fina e contínua no topo, balões de micro-incentivo da Aura a cada 3 acertos e um botão discreto no rodapé: *"Prefiro ir direto para a Trilha (Grau 1)"*.
- **[Risco: Áudio suspenso no cold load do Onboarding]**  
  *Mitigação:* Conectar a ativação do `audioSynth.init()` ao primeiro toque no botão "COMEÇAR" da tela de boas-vindas.
- **[Risco: Quebra de testes de regressão existentes de vitória da lição]**  
  *Mitigação:* Manter a interface de props `LessonCompleteViewProps` idêntica (`nodeTitle`, `xpEarned`, `accuracy`, `currentStreak`, `actualTimeSeconds`, `standardTimeSeconds`, `onContinue`), preservando compatibilidade com runners de teste.
