# Supabase setup for Habit Buddy

Habit Buddy currently uses Supabase as its primary persistence layer. The app reads and writes event types and daily log entries through the repository abstraction in `src/data`, with the active implementation pointing at Supabase.

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
3. For the native Android/iOS apps (see below), also add `habitbuddy://auth-callback` to the Redirect URLs list — the native build uses a deep link instead of a browser redirect.

## Mobile app (Capacitor)

The web app is wrapped in [Capacitor](https://capacitorjs.com) to produce native Android/iOS builds — see `capacitor.config.ts` at the repo root. Key points:

- Capacitor loads the **built** `dist/` output, not the dev server: `npm run cap:sync` runs `npm run build` then `npx cap sync` to push the latest web code into `android/`/`ios/`.
- `npm run cap:android` opens the native project in Android Studio; `npm run cap:ios` does the same for Xcode (requires a Mac).
- Google sign-in on native uses an in-app browser + the `habitbuddy://auth-callback` deep link (see `src/hooks/useAuth.tsx`) instead of the web's same-origin redirect — this requires the redirect URL above and the intent filter already committed in `android/app/src/main/AndroidManifest.xml` (and, once the iOS project exists, the matching `CFBundleURLTypes` entry in `Info.plist`).
- App icon/splash source art lives in `resources/icon.svg` (rasterized via `npm run assets:generate`, which also re-runs `capacitor-assets generate` to regenerate the native icon/splash sets).
- This Supabase project returns Google sign-in tokens via the URL hash fragment (`#access_token=...&refresh_token=...`, implicit flow) rather than a `?code=` param (PKCE), so the `appUrlOpen` handler in `useAuth.tsx` checks for both. Don't assume PKCE-only if touching this code.

### Debugging native sign-in on a connected device

If native Google sign-in stops working, the fastest way to see what's actually happening is to temporarily add logging back into the `appUrlOpen` handler and `signInWithGoogle` in `src/hooks/useAuth.tsx`:

```ts
// in the appUrlOpen listener, right after `if (!url.startsWith(NATIVE_REDIRECT_URL)) return;`
console.log('[auth] appUrlOpen received:', url);
// ...and after each supabase.auth.* call, log the returned `error` if present
```

Then rebuild and reinstall onto a connected device (USB or wireless `adb` debugging both work):
```bash
npm run build && npx cap sync android
cd android && ./gradlew.bat assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am force-stop <appId> && adb shell am start -n <appId>/.MainActivity
```
Capacitor pipes JS `console.log`/`warn`/`error` to `adb logcat` under the tag `Capacitor/Console` — filter with `adb logcat -d | grep -i "Capacitor/Console\|Capacitor/AppPlugin"` after reproducing the issue. This is how the implicit-vs-PKCE flow mismatch above was originally diagnosed. Remove the logging again once done.

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
