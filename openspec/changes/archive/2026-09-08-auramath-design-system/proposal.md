# Proposal: Auramath UI Design System & Visual Architecture

## Why

O Auramath é uma plataforma de cálculo mental de alta velocidade e engajamento sensorial onde centésimos de segundo importam. Interfaces educacionais convencionais sofrem de tipografia genérica, layouts que tremem com números de larguras variáveis, esquemas de cores infantis saturados e feedback de erro agressivo que desencadeia aversão matemática. 

Esta mudança estabelece o **Design System e a Arquitetura Visual** oficial do Auramath, definindo paleta cromática cósmica (Dark Glassmorphism bioluminescente), tipografia com numerais tabulares anti-layout-shift, escalas de espaçamento e raio, tratamentos de componentes de toque ultra-rápido e leis visuais de contraste e game juice.

## What Changes

- Definição da **Paleta Cromática Oficial**: Esquema de cores dark-mode imersivo (Midnight Obsidian, Electric Cyan, Cosmic Violet, Emerald Gold e Soft Coral para erros não-hostis).
- Especificação da **Pilha Tipográfica**: Combinação de Sans geométrica para display (Plus Jakarta Sans/Outfit), fonte monoespaçada tabular anti-layout shift para operações matemáticas (JetBrains Mono tabular-nums) e Inter para interface geral.
- Padronização de **Design Tokens**: Escalas de espaçamento base 4px, escala de raio suave (squircles de 4px a 24px), elevações baseadas em halos bioluminescentes (Glows em vez de sombras cinzentas opacas) e tratamentos de vidro fumê (Dark Glassmorphism com backdrop blur).
- Tratamentos de **Componentes Core**:
  - `NumpadButton`: Teclas do teclado in-app com área de toque mínima de 56dp, feedback no `onTouchStart`, micro-scale 0.96 e emissão de luz tátil.
  - `EquationDisplay`: Painel central proeminente com espaçamento de glifos fixo para transições fluidas da pedagogia cinética.
  - `ComboHUD`: Indicador visual de combo com anéis de calor progressivo e multiplicadores dinâmicos.
  - `TrackNode`: Nós interativos da Trilha dos 6 Graus com coroas, halos pulsantes e caminhos de luz conectivos.
- Estabelecimento das **Regras Visuais & Design Laws**:
  - *Lei do Zero Layout Shift*: Toda renderização de equações e cronômetros deve usar `font-variant-numeric: tabular-nums` e caixas delimitadoras fixas.
  - *Lei da Hierarquia de Foco 80/20*: O cálculo ativo e o teclado ocupam o centro absoluto; controles auxiliares recuam com opacidade reduzida.
  - *Lei da Descompressão Empática*: Erros utilizam tons quentes de coral suave e partículas de dissipação, banindo buzzers vermelhos e telas que tremem de forma punitiva.

## Capabilities

### New Capabilities
- `ui-design-system`: Especificação formal de tokens de design, paleta cromática, tipografia tabular, componentes táticos de interface e regras de renderização estética para Web e Mobile (Expo / React Native).

### Modified Capabilities
<!-- Nenhuma capacidade modificada -->

## Impact

- **Frontend**: Criação dos arquivos de tokens de tema (`theme.ts`, `tokens.json`), configuração do Tailwind/NativeWind ou StyleSheet constants no app Expo.
- **Tipografia**: Inclusão das fontes web/mobile (`PlusJakartaSans`, `JetBrainsMono`, `Inter`).
- **Acessibilidade**: Garantia de contraste WCAG AA/AAA em fundos escuros e áreas de toque com mínimo de 48x48dp.
