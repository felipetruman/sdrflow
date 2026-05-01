-- 0002_schema_fixes.sql
-- Correções de schema para colunas e políticas ausentes

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS created_by uuid;

ALTER TABLE lead_activities
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE generated_messages
  ADD COLUMN IF NOT EXISTS variation_index integer DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_lead_activities_user_id
  ON lead_activities(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'generated_messages'
      AND policyname = 'generated_messages_delete'
  ) THEN
    CREATE POLICY generated_messages_delete ON generated_messages
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM leads l
          WHERE l.id = generated_messages.lead_id
          AND is_workspace_member(l.workspace_id, auth.uid())
        )
      );
  END IF;
END
$$;
