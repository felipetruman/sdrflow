# QA_CHECKLIST | SDRFlow AI

## 1. Objetivo

Este checklist serve para validar o SDRFlow AI antes da entrega da prova técnica.

O foco é garantir que o fluxo principal funcione de ponta a ponta:

```text
Cadastro -> Workspace -> Lead -> Kanban -> Campanha -> Geração IA -> Envio simulado -> Dashboard
```

Além disso, este checklist valida segurança, RLS, isolamento por workspace, Edge Functions, UX básica e deploy.

---

## 2. Regras de QA

Antes de considerar o projeto pronto:

* [ ] Testar em ambiente local.
* [ ] Testar em ambiente publicado na Vercel.
* [ ] Testar com pelo menos dois usuários diferentes.
* [ ] Testar com pelo menos dois workspaces diferentes.
* [ ] Testar fluxo feliz.
* [ ] Testar erros esperados.
* [ ] Confirmar que nenhuma chave sensível está exposta no frontend.
* [ ] Confirmar que o README reflete o que realmente foi implementado.

---

## 3. Dados mínimos para teste

Criar pelo menos:

* [ ] Usuário A.
* [ ] Usuário B.
* [ ] Workspace A.
* [ ] Workspace B.
* [ ] 7 etapas padrão no Workspace A.
* [ ] 7 etapas padrão no Workspace B.
* [ ] 3 leads no Workspace A.
* [ ] 2 leads no Workspace B.
* [ ] 2 campanhas no Workspace A.
* [ ] 1 campanha no Workspace B.
* [ ] 2 campos personalizados no Workspace A.
* [ ] 1 regra de campo obrigatório por etapa.

---

## 4. Testes de autenticação

## 4.1 Cadastro

### Cenário

Usuário novo cria uma conta.

### Passos

1. Acessar `/signup`.
2. Informar email válido.
3. Informar senha válida.
4. Submeter formulário.

### Resultado esperado

* [ ] Conta é criada.
* [ ] Usuário é autenticado.
* [ ] Usuário é redirecionado para onboarding de workspace ou dashboard.
* [ ] Nenhum erro inesperado aparece.

---

## 4.2 Login válido

### Cenário

Usuário existente acessa a plataforma.

### Passos

1. Acessar `/login`.
2. Informar email correto.
3. Informar senha correta.
4. Submeter formulário.

### Resultado esperado

* [ ] Login é realizado.
* [ ] Sessão é criada.
* [ ] Usuário acessa área interna.
* [ ] Usuário não volta para login ao recarregar a página.

---

## 4.3 Login inválido

### Cenário

Usuário tenta entrar com credenciais erradas.

### Passos

1. Acessar `/login`.
2. Informar email correto.
3. Informar senha errada.
4. Submeter formulário.

### Resultado esperado

* [ ] Login é bloqueado.
* [ ] Mensagem de erro aparece.
* [ ] Usuário permanece na tela de login.
* [ ] Nenhuma informação sensível é exibida.

---

## 4.4 Logout

### Cenário

Usuário encerra sessão.

### Passos

1. Estar autenticado.
2. Clicar em sair/logout.

### Resultado esperado

* [ ] Sessão é encerrada.
* [ ] Usuário é redirecionado para login.
* [ ] Rotas internas deixam de ser acessíveis.

---

## 4.5 Proteção de rotas

### Cenário

Usuário não autenticado tenta acessar área interna.

### Passos

1. Fazer logout.
2. Acessar diretamente `/dashboard`.
3. Acessar diretamente `/kanban`.
4. Acessar diretamente `/campaigns`.

### Resultado esperado

* [ ] Usuário é redirecionado para login.
* [ ] Nenhuma tela interna é exibida.
* [ ] Nenhum dado é carregado.

---

## 5. Testes de workspace

## 5.1 Criação de workspace

### Cenário

Usuário cria o primeiro workspace.

### Passos

1. Fazer cadastro ou login com usuário sem workspace.
2. Informar nome do workspace.
3. Submeter criação.

### Resultado esperado

* [ ] Workspace é criado.
* [ ] Usuário vira membro admin.
* [ ] Etapas padrão são criadas automaticamente.
* [ ] Usuário é redirecionado para dashboard.
* [ ] Nome do workspace aparece no layout.

---

## 5.2 Criação das etapas padrão

### Cenário

Ao criar workspace, o funil inicial deve nascer pronto.

### Resultado esperado

As seguintes etapas existem, em ordem:

* [ ] Base.
* [ ] Lead Mapeado.
* [ ] Tentando Contato.
* [ ] Conexão Iniciada.
* [ ] Desqualificado.
* [ ] Qualificado.
* [ ] Reunião Agendada.

---

## 5.3 Isolamento visual por workspace

### Cenário

Usuário A e Usuário B não devem ver dados um do outro.

### Passos

1. Criar Usuário A.
2. Criar Workspace A.
3. Criar leads no Workspace A.
4. Sair.
5. Criar Usuário B.
6. Criar Workspace B.
7. Acessar dashboard e Kanban do Usuário B.

### Resultado esperado

* [ ] Usuário B não vê leads do Usuário A.
* [ ] Usuário B não vê campanhas do Usuário A.
* [ ] Usuário B não vê campos personalizados do Usuário A.
* [ ] Usuário B não vê mensagens do Usuário A.

---

## 6. Testes de RLS e segurança

## 6.1 RLS ativo

### Verificação no Supabase

Confirmar RLS ativo em:

* [ ] `workspaces`.
* [ ] `workspace_members`.
* [ ] `funnel_stages`.
* [ ] `leads`.
* [ ] `custom_fields`.
* [ ] `lead_custom_values`.
* [ ] `stage_required_fields`.
* [ ] `campaigns`.
* [ ] `generated_messages`.
* [ ] `lead_activities`.

---

## 6.2 Usuário sem membership não acessa dados

### Cenário

Usuário tenta acessar dados de workspace onde não é membro.

### Passos

1. Logar como Usuário A.
2. Copiar ID de um lead do Workspace A.
3. Logar como Usuário B.
4. Tentar acessar esse lead por URL ou chamada manipulada.

### Resultado esperado

* [ ] Acesso é negado.
* [ ] Lead não é exibido.
* [ ] Nenhum dado sensível aparece.
* [ ] API/consulta retorna vazio ou erro tratado.

---

## 6.3 Service Role não exposta

### Verificação

Procurar no código frontend por:

```text
SUPABASE_SERVICE_ROLE_KEY
service_role
LLM_API_KEY
```

### Resultado esperado

* [ ] `SUPABASE_SERVICE_ROLE_KEY` não aparece no frontend.
* [ ] `LLM_API_KEY` não aparece no frontend.
* [ ] Chaves sensíveis aparecem apenas em contexto server-side/Edge Functions.

---

## 6.4 Variáveis públicas corretas

### Resultado esperado

No frontend, apenas estas variáveis públicas devem existir:

* [ ] `NEXT_PUBLIC_SUPABASE_URL`.
* [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
* [ ] `NEXT_PUBLIC_APP_URL`.

---

## 7. Testes de leads

## 7.1 Criar lead com campos padrão

### Passos

1. Acessar Kanban ou tela de leads.
2. Clicar em novo lead.
3. Preencher:

   * Nome.
   * Email.
   * Telefone.
   * Empresa.
   * Cargo.
   * Origem.
   * Observações.
4. Selecionar etapa inicial.
5. Salvar.

### Resultado esperado

* [ ] Lead é criado.
* [ ] Lead pertence ao workspace atual.
* [ ] Lead aparece na etapa correta do Kanban.
* [ ] Atividade `lead_created` é registrada.

---

## 7.2 Criar lead com dados mínimos

### Passos

1. Criar lead preenchendo apenas os campos mínimos exigidos pelo formulário.
2. Salvar.

### Resultado esperado

* [ ] Lead é criado se respeitar validação mínima.
* [ ] Campos opcionais podem ficar vazios.
* [ ] Sistema não quebra por dados ausentes.

---

## 7.3 Editar lead

### Passos

1. Abrir detalhe de um lead.
2. Alterar empresa, cargo ou observações.
3. Salvar.

### Resultado esperado

* [ ] Dados são atualizados.
* [ ] Alterações persistem ao recarregar.
* [ ] Atividade `lead_updated` é registrada.

---

## 7.4 Responsável opcional

### Passos

1. Criar lead sem responsável.
2. Editar lead e atribuir responsável.
3. Remover responsável.

### Resultado esperado

* [ ] Lead pode existir sem responsável.
* [ ] Responsável pode ser atribuído.
* [ ] Responsável pode ser removido.
* [ ] Alteração gera histórico quando aplicável.

---

## 7.5 Detalhe do lead

### Resultado esperado

A tela de detalhe mostra:

* [ ] Dados padrão.
* [ ] Campos personalizados.
* [ ] Etapa atual.
* [ ] Responsável.
* [ ] Mensagens geradas.
* [ ] Histórico de mensagens.
* [ ] Histórico de atividades.

---

## 8. Testes de campos personalizados

## 8.1 Criar campo personalizado de texto

### Passos

1. Acessar configurações de campos.
2. Criar campo `Segmento` do tipo texto.
3. Salvar.

### Resultado esperado

* [ ] Campo é criado.
* [ ] Campo aparece na lista.
* [ ] Campo aparece no formulário de lead.

---

## 8.2 Criar campo personalizado numérico

### Passos

1. Criar campo `Faturamento Anual` do tipo número.
2. Preencher valor em um lead.
3. Salvar.

### Resultado esperado

* [ ] Valor numérico é salvo.
* [ ] Valor aparece no detalhe do lead.
* [ ] Valor não aparece em leads onde não foi preenchido.

---

## 8.3 Criar campo personalizado select

### Passos

1. Criar campo `Produto de Interesse` do tipo lista.
2. Adicionar opções.
3. Preencher no lead.

### Resultado esperado

* [ ] Opções aparecem no formulário.
* [ ] Valor selecionado é salvo.
* [ ] Valor aparece no detalhe do lead.

---

## 8.4 Campos personalizados por workspace

### Cenário

Campos criados no Workspace A não devem aparecer no Workspace B.

### Resultado esperado

* [ ] Campo do Workspace A não aparece no Workspace B.
* [ ] Valor do campo não vaza entre workspaces.

---

## 9. Testes de Kanban

## 9.1 Visualização das colunas

### Resultado esperado

Kanban mostra colunas em ordem:

* [ ] Base.
* [ ] Lead Mapeado.
* [ ] Tentando Contato.
* [ ] Conexão Iniciada.
* [ ] Desqualificado.
* [ ] Qualificado.
* [ ] Reunião Agendada.

---

## 9.2 Card do lead

### Resultado esperado

Cada card mostra pelo menos:

* [ ] Nome.
* [ ] Empresa.
* [ ] Cargo.
* [ ] Responsável, se houver.
* [ ] Origem do lead, se houver.

---

## 9.3 Abrir detalhe pelo card

### Passos

1. Clicar em um card do Kanban.

### Resultado esperado

* [ ] Detalhe do lead abre corretamente.
* [ ] Dados carregam sem erro.

---

## 9.4 Mover lead entre etapas

### Passos

1. Arrastar lead de `Base` para `Lead Mapeado`.
2. Recarregar página.

### Resultado esperado

* [ ] Lead muda de coluna.
* [ ] Mudança persiste após recarregar.
* [ ] Atividade `stage_changed` é registrada.

---

## 9.5 Movimento inválido por campos obrigatórios

### Pré-condição

Configurar etapa `Lead Mapeado` exigindo `Cargo` e `Telefone`.

### Passos

1. Criar lead sem cargo e telefone.
2. Tentar mover para `Lead Mapeado`.

### Resultado esperado

* [ ] Movimento é bloqueado.
* [ ] Sistema informa campos faltantes.
* [ ] Lead permanece na etapa anterior.
* [ ] Nenhuma inconsistência é criada no banco.

---

## 10. Testes de regras de campos obrigatórios

## 10.1 Configurar campo padrão obrigatório

### Passos

1. Acessar configurações do funil.
2. Selecionar etapa `Lead Mapeado`.
3. Marcar `Cargo` como obrigatório.
4. Salvar.

### Resultado esperado

* [ ] Regra é salva.
* [ ] Regra aparece ao reabrir configuração.
* [ ] Movimentação respeita a regra.

---

## 10.2 Configurar campo personalizado obrigatório

### Passos

1. Criar campo personalizado `Segmento`.
2. Acessar configurações do funil.
3. Marcar `Segmento` como obrigatório para `Lead Mapeado`.
4. Tentar mover lead sem esse campo preenchido.

### Resultado esperado

* [ ] Movimento é bloqueado.
* [ ] Sistema informa `Segmento` como campo faltante.
* [ ] Após preencher `Segmento`, movimento é permitido.

---

## 11. Testes de campanhas

## 11.1 Criar campanha ativa

### Passos

1. Acessar campanhas.
2. Clicar em nova campanha.
3. Preencher nome.
4. Preencher contexto.
5. Preencher prompt de geração.
6. Definir status ativo.
7. Salvar.

### Resultado esperado

* [ ] Campanha é criada.
* [ ] Campanha aparece na lista.
* [ ] Campanha aparece no seletor do detalhe do lead.

---

## 11.2 Criar campanha inativa

### Passos

1. Criar campanha com status inativo.
2. Abrir detalhe de um lead.

### Resultado esperado

* [ ] Campanha aparece na lista administrativa.
* [ ] Campanha inativa não aparece para geração de mensagens.

---

## 11.3 Editar campanha

### Passos

1. Abrir campanha existente.
2. Alterar contexto ou prompt.
3. Salvar.
4. Gerar mensagem em um lead.

### Resultado esperado

* [ ] Alterações persistem.
* [ ] Nova geração usa dados atualizados.
* [ ] Mensagens antigas permanecem no histórico.

---

## 11.4 Campanha com etapa gatilho

### Passos

1. Criar campanha ativa.
2. Selecionar `Lead Mapeado` como etapa gatilho.
3. Salvar.

### Resultado esperado

* [ ] Campanha fica vinculada à etapa.
* [ ] Gatilho aparece na listagem ou detalhe da campanha.

---

## 12. Testes de geração de mensagens com IA

## 12.1 Gerar mensagens manualmente

### Pré-condição

Ter um lead e uma campanha ativa.

### Passos

1. Abrir detalhe do lead.
2. Selecionar campanha ativa.
3. Clicar em gerar mensagens.

### Resultado esperado

* [ ] Loading aparece durante geração.
* [ ] Edge Function `generate-messages` é chamada.
* [ ] 3 mensagens são retornadas.
* [ ] Mensagens são exibidas na tela.
* [ ] Mensagens são salvas em `generated_messages`.
* [ ] Atividade `message_generated` é registrada.

---

## 12.2 Mensagens usam dados do lead

### Passos

1. Criar lead com nome, empresa, cargo e campo personalizado.
2. Gerar mensagens.

### Resultado esperado

* [ ] Mensagens usam dados disponíveis do lead.
* [ ] Mensagens não inventam dados ausentes.
* [ ] Campos personalizados aparecem refletidos quando relevantes.

---

## 12.3 Regenerar mensagens

### Passos

1. Gerar mensagens uma vez.
2. Clicar em regenerar.

### Resultado esperado

* [ ] Novas mensagens são geradas.
* [ ] Mensagens anteriores permanecem no histórico.
* [ ] Mensagens mais recentes ficam identificáveis.

---

## 12.4 Falha da IA

### Cenário

Simular API key inválida ou indisponibilidade temporária.

### Resultado esperado

* [ ] Sistema exibe erro amigável.
* [ ] Aplicação não quebra.
* [ ] Nenhuma mensagem inválida é salva.
* [ ] Erro pode ser registrado quando aplicável.

---

## 12.5 Retorno inválido da IA

### Cenário

LLM retorna texto fora do JSON esperado.

### Resultado esperado

* [ ] Edge Function rejeita resposta inválida.
* [ ] Sistema exibe erro amigável.
* [ ] Nenhuma mensagem inválida é salva.

---

## 13. Testes de copiar mensagem

## 13.1 Copiar mensagem gerada

### Passos

1. Gerar mensagens.
2. Clicar em copiar em uma delas.
3. Colar em um bloco de notas.

### Resultado esperado

* [ ] Texto copiado corresponde à mensagem.
* [ ] Interface mostra feedback de sucesso.
* [ ] Se status `copied` for implementado, mensagem é atualizada.

---

## 14. Testes de envio simulado

## 14.1 Enviar mensagem simulada

### Passos

1. Gerar mensagens para um lead.
2. Clicar em enviar em uma mensagem.

### Resultado esperado

* [ ] Edge Function `send-message-simulated` é chamada.
* [ ] Mensagem recebe status `sent`.
* [ ] Campo `sent_at` é preenchido.
* [ ] Lead é movido para **Tentando Contato**.
* [ ] Atividade `message_sent` é registrada.
* [ ] Atividade `stage_changed` é registrada.

---

## 14.2 Enviar mensagem já enviada

### Passos

1. Enviar uma mensagem.
2. Tentar enviar a mesma mensagem novamente.

### Resultado esperado

* [ ] Sistema bloqueia reenvio.
* [ ] Mensagem de erro amigável aparece.
* [ ] Não duplica atividade indevidamente.

---

## 15. Testes de geração automática por etapa gatilho

## 15.1 Gatilho ao mover lead

### Pré-condição

Criar campanha ativa com etapa gatilho `Lead Mapeado`.

### Passos

1. Criar lead na etapa `Base`.
2. Mover lead para `Lead Mapeado`.
3. Abrir detalhe do lead.

### Resultado esperado

* [ ] Lead é movido para `Lead Mapeado`.
* [ ] Sistema identifica campanha gatilho.
* [ ] Mensagens são geradas automaticamente.
* [ ] Mensagens ficam associadas ao lead.
* [ ] `generation_type` é `trigger`.
* [ ] Histórico registra geração automática.

---

## 15.2 Gatilho ao criar lead direto na etapa

### Pré-condição

Campanha ativa com etapa gatilho `Lead Mapeado`.

### Passos

1. Criar lead diretamente na etapa `Lead Mapeado`.
2. Abrir detalhe do lead.

### Resultado esperado

* [ ] Lead é criado.
* [ ] Sistema dispara geração automática.
* [ ] Mensagens aparecem no detalhe do lead.
* [ ] Falha da IA não impede criação do lead.

---

## 15.3 Falha parcial em múltiplas campanhas

### Pré-condição

Mais de uma campanha ativa vinculada à mesma etapa.

### Resultado esperado

* [ ] Sistema tenta gerar para todas as campanhas.
* [ ] Falha em uma campanha não impede as demais.
* [ ] Falhas são registradas como `auto_generation_failed`.

---

## 16. Testes de histórico

## 16.1 Histórico de atividades

### Resultado esperado

O detalhe do lead mostra eventos como:

* [ ] Lead criado.
* [ ] Lead editado.
* [ ] Lead movido entre etapas.
* [ ] Mensagem gerada.
* [ ] Mensagem enviada.
* [ ] Falha de geração automática, se houver.

---

## 16.2 Histórico de mensagens

### Resultado esperado

O detalhe do lead mostra:

* [ ] Mensagens geradas manualmente.
* [ ] Mensagens geradas por gatilho.
* [ ] Campanha associada.
* [ ] Status da mensagem.
* [ ] Data de criação.
* [ ] Data de envio, se houver.

---

## 17. Testes de dashboard

## 17.1 Métricas básicas

### Resultado esperado

Dashboard mostra:

* [ ] Total de leads.
* [ ] Leads por etapa.
* [ ] Total de campanhas ativas.
* [ ] Total de mensagens geradas.
* [ ] Total de mensagens enviadas.

---

## 17.2 Métricas por workspace

### Cenário

Usuário A e Usuário B têm dados diferentes.

### Resultado esperado

* [ ] Dashboard do Usuário A mostra apenas dados do Workspace A.
* [ ] Dashboard do Usuário B mostra apenas dados do Workspace B.
* [ ] Números não misturam workspaces.

---

## 18. Testes de busca e filtros

## 18.1 Buscar lead por nome

### Resultado esperado

* [ ] Busca retorna lead correto.
* [ ] Leads não relacionados desaparecem ou ficam filtrados.
* [ ] Estado vazio aparece quando não há resultado.

---

## 18.2 Buscar lead por empresa

### Resultado esperado

* [ ] Busca por empresa retorna leads corretos.

---

## 18.3 Filtrar por etapa

### Resultado esperado

* [ ] Filtro mostra apenas leads da etapa selecionada.

---

## 18.4 Filtrar por responsável

### Resultado esperado

* [ ] Filtro mostra apenas leads do responsável selecionado.
* [ ] Leads sem responsável são tratados corretamente.

---

## 19. Testes de UX

## 19.1 Loading states

Confirmar loading em:

* [ ] Login/cadastro.
* [ ] Criação de workspace.
* [ ] Carregamento do dashboard.
* [ ] Carregamento do Kanban.
* [ ] Criação de lead.
* [ ] Geração de mensagens com IA.
* [ ] Envio simulado.

---

## 19.2 Empty states

Confirmar estado vazio em:

* [ ] Dashboard sem leads.
* [ ] Kanban sem leads.
* [ ] Campanhas sem campanhas.
* [ ] Lead sem mensagens geradas.
* [ ] Lead sem atividades.
* [ ] Campos personalizados sem campos.

---

## 19.3 Mensagens de erro amigáveis

Confirmar erros amigáveis para:

* [ ] Login inválido.
* [ ] Campo obrigatório não preenchido.
* [ ] Falha ao mover lead.
* [ ] Falha na IA.
* [ ] Campanha inativa.
* [ ] Acesso negado.

---

## 19.4 Responsividade básica

Testar em:

* [ ] Desktop.
* [ ] Tablet ou largura intermediária.
* [ ] Mobile básico.

Resultado esperado:

* [ ] Layout não quebra completamente.
* [ ] Ações principais continuam acessíveis.

---

## 20. Testes de Edge Functions

## 20.1 `generate-messages`

Validar:

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário sem acesso ao workspace.
* [ ] Bloqueia campanha inativa.
* [ ] Busca lead corretamente.
* [ ] Busca campanha corretamente.
* [ ] Busca campos personalizados.
* [ ] Chama LLM.
* [ ] Salva 3 mensagens.
* [ ] Retorna JSON esperado.

---

## 20.2 `move-lead-stage`

Validar:

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário sem acesso ao workspace.
* [ ] Bloqueia etapa de outro workspace.
* [ ] Valida campos padrão obrigatórios.
* [ ] Valida campos personalizados obrigatórios.
* [ ] Retorna `missingFields` quando necessário.
* [ ] Move lead quando válido.
* [ ] Registra atividade.

---

## 20.3 `send-message-simulated`

Validar:

* [ ] Bloqueia usuário não autenticado.
* [ ] Bloqueia usuário sem acesso ao workspace.
* [ ] Bloqueia mensagem já enviada.
* [ ] Marca mensagem como enviada.
* [ ] Move lead para **Tentando Contato**.
* [ ] Registra atividades.

---

## 20.4 `trigger-generate-messages`

Validar:

* [ ] Busca campanhas ativas da etapa.
* [ ] Gera mensagens por campanha.
* [ ] Salva mensagens com `generation_type = trigger`.
* [ ] Registra atividades.
* [ ] Registra falhas sem quebrar fluxo.

---

## 21. Testes de deploy

## 21.1 Deploy na Vercel

### Resultado esperado

* [ ] Aplicação abre no link público.
* [ ] Rotas carregam corretamente.
* [ ] Variáveis públicas estão configuradas.
* [ ] Login funciona em produção.
* [ ] Cadastro funciona em produção.

---

## 21.2 Supabase em produção

### Resultado esperado

* [ ] Migrations aplicadas.
* [ ] RLS ativo.
* [ ] Edge Functions publicadas.
* [ ] Secrets configurados.
* [ ] LLM funciona em produção.

---

## 21.3 Fluxo completo em produção

Testar no link publicado:

* [ ] Criar conta.
* [ ] Criar workspace.
* [ ] Criar lead.
* [ ] Criar campanha.
* [ ] Gerar mensagens.
* [ ] Enviar mensagem simulada.
* [ ] Ver lead em **Tentando Contato**.
* [ ] Ver histórico.
* [ ] Ver dashboard atualizado.

---

## 22. Testes de documentação

## 22.1 README

Confirmar que o README contém:

* [ ] Descrição do projeto.
* [ ] Link do deploy.
* [ ] Link do vídeo, quando existir.
* [ ] Tecnologias utilizadas.
* [ ] Como rodar localmente.
* [ ] Variáveis de ambiente.
* [ ] Como aplicar migrations.
* [ ] Como publicar Edge Functions.
* [ ] Decisões técnicas.
* [ ] Arquitetura.
* [ ] Banco de dados.
* [ ] RLS.
* [ ] Integração com IA.
* [ ] Funcionalidades implementadas.
* [ ] Uso de IA no desenvolvimento.
* [ ] Desafios encontrados.

---

## 22.2 Checklists do README

### Regra

O checklist do README deve refletir a realidade.

Resultado esperado:

* [ ] Itens implementados estão marcados.
* [ ] Itens não implementados permanecem desmarcados.
* [ ] Não há promessa falsa.

---

## 22.3 Documentos técnicos

Confirmar existência de:

* [ ] `docs/PRD.md`.
* [ ] `docs/TASKS.md`.
* [ ] `docs/DATABASE.md`.
* [ ] `docs/EDGE_FUNCTIONS.md`.
* [ ] `docs/ARCHITECTURE.md`.
* [ ] `docs/QA_CHECKLIST.md`.

---

## 23. Testes de consistência de dados

## 23.1 IDs do mesmo workspace

Validar que operações não aceitam mistura de IDs entre workspaces.

Cenários:

* [ ] Lead do Workspace A com etapa do Workspace B.
* [ ] Campo personalizado do Workspace A em lead do Workspace B.
* [ ] Campanha do Workspace A em lead do Workspace B.
* [ ] Mensagem do Workspace A enviada por usuário do Workspace B.

Resultado esperado:

* [ ] Operações são bloqueadas.
* [ ] Erro é tratado.
* [ ] Nenhum dado inconsistente é salvo.

---

## 23.2 Exclusões e cascatas

Se houver exclusão implementada, validar:

* [ ] Excluir lead remove valores personalizados associados.
* [ ] Excluir lead remove ou preserva mensagens conforme decisão do projeto.
* [ ] Excluir workspace remove dados do workspace.
* [ ] Exclusão não afeta outro workspace.

Se exclusão não estiver implementada no MVP:

* [ ] README não promete exclusão.
* [ ] UI não exibe ação quebrada de deletar.

---

## 24. Testes de regressão antes de enviar

Executar na ordem:

* [ ] Rodar lint.
* [ ] Rodar typecheck.
* [ ] Rodar build local.
* [ ] Testar cadastro.
* [ ] Testar login.
* [ ] Testar workspace.
* [ ] Testar criação de lead.
* [ ] Testar Kanban.
* [ ] Testar campos obrigatórios.
* [ ] Testar campanhas.
* [ ] Testar IA.
* [ ] Testar envio simulado.
* [ ] Testar dashboard.
* [ ] Testar isolamento por workspace.
* [ ] Testar deploy.

Comandos sugeridos:

```bash
npm run lint
npm run typecheck
npm run build
```

Se algum script não existir, criar ou ajustar o README para não mencionar comando inexistente.

---

## 25. Critérios finais de aprovação interna

O projeto só deve ser enviado se:

* [ ] Fluxo principal funciona em produção.
* [ ] Cadastro e login funcionam.
* [ ] Workspace cria etapas padrão.
* [ ] Leads aparecem no Kanban.
* [ ] Kanban move lead corretamente.
* [ ] Campos obrigatórios bloqueiam movimento inválido.
* [ ] Campanhas são criadas.
* [ ] IA gera mensagens.
* [ ] Envio simulado move lead para **Tentando Contato**.
* [ ] Histórico mostra ações principais.
* [ ] Dashboard mostra métricas reais.
* [ ] RLS foi testado com dois usuários.
* [ ] Nenhuma chave sensível está no frontend.
* [ ] README está completo.
* [ ] Link da Vercel funciona.
* [ ] Repositório GitHub está atualizado.

---

## 26. Matriz de severidade de bugs

## Crítico

Impede envio da prova ou quebra fluxo obrigatório.

Exemplos:

* Login não funciona.
* Workspace não é criado.
* Kanban não carrega.
* IA não gera mensagens.
* Envio simulado não move lead.
* Dados vazam entre workspaces.
* Chave sensível exposta.

Ação:

* [ ] Corrigir antes de enviar.

---

## Alto

Não impede todo o sistema, mas compromete requisito importante.

Exemplos:

* Campos obrigatórios não bloqueiam movimentação.
* Histórico não registra ações.
* Campanha inativa aparece para geração.
* Dashboard mostra números errados.

Ação:

* [ ] Corrigir antes de enviar, se possível.
* [ ] Se não corrigir, documentar claramente.

---

## Médio

Afeta usabilidade ou consistência menor.

Exemplos:

* Loading ausente.
* Toast não aparece.
* Filtro com comportamento estranho.
* Layout quebrado em mobile.

Ação:

* [ ] Corrigir se houver tempo.

---

## Baixo

Polimento visual ou melhoria opcional.

Exemplos:

* Espaçamento visual.
* Texto de botão melhorável.
* Empty state simples demais.

Ação:

* [ ] Não bloquear entrega.

---

## 27. Checklist para gravação futura do vídeo

Mesmo sem gravar agora, antes do vídeo confirmar:

* [ ] Dados de demonstração criados.
* [ ] Campanha pronta com contexto bom.
* [ ] Lead com dados suficientes.
* [ ] IA testada antes da gravação.
* [ ] Envio simulado testado.
* [ ] Dashboard com números visíveis.
* [ ] Histórico com eventos suficientes.
* [ ] Nenhum dado sensível aparece na tela.
* [ ] README com links finais.

---

## 28. Resultado esperado final

Ao final do QA, deve ser possível demonstrar sem improviso:

```text
1. Criar conta.
2. Criar workspace.
3. Ver funil padrão.
4. Criar lead.
5. Mover lead no Kanban.
6. Bloquear movimento por campo obrigatório.
7. Criar campanha.
8. Gerar mensagens com IA.
9. Copiar ou enviar mensagem.
10. Ver lead em Tentando Contato.
11. Ver histórico.
12. Ver dashboard.
13. Explicar RLS, workspace e Edge Functions.
```

Se esse fluxo estiver sólido, o projeto está pronto para avaliação.
