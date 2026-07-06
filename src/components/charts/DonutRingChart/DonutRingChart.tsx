import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { DonutRingChartProps } from './DonutRingChart.types';

export function DonutRingChart({ data, height = 240, isLoading }: DonutRingChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: '#94a3b8' } },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['35%', '50%'],
      data: data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
      label: { show: false },
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
