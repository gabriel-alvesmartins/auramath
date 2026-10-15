## Context

Atualmente, `DuolingoLessonView.tsx` inicializa o estado de dificuldade com `useState<DifficultyTier>('medium')` e renderiza um seletor com três botões manuais (`[★ Fácil]`, `[★★ Médio]`, `[★★★ Difícil]`) dentro do container do drill de agilidade. Além disso, a finalização da lição em `DuolingoLessonView` e `gamificationEngine.ts` atribui de 1 a 3 estrelas baseado no limiar percentual de uma única bateria (`accuracy >= 95 ? 3 : 2 : 1`).

Para seguir a pedagogia Duolingo de progressão por coroas (*Crown System*), a dificuldade precisa ser derivada diretamente do progresso persistido do nó (`nodeProgress[nodeId]?.stars`), e a conclusão de cada bateria com $\ge 80\%$ de acurácia deve conceder exatamente $+1$ estrela de maestria, avançando o nó na trilha.

## Goals / Non-Goals

**Goals:**
- Determinar a dificuldade do drill procedural (`easy`, `medium`, `hard`) dinamicamente a partir do número de estrelas atuais do nó (`0★ -> easy`, `1★ -> medium`, `2★ ou 3★ -> hard`).
- Eliminar o componente interativo de escolha de dificuldade no drill, substituindo-o por um badge informativo com microcopy editorial (ex: `Fase 1 de 3 • Fácil`).
- Definir o passo inicial da lição de forma contextual:
  - `0 estrelas`: Início no Step 1 (`theory` $\rightarrow$ `scaffolding` $\rightarrow$ `drill`).
  - `1 ou mais estrelas`: Início direto no Step 3 (`drill`), com botão opcional de "Rever Método" para visualização sem fricção obrigatória de andaimes.
- Atualizar a função de registro em `gamificationEngine.ts` para incrementar o nível de estrelas (`Math.min(3, prevStars + 1)`) quando a acurácia for $\ge 80\%$.
- Atualizar a tela de celebração de vitória para exibir qual estrela foi conquistada e o status da coroa.

**Non-Goals:**
- Não alterar a estrutura visual do nó serpentine na trilha (`TrackSerpentineNode.tsx`), pois ele já suporta e renderiza fielmente o formato de 3 estrelas orbitais.
- Não introduzir andaimes adicionais obrigatórios nas fases 2 e 3 (o foco dessas etapas é consolidação, velocidade e maestria sob pressão).

## Decisions

### Decisão 1: Derivação de Dificuldade e Passo Inicial via Estado Centralizado
Em `DuolingoLessonView.tsx`, consultar o estado inicial de estrelas do nó diretamente do `gamificationEngine`:
```typescript
const initialNodeStars = gamificationEngine.getState().nodeProgress[node.id]?.stars || 0;
const selectedDifficulty: DifficultyTier = initialNodeStars === 0 ? 'easy' : initialNodeStars === 1 ? 'medium' : 'hard';
const [lessonStep, setLessonStep] = useState<LessonStep>(initialNodeStars === 0 ? 'theory' : 'drill');
```
*Alternativas consideradas:*
- *Passar `currentStars` via rota ou props de `TrackView`:* Rejeitado porque o `gamificationEngine` já é o singleton de verdade de dados (`single source of truth`) do AuraMath, evitando duplicação de estado ou descompasso de sincronização.

### Decisão 2: Substituição dos Botões de Dificuldade por Badge Informativo de Fase
Remover a barra de botões clicáveis `[★ Fácil] [★★ Médio] [★★★ Difícil]` e substituí-la por uma pílula informativa editorial:
```tsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
  <span className="phase-pill">
    Fase {initialNodeStars + 1} de 3 • {selectedDifficulty === 'easy' ? 'Fácil' : selectedDifficulty === 'medium' ? 'Médio' : 'Difícil'}
  </span>
</div>
```
*Rationale:* Elimina a ilusão de escolha e direciona a atenção cognitiva do aluno estritamente para o cálculo mental procedural.

### Decisão 3: Progressão Incremental no `gamificationEngine`
No método `recordLessonCompletion` e `completeTrackNode`, ajustar a atribuição de estrelas:
```typescript
if (nodeId && accuracy >= 80) {
  const existing = this.state.nodeProgress[nodeId];
  const prevStars = existing?.stars || 0;
  const finalStars = Math.min(3, prevStars + 1);
  const starsDiff = Math.max(0, finalStars - prevStars);
  // ...
}
```
*Rationale:* Garante que o aluno precisa vencer 3 baterias em dificuldades crescentes para coroar o nó como dourado, exatamente como no sistema de coroas do Duolingo.

### Decisão 4: Acesso Opcional à Teoria para Fases Avançadas
Para alunos que acessarem nós com 1 ou 2 estrelas mas desejarem relembrar o atalho visual antes de calcular, adicionar um link discreto "Rever Teoria" no cabeçalho ou no rodapé do drill, permitindo alternar `setLessonStep('theory')` sem penalidade.

## Risks / Trade-offs

- **[Risco] O usuário se esquecer da técnica ao entrar direto no nível Médio/Difícil** $\rightarrow$ *Mitigação:* Manter um atalho discreto "Rever Método" na barra superior do drill, permitindo voltar temporariamente ao card de teoria com um único toque.
- **[Risco] Compatibilidade com progresso já gravado no `localStorage`** $\rightarrow$ *Mitigação:* A lógica respeita `existing?.stars`. Se o nó já tiver 1 estrela no cache local, abrirá diretamente no nível Médio; se tiver 3, abrirá no Treino Lendário.
