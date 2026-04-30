# Architecture | SDRFlow AI

## Overview

SDRFlow AI is a mini CRM for pre-sales (SDR) teams built with **Next.js 15**, **Supabase** (Auth + PostgreSQL + Edge Functions), and **Tailwind CSS**. It supports workspace-based multi-tenancy, Kanban lead management, custom fields, campaigns, and AI-powered message generation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Kanban | dnd-kit |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Backend Logic | Supabase Edge Functions (Deno) |
| AI Integration | OpenAI-compatible LLM API (called from Edge Functions only) |
| Deploy | Vercel (frontend), Supabase (DB + Edge Functions) |

## Data Flow

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js App    │────▶│  Supabase   │
│             │     │  (Client/Server)│     │  PostgreSQL │
└─────────────┘     └─────────────────┘     │  + RLS      │
       │                                     └─────────────┘
       │                                            ▲
       │                   ┌────────────────────────┘
       │                   │
       └──────────────────▶│ Supabase Edge Functions
                           │  - generate-messages
                           │  - send-message-simulated
                           │  - move-lead-stage
                           │  - trigger-generate-messages
                           └────────────────────────▶ LLM API
```

## Multi-Tenancy by Workspace

Every operational entity belongs to a `workspace_id`:

- `workspaces` — root tenant
- `workspace_members` — user-to-workspace links with roles (admin, member)
- `funnel_stages`, `leads`, `custom_fields`, `campaigns`, `generated_messages`, `lead_activities`

## Row Level Security (RLS)

All operational tables have RLS enabled. Policies verify workspace membership via:

```sql
is_workspace_member(p_workspace_id uuid, p_user_id uuid)
```

Even if a user crafts a direct Supabase client call, the database blocks cross-workspace access.

## Edge Functions

| Function | Responsibility |
|----------|---------------|
| `generate-messages` | Generates 3 personalized messages via LLM, saves to `generated_messages`, logs activity |
| `send-message-simulated` | Marks message as sent, moves lead to "Tentando Contato", logs activities |
| `move-lead-stage` | Moves lead between stages, validates required fields, triggers auto-generation |
| `trigger-generate-messages` | Auto-generates messages when lead enters a trigger stage |

All Edge Functions:
1. Validate Bearer token from `Authorization` header
2. Verify workspace membership
3. Never expose `LLM_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the frontend

## Security Rules

- `SUPABASE_SERVICE_ROLE_KEY` — Edge Functions only
- `LLM_API_KEY` — Edge Functions only
- Frontend uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.env.example` contains only public variables

## Folder Structure

```
app/
  (auth)/        — login, signup
  (app)/         — dashboard, kanban, leads, campaigns, settings
features/
  auth/          — signIn, signUp, signOut
  workspaces/    — workspace creation, guard
  leads/         — CRUD, detail, custom values
  kanban/        — board, columns, cards, DnD
  campaigns/     — CRUD, status, trigger stage
  custom-fields/ — field definitions, dynamic inputs
  funnel/        — required fields per stage
  ai-messages/   — generation panel, copy, simulated send
  activities/    — timeline, activity items
  dashboard/     — metrics, charts
lib/
  supabase/      — client, server, middleware
  validations/   — Zod schemas
  utils/         — helpers
  demo/          — mock data for offline/demo mode
types/
  database.ts    — TypeScript types for Supabase tables
  app.ts         — domain types
supabase/
  migrations/    — SQL migrations
  functions/     — Edge Functions
```

## Deployment Strategy

1. Apply Supabase migrations
2. Deploy Edge Functions with `supabase functions deploy`
3. Configure secrets in Supabase dashboard (`LLM_API_KEY`, etc.)
4. Connect GitHub repo to Vercel
5. Set public env vars in Vercel (`NEXT_PUBLIC_SUPABASE_URL`, etc.)

## Key Design Decisions

1. **Workspace-centric multi-tenancy** — isolates data at the database level
2. **Edge Functions for AI** — protects LLM keys and centralizes prompt logic
3. **RLS as the security layer** — prevents data leakage even if frontend is bypassed
4. **Feature-based folders** — keeps domain logic co-located and maintainable
5. **Demo mode** — allows UI testing without a live Supabase backend
