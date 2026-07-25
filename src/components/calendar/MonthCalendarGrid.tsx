import { format, isSameMonth, isToday } from 'date-fns';
import type { EventType, LogEntry } from '../../types';
import { EventIcon } from './EventIcon';
import { getIcon } from '../../utils/iconRegistry';
import { toDateKey } from '../../utils/date';

interface MonthCalendarGridProps {
  currentDate: Date;
  days: Date[];
  eventTypes: EventType[];
  logEntries: LogEntry[];
  onTapCell: (eventType: EventType, dateKey: string, entry: LogEntry | undefined) => void;
}

export function MonthCalendarGrid({
  currentDate,
  days,
  eventTypes,
  logEntries,
  onTapCell,
}: MonthCalendarGridProps) {
  if (eventTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-500 dark:text-slate-400">
        <p className="font-medium">No event types yet.</p>
        <p className="text-sm">Add one from "Manage Event Types" to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-7 gap-1.5 px-1 pb-1.5">
        {days.slice(0, 7).map((day) => (
          <div
            key={day.toISOString()}
            className="text-center text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500"
          >
            {format(day, 'EEEEE')}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={dateKey}
              className="flex flex-col gap-1 rounded-lg border border-slate-200 p-1.5 dark:border-slate-700"
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                  today
                    ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                    : inMonth
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                {format(day, 'd')}
              </span>
              <div className="flex flex-wrap gap-0.5">
                {eventTypes.map((eventType) => {
                  const entry = logEntries.find(
                    (l) => l.event_type_id === eventType.id && l.date === dateKey,
                  );
                  return (
                    <EventIcon
                      key={eventType.id}
                      icon={getIcon(eventType.icon)}
                      color={eventType.color}
                      score={entry ? entry.score : null}
                      size={22}
                      onClick={() => onTapCell(eventType, dateKey, entry)}
                      title={`${eventType.name} — ${dateKey}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
