## MODIFIED Requirements

### Requirement: Gestão de Turmas e Inscrição por Código
[Fase Futura / Postergado] O sistema SHALL permitir que usuários com perfil de professor criem múltiplas turmas, gerem códigos alfanuméricos únicos de convite e administrem a listagem de estudantes vinculados.

#### Scenario: Criação de nova turma pelo professor
- **WHEN** o professor preenche o nome da turma (ex.: "9º Ano A - Matutino") e clica em "Criar Turma"
- **THEN** o sistema SHALL gerar a entidade da turma no banco de dados e atribuir um código de acesso único de 6 caracteres (ex.: `AURA9A`)

#### Scenario: Ingresso de aluno na turma via código
- **WHEN** um aluno autenticado insere o código `AURA9A`
- **THEN** o sistema SHALL associar a conta do aluno à turma correspondente e notificá-lo do vínculo com sucesso

### Requirement: Criação e Distribuição de Desafios Pedagógicos
[Fase Futura / Postergado] O professor SHALL ter a capacidade de configurar e agendar tarefas de cálculo mental compostas por conjuntos de técnicas específicas dos 7 Graus, definindo prazo de entrega e meta de precisão.

#### Scenario: Atribuição de tarefa de produtos notáveis
- **WHEN** o professor seleciona as técnicas `SQUARES_ENDING_5` e `DIFF_OF_SQUARES`, estipula 20 questões e define prazo de 7 dias
- **THEN** o sistema SHALL publicar a tarefa na aba de atividades de todos os alunos inscritos na turma com status "Pendente"

### Requirement: Dashboard Diagnóstico de Pontos Cegos Cognitivos
[Fase Futura / Postergado] O sistema SHALL processar as respostas dos alunos e gerar relatórios agregados para o professor, destacando a taxa de precisão, tempo médio por questão e identificação automática de técnicas onde a turma apresenta maiores dificuldades.

#### Scenario: Visualização do diagnóstico da turma
- **WHEN** o professor acessa a tela de relatórios de uma turma após a conclusão de uma tarefa
- **THEN** o sistema SHALL renderizar gráficos de desempenho por técnica, evidenciando explicitamente quais atalhos mentais tiveram índice de erro superior a 30%

### Requirement: Ranking Privado da Turma
[Fase Futura / Postergado] O sistema SHALL manter um ranking em tempo real exclusivo para os alunos daquela turma, ordenado por pontos conquistados em tarefas e modo Blitz da turma, incentivando competição sadia no ambiente escolar.

#### Scenario: Consulta ao ranking da turma pelo aluno
- **WHEN** o aluno acessa a aba "Ranking da Minha Turma"
- **THEN** o sistema SHALL exibir a classificação atualizada dos colegas de classe com pseudônimos ou nomes cadastrados, isolados dos competidores globais da plataforma
