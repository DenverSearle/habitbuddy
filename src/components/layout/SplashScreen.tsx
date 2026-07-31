import { BrandMark } from './BrandMark';

/** Shown while the auth session resolves, so a cold start doesn't flash an empty screen. */
export function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
      <BrandMark size={64} className="motion-safe:animate-pulse" />
      <p className="text-sm text-slate-400 dark:text-slate-500">Habit Buddy</p>
    </div>
  );
}
