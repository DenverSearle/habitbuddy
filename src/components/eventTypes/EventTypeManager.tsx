import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { EventType } from '../../types';
import { repository } from '../../data';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';
import { getIcon } from '../../utils/iconRegistry';

interface EventTypeManagerProps {
  eventTypes: EventType[];
  onChanged: () => void;
}

interface FormState {
  id?: string;
  name: string;
  icon: string;
  color: string;
}

const EMPTY_FORM: FormState = { name: '', icon: 'activity', color: '#3b82f6' };

export function EventTypeManager({ eventTypes, onChanged }: EventTypeManagerProps) {
  const [form, setForm] = useState<FormState | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form || !form.name.trim()) return;
    if (form.id) {
      await repository.updateEventType(form.id, {
        name: form.name.trim(),
        icon: form.icon,
        color: form.color,
      });
    } else {
      await repository.createEventType({
        name: form.name.trim(),
        icon: form.icon,
        color: form.color,
      });
    }
    setForm(null);
    onChanged();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event type? This also removes its logged history.')) return;
    await repository.deleteEventType(id);
    onChanged();
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Event Types</h1>
        {!form && (
          <button
            onClick={() => setForm(EMPTY_FORM)}
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            <Plus size={16} /> New
          </button>
        )}
      </div>

      {form ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-400"
              placeholder="e.g. Running"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Icon
            </label>
            <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Color
            </label>
            <ColorPicker value={form.color} onChange={(color) => setForm({ ...form, color })} />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <ul className="flex flex-col gap-2">
          {eventTypes.map((eventType) => {
            const Icon = getIcon(eventType.icon);
            return (
              <li
                key={eventType.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <Icon color={eventType.color} size={24} />
                <span className="flex-1 font-medium text-slate-700 dark:text-slate-200">
                  {eventType.name}
                </span>
                <button
                  onClick={() =>
                    setForm({
                      id: eventType.id,
                      name: eventType.name,
                      icon: eventType.icon,
                      color: eventType.color,
                    })
                  }
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(eventType.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
          {eventTypes.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No event types yet. Create your first one.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
