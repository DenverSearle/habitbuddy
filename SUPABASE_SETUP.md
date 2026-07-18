# Supabase setup for HabitBuddy

HabitBuddy currently uses Supabase as its primary persistence layer. The app reads and writes event types and daily log entries through the repository abstraction in `src/data`, with the active implementation pointing at Supabase.

## Current configuration

- Project: `sllhqmvoxwuobijgerjz` (https://sllhqmvoxwuobijgerjz.supabase.co)
- Environment variables are expected in `.env.local`:
  ```env
  VITE_SUPABASE_URL=https://sllhqmvoxwuobijgerjz.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- `src/data/supabaseClient.ts` creates the client from those variables.
- `src/data/index.ts` exports `new SupabaseRepository()` as the active repository.
- `src/data/supabaseRepository.ts` implements the repository methods for creating, updating, deleting, and querying both event types and log entries.

## Database schema

Create the following tables in Supabase:

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

The current build does not yet include authentication, so the tables are configured with permissive RLS policies to keep the app working with the anonymous key:

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

## Notes about the current implementation

- `upsertLogEntry` uses `.upsert(..., { onConflict: 'event_type_id,date' })`, so editing a score or note for the same day updates the existing row instead of creating duplicates.
- The local storage repository remains available for offline or no-backend testing. To switch back to it, change the export in `src/data/index.ts`.
- Multi-user authentication is not implemented yet. When auth is added, queries should be scoped by `user_id` and the policies should be tightened to `auth.uid() = user_id`.
