import type { EventType, LogEntry } from '../../types';
import { DenseGrid } from './DenseGrid';
import { daysOfWeek } from '../../utils/date';

interface WeekViewProps {
  currentDate: Date;
  eventTypes: EventType[];
  logEntries: LogEntry[];
  onTapCell: (eventType: EventType, dateKey: string, entry: LogEntry | undefined) => void;
}

export function WeekView({ currentDate, eventTypes, logEntries, onTapCell }: WeekViewProps) {
  const days = daysOfWeek(currentDate);
  return (
    <DenseGrid
      days={days}
      eventTypes={eventTypes}
      logEntries={logEntries}
      onTapCell={onTapCell}
      iconSize={40}
    />
  );
}
