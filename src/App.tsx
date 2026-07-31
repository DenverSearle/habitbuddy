import { useCallback, useEffect, useState } from 'react';
import { NavBar, type Screen } from './components/layout/NavBar';
import { CalendarView } from './components/calendar/CalendarView';
import { EventTypeManager } from './components/eventTypes/EventTypeManager';
import { StatsView } from './components/stats/StatsView';
import { LoginScreen } from './components/auth/LoginScreen';
import { SplashScreen } from './components/layout/SplashScreen';
import { repository } from './data';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import type { EventType } from './types';

function App() {
  const [screen, setScreen] = useState<Screen>('day');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const loadEventTypes = useCallback(async () => {
    setEventTypes(await repository.getEventTypes());
  }, []);

  useEffect(() => {
    if (!user) {
      setEventTypes([]);
      return;
    }
    loadEventTypes();
  }, [user, loadEventTypes]);

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <NavBar
        screen={screen}
        onScreenChange={setScreen}
        theme={theme}
        onToggleTheme={toggleTheme}
        userEmail={user.email}
        avatarUrl={user.user_metadata.avatar_url ?? user.user_metadata.picture}
        onSignOut={signOut}
      />
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
        {screen === 'manage' ? (
          <EventTypeManager eventTypes={eventTypes} onChanged={loadEventTypes} />
        ) : screen === 'stats' ? (
          <StatsView eventTypes={eventTypes} />
        ) : (
          <CalendarView viewMode={screen} eventTypes={eventTypes} />
        )}
      </main>
    </div>
  );
}

export default App;
