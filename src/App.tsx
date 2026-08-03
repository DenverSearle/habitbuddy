import { useCallback, useEffect, useState } from 'react';
import { NavBar, type Screen } from './components/layout/NavBar';
import { CalendarView } from './components/calendar/CalendarView';
import { EventTypeManager } from './components/eventTypes/EventTypeManager';
import { StatsView } from './components/stats/StatsView';
import { LoginScreen } from './components/auth/LoginScreen';
import { SplashScreen } from './components/layout/SplashScreen';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { repository } from './data';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import type { EventType } from './types';

/** Google's `full_name`/`name` metadata is optional, so greet by first name only when we have one. */
function getFirstName(fullName: unknown): string | undefined {
  if (typeof fullName !== 'string') return undefined;
  return fullName.trim().split(/\s+/)[0] || undefined;
}

function App() {
  const [screen, setScreen] = useState<Screen>('day');
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventTypesLoaded, setEventTypesLoaded] = useState(false);
  const [welcomeSkipped, setWelcomeSkipped] = useState(false);
  const [autoCreate, setAutoCreate] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signOut } = useAuth();

  const loadEventTypes = useCallback(async () => {
    try {
      setEventTypes(await repository.getEventTypes());
    } finally {
      // `finally`, so a failed fetch leaves the user in the app rather than stranded on the splash.
      setEventTypesLoaded(true);
    }
  }, []);

  // Keyed on the id, not the `user` object: `useAuth` rebuilds that object on every session change
  // (including hourly token refreshes), which would otherwise bounce the user back to the splash.
  const userId = user?.id;
  useEffect(() => {
    setEventTypesLoaded(false);
    setWelcomeSkipped(false);
    if (!userId) {
      setEventTypes([]);
      return;
    }
    loadEventTypes();
  }, [userId, loadEventTypes]);

  // Clearing `autoCreate` on every nav means the create form only springs open on the way in from
  // the welcome screen, not each time the user revisits the manage tab.
  function handleScreenChange(next: Screen) {
    setAutoCreate(false);
    setScreen(next);
  }

  function handleCreateOwn() {
    setWelcomeSkipped(true);
    setAutoCreate(true);
    setScreen('manage');
  }

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Keeps the mark pulsing through the first fetch: without this, `eventTypes.length === 0` can't
  // tell "still loading" from "genuinely empty" and the welcome screen flashes on every load.
  if (!eventTypesLoaded) {
    return <SplashScreen />;
  }

  if (eventTypes.length === 0 && !welcomeSkipped) {
    return (
      <WelcomeScreen
        firstName={getFirstName(user.user_metadata.full_name ?? user.user_metadata.name)}
        onCreated={loadEventTypes}
        onCreateOwn={handleCreateOwn}
        onSkip={() => setWelcomeSkipped(true)}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <NavBar
        screen={screen}
        onScreenChange={handleScreenChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        userEmail={user.email}
        avatarUrl={user.user_metadata.avatar_url ?? user.user_metadata.picture}
        onSignOut={signOut}
      />
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
        {screen === 'manage' ? (
          <EventTypeManager
            eventTypes={eventTypes}
            onChanged={loadEventTypes}
            startInCreateMode={autoCreate}
          />
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
