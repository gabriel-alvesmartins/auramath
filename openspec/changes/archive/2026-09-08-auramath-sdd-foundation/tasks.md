# Tasks: Auramath Implementation Plan

## 1. Setup da Infraestrutura e Monorepo

- [x] 1.1 Configurar estrutura modular contendo o app Expo (React Native) e o pacote puro `@auramath/engine`, e verificar que as importações locais compilam
- [x] 1.2 Configurar TypeScript com tipagem estrita, ESLint e Jest para testes automatizados, e verificar que o comando `npm test` executa sem erros

## 2. Core Matemático Procedural (`@auramath/engine`)

- [x] 2.1 Implementar gerador de números pseudoaleatórios (PRNG) com semente determinística e verificar que a mesma semente reproduz sequências idênticas de testes
- [x] 2.2 Implementar geradores do Grau I (Fluxo Esquerda-Direita, Compensação Aditiva/Subtrativa e Complemento de Base $10^n$) com testes unitários cobrindo casos limites
- [x] 2.3 Implementar geradores do Grau II (Fatores Notáveis 5, 25, 50, 125, 11, 15, 99 e Dimediação) com validação de divisibilidade e gabaritos
- [x] 2.4 Implementar geradores do Grau III (Quadrados em 5, Bases Modulares 50/100, Diferença de Quadrados) com derivação automática de $m^2 - d^2$
- [x] 2.5 Implementar geradores do Grau IV (Aproximação de Fermi, cálculo de ordem de grandeza e gerador de 3 distratores cognitivos assimétricos)
- [x] 2.6 Implementar geradores do Grau V (Matemática Védica - Urdhva-Tiryagbhyam e Sistema Trachtenberg de vizinhança mecânica)
- [x] 2.7 Implementar geradores do Grau VI (Aritmética Modular - Prova dos 9 e 11, e Flash Anzan visuoespacial)
- [x] 2.8 Implementar avaliador de Scaffolding (passos cognitivos intermediários) com validação de preenchimento passo a passo e 100% de cobertura de testes

## 3. UI, Entrada de Dados e Gamificação Sensorial

- [x] 3.1 Construir componente de Teclado Numérico In-App de alta sensibilidade com evento `onTouchStart` sem latência de clique
- [x] 3.2 Construir componente de Múltipla Escolha para o módulo de aproximação com destaque visual de seleção
- [x] 3.3 Construir sintetizador procedural de áudio baseado em Web Audio Oscillator / PCM para disparo de frequências pentatônicas com 0ms de latência e zero download de assets
- [x] 3.4 Integrar disparadores de vibração háptica (`selectionAsync` para digitação, `impactAsync(Heavy)` para combos e recordes)
- [x] 3.5 Desenvolver componente do mascote "Aura" em SVG vetorial por camadas com os 5 patamares progressivos de transcendência (Spark, Surge, Overdrive, Supernova e Singularity) e descompressão suave ao errar
- [x] 3.6 Implementar animações de impacto, faíscas de combo e pontuações flutuantes a 60/120 FPS utilizando React Native Reanimated
- [x] 3.7 Implementar micro-animações cinéticas de decomposição numérica da esquerda para a direita (Fusão de Mercúrio para adição posicional, Acordeão Elástico para multiplicação por 11 e Espelho Simétrico para fatoração)
- [x] 3.8 Implementar camada de persistência local Offline-First (SQLite / MMKV) com fila de sincronização delta em segundo plano para o Supabase
- [x] 3.9 Implementar suporte a gestos direcionais no Teclado Numérico In-App (Flick Numpad: swipe right para envio, swipe left para limpeza e flick vertical no zero para '00')
- [x] 3.10 Desenvolver componente de DNA Matemático (Radar Chart em SVG com 5 eixos) e tela de exportação de cartão social com arquétipo cognitivo
- [x] 3.11 Construir o Laboratório Tátil de Geometria com sliders interativos e renderização dinâmica de blocos proporcionais para $(a+b)^2$ e fatoração

## 4. Modos de Jogo e Trilha de Aprendizado

- [x] 4.1 Construir a visualização em árvore da Trilha de Aprendizado com os 6 Graus, nós bloqueados/desbloqueados e contadores de estrelas
- [x] 4.2 Implementar o ciclo tripartite da lição (Card de Teoria Relâmpago -> Andaime de Passos -> Bateria de Fixação cronometrada)
- [x] 4.3 Desenvolver o Modo 1 Minuto (Blitz) com cronômetro regressivo de 60s, filtros customizáveis de operações e cálculo de bônus
- [x] 4.4 Desenvolver o Modo Morte Súbita com regra de 1 vida, aceleração progressiva do tempo por questão e multiplicador exponencial
- [x] 4.5 Construir o Modo Batalha Local (Split-Screen) com dois teclados e painéis invertidos em 180° no mesmo dispositivo móvel
- [x] 4.6 Desenvolver o Modo Duelo Fantasma (Shadow Racing) com carregamento instantâneo de séries temporais de runs gravadas de oponentes do mesmo Elo
- [x] 4.7 Desenvolver o Modo Desafio Diário ("Mathle") com semente global às 00:00 UTC e gerador de cards compartilháveis em emojis para redes sociais
- [x] 4.8 Desenvolver o Modo Flash Anzan Visuoespacial com projetor numérico centralizado a cadências configuráveis de 200ms a 400ms por termo
- [x] 4.9 Desenvolver o Modo Flow Zen com sintetizador adaptativo procedural de camadas Lofi (bateria, piano Rhodes, chuva e baixo)
- [x] 4.10 Construir o sistema de Batalhas de Chefes Cognitivos (Boss Fights) com barra de HP, temporizador regressivo de ataque e tela de vitória com concessão de skins da Aura

## 5. Backend Supabase e Duelo 1v1 Online

- [x] 5.1 Criar scripts de migração PostgreSQL no Supabase com tabelas de perfis, progresso, match_records, ghost_runs, daily_challenges, boss_battles, user_unlocked_skins, cognitive_radars, turmas e tarefas com regras RLS
- [x] 5.2 Implementar função RPC no PostgreSQL para consolidação segura de pontuações de partidas e descarte de submissões suspeitas (<150ms)
- [x] 5.3 Implementar sistema de matchmaking e protocolo de sincronização para o Duelo 1v1 Online via canais Supabase Realtime WebSockets
- [x] 5.4 Implementar pipeline de telemetria de hesitação cognitiva para consolidação de tempos de reação (ms) por operação e geração de diagnósticos analíticos

## 6. Módulo B2B / Sala de Aula para Professores

- [x] 6.1 Criar tela de criação de turmas, geração de código alfanumérico e gerenciamento de lista de alunos inscritos
- [x] 6.2 Criar fluxo de agendamento de tarefas pedagógicas com seleção granular de técnicas e prazos
- [x] 6.3 Construir painel analítico do professor com agregação de precisão, tempo médio e mapa de calor de pontos cegos cognitivos da turma
