import type { StatusLevel } from '@/tokens/colors';
import type { ChartDataPoint } from '@/tokens/base.types';

export interface KpiCardData {
  label: string;
  value: number | string;
  unit?: string;
  deltaPct?: number;
  compareLabel?: string;
  trend?: ChartDataPoint[];
  status?: StatusLevel;
  breakdown?: { label: string; count: number; color: string }[];
}

export interface KpiCardProps {
  data: KpiCardData;
  isLoading?: boolean;
  error?: string;
  range?: { from: Date; to: Date };
}
