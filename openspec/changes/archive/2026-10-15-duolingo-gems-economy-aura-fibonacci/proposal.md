## Why

A retenção e monetização sustentável do Duolingo baseiam-se em dois motores complementares: uma economia circular de gemas com consumíveis de segurança (como o *Streak Freeze*) e uma camada de assinatura premium de prestígio com alto valor percebido e zero atrito destrutivo. 

No AuraMath, a experiência deve traduzir essa mecânica para o universo da matemática visual de alta precisão ("Não calcule. Veja."), mantendo os guardrails inegociáveis do Rebrand 01.1: sem vidas punitivas na trilha curricular, sem popups agressivos de spam e sem fontes neon estridentes. 

A introdução da **Frente C (Economia de Gemas & Assinatura Aura Fibonacci)** viabiliza a Loja Editorial, o fluxo de aquisição e equipamento de Congelamentos de Ofensiva (*Streak Freeze*), consumíveis de Foco Mental (Poções de 2x XP por 15 minutos), além do Paywall de conversão do **Aura Fibonacci** — a categoria de assinatura de prestígio matemático com espiral áurea, radar cognitivo aprofundado, temas de caderno exclusivos e testes de treino ilimitados.

## What Changes

- **Motor de Economia de Gemas e Consumíveis (`@auramath/engine` & `gamificationEngine`):**
  - Padronização do saldo de Gemas/Marigold (`gems`: ganho em lições perfeitas, marcos de streak e baús circadianos).
  - Compra, posse e ativação de itens consumíveis:
    - *Congelamento de Ofensiva (Streak Freeze)*: armazena até 2 cargas que protegem a ofensiva em dias sem prática.
    - *Poção de Foco Mental (2x XP Boost)*: ativação de multiplicador de 2x XP por 15 minutos cronometrados com contagem regressiva no app.
- **Loja Editorial Tátil (`ShopView.tsx` / rota `/shop`):**
  - Seção 1 — *Aura Fibonacci*: Card de prestígio com espiral dourada de Fibonacci, benefícios e gatilho do paywall.
  - Seção 2 — *Ofensiva e Proteção*: Compra de Streak Freeze e Wagers de consistência com botões táteis 3D.
  - Seção 3 — *Impulso Cognitivo*: Poções de XP Boost de 15 minutos com saldo de gemas.
  - Seção 4 — *Cadernos & Personalização*: Seleção e prévia de temas de caderno editorial (Papiro Clássico, Blueprint Geométrico, Dark Obsidian).
- **Paywall Editorial Aura Fibonacci (`AuraFibonacciModal.tsx`):**
  - Modal elegante com ilustração vetorial da Espiral Áurea de Fibonacci e mascote Prisma em postura de prestígio (`supernova`/`eureka`).
  - Lista de privilégios cognitivos: Treinos sem limites, Radar Cognitivo completo de 5 eixos sem bloqueio, Temas exclusivos de papelaria matemática, Badge dourado no perfil e dobro de gemas em baús.
  - Alternador de periodicidade com ancoragem de valor: Anual (com desconto e 7 dias de degustação gratuita) vs. Mensal.
  - Botão tátil 3D primário `EXPERIMENTAR 7 DIAS GRÁTIS ➔` e botão discreto de fechar sem culpa (sem *dark patterns*).
- **Integração no App Shell (`App.tsx` & Header):**
  - Acesso à Loja ao clicar no contador de Gemas/Estrelas do topo ou via nova rota `/shop`.
  - Chip visual de XP Boost ativo no topo (mostrando tempo restante) quando consumido.
  - Sincronização em tempo real entre loja, modal da ofensiva e estado do perfil.

## Capabilities

### New Capabilities
- `gems-economy-subscription`: Gestão de saldo e fluxo econômico de Gemas/Marigold, catálogo da Loja Editorial com consumíveis de segurança (Streak Freeze) e foco mental (XP Boost), e sistema de assinatura premium Aura Fibonacci com paywall editorial transparente.

### Modified Capabilities
<!-- Nenhuma modificação com quebra de requisito nas capacidades existentes; as capacidades existentes (sensory-gamification, learning-track) mantêm seus contratos intactos. -->

## Impact

- `@auramath/engine`: Extensão das funções de gamificação para suportar inventário de consumíveis, boosters de XP ativos e status da assinatura Aura Fibonacci (`isFibonacciMember`, `activeTheme`, `subscriptionTier`).
- `src/services/gamificationEngine.ts`: Novos métodos `buyShopItem`, `activateXpBoost`, `setFibonacciSubscription`, `equipTheme` e persistência no `localStorage`.
- `src/views/ShopView.tsx`: Nova view da Loja Editorial conectada ao motor.
- `src/components/editorial/AuraFibonacciModal.tsx`: Novo componente modal para apresentação e contratação da assinatura.
- `src/App.tsx`: Roteamento para `/shop`, gatilho de abertura do modal de assinatura e exibição de badge de Fibonacci e XP Boost ativo.
