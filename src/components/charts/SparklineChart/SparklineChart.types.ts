import type { StatusLevel } from '@/tokens/colors';

export interface SparklineChartProps {
  data: number[];
  height?: number;
  status?: StatusLevel;
}
