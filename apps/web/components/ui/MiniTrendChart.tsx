'use client';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface MiniTrendChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function MiniTrendChart({ data, color = '#10b981', height = 40 }: MiniTrendChartProps) {
  if (data.length < 2) {
    return <div className="text-[10px] text-zinc-500 text-center">No data yet</div>;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 200;
  const padding = 2;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  return (
    <svg className="w-full" viewBox={`0 0 ${width} ${height}`} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polyline}
      />
    </svg>
  );
}
