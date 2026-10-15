## 1. Infraestrutura de Eventos e In-Game God Mode HUD

- [x] 1.1 Implementar `src/components/dev/ThumbZoneOverlay.tsx` com guia ergonômico de 430px e verificar renderização visual com opacidade regulável.
- [x] 1.2 Implementar `src/components/dev/AuraDevHud.tsx` com atalho de teclado `Ctrl+Shift+D`, painel retrátil, indicador de FPS e status do Web Audio.
- [x] 1.3 Conectar eventos customizados (`auramath:dev-action`) em `src/views/DuolingoLessonView.tsx` para suporte a `SOLVE_CORRECT`, `FORCE_WRONG` e `SKIP_LESSON`.
- [x] 1.4 Integrar montagem condicional do `AuraDevHud` em `src/App.tsx` sob `import.meta.env.DEV` e verificar que não afeta a navegação normal.

## 2. Bancada de Diagramas Pedagógicos (Diagram Studio)

- [x] 2.1 Criar `src/views/dev/DiagramStudioTab.tsx` com seletor interativo para os 5 diagramas (`FactorDuality`, `PercentDoubleRuler`, `PositionalJump`, `StructureUnfolding`, `SymmetryRuler`).
- [x] 2.2 Adicionar input de expressão matemática livre, biblioteca de presets por grau e controle de passo a passo de animação com validação de `tabular-nums`.

## 3. Laboratório Sensorial de Áudio e Lofi (Sensory Lab)

- [x] 3.1 Criar `src/views/dev/SensoryLabTab.tsx` com soundboard interativo cobrindo todas as notas da escala pentatônica maior (C4 a C7) e efeitos táteis de `audioSynth`.
- [x] 3.2 Integrar mixer em tempo real com sliders para os 3 canais procedurais do gerador Lofi (Crackle, Rhodes, Rain/Sub-bass) e teste de latência.

## 4. Palco de Ensaio do Mascote Prisma (Prisma Theater)

- [x] 4.1 Criar `src/views/dev/PrismaTheaterTab.tsx` com alternador entre SVG vetorial nativo e Rive Canvas runtime.
- [x] 4.2 Adicionar controles para os 6 estados canônicos (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`), multiplicador de combo, velocidade de reprodução (0.25x a 1x) e balão de fala dinâmico.

## 5. Máquina do Tempo, Retenção e Save Slots

- [x] 5.1 Criar `src/views/dev/TimeMachineTab.tsx` com saltos temporais (+1d, +7d, +30d), teste de consumo de congelamento de ofensiva e disparo manual de modais de retenção.
- [x] 5.2 Criar `src/views/dev/SaveSlotsTab.tsx` com 4 perfis pré-configurados (Calouro, Intermediário, Veterano, Mestre) e utilitário de exportação/importação de snapshots JSON do LocalStorage.

## 6. Integração no Painel `/dev` e Validação de Conformidade

- [x] 6.1 Atualizar `src/views/DevComplianceView.tsx` integrando as novas abas modulares mantendo o linter Anti-Drift e métricas Spec-Anchored.
- [x] 6.2 Executar `npm test` e `npm run spec:check` garantindo que todos os testes existentes continuam verdes e a taxa de conformidade permanece 100%.
