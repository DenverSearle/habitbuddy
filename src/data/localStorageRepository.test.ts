import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorageRepository } from './localStorageRepository';

describe('LocalStorageRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores event types and removes related log entries when an event type is deleted', async () => {
    const repository = new LocalStorageRepository();

    const eventType = await repository.createEventType({
      name: 'Running',
      icon: 'activity',
      color: '#3b82f6',
    });

    await repository.upsertLogEntry({
      event_type_id: eventType.id,
      date: '2026-07-18',
      score: 8,
      note: 'Great run',
    });

    await repository.deleteEventType(eventType.id);

    const eventTypes = await repository.getEventTypes();
    const logEntries = await repository.getLogEntries('2026-07-18', '2026-07-18');

    expect(eventTypes).toHaveLength(0);
    expect(logEntries).toHaveLength(0);
  });

  it('updates an existing log entry for the same event and date instead of creating duplicates', async () => {
    const repository = new LocalStorageRepository();

    const eventType = await repository.createEventType({
      name: 'Meditation',
      icon: 'sparkles',
      color: '#8b5cf6',
    });

    await repository.upsertLogEntry({
      event_type_id: eventType.id,
      date: '2026-07-18',
      score: 4,
      note: 'First pass',
    });

    const updated = await repository.upsertLogEntry({
      event_type_id: eventType.id,
      date: '2026-07-18',
      score: 9,
      note: 'Second pass',
    });

    const entries = await repository.getLogEntries('2026-07-18', '2026-07-18');

    expect(updated.score).toBe(9);
    expect(updated.note).toBe('Second pass');
    expect(entries).toHaveLength(1);
    expect(entries[0]?.id).toBe(updated.id);
  });
});
