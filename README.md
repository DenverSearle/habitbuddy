# HabitBuddy

HabitBuddy is a lightweight habit and activity tracker built with React, TypeScript, Vite, Tailwind CSS, and Supabase. The app lets you create reusable event types, then log scores and notes for any day in a day, week, or month calendar view.

## Current features

- Google sign-in required; each user's event types and log entries are private to their account
- Day, week, and month calendar navigation
- Quick add and edit flows for daily entries
- Detail view for existing entries with remove support
- Event type management with custom icons and colors
- Light/dark theme switching
- Supabase-backed persistence with a local fallback repository still available in the codebase

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Supabase JS client
- date-fns and lucide-react

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file with your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   Then fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Apply the schema and enable Google sign-in — see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the migration SQL and the Google OAuth provider setup steps.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Available scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — compile TypeScript and build the production bundle
- `npm run lint` — run the Oxlint checks
- `npm run preview` — preview the production build locally

## Project structure

- `src/App.tsx` — top-level app shell and screen switching
- `src/components/calendar` — day, week, month calendar views and modal interactions
- `src/components/eventTypes` — event type creation and editing UI
- `src/components/quickAdd` and `src/components/logDetail` — entry logging and detail flows
- `src/data` — repository abstraction plus Supabase and local storage implementations
- `src/hooks/useTheme.ts` — persisted light/dark mode state
- `src/hooks/useAuth.tsx` — auth context/provider around Supabase Auth (session, sign-in, sign-out)
- `src/components/auth` — login screen shown to signed-out users

## Data layer

The app uses a repository abstraction in `src/data/repository.ts`. The active implementation is `SupabaseRepository`, which is wired in `src/data/index.ts`. A `LocalStorageRepository` remains available as a fallback if you need to switch away from Supabase.

## Authentication

Sign-in is Google-only, via Supabase Auth (`useAuth` in `src/hooks/useAuth.tsx`). `App.tsx` renders the `LoginScreen` for signed-out visitors and gates the calendar/event-type UI behind an active session. Every `event_types`/`log_entries` row is scoped to the signed-in user, both by `SupabaseRepository` injecting `user_id` on writes and by row-level security policies enforcing `auth.uid() = user_id` on the database side. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for enabling the Google provider and applying the schema/RLS migration.
