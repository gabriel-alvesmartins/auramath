# Technical Design: Auramath SDD Foundation

## Context

O Auramath é uma plataforma educacional e competitiva para cálculo mental rápido, baseada em algoritmos cognitivos da esquerda para a direita, propriedades de álgebra estrutural e aproximações de Fermi. Para motivação detalhada, consulte `proposal.md`.

Este documento estabelece a arquitetura de software, padrões de engenharia, modelagem de dados e decisões técnicas para viabilizar execução fluida em Web (PWA), Android e iOS.

---

## Goals / Non-Goals

### Goals
- **Isomorfismo Matemático**: Pacote desacoplado `@auramath/engine` executável tanto no cliente (feedback instantâneo a 0ms) quanto no servidor (auditoria e anti-cheat).
- **Desempenho Sensorial Extremo**: Renderização a 60/120 FPS via React Native Reanimated, sonoplastia pentatônica sem latência e feedback háptico tátil.
- **Competição Síncrona Resiliente**: Modo 1v1 Online operando via WebSockets (Supabase Realtime) com sementes determinísticas e tolerância a jitter de rede.
- **Flexibilidade Didática e B2B**: Estrutura relacional escalável para acompanhar o progresso de alunos individuais e fornecer diagnósticos analíticos para professores e turmas.

### Non-Goals
- Não construir um Sistema de Computação Algébrica (CAS) como SymPy ou Mathematica; o foco estrito é fluência aritmética mental humana.
- Não utilizar motores pesados de jogos 3D (como Unity ou Unreal); a interface deve ser leve, acessível e carregar instantaneamente em conexões móveis.
- Não incluir gateway de pagamento transacional nesta fase de fundação técnica (as tabelas suportarão planos, mas a integração com Stripe/Pagar.me será implementada em etapa posterior).

---

## Arquitetura do Sistema

```
+-------------------------------------------------------------------------+
|                           CLIENTE (EXPO / REACT NATIVE)                 |
+-------------------------------------------------------------------------+
|                                                                         |
|  [ Interface & Views ]          [ Game Loop Engine ]   [ Audio/Haptic ] |
|  - Trilha (Tree of Nodes)       - 60s Blitz Controller - Pentatonic Synth|
|  - Modo Split-Screen (Invertido)- Morte Súbita Logic   - Expo Haptics   |
|  - Teclado In-App Rápido        - Scaffolding Stepper  - Mascote "Aura" |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                 CORE MATEMÁTICO: @auramath/engine                 |  |
|  |  - Geradores Procedurais por Técnica (Graus I ao VI)              |  |
|  |  - Avaliador de Scaffolding (Decomposição mental)                 |  |
|  |  - Gerador de Distratores de Ordem de Grandeza (Fermi)            |  |
|  |  - Gerador Pseudoaleatório Determinístico (PRNG com Seed)         |  |
|  +-------------------------------------------------------------------+  |
|                                     |                                   |
+-------------------------------------|-----------------------------------+
                                      |
                                      v HTTPS / WebSockets
+-------------------------------------------------------------------------+
|                           BACKEND (SUPABASE)                            |
+-------------------------------------------------------------------------+
|  [ Auth & Identity ]      [ Database: PostgreSQL ]    [ Realtime WS ]   |
|  - Alunos, Professores    - Profiles & Streaks        - Matchmaking 1v1 |
|  - Sessões JWT            - Learning Progress         - Duelo Sync      |
|                           - Match Results & Scores    - Presence        |
|                           - Classrooms & Assignments                    |
|                           - Anti-Cheat RPC Function                     |
+-------------------------------------------------------------------------+
```

---

## Decisions

### 1. Frontend: React Native com Expo (SDK Recente)
* **Decisão:** Utilizar Expo com Expo Router e React Native Reanimated.
* **Racional:** Permite compartilhar mais de 90% do código entre Web (PWA desktop/mobile), Android e iOS. Garante animações executadas na thread de UI nativa a 120 FPS.
* **Alternativas consideradas:**
  * *Flutter:* Excelente em mobile, mas com maior fricção no Web PWA e barreira de compatibilidade com o ecossistema TypeScript.
  * *Next.js + Capacitor:* Excelente na web, mas com pior performance de toque e micro-latência no teclado in-app em dispositivos móveis modestos.

### 2. Pacote Desacoplado: `@auramath/engine` (TypeScript Puro)
* **Decisão:** Isolar toda a lógica de cálculo, geração procedural, decomposição e validação em um pacote puro, sem dependências de UI ou de frameworks de terceiros.
* **Racional:**
  * No cliente: permite gerar e validar respostas instantaneamente em memória (0ms de latência), vital para o modo Blitz e fluência do teclado.
  * No servidor: executa em Supabase Edge Functions / Node.js para regenerar a partida a partir da semente e auditar pontuações antes de homologar no ranking global.
* **Alternativas consideradas:**
  * *Geração via API:* Fazer requisições HTTP para buscar cada questão adicionaria 50 a 200ms de latência, destruindo o ritmo frenético do cálculo mental.

### 3. Mecânica Híbrida de Entrada de Dados
* **Decisão:** Teclado numérico in-app customizado para operações exatas e botões de múltipla escolha para aproximações.
* **Racional:**
  * O teclado nativo de smartphones abre/fecha com animação lenta, ocupa metade da tela e possui autocorretor inadequado para velocidade aritmética. O teclado in-app do Auramath responde no evento `onTouchStart` (sem o delay de 300ms de clicks tradicionais).
  * No módulo de aproximação (Fermi), múltipla escolha simula as provas de concursos/ENEM e testa a capacidade de discriminar ordens de grandeza em 3 segundos.

### 4. Backend: Supabase (PostgreSQL + RLS + Realtime)
* **Decisão:** Centralizar banco relacional, autenticação, controle de permissões por RLS (Row Level Security) e WebSockets no Supabase.
* **Racional:** Reduz overhead de infraestrutura, oferece WebSockets gerenciados para matchmaking e salas de duelo 1v1, além de permitir funções PL/pgSQL para cálculo seguro de rankings.

### 5. Design de Áudio Harmônico Pentatônico
* **Decisão:** Disparar notas musicais baseadas na escala pentatônica maior (Dó, Ré, Mi, Sol, Lá).
* **Racional:** A escala pentatônica não contém semitons ou intervalos de trítono, eliminando qualquer choque acústico ou dissonância, mesmo que o usuário responda a uma velocidade de 3 questões por segundo.

### 6. Mascote "Aura" & Escala de 5 Níveis de Game Juice
* **Decisão:** Estruturar o mascote "Aura" como uma criatura de energia minimalista em SVG vetorial por camadas com 5 patamares progressivos de transcendência e descompressão suave:
  1. *Nível 1 - Spark (Centelha Zen, Combo 1-4):* Orbe translúcido bioluminescente em ciano/violeta com flutuação senoidal suave e notas límpidas de marimba de cristal.
  2. *Nível 2 - Surge (Pulso de Plasma, Combo 5-9):* Asas de energia laterais, aceleração de pulso, eco espacial e micro-shake no contador de combo.
  3. *Nível 3 - Overdrive (Vórtice Hipersônico, Combo 10-19):* Anéis giroscópicos em eixos inclinados, trilha de after-image, aberração cromática sutil e arpejador sintetizado ao fundo.
  4. *Nível 4 - Supernova (Fusão Cósmica, Combo 20-34):* Olhos com brilho estelar quádruplo, portal circular de geometria sagrada, acordes arpejados, vibrações hápticas duplas pesadas e efeito starfield warp.
  5. *Nível 5 - Singularity / Godmode (Dimensão Quântica, Combo 35+):* Disco de acreção prismático hipnótico, micro hit-stop de 2 quadros (16ms) para peso de impacto e euforia audiovisual contínua.
  6. *Descompressão Suave (Ao Errar):* Dissipação graciosa de energia em partículas lentas sem sons punitivos ou sirenes de alarme, mantendo o usuário engajado e motivado a reconquistar o Godmode.

### 7. Pedagogia Cinética (Física dos Números e Decomposição Esquerda-Direita)
* **Decisão:** Renderizar as operações matemáticas não como textos estáticos, mas como partículas numéricas dinâmicas que se quebram e se fundem espacialmente:
  * *Fusão de Mercúrio (Adição Posicional):* O segundo operando desprende dezenas e unidades em bolhas elásticas, fundindo-se com o primeiro número da esquerda para a direita (ex: $68 + 27 \rightarrow 68 + 20 = 88 \rightarrow 88 + 7 = 95$).
  * *Acordeão Elástico (Multiplicação por 11):* Separação espacial dos extremos e encaixe com snap tátil da soma central (ex: $43 \times 11 \rightarrow 4\_[4+3]\_3 \rightarrow 473$).
  * *Espelho Simétrico (Diferença de Quadrados e Fatoração):* Identificação visual de um número pivô simétrico resolvendo instantaneamente $a^2 - b^2$ (ex: $48 \times 52 \rightarrow (50 - 2)(50 + 2) \rightarrow 2500 - 4 = 2496$).

### 8. Duelos Fantasma (Shadow Racing) & Eliminação do Lobby Vazio
* **Decisão:** Permitir partidas competitivas 1v1 imediatas sem tempo de espera através da reprodução de "runs gravadas" (séries temporais de jogadas reais de usuários de mesmo Elo/MMR).
* **Racional:** Elimina a barreira de liquidez de rede no início do SaaS (onde poucos usuários simultâneos deixam filas síncronas vazias). O oponente virtual corre com os mesmos tempos reais milimétricos em que jogou sua partida original.

### 9. Desafio Diário ("Mathle") e Motor de Viralidade Social
* **Decisão:** Disponibilizar diariamente um conjunto fixo de 20 operações geradas a partir de uma semente global às 00:00 UTC, gerando ao final um card de texto copiável baseado em emojis sem spoilers.
* **Racional:** Estimula o hábito diário de retenção (streak) e cria um vetor de aquisição orgânica com custo zero de marketing através do compartilhamento no WhatsApp, X e LinkedIn.

### 10. Arquitetura Offline-First & Síntese Procedural de Áudio (0ms)
* **Decisão:** Persistir partidas, recordes e nós de estudo localmente em SQLite/MMKV com sincronização delta não-bloqueante para o Supabase, associada a um motor de áudio baseado em Web Audio Oscillator / PCM.
* **Racional:**
  * O cálculo mental exige zero fricção e zero latência. O usuário pode jogar no metrô ou avião sem falhas de carregamento.
  * Sintetizar ondas senoidais diretamente por frequências da escala pentatônica elimina o consumo de banda com arquivos de áudio `.mp3` e atinge latência física exata de 0ms.

### 11. Telemetria de Hesitação Cognitiva
* **Decisão:** Registrar a latência de cada resposta em milissegundos e agregar métricas por tipo de operação (ex: adição com base 8, diferença de quadrados, fator 25).
* **Racional:** Permite diagnosticar gargalos motores inconscientes e sugerir sessões cirúrgicas de 2 minutos para destravamento do fluxo mental.

### 12. Modo Flash Anzan Visuoespacial
* **Decisão:** Desenvolver modalidade arcade em que sequências numéricas piscam no centro da tela em cadência ultra-rápida (200ms a 400ms por número), exigindo a digitação da soma total acumulada.
* **Racional:** Força o encerramento da subvocalização (leitura fonética dos números na mente) e estimula o processamento visuoespacial no hemisfério direito, além de possuir altíssimo potencial de viralização em vídeos de redes sociais.

### 13. Modo Flow Zen & Áudio Procedural Generativo Lofi
* **Decisão:** Criar um modo contínuo sem cronômetro decrescente nem penalidade por erro, onde cada resposta correta desbloqueia incrementalmente camadas instrumentais de uma faixa procedural de Lofi/Ambient (bumbo/caixa, piano Rhodes, chuva e baixo acústico).
* **Racional:** Atende usuários que buscam desaceleração, relaxamento noturno e foco meditativo sem a ansiedade da contagem regressiva.

### 14. Batalhas de Chefes Cognitivos ("Boss Fights")
* **Decisão:** Posicionar um Chefe Arcano temático no fechamento de cada um dos 6 Graus da Trilha de Aprendizado, com barra de pontos de vida (HP) que diminui com acertos rápidos e janela regressiva de contra-ataque do Boss.
* **Racional:** Oferece marcos épicos de progressão com recompensa imediata através do desbloqueio de skins visuais raras e cosméticos para o mascote Aura.

### 15. Teclado Gestual de Alta Velocidade ("Flick Numpad")
* **Decisão:** Habilitar reconhecimento de micro-gestos no teclado in-app: deslizamento horizontal para a direita envia a resposta instantaneamente, deslizamento para a esquerda limpa o visor e toque prolongado/flick no 0 insere `00`.
* **Racional:** Reduz em 100ms a 250ms o tempo gasto em manipulação motora por questão, prevenindo erros por toques acidentais em smartphones com telas compactas.

### 16. DNA Matemático & Radar Cognitivo de 5 Eixos
* **Decisão:** Computar dinamicamente os percentis do usuário em 5 dimensões (Velocidade Bruta, Precisão de Estimativa, Flexibilidade Algébrica, Resistência a Erros e Memória de Trabalho), classificando o jogador em arquétipos compartilháveis em redes sociais (ex: "Arquiteto Relâmpago", "Alquimista Algébrico").
* **Racional:** Cria um momento de identidade pessoal e vaidade intelectual ("Spotify Wrapped" do cálculo mental) com compartilhamento orgânico.

### 17. Laboratório Tátil de Geometria
* **Decisão:** Disponibilizar simulações interativas com controles deslizantes táteis que transformam identidades algébricas (como $(a+b)^2$ e $(a-b)(a+b)$) em retângulos e quadrados com áreas proporcionais em tempo real.
* **Racional:** Constrói intuição espacial e geométrica sobre o porquê das fórmulas funcionarem, substituindo memorização mecânica por compreensão visual.

---

## Modelagem do Banco de Dados (PostgreSQL)

```sql
-- 1. Perfis de Usuário
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    current_grade_level INT DEFAULT 1,
    total_xp BIGINT DEFAULT 0,
    aura_level INT DEFAULT 1,
    current_streak_days INT DEFAULT 0,
    highest_blitz_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Progresso da Trilha de Aprendizado
CREATE TABLE user_node_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL, -- ex: 'MULT_25', 'DIFF_OF_SQUARES'
    stars_earned INT NOT NULL CHECK (stars_earned BETWEEN 0 AND 3),
    best_accuracy NUMERIC(5, 2) NOT NULL,
    average_speed_ms INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, node_id)
);

-- 3. Histórico de Partidas e Auditoria Anti-Cheat
CREATE TABLE match_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode TEXT NOT NULL CHECK (game_mode IN ('blitz', 'sudden_death', 'duel_1v1')),
    seed TEXT NOT NULL,
    score INT NOT NULL,
    max_streak INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    average_reaction_ms INT NOT NULL,
    flagged_suspicious BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Turmas de Professores (B2B)
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    invite_code VARCHAR(8) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Inscrições de Alunos nas Turmas
CREATE TABLE classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (classroom_id, student_id)
);

-- 6. Tarefas e Desafios Pedagógicos
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_techniques TEXT[] NOT NULL,
    required_question_count INT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Submissões e Telemetria Diagnóstica de Alunos
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    accuracy_percentage NUMERIC(5, 2) NOT NULL,
    technique_breakdown JSONB NOT NULL, -- { "MULT_25": { "correct": 9, "wrong": 1, "avg_ms": 1420 } }
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
);

-- 8. Duelos Fantasma (Shadow Racing Runs)
CREATE TABLE ghost_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode TEXT NOT NULL,
    elo INT NOT NULL,
    seed TEXT NOT NULL,
    total_score INT NOT NULL,
    duration_ms INT NOT NULL,
    timeline_events JSONB NOT NULL, -- [ { "q": 1, "delta_ms": 620, "correct": true, "input": "95" }, ... ]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Desafios Diários (Mathle)
CREATE TABLE daily_challenges (
    challenge_date DATE PRIMARY KEY,
    seed TEXT NOT NULL,
    question_count INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Submissões de Desafios Diários
CREATE TABLE daily_challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE NOT NULL REFERENCES daily_challenges(challenge_date) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_time_ms INT NOT NULL,
    correct_count INT NOT NULL,
    accuracy_percentage NUMERIC(5, 2) NOT NULL,
    share_grid TEXT NOT NULL, -- ex: "🟩🟩🟩🟨🟩"
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (challenge_date, user_id)
);

-- 11. Batalhas de Chefes Cognitivos (Boss Battles)
CREATE TABLE boss_battles (
    id TEXT PRIMARY KEY, -- ex: 'BOSS_GRADE_1', 'BOSS_GRADE_2'
    grade_level INT NOT NULL,
    name TEXT NOT NULL,
    max_hp INT NOT NULL,
    attack_timeout_ms INT NOT NULL,
    reward_skin_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Skins e Cosméticos Desbloqueados da Aura
CREATE TABLE user_unlocked_skins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skin_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, skin_id)
);

-- 13. DNA Matemático (Histórico do Radar Cognitivo)
CREATE TABLE cognitive_radars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    speed_score INT NOT NULL, -- 0-100
    fermi_score INT NOT NULL, -- 0-100
    flexibility_score INT NOT NULL, -- 0-100
    stamina_score INT NOT NULL, -- 0-100
    memory_score INT NOT NULL, -- 0-100
    archetype_title TEXT NOT NULL, -- ex: "Arquiteto Relâmpago"
    computed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Protocolo de Duelo 1v1 Online (WebSockets)

```
[ JOGADOR 1 ]               [ SUPABASE REALTIME ]              [ JOGADOR 2 ]
      |                              |                              |
      |--- 1. Entrar na fila ------->|                              |
      |                              |<--- 2. Entrar na fila -------|
      |                              |                              |
      |<-- 3. Pareamento + SEED -----|----- 3. Pareamento + SEED -->|
      |    (ex: SEED_7894)           |     (ex: SEED_7894)          |
      |                              |                              |
      |=== 4. Ambas as instâncias geram as mesmas questões =========|
      |                              |                              |
      |--- 5. Acertou Q1 (1200ms) -->|                              |
      |                              |--- 6. Broadcast Estado ----->|
      |                              |    (J1: +1 pt, Streak: 1)    |
      |                              |                              |
      |                              |<-- 7. Acertou Q1 (1800ms) ---|
      |<-- 8. Broadcast Estado ------|                              |
      |                              |                              |
```

---

## Risks / Trade-offs

* **[Risk: Trapaça em Rankings Globais por Scripts/Bots]**  
  *Mitigation:* As pontuações do ranking global exigem o envio do log de timestamps por questão. O backend recalcula o hash da semente procedural e rejeita partidas onde mais de 10% das respostas possuem tempo de reação físico impossível (<150ms).
* **[Risk: Desconexão de Rede durante Duelo 1v1]**  
  *Mitigation:* Reconexão graciosa em até 10 segundos. Se o oponente não retornar, o jogador conectado recebe vitória por desistência.
* **[Risk: Complexidade de Interface no Split-Screen para Dispositivos Pequenos]**  
  *Mitigation:* Modo Split-Screen otimizado para tablets e smartphones de tela média/grande (layout vertical com tipografia escalonada e botões com área mínima de toque de 48dp).
