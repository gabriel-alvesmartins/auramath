# Caderno de Referência 01: Neurobiologia, Octalysis e Modelagem de Crescimento

## 1. A Matemática da Retenção: O Modelo de Markov e a Descoberta do CURR
A virada de crescimento do Duolingo (Jorge Mazal, 2018) decorre da modelagem de toda a base de usuários como uma **Cadeia de Markov** de 7 estados mutuamente exclusivos:
1. **Novos Usuários (NU):** Primeiro acesso na semana corrente.
2. **Usuários Atuais (CU - Current Users):** Praticaram na semana anterior e continuam ativos nesta semana.
3. **Usuários Reativados (RU - Reactivated Users):** Retornaram após 1 a 4 semanas de inatividade.
4. **Usuários Ressuscitados (SU - Resurrected Users):** Retornaram após ausência prolongada (> 30 dias).
5. **Usuários em Risco / Adormecidos:** Graduação decrescente de probabilidade de churn.

### A Fórmula do CURR e o Efeito de Juros Compostos
$$\text{CURR} = \frac{\text{Usuários Atuais da Semana } t \text{ que praticaram na Semana } t-1}{\text{Total de Usuários Ativos na Semana } t-1}$$

A análise matemática de sensibilidade provou que o CURR possui **alavancagem 5 vezes superior sobre o DAU** em relação a qualquer métrica de aquisição ou reativação:
* Pequenas variações positivas no CURR (+1% a +2% semanal) acumulam-se exponencialmente como **juros compostos**, pois o usuário que permanece no estado *Current* tem probabilidade muito menor de churn definitivo.
* O foco obstinado no CURR aumentou a retenção de longo prazo em 21%, reduzindo o abandono entre os melhores usuários em 40% e multiplicando o DAU em **4,5x (350% de aceleração em 4 anos)**.

### O Ponto de Inflexão da Ofensiva de 7 Dias
Dados empíricos demonstram a correlação biológica entre a duração do streak e a consolidação do hábito:
* Usuários com **Streak $\ge 7$ dias** têm **2,4x mais probabilidade** de retornar no dia seguinte ($D+1$).
* Usuários com **Streak $\ge 7$ dias** têm **3,6x mais probabilidade** de concluir o curso curricular completo.

---

## 2. Framework Octalysis de Yu-kai Chou: Balanço de Chapéus e Hemisférios
O Duolingo sustenta o engajamento através da orquestração equilibrada dos 8 Core Drives (CD1 a CD8):

```
                     MOTIVAÇÃO POSITIVA (CHAPÉU BRANCO)
                          [Sentimento de Competência]
                                       |
           CD2: Desenvolvimento        |        CD3: Empoderamento da
              e Realização             |            Criatividade
          (XP, Níveis Lendários,       |       (Feedback instantâneo,
             Emblemas Mensais)         |        ajuste de estratégia)
                                       |
EXTRÍNSECO ----------------------------+---------------------------- INTRÍNSECO
(Cérebro Esquerdo)                     |                     (Cérebro Direito)
                                       |
           CD4: Propriedade e Posse    |        CD5: Influência Social
          (Avatares, Coleções de       |              e Afinidade
           Nós, Marigold Gems)         |       (Ligas, Friend Streaks,
                                       |           Duelo Fantasma)
                                       |
           CD8: Perda e Prevenção      |        CD7: Imprevisibilidade
          (Streak Diário, Risco de     |             e Curiosidade
           Rebaixamento de Liga)       |       (Baús misteriosos, surpresas)
                                       |
                                       v
                    MOTIVAÇÃO DE URGÊNCIA (CHAPÉU NEGRO)
                           [Urgência e Escassez]
```

### O Perigo do "Chapéu Negro" sem Válvulas Elásticas
A pura aversão à perda (Core Drive 8) pode se tornar tóxica: se um estudante com 200 dias de ofensiva perde o streak por uma emergência familiar, a dor psicológica da perda é $\approx 2,1\times$ maior que o prazer do ganho equivalente (Kahneman & Tversky), gerando **abandono definitivo por quebra de ofensiva (*churn por desgosto*)**.

**As Válvulas de Segurança Criadas pelo Duolingo:**
1. **Streak Freeze (Bloqueio de Ofensiva):** Seguro pré-adquirido que consome gemas para preservar dias inativos imprevistos.
2. **Streak Repair (Reparação de Ofensiva):** Mecânica de resgate mensal automática ou via lição imediata de redenção.
3. **Streak Wager (Aposta de Ofensiva):** O usuário aposta gemas de que manterá 7 dias consecutivos para duplicar o valor, elevando a retenção do Dia 7 em +14% em testes A/B.

---

## 3. O Hook Model (Nir Eyal) e a Curva de BJ Fogg ($B = MAP$)
Para que o comportamento ocorra ($B$), Motivação ($M$), Habilidade ($A$) e Gatilho ($P$) devem convergir simultaneamente:
* **Habilidade (Facilidade Extrema):** Uma micro-lição dura apenas 90 a 120 segundos. A barreira de entrada motora é eliminada pelo posicionamento de botões na base da tela.
* **Gatilhos Externos e Internos:** O push não apela para culpa abstrata, mas para a rotina do usuário no mesmo horário exato em que ele praticou no dia anterior (*Smart Scheduling*).
* **Recompensa Variável:** A imprevisibilidade de baús, frases espirituosas e notas sonoras ascendentes estimula o núcleo accumbens a liberar dopamina no momento da antecipação da resposta.
* **Investimento:** Cada exercício resolvido preenche o diário de maestria, tornando cada vez mais custoso para o usuário desinstalar o aplicativo.
