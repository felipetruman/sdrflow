# Roteiro de vídeo — SDRFlow AI

Duração alvo: **7 a 10 minutos**

## 1) Abertura — o que é o SDRFlow AI (1 min)

**Objetivo:** apresentar a proposta do produto de forma direta.

**Roteiro:**
- “O SDRFlow AI é um mini CRM para equipes de pré-vendas.”
- “Ele organiza leads, funil, campanhas e geração de mensagens com IA em um único fluxo.”
- “A ideia é reduzir trabalho manual e dar mais visibilidade para o time.”

## 2) Problema que resolve (1 min)

**Objetivo:** contextualizar a dor.

**Roteiro:**
- Leads espalhados em planilhas e ferramentas soltas.
- Etapas do funil sem padronização.
- Mensagens genéricas e pouco contexto de abordagem.
- Dificuldade para acompanhar métricas e evolução do time.

## 3) Arquitetura em 30s (30s)

**Objetivo:** mostrar a solução técnica de forma simples.

**Roteiro:**
- Frontend em Next.js.
- Dados e autenticação com Supabase.
- Multi-tenancy por workspace.
- RLS para isolamento de dados.
- Edge Functions para regras sensíveis e IA.

## 4) Demo do fluxo principal (3 a 4 min)

**Objetivo:** conduzir a demonstração prática.

**Sequência sugerida:**
1. Login.
2. Acessar o workspace.
3. Abrir o Kanban.
4. Criar um lead.
5. Configurar campanha.
6. Gerar mensagens.
7. Enviar mensagem.
8. Mostrar dashboard.

**Pontos de fala:**
- “Aqui o lead entra no fluxo de trabalho.”
- “No Kanban, eu consigo mover etapas visualmente.”
- “A campanha adiciona contexto para a IA.”
- “A geração acontece via Edge Function, não no frontend.”
- “O envio simulado ajuda na demonstração do fluxo completo.”
- “No dashboard, eu enxergo métricas e atividade do time.”

## 5) Diferenciais (1 a 2 min)

**Objetivo:** reforçar o que torna o projeto mais forte.

**Destaques:**
- **Modo demo:** permite apresentar o sistema mesmo com backend parcialmente configurado.
- **Multi-tenancy:** cada workspace tem seus próprios dados.
- **RLS:** segurança nativa no banco para isolamento por tenant.
- **Edge Functions:** regras críticas e IA fora do frontend.

## 6) Fechamento (30s)

**Objetivo:** encerrar com síntese.

**Roteiro:**
- “O SDRFlow AI centraliza operação, automação e visibilidade para pré-vendas.”
- “É uma base pronta para evoluir com mais automações e inteligência.”

## Checklist pré-gravação

- [ ] Verificar login funcionando.
- [ ] Confirmar dados de demo carregados.
- [ ] Abrir a página inicial e o workspace correto.
- [ ] Testar Kanban, criação de lead e campanha.
- [ ] Validar geração de mensagens.
- [ ] Conferir o dashboard com métricas visíveis.
- [ ] Deixar a resolução da tela ajustada para gravação.
- [ ] Fechar abas e notificações desnecessárias.
- [ ] Separar falas curtas para evitar pausas longas.
