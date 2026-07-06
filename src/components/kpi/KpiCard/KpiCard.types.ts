import type { StatusLevel } from '@/tokens/colors';

export interface KpiCardData {
  label: string;
  value: number | string;
  unit?: string;
  deltaPct?: number;
  compareLabel?: string;
  trend?: number[];
  status?: StatusLevel;
  breakdown?: { label: string; count: number; color: string }[];
}

export interface KpiCardProps {
  data: KpiCardData;
  isLoading?: boolean;
  error?: string;
}
