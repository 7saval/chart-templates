import ReactECharts from 'echarts-for-react';
import { STATUS_COLORS } from '@/tokens/colors';
import type { SparklineChartProps } from './SparklineChart.types';

export function SparklineChart({ data, height = 32, status = 'info' }: SparklineChartProps) {
  const option = {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: STATUS_COLORS[status], width: 1.5 },
      areaStyle: { color: STATUS_COLORS[status], opacity: 0.15 },
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'svg' }} />;
}
