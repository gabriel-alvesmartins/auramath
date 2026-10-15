## 1. Banco de Questões e Diagnóstico

- [x] 1.1 Criar gerador de questões progressivas do diagnóstico (10 níveis de dificuldade) em `packages/engine` e verificar que cada questão possui resposta correta e explicação
- [x] 1.2 Criar gerador de questões de homologação por Grau curricular (4 questões por grau) e verificar assertividade dos limiares de acerto ($\ge 75\%$)

## 2. Componentes de UI do Funil de Onboarding

- [x] 2.1 Implementar `OnboardingWelcomeStep.tsx` com o Mascote Aura, contraste tradicional vs. visual ($98+47$) e botão tátil "COMEÇAR"
- [x] 2.2 Implementar `OnboardingPathSelectStep.tsx` com os 3 caminhos (Iniciar do Zero, Descobrir Nível, Selecionar Nível) e verificar eventos de seleção tátil
- [x] 2.3 Implementar `DiagnosticQuizView.tsx` executando as 10 questões com barra de progresso, feedback visual e cálculo de posicionamento final
- [x] 2.4 Implementar `LevelPickerVerifyView.tsx` com grid dos 6 Graus e teste de homologação de 4 questões
- [x] 2.5 Implementar `DailyGoalStep.tsx` com os 3 patamares (3 min Faísca, 7 min Foco, 15 min Maestria Fibonacci) e botão de conclusão
- [x] 2.6 Integrar `OnboardingFlowView.tsx` com a máquina de estados completa e persistência no `localStorage` (`auramath_onboarded`)

## 3. Coreografia de Vitória no LessonCompleteView (Dopamine Waterfall)

- [x] 3.1 Refatorar máquina de estados temporal de 5 fases em `LessonCompleteView.tsx` (intro ➔ cards ➔ xp_count ➔ streak_stamp ➔ ready)
- [x] 3.2 Implementar animação de contagem progressiva tabular de XP com disparo de ticks sonoros a cada incremento
- [x] 3.3 Implementar card da Ofensiva com fita semanal de 7 dias e carimbo animado do dia corrente
- [x] 3.4 Implementar barra de avanço da Meta Diária e botão tátil pulsante "PRÓXIMO INSIGHT ➔"
- [x] 3.5 Adicionar suporte a avanço rápido (*fast-forward*) ao tocar na tela para usuários que queiram pular animações

## 4. Integração no App Shell e Roteamento

- [x] 4.1 Adicionar rota `onboarding` no `App.tsx` e lógica de cold load para redirecionar novos visitantes automaticamente
- [x] 4.2 Adicionar botão de escape seguro para permitir pular o onboarding diretamente para a Trilha
- [x] 4.3 Conectar a finalização da lição em `DuolingoLessonView.tsx` ao `LessonCompleteView` mantendo a interface de props intacta

## 5. Verificação Automatizada e Qualidade

- [x] 5.1 Criar suite de testes E2E `test/e2e/duolingo-onboarding-victory.test.mjs` cobrindo os 3 caminhos de entrada e a vitória em 5 fases
- [x] 5.2 Executar `npm test` e verificar que todas as suítes passam com 100% de sucesso
- [x] 5.3 Executar `npx vite build` e verificar que o bundle é gerado com zero erros de compilação TypeScript
