export interface EventType {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface LogEntry {
  id: string;
  event_type_id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1-10
  note: string | null;
  user_id: string;
  created_at: string;
}

export type NewEventType = Pick<EventType, 'name' | 'icon' | 'color'>;
export type LogEntryInput = Pick<LogEntry, 'event_type_id' | 'date' | 'score' | 'note'>;
