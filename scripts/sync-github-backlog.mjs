#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function syncGitHubBacklog() {
  console.log('\n📋 ========================================================');
  console.log('   SINCRONIZAÇÃO DE BACKLOG GITHUB PROJECTS · AURAMATH');
  console.log('========================================================\n');

  const complianceFile = path.join(rootDir, 'src/data/spec-compliance.json');
  let complianceData = { items: [] };

  if (fs.existsSync(complianceFile)) {
    try {
      complianceData = JSON.parse(fs.readFileSync(complianceFile, 'utf-8'));
    } catch {
      // ignore
    }
  }

  const backlogItems = [
    // --- COLUNA: BACKLOG (FUTURO / PENDENTE) ---
    {
      title: '[Futuro] 1v1 Online Realtime WebSocket',
      column: 'Backlog',
      labels: ['multiplayer', 'websocket', 'future'],
      body: 'Implementar confrontos síncronos 1v1 remotos via WebSocket com pareamento por ELO cognitivo e árbitro Aura em tempo real (Fase Final da plataforma).',
    },
    {
      title: '[Futuro] Auditoria Anti-Cheat Criptográfica',
      column: 'Backlog',
      labels: ['security', 'anti-cheat', 'future'],
      body: 'Auditoria de telemetria motora e validação criptográfica de sementes para comprovação de autenticidade dos tempos de resolução.',
    },
    {
      title: '[Futuro] Módulo Escolar e Gestão de Turmas',
      column: 'Backlog',
      labels: ['education', 'classroom', 'future'],
      body: 'Construir painel docente, geração de código de convite para turmas e diagnóstico automatizado de pontos cegos pedagógicos dos alunos.',
    },
    {
      title: '[Futuro] Teclado Gestual Tátil Mobile',
      column: 'Backlog',
      labels: ['mobile', 'gestures', 'future'],
      body: 'Refinar entrada por swipe gestual e feedback háptico na versão mobile após estabilização completa da versão web.',
    },
    {
      title: '[Futuro] Laboratório Tátil de Geometria Mental',
      column: 'Backlog',
      labels: ['lab', 'visual-geometry', 'future'],
      body: 'Expandir o laboratório com manipulação de áreas de produtos notáveis e corte de retângulos (conceito reformulado em elaboração).',
    },

    // --- COLUNA: CONCLUÍDO (DONE) ---
    {
      title: '[Concluído] Reconciliação Curricular de 7 Graus Cognitivos',
      column: 'Done',
      labels: ['engine', 'curriculum', 'spec-anchored'],
      body: 'Oficializados os 7 Graus (I a VII) em @auramath/engine e especificações, incluindo o nó de raízes digitais mod 9 e 11.',
    },
    {
      title: '[Concluído] Calibração de Dificuldade em 3 Tiers (1★, 2★, 3★)',
      column: 'Done',
      labels: ['engine', 'procedural', 'spec-anchored'],
      body: 'Motor procedural gera questões calibradas em 3 níveis (fácil, médio, difícil) para todos os módulos.',
    },
    {
      title: '[Concluído] Bateria de 10 Questões e 3 Andaimes Guiados por Nó',
      column: 'Done',
      labels: ['drill', 'scaffolding', 'pedagogy'],
      body: 'Eliminado o limite incorreto de 5 questões; estabelecidas 10 questões procedurais e 3 etapas de andaime obrigatórias.',
    },
    {
      title: '[Concluído] Limiar de Retenção de 80% e Tela de Revisão',
      column: 'Done',
      labels: ['retention', 'gamification', 'spec-anchored'],
      body: 'Bloqueio de avanço para acurácia <80%, exigindo revisão de retenção para fixação na memória de trabalho.',
    },
    {
      title: '[Concluído] Eliminação de Chefes, Skins e Duelo Fantasma',
      column: 'Done',
      labels: ['cleanup', 'legacy-removal'],
      body: 'Cancelamento e expurgo completo de mecânicas legadas do código, tipos e especificações.',
    },
    {
      title: '[Concluído] Batalha Split-Screen Local Síncrona',
      column: 'Done',
      labels: ['tabletop', '2p', 'spec-anchored'],
      body: 'Interface de mesa com tela dividida/invertida compartilhando a mesma equação simultânea para ambos os competidores.',
    },
    {
      title: '[Concluído] Desafio Diário Determinístico por Data com Emojis',
      column: 'Done',
      labels: ['daily', 'prng', 'social'],
      body: 'Mulberry32 PRNG determinístico para 20 questões diárias e cópia de grade emoji sem spoilers.',
    },
    {
      title: '[Concluído] Design System Rebrand 01.1 e Emblema da Coruja Aura',
      column: 'Done',
      labels: ['rebrand', 'tokens', 'ui'],
      body: 'Adoção uniforme das cores táteis Verdigris, Marigold, Coral e Paper, substituindo o símbolo Delta pelo emblema da Coruja Aura.',
    },
    {
      title: '[Concluído] Tela Dev de Conformidade e Script de Auditoria',
      column: 'Done',
      labels: ['dev-tools', 'spec-anchored', 'ci'],
      body: 'Criação da tela interativa /dev e comando npm run spec:check com relatório automático de conformidade.',
    },
  ];

  // Gravar arquivo de backlog estruturado
  const dataDir = path.join(rootDir, 'src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dataDir, 'github-backlog.json'),
    JSON.stringify(backlogItems, null, 2),
    'utf-8'
  );

  // Gerar script bash para automação via GitHub CLI
  const shLines = [
    '#!/usr/bin/env bash',
    '# Script de Sincronização Automatizada com GitHub Issues & Projects',
    '# Certifique-se de estar autenticado com: gh auth login',
    '',
    'echo "🚀 Criando tarefas no GitHub..."',
    '',
  ];

  for (const item of backlogItems) {
    const labelsArg = item.labels.join(',');
    shLines.push(
      `gh issue create --title "${item.title}" --body "${item.body}" --label "${labelsArg}"`
    );
  }

  shLines.push('', 'echo "✅ Todas as tarefas foram sincronizadas com o GitHub!"');

  const shPath = path.join(rootDir, 'scripts/sync-gh-project.sh');
  fs.writeFileSync(shPath, shLines.join('\n'), 'utf-8');

  // Gerar script PowerShell para Windows
  const psLines = [
    '# Script de Sincronização com GitHub Issues & Projects (PowerShell)',
    '# Certifique-se de estar autenticado com: gh auth login',
    '',
    'Write-Host "🚀 Criando tarefas no GitHub..." -ForegroundColor Cyan',
    '',
  ];

  for (const item of backlogItems) {
    const labelsArg = item.labels.join(',');
    psLines.push(
      `gh issue create --title "${item.title}" --body "${item.body}" --label "${labelsArg}"`
    );
  }

  psLines.push('', 'Write-Host "✅ Todas as tarefas foram sincronizadas com o GitHub!" -ForegroundColor Green');

  const psPath = path.join(rootDir, 'scripts/sync-gh-project.ps1');
  fs.writeFileSync(psPath, psLines.join('\n'), 'utf-8');

  console.log(`✅ Backlog gerado com ${backlogItems.length} itens:`);
  console.log(`   - ${backlogItems.filter((i) => i.column === 'Done').length} tarefas Concluídas`);
  console.log(`   - ${backlogItems.filter((i) => i.column === 'Backlog').length} tarefas no Backlog Futuro`);
  console.log(`\n📁 Arquivos gerados:`);
  console.log(`   - src/data/github-backlog.json`);
  console.log(`   - scripts/sync-gh-project.sh`);
  console.log(`   - scripts/sync-gh-project.ps1`);
  console.log('\n--------------------------------------------------------');
  console.log('📌 PASSO A PASSO PARA INTEGRAR NO GITHUB:');
  console.log('1. Instale e autentique a CLI do GitHub (se ainda não tiver):');
  console.log('   winget install --id GitHub.cli');
  console.log('   gh auth login');
  console.log('2. Execute o script de sincronização:');
  console.log('   .\\scripts\\sync-gh-project.ps1');
  console.log('3. No GitHub: crie um Projeto (Projects -> New project -> Board) e vincule ao repositório.');
  console.log('   As issues criadas aparecerão automaticamente para você organizar nas colunas KanBan!\n');
}

syncGitHubBacklog();
