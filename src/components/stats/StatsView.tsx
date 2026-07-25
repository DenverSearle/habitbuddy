import { useEffect, useMemo, useState } from 'react';
import type { EventType, LogEntry } from '../../types';
import { repository } from '../../data';
import { dateKeysInRange, format, subDays, toDateKey } from '../../utils/date';
import { getIcon } from '../../utils/iconRegistry';
import { buildDailySeries, trendDelta } from '../../utils/stats';
import { EventIcon } from '../calendar/EventIcon';
import { HabitStatCard } from './HabitStatCard';

interface StatsViewProps {
  eventTypes: EventType[];
}

type RangeKey = '7d' | '30d' | '90d' | 'all';

const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: '7d', label: '7d', days: 7 },
  { key: '30d', label: '30d', days: 30 },
  { key: '90d', label: '90d', days: 90 },
  { key: 'all', label: 'All', days: 3650 },
];

export function StatsView({ eventTypes }: StatsViewProps) {
  const [range, setRange] = useState<RangeKey>('30d');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const { start, end, dateKeys } = useMemo(() => {
    const today = new Date();
    const days = RANGES.find((r) => r.key === range)?.days ?? 30;
    const startDate = subDays(today, days - 1);
    return { start: startDate, end: today, dateKeys: dateKeysInRange(startDate, today) };
  }, [range]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    repository.getLogEntries(toDateKey(start), toDateKey(end)).then((data) => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [start, end]);

  const habitSeries = useMemo(
    () =>
      eventTypes.map((eventType) => ({
        eventType,
        scores: buildDailySeries(entries, eventType.id, dateKeys),
      })),
    [eventTypes, entries, dateKeys],
  );

  const mostImproved = useMemo(() => {
    let best: { eventType: EventType; delta: number } | null = null;
    for (const { eventType, scores } of habitSeries) {
      const delta = trendDelta(scores);
      if (delta != null && delta > 0 && (best == null || delta > best.delta)) {
        best = { eventType, delta };
      }
    }
    return best;
  }, [habitSeries]);

  if (eventTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-500 dark:text-slate-400">
        <p className="font-medium">No event types yet.</p>
        <p className="text-sm">Add one from "Manage Event Types" to see stats.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Stats</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {format(start, 'MMM d')} – {format(end, 'MMM d')}
        </span>
      </div>

      <div className="inline-flex w-fit gap-0.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              range === r.key
                ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
          Most improved
        </div>
        {mostImproved ? (
          <div className="mt-1.5 flex items-center gap-2">
            <EventIcon
              icon={getIcon(mostImproved.eventType.icon)}
              color={mostImproved.eventType.color}
              score={10}
              size={30}
            />
            <div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {mostImproved.eventType.name}
              </div>
              <div className="text-xs font-semibold text-emerald-500">
                +{mostImproved.delta.toFixed(1)} avg (recent half vs. earlier half)
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-1.5 text-sm text-slate-400 dark:text-slate-500">Not enough data yet</div>
        )}
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {habitSeries.map(({ eventType, scores }) => (
            <HabitStatCard key={eventType.id} eventType={eventType} scores={scores} />
          ))}
        </div>
      )}
    </div>
  );
}
