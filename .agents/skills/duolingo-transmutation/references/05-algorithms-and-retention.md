# Caderno de Referência 05: Algoritmos de Retenção Externa e IA

## 1. O Algoritmo "Sleeping, Recovering Bandit" (KDD 2020)
O Duolingo não agenda notificações push de forma aleatória nem usa disparos estáticos. O envio é orquestrado por um modelo contextual modificado de *Multi-Armed Bandit* desenvolvido por Kevin P. Yancey e Burr Settles (apresentado no ACM SIGKDD 2020).

### Desafios de um Bandit Clássico em Notificações Recorrentes:
1. **Inelegibilidade Diária:** Certas mensagens não fazem sentido todos os dias (ex: alerta de liga no meio da semana, aposta de ofensiva sem aposta ativa).
2. **Fadiga de Canal (*Channel Fatigue*):** Se o algoritmo descobre uma mensagem com alta conversão (ex: *"Sua ofensiva vai quebrar!"*), o bandit clássico tende a enviá-la todo dia. Em pouco tempo, a taxa de clique despenca e o usuário desativa as notificações do app.

### As Duas Propriedades Matemáticas Inovadoras:
* **Braços Adormecidos (*Sleeping Arms*):** Em cada rodada de decisão para o usuário $u$ no instante $t$, o conjunto de braços disponíveis $\mathcal{A}(u, t)$ é filtrado para incluir apenas as mensagens para as quais o usuário cumpre todos os pré-requisitos contextuais. Modelos inelegíveis "adormecem" e não penalizam a estatística global.
* **Penalização e Recuperação de Recência (*Recovering Arms*):** Cada vez que um template de mensagem $a$ é disparado, ele sofre uma penalização de recompensa esperada que decai exponencialmente ao longo dos dias:
  $$\hat{\mu}_{a}(t) = \mu_{a} \cdot \left(1 - e^{-\lambda \cdot (t - t_{\text{last}})}\right)$$
  **A Descoberta Contraintuitiva:** A **frescura supera a qualidade absoluta**. Uma mensagem média que o usuário não vê há 10 dias converte sistematicamente melhor do que a melhor mensagem do sistema vista ontem.

---

## 2. Governança Conservadora de Canal (A Regra Anti-Groupon)
A Groupon destruiu permanentemente sua base de e-mails ao inflacionar o volume diário. No Duolingo, a quantidade diária de notificações é uma constante protegida por governança rígida:
* **Limite Inegociável:** No máximo **2 notificações push por dia por usuário**.
  1. **Notificação de Rotina (*Routine Notif*):** Suave e encorajadora. Dispara via *Smart Scheduling* na mesma janela horária em que o usuário praticou no dia anterior (ignorando horários teóricos declarados no onboarding).
  2. **Notificação de Salvamento (*Save Notif*):** Disparada apenas no final da noite (21h30–23h00) caso a ofensiva diária ainda esteja pendente e em risco iminente de perda.
* **A Parada Honesta de 7 Dias:**
  Se o usuário não abre a aplicação por 7 dias consecutivos após os alertas, o sistema interrompe todos os envios automáticos e envia a mensagem final:
  > *"Estes lembretes não parecem estar a funcionar. Vamos parar de os enviar por agora."*
  Essa parada honesta impede que o usuário bloqueie as notificações nas configurações do sistema operacional e, psicologicamente, aciona a aversão à perda de suporte, gerando expressivas taxas de ressurreição.

---

## 3. Birdbrain, Half-Life Regression (HLR) e Desafio Ótimo
A telemetria do Duolingo identificou que cerca de 20% das lições iniciadas eram abandonadas no meio quando a dificuldade saltava abruptamente.

### O Modelo Half-Life Regression (Settles & Meeder):
Para cada par usuário-conceito $(u, c)$, o algoritmo modela a força da memória com base na curva de esquecimento de Ebbinghaus:
$$p = 2^{-\frac{\Delta t}{h}}$$
Onde $p$ é a probabilidade estimada de acerto, $\Delta t$ é o tempo decorrido desde o último contato e $h$ é a meia-vida da memória estimada por uma regressão neural profunda baseada em:
* Histórico prévio de acertos e erros no conceito.
* **Tempo de latência de resposta (*Response Time*):** Um acerto lento (> 5 segundos) é computado como sinal de memória frágil, recebendo reforço espaçado antecipado.

### O Gerador de Sessões de Baixa Latência (14ms):
O Duolingo reescreveu seu motor de geração de sessões em Scala para calibrar a dificuldade em tempo real em **14ms**, impedindo qualquer engasgo visual ou tela de loading perceptível entre os exercícios.

---

## 4. O Ciclo Perpétuo dos Baús Circadianos

```
       MANHÃ (06:00 - 12:00)                          NOITE (18:00 - 24:00)
  +-------------------------------+             +-------------------------------+
  |  Prática de Foco Matinal      |             |  Consolidação Noturna         |
  |  - Desbloqueia Baú Madrugador |             |  - Desbloqueia Baú Notívago   |
  |  - Recompensa TRANCADA        |             |  - Recompensa TRANCADA        |
  |    (libera apenas à noite)    |             |    (libera na manhã seguinte) |
  +---------------+---------------+             +---------------+---------------+
                  |                                             ^
                  |                                             |
                  +========= [Retorno Obrigatório] =============+
```

Este ciclo horário resolve o maior dilema de produto em EdTech: transformar uma prática esporádica semanal em um **hábito bi-diário sincronizado com os ciclos circadianos de plasticidade sináptica**.
