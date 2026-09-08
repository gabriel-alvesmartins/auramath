# Technical Design: Auramath UI Design System & Visual Architecture

## Context

Para motivação e objetivos gerais desta mudança, consulte `proposal.md`. Para os requisitos normativos de comportamento da interface, consulte `specs/ui-design-system/spec.md`.

O Auramath é construído sobre **React Native com Expo** para suportar Web (PWA), iOS e Android a partir de uma única base de código. O cálculo mental de alta velocidade exige uma interface imersiva, com zero latência perceptiva, feedback tátil-visual imediato e foco cognitivo ininterrupto.

---

## Goals / Non-Goals

### Goals
- **Imersão & Ergonomia Visual**: Paleta Dark Glassmorphism que previne fadiga ocular durante sessões intensas de treino mental.
- **Zero Layout Shift (CLS = 0)**: Garantir que nenhum elemento da tela se mova quando os dígitos da conta mudarem de 1 para 4 caracteres ou durante a contagem de tempo.
- **Micro-interações de Toque a 120 FPS**: Componentes de digitação (`NumpadButton`) com resposta no evento `onTouchStart`, eliminando os 300ms de latência de cliques convencionais.
- **Acessibilidade de Alto Contraste**: Relação de contraste mínima de 4.5:1 (WCAG AA) e áreas mínimas de toque de 56x56dp para botões interativos.

### Non-Goals
- Não suportar tema claro (Light Mode) na tela de jogo principal; o universo sensorial do Auramath e os efeitos de plasma bioluminescente são projetados especificamente para contrastar sobre o fundo cósmico Midnight Obsidian.
- Não utilizar bibliotecas pesadas de UI de terceiros (como Material UI ou Paper); todos os componentes são estilizados através de design tokens puros e primitivos do React Native com Reanimated.

---

## Decisions

### 1. Paleta Cromática Cósmica & Tokens Semânticos

A paleta é inspirada em estética *Cyber-Cosmic / Bioluminescent Glass*, combinando superfícies escuras profundas com acentos de energia de alta luminosidade:

| Token | Hex / RGBA | Papel Semântico & Aplicação |
| :--- | :--- | :--- |
| `bg-obsidian` | `#07090E` | Fundo principal da aplicação (preto azulado cósmico). |
| `surface-glass` | `rgba(13, 17, 26, 0.75)` | Cartões, gavetas e painéis com desfoque `backdrop-blur: 16px`. |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Linhas de borda finas (1px) de acabamento em vidro temperado. |
| `primary-cyan` | `#00F2FE` | Energia mental, foco, botões de ação e números principais. |
| `accent-violet` | `#8A2BE2` | Núcleo do mascote Aura, combos intermediários e nós desbloqueados. |
| `plasma-magenta` | `#E11D48` | Multiplicadores elevados (x10+) e destaques de sobrecarga. |
| `gold-stellar` | `#FACC15` | Patamar Supernova / Godmode, 3 estrelas e recordes mundiais. |
| `success-emerald`| `#10B981` | Validação de resposta correta e metas diárias atingidas. |
| `error-coral` | `#FB7185` | Destaque empático de erro de cálculo (sem hostilidade visual). |
| `text-primary` | `#F8FAFC` | Texto principal de alto contraste (branco leitoso). |
| `text-secondary` | `#94A3B8` | Rótulos de apoio, atalhos e dicas pedagógicas. |

* **Racional:** Tons de ciano e violeta possuem excelente contraste sobre `#07090E` sem ofuscar a visão. O uso de *Soft Coral* no lugar de vermelho puro `#FF0000` reduz o estresse psicológico do erro.
* **Alternativas consideradas:** Tema cinza neutro tradicional (rejeitado por parecer monótono e corporativo, quebrando a vibe de jogo arcade).

---

### 2. Pilha Tipográfica Híbrida & Glifos Tabulares

```
+-------------------------------------------------------------------------+
|                           PILHA TIPOGRÁFICA                             |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ DISPLAY / HEADINGS ]       Space Grotesk / Plus Jakarta Sans (Bold)  |
|  - Títulos de tela            "AURAMATH", "BLITZ 60s", "GRAU IV"        |
|                                                                         |
|  [ NÚMEROS / EQUAÇÕES ]       JetBrains Mono (tabular-nums / 700)       |
|  - Equação central            "4 8  x  5 2  =  [ 2496 ]"                |
|  - Cronômetros e placares     "00:42.85"                                |
|                                                                         |
|  [ UI / CORPO DE TEXTO ]      Inter (Regular / Medium)                  |
|  - Rótulos, teoria e dicas    "Divida por 4 e multiplique por 100"      |
|                                                                         |
+-------------------------------------------------------------------------+
```

* **Decisão:** Forçar `font-variant-numeric: tabular-nums` e largura monoespaçada estrita em todo o pipeline de números.
* **Racional:** Em fontes não-tabulares, o número `1` tem largura de 8px e o `8` tem largura de 14px. Quando o cronômetro ou a conta muda, o layout trepida em alta velocidade (layout shift), cansando o cérebro. Com `tabular-nums`, todos os números ocupam exatamente a mesma largura física na tela.
* **Alternativas consideradas:** Usar fonte comum do sistema (`Roboto` / `San Francisco`) sem configuração tabular (rejeitada por jitter visual severo).

---

### 3. Escalas de Espaçamento, Raios Squircle e Elevação

* **Escala de Espaçamento (Base 4px):**
  - `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-12` (48px), `space-16` (64px).
* **Escala de Raio Squircle:**
  - `radius-xs`: 4px (tags de técnica e badges)
  - `radius-sm`: 8px (teclas de controle menores)
  - `radius-md`: 12px (teclas do Numpad in-app)
  - `radius-lg`: 16px (cartões de questão e painéis)
  - `radius-xl`: 24px (painel central da equação e modais)
  - `radius-full`: 9999px (pílulas de streak e nós da árvore)
* **Elevação por Halos Bioluminescentes (Glows):**
  - Em interfaces escuras, sombras pretas tradicionais (`box-shadow: 0 4px 10px #000`) são invisíveis.
  - O Auramath utiliza sombras luminosas com baixa opacidade e alto desfoque:
    - `glow-cyan`: `0px 0px 24px rgba(0, 242, 254, 0.25)`
    - `glow-violet`: `0px 0px 32px rgba(138, 43, 226, 0.30)`
    - `glow-supernova`: `0px 0px 48px rgba(250, 204, 21, 0.40)`

---

### 4. Tratamento dos Componentes Táticos

#### A. `NumpadButton` (Tecla do Teclado In-App)
- Dimensão: Mínimo de 56x56dp (proporção áurea no grid 3x4).
- Superfície: Fundo `rgba(255, 255, 255, 0.04)` com borda fina de 1px `rgba(255, 255, 255, 0.08)`.
- Reação ao Toque: Disparada no evento `onTouchStart` (zero delay).
- Animação: `scale: 0.96` instantâneo com elevação de borda para `primary-cyan`.

#### B. `EquationDisplay` (Painel Central da Equação)
- Fundo: Dark Glass com gradiente sutil de 135° de `#0D111A` a `#131926`.
- Dimensão de glifos: Altura mínima de 64dp, permitindo que a quebra de números (pedagogia cinética) tenha espaço de respiro sem colidir com as bordas.
- Ancoragem do Mascote: O mascote Aura paira logo acima ou na lateral superior direita do painel.

#### C. `TrackNode` (Nó da Trilha de Aprendizado)
- Círculo de 72dp com anel de progresso em SVG circular.
- Estado Ativo: Halo de pulsação suave em ondas senoidais (`scale: [1, 1.06, 1]`).
- Estado Concluído: Preenchimento gradiente ciano com 1 a 3 coroas douradas em relevo.

---

### 5. Regras Visuais & Design Laws

1. **Lei do Foco 80/20:** 80% do peso visual da tela deve pertencer à equação e ao teclado numérico. Todos os elementos de cabeçalho (tempo, streak, botões de pausa) devem usar opacidade reduzida (`opacity: 0.65`) quando a rodada estiver em andamento.
2. **Lei do Toque Cego:** O teclado in-app não deve mudar de posição durante a partida. A geometria do teclado deve permanecer fixa para permitir que a memória muscular dos dedos atue sem necessidade de olhar para o teclado.
3. **Lei da Descompressão Empática:** Erros visuais devem transmitir acolhimento e clareza, nunca agressividade. Nenhuma tela deve piscar em vermelho total.

---

### 6. Matriz Arquitetural das 16 Telas do Sistema (Layouts & Rotas)

Abaixo está o catálogo completo de arquitetura visual e navegação de todas as 16 telas da plataforma:

| ID | Nome da Tela | Rota (Expo Router) | Composição Topo (Header) | Arena Central (Body) | Dock / Entrada (Rodapé) | Componentes-Chave |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `HomeScreen` | `app/(tabs)/index.tsx` | Streak diário, saldo de estrelas, botão de perfil | Árvore vertical dos 6 Graus com conexões de luz | Barra de navegação em abas (Trilha, Treino, Lab, Perfil) | `TrackNode`, `AuraFloatingBadge`, `GradeHeader` |
| **02** | `LessonModal` | `app/lesson/[nodeId].tsx` | Indicador de etapa (1/3 Teoria, 2/3 Andaime, 3/3 Fixação) | Cartão de demonstração com partículas e fórmula visual | Botão de avanço "Entendi! Praticar" / Teclado guia | `KineticDemonstrator`, `ScaffoldingInput`, `PrimaryButton` |
| **03** | `ArenaScreen` | `app/game/arena.tsx` | Botão Pausar, Aura Mascot reativo, Multiplicador | `EquationDisplay` central com números de 64dp | `NumpadButton` grid 3x4 com gestos flick | `AuraMascotContainer`, `EquationDisplay`, `Numpad` |
| **04** | `BlitzScreen` | `app/game/blitz.tsx` | Cronômetro regressivo 60s em `tabular-nums`, Placar | Equação rápida com partículas de acerto a 120 FPS | Teclado numérico in-app com micro-escala 0.96 | `TimerRing`, `ScoreCounter`, `Numpad` |
| **05** | `SuddenDeathScreen` | `app/game/sudden-death.tsx` | Ícone de 1 Vida (Coração Cósmico), Streak atual | Equação com barra de tempo decrescente acelerando | Teclado in-app com atalhos direcionais | `HeartPulse`, `TimeDepletionBar`, `Numpad` |
| **06** | `SplitBattleScreen` | `app/game/split-battle.tsx` | Placar central divisório (Cabo-de-guerra de pontos) | Painel J2 invertido 180° (topo) / Painel J1 normal (base) | Teclados independentes simultâneos nos dois lados | `DualNumpad`, `TugOfWarBar`, `InvertedContainer` |
| **07** | `ShadowRacingScreen`| `app/game/shadow-racing.tsx`| Avatar e Elo do jogador vs. Avatar e Elo do Fantasma | Dupla barra de corrida com posições em tempo real | Equação ativa e teclado in-app | `GhostRacerBar`, `RivalAvatar`, `Numpad` |
| **08** | `DailyChallengeScreen`| `app/game/daily.tsx` | Data UTC, Contador 1 a 20, Tempo total acumulado | Questão diária central com selo oficial do dia | Teclado in-app com atalho `00` | `DailyBadge`, `ProgressTrack20`, `Numpad` |
| **09** | `FlashAnzanScreen` | `app/game/flash-anzan.tsx` | Termo atual (ex: 7/10), Velocidade (ex: 300ms) | Projetor central de números piscantes com fundo limpo | Teclado in-app exibido apenas ao término da rajada | `FlashProjector`, `SingleWordDisplay`, `Numpad` |
| **10** | `FlowZenScreen` | `app/game/flow-zen.tsx` | Visualizador de ondas de áudio, Contador sutil | Equação fluida com transições orgânicas de cor | Teclado de vidro com cliques acústicos Lofi | `LofiAudioVisualizer`, `ZenEquation`, `GlassNumpad` |
| **11** | `BossBattleScreen` | `app/game/boss.tsx` | Barra de HP do Boss com arte do Chefe Arcano | Janela regressiva de ataque do Boss e feixes da Aura | Teclado in-app de alto contraste | `BossHealthBar`, `AuraAttackBeam`, `Numpad` |
| **12** | `ResultVictoryScreen`| `app/game/result.tsx` | Título de Vitória/Conclusão, Emblema do Modo | Card com Precisão %, Tempo médio (ms), XP e Recorde | Botões "Jogar Novamente" e "Compartilhar Card" | `StatsGrid`, `AccuracyDonut`, `ShareCardButton` |
| **13** | `ProfileRadarScreen`| `app/(tabs)/profile.tsx` | Avatar do jogador, Nível, Skin ativa da Aura | Gráfico de Radar SVG (5 eixos) e Arquétipo Cognitivo | Lista de medalhas conquistadas e seletor de skins | `RadarChartSVG`, `SkinCarousel`, `ArchetypeBadge` |
| **14** | `TactileGeometryScreen`| `app/(tabs)/lab.tsx` | Seletor de técnica algébrica (ex: Quadrado da Soma) | Blocos geométricos proporcionais interativos ($a^2, 2ab, b^2$) | Sliders táteis de variáveis $a$ e $b$ com valores | `AlgebraTileCanvas`, `TouchSlider`, `FormulaInspector` |
| **15** | `TeacherHubScreen` | `app/teacher/index.tsx` | Seletor de Turma, Código de Convite (8 dígitos) | Mapa de calor de pontos cegos da turma e tarefas | Botão flutuante "Criar Nova Tarefa / Desafio" | `HeatmapGrid`, `AssignmentList`, `StudentRoster` |
| **16** | `SettingsScreen` | `app/settings.tsx` | Botão Voltar, Título "Preferências & Acessibilidade" | Sliders de volume da síntese, toggle de haptics, sensibilidade | Versão do app, política de privacidade e reset | `SettingsToggleGroup`, `VolumeSlider`, `A11ySection` |

---

## Risks / Trade-offs

* **[Risk: Performance de Backdrop-Filter em Celulares Antigos]**  
  *Mitigation:* Utilizar detecção de plataforma. Em dispositivos com GPUs modestas, substituir `backdrop-filter: blur(16px)` por preenchimento opaco escuro `rgba(13, 17, 26, 0.95)`, preservando a taxa de quadros a 60/120 FPS.
* **[Risk: Falta de Glifos Tabulares em Fontes Web Fallback]**  
  *Mitigation:* Empacotar os arquivos `.ttf` de `JetBrains Mono` e `Plus Jakarta Sans` localmente no projeto Expo através do hook `useFonts` de `expo-font`, garantindo consistência visual idêntica em qualquer sistema operacional.
