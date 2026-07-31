import { useState } from 'react';
import { Droplet, Flame, LayoutGrid, Loader2, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { BRAND_COLORS } from '../../utils/brand';
import { hexWithAlpha } from '../../utils/stats';
import { BrandMark } from '../layout/BrandMark';
import { GoogleIcon } from './GoogleIcon';

/**
 * The mark's four colors bloomed across the screen. Sized in vmin so the wash keeps its
 * proportions from a phone up to a desktop, and faded to zero alpha (not `transparent`,
 * which can interpolate through grey).
 */
const BLOOM = [
  `radial-gradient(70vmin 65vmin at 12% 8%, ${hexWithAlpha(BRAND_COLORS.coral, 0.38)}, ${hexWithAlpha(BRAND_COLORS.coral, 0)} 70%)`,
  `radial-gradient(65vmin 60vmin at 92% 18%, ${hexWithAlpha(BRAND_COLORS.gold, 0.36)}, ${hexWithAlpha(BRAND_COLORS.gold, 0)} 70%)`,
  `radial-gradient(75vmin 75vmin at 88% 88%, ${hexWithAlpha(BRAND_COLORS.violet, 0.38)}, ${hexWithAlpha(BRAND_COLORS.violet, 0)} 70%)`,
  `radial-gradient(70vmin 70vmin at 8% 82%, ${hexWithAlpha(BRAND_COLORS.teal, 0.36)}, ${hexWithAlpha(BRAND_COLORS.teal, 0)} 70%)`,
].join(', ');

interface Feature {
  icon: LucideIcon;
  color: string;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: LayoutGrid,
    color: BRAND_COLORS.violet,
    title: 'Pick your habits',
    body: 'Any icon, any color — water, gym, reading, yours.',
  },
  {
    icon: Droplet,
    color: BRAND_COLORS.teal,
    title: 'Score each day out of 10',
    body: 'The icon fills up like a glass as you log.',
  },
  {
    icon: Flame,
    color: BRAND_COLORS.coral,
    title: 'Watch the streak build',
    body: 'Day, week and month views plus stats.',
  },
];

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in failed', err);
      setError("Couldn't reach Google. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-6 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] dark:bg-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 dark:opacity-60"
        style={{ background: BLOOM }}
      />

      <div className="relative flex w-full max-w-sm flex-col">
        <div className="flex flex-col items-center gap-3">
          <BrandMark size={84} />
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Habit Buddy
          </h1>
          <p className="text-center text-[15px] leading-snug font-medium text-slate-600 dark:text-slate-300">
            Track what matters, one day at a time.
          </p>
        </div>

        <ul className="mt-8 flex flex-col gap-4">
          {FEATURES.map(({ icon: Icon, color, title, body }) => (
            <li key={title} className="flex items-start gap-3.5">
              <Icon size={21} color={color} strokeWidth={1.9} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-900/10 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 dark:hover:bg-slate-700"
          >
            {pending ? <Loader2 size={17} className="animate-spin" /> : <GoogleIcon size={17} />}
            {pending ? 'Opening Google…' : 'Continue with Google'}
          </button>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs leading-relaxed text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Private to your account. No ads, no sharing.
          </p>
        </div>
      </div>
    </div>
  );
}
