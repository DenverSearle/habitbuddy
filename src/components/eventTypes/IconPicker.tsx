import { getIcon, ICON_NAMES } from '../../utils/iconRegistry';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICON_NAMES.map((name) => {
        const Icon = getIcon(name);
        const selected = name === value;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={`flex items-center justify-center rounded-lg border p-2 ${
              selected ? 'border-slate-800 bg-slate-100' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Icon size={20} className="text-slate-700" />
          </button>
        );
      })}
    </div>
  );
}
