import { format, isToday } from 'date-fns';
import type { EventType, LogEntry } from '../../types';
import { EventIcon } from './EventIcon';
import { getIcon } from '../../utils/iconRegistry';
import { toDateKey } from '../../utils/date';

interface DenseGridProps {
  days: Date[];
  eventTypes: EventType[];
  logEntries: LogEntry[];
  onTapCell: (eventType: EventType, dateKey: string, entry: LogEntry | undefined) => void;
  iconSize?: number;
}

export function DenseGrid({ days, eventTypes, logEntries, onTapCell, iconSize = 32 }: DenseGridProps) {
  if (eventTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-500">
        <p className="font-medium">No event types yet.</p>
        <p className="text-sm">Add one from "Manage Event Types" to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto py-4">
      <table className="mx-auto border-separate" style={{ borderSpacing: 6 }}>
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-slate-500" />
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className="px-1 text-center text-xs font-medium text-slate-500"
              >
                <div>{format(day, 'EEEEE')}</div>
                <div className={isToday(day) ? 'font-bold text-slate-800' : ''}>
                  {format(day, 'd')}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {eventTypes.map((eventType) => (
            <tr key={eventType.id}>
              <td className="max-w-[100px] truncate pr-3 text-right text-xs font-medium text-slate-600">
                {eventType.name}
              </td>
              {days.map((day) => {
                const dateKey = toDateKey(day);
                const entry = logEntries.find(
                  (l) => l.event_type_id === eventType.id && l.date === dateKey,
                );
                return (
                  <td key={dateKey} className="text-center">
                    <EventIcon
                      icon={getIcon(eventType.icon)}
                      color={eventType.color}
                      score={entry ? entry.score : null}
                      size={iconSize}
                      onClick={() => onTapCell(eventType, dateKey, entry)}
                      title={`${eventType.name} — ${dateKey}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
