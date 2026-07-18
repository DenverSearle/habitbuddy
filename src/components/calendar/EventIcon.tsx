import type { LucideIcon } from 'lucide-react';

interface EventIconProps {
  icon: LucideIcon;
  color: string;
  score: number | null; // 1-10, null = unlogged
  size?: number;
  onClick?: () => void;
  title?: string;
}

export function EventIcon({ icon: Icon, color, score, size = 48, onClick, title }: EventIconProps) {
  const iconSize = size * 0.7;
  const fillPct = score != null ? score * 10 : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="relative inline-flex shrink-0 items-center justify-center rounded-xl transition hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
    >
      <div className="relative" style={{ width: iconSize, height: iconSize }}>
        <Icon
          color="#d1d5db"
          strokeWidth={1.75}
          style={{ position: 'absolute', inset: 0, width: iconSize, height: iconSize }}
        />
        {score != null && (
          <div
            className="absolute bottom-0 left-0 w-full overflow-hidden"
            style={{ height: `${fillPct}%` }}
          >
            <div className="absolute bottom-0 left-0" style={{ width: iconSize, height: iconSize }}>
              <Icon color={color} strokeWidth={1.75} style={{ width: iconSize, height: iconSize }} />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
