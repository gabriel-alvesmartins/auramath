## ADDED Requirements

### Requirement: Coreografia de Vitória da Lição em 5 Fases (Dopamine Waterfall)
A tela de conclusão de lição (`LessonCompleteView`) SHALL orquestrar uma sequência temporal automática dividida em 5 fases cronometradas, combinando animação vetorial, física de confetes, contagem progressiva e carimbo semanal da ofensiva.

#### Scenario: Sequenciamento temporal das fases de vitória
- **WHEN** a tela de conclusão de lição é montada
- **THEN** o sistema SHALL executar automaticamente a linha do tempo:
  - **Fase 1 (0.0s - 0.7s):** Renderização monumental do Mascote Prisma/Aura no estado `supernova`, disparo duplo de confetes editoriais nas cores `#176B5B`, `#F2B84B`, `#E76F61` e reprodução do acorde pentatônico maior ascendente via Web Audio.
  - **Fase 2 (0.8s - 1.4s):** Deslizamento elástico vertical dos 3 cards táteis 3D com métricas de XP ganho, Precisão percentual e Segundos Poupados versus cálculo tradicional em papel.
  - **Fase 3 (1.4s - 2.1s):** Incremento numérico animado do valor de XP (de 0 até o total conquistado) renderizado em numerais tabulares com disparos de micro-clique sonoro a cada incremento de dezena.
  - **Fase 4 (2.1s - 2.8s):** Inflamação da chama Marigold no card de Ofensiva com carimbo tátil do dia de hoje na fita semanal de 7 dias (segunda a domingo).
  - **Fase 5 (2.8s - 3.5s):** Preenchimento da barra de progresso da Meta Diária e ativação de pulso luminescente sobre o botão tátil 3D "PRÓXIMO INSIGHT ➔".

#### Scenario: Carimbo animado de ofensiva no calendário semanal
- **WHEN** a Fase 4 da vitória é atingida
- **THEN** a fita visual dos 7 dias da semana SHALL exibir os dias anteriores concluídos com selos de nanquim, e o dia corrente SHALL acender com a chama Marigold animada e anel concêntrico dourado.

#### Scenario: Contagem progressiva sem tremor espacial
- **WHEN** o valor de XP e segundos poupados é incrementado na Fase 3
- **THEN** os dígitos SHALL utilizar `font-variant-numeric: tabular-nums` (`.font-mono-tabular`) e manter largura estritamente fixa sem provocar trepidação em cards vizinhos (CLS = 0).
