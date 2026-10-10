## Why

Atualmente, o AuraMath opera no frontend web com dados estáticos e mockados (`MOCK_USER_PROFILE`, `localStorage`), sem autenticação real de usuários, sem persistência remota e com valores fixos para Elo e radar cognitivo. Esta mudança introduz um sistema completo de autenticação e perfis (Supabase Auth com fluxo híbrido Convidado -> Nuvem), medição real e de alta precisão da assinatura cognitiva dividida por fases e estratificada por níveis de dificuldade, um motor matemático de Elo competitivo com pareamento assíncrono de Ghost Runs, e a persistência em banco de dados de todo o progresso do usuário, selos de maestria e conquistas.

## What Changes

- **Autenticação Híbrida & Gestão de Perfis**: Integração com Supabase Auth suportando Email/Senha, Magic Link e Google OAuth. Implementação de fluxo *Guest-First* (usuário pode iniciar lições imediatamente sem atrito, com migração automática dos dados locais ao criar conta ou logar).
- **Assinatura Cognitiva de Alta Precisão (DNA Matemático)**: Captura de latência em 2 tempos biológicos (reconhecimento de padrão vs manipulação mental na memória de trabalho), taxa de hesitação, matriz de proficiência por nível de dificuldade (Tier 1 Fácil, Tier 2 Médio, Tier 3 Difícil) e mapeamento analítico de Pontos Fortes e Pontos Cegos para prescrição de estudos.
- **Motor de Elo Real**: Implementação do algoritmo matemático clássico de Elo com fator $K$ dinâmico (calibração rápida para iniciantes), expectativa de vitória, pareamento assíncrono instantâneo via Ghost Runs (corridas gravadas de usuários reais no banco) e bots calibrados.
- **Persistência Completa de Conquistas & Progresso**: Vinculação de nós da trilha (`user_node_progress`), selos de maestria de grau (`user_unlocked_badges`), marcos cognitivos (`user_achievements`), snapshots de radar (`cognitive_radars`) e histórico de duelos (`match_records`) ao banco de dados com camada offline-first resiliente a falhas de rede.

## Capabilities

### New Capabilities
- `user-auth-profile`: Autenticação de usuários, sessão reativa, fluxo de convidado com migração para nuvem e gestão de perfil no Supabase.
- `cognitive-signature`: Motor de telemetria cognitiva de 2 fases, avaliação de precisão por tier de dificuldade, diagnóstico de pontos cegos/fortalezas e cálculo dos 5 eixos do radar (DNA Matemático).
- `elo-rating-system`: Algoritmo matemático de cálculo e atualização de Elo, pareamento assíncrono com Ghost Runs gravados e bots calibrados.

### Modified Capabilities
- `sensory-gamification`: Sincronização e persistência de selos de maestria, conquistas e progresso de nós da trilha no banco de dados Supabase com sincronização em background.

## Impact

- **Dependências**: Adição de `@supabase/supabase-js` ao monorepo.
- **Frontend**: Criação de `AuthContext`, modais táteis de login/cadastro, integração de telemetria fina em `DuolingoLessonView` e `TrainHubView`, atualização de `DuelHubView` com cálculo real de Elo, e consumo de dados reais em `ProfileHubView`.
- **Backend / Supabase**: Utilização das tabelas de migrations existentes (`profiles`, `user_node_progress`, `cognitive_radars`, `match_records`, `ghost_runs`, `user_unlocked_badges`) e adição da tabela de conquistas (`user_achievements`).
