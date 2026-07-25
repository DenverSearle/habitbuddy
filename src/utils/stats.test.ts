import { describe, expect, it } from 'vitest';
import {
  average,
  buildDailySeries,
  consistencyPct,
  currentStreak,
  hexWithAlpha,
  longestStreak,
  trendDelta,
} from './stats';
import type { LogEntry } from '../types';

function entry(overrides: Partial<LogEntry>): LogEntry {
  return {
    id: 'id',
    event_type_id: 'et-1',
    date: '2026-07-01',
    score: 5,
    note: null,
    user_id: 'u-1',
    created_at: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildDailySeries', () => {
  it('aligns entries to date keys, filling gaps with null', () => {
    const entries = [
      entry({ date: '2026-07-01', score: 4 }),
      entry({ date: '2026-07-03', score: 8 }),
      entry({ event_type_id: 'et-2', date: '2026-07-02', score: 10 }),
    ];
    const series = buildDailySeries(entries, 'et-1', ['2026-07-01', '2026-07-02', '2026-07-03']);
    expect(series).toEqual([4, null, 8]);
  });
});

describe('average', () => {
  it('ignores nulls', () => {
    expect(average([4, null, 8])).toBe(6);
  });

  it('returns null when nothing is logged', () => {
    expect(average([null, null])).toBeNull();
  });
});

describe('currentStreak', () => {
  it('counts consecutive logged days ending at the most recent entry', () => {
    expect(currentStreak([5, null, 7, 8, 9])).toBe(3);
  });

  it('is zero when the most recent day is unlogged', () => {
    expect(currentStreak([7, 8, null])).toBe(0);
  });
});

describe('longestStreak', () => {
  it('finds the longest run of logged days anywhere in the series', () => {
    expect(longestStreak([5, null, 7, 8, 9, null, 3])).toBe(3);
  });
});

describe('consistencyPct', () => {
  it('computes the percentage of logged days', () => {
    expect(consistencyPct([5, null, 7, null])).toBe(50);
  });

  it('is zero for an empty range', () => {
    expect(consistencyPct([])).toBe(0);
  });
});

describe('trendDelta', () => {
  it('is positive when the second half averages higher than the first', () => {
    expect(trendDelta([2, 2, 8, 8])).toBe(6);
  });

  it('is null when either half has no data', () => {
    expect(trendDelta([null, null, 8, 8])).toBeNull();
  });
});

describe('hexWithAlpha', () => {
  it('converts a hex color into an rgba string', () => {
    expect(hexWithAlpha('#ef4444', 0.5)).toBe('rgba(239, 68, 68, 0.5)');
  });
});
