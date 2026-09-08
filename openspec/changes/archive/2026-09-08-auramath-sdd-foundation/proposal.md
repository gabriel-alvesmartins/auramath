# Proposal: Auramath SDD Foundation

## Why

O aprendizado tradicional de matemática prioriza algoritmos mecânicos de papel e lápis (da direita para a esquerda), gerando lentidão, dependência de calculadoras e aversão ao cálculo mental em estudantes de Ensino Fundamental, Médio, vestibulandos e concurseiros. O **Auramath** surge para preencher essa lacuna por meio de uma plataforma gamificada (Web e Mobile) focada em **algoritmos cognitivos da esquerda para a direita**, heurísticas estruturais de álgebra abstrata (fatoração, complementos, bases modulares, aproximações de Fermi, Matemática Védica e Sistema Trachtenberg) e modos competitivos de alto engajamento sensorial.

## What Changes

Esta mudança estabelece a especificação completa de engenharia de software (SDD) e fundação do Auramath antes da codificação:

- Especificação do **Motor Procedural Matemático** (`@auramath/engine`) com geração infinita de questões baseada em regras algébricas, andaime cognitivo (passos intermediários) e gerador de distratores de ordem de grandeza.
- Estruturação da **Trilha de Aprendizado em 6 Graus** (Estilo Duolingo) cobrindo Adição/Subtração Posicional, Fatores Notáveis, Produtos Notáveis, Aproximação & Fermi, Sistemas Históricos e Transcendência Aritmética.
- Definição dos **Modos de Jogo**: Modo 1 Minuto (Blitz), Morte Súbita (Sobrevivência Infinita), Batalha Local (Split-Screen com 2 teclados no mesmo aparelho), Duelo 1v1 Online Realtime, **Duelo Fantasma Assíncrono (Shadow Racing)**, **Desafio Diário ("Mathle")**, **Flash Anzan Visuoespacial** (exibição relâmpago a 300ms), **Modo Flow Zen** (música lofi generativa procedural) e **Batalhas de Chefes Cognitivos (Boss Fights)** ao fim de cada Grau com desbloqueio de skins da Aura.
- Especificação de **Sensory Gamification & Game Juice**: Mascote "Aura" reativo em 5 níveis de energia com descompressão suave, **Teclado Gestual de Alta Velocidade (Flick Numpad)** com atalhos de deslize, **DNA Matemático (Radar Cognitivo de 5 Eixos)** compartilhável, **Laboratório Tátil de Geometria** para visualização espacial de produtos notáveis, pedagogia cinética dos números, síntese sonora pentatônica procedural a 0ms via oscilador Web Audio, vibração háptica escalonada e animações a 120 FPS.
- Modelagem do **Módulo B2B / Sala de Aula para Professores**: Gestão de turmas, distribuição de tarefas diagnósticas, ranking escolar e telemetria de pontos fracos cognitivos.
- Arquitetura técnica unificada com **React Native (Expo)** para Web/iOS/Android, **Offline-First** local via SQLite/MMKV e sincronização delta em segundo plano para o **Supabase** (PostgreSQL, Auth, RPC e WebSockets Realtime).

## Capabilities

### New Capabilities
- `math-engine`: Motor procedural TypeScript desacoplado para geração de problemas de cálculo mental, resolução decomposta passo-a-passo (scaffolding), distratores de estimativa e validação anti-cheat por telemetria temporal.
- `learning-track`: Sistema de nós de progressão estilo Duolingo com ciclo triplo (teoria relâmpago, andaime interativo e bateria de fixação de 10-20 questões) com retenção de estrelas/coroas.
- `game-modes`: Mecânicas de jogo para Blitz (60s), Morte Súbita, Batalha Local (Split-Screen), Duelo 1v1 Online via WebSockets, Duelo Fantasma Assíncrono (Shadow Racing), Desafio Diário ("Mathle"), Flash Anzan Visuoespacial, Modo Flow Zen e Batalhas de Chefes Cognitivos.
- `sensory-gamification`: Sistema de feedback audiovisual e tátil com mascote interativo "Aura" (5 patamares de transcendência), Teclado Gestual Flick Input, DNA Matemático (Radar de 5 Eixos), Laboratório Tátil de Geometria, pedagogia cinética de decomposição numérica, escala sonora pentatônica sintetizada a 0ms e haptics em dispositivos móveis.
- `classroom-b2b`: Módulo institucional para professores gerenciarem turmas, emitirem desafios parametrizados e acompanharem dashboards diagnósticos de desempenho dos alunos.
- `offline-first-sync`: Arquitetura de persistência local resiliente garantindo jogabilidade completa sem conexão à internet e sincronização delta assíncrona para a nuvem.
- `cognitive-telemetry`: Algoritmo de análise temporal de resposta (milissegundos) por operação para diagnosticar hesitação cognitiva, alimentar micro-treinos cirúrgicos e calcular os eixos do Radar Cognitivo.

### Modified Capabilities
<!-- Nenhuma capacidade modificada (projeto novo). -->

## Impact

- **Código e Repositório**: Criação da arquitetura monorepo ou estrutura modular com frontend Expo e pacote `@auramath/engine`.
- **Dependências**: Expo SDK, React Native Reanimated, Expo Haptics, Expo Audio/AV, Supabase JS Client.
- **Backend**: Esquema relacional no Supabase (PostgreSQL), políticas de RLS, canais Realtime para matchmaking e WebSockets de duelo.
