import type { StatusLevel } from "./colors";

export interface ChartBaseProps {
  height?: number | string;
  isLoading?: boolean;
  error?: string;
  theme?: "dark" | "light";
}

export interface ChartDataPoint {
  timestamp?: string | number;
  label?: string;
  value: number;
}

export interface SeriesConfig {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: "line" | "bar" | "area";
  dashed?: boolean;
}

export type { StatusLevel };
