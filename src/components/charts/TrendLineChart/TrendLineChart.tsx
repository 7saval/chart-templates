import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { TrendLineChartProps } from './TrendLineChart.types';

export function TrendLineChart({ series, xLabels, height = 240, isLoading, error }: TrendLineChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;
  if (error) return <div className="flex items-center justify-center text-sm text-status-critical" style={{ height }}>{error}</div>;
  if (series.length === 0) return <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>No data</div>;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    grid: { left: 40, right: 20, top: 32, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: { ...DL_OPS_DARK_THEME.xAxis, type: 'category', data: xLabels },
    yAxis: { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 16 }],
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.data.map((d) => d.value),
      smooth: true,
      lineStyle: { color: s.color, type: s.dashed ? 'dashed' : 'solid' },
      itemStyle: { color: s.color },
    })),
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" notMerge />;
}
