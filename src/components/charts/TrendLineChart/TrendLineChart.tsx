import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { TrendLineChartProps } from './TrendLineChart.types';

interface AxisTooltipParam {
  marker: string;
  seriesName: string;
  axisValue: number;
  value: [number, number];
}

function formatTimeAxisTooltip(params: unknown) {
  const list = (Array.isArray(params) ? params : [params]) as AxisTooltipParam[];
  const ts = Number(list[0]?.axisValue);
  const header = Number.isFinite(ts)
    ? new Date(ts).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '';
  const rows = list
    .map(
      (p) =>
        `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px"><span>${p.marker}${p.seriesName}</span><span style="font-weight:600">${Number(p.value[1]).toLocaleString()}</span></div>`,
    )
    .join('');
  return `<div style="margin-bottom:4px">${header}</div>${rows}`;
}

export function TrendLineChart({
  series,
  xLabels,
  range,
  height = 240,
  isLoading,
  error,
  showLegend = true,
}: TrendLineChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;
  if (error) return <div className="flex items-center justify-center text-sm text-status-critical" style={{ height }}>{error}</div>;
  if (series.length === 0) return <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>No data</div>;

  const hasSecondaryAxis = series.some((s) => s.yAxisGroup === 'secondary');
  const isTimeAxis = !!range;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: showLegend ? { top: 0, textStyle: { color: '#94a3b8' } } : { show: false },
    grid: { left: 44, right: hasSecondaryAxis ? 48 : 20, top: showLegend ? 32 : 12, bottom: 24 },
    tooltip: isTimeAxis
      ? { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis', axisPointer: { type: 'line' }, formatter: formatTimeAxisTooltip }
      : { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: isTimeAxis
      ? { ...DL_OPS_DARK_THEME.xAxis, type: 'time' }
      : { ...DL_OPS_DARK_THEME.xAxis, type: 'category', data: xLabels },
    yAxis: hasSecondaryAxis
      ? [
          { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
          { ...DL_OPS_DARK_THEME.yAxis, type: 'value', splitLine: { show: false } },
        ]
      : { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
    dataZoom: isTimeAxis
      ? [
          {
            type: 'inside',
            startValue: range!.from.getTime(),
            endValue: range!.to.getTime(),
            zoomOnMouseWheel: false,
            moveOnMouseMove: false,
          },
        ]
      : [{ type: 'inside' }, { type: 'slider', height: 16 }],
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      yAxisIndex: s.yAxisGroup === 'secondary' ? 1 : 0,
      data: isTimeAxis ? s.data.map((d) => [Number(d.timestamp), d.value]) : s.data.map((d) => d.value),
      smooth: true,
      lineStyle: { color: s.color, type: s.dashed ? 'dashed' : 'solid' },
      itemStyle: { color: s.color },
    })),
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" notMerge />;
}
