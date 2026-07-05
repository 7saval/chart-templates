import type { StatusLevel } from '@/tokens/colors';

export interface ProgressKpiData {
  label: string;
  value: number | string;
  total: number;
  usedPct: number;
  status?: StatusLevel;
}

export interface ProgressKpiCardProps {
  data: ProgressKpiData;
  isLoading?: boolean;
}
