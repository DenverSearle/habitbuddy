import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getUserMock, fromMock, builderCalls } = vi.hoisted(() => {
  const getUserMock = vi.fn();
  const fromMock = vi.fn();
  const builderCalls: { table: string; calls: [string, unknown[]][] }[] = [];
  return { getUserMock, fromMock, builderCalls };
});

vi.mock('./supabaseClient', () => ({
  supabase: {
    auth: { getUser: getUserMock },
    from: fromMock,
  },
}));

function makeBuilder(table: string, result: { data: unknown; error: unknown }) {
  const record = { table, calls: [] as [string, unknown[]][] };
  builderCalls.push(record);

  const builder: Record<string, unknown> = {};
  const methodNames = ['select', 'order', 'insert', 'update', 'eq', 'delete', 'gte', 'lte', 'upsert', 'single'];
  for (const name of methodNames) {
    builder[name] = (...args: unknown[]) => {
      record.calls.push([name, args]);
      return builder;
    };
  }
  builder.then = (resolve: (value: typeof result) => unknown) => resolve(result);
  return builder;
}

// Import after mocks are set up.
import { SupabaseRepository } from './supabaseRepository';

describe('SupabaseRepository', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    fromMock.mockReset();
    builderCalls.length = 0;
    getUserMock.mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null });
  });

  it('injects the authenticated user_id when creating an event type', async () => {
    fromMock.mockImplementation((table: string) =>
      makeBuilder(table, { data: { id: 'et-1', user_id: 'test-user-id' }, error: null }),
    );

    const repository = new SupabaseRepository();
    await repository.createEventType({ name: 'Running', icon: 'activity', color: '#3b82f6' });

    const insertCall = builderCalls[0]?.calls.find(([name]) => name === 'insert');
    expect(insertCall?.[1][0]).toEqual({
      name: 'Running',
      icon: 'activity',
      color: '#3b82f6',
      user_id: 'test-user-id',
    });
  });

  it('injects the authenticated user_id when upserting a log entry, preserving the onConflict key', async () => {
    fromMock.mockImplementation((table: string) =>
      makeBuilder(table, { data: { id: 'le-1', user_id: 'test-user-id' }, error: null }),
    );

    const repository = new SupabaseRepository();
    await repository.upsertLogEntry({
      event_type_id: 'et-1',
      date: '2026-07-18',
      score: 8,
      note: 'Great run',
    });

    const upsertCall = builderCalls[0]?.calls.find(([name]) => name === 'upsert');
    expect(upsertCall?.[1][0]).toEqual({
      event_type_id: 'et-1',
      date: '2026-07-18',
      score: 8,
      note: 'Great run',
      user_id: 'test-user-id',
    });
    expect(upsertCall?.[1][1]).toEqual({ onConflict: 'event_type_id,date' });
  });

  it('does not filter reads client-side, relying on RLS to scope rows', async () => {
    fromMock.mockImplementation((table: string) => makeBuilder(table, { data: [], error: null }));

    const repository = new SupabaseRepository();
    await repository.getEventTypes();
    await repository.getLogEntries('2026-07-01', '2026-07-31');

    const eventTypeCalls = builderCalls[0]?.calls.map(([name]) => name) ?? [];
    const logEntryCalls = builderCalls[1]?.calls.map(([name]) => name) ?? [];

    expect(eventTypeCalls).toEqual(['select', 'order']);
    expect(logEntryCalls).toEqual(['select', 'gte', 'lte']);
    expect(getUserMock).not.toHaveBeenCalled();
  });
});
