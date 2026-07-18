import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventType, LogEntry } from '../../types';
import { repository } from '../../data';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { QuickAddModal } from '../quickAdd/QuickAddModal';
import { LogDetailPopup } from '../logDetail/LogDetailPopup';
import { toDateKey, daysOfWeek, daysOfMonthGrid, addDays, addWeeks, addMonths, format } from '../../utils/date';

export type ViewMode = 'day' | 'week' | 'month';

interface CalendarViewProps {
  viewMode: ViewMode;
  eventTypes: EventType[];
}

interface ModalState {
  mode: 'add' | 'detail';
  eventType: EventType;
  dateKey: string;
  entry?: LogEntry;
}

function getRange(viewMode: ViewMode, date: Date): { start: string; end: string } {
  if (viewMode === 'day') {
    const key = toDateKey(date);
    return { start: key, end: key };
  }
  if (viewMode === 'week') {
    const days = daysOfWeek(date);
    return { start: toDateKey(days[0]), end: toDateKey(days[days.length - 1]) };
  }
  const days = daysOfMonthGrid(date);
  return { start: toDateKey(days[0]), end: toDateKey(days[days.length - 1]) };
}

function headerLabel(viewMode: ViewMode, date: Date): string {
  if (viewMode === 'day') return format(date, 'EEEE, MMM d, yyyy');
  if (viewMode === 'week') {
    const days = daysOfWeek(date);
    return `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`;
  }
  return format(date, 'MMMM yyyy');
}

export function CalendarView({ viewMode, eventTypes }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);

  const range = getRange(viewMode, currentDate);

  const loadLogEntries = useCallback(async () => {
    setLogEntries(await repository.getLogEntries(range.start, range.end));
  }, [range.start, range.end]);

  useEffect(() => {
    loadLogEntries();
  }, [loadLogEntries]);

  function handleTapCell(eventType: EventType, dateKey: string, entry: LogEntry | undefined) {
    setModal({ mode: entry ? 'detail' : 'add', eventType, dateKey, entry });
  }

  function step(direction: 1 | -1) {
    if (viewMode === 'day') setCurrentDate((d) => addDays(d, direction));
    else if (viewMode === 'week') setCurrentDate((d) => addWeeks(d, direction));
    else setCurrentDate((d) => addMonths(d, direction));
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-4 py-3">
        <button
          onClick={() => step(-1)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {headerLabel(viewMode, currentDate)}
          </span>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            Today
          </button>
        </div>
        <button
          onClick={() => step(1)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {viewMode === 'day' && (
        <DayView
          dateKey={toDateKey(currentDate)}
          eventTypes={eventTypes}
          logEntries={logEntries}
          onTapEventType={(eventType, entry) =>
            handleTapCell(eventType, toDateKey(currentDate), entry)
          }
        />
      )}
      {viewMode === 'week' && (
        <WeekView
          currentDate={currentDate}
          eventTypes={eventTypes}
          logEntries={logEntries}
          onTapCell={handleTapCell}
        />
      )}
      {viewMode === 'month' && (
        <MonthView
          currentDate={currentDate}
          eventTypes={eventTypes}
          logEntries={logEntries}
          onTapCell={handleTapCell}
        />
      )}

      {modal?.mode === 'add' && (
        <QuickAddModal
          eventType={modal.eventType}
          dateKey={modal.dateKey}
          existingEntry={modal.entry}
          onClose={() => setModal(null)}
          onSaved={loadLogEntries}
        />
      )}
      {modal?.mode === 'detail' && modal.entry && (
        <LogDetailPopup
          eventType={modal.eventType}
          entry={modal.entry}
          onClose={() => setModal(null)}
          onEdit={() => setModal(modal ? { ...modal, mode: 'add' } : null)}
        />
      )}
    </div>
  );
}
