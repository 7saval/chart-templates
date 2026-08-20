import type { StatusLevel } from '@/tokens/colors';
import type { ChartDataPoint } from '@/tokens/base.types';

export interface ProgressKpiData {
  label: string;
  value: number | string;
  total: number;
  usedPct: number;
  status?: StatusLevel;
  sparklineData?: ChartDataPoint[];
  /** 미니 차트 종류. 기본값 "line" */
  chartVariant?: 'line' | 'bar';
}

export interface ProgressKpiCardProps {
  data: ProgressKpiData;
  isLoading?: boolean;
  range?: { from: Date; to: Date };
}
