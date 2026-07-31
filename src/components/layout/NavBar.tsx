import { LogOut, Moon, Settings, Sun } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

export type Screen = 'day' | 'week' | 'month' | 'stats' | 'manage';

interface NavBarProps {
  screen: Screen;
  onScreenChange: (screen: Screen) => void;
  theme: Theme;
  onToggleTheme: () => void;
  userEmail: string | null | undefined;
  avatarUrl: string | null | undefined;
  onSignOut: () => void;
}

const TABS: { key: Screen; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'stats', label: 'Stats' },
];

const APP_VERSION = 'v1.0';

export function NavBar({
  screen,
  onScreenChange,
  theme,
  onToggleTheme,
  userEmail,
  avatarUrl,
  onSignOut,
}: NavBarProps) {
  return (
    <header className="border-b border-slate-200 bg-white pt-[env(safe-area-inset-top)] dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Habit Buddy</h1>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {APP_VERSION}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userEmail ?? 'Profile picture'}
              title={userEmail ?? undefined}
              className="h-7 w-7 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            userEmail && (
              <span className="hidden max-w-[10rem] truncate text-xs text-slate-400 dark:text-slate-500 sm:inline">
                {userEmail}
              </span>
            )
          )}
          <button
            onClick={onSignOut}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
        <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onScreenChange(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                screen === tab.key
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => onScreenChange('manage')}
          className={`rounded-lg p-2 transition ${
            screen === 'manage'
              ? 'bg-slate-800 text-white dark:bg-slate-600'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
          title="Manage Event Types"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
