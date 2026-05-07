-- AI API keys per workspace, with priority-based fallback chain.
-- Storage is plaintext for now (TODO: pgsodium/Vault for encryption-at-rest).
-- RLS: only workspace admins can read/write. The Edge Function uses
-- service role to bypass RLS when fetching keys for generation.

create table if not exists public.ai_api_keys (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null check (provider in ('gemini', 'openai')),
  model text not null,
  key_value text not null,
  label text,
  priority integer not null default 100,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  last_validated_at timestamptz,
  last_status text check (last_status in ('ok', 'invalid', 'rate_limited', 'unknown') or last_status is null),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_api_keys_workspace_priority_idx
  on public.ai_api_keys (workspace_id, is_active, priority);

-- Only one primary key per workspace
create unique index if not exists ai_api_keys_workspace_primary_idx
  on public.ai_api_keys (workspace_id)
  where is_primary;

alter table public.ai_api_keys enable row level security;

-- Admins of the workspace can read
create policy "ai_api_keys_select_admin"
  on public.ai_api_keys for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = ai_api_keys.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- Admins can insert
create policy "ai_api_keys_insert_admin"
  on public.ai_api_keys for insert
  with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = ai_api_keys.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- Admins can update
create policy "ai_api_keys_update_admin"
  on public.ai_api_keys for update
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = ai_api_keys.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- Admins can delete
create policy "ai_api_keys_delete_admin"
  on public.ai_api_keys for delete
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = ai_api_keys.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- updated_at trigger
create or replace function public.set_updated_at_ai_api_keys()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_api_keys_set_updated_at on public.ai_api_keys;
create trigger ai_api_keys_set_updated_at
  before update on public.ai_api_keys
  for each row execute function public.set_updated_at_ai_api_keys();
