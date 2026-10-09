# Original User Request

## 2026-10-01T19:06:32Z

Use a full team of agents ("Invoque quantos agentes forem necessários para a reconstrução completa da interface única").

Redesenho completo da interface do AuraMath e implementação de um Design System proprietário inspirado nos princípios de produto do Duolingo (progressão visual em zigue-zague, microlições curtas, física tátil 3D, feedback imediato não-punitivo, streak e mascote ancorado), com uma paleta de cores madura e não excessivamente saturada, além de suporte nativo a Modo Claro e Modo Escuro.

Working directory: c:/Users/Pichau/Desktop/Projetos/auramath
Integrity mode: development

## Requirements

### R1. Design System Foundations & Theming (Tokens & Modos Claro/Escuro)
- Criar a fundação de tokens semânticos de design com paleta sóbria, elegante e de alto contraste (WCAG AA/AAA), afastando-se de saturações neon agressivas.
- Suporte bidirecional nativo a Modo Escuro (Dark Obsidian) e Modo Claro (Paper / Nebula Light) com alternador de tema instantâneo persistido.
- Definição tipográfica estrita com numerais tabulares anti-layout shift (JetBrains Mono) e fontes geométricas limpas para interface (Plus Jakarta Sans / Inter).
- Padronização de tokens de profundidade e extrusão 3D tátil (elevações chanfradas com translação física de clique/toque).

### R2. Biblioteca de Componentes Táteis 3D
- Desenvolver conjunto de componentes reutilizáveis baseados na física tátil do Duolingo:
  - Aura3DButton: Botão com extrusão chanfrada inferior de 4px que afunda 3px no toque/clique a 0ms de latência.
  - StatCard3D: Cartões de métricas duplos (XP, Precisão, Tempo) inspirados no frame de referência do Figma.
  - FeedbackDrawer: Gaveta de feedback imediato não-punitivo com descompressão suave e exibição didática de atalhos.
  - TactileNumpad: Teclado numérico ergonômico de 56dp com resposta tátil e layout otimizado para uma mão.
  - TrackSerpentineNode: Nós estelares com coroas de estrelas, anéis de órbita e balão de ação.

### R3. Trilha de Progressão em Zigue-Zague (Home Screen)
- Reconstruir a tela principal de navegação com caminho em zigue-zague fluido cobrindo os 6 Graus cognitivos.
- O mascote Aura deve ficar visualmente ancorado ao lado do nó ativo/atual da jornada, com animação de flutuação suave e balões contextuais de fala.
- Seletor de unidades deslizante no topo, baús de recompensas intercalados e nós de castelo de chefes.

### R4. Fluxo de Microlições & Tela de Celebração ("Lesson Complete")
- Reformular o fluxo de aula imersiva (ciclo de teoria rápida, andaime de lacunas e bateria de agilidade de 5 questões).
- Nova tela de vitória (Lesson Complete) espelhada no layout de referência do Figma:
  - Mascote Aura celebrando no centro.
  - Dois cards 3D lado a lado (Total XP com ícone de raio e Precisão com ícone de alvo).
  - Análise de eficiência ("Segundos economizados").
  - Botão 3D de continuação em largura total no rodapé.

### R5. Hub de Treino, Modos de Jogo e Perfil Cognitivo
- Harmonizar todas as superfícies auxiliares ao novo Design System:
  - Hub de Treino com seletor unificado (Olho Matemático, Blitz 60s, Morte Súbita, Flash Anzan, Flow Zen).
  - Tela de perfil com o gráfico pentagonal do Radar Cognitivo de 5 Eixos e catálogo de cosméticos.

## Acceptance Criteria

### Automated & Build Verification
- [ ] O comando `npm test` executa toda a suíte de testes do `@auramath/engine` com 100% de sucesso.
- [ ] O comando `npx vite build` compila a aplicação Web de produção sem qualquer erro de TypeScript, CSS ou JSX.

### Functional & UI Verification
- [ ] A interface possui um botão funcional que alterna entre Modo Escuro e Modo Claro, atualizando todas as superfícies, textos e botões com contraste legível.
- [ ] O mascote Aura renderiza posicionado ao lado do nó em progresso na trilha em zigue-zague.
- [ ] Os botões táteis 3D afundam fisicamente ao serem pressionados (translateY mecânico com recuo da borda inferior chanfrada).
- [ ] A conclusão de uma microlição exibe a nova tela de vitória com os dois cartões 3D (XP e Precisão) e o mascote comemorando.
- [ ] O modo "Olho Matemático" opera integrado ao novo Design System, permitindo selecionar o atalho algébrico ótimo com feedback visual e sonoro.


## 2026-10-02T13:26:38Z

Reconstruir integralmente a interface do Auramath segundo as diretrizes de design do Rebrand 01.1: “Matemática como descoberta” (Tagline: “Não calcule. Veja.”), transacionando de uma estética cósmica/neon/cyberpunk para uma identidade editorial, geométrica, inteligente e acolhedora (Paper #F7F4EA, Cream #FFFDF6, Ink #202522, Verdigris #176B5B, Marigold #F2B84B, Coral #E76F61, Iris #6E5AA6).

Working directory: c:/Users/Pichau/Desktop/Projetos/auramath
Integrity mode: development

Requirements:
R1. Design System & Theming Foundations:
- Modo Claro (Paper & Cream) deve ser o padrão operacional e imediato da aplicação.
- Consolidar tokens semânticos completos em src/theme/tokens.ts e src/theme/theme.css (Paper, Cream, Ink, Ink Secondary, Verdigris, Marigold, Coral, Iris, bordas de régua/papel e chanfros táteis de papel prensado).
- Dark Mode refinado baseado em Ink Mineral (#202522) e Paper (#F7F4EA), sem preto absoluto #030407 ou neons.

R2. App Shell & Navegação Editorial:
- Redesenhar src/App.tsx para eliminar gradientes radiais espaciais, cores fixas neon e barras de navegação com glassmorphism.
- Header com logotipo amigável em lowercase aura●math, integrando o símbolo de ponto matemático de observação.
- Bottom bar tátil com 5 abas editoriais e estados ativos com pastilha tátil limpa em Verdigris/Paper.

R3. Mascote Aura & Símbolo Central:
- Aura em formato de criatura geométrica em SVG editorial (src/components/AuraMascotWeb.tsx): corpo oval suave com traço de nanquim, olhos de ponto expressivos (• •), boquinha sutil e antena com o ponto de observação (●).
- Balão de fala estilo quadrinho de jornal/caderno com cauda triangular limpa e sombra tátil de papel.
- Progressão pedagógica das 5 formas: Dot (Observação) → Line (Conexão) → Pattern (Reconhecimento) → Insight (Antecipação).

R4. Caderno Vivo de Descobertas (Trilha & Nós):
- Em src/views/TrackView.tsx, trilha zigue-zague como um caderno de anotações milimetrado pontilhado limpo.
- Banner de Unidade em Verdigris sólido com tipografia branca/creme e botão 3D "CADERNO GUIA".
- Nós da trilha 3D em marfim/papel prensado (src/components/tactile/TrackSerpentineNode.tsx), onde nós concluídos são Verdigris, nós ativos são Marigold, com anel de progresso concêntrico e popover em Cream/Ink com botão tátil.
- Caixas de Descoberta substituindo o baú cósmico e Mestre dos Padrões substituindo o antigo chefe.

R5. Telas de Exercício, Feedback & Vitória:
- Em src/views/DuolingoLessonView.tsx, equações diagramadas visualmente com setas e relações antes da execução.
- Gaveta de feedback imediato não-punitiva (src/components/tactile/FeedbackDrawer.tsx): Acerto em Verdigris Soft ("Descoberta Brilhante! ✦"); Ajuste em Coral Soft ("Veja a estrutura oculta:").
- Tela de vitória celebrando o reconhecimento de estrutura: cartões editoriais 3D de Pontos de Descoberta (XP) e Precisão, análise de segundos economizados pensando antes de calcular, e botão 3D "PRÓXIMO INSIGHT ➔".
- Treino e "Olho Matemático" (src/views/TrainHubView.tsx) estilizados como fichas de laboratório/caderno.

Acceptance Criteria:
- npm test passa 100% com zero falhas.
- npm run build --workspace=@auramath/engine compila com sucesso.
- npx vite build compila o simulador web com zero erros.
- Contraste WCAG AA (>= 4.5:1 para texto normal, >= 3:1 para UI).
- Tema padrão ao carregar é Light Mode (Paper #F7F4EA e Cream #FFFDF6).
- Zero ocorrências de neon cyan (#00F2FE), roxo espacial (#8A2BE2) ou fundos cósmicos nos estilos principais.
- Logotipo aura●math visível no topo da aplicação.
- Botões 3D táteis afundam mecanicamente ao toque (0ms latency, chanfro inferior tátil).
- Cópias em Português do Brasil (PT-BR) com foco em descoberta.
