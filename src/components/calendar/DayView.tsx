import type { EventType, LogEntry } from '../../types';
import { EventIcon } from './EventIcon';
import { getIcon } from '../../utils/iconRegistry';

interface DayViewProps {
  dateKey: string;
  eventTypes: EventType[];
  logEntries: LogEntry[];
  onTapEventType: (eventType: EventType, entry: LogEntry | undefined) => void;
}

export function DayView({ dateKey, eventTypes, logEntries, onTapEventType }: DayViewProps) {
  if (eventTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-500">
        <p className="font-medium">No event types yet.</p>
        <p className="text-sm">Add one from "Manage Event Types" to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {eventTypes.map((eventType) => {
        const entry = logEntries.find(
          (l) => l.event_type_id === eventType.id && l.date === dateKey,
        );
        return (
          <div key={eventType.id} className="flex flex-col items-center gap-2">
            <EventIcon
              icon={getIcon(eventType.icon)}
              color={eventType.color}
              score={entry ? entry.score : null}
              size={64}
              onClick={() => onTapEventType(eventType, entry)}
              title={eventType.name}
            />
            <span className="max-w-[80px] truncate text-xs font-medium text-slate-600">
              {eventType.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
