const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#64748b',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-full border-2 ${
              value.toLowerCase() === color
                ? 'border-slate-800 dark:border-slate-200'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        Custom
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-slate-200 dark:border-slate-600"
        />
      </label>
    </div>
  );
}
