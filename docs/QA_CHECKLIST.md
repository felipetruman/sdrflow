# QA_CHECKLIST | SDRFlow AI

## 1. Objetivo

Validar o fluxo principal do SDRFlow AI antes da entrega da prova técnica.

```text
Cadastro -> Workspace -> Lead -> Kanban -> Campanha -> Geração IA -> Envio simulado -> Dashboard
```

Também cobre segurança, RLS, isolamento por workspace, Edge Functions, UX básica e deploy.

---

## 2. Regras de QA

* [ ] Testar em ambiente local.
* [ ] Testar em ambiente publicado na Vercel.
* [ ] Testar com pelo menos dois usuários diferentes.
* [ ] Testar com pelo menos dois workspaces diferentes.
* [ ] Testar fluxo feliz.
* [ ] Testar erros esperados.
* [x] Confirmar que nenhuma chave sensível está exposta no frontend.
* [x] Confirmar que o README reflete o que realmente foi implementado.

**Notas:** o README e o `.env.example` foram ajustados para remover chaves sensíveis do frontend.

---

## 3. Dados mínimos para teste

* [ ] Usuário A.
* [ ] Usuário B.
* [ ] Workspace A.
* [ ] Workspace B.
* [x] 7 etapas padrão no Workspace A.
* [x] 7 etapas padrão no Workspace B.
* [ ] 3 leads no Workspace A.
* [ ] 2 leads no Workspace B.
* [ ] 2 campanhas no Workspace A.
* [ ] 1 campanha no Workspace B.
* [ ] 2 campos personalizados no Workspace A.
* [ ] 1 regra de campo obrigatório por etapa.

---

## 4. Testes de autenticação

### 4.1 Cadastro

* [ ] Conta é criada.
* [ ] Usuário é autenticado.
* [ ] Usuário é redirecionado para onboarding de workspace ou dashboard.
* [ ] Nenhum erro inesperado aparece.

### 4.2 Login válido

* [ ] Login é realizado.
* [ ] Sessão é criada.
* [ ] Usuário acessa área interna.
* [ ] Usuário não volta para login ao recarregar a página.

### 4.3 Login inválido

* [ ] Login é bloqueado.
* [ ] Mensagem de erro aparece.
* [ ] Usuário permanece na tela de login.
* [ ] Nenhuma informação sensível é exibida.

### 4.4 Logout

* [ ] Sessão é encerrada.
* [ ] Usuário é redirecionado para login.
* [ ] Rotas internas deixam de ser acessíveis.

### 4.5 Proteção de rotas

* [ ] Usuário é redirecionado para login.
* [ ] Nenhuma tela interna é exibida.
* [ ] Nenhum dado é carregado.

---

## 5. Testes de workspace

### 5.1 Criação de workspace

* [ ] Workspace é criado.
* [ ] Usuário vira membro admin.
* [x] Etapas padrão são criadas automaticamente.
* [ ] Usuário é redirecionado para dashboard.
* [ ] Nome do workspace aparece no layout.

### 5.2 Criação das etapas padrão

As seguintes etapas existem, em ordem:

* [✅] Base.
* [✅] Lead Mapeado.
* [✅] Tentando Contato.
* [✅] Conexão Iniciada.
* [✅] Desqualificado.
* [✅] Qualificado.
* [✅] Reunião Agendada.

### 5.3 Isolamento visual por workspace

* [ ] Usuário B não vê leads do Usuário A.
* [ ] Usuário B não vê campanhas do Usuário A.
* [ ] Usuário B não vê campos personalizados do Usuário A.
* [ ] Usuário B não vê mensagens do Usuário A.

---

## 6. Testes de RLS e segurança

### 6.1 RLS ativo

Confirmar RLS ativo em:

* [x] `workspaces`
* [x] `workspace_members`
* [x] `funnel_stages`
* [x] `leads`
* [x] `custom_fields`
* [x] `lead_custom_values`
* [x] `stage_required_fields`
* [x] `campaigns`
* [x] `generated_messages`
* [x] `lead_activities`

### 6.2 Usuário sem membership não acessa dados

* [ ] Usuário não consegue ler lead fora do workspace.
* [ ] Usuário não consegue mover lead fora do workspace.
* [ ] Usuário não consegue gerar mensagens fora do workspace.

### 6.3 Edge Functions

* [x] `generate-messages` valida token de autenticação.
* [x] `move-lead-stage` valida token de autenticação.
* [x] `send-message-simulated` valida token de autenticação.
* [x] As funções checam membership no workspace antes de processar.

### 6.4 `.env.example`

* [x] Contém apenas variáveis públicas/anon necessárias no frontend.
* [x] Não inclui `SUPABASE_SERVICE_ROLE_KEY`.
* [x] Não inclui `LLM_API_KEY`.

---

## 7. Testes de leads

* [ ] Criar lead.
* [ ] Editar lead.
* [ ] Excluir lead.
* [ ] Listar leads do workspace.
* [x] Drag-and-drop no Kanban move o lead entre etapas.

---

## 8. Testes de campos personalizados

* [ ] Criar campo personalizado.
* [ ] Editar campo personalizado.
* [ ] Excluir campo personalizado.
* [ ] Salvar valores por lead.

---

## 9. Testes de campanhas e IA

* [ ] Criar campanha.
* [ ] Editar campanha.
* [ ] Gerar mensagens com IA.
* [x] Fallback funciona quando a chave de IA não está configurada.
* [x] Mensagens são salvas em `generated_messages`.

---

## 10. Testes de envio simulado

* [ ] Simular envio de mensagem.
* [x] Lead pode ser movido automaticamente para `Tentando Contato`.
* [x] Histórico registra o envio.

---

## 11. Testes de dashboard

* [x] Total de leads aparece.
* [x] Total de campanhas ativas aparece.
* [x] Total de mensagens geradas aparece.
* [x] Total de mensagens enviadas aparece.

---

## 12. Pendências / riscos conhecidos

* [ ] Validação completa em ambiente Vercel ainda precisa ser executada.
* [ ] Alguns testes manuais de fluxo ponta a ponta ainda precisam de evidência.
* [ ] O provedor de IA depende de configuração de segredo no Supabase.
