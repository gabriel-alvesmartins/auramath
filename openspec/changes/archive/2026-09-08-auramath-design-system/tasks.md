# Tasks: Auramath UI Design System Implementation

## 1. Tokens de Design e Configuração de Tema

- [x] 1.1 Criar o arquivo central de tokens `src/theme/tokens.ts` contendo a paleta cromática cósmica (Midnight Obsidian, Electric Cyan, Cosmic Violet, Soft Coral), escalas de espaçamento base 4px, raios squircle e halos de elevação, e verificar a exportação tipada de todos os tokens
- [x] 1.2 Configurar integração dos design tokens com a camada de estilização (Tailwind/NativeWind e StyleSheet constants) e verificar que as classes de cor e espaçamento são resolvidas corretamente em componentes de teste
- [x] 1.3 Configurar o carregamento das famílias tipográficas (`PlusJakartaSans`, `JetBrainsMono`, `Inter`) via `expo-font` e verificar que numerais matemáticos aplicam `font-variant-numeric: tabular-nums` sem variação de largura por glifo

## 2. Componentes Táticos Primitivos

- [x] 2.1 Construir o componente `NumpadButton` com área mínima de 56x56dp, resposta imediata ao evento `onTouchStart`, micro-escala elástica de 0.96 e emissão de brilho ciano, e verificar o comportamento em testes unitários e de interação
- [x] 2.2 Construir o componente `EquationDisplay` com caixas delimitadoras de largura fixa e altura mínima de 64dp preparadas para pedagogia cinética, e verificar que números de 1 a 4 dígitos não provocam deslocamento nos elementos vizinhos (CLS = 0)
- [x] 2.3 Construir o componente de superfície `GlassCard` com preenchimento dark glass translúcido, desfoque de fundo e borda sutil de 1px com fallback para preenchimento opaco escuro, e verificar a renderização responsiva
- [x] 2.4 Construir o componente `ComboHUD` com anéis de calor progressivo, multiplicadores dinâmicos e halos de elevação luminosa (`glow-cyan` e `glow-violet`), e verificar transições entre os estados energéticos

## 3. Padrões de Feedback e Acessibilidade

- [x] 3.1 Implementar o componente de micro-animação de erro empático com iluminação temporária em Soft Coral (`#FB7185`) e partículas lentas de dissipação, e verificar a ausência de flashes agressivos ou trepidação punitiva
- [x] 3.2 Executar auditoria de acessibilidade verificando taxa de contraste superior a 4.5:1 (WCAG AA) para todos os pares de cor de texto/fundo e dimensões mínimas de 48dp em todos os alvos de toque interativos

## 4. Construção das 16 Telas do Sistema (Rotas Expo Router)

- [x] 4.1 Implementar as telas de Navegação e Trilha: `HomeScreen` (`app/(tabs)/index.tsx`) e `LessonModal` (`app/lesson/[nodeId].tsx`) e verificar a renderização dos nós interativos da trilha
- [x] 4.2 Implementar as telas de Arenas Solo: `ArenaScreen` (`app/game/arena.tsx`), `BlitzScreen` (`app/game/blitz.tsx`) e `SuddenDeathScreen` (`app/game/sudden-death.tsx`) e verificar integração com o teclado numérico in-app
- [x] 4.3 Implementar as telas de Batalha e Duelos: `SplitBattleScreen` (`app/game/split-battle.tsx`) com interface invertida em 180° e `ShadowRacingScreen` (`app/game/shadow-racing.tsx`) com barras de corrida simultâneas
- [x] 4.4 Implementar as telas dos Modos Especiais: `DailyChallengeScreen` (`app/game/daily.tsx`), `FlashAnzanScreen` (`app/game/flash-anzan.tsx`), `FlowZenScreen` (`app/game/flow-zen.tsx`) e `BossBattleScreen` (`app/game/boss.tsx`) e verificar que cada modo renderiza seus elementos característicos
- [x] 4.5 Implementar as telas de Pós-Jogo e Perfil: `ResultVictoryScreen` (`app/game/result.tsx`) e `ProfileRadarScreen` (`app/(tabs)/profile.tsx`) com o Radar Cognitivo de 5 eixos em SVG
- [x] 4.6 Implementar as telas do Laboratório, Sala de Aula e Configurações: `TactileGeometryScreen` (`app/(tabs)/lab.tsx`), `TeacherHubScreen` (`app/teacher/index.tsx`) e `SettingsScreen` (`app/settings.tsx`) e verificar a navegação completa entre todas as 16 rotas
