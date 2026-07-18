import type { EventType, LogEntry } from '../../types';
import { DenseGrid } from './DenseGrid';
import { daysOfMonthGrid } from '../../utils/date';

interface MonthViewProps {
  currentDate: Date;
  eventTypes: EventType[];
  logEntries: LogEntry[];
  onTapCell: (eventType: EventType, dateKey: string, entry: LogEntry | undefined) => void;
}

export function MonthView({ currentDate, eventTypes, logEntries, onTapCell }: MonthViewProps) {
  const days = daysOfMonthGrid(currentDate);
  return (
    <DenseGrid
      days={days}
      eventTypes={eventTypes}
      logEntries={logEntries}
      onTapCell={onTapCell}
      iconSize={22}
    />
  );
}
