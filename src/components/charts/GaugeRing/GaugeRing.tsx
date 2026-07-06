import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { GaugeRingProps } from './GaugeRing.types';

export function GaugeRing({ value, target, warningThreshold = 80, unit = '%', height = 200, isLoading }: GaugeRingProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [warningThreshold / 100, '#22c55e'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: { itemStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { valueAnimation: true, formatter: `{value}${unit}`, color: '#e2e8f0', fontSize: 20, offsetCenter: [0, '60%'] },
      data: [{ value }],
      ...(target !== undefined && {
        anchor: { show: false },
      }),
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
