import type { NewEventType } from '../types';

/**
 * Suggested habits offered on the welcome screen so a new user can start tracking in one tap.
 *
 * Every `icon` is a key in `ICON_REGISTRY` and every `color` is one of `ColorPicker`'s presets,
 * so a starter habit round-trips through the edit form with its swatch already selected.
 */
export const STARTER_HABITS: NewEventType[] = [
  { name: 'Water', icon: 'droplet', color: '#06b6d4' },
  { name: 'Exercise', icon: 'dumbbell', color: '#ef4444' },
  { name: 'Reading', icon: 'book-open', color: '#a855f7' },
  { name: 'Sleep', icon: 'moon', color: '#6366f1' },
  { name: 'Mood', icon: 'smile', color: '#f59e0b' },
  { name: 'Focus', icon: 'brain', color: '#22c55e' },
];
