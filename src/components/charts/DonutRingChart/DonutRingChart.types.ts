import type { ChartBaseProps } from '@/tokens/base.types';

export interface DonutSlice {
  name: string;
  value: number;
  color?: string;
}

export interface DonutRingChartProps extends ChartBaseProps {
  data: DonutSlice[];
}
