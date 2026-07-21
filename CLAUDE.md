# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                        # install dependencies
npm run dev                        # start Vite dev server
npm run build                      # tsc -b type-check, then vite build
npm run preview                    # preview the production build locally
npm run lint                       # oxlint
npm test                           # vitest (watch mode)
npx vitest run                     # vitest, single run (e.g. for CI or a quick check)
npx vitest run src/utils/date.test.ts   # run a single test file
```

Tests live next to the code they cover (`*.test.ts`), not in a separate `__tests__` tree — e.g. `src/utils/date.test.ts`, `src/data/localStorageRepository.test.ts`.

### Local environment

The app requires a `.env.local` (gitignored) with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
See `SUPABASE_SETUP.md` for the current project's schema, RLS policies, and how to point the app at a different Supabase project.

## Architecture

### Data layer: swappable repository behind one interface

All persistence goes through the `Repository` interface in `src/data/repository.ts` (`getEventTypes`, `create/update/deleteEventType`, `getLogEntries`, `upsertLogEntry`, `deleteLogEntry`). There are two implementations:
- `src/data/supabaseRepository.ts` — the active one, wired up in `src/data/index.ts` (`export const repository = new SupabaseRepository()`).
- `src/data/localStorageRepository.ts` — a fully working offline/no-backend fallback. To switch back to it, change the single export in `src/data/index.ts`; no component code references either implementation directly.

Every component imports `repository` from `src/data`, never a concrete class. `upsertLogEntry` relies on a `(event_type_id, date)` uniqueness rule — enforced via manual lookup in the local storage version, and via Postgres `unique` constraint + `.upsert(..., { onConflict: ... })` in the Supabase version.

`src/types.ts` (`EventType`, `LogEntry`) mirrors the Supabase schema field-for-field (including `user_id` staying nullable, since there's no auth yet — see `SUPABASE_SETUP.md`).

### Screen flow

`src/App.tsx` owns top-level `screen` state (`'day' | 'week' | 'month' | 'manage'`) and the event-types list, and renders either `EventTypeManager` or `CalendarView`. There's no router — navigation is just this local state switch (`src/components/layout/NavBar.tsx` renders the tabs).

`CalendarView` (`src/components/calendar/CalendarView.tsx`) owns the current date and fetches log entries for whatever range the active view needs (single day / week / the padded month grid — see `getRange` in that file). It also owns the modal state that decides whether tapping a calendar cell opens `QuickAddModal` (no entry yet, or editing) or `LogDetailPopup` (entry exists, view-first). `DayView`, `WeekView`, and `MonthView` are presentation-only; `WeekView`/`MonthView` both delegate to the shared `DenseGrid` table layout, `DayView` has its own flex-wrap layout.

### Icon fill effect

`EventIcon` (`src/components/calendar/EventIcon.tsx`) renders each event type's Lucide icon twice — a grey outline copy, and a colored copy wrapped in a div whose `height` is a `score * 10`% with `overflow: hidden`, both absolutely positioned bottom-up inside a fixed-size wrapper. That's what produces the "glass filling up" effect; it's plain CSS, not an SVG clip-path or a icon-library feature, so don't look for the effect in the icon components themselves.

### Theming

`src/hooks/useTheme.ts` holds light/dark state (persisted to `localStorage`, defaults to `prefers-color-scheme`) and toggles a `dark` class on `document.documentElement`. Tailwind v4 is configured via the `@tailwindcss/vite` plugin with no `tailwind.config.js` — the `dark:` variant is enabled for class-based (not media-query) toggling via `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css`. If dark-mode styles aren't applying, check that variant declaration before assuming a config file is missing.
