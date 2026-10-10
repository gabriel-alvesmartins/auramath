## Purpose

Gerencia o ciclo de vida de autenticação, perfis de usuário e sincronização híbrida entre sessão local de convidado e conta persistida na nuvem via Supabase.

## ADDED Requirements

### Requirement: Fluxo Híbrido Convidado para Nuvem (Guest-First)
O sistema SHALL permitir o uso imediato de todas as modalidades de aprendizado e treino em modo convidado local, oferecendo vinculação e migração transparente dos dados acumulados para a conta na nuvem quando o usuário decidir autenticar-se.

#### Scenario: Uso inicial imediato sem autenticação prévia
- **WHEN** um novo usuário abre a aplicação pela primeira vez
- **THEN** o sistema SHALL inicializar uma sessão local de convidado, persistir o progresso em armazenamento local e não bloquear a navegação nem a execução de lições

#### Scenario: Migração de dados locais ao realizar cadastro ou login
- **WHEN** um usuário com histórico em modo convidado realiza cadastro ou login com sucesso
- **THEN** o sistema SHALL mesclar o progresso local de nós, estrelas, histórico de métricas e conquistas no registro de perfil do Supabase sem perda de dados

### Requirement: Autenticação Multimodal via Supabase
O sistema SHALL suportar autenticação de usuários por Email e Senha, Magic Link (link sem senha por email) e Google OAuth, fornecendo feedback tátil e mensagens editoriais claras em cada etapa.

#### Scenario: Autenticação por Email e Senha
- **WHEN** o usuário submete credenciais válidas de email e senha no modal de autenticação
- **THEN** o sistema SHALL estabelecer uma sessão autenticada segura no Supabase e atualizar o cabeçalho e perfil com os dados do usuário

#### Scenario: Autenticação por Magic Link
- **WHEN** o usuário solicita login via Magic Link informando seu endereço de email
- **THEN** o sistema SHALL disparar o envio do link mágico pelo Supabase e exibir uma notificação editorial orientando a checar a caixa de entrada

#### Scenario: Autenticação com Google OAuth
- **WHEN** o usuário seleciona a opção "Continuar com Google"
- **THEN** o sistema SHALL iniciar o fluxo OAuth seguro do Supabase e retornar à aplicação com a sessão autenticada

### Requirement: Perfil de Usuário e Sincronização Reativa
O sistema SHALL manter um registro de perfil de usuário contendo identificador único, nome de exibição, nome de usuário, nível de Aura, XP acumulado, dias de streak e pontuação de Elo, sincronizando alterações automaticamente.

#### Scenario: Carregamento do perfil autenticado
- **WHEN** uma sessão autenticada é restaurada ou iniciada
- **THEN** o sistema SHALL carregar os dados atualizados da tabela `profiles` e refletir os valores no cabeçalho editorial e na tela de perfil

#### Scenario: Encerramento de sessão (Logout)
- **WHEN** o usuário aciona o botão de encerramento de sessão
- **THEN** o sistema SHALL revogar os tokens de acesso locais, limpar o estado em memória e reverter para a sessão de convidado limpa
