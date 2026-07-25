import type { LogEntry } from '../types';

export function buildDailySeries(
  entries: LogEntry[],
  eventTypeId: string,
  dateKeys: string[],
): (number | null)[] {
  const byDate = new Map(
    entries.filter((e) => e.event_type_id === eventTypeId).map((e) => [e.date, e.score]),
  );
  return dateKeys.map((d) => byDate.get(d) ?? null);
}

export function average(scores: (number | null)[]): number | null {
  const logged = scores.filter((s): s is number => s != null);
  if (logged.length === 0) return null;
  return logged.reduce((a, b) => a + b, 0) / logged.length;
}

export function currentStreak(scores: (number | null)[]): number {
  let streak = 0;
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i] == null) break;
    streak++;
  }
  return streak;
}

export function longestStreak(scores: (number | null)[]): number {
  let longest = 0;
  let current = 0;
  for (const s of scores) {
    if (s != null) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

export function consistencyPct(scores: (number | null)[]): number {
  if (scores.length === 0) return 0;
  const logged = scores.filter((s) => s != null).length;
  return Math.round((logged / scores.length) * 100);
}

// Positive delta = second half of the range averaging higher than the first half.
export function trendDelta(scores: (number | null)[]): number | null {
  const mid = Math.floor(scores.length / 2);
  const first = average(scores.slice(0, mid));
  const second = average(scores.slice(mid));
  if (first == null || second == null) return null;
  return second - first;
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
