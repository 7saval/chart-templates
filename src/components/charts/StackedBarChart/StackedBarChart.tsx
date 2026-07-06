import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { StackedBarChartProps } from './StackedBarChart.types';

export function StackedBarChart({ categories, series, height = 240, isLoading }: StackedBarChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    grid: { left: 40, right: 20, top: 32, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: { ...DL_OPS_DARK_THEME.xAxis, type: 'category', data: categories },
    yAxis: { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data.map((d) => d.value),
      itemStyle: { color: s.color },
    })),
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
