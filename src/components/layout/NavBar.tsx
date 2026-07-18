import { Settings } from 'lucide-react';

export type Screen = 'day' | 'week' | 'month' | 'manage';

interface NavBarProps {
  screen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const TABS: { key: Screen; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export function NavBar({ screen, onScreenChange }: NavBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <h1 className="text-lg font-bold text-slate-800">HabitBuddy</h1>
      <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onScreenChange(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              screen === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => onScreenChange('manage')}
        className={`rounded-lg p-2 transition ${
          screen === 'manage' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
        }`}
        title="Manage Event Types"
      >
        <Settings size={20} />
      </button>
    </header>
  );
}
