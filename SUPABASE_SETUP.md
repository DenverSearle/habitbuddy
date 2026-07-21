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

Create the following tables in Supabase, or run [`supabase/migrations/0001_add_user_auth.sql`](supabase/migrations/0001_add_user_auth.sql) against an existing pre-auth database (note: that migration truncates both tables first):

```sql
create table event_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null,
  color text not null,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now()
);

create table log_entries (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid not null references event_types(id) on delete cascade,
  date date not null,
  score int not null check (score between 1 and 10),
  note text,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  unique (event_type_id, date)
);
```

## Authentication

Sign-in is Google-only via Supabase Auth. To enable it:

1. In the Supabase dashboard, go to **Authentication → Providers → Google** and enable it. You'll need a Google Cloud OAuth 2.0 Client ID/Secret (from Google Cloud Console) — register Supabase's callback URL (`https://sllhqmvoxwuobijgerjz.supabase.co/auth/v1/callback`) as an authorized redirect URI there.
2. In **Authentication → URL Configuration**, set the Site URL and add Redirect URLs for every origin the app runs from (e.g. `http://localhost:5173` for local dev, plus your production URL). `signInWithOAuth`'s `redirectTo` must match an allow-listed URL or the redirect fails.

## Row Level Security

Tables are scoped per user; only the owning, authenticated user can read or write their own rows:

```sql
alter table event_types enable row level security;
alter table log_entries enable row level security;

create policy "Users manage their own event_types"
  on event_types for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own log_entries"
  on log_entries for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Notes about the current implementation

- `upsertLogEntry` uses `.upsert(..., { onConflict: 'event_type_id,date' })`, so editing a score or note for the same day updates the existing row instead of creating duplicates.
- The local storage repository remains available for offline or no-backend testing. To switch back to it, change the export in `src/data/index.ts`.
- `SupabaseRepository` injects `user_id` from the authenticated session on `createEventType` and `upsertLogEntry`. Reads (`getEventTypes`, `getLogEntries`) and other writes rely entirely on RLS to scope rows to the signed-in user — there's no client-side `user_id` filtering.
