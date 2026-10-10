## 1. Infraestrutura & Dependências Supabase

- [x] 1.1 Adicionar `@supabase/supabase-js` às dependências do projeto e verificar instalação limpa com `npm install`
- [x] 1.2 Atualizar o arquivo de migração PostgreSQL em `supabase/migrations/` para incluir a tabela `user_achievements` e verificar consistência de schema
- [x] 1.3 Criar o cliente tipado `src/services/supabaseClient.ts` com fallback gracioso para modo offline/convidado quando as variáveis de ambiente não estiverem configuradas

## 2. Sistema de Autenticação Híbrida & Sessão de Usuário

- [x] 2.1 Criar o `AuthContext` e hook `useAuth` em `src/contexts/AuthContext.tsx` gerenciando sessão (convidado vs autenticado)
- [x] 2.2 Implementar métodos de autenticação em `src/services/authService.ts` (Login com Senha, Cadastro, Magic Link, Google OAuth e Logout)
- [x] 2.3 Desenvolver o componente modal tátil `src/components/auth/AuthModal.tsx` integrado à paleta editorial e sons do `audioSynth`
- [x] 2.4 Adicionar gatilho visual de login no `EditorialHeader` e na `ProfileHubView`, permitindo abrir o modal e visualizar o status da conta

## 3. Telemetria Cognitiva de Alta Resolução (2 Fases & Níveis de Dificuldade)

- [x] 3.1 Adaptar e consolidar o motor `src/services/telemetryTracker.ts` para registrar $T_{\text{rec}}$ (1º toque) e $T_{\text{exec}}$ (resolução final)
- [x] 3.2 Implementar agregação de desempenho por nível de dificuldade (Tiers 1 Fácil, 2 Médio, 3 Difícil) e matriz por técnica
- [x] 3.3 Adicionar algoritmo de detecção de Pontos Fortes e Pontos Cegos (Blind Spots) com recomendações de micro-drills de 2 minutos
- [x] 3.4 Conectar a telemetria ao `TactileNumpad`, `DuolingoLessonView` e `TrainHubView`, despachando eventos a cada questão

## 4. Motor de Elo Real & Pareamento Assíncrono

- [x] 4.1 Criar o serviço `src/services/eloEngine.ts` implementando a fórmula clássica de Elo com fator $K$ adaptativo (40 para novatos, 24/16 para regulares)
- [x] 4.2 Implementar sistema de pareamento com Ghost Runs (`src/services/ghostMatchmaker.ts`) com reprodução temporal de respostas de oponentes gravados e fallback para bots calibrados
- [x] 4.3 Integrar o cálculo de Elo e a reprodução de partidas ao `DuelHubView`, salvando ghost runs de partidas vencidas
- [x] 4.4 Mapear o Elo numérico para os ranques editoriais correspondentes (Papiro, Ábaco, Astrônomo, Alquimista, Mestre Arquimedes)

## 5. Persistência de Conquistas, Selos e Sincronização em Nuvem

- [x] 5.1 Criar o serviço de sincronização `src/services/cloudSync.ts` com fila offline (`SyncQueue`) para envio assíncrono e tolerante a falhas
- [x] 5.2 Conectar a conclusão de nós em `gamificationEngine` para disparar sincronização com `user_node_progress`
- [x] 5.3 Implementar sincronização de Selos de Maestria em `user_unlocked_badges` e marcos em `user_achievements`
- [x] 5.4 Implementar rotina de migração transparente do `localStorage` para o perfil no Supabase no momento do primeiro login/cadastro

## 6. Integração da UI & Verificação

- [x] 6.1 Atualizar `ProfileHubView.tsx` para consumir o DNA Matemático real, arquétipos computados, matriz de pontos fortes/cegos e dados de Elo do usuário
- [x] 6.2 Adicionar testes automatizados para o motor de Elo, cálculo de telemetria de 2 fases e sincronização em `test/`
- [x] 6.3 Executar bateria de verificação (`npm test`, `npx vite build`) assegurando 100% de testes passando e compilação sem avisos
