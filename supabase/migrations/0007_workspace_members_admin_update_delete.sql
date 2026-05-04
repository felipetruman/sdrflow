-- 0007_workspace_members_admin_update_delete.sql
-- Add UPDATE and DELETE policies for workspace_members scoped to admin role.
-- Previously only SELECT and INSERT policies existed, meaning admins could not
-- remove members or change roles through the app (RLS would block it).

CREATE POLICY workspace_members_update ON workspace_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'admin'
    )
  );

CREATE POLICY workspace_members_delete ON workspace_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'admin'
    )
  );
