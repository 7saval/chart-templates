import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { DonutRingChartProps } from './DonutRingChart.types';

export function DonutRingChartRecharts({ data, height = 240 }: DonutRingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height as number}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="75%">
          {data.map((d, i) => <Cell key={i} fill={d.color ?? '#3b82f6'} />)}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
