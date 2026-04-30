-- 0002_seed_demo_data.sql
-- Dados de exemplo para demonstração (opcional)

-- Nota: Este seed deve ser executado manualmente após criar um workspace real via app
-- pois os IDs de workspace/user precisam ser válidos do ambiente.

-- Exemplo de como inserir dados de demo para um workspace existente:
-- Descomente e ajuste os UUIDs conforme necessário.

-- INSERT INTO leads (workspace_id, stage_id, name, email, phone, company, job_title, source, notes)
-- VALUES (
--   'workspace-uuid-aqui',
--   (SELECT id FROM funnel_stages WHERE workspace_id = 'workspace-uuid-aqui' AND name = 'Base' LIMIT 1),
--   'João Silva',
--   'joao@empresa.com',
--   '11999999999',
--   'Empresa Exemplo',
--   'Diretor Comercial',
--   'Indicação',
--   'Lead qualificado para demo'
-- );
