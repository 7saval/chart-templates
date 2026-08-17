import ReactECharts from 'echarts-for-react';
import { STATUS_COLORS } from '@/tokens/colors';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { MiniBarChartProps } from './MiniBarChart.types';

function formatTooltip(timestamp: number, value: number) {
  const label = new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${label}<br/>${value}`;
}

export function MiniBarChart({ data, height = 32, status = 'info', range }: MiniBarChartProps) {
  const color = STATUS_COLORS[status];

  // echarts의 dataZoom(inside) + bar 시리즈 조합이 이 노드 트리(React Flow 커스텀 노드) 안에서
  // 레이아웃이 깨지는 버그가 있어, dataZoom 대신 구간을 직접 필터링해 보여줌.
  const visibleData = range
    ? data.filter((d) => {
        const ts = Number(d.timestamp);
        return ts >= range.from.getTime() && ts <= range.to.getTime();
      })
    : data;

  const option = {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: 'time', show: false },
    yAxis: { type: 'value', show: false, scale: true },
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
      type: 'bar',
      data: visibleData.map((d) => [d.timestamp, d.value]),
      itemStyle: { color, borderRadius: [1, 1, 0, 0] },
      barMaxWidth: 6,
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'svg' }} notMerge />;
}
