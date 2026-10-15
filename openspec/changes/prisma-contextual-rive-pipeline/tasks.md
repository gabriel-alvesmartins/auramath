## 1. Estruturação do Subprojeto Rive de Lição e Ativos Modulares

- [x] 1.1 Criar a estrutura do subprojeto `rive/lesson/` com `rive.yaml` e diretórios de assets, verificando que os arquivos de configuração são reconhecidos pela CLI do Rive.
- [x] 1.2 Preparar e exportar as camadas anatômicas do Prisma com sobreposição anatômica (*underlap* anti-frestas) para `rive/lesson/assets/`, verificando a integridade das imagens sem bordas ou ruídos residuais.
- [x] 1.3 Criar os componentes modulares de adereços no ponto de ancoragem `Anchor_HeadTop` (ponto de interrogação 3D e anel orbital de símbolos matemáticos `+`, `-`, `÷`, `%`, `×`), verificando que eles operam de forma desacoplada do corpo.

## 2. Implementação da State Machine de Lição e Playbook 80/20%

- [x] 2.1 Implementar a cena declarativa `scene.rml` com a hierarquia de ossos preliminares (`Bones`) e a máquina de estados `PrismaLessonController` (`idle`, `thinking`, `correct`, `incorrect`), verificando validação com `rive --verify`.
- [x] 2.2 Estruturar o guia do playbook 80/20% para o polimento do desenvolvedor no Rive Editor web (passo a passo para *Auto-Weight* e seleção de curvas elásticas *Spring / Cubic*).
- [x] 2.3 Compilar o ativo binário oficial `public/mascot/prisma-lesson.riv` via Rive CLI e verificar que seu peso é enxuto (< 50 KB) e sua renderização opera a 60/120 FPS.

## 3. Componentes React Contextuais e Integração com a Interface

- [x] 3.1 Implementar o componente `PrismaLessonMascot.tsx` mapeando os estados locais (`idle`, `thinking`, `correct`, `incorrect`) e o toggle de órbita matemática diretamente para a State Machine, verificando o binding reativo.
- [x] 3.2 Integrar o fallback híbrido gracioso para `PrismaMascotWeb` (SVG) caso o cliente não suporte WebGL/Canvas, verificando a renderização segura em mock de teste.
- [x] 3.3 Atualizar o laboratório de inspeção em `public/mascot-viewer.html` com a visualização interativa do novo runtime de lição (`prisma-lesson.riv`).

## 4. Validação Automatizada e Auditoria Spec-Anchored

- [x] 4.1 Adicionar suíte de testes unitários para o `PrismaLessonMascot` e para a integridade do binário `prisma-lesson.riv`, verificando aprovação em `npm test`.
- [x] 4.2 Executar a auditoria `npm run spec:check` e confirmar 100% de conformidade com as regras do projeto sem nenhuma regressão.
