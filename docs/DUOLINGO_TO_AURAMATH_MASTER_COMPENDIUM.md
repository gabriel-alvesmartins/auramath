# Compêndio Mestre: Arquitetura de Retenção Duolingo e Transmutação Editorial AuraMath
**Framework:** Spec-Anchored Editorial Architecture ("Não calcule. Veja.")  
**Acervo Base:** 1.103 Telas de Produção do Duolingo (`duolingo_screens_organizadas/`) e Artigo de Neurociência & Crescimento  
**Status:** Documento Oficial de Governança de UI/UX, Gamificação e Game Design do AuraMath  

---

## Sumário Executivo

Este compêndio consolida a totalidade da sabedoria empírica e neurocomportamental extraída do ecossistema Duolingo, traduzida deterministicamente para os princípios, tokens e contratos do **AuraMath Rebrand 01.1 Editorial**.

O documento serve como bíblia de engenharia de produto, design e gamificação, garantindo que toda nova tela, componente, exercício ou mecânica de retenção desenvolvida na plataforma AuraMath aplique os universais de interação de alta retenção sem incorrer nos vícios destrutivos de ansiedade matemática.

---

## 1. As 5 Leis da Retenção Neurocomportamental

### Lei 1: Subordinação da Aquisição ao CURR
* **O Princípio de Jorge Mazal:** A modelação matemática por cadeias de Markov comprova que otimizar o **CURR (*Current Users Retention Rate*)** possui **5 vezes mais alavancagem sobre o DAU** do que qualquer campanha de aquisição ou reativação de usuários inativos.
* **Juros Compostos da Consistência:** Pequenas melhorias na retenção semanal acumulam-se de forma exponencial. O objetivo central de todo componente do AuraMath é assegurar que o estudante retorne na semana seguinte.
* **O Limiar dos 7 Dias:** Atingir 7 dias consecutivos de prática eleva em **2,4x a probabilidade de retorno no dia seguinte** e em **3,6x a taxa de conclusão do curso completo**.

### Lei 2: Alinhamento entre Mecânica Gamificada e Psicologia do Domínio
* **O Perigo da Cópia Superficial:** Tentar copiar mecânicas de outros jogos sem analisar a tomada de decisão (como fez o Duolingo ao copiar os contadores de movimento do Gardenscapes) gera frustração e abandono.
* **A Transmutação para o Cálculo Mental:** Enquanto o vocabulário tolera punições com perda de vidas para evitar chutes aleatórios, a fluência aritmética mental exige **Descompressão Empática**: o erro deve revelar a simetria oculta através de andaimes visuais acolhedores no `FeedbackDrawer.tsx`, eliminando qualquer ameaça de interrupção da lição por corações esgotados.

### Lei 3: Redução Radical da Carga Cognitiva Extrínseca (ECL)
* **Teoria da Carga Cognitiva de Sweller:** A memória de trabalho humana é estritamente finita. A Carga Cognitiva Extrínseca (ECL) — desperdício gerado por navegação confusa ou layouts imprevisíveis — deve tender a zero.
* **Trilha Linear Determinística:** Elimina a paralisia de escolha. O início de cada sessão deve ser um reflexo motor de um único toque sobre o nó ativo da serpentina (`TrackSerpentineNode.tsx`).
* **Regra de Foco 80/20 e CLS = 0:** Durante o cálculo, barras de navegação globais são ejetadas. Mais de 80% do peso visual pertence ao problema. O uso de `font-variant-numeric: tabular-nums` (`JetBrains Mono`) impede qualquer vibração espacial horizontal de números e cronômetros.

### Lei 4: Física Tátil de Zero Latência e Orquestração Multissensorial
* **Compressão 3D a 0ms:** O affordance de botão mecânico prensável (`.aura-3d-btn`) captura o toque no `onTouchStart` (`:active`) com afundamento de 3px e retorno elástico em `cubic-bezier(0.34, 1.56, 0.64, 1)`, contornando o atraso de 300ms de navegadores móveis.
* **Escala Pentatônica Maior (Ambrose Yu):** Respostas rápidas consecutivas disparam notas ascendentes da escala pentatônica maior (C4 a C7) sintetizadas a 0ms via Web Audio API. Por não possuir semitons ou trítonos, a escala elimina qualquer risco de dissonância acústica.
* **Antropomorfização com o Prisma:** O cérebro humano responde a rostos e narrativas expressivas. O Camaleão Geômetra Prisma (Rive/SVG) substitui o Duo, reagindo dinamicamente em 5 estágios cognitivos (`Dot`, `Line`, `Shape`, `Pattern`, `Insight`) e 6 estados reativos (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`).

### Lei 5: Disciplina Algorítmica e Contenção de Canal
* **O Modelo Sleeping, Recovering Bandit (KDD 2020):** Notificações push utilizam modelos contextuais onde mensagens inelegíveis adormecem e mensagens enviadas sofrem penalização de recência. A frescura da mensagem supera a qualidade absoluta.
* **Governança Estrita Anti-Fadiga:** No máximo duas notificações push por dia (Rotina Suave via *Smart Scheduling* + Salvamento Noturno). Parada honesta e encerramento de disparos após 7 dias de silêncio para preservar a autoridade do canal.
* **Ciclos Circadianos de Baús:** Os Baús Madrugador (06h–12h) e Notívago (18h–24h) consolidam uma rotina bi-diária alinhada aos ciclos de fixação sináptica da memória.

---

## 2. Taxonomia das 1.103 Telas e Evidências Empíricas

A auditoria exaustiva realizada sobre a pasta `duolingo_screens_organizadas/` identificou a seguinte proporção de engenharia de produto:

```
  Lições Nucleares (50,9%) [511 telas]
  ████████████████████████████████████████████████████
  Gamificação e Streaks (11,2%) [112 telas]
  ███████████
  Super & Max Paywalls (8,5%) [85 telas]
  ████████
  Disciplinas Especializadas (6,5%) [65 telas]
  ██████
  Onboarding & Metas (5,0%) [50 telas]
  █████
  Autenticação e Conta (5,3%) [53 telas]
  █████
  Perfil e Avatar (4,8%) [48 telas]
  ████
  Social e Amigos (3,6%) [36 telas]
  ███
  Configurações & Widgets (2,0%) [20 telas]
  ██
  Loja e Gemas (1,4%) [14 telas]
  █
  Central de Revisão de Erros (1,0%) [10 telas]
  █
```

### Principais Padrões Extraídos por Sub-Fluxo:

1. **`04_Specialized_Subjects/01_Math_Course` (27 telas):**
   - *Padrão:* "Find paths that add up to 12" e "Multiplication patterns".
   - *Tradução:* Transmutado para o `ActiveDiscoveryCard.tsx` com trilhas de decomposição espacial para fatores notáveis e complementos de dezena.
2. **`06_Practice_and_Review/02_Mistakes_Review` (10 telas):**
   - *Padrão:* Telas de conclusão *"Flawless — 0 mistakes"* e *"When's the parade? You made 0 mistakes. Confetti time!"*.
   - *Tradução:* Transmutado para o fluxo do Caderno de Erros no `LessonCompleteView.tsx`, onde limpar a fila de nós deficientes concede +20 XP de maestria e dispara a auréola `supernova` do Prisma.
3. **`01_Onboarding_and_Welcome/02_Learning_Goals` (28 telas):**
   - *Padrão:* *"Commit to my goal: 3 days (300 gems), 5 days (500 gems), 7 days (700 gems)"*.
   - *Tradução:* Transmutado para o Onboarding com Progresso Dotado: o estudante escolhe seu ritmo, o Dia 1 já é marcado como realizado e ele entra direto na primeira técnica (`ADD_LEFT_RIGHT`) antes de qualquer tela de cadastro.
4. **`05_Gamification_and_Streaks/01_Daily_Streaks` (46 telas):**
   - *Padrão:* *"Less than 3 hours to extend your streak!"* e gestão de *Streak Freeze*.
   - *Tradução:* Transmutado para o `StreakPopoverModal.tsx`, integrando o Escudo de Concentração e a recuperação de ofensiva via domínio de módulos em atraso (*Escudo de Maestria*).

---

## 3. Matriz Normativa de Transmutação de Componentes

| Elemento Duolingo | Risco no Cálculo Mental | Solução Soberana AuraMath | Implementação / Arquivo Alvo |
| :--- | :--- | :--- | :--- |
| **5 Vidas / Corações** | Ansiedade paralisante e interrupção forçada | **Eliminação de Vidas Punitivas:** Foco contínuo; erros abrem andaime de decomposição. | `DuolingoLessonView.tsx`<br>`FeedbackDrawer.tsx` |
| **Drawer Vermelho de Erro** | Cortisol elevado e choque visual | **Descompressão Empática:** Fundo `Cream (#FFFDF6)`, borda `Coral Soft (#F8DED9)`, dissipação suave. | `FeedbackDrawer.tsx`<br>`audioSynth.ts` |
| **Drawer Verde de Acerto** | Saturação neon excessiva | **Elegância Editorial:** Borda `Verdigris (#176B5B)`, notas da Escala Pentatônica Dó Maior e Prisma `eureka`. | `FeedbackDrawer.tsx`<br>`audioSynth.ts` |
| **Botão 3D de Ação** | Latência em clique móvel nativo | **`.aura-3d-btn` a 0ms:** Afundamento imediato no `onTouchStart` com som `playKeypressTick()`. | `Aura3DButton.tsx`<br>`theme.css` |
| **Tipografia Arredondada** | Layout Shift dinâmico ao mudar números | **Monospace Tabular:** `JetBrains Mono` com `font-variant-numeric: tabular-nums` (CLS = 0). | `tokens.ts`<br>`TactileNumpad.tsx` |
| **Trilha e Nós Circulares** | Paralisia se houver excesso de caminhos | **Serpentina de Nó Único:** `TrackSerpentineNode.tsx` (80x80px) sobre papel com pulsação suave em `Marigold`. | `TrackView.tsx`<br>`TrackSerpentineNode.tsx` |
| **Banners de Guidebook** | Texto puro sem dinamismo algébrico | **Caderno Guia Interativo:** Visualizador de simetria (`SymmetryRulerDiagram`) e passos de decomposição. | `TrackView.tsx`<br>`editorial/` |
| **Ofensiva / Fogo** | Desistência definitiva por quebra de streak | **Chama Marigold & Escudo:** Recuperação por maestria e proteção de congelamento no `gamificationEngine`. | `StreakPopoverModal.tsx`<br>`gamificationEngine.ts` |
| **Baús Circadianos** | Vício horário não-estruturado | **Baús de Fixação Sináptica:** Foco Matinal (06h–12h) e Fixação Noturna (18h–24h) com chip `XpBoostBadge`. | `App.tsx`<br>`gamificationEngine.ts` |
| **Ligas por Volume de XP** | Estudo superficial em lições triviais | **Ligas por Elo e Maestria:** Pontuação ponderada pela dificuldade da técnica e precisão no cálculo. | `DuelHubView.tsx`<br>`LeagueLeaderboardView.tsx` |
| **Mascote Duo e Personagens** | Tom sarcástico e desconexão matemática | **Prisma, o Camaleão Geômetra:** 5 estágios cognitivos, 6 estados emocionais e balões em estilo tirinha. | `PrismaMascotWeb.tsx`<br>`PrismaLessonMascot.tsx` |

---

## 4. Roteiro Operacional para Novas Implementações

Ao conceber qualquer nova tela ou componente no AuraMath, siga este roteiro de 4 etapas:
1. **Identifique a Função Comportamental Primária:** O elemento visa Ativação (Onboarding), Aprendizagem (Lição), Retenção (Streak/Baú) ou Status (Liga/Avatar)?
2. **Consulte a Matriz de Transmutação:** Localize o equivalente no Duolingo e adote a versão transmutada para eliminar riscos cognitivos.
3. **Aplique os Tokens Soberanos:** Superfícies em `Paper` e `Cream`, texto em `Mineral Ink`, acentos em `Verdigris`, `Marigold` e `Coral`. Nunca utilize `#000` ou `#FFF` absolutos.
4. **Verifique os Invariantes de Teste:** Execute `npm test` e `npm run spec:check` para garantir conformidade estrita com as especificações Spec-Anchored.
