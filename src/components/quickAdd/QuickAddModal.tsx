import { useState } from 'react';
import type { EventType, LogEntry } from '../../types';
import { repository } from '../../data';
import { Modal } from '../layout/Modal';
import { getIcon } from '../../utils/iconRegistry';

interface QuickAddModalProps {
  eventType: EventType;
  dateKey: string;
  existingEntry?: LogEntry;
  onClose: () => void;
  onSaved: () => void;
}

export function QuickAddModal({
  eventType,
  dateKey,
  existingEntry,
  onClose,
  onSaved,
}: QuickAddModalProps) {
  const [score, setScore] = useState(existingEntry?.score ?? 5);
  const [note, setNote] = useState(existingEntry?.note ?? '');
  const [saving, setSaving] = useState(false);
  const Icon = getIcon(eventType.icon);

  async function handleSave() {
    setSaving(true);
    await repository.upsertLogEntry({
      event_type_id: eventType.id,
      date: dateKey,
      score,
      note: note.trim() ? note.trim() : null,
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  async function handleRemove() {
    if (!existingEntry) return;
    setSaving(true);
    await repository.deleteLogEntry(existingEntry.id);
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Icon color={eventType.color} size={28} />
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {eventType.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{dateKey}</p>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
            <span>Score</span>
            <span>{score}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: eventType.color }}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Note (optional)
          </label>
          <textarea
            value={note ?? ''}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-slate-400"
            placeholder="How did it go?"
          />
        </div>

        <div className="flex justify-between gap-2 pt-2">
          {existingEntry ? (
            <button
              onClick={handleRemove}
              disabled={saving}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            style={{ backgroundColor: eventType.color }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
