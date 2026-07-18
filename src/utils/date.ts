import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export function toDateKey(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function daysOfWeek(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  });
}

export function daysOfMonthGrid(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  return eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });
}

export { addDays, addWeeks, addMonths, format };
