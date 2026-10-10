## MODIFIED Requirements

### Requirement: Mascote Reativo Interativo "Aura"
O sistema SHALL exibir em destaque o mascote oficial "Prisma, o Camaleão Geômetra", construído em SVG vetorial de alta precisão com crista de transferidor graduada, esquadro triangular de 30°-60°-90° e cauda em espiral de Fibonacci, cuja postura visual reage dinamicamente aos eventos de acerto, sequências de combo, dúvidas e estados de progresso do usuário através de 6 estados emocionais canônicos (`idle`, `thinking`, `hint`, `eureka`, `supernova`, `camouflaged`).

#### Scenario: Evolução do mascote durante sequência de combo (5 Níveis)
- **WHEN** o usuário atinge os patamares de combo de 1, 5, 10, 20 e 35 acertos consecutivos
- **THEN** o mascote "Prisma" SHALL transitar visualmente pelas reações progressivas correspondentes:
  1. *Nível 1 (Combo 1-4):* Postura `idle` com respiração sutil e olhar atento aos ângulos da questão.
  2. *Nível 2 (Combo 5-9):* Sorriso confiante e leve inclinação com o esquadro em prontidão.
  3. *Nível 3 (Combo 10-19):* Olhar entusiasmado e brilho dourado leve nos anéis dos olhos de transferidor.
  4. *Nível 4 (Combo 20-34):* Estado `eureka` vibrante com estrelas nas pupilas e celebração ativa.
  5. *Nível 5 (Combo 35+):* Estado `supernova` pleno, com auréola solar geométrica de 360° e confetes poligonais em órbita.

#### Scenario: Descompressão suave ao errar
- **WHEN** o usuário erra uma questão durante qualquer patamar de combo
- **THEN** o sistema SHALL dissipar a energia acumulada sem sons estridentes ou punições agressivas, e o mascote SHALL adotar postura empática `thinking` ou `hint`, apontando o esquadro e incentivando a visualização da simetria oculta.
