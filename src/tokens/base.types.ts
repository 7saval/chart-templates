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
  /** 스케일이 크게 다른 시리즈를 보조 y축으로 분리할 때 사용 (기본값: primary) */
  yAxisGroup?: "primary" | "secondary";
}

export type { StatusLevel };
