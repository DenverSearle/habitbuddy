import type { EventType, LogEntry } from '../../types';
import { Modal } from '../layout/Modal';
import { getIcon } from '../../utils/iconRegistry';

interface LogDetailPopupProps {
  eventType: EventType;
  entry: LogEntry;
  onClose: () => void;
  onEdit: () => void;
}

export function LogDetailPopup({ eventType, entry, onClose, onEdit }: LogDetailPopupProps) {
  const Icon = getIcon(eventType.icon);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Icon color={eventType.color} size={28} />
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{eventType.name}</h2>
            <p className="text-xs text-slate-500">{entry.date}</p>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-600">Score</div>
          <div className="text-2xl font-semibold" style={{ color: eventType.color }}>
            {entry.score}/10
          </div>
        </div>

        {entry.note && (
          <div>
            <div className="text-sm font-medium text-slate-600">Note</div>
            <p className="text-sm whitespace-pre-wrap text-slate-700">{entry.note}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: eventType.color }}
          >
            Edit
          </button>
        </div>
      </div>
    </Modal>
  );
}
