-- Add WITH CHECK to UPDATE policies to prevent cross-tenant workspace_id reassignment.
-- USING validates the pre-update row; WITH CHECK validates the post-update row.
-- Without WITH CHECK, an authenticated user could UPDATE workspace_id to another tenant's UUID.

ALTER POLICY leads_update ON leads
  USING (is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

ALTER POLICY custom_fields_update ON custom_fields
  USING (is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

ALTER POLICY funnel_stages_update ON funnel_stages
  USING (is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

ALTER POLICY campaigns_update ON campaigns
  USING (is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id, auth.uid()));

ALTER POLICY stage_required_fields_update ON stage_required_fields
  USING (is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id, auth.uid()));
