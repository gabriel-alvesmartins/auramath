# Caderno de Referência 03: Taxonomia Empírica das 1.103 Telas

## 1. Distribuição Global por Domínio Funcional
A auditoria sobre o acervo de 1.103 telas de produção do Duolingo (`duolingo_screens_organizadas/`) comprova que o produto é uma máquina bimodal:

| Macro-Categoria | Sub-Fluxos Principais | Volume de Telas | % do Total | Função Neurocomportamental |
| :--- | :--- | :--- | :--- | :--- |
| **03. Lições Nucleares** | Lição Padrão (377), Lendário & Guia (94), Vídeo Lily (18), Roleplay (16), Histórias (4) | **511** | 50,9% | Micro-ciclos de aprendizagem, fragmentação da Carga Cognitiva Intrínseca (ICL) e reforço imediato. |
| **05. Gamificação & Streaks** | Ofensiva Diária (46), Missões/Badges (26), Friend Streaks (20), Ligas (12), Conquistas (6) | **112** | 11,2% | Ativação de aversão à perda (CD8), compromisso social e hábitos bi-diários. |
| **07. Subscrições Super/Max** | Paywalls Super (53), Plano Familiar (20), Paywalls Max (12) | **85** | 8,5% | Monetização contextual na dor do usuário (perda de vidas, desejo de IA conversacional). |
| **04. Disciplinas Especiais** | Curso de Matemática (27), Xadrez (20), Música (18) | **65** | 6,5% | Expansão horizontal da infraestrutura de hábitos para domínios lógicos e numéricos. |
| **01. Onboarding & Boas-Vindas** | Metas de Estudo (28), Fluxo de Boas-Vindas (18), Primeira Lição (4) | **50** | 5,0% | Ancoragem de compromisso (Pledge Device), avaliação sem teste e registo adiado. |
| **02. Autenticação & Conta** | Login (22), Telefone/Senha (12), Logout (11), Criação de Perfil (8) | **53** | 5,3% | Paredes suaves (*soft walls*): conversão de identidade somente após o *Aha! Moment*. |
| **10. Perfil & Avatar** | Construtor de Avatar (30), Perfil (11), Edição (7) | **48** | 4,8% | Efeito de dotação (*endowment effect*) e apego à identidade virtual. |
| **09. Social & Amigos** | Busca de Amigos (28), Feed & Reações (8) | **36** | 3,6% | Validação por pares, responsabilidade compartilhada e celebrações conjuntas. |
| **11. Configurações & Sistema** | Preferências/Áudio (8), Escolas (6), Widgets/Live Activities (6) | **20** | 2,0% | Presença ambiental na lockscreen e notificações do sistema operacional. |
| **08. Loja & Gemas** | Boosts & Gemas (8), Loja Principal (6) | **14** | 1,4% | Economia de escoamento para consumíveis de segurança (*Streak Freeze*). |
| **06. Prática & Revisão** | Central de Revisão de Erros (10) | **10** | 1,0% | Recuperação ativa de nós deficientes e regeneração de energia. |

---

## 2. Evidências Empíricas Extraídas via OCR

### A. O Curso de Matemática Nativo (`04_Specialized_Subjects/01_Math_Course`)
* **Tela `duolingo-screen-flow-0e28d33f...`:**
  * OCR: `GRADE 6 | Multiplication patterns | 000`
  * Racional: O Duolingo estrutura a matemática em Graus e Padrões de Multiplicação, substituindo a álgebra pura pela visualização de simetrias espaciais.
* **Tela `duolingo-screen-flow-2976824c...`:**
  * OCR: `1:28 | Find paths that add up to 12`
  * Racional: Em vez de pedir $7 + 5 = ?$, a interface apresenta um grafo espacial de caminhos alternativos onde diferentes combinações somam 12. Isso desenvolve **flexibilidade aritmética** em vez de decoreba mecânica.

### B. Compromisso Gradual Dotado (`01_Onboarding_and_Welcome/02_Learning_Goals`)
* **Tela `duolingo-screen-flow-0164fbbf...`:**
  * OCR: `You'll be 5x more likely to complete the course! | 3 days: Earn 300 gems | 5 days: Earn 500 gems | 7 days: Earn 700 gems | COMMIT TO MY GOAL`
  * Racional: Aplicação direta da teoria dos contratos de compromisso de Thomas Schelling. O usuário faz uma declaração pública de intenção e já recebe o Dia 1 preenchido na barra de progresso (*Endowed Progress*).

### C. Retenção Circadiana e Válvulas de Ofensiva (`05_Gamification_and_Streaks/01_Daily_Streaks`)
* **Tela `duolingo-screen-flow-102ada31...`:**
  * OCR: `Shop | Friends Chest | CLAIM | Widget Reward | CLAIM | Early Bird Chest | LOCKED | Night Owl Chest | LOCKED | Streak Freeze`
  * Racional: O ecossistema de baús fecha o ciclo de 24 horas: o usuário não consegue abrir o baú da noite se não praticou de manhã. O *Streak Freeze* atua como a garantia de sobrevivência da ofensiva.
* **Tela `duolingo-screen-flow-1755644a...`:**
  * OCR: `day streak! | Less than 3 hours to extend your 5 day streak! | EXTEND STREAK | December 2025 | Days practiced`
  * Racional: Contagem regressiva com aversão à perda explícita nas últimas horas do dia natural.

### D. Caderno de Erros e Celebração Perfeita (`06_Practice_and_Review/02_Mistakes_Review`)
* **Tela `duolingo-screen-flow-332ade08...`:**
  * OCR: `Flawless | 0 mistakes. You're like a pristine freshwater pearl | TOTAL XP | AMAZING | BLAZING | 100% | 0:58 | CLAIM XP`
* **Tela `duolingo-screen-flow-8086bc1d...`:**
  * OCR: `When's the parade? | You made 0 mistakes. Confetti time! | TOTAL XP | AMAZING | BLAZING | 20 | 100% | 1:11 | CLAIM XP`
  * Racional: A conclusão de uma sessão de revisão de erros não é tratada como "correção de falha", mas como a conquista de uma jóia imaculada (*Flawless*).
