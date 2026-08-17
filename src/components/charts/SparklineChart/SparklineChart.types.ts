import type { ChartDataPoint } from '@/tokens/base.types';
import type { StatusLevel } from '@/tokens/colors';

export interface SparklineChartProps {
  data: ChartDataPoint[];
  height?: number;
  status?: StatusLevel;
  range?: { from: Date; to: Date };
}
