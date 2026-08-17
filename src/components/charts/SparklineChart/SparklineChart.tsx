import ReactECharts from 'echarts-for-react';
import { STATUS_COLORS } from '@/tokens/colors';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { SparklineChartProps } from './SparklineChart.types';

function formatTooltip(timestamp: number, value: number) {
  const label = new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${label}<br/>${value}`;
}

export function SparklineChart({ data, height = 32, status = 'info', range }: SparklineChartProps) {
  const color = STATUS_COLORS[status];
  const earliest = data[0]?.timestamp;

  const option = {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: 'time', show: false },
    yAxis: { type: 'value', show: false },
    dataZoom: range
      ? [
          {
            type: 'inside',
            startValue: earliest !== undefined ? Math.max(range.from.getTime(), Number(earliest)) : range.from.getTime(),
            endValue: range.to.getTime(),
            zoomOnMouseWheel: false,
            moveOnMouseMove: false,
          },
        ]
      : undefined,
    tooltip: {
      trigger: 'axis',
      ...DL_OPS_DARK_THEME.tooltip,
      appendToBody: true,
      formatter: (params: unknown) => {
        const p = Array.isArray(params) ? params[0] : params;
        const [ts, value] = (p as { value: [number, number] }).value;
        return formatTooltip(ts, value);
      },
    },
    series: [{
      type: 'line',
      data: data.map((d) => [d.timestamp, d.value]),
      smooth: true,
      symbol: 'none',
      lineStyle: { color, width: 1.5 },
      areaStyle: {
        opacity: 0.35,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color },
            { offset: 1, color: 'transparent' },
          ],
        },
      },
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'svg' }} />;
}
