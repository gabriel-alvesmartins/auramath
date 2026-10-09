# Dispatch Messages

## 2026-10-02T13:28:15Z

Você é o Project Orchestrator encarregado de executar a reconstrução integral da interface do Auramath segundo as diretrizes de design do Rebrand 01.1: “Matemática como descoberta” (Tagline: “Não calcule. Veja.”).

Seu diretório de trabalho:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/orchestrator_3/

Arquivo com o pedido original completo e autoritativo:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/ORIGINAL_REQUEST.md (veja a seção sob `## 2026-10-02T13:26:38Z`).

Habilidade (Skill) disponível no projeto para consulta/aplicação de padrões de interface de excelência:
c:\Users\Pichau\Desktop\Projetos\auramath\.agents\skills\impeccable\SKILL.md

Requisitos essenciais:
R1. Design System & Theming Foundations:
- Modo Claro (Paper #F7F4EA & Cream #FFFDF6) como padrão operacional e imediato da aplicação ao carregar.
- Consolidar tokens semânticos completos em src/theme/tokens.ts e src/theme/theme.css (Paper, Cream, Ink #202522, Ink Secondary, Verdigris #176B5B, Marigold #F2B84B, Coral #E76F61, Iris #6E5AA6, bordas de régua/papel e chanfros táteis de papel prensado).
- Dark Mode refinado baseado em Ink Mineral (#202522) e Paper (#F7F4EA), sem preto absoluto #030407 ou neons.

R2. App Shell & Navegação Editorial:
- Redesenhar src/App.tsx para eliminar gradientes radiais espaciais, cores fixas neon e barras com glassmorphism.
- Header com logotipo amigável em lowercase aura●math, integrando o símbolo de ponto matemático de observação.
- Bottom bar tátil com 5 abas editoriais e estados ativos com pastilha tátil limpa em Verdigris/Paper.

R3. Mascote Aura & Símbolo Central:
- Aura em formato de criatura geométrica em SVG editorial (src/components/AuraMascotWeb.tsx): corpo oval suave com traço de nanquim, olhos de ponto expressivos (• •), boquinha sutil e antena com o ponto de observação (●).
- Balão de fala estilo quadrinho de jornal/caderno com cauda triangular limpa e sombra tátil de papel.
- Progressão pedagógica das 5 formas: Dot (Observação) → Line (Conexão) → Shape (Estrutura) → Pattern (Reconhecimento) → Insight (Antecipação).

R4. Caderno Vivo de Descobertas (Trilha & Nós):
- Em src/views/TrackView.tsx, trilha zigue-zague como um caderno de anotações milimetrado pontilhado limpo.
- Banner de Unidade em Verdigris sólido com tipografia branca/creme e botão 3D "CADERNO GUIA".
- Nós da trilha 3D em marfim/papel prensado (src/components/tactile/TrackSerpentineNode.tsx), nós concluídos em Verdigris, nós ativos em Marigold, com anel de progresso concêntrico e popover em Cream/Ink com botão tátil.
- Caixas de Descoberta substituindo o baú cósmico e Mestre dos Padrões substituindo o antigo chefe.

R5. Telas de Exercício, Feedback & Vitória:
- Em src/views/DuolingoLessonView.tsx, equações diagramadas visualmente com setas e relações antes da execução.
- Gaveta de feedback imediato não-punitiva (src/components/tactile/FeedbackDrawer.tsx): Acerto em Verdigris Soft ("Descoberta Brilhante! ✦"); Ajuste em Coral Soft ("Veja a estrutura oculta:").
- Tela de vitória celebrando o reconhecimento de estrutura: cartões editoriais 3D de Pontos de Descoberta (XP) e Precisão, análise de segundos economizados pensando antes de calcular, e botão 3D "PRÓXIMO INSIGHT ➔".
- Treino e "Olho Matemático" (src/views/TrainHubView.tsx) estilizados como fichas de laboratório/caderno.

Critérios de Aceitação Obrigatórios:
- npm test passa 100% com zero falhas.
- npm run build --workspace=@auramath/engine compila com sucesso.
- npx vite build compila o simulador web com zero erros.
- Contraste WCAG AA (>= 4.5:1 para texto normal, >= 3:1 para UI).
- Tema padrão ao carregar é Light Mode (Paper #F7F4EA e Cream #FFFDF6).
- Zero ocorrências de neon cyan (#00F2FE), roxo espacial (#8A2BE2) ou fundos cósmicos nos estilos principais.
- Logotipo aura●math visível no topo da aplicação.
- Botões 3D táteis afundam mecanicamente ao toque (0ms latency, chanfro inferior tátil).
- Cópias em Português do Brasil (PT-BR) com foco em descoberta.

## 2026-10-02T17:43:49Z

Sentinel Liveness Ping: A janela de quota foi restabelecida. Por favor, verifique o status do Worker M4 (convId: faf318b9-a5e9-4ce8-803f-0e843608e110), retome os trabalhos em M4/M5 e atualize seu progress.md.
