## Purpose

Fornece um pipeline unificado e escalável para registrar, carregar assincronamente com cache e renderizar sequências de animação vetorial SVG para mascotes e elementos gráficos interativos.

## ADDED Requirements

### Requirement: Registro Modular de Ativos de Animação
O sistema SHALL fornecer um registro central tipado (`MascotAnimationRegistry`) que mapeia identificadores de personagens, estados comportamentais e variantes para coleções de ativos vetoriais SVG, suportando poses únicas, sequências de quadros (frame sheets) e configurações de reprodução (duração, taxa de quadros e modo de repetição).

#### Scenario: Registro de novo estado com múltiplos quadros
- **WHEN** um novo estado com múltiplos quadros SVG é registrado no catálogo (ex: `prisma/eureka` com 5 frames)
- **THEN** o sistema SHALL aceitar a definição contendo os caminhos dos ativos, ordem sequencial dos quadros, taxa de quadros (FPS) e estratégia de reprodução (`loop` ou `once`) sem exigir alteração nos componentes consumidores.

#### Scenario: Consulta de estado não registrado com fallback elegante
- **WHEN** um componente solicita um estado ou variante inexistente no registro
- **THEN** o sistema SHALL emitir aviso de diagnóstico em desenvolvimento e renderizar imediatamente a pose canônica padrão (`idle`) como fallback seguro.

### Requirement: Carregamento Assíncrono com Cache em Memória
O sistema SHALL carregar arquivos SVG sob demanda através de carregamento assíncrono não-bloqueante e armazenar os vetores processados em um cache em memória reutilizável para eliminar latência perceptual em reproduções subsequentes.

#### Scenario: Primeiro carregamento de animação sob demanda
- **WHEN** uma animação é solicitada pela primeira vez durante uma lição
- **THEN** o sistema SHALL carregar o recurso vetorial de forma assíncrona, renderizando um marcador estático temporário até o carregamento concluir sem travar a thread principal da interface.

#### Scenario: Reutilização instantânea a partir do cache
- **WHEN** o mesmo estado ou quadro de animação é requisitado novamente após o primeiro carregamento
- **THEN** o sistema SHALL recuperar o vetor instantaneamente do cache em memória com latência inferior a 16ms (garantindo 60 FPS).

### Requirement: Sequenciador e Controle de Reprodução de Quadros
O sistema SHALL fornecer um controlador de reprodução que avance sequencialmente os quadros da animação no intervalo de tempo especificado, suportando pausas, repetições, eventos de conclusão e interpolação de escala.

#### Scenario: Reprodução de animação de comemoração one-shot
- **WHEN** o evento de acerto dispara uma animação `once` (ex: `eureka`)
- **THEN** o sequenciador SHALL reproduzir os quadros até o último frame, disparar o callback `onAnimationComplete` e transitar automaticamente para a pose de repouso configurada.
