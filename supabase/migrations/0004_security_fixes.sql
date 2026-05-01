-- 0004_security_fixes.sql
-- Security hardening: RLS policy corrections

-- C1: Remove open workspaces INSERT policy.
-- All workspace creation MUST go through create_workspace_with_defaults (SECURITY DEFINER),
-- which bypasses RLS. Direct client inserts are not allowed.
DROP POLICY IF EXISTS workspaces_insert ON workspaces;

-- M3: Restrict workspace_members INSERT to admins only.
-- Previously any workspace member could add new members.
DROP POLICY IF EXISTS workspace_members_insert ON workspace_members;
CREATE POLICY workspace_members_insert ON workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'admin'
    )
  );
