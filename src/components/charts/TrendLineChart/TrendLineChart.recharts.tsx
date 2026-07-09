import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendLineChartProps } from './TrendLineChart.types';

export function TrendLineChartRecharts({ series, xLabels, height = 240, isLoading }: TrendLineChartProps) {
  if (isLoading) return <div style={{ height }} className="animate-pulse bg-muted/20 rounded" />;

  const data = xLabels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    series.forEach((s) => { row[s.name] = s.data[i]?.value ?? 0; });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height as number}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="label" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Legend />
        {series.map((s) => (
          <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} dot={false} strokeDasharray={s.dashed ? '4 4' : undefined} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
