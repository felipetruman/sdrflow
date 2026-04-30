## 8. Arquitetura do banco de dados

A modelagem do banco foi desenhada para suportar o CRM SDR com isolamento por workspace, campos personalizados, Kanban, campanhas, geração de mensagens com IA e histórico de atividades.

A decisão principal é: **todas as entidades operacionais pertencem a um workspace**.

Isso facilita:

1. Isolamento de dados.
2. Políticas de RLS.
3. Organização por empresa/equipe.
4. Evolução futura para multi-workspace.

---

# 8.1 Tabelas principais

## 8.1.1 `workspaces`

Representa uma empresa, equipe ou ambiente de trabalho.

### Campos principais

* `id`
* `name`
* `created_by`
* `created_at`
* `updated_at`

### Por que existe

A prova exige que cada usuário possa criar um workspace e que os dados sejam isolados por workspace. 

### Decisão técnica

O workspace é a entidade raiz do sistema. Tudo que for dado operacional aponta para ele.

---

## 8.1.2 `workspace_members`

Representa o vínculo entre usuários e workspaces.

### Campos principais

* `id`
* `workspace_id`
* `user_id`
* `role`
* `created_at`

### Roles

* `admin`
* `member`

### Por que existe

Permite saber quais usuários têm acesso a cada workspace.

Mesmo que no MVP o usuário tenha apenas um workspace, essa tabela deixa a estrutura preparada para múltiplos membros e futuras permissões.

### Decisão técnica

Não colocamos apenas `user_id` direto em `workspaces`, porque isso limitaria o sistema a um único dono. Com `workspace_members`, a aplicação já nasce pronta para equipe.

---

## 8.1.3 `funnel_stages`

Representa as etapas do funil SDR.

### Campos principais

* `id`
* `workspace_id`
* `name`
* `position`
* `color`
* `is_default`
* `created_at`
* `updated_at`

### Etapas padrão

1. Base
2. Lead Mapeado
3. Tentando Contato
4. Conexão Iniciada
5. Desqualificado
6. Qualificado
7. Reunião Agendada

### Por que existe

A prova exige que os leads sejam visualizados em Kanban organizados por etapas do funil. 

### Decisão técnica

As etapas ficam no banco, não hardcoded no frontend.

Isso permite:

1. Ordenação.
2. Configuração de campos obrigatórios por etapa.
3. Etapa gatilho para campanhas.
4. Evolução futura para edição de funil.

---

## 8.1.4 `leads`

Representa os leads cadastrados no CRM.

### Campos principais

* `id`
* `workspace_id`
* `stage_id`
* `owner_id`
* `name`
* `email`
* `phone`
* `company`
* `job_title`
* `lead_source`
* `notes`
* `created_by`
* `created_at`
* `updated_at`

### Por que existe

É a entidade central do CRM.

A prova exige cadastro de leads com campos padrão, responsável opcional, visualização e edição de detalhes. 

### Decisão técnica

O lead possui `stage_id` para indicar em qual coluna do Kanban ele aparece.

O `owner_id` é opcional porque o requisito diz que o lead pode ou não ter responsável atribuído.

---

## 8.1.5 `custom_fields`

Define campos personalizados disponíveis para todos os leads de um workspace.

### Campos principais

* `id`
* `workspace_id`
* `name`
* `key`
* `field_type`
* `options`
* `required_by_default`
* `created_at`
* `updated_at`

### Tipos suportados no MVP

* `text`
* `number`
* `date`
* `boolean`
* `select`

### Por que existe

A prova exige que o usuário possa criar campos adicionais por workspace, e que esses campos estejam disponíveis para todos os leads do workspace. 

### Decisão técnica

Campos personalizados ficam em uma tabela própria, em vez de criar colunas dinamicamente no banco.

Isso evita migrations a cada novo campo e mantém o sistema flexível.

---

## 8.1.6 `lead_custom_values`

Armazena os valores dos campos personalizados para cada lead.

### Campos principais

* `id`
* `workspace_id`
* `lead_id`
* `custom_field_id`
* `value_text`
* `value_number`
* `value_boolean`
* `value_date`
* `created_at`
* `updated_at`

### Por que existe

A tabela separa a definição do campo do valor preenchido no lead.

### Decisão técnica

Usamos colunas separadas por tipo em vez de um único JSON genérico.

Vantagens:

1. Mais clareza.
2. Melhor validação.
3. Consultas futuras mais simples.
4. Facilita usar campos personalizados nas regras de etapa e na IA.

---

## 8.1.7 `stage_required_fields`

Define quais campos são obrigatórios para que um lead entre em uma etapa.

### Campos principais

* `id`
* `workspace_id`
* `stage_id`
* `field_type`
* `standard_field_key`
* `custom_field_id`
* `created_at`

### `field_type`

* `standard`
* `custom`

### Por que existe

A prova exige que o sistema permita configurar campos obrigatórios para entrada em determinadas etapas do funil, considerando campos padrão e personalizados. 

### Decisão técnica

A mesma tabela suporta campos padrão e campos personalizados.

Exemplo:

* Para exigir `cargo`, usamos `field_type = standard` e `standard_field_key = job_title`.
* Para exigir `faturamento anual`, usamos `field_type = custom` e `custom_field_id`.

---

## 8.1.8 `campaigns`

Representa campanhas de abordagem.

### Campos principais

* `id`
* `workspace_id`
* `name`
* `context`
* `generation_prompt`
* `status`
* `trigger_stage_id`
* `created_by`
* `created_at`
* `updated_at`

### Por que existe

A prova exige criação de campanhas com nome, contexto, prompt de geração e etapa gatilho como diferencial. 

### Decisão técnica

A campanha guarda dois blocos separados:

1. `context`

   Informações comerciais: oferta, produto, empresa, período, condições.

2. `generation_prompt`

   Instruções para a IA: tom de voz, persona, formato, tamanho, campos a considerar.

Essa separação deixa mais claro o que é informação de negócio e o que é instrução de geração.

---

## 8.1.9 `generated_messages`

Armazena mensagens geradas pela IA.

### Campos principais

* `id`
* `workspace_id`
* `lead_id`
* `campaign_id`
* `content`
* `variation_index`
* `generation_type`
* `status`
* `llm_provider`
* `llm_model`
* `created_by`
* `sent_at`
* `created_at`

### `generation_type`

* `manual`
* `trigger`

### `status`

* `generated`
* `copied`
* `sent`
* `failed`

### Por que existe

A prova exige visualizar, regenerar, copiar e enviar mensagens, além de manter mensagens associadas ao lead, especialmente na geração automática por etapa gatilho. 

### Decisão técnica

Cada variação gerada vira uma linha.

Isso facilita:

1. Histórico.
2. Marcar qual foi enviada.
3. Regenerar sem apagar versões anteriores.
4. Medir mensagens por campanha no dashboard.

---

## 8.1.10 `lead_activities`

Registra o histórico de ações no lead.

### Campos principais

* `id`
* `workspace_id`
* `lead_id`
* `user_id`
* `activity_type`
* `description`
* `metadata`
* `created_at`

### Atividades previstas

* `lead_created`
* `lead_updated`
* `stage_changed`
* `owner_changed`
* `message_generated`
* `message_copied`
* `message_sent`
* `auto_generation_failed`

### Por que existe

Histórico de atividades é diferencial, mas ajuda muito na avaliação porque mostra rastreabilidade e maturidade de produto.

### Decisão técnica

Usamos `metadata` em JSONB para registrar detalhes variáveis, como:

* etapa anterior;
* nova etapa;
* campanha usada;
* mensagem enviada;
* campos alterados.

---

# 8.2 Relacionamentos principais

## Workspace para membros

Um workspace pode ter muitos membros.

`workspaces.id -> workspace_members.workspace_id`

## Workspace para leads

Um workspace pode ter muitos leads.

`workspaces.id -> leads.workspace_id`

## Workspace para campanhas

Um workspace pode ter muitas campanhas.

`workspaces.id -> campaigns.workspace_id`

## Workspace para etapas

Um workspace pode ter muitas etapas de funil.

`workspaces.id -> funnel_stages.workspace_id`

## Lead para etapa

Um lead pertence a uma etapa.

`funnel_stages.id -> leads.stage_id`

## Lead para responsável

Um lead pode ter um responsável.

`workspace_members.user_id -> leads.owner_id`

## Lead para campos personalizados

Um lead pode ter muitos valores personalizados.

`leads.id -> lead_custom_values.lead_id`

## Campo personalizado para valores

Um campo personalizado pode aparecer em muitos leads.

`custom_fields.id -> lead_custom_values.custom_field_id`

## Campanha para mensagens

Uma campanha pode gerar muitas mensagens.

`campaigns.id -> generated_messages.campaign_id`

## Lead para mensagens

Um lead pode ter muitas mensagens geradas.

`leads.id -> generated_messages.lead_id`

## Lead para atividades

Um lead pode ter muitas atividades.

`leads.id -> lead_activities.lead_id`

---

# 8.3 Por que não usar tudo em JSONB

Poderíamos guardar leads e campos personalizados em JSONB, mas isso deixaria o projeto menos robusto.

## Motivos para evitar JSONB como estrutura principal

1. Dificulta validação por tipo.
2. Dificulta configurar campos obrigatórios.
3. Dificulta criar filtros.
4. Dificulta explicar o banco na avaliação.
5. Diminui clareza do RLS e dos relacionamentos.

## Onde JSONB faz sentido

Usaremos JSONB apenas em pontos específicos:

1. `custom_fields.options`

   Para opções de campo tipo select.

2. `lead_activities.metadata`

   Para registrar detalhes variáveis de cada ação.

Essa é uma decisão equilibrada: flexível onde precisa, relacional onde importa.

---

# 8.4 Estratégia de RLS

A regra central é:

> O usuário só pode acessar dados de workspaces em que ele é membro.

Exemplo conceitual:

```sql
exists (
  select 1
  from workspace_members wm
  where wm.workspace_id = table.workspace_id
  and wm.user_id = auth.uid()
)
```

## Aplicação por tabela

### `workspaces`

Usuário pode ler workspace se for membro.

### `workspace_members`

Usuário pode ler membros do workspace se também for membro.

### `leads`

Usuário pode ler, criar, editar e mover leads se for membro do workspace.

### `campaigns`

Usuário pode gerenciar campanhas se for membro do workspace.

### `generated_messages`

Usuário pode ver e manipular mensagens se for membro do workspace.

### `lead_activities`

Usuário pode ver histórico se for membro do workspace.

## Justificativa

RLS é importante porque não basta esconder dados no frontend. O controle precisa estar no banco.

Essa escolha também responde diretamente ao requisito de isolamento de dados por workspace. 

---

# 8.5 Decisão sobre campos obrigatórios por etapa

A validação de campos obrigatórios será feita antes de mover o lead.

## Fluxo

1. Usuário tenta mover lead para uma nova etapa.
2. Sistema busca os campos obrigatórios daquela etapa.
3. Sistema verifica campos padrão no lead.
4. Sistema verifica campos personalizados em `lead_custom_values`.
5. Se faltar algo, bloqueia a movimentação.
6. Se estiver completo, atualiza `stage_id`.
7. Registra atividade.
8. Verifica se existe campanha com etapa gatilho.

## Por que validar no app e não só no banco

A validação precisa retornar uma mensagem amigável dizendo quais campos estão faltando.

Exemplo:

> Para mover este lead para Lead Mapeado, preencha: Cargo, Telefone e Segmento.

Essa lógica é mais adequada na camada de aplicação, com suporte do banco para armazenar as regras.

---

# 8.6 Decisão sobre geração por etapa gatilho

A campanha pode ter uma etapa gatilho.

Quando o lead entra nessa etapa, o sistema gera mensagens automaticamente.

## Decisão do MVP

Permitir mais de uma campanha ativa com a mesma etapa gatilho.

## Por quê

1. O enunciado permite essa possibilidade.
2. Demonstra flexibilidade.
3. Evita regra artificial.
4. Permite testar múltiplas campanhas para a mesma etapa.

## Controle de risco

Se houver várias campanhas, o sistema gera uma rodada por campanha e salva separadamente em `generated_messages`.

No detalhe do lead, as mensagens aparecem agrupadas por campanha.

---

# 8.7 Como explicar o banco em entrevista

Use esta resposta:

> Modelei o banco em torno de workspaces porque o isolamento de dados era um requisito central. Cada entidade operacional carrega `workspace_id`, e o acesso é protegido por RLS. Separei campos personalizados em duas tabelas: uma para definição do campo e outra para valores por lead, porque isso permite flexibilidade sem perder estrutura relacional. As campanhas foram separadas das mensagens geradas para preservar histórico, permitir regeneração e rastrear qual campanha originou cada mensagem. Também criei histórico de atividades para deixar o fluxo auditável.

Próxima seção recomendada: **SQL inicial do schema e policies RLS**.
