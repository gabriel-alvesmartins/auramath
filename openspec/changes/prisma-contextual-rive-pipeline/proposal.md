## Why

A exploração técnica revelou que a tentativa de utilizar um único arquivo Rive monolítico ou animações baseadas em recortes rígidos de bitmap gera o efeito de "marionete mecânica", distante da fluidez orgânica e expressiva de referências como o Duolingo. Além disso, concentrar todas as animações em um monólito único cria problemas graves de manutenção de State Machine, inchaço desnecessário de bundle no mobile e risco de conflitos destrutivos de merge em binários `.riv`.

Esta mudança estabelece a **Arquitetura Híbrida por Contexto** para o mascote Prisma, modulariza adereços e efeitos matemáticos (VFX em pontos de ancoragem) e formaliza o **Workflow Colaborativo 80/20%** (80% automação de engenharia via IA + 20% ajuste tátil visual do desenvolvedor no Rive Editor).

## What Changes

- **Arquitetura Híbrida por Contexto:** Substitui o monólito único de Rive por arquivos desacoplados e leves conforme o momento da jornada:
  - `prisma-lesson.riv` (~40 KB): Contexto de lição interativa (`idle` ↔ `thinking` ↔ `correct` ↔ `incorrect`).
  - `prisma-victory.riv` (~90 KB, Lazy Loaded): Telas de celebração de vitória, streaks e subida de nível (`eureka`, `supernova`, troféu e confetes).
  - `prisma-track.riv` (~15 KB): Cabeçalhos editoriais e nós do mapa de progressão zigzag.
- **Sistema Modular de Adereços & VFX (Anchors):** Desacopla adereços dinâmicos (ponto de interrogação 3D, órbitas de símbolos matemáticos `+`, `-`, `÷`, `%`, faíscas) do corpo do mascote, acoplando-os como componentes aninhados via pontos de fixação (`Anchor_HeadTop` e `Anchor_Hand`).
- **Workflow de Produção Colaborativo 80/20%:** Formaliza o playbook de criação onde a IA prepara toda a anatomia, hierarquia de ossos, state machines e deploy via CLI (80%), e o desenvolvedor realiza a vinculação de malha flexível e o ajuste fino de curvas no Rive Editor web (20%).
- **Componentes React Específicos por Contexto:** Fornece wrappers plug-and-play (`PrismaLessonMascot`, `PrismaVictoryMascot`) que encapsulam os inputs de State Machine sem sobrecarregar a lógica de negócio das páginas.

## Capabilities

### New Capabilities
*(Nenhuma nova capacidade necessária, pois a evolução aprimora diretamente o pipeline existente).*

### Modified Capabilities
- `mascot-animation-pipeline`: Evolui os requisitos do pipeline de animação do Prisma de um único `.riv` monolítico para a Arquitetura Híbrida por Contexto (`prisma-lesson`, `prisma-victory`, `prisma-track`), padroniza os pontos de ancoragem de adereços modulares (VFX Anchors) e estabelece o workflow de rigging colaborativo 80/20%.

## Impact

- **Ativos Rive (`/public/mascot/` e `/rive/`):** Adição de projetos dedicados para cada contexto (`rive/lesson/`, etc.), preservando retrocompatibilidade com o fallback SVG.
- **Componentes React:** Atualização de `PrismaMascotRive.tsx` e criação de componentes de contexto especializados para lições e vitória.
- **Performance:** Redução expressiva de uso de memória na tela de exercícios, eliminando carregamento desnecessário de efeitos de celebração.
- **Dependências:** Nenhuma dependência externa nova; reutiliza `@rive-app/react-canvas` e Rive CLI v1.5.1 já instalados.
