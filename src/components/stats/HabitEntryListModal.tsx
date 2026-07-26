import type { EventType, LogEntry } from '../../types';
import { Modal } from '../layout/Modal';
import { getIcon } from '../../utils/iconRegistry';
import { hexWithAlpha } from '../../utils/stats';
import { format } from '../../utils/date';

interface HabitEntryListModalProps {
  eventType: EventType;
  entries: LogEntry[]; // already filtered to this event type
  onClose: () => void;
}

export function HabitEntryListModal({ eventType, entries, onClose }: HabitEntryListModalProps) {
  const Icon = getIcon(eventType.icon);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Icon color={eventType.color} size={28} />
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {eventType.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'} in this range
            </p>
          </div>
        </div>

        <div className="-mx-2 max-h-80 overflow-y-auto px-2">
          {sorted.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              No entries in this range.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
              {sorted.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {format(new Date(`${entry.date}T00:00:00`), 'EEE, MMM d, yyyy')}
                    </div>
                    {entry.note && (
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {entry.note}
                      </div>
                    )}
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: hexWithAlpha(eventType.color, 0.15), color: eventType.color }}
                  >
                    {entry.score}/10
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
