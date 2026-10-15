## Context

O AuraMath possui subsistemas de gamificação (`packages/engine/src/gamification.ts` e `src/services/gamificationEngine.ts`) que já calculam streaks, wagers e ligas semanais. No entanto, o saldo de gemas e estrelas opera de forma fragmentada, sem uma central de consumo estruturada (Loja Editorial), sem interface dedicada para ativação de consumíveis táteis (Streak Freeze e Poções de XP) e sem a formalização do plano de assinatura de prestígio **Aura Fibonacci**.

Ver `proposal.md` para motivação e `specs/gems-economy-subscription/spec.md` para os requisitos de comportamento.

## Goals / Non-Goals

**Goals:**
- Unificar e estruturar a economia de Gemas Marigold no motor (`@auramath/engine` e `gamificationEngine`), com persistência local e suporte a transações síncronas com rollback seguro.
- Prover a visualização canônica da Loja Editorial (`src/views/ShopView.tsx`), acessível na rota `/shop` e pelo chip de Gemas do topo, respeitando a Thumb Zone móvel de 430px e botões táteis 3D a 0ms.
- Implementar a mecânica visual e tátil do *Streak Freeze* (inventário de até 2 cargas, compra por 100 gemas, bloqueio no teto) e *XP Boost* (2x por 15 min com contagem regressiva no topo).
- Criar o componente modal da assinatura **Aura Fibonacci** (`AuraFibonacciModal.tsx`) com renderização vetorial da Espiral Áurea, mascote Prisma em prestígio, comparativo de benefícios claros e seleção anual/mensal sem anti-padrões ou bloqueio de progresso.
- Implementar sistema de temas de caderno editorial matemático (`papiro`, `blueprint`, `obsidian`), com desbloqueio exclusivo para assinantes Aura Fibonacci e prévia tátil imediata.

**Non-Goals:**
- Integração com gateways reais de pagamento bancário (Stripe/Apple StoreKit/Google Play Billing); o fluxo implementará simulação de checkout e concessão de assinatura no sandbox local e sincronização com `cloudSync`.
- Introdução de limites de vidas ou corações que bloqueiem lições na trilha curricular (guardrail absoluto da Lei de Descompressão Empática).
- Venda de skins antropomórficas espalhafatosas ou mecânicas de *pay-to-win* para manipular o ranking da Arena Elo.

## Decisions

### 1. Unificação da Moeda e Compatibilidade Reversa
- **Decisão:** Manter paridade 1:1 entre `stars` e `gems` no estado do `gamificationEngine`, expondo propriedades consistentes `gems: number` (alias de `stars`) para evitar quebras em testes de ligas existentes e nos nós da trilha.
- **Alternativas consideradas:** Criar uma segunda moeda virtual ("Gemas" vs. "Estrelas"). Rejeitado por aumentar a complexidade cognitiva do aluno e contradizer a simplicidade editorial do AuraMath.

### 2. Extensão do Estado de Assinatura e Consumíveis em `GamificationStoreState`
- **Decisão:** Adicionar ao estado:
  ```typescript
  isFibonacciMember: boolean;
  fibonacciPlan?: 'annual' | 'monthly' | null;
  fibonacciTrialEndsAt?: string | null;
  activeTheme: 'papiro' | 'blueprint' | 'obsidian';
  unlockedThemes: ('papiro' | 'blueprint' | 'obsidian')[];
  ```
- **Alternativas consideradas:** Gerenciar estado de assinatura em serviço separado. Rejeitado para preservar a coesão do `gamificationEngine` e permitir persistência unificada atômica no `localStorage` e `cloudSync`.

### 3. Acesso à Loja Editorial via Cabeçalho e Rota `/shop`
- **Decisão:** Adicionar rota canônica `shop` no roteador do `App.tsx` e transformar o pill de Gemas no cabeçalho em gatilho interativo tátil com clique para abrir a Loja.
- **Alternativas consideradas:** Adicionar uma 5ª aba na barra de navegação inferior. Rejeitado porque 5 abas em 430px espremem a ergonomia tátil dos dedos e violam a regra de foco editorial do produto (Trilha, Treino, Duelos, Perfil continuam como as 4 abas soberanas).

### 4. Componente de Paywall `AuraFibonacciModal`
- **Decisão:** Criar modal flutuante com backdrop desfocado (`backdrop-filter: blur(8px)`), renderização SVG da Espiral de Fibonacci com proporção áurea ($\phi = 1.618$), mascote Prisma em postura de prestígio e botões de seleção de plano com extrusão 3D de 4px e resposta a 0ms.
- **Alternativas consideradas:** Redirecionar para uma página externa de checkout. Rejeitado para manter o ritmo imersivo da experiência in-app.

### 5. Gestão do Timer do XP Boost
- **Decisão:** O estado `activeXpBoost` armazena timestamp absoluto em milissegundos (`expiresAt`). Um hook leve com `setInterval` de 1000ms atualiza a contagem formatada no cabeçalho (`MM:SS`) sem provocar refactors ou re-renders desnecessários na árvore pesada de lições.
- **Alternativas consideradas:** Atualizações via `requestAnimationFrame`. Rejeitado para poupar bateria móvel já que a precisão de segundo a segundo é suficiente para um boost de 15 minutos.

## Risks / Trade-offs

- **[Risco] Saldo de gemas inconsistente ao trocar de abas ou recarregar:**
  - *Mitigação:* As ações da Loja (`buyStreakFreeze`, `buyXpBoost`, `unlockTheme`) passam pelo `gamificationEngine` central, que notifica subscribers e grava no `localStorage` em cada mutação.
- **[Risco] Percepção de paywall agressivo pelos alunos:**
  - *Mitigação:* O paywall do Aura Fibonacci possui botão "X" bem visível, sem contadores falsos de escassez e sem bloquear nenhuma lição ou cálculo da trilha educacional. O usuário pode desfrutar 100% da pedagogia matemática gratuitamente.
- **[Risco] CLS (Cumulative Layout Shift) durante a contagem regressiva do XP Boost:**
  - *Mitigação:* O chip de XP Boost no cabeçalho utiliza largura fixa e `font-variant-numeric: tabular-nums` com a fonte JetBrains Mono.

## Migration Plan

1. As propriedades novas de estado em `DEFAULT_STATE` serão preenchidas com valores padrão seguros (`isFibonacciMember: false`, `activeTheme: 'papiro'`).
2. Usuários existentes carregando o `localStorage` anterior terão seus dados mesclados automaticamente via `Object.assign` com os novos campos.
3. Testes unitários do `@auramath/engine` e E2E garantirão cobertura de 100% nas transações de compra e nos gatilhos da assinatura.
