export interface KpiCardCompoundData {
  label: string;
  value: number | string;
  breakdown: { label: string; count: number; color: string }[];
}

export interface KpiCardCompoundProps {
  data: KpiCardCompoundData;
  isLoading?: boolean;
}
