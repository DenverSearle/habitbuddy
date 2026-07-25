interface SparklineProps {
  scores: (number | null)[];
  color: string;
  width?: number;
  height?: number;
}

const MIN_SCORE = 1;
const MAX_SCORE = 10;
const PAD = 2;

export function Sparkline({ scores, color, width = 110, height = 34 }: SparklineProps) {
  const stepX = scores.length > 1 ? (width - PAD * 2) / (scores.length - 1) : 0;

  let d = '';
  let penDown = false;
  scores.forEach((value, i) => {
    if (value == null) {
      penDown = false;
      return;
    }
    const x = PAD + i * stepX;
    const y = PAD + (1 - (value - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * (height - PAD * 2);
    d += `${penDown ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
    penDown = true;
  });

  if (!d) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
        <line
          x1={PAD}
          y1={height / 2}
          x2={width - PAD}
          y2={height / 2}
          className="stroke-slate-300 dark:stroke-slate-600"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
      <path
        d={d.trim()}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
