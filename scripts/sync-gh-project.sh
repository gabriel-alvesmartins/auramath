#!/usr/bin/env bash
# Script de Sincronização Automatizada com GitHub Issues & Projects
# Certifique-se de estar autenticado com: gh auth login

echo "🚀 Criando tarefas no GitHub..."

gh issue create --title "[Futuro] 1v1 Online Realtime WebSocket" --body "Implementar confrontos síncronos 1v1 remotos via WebSocket com pareamento por ELO cognitivo e árbitro Aura em tempo real (Fase Final da plataforma)." --label "multiplayer,websocket,future"
gh issue create --title "[Futuro] Auditoria Anti-Cheat Criptográfica" --body "Auditoria de telemetria motora e validação criptográfica de sementes para comprovação de autenticidade dos tempos de resolução." --label "security,anti-cheat,future"
gh issue create --title "[Futuro] Módulo Escolar e Gestão de Turmas" --body "Construir painel docente, geração de código de convite para turmas e diagnóstico automatizado de pontos cegos pedagógicos dos alunos." --label "education,classroom,future"
gh issue create --title "[Futuro] Teclado Gestual Tátil Mobile" --body "Refinar entrada por swipe gestual e feedback háptico na versão mobile após estabilização completa da versão web." --label "mobile,gestures,future"
gh issue create --title "[Futuro] Laboratório Tátil de Geometria Mental" --body "Expandir o laboratório com manipulação de áreas de produtos notáveis e corte de retângulos (conceito reformulado em elaboração)." --label "lab,visual-geometry,future"
gh issue create --title "[Concluído] Reconciliação Curricular de 7 Graus Cognitivos" --body "Oficializados os 7 Graus (I a VII) em @auramath/engine e especificações, incluindo o nó de raízes digitais mod 9 e 11." --label "engine,curriculum,spec-anchored"
gh issue create --title "[Concluído] Calibração de Dificuldade em 3 Tiers (1★, 2★, 3★)" --body "Motor procedural gera questões calibradas em 3 níveis (fácil, médio, difícil) para todos os módulos." --label "engine,procedural,spec-anchored"
gh issue create --title "[Concluído] Bateria de 10 Questões e 3 Andaimes Guiados por Nó" --body "Eliminado o limite incorreto de 5 questões; estabelecidas 10 questões procedurais e 3 etapas de andaime obrigatórias." --label "drill,scaffolding,pedagogy"
gh issue create --title "[Concluído] Limiar de Retenção de 80% e Tela de Revisão" --body "Bloqueio de avanço para acurácia <80%, exigindo revisão de retenção para fixação na memória de trabalho." --label "retention,gamification,spec-anchored"
gh issue create --title "[Concluído] Eliminação de Chefes, Skins e Duelo Fantasma" --body "Cancelamento e expurgo completo de mecânicas legadas do código, tipos e especificações." --label "cleanup,legacy-removal"
gh issue create --title "[Concluído] Batalha Split-Screen Local Síncrona" --body "Interface de mesa com tela dividida/invertida compartilhando a mesma equação simultânea para ambos os competidores." --label "tabletop,2p,spec-anchored"
gh issue create --title "[Concluído] Desafio Diário Determinístico por Data com Emojis" --body "Mulberry32 PRNG determinístico para 20 questões diárias e cópia de grade emoji sem spoilers." --label "daily,prng,social"
gh issue create --title "[Concluído] Design System Rebrand 01.1 e Emblema da Coruja Aura" --body "Adoção uniforme das cores táteis Verdigris, Marigold, Coral e Paper, substituindo o símbolo Delta pelo emblema da Coruja Aura." --label "rebrand,tokens,ui"
gh issue create --title "[Concluído] Tela Dev de Conformidade e Script de Auditoria" --body "Criação da tela interativa /dev e comando npm run spec:check com relatório automático de conformidade." --label "dev-tools,spec-anchored,ci"

echo "✅ Todas as tarefas foram sincronizadas com o GitHub!"