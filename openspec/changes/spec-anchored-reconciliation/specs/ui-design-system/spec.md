## MODIFIED Requirements

### Requirement: Paleta Cromática Editorial e Theming Soberano
O sistema SHALL implementar a paleta cromática semântica do "Caderno Editorial de Descoberta Matemática", eliminando fundos escuros cósmicos (`#030407`, `#0B0F19`) e azuis genéricos (`#0284C7`) em favor da paleta mineral:
- Modo Claro: Fundo Paper (`#F7F4EA`), superfícies elevadas em Cream (`#FFFDF6`), texto primário em Nanquim Mineral Ink (`#202522`), texto secundário em Lápis Grafite (`#5C645F`), acento primário em Verdigris (`#176B5B`), nós ativos e streak em Marigold (`#F2B84B`), relações algébricas em Iris (`#6E5AA6`) e correções pedagógicas em Coral (`#E76F61`).
- Modo Escuro Mineral: Ancorado em Mineral Ink (`#202522`) e texto em Paper (`#F7F4EA`).

#### Scenario: Aplicação dos tokens de cor de superfície e acento
- **WHEN** a interface renderiza no modo claro imediato (*cold load* padrão)
- **THEN** o sistema SHALL aplicar a cor de fundo Paper (`#F7F4EA`), superfícies elevadas em Cream (`#FFFDF6`), texto primário em Nanquim Mineral Ink (`#202522`), texto secundário em Lápis Grafite (`#5C645F`), acento de marca e nós concluídos em Verdigris (`#176B5B`), nós ativos e streak em Marigold (`#F2B84B`), acentos de relações algébricas em Iris (`#6E5AA6`) e correções pedagógicas não-punitivas em Coral (`#E76F61`)

#### Scenario: Suporte a Modo Escuro Mineral
- **WHEN** o usuário seleciona o tema escuro
- **THEN** o sistema SHALL inverter as superfícies ancorando o fundo em Ink Mineral (`#202522`) e o texto em Paper (`#F7F4EA`), mantendo o contraste de texto acima de 7:1 (WCAG AAA) e sem uso de `#000000`, `#07090E` ou `#0B0F19`

## ADDED Requirements

### Requirement: Navegação Principal em 4 Abas Táteis
A barra de navegação inferior do aplicativo SHALL disponibilizar exatamente 4 abas táteis: Trilha (`track`), Treino (`train`), Duelos (`duels`) e Perfil (`profile`), com feedback auditivo e pílula tátil de destaque em tom Verdigris.

#### Scenario: Alternância entre as 4 abas ativas
- **WHEN** o usuário toca em uma das 4 abas da barra inferior
- **THEN** o sistema SHALL alternar a tela correspondente sem recarregamento de página, emitindo o tick de áudio e destacando o ícone ativo

### Requirement: Cabeçalho Editorial Padronizado
O cabeçalho superior SHALL exibir a marca em minúsculas `aura●math` acompanhada do avatar da Aura em SVG e pílulas métricas unificadas, sem ícones arcaicos como o triângulo Delta.

#### Scenario: Visualização do cabeçalho oficial
- **WHEN** qualquer aba principal estiver visível
- **THEN** o cabeçalho SHALL apresentar a logo `aura●math`, a contagem de ofensiva e estrelas lidas diretamente da fonte unificada de estado
