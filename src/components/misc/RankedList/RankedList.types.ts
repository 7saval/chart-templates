import type { StatusLevel } from "@/tokens/colors";

export interface RankedListItem {
  label: string;
  value: number | string;
  unit?: string;
  status?: StatusLevel;
}

export interface RankedListProps {
  items: RankedListItem[];
  maxItems?: number;
  isLoading?: boolean;
  emptyMessage?: string;
}
