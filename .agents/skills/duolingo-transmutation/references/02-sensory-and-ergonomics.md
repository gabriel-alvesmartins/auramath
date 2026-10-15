# Caderno de Referência 02: Engenharia Sensorial, Física Tátil 3D e Ergonomia

## 1. Física Tátil 3D a Zero Latência (Sistema Feather ➔ `.aura-3d-btn`)
Ao contrário do *flat design* convencional — que depende de mudanças sutis de opacidade —, a interface do Duolingo simula teclas mecânicas reais prensáveis com affordance tátil evidente.

```
       ESTADO DE REPOUSO                   ESTADO PRESSIONADO (:active)
   +-----------------------+                 
   |                       |                 
   |   CONTINUAR [Enter]   |                 +-----------------------+
   |                       |  ===========>   |   CONTINUAR [Enter]   |
   +-----------------------+ (onTouchStart)  +-----------------------+
   |  Chanfro 3D (4px)     |                 | Chanfro (1px) | (translateY 3px)
   +-----------------------+                 +---------------+
```

### Especificação CSS Canônica do AuraMath:
```css
/* src/theme/theme.css */
.aura-3d-btn {
  position: relative;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  text-align: center;
  box-shadow: 0 4px 0 var(--btn-bevel-color);
  transform: translateY(0);
  /* Retorno elástico no release */
  transition: transform 80ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 80ms cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* 0ms de latência perceptual no toque físico */
.aura-3d-btn:active,
.aura-3d-btn.is-pressed {
  transform: translateY(3px) !important;
  box-shadow: 0 1px 0 var(--btn-bevel-color) !important;
  transition: none !important; /* Inegociável: zero atraso de interpolação */
}
```

### Racional de Neurociência Motora:
Em baterias cronometradas (ex: Blitz 60s ou modo 1 Minuto), o cérebro humano opera em regime de antecipação cinestésica. Qualquer atraso de feedback visual superior a 50ms desconecta a memória muscular motora e quebra o estado de fluxo (*flow state*). A captura no `onTouchStart` contorna o atraso histórico de 300ms dos navegadores móveis.

---

## 2. Sonoplastia Pentatônica em Escala Maior (Ambrose Yu ➔ `audioSynth.ts`)
O design acústico concebido por Ambrose Yu para o Duolingo e adaptado para o AuraMath atua como um marcador neuroquímico pavloviano de dopamina.

### Por que a Escala Pentatônica Maior (C4 a C7)?
Em sequências ultrarrápidas de cálculo mental (< 1,5 segundos por resposta), escalas cromáticas ou diatônicas tradicionais geram choques de semitons e trítonos dissonantes se as notas soarem sobrepostas.
A Escala Pentatônica Maior (Dó, Ré, Mi, Sol, Lá):
* **Elimina intervalos de quarta aumentada e semitons.**
* É **matematicamente consonante**: qualquer combinação de notas tocadas em qualquer ordem ou velocidade ressoa harmonicamente, elevando a tensão positiva sem cacofonia.

### Arquitetura de Áudio no Web Audio API (`src/services/audioSynth.ts`):
* **Ataque Imediato:** Envelope ADSR com subida de 2ms para clique instantâneo sem clique espúrio de DC-offset.
* **Harmônicos de Cristal e Marimba:** Mistura de onda senoidal pura (fundamental) com primeiro harmônico em onda triangular atenuada em -12dB.
* **Escalonamento Progressivo de Combos (*Escalating Reward Families*):**
  * Combo 1 a 4: Notas simples da escala Dó Maior Pentatônica.
  * Combo 5 (*5-in-a-row*): Acorde com terceira maior e quinta justa.
  * Combo 10 (*10-in-a-row*): Camada harmônica enriquecida com reverberação convolutiva.
  * Combo 35+ (*Supernova*): Fanfarra pentatônica completa e ressonância áurea.

---

## 3. Ergonomia Visual, Thumb Zone e Prevenção de CLS

### A Regra de Foco 80/20:
Durante uma sessão de resolução matemática:
* **Ocultamento Total:** A barra de navegação inferior (tabs), cabeçalhos globais, contador de gemas e botões de perfil são ejetados do viewport.
* **Alocação Visual:** Mais de 80% dos pixels úteis são reservados para o enunciado geométrico, área de decomposição e teclado numérico in-app.

### A Lei do Toque Cego (Thumb Zone de 430px):
1. **Teclado Tátil Fixo (`TactileNumpad.tsx`):**
   * Grade 3x4 com teclas de dimensões mínimas de 56x56dp, atendendo às diretrizes de ergonomia motora para evitar toques acidentais em digitação rápida.
   * **Coordenadas Invariáveis:** Nenhuma animação ou gaveta pode empurrar o teclado verticalmente durante a digitação.
2. **Duplo Toque Confortável no Feedback Drawer:**
   * O botão `CONTINUAR` dentro do `FeedbackDrawer.tsx` é renderizado exatamente na mesma altura $Y$ em que o botão `VERIFICAR` se encontrava. O usuário avança no exercício dando um duplo toque no mesmo ponto da tela sem deslocar o polegar.
3. **Cumulative Layout Shift (CLS) = 0:**
   * O cronômetro e a equação utilizam `font-family: var(--font-mono)` (`JetBrains Mono`) com `font-variant-numeric: tabular-nums`. Cada algarismo possui rigorosamente a mesma largura em pixels, impedindo que a transição de "1" para "8" faça o layout balançar.
