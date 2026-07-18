import { useCallback, useEffect, useState } from 'react';
import { NavBar, type Screen } from './components/layout/NavBar';
import { CalendarView } from './components/calendar/CalendarView';
import { EventTypeManager } from './components/eventTypes/EventTypeManager';
import { repository } from './data';
import { useTheme } from './hooks/useTheme';
import type { EventType } from './types';

function App() {
  const [screen, setScreen] = useState<Screen>('day');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const { theme, toggleTheme } = useTheme();

  const loadEventTypes = useCallback(async () => {
    setEventTypes(await repository.getEventTypes());
  }, []);

  useEffect(() => {
    loadEventTypes();
  }, [loadEventTypes]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <NavBar screen={screen} onScreenChange={setScreen} theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        {screen === 'manage' ? (
          <EventTypeManager eventTypes={eventTypes} onChanged={loadEventTypes} />
        ) : (
          <CalendarView viewMode={screen} eventTypes={eventTypes} />
        )}
      </main>
    </div>
  );
}

export default App;
