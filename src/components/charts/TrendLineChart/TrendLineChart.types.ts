import type { ChartBaseProps, SeriesConfig } from '@/tokens/base.types';

export interface TrendLineChartProps extends ChartBaseProps {
  series: SeriesConfig[];
  xLabels: (string | number)[];
}
