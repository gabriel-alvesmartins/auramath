# Playbook 80/20% — Rigging e Polimento do Mascote Prisma no Rive

Este guia documenta o fluxo de trabalho colaborativo **80/20%** estabelecido na arquitetura contextual do Auramath para atingir fluidez orgânica no padrão Duolingo sem exigir especialização avançada em desenho vetorial.

---

## 1. Divisão de Responsabilidades (80/20%)

| Camada | Responsável | Atividades Concluídas / Escopo |
| :--- | :--- | :--- |
| **80% Engenharia & Rig** | **IA / Automação** | • Fatiamento anatômico com *underlap* anti-frestas em `assets/`<br>• Hierarquia esquelética declarativa (`RootBone`, `Bone`) em `scene.rml`<br>• Ancoragens modulares (`Anchor_HeadTop`, `Anchor_Hand`) desacopladas<br>• State Machine tipada `PrismaLessonController` (`idle`, `thinking`, `correct`, `incorrect`)<br>• Compilação determinística via Rive CLI para `prisma-lesson.riv` (< 50 KB) |
| **20% Polimento Tátil** | **Desenvolvedor** | • Importar ou abrir cena no [editor.rive.app](https://editor.rive.app)<br>• 1-Click *Bind to Bones* (Auto-Weight) na malha do corpo<br>• Ajuste tátil de limites de rotação e poses<br>• Aplicação de presets elásticos (*Spring / Cubic Overshoot*) |

---

## 2. Acesso ao Projeto no Rive Editor

Você pode polir o projeto tanto no navegador quanto no editor desktop:

1. **Via Navegador**:
   - Acesse [editor.rive.app](https://editor.rive.app).
   - Arraste o arquivo `rive/lesson/build/prisma-lesson.riv` para a sua área de trabalho no Rive.
   - Alternativamente, use a CLI do Rive vinculada à sua conta: `rive open` ou `rive push`.

---

## 3. Passo a Passo do Polimento Visual (20%)

### Passo 1: Auto-Weight da Malha Flexível (*Mesh Deformation*)
1. Selecione a imagem da camada `BodyImage` na hierarquia.
2. No painel direito de propriedades, marque a opção **Create Mesh**.
3. Clique em **Generate Vertices** (o Rive cria automaticamente uma malha triangular uniforme com ~16 a 24 vértices).
4. Clique em **Bind Bones** e selecione a cadeia existente (`SpineRoot`, `ChestBone`, `HeadBone`).
5. Clique em **Auto-Weight**: o Rive distribuirá automaticamente os pesos entre a coluna, o tórax e a cabeça.

### Passo 2: Poses-chave com Curvas Orgânicas (*Spring Curves*)
Para evitar a sensação de "ponteiro de relógio" mecânico:
1. Abra a timeline da animação `thinking`.
2. Selecione a rotação do `ArmShoulderPivot` ou `ArmBone`.
3. Altere o tipo de interpolação no inspetor de curvas:
   - Troque de `Linear` para **Cubic** ou **Spring**.
   - Preset recomendado: **Snappy / Bouncy** (`Damping: 15`, `Stiffness: 120`).
4. Repita para a oscilação da cabeça em `HeadBone` (overshoot sutil de ~2-3 graus no final da inclinação).

### Passo 3: Verificação dos Adereços Modulares (Anchors)
1. Confirme que o nó `Anchor_HeadTop` acompanha naturalmente o movimento do `HeadBone`.
2. O anel orbital de símbolos matemáticos (`MathOrbitGroup`) deve girar suavemente em 360° sem sofrer distorção de malha ou estiramento de escala.
3. O ponto de interrogação flutuante (`QuestionMarkGroup`) deve flutuar em órbita suave acima da crista.

---

## 4. Exportação e Deploy no App

Após ajustar visualmente no editor:
1. Exporte o arquivo como `.riv` (File -> Export -> Runtime File).
2. Salve como `public/mascot/prisma-lesson.riv`.
3. Alternativamente, para projetos locais com arquivos de texto `.rml`:
   ```powershell
   cd rive/lesson
   & "C:\Users\Pichau\.rive\bin\rive.exe" --once
   Copy-Item build/prisma-lesson.riv ../../public/mascot/prisma-lesson.riv -Force
   ```
4. Teste em tempo real abrindo o laboratório em `public/mascot-viewer.html` ou rodando o servidor Vite (`npm run dev`).
