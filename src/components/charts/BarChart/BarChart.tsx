import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { BarChartProps } from './BarChart.types';

export function BarChart({ categories, values, colors, orientation = 'vertical', height = 240, isLoading }: BarChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const categoryAxis = { ...DL_OPS_DARK_THEME.xAxis, type: 'category' as const, data: categories };
  const valueAxis = { ...DL_OPS_DARK_THEME.yAxis, type: 'value' as const };

  const option = {
    ...DL_OPS_DARK_THEME,
    grid: { left: orientation === 'horizontal' ? 80 : 40, right: 20, top: 16, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: orientation === 'horizontal' ? valueAxis : categoryAxis,
    yAxis: orientation === 'horizontal' ? categoryAxis : valueAxis,
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors?.[i] } })),
      barMaxWidth: 28,
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
