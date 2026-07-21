import type { EventType, NewEventType, LogEntry, LogEntryInput } from '../types';
import type { Repository } from './repository';

const EVENT_TYPES_KEY = 'habitbuddy_event_types';
const LOG_ENTRIES_KEY = 'habitbuddy_log_entries';
const LOCAL_USER_ID = 'local';

function read<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export class LocalStorageRepository implements Repository {
  async getEventTypes(): Promise<EventType[]> {
    return read<EventType>(EVENT_TYPES_KEY);
  }

  async createEventType(input: NewEventType): Promise<EventType> {
    const eventTypes = read<EventType>(EVENT_TYPES_KEY);
    const eventType: EventType = {
      id: crypto.randomUUID(),
      name: input.name,
      icon: input.icon,
      color: input.color,
      user_id: LOCAL_USER_ID,
      created_at: new Date().toISOString(),
    };
    eventTypes.push(eventType);
    write(EVENT_TYPES_KEY, eventTypes);
    return eventType;
  }

  async updateEventType(id: string, input: NewEventType): Promise<EventType> {
    const eventTypes = read<EventType>(EVENT_TYPES_KEY);
    const index = eventTypes.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`EventType ${id} not found`);
    const updated: EventType = { ...eventTypes[index], ...input };
    eventTypes[index] = updated;
    write(EVENT_TYPES_KEY, eventTypes);
    return updated;
  }

  async deleteEventType(id: string): Promise<void> {
    const eventTypes = read<EventType>(EVENT_TYPES_KEY).filter((e) => e.id !== id);
    write(EVENT_TYPES_KEY, eventTypes);

    const logEntries = read<LogEntry>(LOG_ENTRIES_KEY).filter((l) => l.event_type_id !== id);
    write(LOG_ENTRIES_KEY, logEntries);
  }

  async getLogEntries(startDate: string, endDate: string): Promise<LogEntry[]> {
    return read<LogEntry>(LOG_ENTRIES_KEY).filter((l) => l.date >= startDate && l.date <= endDate);
  }

  async upsertLogEntry(input: LogEntryInput): Promise<LogEntry> {
    const logEntries = read<LogEntry>(LOG_ENTRIES_KEY);
    const index = logEntries.findIndex(
      (l) => l.event_type_id === input.event_type_id && l.date === input.date,
    );

    if (index !== -1) {
      const updated: LogEntry = { ...logEntries[index], score: input.score, note: input.note };
      logEntries[index] = updated;
      write(LOG_ENTRIES_KEY, logEntries);
      return updated;
    }

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      event_type_id: input.event_type_id,
      date: input.date,
      score: input.score,
      note: input.note,
      user_id: LOCAL_USER_ID,
      created_at: new Date().toISOString(),
    };
    logEntries.push(entry);
    write(LOG_ENTRIES_KEY, logEntries);
    return entry;
  }

  async deleteLogEntry(id: string): Promise<void> {
    const logEntries = read<LogEntry>(LOG_ENTRIES_KEY).filter((l) => l.id !== id);
    write(LOG_ENTRIES_KEY, logEntries);
  }
}
