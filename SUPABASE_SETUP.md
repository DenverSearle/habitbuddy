# Phase 2 — Supabase (done)

The app now runs against a live Supabase project instead of `localStorage`. This doc
records what's live so it's easy to reproduce or extend later.

- Project: `sllhqmvoxwuobijgerjz` (https://sllhqmvoxwuobijgerjz.supabase.co)
- Credentials live in `.env.local` (gitignored, not committed):
  ```
  VITE_SUPABASE_URL=https://sllhqmvoxwuobijgerjz.supabase.co
  VITE_SUPABASE_ANON_KEY=...
  ```
- `src/data/supabaseClient.ts` creates the client from those env vars.
- `src/data/supabaseRepository.ts` implements the same `Repository` interface
  (`src/data/repository.ts`) that `LocalStorageRepository` used, so no component code
  changed. `src/data/index.ts` now exports `new SupabaseRepository()` as the active
  repository. `upsertLogEntry` uses `.upsert(..., { onConflict: 'event_type_id,date' })`,
  which relies on the unique constraint below to update in place instead of duplicating rows.
- `LocalStorageRepository` is still in the codebase as a working offline/no-backend
  fallback — swap the export in `src/data/index.ts` back to it if needed.

## Schema

```sql
create table event_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null,
  color text not null,
  user_id uuid null,
  created_at timestamptz not null default now()
);

create table log_entries (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references event_types(id) on delete cascade,
  date date not null,
  score int not null check (score between 1 and 10),
  note text,
  created_at timestamptz not null default now(),
  unique (event_type_id, date)
);
```

## Row Level Security

Supabase's linter flags any table with no RLS as publicly writable by anyone holding the
anon key. Since there's no auth yet (every row is already accessible regardless of who
asks), RLS is enabled with a fully permissive policy — this satisfies the linter now and
is the natural seam to tighten later:

```sql
alter table event_types enable row level security;
alter table log_entries enable row level security;

create policy "Allow anon full access to event_types"
  on event_types for all
  to anon
  using (true)
  with check (true);

create policy "Allow anon full access to log_entries"
  on log_entries for all
  to anon
  using (true)
  with check (true);
```

## Multi-user (not built yet)

When adding Supabase Auth sign-up/login: add a `user_id` filter to every query in
`supabaseRepository.ts`, set `user_id` from the authenticated session on insert, and
replace the permissive policies above with ones scoped to `auth.uid() = user_id`.
