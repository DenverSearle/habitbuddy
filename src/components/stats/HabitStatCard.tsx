import { Flame } from 'lucide-react';
import type { EventType } from '../../types';
import { EventIcon } from '../calendar/EventIcon';
import { getIcon } from '../../utils/iconRegistry';
import { average, consistencyPct, currentStreak, hexWithAlpha } from '../../utils/stats';
import { Sparkline } from './Sparkline';

interface HabitStatCardProps {
  eventType: EventType;
  scores: (number | null)[]; // oldest -> newest, aligned to the selected range
}

const HEAT_STRIP_DAYS = 30;

export function HabitStatCard({ eventType, scores }: HabitStatCardProps) {
  const avg = average(scores);
  const streak = currentStreak(scores);
  const consistency = consistencyPct(scores);
  const recent = scores.slice(-HEAT_STRIP_DAYS);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <EventIcon
          icon={getIcon(eventType.icon)}
          color={eventType.color}
          score={avg != null ? Math.round(avg) : null}
          size={34}
          title={eventType.name}
        />
        <span className="flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
          {eventType.name}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-500 dark:bg-orange-500/10">
          <Flame size={11} />
          {streak}
        </span>
      </div>

      <Sparkline scores={scores} color={eventType.color} />

      <div className="flex items-baseline justify-between text-sm">
        <span className="font-bold tabular-nums text-slate-700 dark:text-slate-200">
          {avg != null ? avg.toFixed(1) : '—'}
          <span className="ml-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">/10 avg</span>
        </span>
        <span className="font-bold tabular-nums text-slate-700 dark:text-slate-200">
          {consistency}%
          <span className="ml-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">logged</span>
        </span>
      </div>

      <div className="flex gap-[1.5px]">
        {recent.map((value, i) => (
          <span
            key={i}
            className="h-3.5 flex-1 rounded-sm bg-slate-100 dark:bg-slate-700"
            style={
              value != null
                ? { backgroundColor: hexWithAlpha(eventType.color, 0.25 + (value / 10) * 0.75) }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
