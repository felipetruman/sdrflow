-- Fix: generated_messages_update policy missing WITH CHECK clause
-- Without WITH CHECK, an authenticated user could update a generated_message
-- to point to a lead in a different workspace (cross-workspace reassignment attack).

DROP POLICY IF EXISTS generated_messages_update ON generated_messages;

CREATE POLICY generated_messages_update ON generated_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = generated_messages.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = generated_messages.lead_id
      AND is_workspace_member(l.workspace_id, auth.uid())
    )
  );
