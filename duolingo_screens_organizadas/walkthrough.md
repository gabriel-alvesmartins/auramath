# Walkthrough: Organização das 1.103 Telas do Duolingo por Fluxos de Usuário

Concluímos com sucesso a análise, identificação e organização hierárquica das **1.103 telas** do Duolingo. Todas as imagens foram copiadas para a nova pasta [`duolingo_screens_organizadas`](file:///c:/Users/Pichau/Desktop/Projetos/auramath/duolingo_screens_organizadas), preservando a pasta original [`duolingo_screens_imagens`](file:///c:/Users/Pichau/Desktop/Projetos/auramath/duolingo_screens_imagens) intacta como backup.

---

## 1. Resumo das Alterações e Resultados

* **Total de telas no dataset original:** `1.103`
* **Total de telas na pasta de destino:** `1.103` *(100% preservadas)*
* **Telas classificadas em fluxos específicos:** `1.002` (**90,8%**)
* **Telas em revisão/outliers:** `101` *(incluindo 2 telas não pertencentes ao Duolingo detectadas e isoladas)*
* **Estrutura criada:** 11 Macro-Categorias temáticas subdivididas em mais de 35 subpastas de fluxos específicos.

---

## 2. Estrutura Hierárquica e Distribuição de Telas

| Macro-Categoria | Sub-Fluxo | Telas | Descrição |
| :--- | :--- | :---: | :--- |
| **`01_Onboarding_and_Welcome`** | `01_Onboarding_Flow` | **18** | Boas-vindas, seleção de idioma, teste de nível e pesquisa de interesse |
| | `02_Learning_Goals` | **28** | Definição de metas diárias (casual/intensa), compromisso com Streak Goal |
| | `03_First_Lesson` | **4** | Primeira lição de introdução |
| **`02_Auth_and_Account`** | `01_Login` | **22** | Telas de login (e-mail, Apple, Google, Facebook) |
| | `02_Register_Create_Profile` | **8** | Cadastro e criação inicial de perfil (nome, idade, e-mail) |
| | `03_Phone_and_Password` | **10** | Verificação via SMS e redefinição/troca de senha |
| | `04_Logout_and_Delete_Account` | **11** | Fluxos de encerramento de sessão e exclusão de conta |
| **`03_Core_Lessons_and_Learning`** | `01_Standard_Lesson` | **377** | Exercícios normais (tradução, pares, áudio, fala, telas de acerto/erro/XP) |
| | `02_Story_Lesson` | **4** | Histórias com diálogos de personagens (Junior, Bea, Lin, Vikram, etc.) |
| | `03_Radio_Lesson` | **2** | Lições de rádio e escuta de conversas completas |
| | `04_Video_Call_Lesson` | **18** | Chamadas de vídeo interativas com a Lily (recurso IA) |
| | `05_Roleplay_AI_Max` | **16** | Sessões de RPG/Roleplay do Duolingo Max |
| | `06_Legendary_and_Guidebook` | **94** | Níveis lendários, guia da unidade (Unit Guidebook) e gramática |
| **`04_Specialized_Subjects`** | `01_Math_Course` | **27** | Exercícios e lições do curso de Matemática |
| | `02_Music_Course` | **18** | Exercícios de piano, clave de sol e teoria do curso de Música |
| | `03_Chess_Course` | **20** | Lições e partidas de xadrez com bots (Oscar) e jogadores |
| **`05_Gamification_and_Streaks`** | `01_Daily_Streaks` | **46** | Marcos de ofensiva (Streak), congelamento (Freeze) e sociedade de ofensiva |
| | `02_Friend_Streaks` | **20** | Ofensiva compartilhada com amigos (Friend Streaks) |
| | `03_Leaderboards_and_Leagues` | **12** | Divisões e ligas (Bronze, Prata, Ouro, Diamante, zonas de promoção) |
| | `04_Quests_and_Badges` | **26** | Missões diárias, baús de recompensas e emblemas mensais |
| | `05_Achievements` | **6** | Conquistas desbloqueadas e resgate de medalhas |
| | `06_Year_in_Review` | **2** | Retrospectiva anual de aprendizado |
| **`06_Practice_and_Review`** | `02_Mistakes_Review` | **10** | Central de prática de erros cometidos |
| **`07_Super_and_Max_Subscriptions`** | `01_Super_Duolingo_Paywalls` | **53** | Paywalls do plano Super, vidas ilimitadas e teste grátis |
| | `02_Duolingo_Max_Paywalls` | **12** | Paywalls do plano Duolingo Max (recursos de IA generativa) |
| | `03_Family_Plan` | **20** | Assinatura e gerenciamento do plano familiar (Super Family) |
| **`08_Shop_and_Gems`** | `01_Shop_Main` | **6** | Loja de gemas, trajes e itens virtuais |
| | `02_Boosts_and_Gems` | **8** | Compra e ativação de dobro de XP e aceleradores de tempo |
| **`09_Social_and_Friends`** | `01_Search_and_Follow_Friends` | **28** | Busca de contatos, seguir amigos e perfis públicos de colegas |
| | `03_Activity_Feed_and_Reactions` | **8** | Feed de atividades, comemorações e cumprimentos (high five) |
| **`10_Profile_and_Avatar`** | `01_User_Profile` | **11** | Visão geral do perfil público, estatísticas semanais e línguas |
| | `02_Avatar_Builder` | **30** | Criador e customizador de avatares (tom de pele, cabelo, roupas, óculos) |
| | `03_Edit_Profile` | **7** | Edição de nome, foto e dados do perfil |
| **`11_Settings_and_System`** | `01_App_Settings_and_Preferences` | **8** | Preferências de áudio, feedback háptico e animações |
| | `05_Duolingo_for_Schools` | **6** | Duolingo para Escolas e código de salas de aula |
| | `06_Widgets_and_Live_Activities` | **6** | Widgets de tela bloqueada, Live Activities e Dynamic Island |
| **`_Review_and_Outliers`** | `No_Text_Detected` | **6** | Ilustrações ou telas puramente visuais sem texto |
| | `Non_Duolingo_or_External` | **2** | Telas de outros aplicativos detectadas no dump (ex: app bancário) |
| | `Unclassified` | **93** | Telas com texto genérico aguardando revisão manual opcional |

---

## 3. Amostras Visuais dos Fluxos Organizados

````carousel
![Meta de Aprendizado / Onboarding](C:/Users/Pichau/.gemini/antigravity/brain/6a4b2444-1db2-4b14-9aba-36383c923f4a/sample_onboarding.png)
<!-- slide -->
![Exercício / Standard Lesson](C:/Users/Pichau/.gemini/antigravity/brain/6a4b2444-1db2-4b14-9aba-36383c923f4a/sample_lesson.png)
<!-- slide -->
![Assinatura Familiar / Super Family](C:/Users/Pichau/.gemini/antigravity/brain/6a4b2444-1db2-4b14-9aba-36383c923f4a/sample_super.png)
<!-- slide -->
![Criador de Avatar](C:/Users/Pichau/.gemini/antigravity/brain/6a4b2444-1db2-4b14-9aba-36383c923f4a/sample_avatar.png)
````

---

## 4. Validação e Integridade

* **Verificação de Quantidade:**
  - Pasta original `duolingo_screens_imagens`: **1.103 arquivos** mantidos íntegros.
  - Pasta organizada `duolingo_screens_organizadas`: **1.103 arquivos PNG** distribuídos.
* **Relatório Gerado:**
  - Arquivo [`classification_report.json`](file:///c:/Users/Pichau/Desktop/Projetos/auramath/duolingo_screens_organizadas/classification_report.json) contém o mapeamento individual de cada uma das 1.103 telas com o texto extraído por OCR.
  - Arquivo [`ORGANIZATION_SUMMARY.md`](file:///c:/Users/Pichau/Desktop/Projetos/auramath/ORGANIZATION_SUMMARY.md) salvo na raiz e na pasta organizada.
