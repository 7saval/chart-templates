import type { ChartBaseProps } from '@/tokens/base.types';

export interface BarChartProps extends ChartBaseProps {
  categories: string[];
  values: number[];
  colors?: string[];
  orientation?: 'horizontal' | 'vertical';
}
