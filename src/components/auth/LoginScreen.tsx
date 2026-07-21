import { useAuth } from '../../hooks/useAuth';

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">HabitBuddy</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to track your own habits.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-800 dark:hover:bg-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
