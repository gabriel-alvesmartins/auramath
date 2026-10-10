## Context

O AuraMath possui um frontend em React + Vite com design system táctil consolidado e uma migração SQL detalhada em `supabase/migrations/20260908000000_auramath_schema.sql`. Contudo, o frontend atualmente consome perfis mockados (`MOCK_USER_PROFILE`), computa ligas com dados gerados aleatoriamente em memória e não possui cliente `@supabase/supabase-js` instalado. A telemetria de alta precisão já havia sido estruturada em `apps/mobile/src/services/telemetry.ts`, mas precisa ser unificada no core web e expandida para suportar estratificação por níveis de dificuldade e pareamento assíncrono.

## Goals / Non-Goals

**Goals:**
- Prover autenticação reativa (Email, Magic Link, Google) com persistência de sessão e transição suave do modo convidado para conta registrada.
- Integrar a telemetria cognitiva de 2 fases (`T_reconhecimento` e `T_execucao`) aos componentes táteis de lição e treino, gravando matriz de dificuldade (Tiers 1, 2 e 3) e identificando pontos cegos.
- Implementar o cálculo real de Elo matemático com fator $K$ adaptativo e pareamento assíncrono via `ghost_runs` e bots calibrados.
- Persistir e sincronizar nós da trilha, selos de maestria de grau e conquistas na nuvem (Supabase) mantendo resposta a 0ms através de cache e fila offline.

**Non-Goals:**
- Servidor dedicado de WebSockets síncronos de baixa latência (Fase 1 focará no pareamento assíncrono escalável e resiliente).
- Sistema financeiro de pagamentos ou cobrança de assinaturas.

## Decisions

### 1. Supabase Client & Camada de Sessão Híbrida
- **Decisão:** Instalar `@supabase/supabase-js` e criar um `AuthContext` reativo. Se o usuário não estiver logado, opera como convidado local (`guest_user_id` em memória/localStorage).
- **Alternativa Considerada:** Forçar tela de login antes de ver o app. Rejeitado para preservar a baixa fricção e a retenção de novos estudantes.
- **Migração Convidado -> Nuvem:** Ao efetuar login/cadastro, o `CloudSyncService` lê o snapshot do `gamificationEngine` local e executa `upsert` no Supabase para as tabelas `profiles`, `user_node_progress`, `user_unlocked_badges` e `user_achievements`.

### 2. Telemetria Cognitiva de 2 Fases & Matriz de Dificuldade
- **Decisão:** Incorporar o `CognitiveTelemetryTracker` ao ciclo de vida de renderização de cada questão nos componentes `DuolingoLessonView` e `TrainHubView`:
  - `startQuestion(questionId, techniqueId, difficultyTier)` é disparado quando a equação surge.
  - `recordFirstInput()` é acionado no primeiro clique do `TactileNumpad` ou tecla física digitada.
  - `completeQuestion(userAns, expectedAns, isCorrect)` calcula $T_{\text{rec}}$, $T_{\text{exec}}$, detecta hesitação e atualiza o bucket `[techniqueId][difficultyTier]`.
- **Alternativa Considerada:** Medir apenas o tempo total por lição. Rejeitado porque impede diagnosticar se o aluno trava no reconhecimento visual do padrão ou na conta mental.

### 3. Motor de Elo & Pareamento Assíncrono (Ghost Racing)
- **Decisão:** Implementar a biblioteca `eloEngine` com a fórmula:
  $$E = \frac{1}{1 + 10^{(R_{\text{oponente}} - R_{\text{user}})/400}}, \quad R' = R + K(S - E)$$
  com $K=40$ (partidas $< 15$), $K=24$ (intermediário) e $K=16$ (veteranos $\ge 1800$).
  Para duelos, o sistema busca na tabela `ghost_runs` uma partida na faixa $\pm 100$ de Elo. Se não encontrar, instancia um bot estocástico com média de tempo e taxa de acerto calibradas para aquele Elo.
- **Alternativa Considerada:** Fila de espera de jogadores simultâneos via WebSocket. Rejeitado no momento devido ao risco de salas vazias e atrasos frustrantes para o usuário.

### 4. Camada de Cache Offline-First & Resiliência
- **Decisão:** O estado no cliente (`gamificationEngine`) continua atualizando o `localStorage` a 0ms de latência para manter todas as animações táteis instantâneas. Uma fila assíncrona (`SyncQueue`) despacha mutações em lotes com debounce para as tabelas do Supabase (`user_node_progress`, `cognitive_radars`, `match_records`, `user_achievements`).
- **Alternativa Considerada:** Fazer `await supabase.from(...).insert(...)` antes de renderizar a tela de vitória. Rejeitado porque introduziria latência de rede na celebração tátil.

## Risks / Trade-offs

- **[Conflito de sincronização ao logar em múltiplos aparelhos]** → *Mitigação*: Política de merge aditivo (maior número de estrelas entre local e remoto, união de selos e conquistas, maior streak).
- **[Ambiente sem credenciais do Supabase configuradas]** → *Mitigação*: Fallback elegante no cliente: se `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` não estiverem configuradas, o sistema continua funcionando perfeitamente no modo Convidado/Local com aviso discreto na tela de desenvolvedor.
- **[Abuso / Trapaças no envio de pontuações de Elo]** → *Mitigação*: A migração SQL já inclui a procedure `submit_match_score` com validação de rejeição para tempos de resposta humanamente impossíveis ($< 150\text{ ms}$).

## Migration Plan

1. Adicionar tabela `user_achievements` à migration do Supabase para espelhar as conquistas comportamentais.
2. Adicionar `@supabase/supabase-js` em `package.json`.
3. Criar a infraestrutura de serviços (`supabaseClient`, `authService`, `telemetryTracker`, `eloEngine`, `cloudSync`).
4. Conectar a UI (`AuthModal`, `ProfileHubView`, `DuelHubView`, `DuolingoLessonView`).
