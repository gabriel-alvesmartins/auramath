## Purpose

O subsistema de economia de gemas e assinatura de prestígio viabiliza a retenção comportamental sustentável através de consumíveis de segurança (Streak Freeze), impulsos cognitivos temporários (XP Boost) e a camada de assinatura Aura Fibonacci com alto valor matemático e sem fricção punitiva.

## ADDED Requirements

### Requirement: Saldo e Circulação de Gemas Marigold
O sistema SHALL gerenciar o saldo de Gemas Marigold do usuário, concedendo recompensas por excelência cognitiva e permitindo o resgate de consumíveis na Loja Editorial sem permitir saldo negativo.

#### Scenario: Ganho de gemas por lição perfeita e baús circadianos
- **WHEN** o usuário conclui uma lição com 100% de precisão ou resgata um baú circadiano (Madrugador/Notívago)
- **THEN** o sistema SHALL creditar as gemas correspondentes ao saldo do usuário, emitindo notificação tátil e som pentatônico ascendente com persistência imediata no armazenamento local.

#### Scenario: Prevenção de compra com saldo insuficiente
- **WHEN** o usuário tenta adquirir um consumível na Loja cujo custo em gemas seja superior ao seu saldo disponível
- **THEN** o botão de compra SHALL permanecer em estado desabilitado ou disparar feedback empático em Coral Suave informando o saldo faltante, sem deduzir gemas.

### Requirement: Gestão de Congelamento de Ofensiva (Streak Freeze)
O sistema SHALL permitir a compra e o equipamento preventivo de até 2 cargas de Congelamento de Ofensiva (*Streak Freeze*), consumindo automaticamente uma carga caso o usuário fique 24 horas sem praticar para evitar a perda da sequência diária.

#### Scenario: Aquisição de Streak Freeze na Loja Editorial
- **WHEN** o usuário toca no botão de compra de Streak Freeze possuindo gemas suficientes e menos de 2 cargas no inventário
- **THEN** o sistema SHALL deduzir o valor em gemas, incrementar o contador de `freezesAvailable` em 1 (até o teto de 2), atualizar o modal da ofensiva e emitir som de travamento tátil.

#### Scenario: Bloqueio de compra na capacidade máxima
- **WHEN** o usuário já possui 2 cargas de Streak Freeze equipadas
- **THEN** o card do Streak Freeze na Loja SHALL exibir o status "EQUIPADO (MÁXIMO)" e desativar o botão de compra.

#### Scenario: Consumo automático em dia ausente
- **WHEN** o sistema avalia a transição de data e detecta exatamente 1 dia de ausência com pelo menos 1 carga de Streak Freeze disponível
- **THEN** o sistema SHALL preservar o número atual de dias da ofensiva, decrementar 1 carga de `freezesAvailable` e registrar a data de congelamento no histórico.

### Requirement: Poção de Foco Mental (XP Boost 2x por 15 Minutos)
O sistema SHALL permitir o resgate e ativação de Poções de Foco Mental que dobram todos os pontos de experiência (XP) ganhos em lições durante uma janela de 15 minutos contínuos.

#### Scenario: Ativação do XP Boost
- **WHEN** o usuário adquire a Poção de Foco Mental na Loja ou resgata um Baú Circadiano
- **THEN** o sistema SHALL registrar o carimbo de expiração (`expiresAt = Date.now() + 15 * 60 * 1000`), exibir o chip de contagem regressiva em JetBrains Mono no topo da aplicação e multiplicar por 2 o XP de todas as lições finalizadas durante o período.

#### Scenario: Expiração graciosa do bônus
- **WHEN** o cronômetro atinge 00:00
- **THEN** o multiplicador SHALL retornar imediatamente a 1x sem interromper a lição em andamento e sem renovação automática ou cobrança extra.

### Requirement: Loja Editorial Tátil ("Boutique Aura")
O sistema SHALL disponibilizar uma visualização editorial centralizada (`ShopView`), acessível via cabeçalho global e rota `/shop`, formatada na Thumb Zone de 430px com botões táteis 3D com extrusão chanfrada de 4px e resposta a 0ms.

#### Scenario: Navegação e listagem de seções
- **WHEN** o usuário navega para a rota `/shop` ou clica no chip de Gemas do cabeçalho
- **THEN** a tela SHALL renderizar as seções editoriais em ordem de prestígio:
  1. *Banner de Prestígio Aura Fibonacci* (com selo da Espiral Áurea e botão de degustação);
  2. *Ofensiva & Consistência* (Streak Freeze e Wager de 7/14 dias);
  3. *Impulso Cognitivo* (Poção de Foco 2x XP de 15 min);
  4. *Papelaria & Cadernos* (Temas Papiro, Blueprint e Dark Obsidian com prévia tátil).

#### Scenario: Equipamento de tema de caderno
- **WHEN** o usuário seleciona um tema desbloqueado na seção de papelaria
- **THEN** o sistema SHALL atualizar a variável de ambiente CSS do tema de fundo e bordas do caderno milimetrado, persistindo a preferência do usuário.

### Requirement: Assinatura de Prestígio Aura Fibonacci e Paywall Não-Agressivo
O sistema SHALL prover uma camada de assinatura de prestígio denominada **Aura Fibonacci**, apresentada através de modal editorial (`AuraFibonacciModal`), oferecendo recursos avançados de aprendizagem matemática sem jamais recorrer a bloqueios punitivos na trilha curricular regular.

#### Scenario: Exibição dos privilégios Aura Fibonacci
- **WHEN** o modal do Aura Fibonacci é acionado
- **THEN** a interface SHALL destacar a Espiral Áurea vetorial dourada, o mascote Prisma em postura de prestígio (`supernova`/`eureka`) e a lista clara de benefícios:
  1. Acesso ilimitado e irrestrito ao Radar Cognitivo de 5 Eixos e DNA Matemático;
  2. Treinos de velocidade e modo lendário sem restrições;
  3. Coleção completa de temas de cadernos editoriais matemáticos;
  4. Badge dourado com a Espiral de Fibonacci no perfil e nas ligas semanais;
  5. Dobro de gemas coletadas em baús circadianos.

#### Scenario: Alternância entre planos e início de degustação
- **WHEN** o usuário alterna entre as opções de plano Anual (com desconto e 7 dias de degustação grátis) e Mensal
- **THEN** os valores SHALL atualizar instantaneamente em tipografia tabular (`font-mono-tabular`) sem deslocamento de layout (CLS = 0), e o botão de ação principal SHALL indicar claramente o início do período de teste gratuito de 7 dias.

#### Scenario: Fechamento voluntário sem fricção (Anti-Dark Pattern)
- **WHEN** o usuário clica no botão "X" de fechar no canto superior do modal ou toca fora da área de conteúdo
- **THEN** o modal SHALL fechar suavemente com retorno imediato à tela anterior, sem disparar janelas secundárias de culpa (*guilt tripping*) ou contadores falsos de escassez.
