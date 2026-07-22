import type { StatusLevel } from "@/tokens/colors";

export interface MiniStatCellProps {
  label: string;
  value: number | string;
  unit?: string;
  status?: StatusLevel;
  isLoading?: boolean;
}
