---
name: spec-anchored
description: Diretrizes e automações do método Spec-Anchored para o AuraMath. Garante que especificação e código evoluam juntos como parceiros iguais, impedindo o Specification Rot e detectando drift imediatamente.
---

# Método Spec-Anchored · AuraMath

O **Spec-Anchored** é o paradigma de desenvolvimento oficial do AuraMath. Nele, a especificação e o código de implementação coexistem como parceiros iguais e evoluem em perfeita sincronia ao longo de todo o ciclo de vida do projeto.

---

## 1. Princípios Fundamentais

1. **Evolução Conjunta como Parceiros Iguais**:
   Diferente do *Spec-First* (onde a spec pode ser descartada após codificação) e do *Spec-as-Source* (onde humanos nunca editam código), no **Spec-Anchored** a especificação e o código coexistem. Qualquer melhoria, refatoração de regra de negócio ou correção de mecânica matemática exige atualização de ambos.

2. **A Especificação como Âncora Inviolável**:
   Toda alteração de comportamento no sistema exige atualizar tanto a especificação correspondente em `openspec/specs/` quanto o código de produção (`packages/engine/` e `src/`).

3. **Anti-Drift Automatizado**:
   A especificação não é um texto passivo: ela é validada por scripts automatizados de conformidade (`scripts/spec-compliance.mjs`) e testes contínuos de integridade. Divergências entre spec e código são tratadas como falhas bloqueantes de CI.

4. **Proibição Absoluta de Specification Rot**:
   Ignorar testes que quebram ou desabilitar validações de conformidade para "entregar mais rápido" destrói a confiança no sistema. Em caso de discrepância, a ação deve ser deliberada: ou corrige-se o código para respeitar a especificação válida, ou atualiza-se a especificação quando o requisito de produto evoluiu conscientemente.

---

## 2. Pilares de Validação do AuraMath

Ao implementar ou alterar qualquer parte do sistema, verifique sempre os contratos ancorados:

| Domínio | Especificação Âncora | Implementação Código | Validador Automático |
|---|---|---|---|
| **Estrutura Curricular** | 7 Graus Cognitivos (I a VII) | `TRACK_GRADES` em `@auramath/engine` | `scripts/spec-compliance.mjs` |
| **Bateria de Fixação** | 10 a 20 questões por nó procedurais | `generateQuestionsForNode` em `@auramath/engine` | Testes do motor matemático |
| **Calibração de Dificuldade** | 3 tiers (1★ Fácil, 2★ Médio, 3★ Difícil) | `DifficultyTier` no motor e em `DuolingoLessonView` | Testes unitários do motor |
| **Andaimes de Lacuna** | 3 tarefas guiadas por nó | `getNodeScaffoldingTasks` em `@auramath/engine` | Compliance audit |
| **Regra de Retenção** | >= 80% acurácia para completar nó | `recordLessonCompletion` & `DuolingoLessonView` | Compliance audit & E2E |
| **Mecânicas Canceladas** | Boss Battles, Skins, Duelo Fantasma removidos | Proibição de exports/telas dessas mecânicas | Verificação regex anti-resíduo |
| **Modos de Jogo** | Split-Screen simultâneo & Desafio Diário PRNG | `DuelHubView.tsx` | Auditoria de rotas e componentes |
| **Design System** | Rebrand 01.1 (Paper, Verdigris, Marigold, Iris) | Tokens CSS e `EditorialHeader` | Testes visuais / tokens |

---

## 3. Comandos do Workflow

- **`npm run spec:check`**: Executa a auditoria de conformidade Spec-Anchored, verificando se todo o código atual está alinhado com as especificações em `openspec/specs/` e gerando o relatório `src/data/spec-compliance.json`.
- **`npm run spec:sync`**: Sincroniza pendências e metas das especificações com o backlog do GitHub Projects, gerando comandos prontos para a CLI `gh project`.
- **Visualização Dev no App**: Acesse a aba/rota `/dev` (ou o botão Dev no cabeçalho) para inspecionar em tempo real os itens em conformidade, pendências futuras e módulos concluídos.

---

## 4. Checklist para Mudanças de Código

Sempre que submeter um commit ou Pull Request:
1. Atualize a especificação relevante em `openspec/specs/` caso o comportamento ou mecânica tenha mudado.
2. Execute `npm run spec:check` e garanta que a taxa de conformidade não tenha sofrido regressão.
3. Se novas tarefas forem planejadas para fases futuras, documente-as com a tag `[FUTURO]` ou `[STANDBY]` nas especificações.
