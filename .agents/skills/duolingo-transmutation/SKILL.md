---
name: duolingo-transmutation
description: Transmuta a arquitetura de retenção, engenharia sensorial, gamificação dopaminérgica e física tátil 3D do Duolingo para a experiência editorial do AuraMath ("Não calcule. Veja."). Use ao planejar, projetar, auditar ou codificar componentes, telas, lições, mecânicas de ofensiva ou feedback.
---

# Skill: Duolingo Transmutation (Duolingo ➔ AuraMath)
**Framework:** Spec-Anchored Editorial Architecture ("Não calcule. Veja.")  
**Base Empírica:** Auditoria de 1.103 telas (`duolingo_screens_organizadas/`) e Compêndio de Neurociência & Crescimento.

Esta skill atua como o **motor oficial de conversão de padrões do Duolingo para o ecossistema AuraMath**. Ela orienta desenvolvedores, designers de produto e agentes de IA a extrair os universais de interação humano-computador consagrados pelo Duolingo (física 3D a 0ms, sonoplastia pentatônica, trilha linear determinística, progressão dotada) e passá-los pelo filtro soberano da **matemática editorial de alta precisão**.

---

## 1. Princípios Inegociáveis de Transmutação (Guardrails)

Qualquer elemento inspirado ou adaptado do Duolingo DEVE obedecer a estes cinco pilares:

```
+-------------------------------------------------------------------------------+
|                      FILTRO SOBERANO REBRAND 01.1                             |
+-------------------------------------------------------------------------------+
| 1. Paleta Editorial Soberana:                                                 |
|    - Superfícies: Paper (#F7F4EA) e Cream (#FFFDF6). Jamais #000 ou #FFF puro.|
|    - Acentos: Verdigris (#176B5B), Marigold (#F2B84B), Coral (#E76F61).       |
|                                                                               |
| 2. Física Tátil 3D a Zero Latência:                                           |
|    - Extrusão chanfrada de 4px, afundamento 3px no onTouchStart (:active).   |
|    - 0ms de latência perceptual; retorno elástico cubic-bezier(0.34, 1.56).    |
|                                                                               |
| 3. Prevenção Absoluta de Deslocamento Espacial (CLS = 0):                     |
|    - Toda equação, cronômetro e placar usa font-variant-numeric: tabular-nums |
|      em JetBrains Mono.                                                       |
|    - Thumb Zone fixa de 430px: o botão "CONTINUAR" nasce exatamente onde      |
|      estava o botão "VERIFICAR" para permitir duplo toque cego.               |
|                                                                               |
| 4. Lei da Descompressão Empática (Rejeição a Vidas Punitivas):                 |
|    - Proibido bloquear o aluno com perda de corações na trilha de aprendizado.|
|    - O erro abre o FeedbackDrawer em Coral Suave (#F8DED9) com o bloco         |
|      "Veja a estrutura oculta:" exibindo o atalho mental de simetria.         |
|                                                                               |
| 5. Antropomorfização no Mascote Prisma:                                       |
|    - Substituir Duo e secundários pelo Camaleão Geômetra Prisma (Rive/SVG).   |
|    - 5 estágios cognitivos (Dot, Line, Shape, Pattern, Insight) e 6 estados   |
|      canônicos (idle, thinking, hint, eureka, supernova, camouflaged).        |
+-------------------------------------------------------------------------------+
```

---

## 2. Estrutura de Cadernos de Referência

Para aprofundamento técnico em áreas específicas, consulte os cadernos em `references/`:

* [`references/01-neurobiology-and-octalysis.md`](references/01-neurobiology-and-octalysis.md): Modelação matemática de Markov, a descoberta do CURR (5x mais alavancagem que aquisição), os 8 Core Drives do Octalysis e o Hook Model.
* [`references/02-sensory-and-ergonomics.md`](references/02-sensory-and-ergonomics.md): Especificações de CSS para `.aura-3d-btn`, arquitetura de áudio Web Audio em escala pentatônica maior (Ambrose Yu), regra de foco 80/20 e character cards.
* [`references/03-empirical-screen-taxonomy.md`](references/03-empirical-screen-taxonomy.md): Auditoria das 1.103 telas em 11 macro-categorias, com citações de OCR reais de Duolingo Math, Streaks, Mistakes Review e Onboarding.
* [`references/04-transmutation-matrix.md`](references/04-transmutation-matrix.md): Dicionário de conversão componente a componente (Duolingo ➔ AuraMath) com riscos cognitivos mapeados.
* [`references/05-algorithms-and-retention.md`](references/05-algorithms-and-retention.md): Algoritmo de notificações *Sleeping, Recovering Bandit* (KDD 2020), calibração de desafio ótimo com Half-Life Regression (Birdbrain) e os ciclos dos Baús Madrugador e Notívago.

---

## 3. Playbooks Operacionais de Execução

### Playbook A: Criar ou Refatorar um Componente Tátil
Ao criar botões, seletores, cards ou blocos interativos:
1. **Extrusão Mecânica:** Aplique a extrusão inferior chanfrada (`box-shadow: 0 4px 0 var(--color-border-bold)` ou variável correspondente).
2. **Compressão a 0ms:** Capture o evento no `onTouchStart` ou `:active` com `transform: translateY(3px)` e `box-shadow: 0 1px 0 ...`. Defina `transition: none` no afundamento para evitar atraso perceptivo.
3. **Descompressão Elástica:** Na liberação, adicione transição de retorno suave (`transition: transform 80ms cubic-bezier(0.34, 1.56, 0.64, 1)`).
4. **Sonoplastia Tátil:** Conecte a chamada `audioSynth.playKeypressTick()` ao clique/toque.
5. **Tipografia Monospace:** Se houver números ou contadores no componente, aplique `.font-mono-tabular` (`font-variant-numeric: tabular-nums`).

### Playbook B: Criar um Exercício ou Feedback de Lição
Ao criar novos nós de técnicas ou telas de lição:
1. **Regra de Foco 80/20:** Oculte cabeçalhos globais, navegação inferior e contadores irrelevantes durante o cálculo. Mais de 80% do peso visual deve pertencer ao problema e à área de resposta.
2. **Thumb Zone Rigorosa:** Posicione os seletores de entrada ou o `TactileNumpad` (3x4 com teclas 56x56dp) na base da moldura de 430px.
3. **Feedback Não-Punitivo:** 
   - Ao acertar: Gaveta deslizante inferior em `Cream (#FFFDF6)` com borda `Verdigris (#176B5B)`, disparo de nota pentatônica ascendente e Prisma em `eureka`.
   - Ao errar: Gaveta deslizante inferior em `Cream (#FFFDF6)` com borda `Coral Soft (#F8DED9)`, mensagem *"Veja a estrutura oculta:"*, decomposição do passo algébrico em fonte monospace, som de alívio acústico (`playErrorSoftRelease()`) e Prisma em `thinking`/`hint`. **Nunca subtraia corações ou encerre a lição**.
4. **Duplo Toque Confortável:** O botão `CONTINUAR` deve ocupar rigorosamente as mesmas coordenadas físicas do botão `VERIFICAR`.

### Playbook C: Implementar Mecânica de Gamificação e Retenção
Ao criar desafios, streaks, ligas ou recompensas:
1. **Proteção de CURR (*Current Users Retention Rate*):** Priorize a consistência semanal sobre downloads imediatos.
2. **Ofensiva com Válvula Elástica:** Toda ofensiva diária (*Streak*) deve ter suporte a congelamento preventivo (*Streak Freeze*) e recuperação via domínio de módulos em atraso (*Escudo de Maestria*).
3. **Ciclo Circadiano sem Vício Tóxico:** Adote a lógica dos Baús Madrugador (06h–12h) e Notívago (18h–24h) para incentivar a consolidação biológica de memória, recompensando com multiplicador temporário de foco.
4. **Competição por Elo e Não por Volume:** Nas Ligas, utilize micro-coortes de 30 usuários com pontuação calibrada pela dificuldade intrínseca dos nós e precisão mental, em vez de "farming" de pontos em exercícios triviais.

---

## 4. Checklist de Conformidade Spec-Anchored

Antes de submeter qualquer código gerado a partir desta skill:
- [ ] O componente respeita a paleta soberana (`Paper`, `Cream`, `Verdigris`, `Marigold`, `Coral`, `Iris`) sem nenhum `#000`, `#FFF` puro ou neon?
- [ ] Todo número dinâmico utiliza `tabular-nums` com CLS = 0?
- [ ] O botão interativo implementa afundamento tátil a 0ms e dispara `playKeypressTick()`?
- [ ] Nenhuma mecânica de vidas punitivas foi introduzida na trilha curricular?
- [ ] O mascote utilizado é o Prisma Geômetra (Rive/SVG), expressando um dos 6 estados canônicos?
- [ ] A suite completa de 183 testes continua 100% verde (`npm test` e `npm run spec:check`)?
