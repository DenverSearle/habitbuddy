import type { EventType, NewEventType, LogEntry, LogEntryInput } from '../types';

export interface Repository {
  getEventTypes(): Promise<EventType[]>;
  createEventType(input: NewEventType): Promise<EventType>;
  updateEventType(id: string, input: NewEventType): Promise<EventType>;
  deleteEventType(id: string): Promise<void>;

  getLogEntries(startDate: string, endDate: string): Promise<LogEntry[]>;
  upsertLogEntry(input: LogEntryInput): Promise<LogEntry>;
  deleteLogEntry(id: string): Promise<void>;
}
