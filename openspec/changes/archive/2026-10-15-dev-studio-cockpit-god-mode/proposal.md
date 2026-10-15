## Why

Desenvolver e polir uma experiência de alta precisão no AuraMath — combinando matemática editorial ("Não calcule. Veja"), física tátil a 0ms, sonoplastia procedural pentatônica, o mascote Prisma e psicologia de retenção — atualmente impõe atritos severos no dia a dia do desenvolvedor:
1. Responder contas manualmente repetidas vezes apenas para testar animações de vitória, avanço de lição ou drawers de feedback.
2. Dificuldade de isolar, inspecionar e garantir CLS = 0 nos 5 diagramas pedagógicos (`FactorDualityDiagram`, `PercentDoubleRuler`, `PositionalJumpDiagram`, `StructureUnfoldingSlate`, `SymmetryRulerDiagram`).
3. Ausência de uma bancada acústica para testar notas pentatônicas e os 3 canais do gerador Lofi procedural (`audioSynth.ts`) sem precisar jogar.
4. Falta de um palco isolado para validar os 6 estados canônicos do Prisma em SVG nativo vs Rive Runtime com balão de fala e slow-motion.
5. Impossibilidade de avançar o tempo (+1d, +7d, +30d) para testar mecânicas de Streak, Streak Freeze e baús circadianos sem adulterar o relógio do sistema.

Esta mudança introduz o **AuraMath Dev Studio & God Mode**, um ambiente duplo (painel desktop expandido em `/dev` + mini HUD in-game flutuante) para acelerar a iteração e garantir conformidade Spec-Anchored instantânea.

## What Changes

- **In-Game God Mode HUD (`AuraDevHud.tsx`)**:
  - Mini widget flutuante retrátil no topo/canto da aplicação real, ativado via atalho (`Ctrl+Shift+D` ou `~`) ou parâmetro de ambiente.
  - Ação **Auto-Solve (Acerto)**: preenche a resposta correta e dispara a verificação com nota pentatônica e feedback positivo.
  - Ação **Forçar Erro Guiado**: injeta resposta incorreta deliberada para abrir o `FeedbackDrawer` coral ("Veja a estrutura oculta") com dissipação acústica suave.
  - Ação **Pular Lição / Vitória**: avança direto para a tela de conclusão de lição (`LessonCompleteView`) disparando fanfarra e confetes.
  - Ação **Stats Booster**: adiciona +100 XP, +1 Estrela, restaura vidas/freezes em 1 clique.
  - Alternador de **Thumb Zone Overlay**: sobreposição semitransparente com a grade de 430px para validação de ergonomia tátil e alinhamento do botão de ação.
  - Ticker de **Performance**: exibição de FPS em tempo real e status do contexto Web Audio (`AudioContext`).

- **AuraMath Dev Studio Pro (Rota `/dev` Expandida)**:
  - **Aba Diagram Studio**: bancada de teste isolada para os 5 diagramas pedagógicos com input de expressão matemática livre, controle de passos de animação e verificação de `tabular-nums`.
  - **Aba Sensory Lab**: soundboard pentatônico completo (C4–C7), disparador de ticks e fanfarras, e mixer interativo de 3 canais para o modo Zen Lofi procedural.
  - **Aba Prisma Staging Theater**: alternador SVG vs Rive, seletor dos 6 estados canônicos (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`), controle de velocidade (0.25x slow-motion) e balão de fala dinâmico.
  - **Aba Máquina do Tempo & Retenção**: simulação de passagem de dias (+1d, +7d, +30d), teste de consumo de congelamento de ofensiva e disparo forçado de modais de conquista e streak.
  - **Aba Save Slots & Snapshots JSON**: 4 presets de usuário prontos (Calouro, Intermediário, Veterano, Mestre) com exportação e importação instantânea de snapshots JSON do LocalStorage.
  - **Linter de Design System Anti-Drift**: verificação em tempo real de conformidade com os tokens Rebrand 01.1 (ausência de `#000`/`#fff` puro e extrusão tátil 3D nos botões).

## Capabilities

### New Capabilities
- `dev-studio`: Ambiente de ferramentas de desenvolvimento composto pelo HUD flutuante in-game (God Mode) e pelas bancadas isoladas de teste acústico, visual, pedagógico e temporal na rota `/dev`.

### Modified Capabilities
<!-- Nenhuma especificação de regra de negócio existente foi alterada. -->

## Impact

- **Código Afetado**:
  - `src/App.tsx`: montagem condicional do `AuraDevHud` em modo de desenvolvimento / rota.
  - `src/views/DevComplianceView.tsx`: orquestração das novas abas modulares.
  - Novos arquivos em `src/components/dev/` e `src/views/dev/`.
- **Dependências**: Nenhuma dependência externa adicional necessária (utiliza a infraestrutura existente de Web Audio, Lucide Icons, React e Canvas).
- **Produção / Build**: Ferramentas protegidas por `import.meta.env.DEV` ou isoladas na rota `/dev` sem overhead no bundle final de usuários finais.
