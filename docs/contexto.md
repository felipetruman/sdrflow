## 2. Contexto e Justificativa

### Contexto da prova

A prova pede o desenvolvimento de um **Mini CRM para equipes de Pré-Vendas SDR**, com funcionalidades de gestão de leads, organização em funil, criação de campanhas e geração de mensagens personalizadas usando IA. O sistema também precisa usar Supabase Auth, Supabase PostgreSQL e Supabase Edge Functions. 

A proposta do **SDRFlow AI** nasce exatamente desse cenário: um produto simples, funcional e focado no fluxo real de um SDR.

---

## 3. Por que construir um projeto novo

A decisão foi criar um projeto novo em vez de adaptar um CRM existente.

### Motivos

1. **A prova tem requisitos específicos**

   O sistema não é um CRM genérico. Ele precisa ser um CRM SDR com campanhas, geração de mensagens por IA, regras de etapa e workspace.

2. **Mais controle sobre arquitetura**

   Criando do zero, conseguimos modelar banco, RLS, Edge Functions e frontend exatamente para o enunciado.

3. **Menos risco de herdar complexidade**

   Um CRM existente pode ter entidades, regras e dependências que não ajudam no desafio.

4. **Mais fácil de explicar no vídeo**

   Cada decisão técnica fica intencional e defensável.

5. **Mais aderente à avaliação**

   O avaliador quer entender raciocínio, decisões e execução. Um projeto novo deixa isso mais claro.

---

## 4. Premissa principal do produto

A premissa central é:

> Um lead só deve receber uma abordagem realmente personalizada quando o sistema tiver contexto suficiente sobre ele e sobre a campanha.

Por isso, o produto combina três blocos:

1. **Organização comercial**

   Leads em um funil Kanban.

2. **Qualidade de dados**

   Campos personalizados e campos obrigatórios por etapa.

3. **Produtividade com IA**

   Geração de mensagens personalizadas a partir do contexto do lead e da campanha.

---

## 5. Decisões técnicas principais

### 5.1 Next.js no frontend

Usaremos **Next.js com TypeScript** porque permite criar uma aplicação moderna, organizada e fácil de publicar na Vercel.

Justificativa:

1. Boa estrutura de rotas.
2. Excelente integração com Vercel.
3. Forte suporte a TypeScript.
4. Bom ecossistema de componentes.
5. Facilita criar dashboard, Kanban, formulários e páginas protegidas.

---

### 5.2 Supabase como base da aplicação

O Supabase será usado para:

1. Autenticação.
2. Banco PostgreSQL.
3. Row Level Security.
4. Edge Functions.
5. Variáveis de ambiente seguras.

Justificativa:

O desafio exige Supabase Auth, PostgreSQL e Edge Functions. Usar Supabase como base reduz complexidade e mantém a arquitetura alinhada com o enunciado. 

---

### 5.3 Multi-tenancy por workspace

Todos os dados importantes pertencem a um `workspace_id`.

Isso inclui:

1. Leads.
2. Campanhas.
3. Etapas do funil.
4. Campos personalizados.
5. Mensagens geradas.
6. Atividades.
7. Regras de transição.

Justificativa:

Essa decisão permite isolar os dados de cada empresa/equipe e implementar segurança com RLS de forma consistente.

---

### 5.4 RLS como segurança real

O sistema não deve confiar apenas no frontend.

Mesmo que alguém tente manipular uma requisição, o Supabase deve bloquear acesso a dados de outro workspace.

Justificativa:

RLS mostra maturidade técnica e é um diferencial citado na prova. 

---

### 5.5 Edge Function para IA

A geração de mensagens será feita por uma **Supabase Edge Function**, não diretamente pelo frontend.

Justificativa:

1. Protege a chave da LLM.
2. Centraliza a montagem do prompt.
3. Permite validar permissões antes de gerar.
4. Permite salvar mensagens geradas no banco.
5. Permite registrar histórico e erros.

---

### 5.6 Kanban como interface principal

O Kanban será a tela principal de operação dos SDRs.

Justificativa:

O enunciado pede visualização em Kanban e movimentação de leads entre etapas. Além disso, é a forma mais natural para acompanhar um funil de pré-vendas. 

---

## 6. Escopo fechado do MVP

### O MVP precisa entregar

1. Cadastro e login.
2. Criação de workspace.
3. Funil SDR padrão.
4. Cadastro e edição de leads.
5. Campos personalizados.
6. Responsável pelo lead.
7. Kanban.
8. Movimento entre etapas.
9. Campos obrigatórios por etapa.
10. Criação de campanhas.
11. Geração de 2 a 3 mensagens com IA.
12. Regeneração de mensagens.
13. Copiar mensagem.
14. Envio simulado.
15. Movimento automático para **Tentando Contato**.
16. Dashboard básico.
17. Histórico de atividades.
18. Histórico de mensagens.
19. RLS.
20. Deploy.
21. README.
22. Vídeo.

### O MVP não precisa entregar agora

1. Integração real com WhatsApp.
2. Disparo real de mensagens.
3. Billing.
4. Convite avançado de equipe.
5. CRM completo de vendas.
6. Automação multicanal.
7. Pipeline comercial complexo.

Isso mantém o projeto forte, mas sem virar um monstro difícil de finalizar.

---

## 7. Frase para explicar se perguntarem “por que essa arquitetura?”

> Escolhi uma arquitetura centrada em workspace porque o principal risco de um CRM multiusuário é vazamento de dados entre equipes. Por isso, todas as entidades principais carregam `workspace_id`, e o Supabase RLS valida acesso diretamente no banco. A geração de IA fica em Edge Function para proteger a chave da LLM, controlar o prompt e salvar histórico das mensagens geradas. O frontend fica focado na experiência do SDR: Kanban, leads, campanhas e ações rápidas.

Próxima seção recomendada: **Arquitetura do banco de dados e explicação de cada tabela**.
