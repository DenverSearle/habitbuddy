import { describe, expect, it } from 'vitest';
import { daysOfMonthGrid, daysOfWeek, toDateKey } from './date';

describe('date utilities', () => {
  it('formats a date as yyyy-mm-dd', () => {
    expect(toDateKey(new Date(2026, 6, 18))).toBe('2026-07-18');
  });

  it('returns seven days for the week view', () => {
    const week = daysOfWeek(new Date(2026, 6, 18));
    expect(week).toHaveLength(7);
    expect(week[0]?.getDay()).toBe(0);
    expect(week[6]?.getDay()).toBe(6);
  });

  it('returns a full month grid around the month boundaries', () => {
    const grid = daysOfMonthGrid(new Date(2026, 6, 18));
    expect(grid.length).toBeGreaterThanOrEqual(28);
    expect(grid[0]).toBeInstanceOf(Date);
    expect(grid[grid.length - 1]).toBeInstanceOf(Date);
  });
});
