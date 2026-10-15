## ADDED Requirements

### Requirement: Componentes Visuais do Funil de Onboarding na Moldura de 430px
A interface de integração de novos usuários SHALL ser estritamente contida na moldura móvel centralizada de 430px com responsividade fluida para telas menores, preservando as superfícies Paper (`#F7F4EA`) e Cream (`#FFFDF6`).

#### Scenario: Layout responsivo do assistente de onboarding
- **WHEN** o usuário interage com qualquer tela do assistente de onboarding (Boas-vindas, Escolha de Caminho, Quiz ou Meta Diária)
- **THEN** o container SHALL ocupar no máximo 430px de largura com preenchimento interno ergonômico, botões de ação situados na Thumb Zone inferior e barra de progresso no topo.

#### Scenario: Cards de seleção de caminho tripartite com física tátil 3D
- **WHEN** os 3 cards de seleção de caminho são renderizados na tela de nivelamento
- **THEN** cada card SHALL implementar chanfro chanfrado inferior de 3px, afundamento imediato no clique com tick tátil e ícones distintivos (Raio para Zero, Bússola para Diagnóstico, e Troféu para Escolha de Nível).

### Requirement: Layout e Transições da Tela de Vitória LessonCompleteView
A tela `LessonCompleteView` SHALL implementar as transições de entrada de cada fase através de animações CSS aceleradas por hardware com estados determinísticos.

#### Scenario: Transições sequenciadas sem layout shift (CLS = 0)
- **WHEN** a tela transita entre as fases 1, 2, 3, 4 e 5 da coreografia de vitória
- **THEN** as posições verticais e alturas dos containers pré-alocam seu espaço dimensional, impedindo qualquer salto repentino de layout durante a montagem dos elementos.
