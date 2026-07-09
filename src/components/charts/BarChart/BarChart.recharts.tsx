import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import type { BarChartProps } from './BarChart.types';

export function BarChartRecharts({ categories, values, colors, orientation = 'vertical', height = 240 }: BarChartProps) {
  const data = categories.map((c, i) => ({ name: c, value: values[i] }));
  return (
    <ResponsiveContainer width="100%" height={height as number}>
      <RBarChart data={data} layout={orientation === 'horizontal' ? 'vertical' : 'horizontal'}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        {orientation === 'horizontal' ? (
          <><XAxis type="number" stroke="#94a3b8" /><YAxis type="category" dataKey="name" stroke="#94a3b8" /></>
        ) : (
          <><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /></>
        )}
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Bar dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={colors?.[i] ?? '#3b82f6'} />)}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}
