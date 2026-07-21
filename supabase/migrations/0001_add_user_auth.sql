-- Adds per-user data ownership for event_types and log_entries.
-- Run manually in the Supabase SQL Editor.
--
-- This wipes existing data: the current rows have no user_id set and predate
-- authentication, so there is nothing to backfill.

truncate table log_entries, event_types restart identity cascade;

-- log_entries gets its own user_id column so RLS can filter it directly,
-- without a join through event_types.
alter table log_entries
  add column user_id uuid not null references auth.users(id) on delete cascade default auth.uid();

-- event_types.user_id already existed as a bare nullable uuid; make it a
-- required, properly-referenced column now that every row must have an owner.
alter table event_types
  alter column user_id set not null,
  alter column user_id set default auth.uid();

alter table event_types
  add constraint event_types_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

drop policy if exists "Allow anon full access to event_types" on event_types;
drop policy if exists "Allow anon full access to log_entries" on log_entries;

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
