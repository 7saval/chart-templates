import type { ChartBaseProps, SeriesConfig } from '@/tokens/base.types';

export interface StackedBarChartProps extends ChartBaseProps {
  categories: string[];
  series: SeriesConfig[];
}
