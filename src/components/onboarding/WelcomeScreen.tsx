import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { repository } from '../../data';
import { STARTER_HABITS } from '../../data/starterHabits';
import { getIcon } from '../../utils/iconRegistry';
import { BrandBloom } from '../layout/BrandBloom';
import { BrandMark } from '../layout/BrandMark';
import { EventIcon } from '../calendar/EventIcon';

interface WelcomeScreenProps {
  firstName?: string;
  /** Refetch event types — a non-empty list is what dismisses this screen. */
  onCreated: () => Promise<void> | void;
  /** Skip the suggestions and open the create form on the manage screen. */
  onCreateOwn: () => void;
  onSkip: () => void;
}

/** The scores demoed in the "how it works" row, using the first starter habit's icon. */
const DEMO_SCORES = [3, 7, 10];

const PRESELECTED = STARTER_HABITS.slice(0, 3).map((habit) => habit.name);

export function WelcomeScreen({ firstName, onCreated, onCreateOwn, onSkip }: WelcomeScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(PRESELECTED));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoHabit = STARTER_HABITS[0];
  const DemoIcon = getIcon(demoHabit.icon);

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function handleStart() {
    setPending(true);
    setError(null);
    try {
      // Iterate STARTER_HABITS rather than the Set so the habits land in listed order, not tap
      // order — `getEventTypes` sorts by `created_at`, so these must be awaited one at a time.
      for (const habit of STARTER_HABITS.filter((h) => selected.has(h.name))) {
        await repository.createEventType(habit);
      }
      await onCreated();
    } catch (err) {
      console.error('Creating starter habits failed', err);
      setError("Couldn't save your habits. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-slate-50 px-6 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] dark:bg-slate-900">
      <BrandBloom />

      <div className="relative flex w-full max-w-sm flex-col">
        <div className="flex flex-col items-center gap-3">
          <BrandMark size={64} />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {firstName ? `Welcome, ${firstName}` : 'Welcome'}
          </h1>
          <p className="text-center text-[15px] leading-snug font-medium text-slate-600 dark:text-slate-300">
            Pick the habits you want to track. Each day you score them out of 10 — the icon fills up
            like a glass.
          </p>
        </div>

        <div aria-hidden="true" className="mt-5 flex items-end justify-center gap-6">
          {DEMO_SCORES.map((score) => (
            <div key={score} className="flex flex-col items-center gap-1">
              <EventIcon icon={DemoIcon} color={demoHabit.color} score={score} size={44} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {score}/10
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {STARTER_HABITS.map((habit) => {
            const Icon = getIcon(habit.icon);
            const isSelected = selected.has(habit.name);
            return (
              <button
                key={habit.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(habit.name)}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-sm font-medium transition ${
                  isSelected
                    ? 'border-slate-800 bg-white text-slate-800 shadow-sm dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100'
                    : 'border-slate-200 text-slate-600 hover:bg-white/60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={20} color={habit.color} strokeWidth={1.9} className="shrink-0" />
                <span className="flex-1 text-left">{habit.name}</span>
                {isSelected && <Check size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleStart}
            disabled={pending || selected.size === 0}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-600 dark:shadow-slate-950/40 dark:hover:bg-slate-500"
          >
            {pending && <Loader2 size={17} className="animate-spin" />}
            {pending
              ? 'Setting things up…'
              : selected.size > 0
                ? `Start tracking (${selected.size})`
                : 'Start tracking'}
          </button>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs leading-relaxed text-red-600 dark:bg-red-950 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onCreateOwn}
              disabled={pending}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-60 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Create my own
            </button>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <button
              type="button"
              onClick={onSkip}
              disabled={pending}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-60 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
