## Context

Veja `proposal.md - Why`. O AuraMath possui ativos conceptuais e um protótipo inicial de Rive. A tentativa de animar recortes rígidos de imagem via script de texto resultou em movimentos mecânicos ("marionete de papelão"), enquanto vídeos diretos de IA sofrem de alucinações inaceitáveis (como duplicações de ferramentas). O objetivo deste design é estruturar um pipeline profissional, escalável e amigável para desenvolvedores.

## Goals / Non-Goals

**Goals:**
- Dividir os ativos do mascote em três arquivos Rive contextuais (`prisma-lesson.riv`, `prisma-victory.riv`, `prisma-track.riv`), eliminando monólitos incontroláveis.
- Formalizar o workflow colaborativo 80/20% (80% engenharia e estruturação pela IA + 20% polimento tátil pelo desenvolvedor no Rive Editor).
- Modularizar adereços dinâmicos (ponto de interrogação 3D e órbita matemática) através de pontos de fixação (`Anchor_HeadTop` e `Anchor_Hand`).
- Fornecer componentes React semânticos com tipagem estrita TypeScript e fallback SVG automático.

**Non-Goals:**
- Criar uma State Machine monolítica com dezenas de estados em um único `.riv`.
- Reproduzir arquivos de vídeo cru de IA (`.mp4`) dentro do aplicativo.
- Exigir que o desenvolvedor gaste dias aprendendo ilustração vetorial complexa ou rigging avançado do zero.

## Decisions

### Decisão 1: Arquitetura Híbrida por Contexto vs. Monólito de Animação
- **Escolha:** Três arquivos `.riv` contextuais especializados (`lesson`, `victory`, `track`).
- **Racional:** 
  1. *State Machines Enxutas:* Cada máquina possui apenas 3 a 5 estados claros e previsíveis, evitando teias de aranha de transições.
  2. *Performance & Lazy Loading:* A tela de exercícios carrega apenas ~40 KB; celebrações pesadas com confetes e partículas só são carregadas sob demanda ao vencer um nível.
  3. *Segurança no Git:* Alterações na comemoração não afetam o binário da lição.
- **Alternativas consideradas:**
  - *Monólito único:* Descartado por inchaço de memória e risco de quebrar transições complexas.
  - *Micro-arquivos isolados por frame:* Descartado por perder o *state blending* nativo do Rive ao transicionar entre poses.

### Decisão 2: Workflow Colaborativo 80/20% (IA + Dev no Rive Editor)
- **Escolha:** A IA automatiza 80% do trabalho chato e mecânico (corte de camadas com *underlap*, hierarquia de ossos, state machines, RML e CLI), enquanto o desenvolvedor executa os 20% finais de acabamento visual no navegador ([editor.rive.app](https://editor.rive.app)).
- **Racional:** Animação de alto nível é sensorial. Puxar um osso com o mouse, aplicar a vinculação de malha flexível (*Mesh Skinning*) com 1 clique e selecionar um preset de curva elástica (*Spring / Cubic*) leva 15 minutos no editor visual e produz resultado padrão Duolingo, eliminando a frustração de codificar curvas às cegas por texto.
- **Alternativas consideradas:**
  - *Codificação 100% por texto (RML cego):* Descartado por resultar em movimentos mecânicos e rígidos.
  - *Terceirização total para freelancers externos:* Mantido como opção secundária caso o desenvolvedor decida delegar no futuro.

### Decisão 3: Desacoplamento de VFX via Pontos de Ancoragem (Anchors)
- **Escolha:** Adereços (órbita de símbolos matemáticos, interrogação 3D, faíscas) residem em componentes aninhados ou camadas de overlay ligadas ao nó `Anchor_HeadTop` (acima da crista) e `Anchor_Hand` (na mão).
- **Racional:** Permite ligar, desligar ou trocar fórmulas e adereços sem tocar na anatomia do corpo ou refazer o esqueleto.

## Risks / Trade-offs

- **[Curva de aprendizado inicial do desenvolvedor no Rive Editor]** → *Mitigação:* O projeto é entregue pela IA já pré-estruturado com os ossos nas posições anatômicas exatas; o desenvolvedor só precisa acionar *Auto-Weight* e escolher os presets de mola.
- **[Dispositivos antigos sem suporte a WebGL]** → *Mitigação:* Manter a camada de fallback automático para os componentes SVG do Prisma com CSS, já validada nos 162 testes da suíte.
- **[Sincronização entre arquivos locais e a nuvem do Rive]** → *Mitigação:* Uso dos comandos nativos da CLI do Rive (`rive push` e `rive inspect --json`) para versionamento rastreável.
