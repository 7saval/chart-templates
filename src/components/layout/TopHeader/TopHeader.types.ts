import type { TimeRangeUnit } from "@/components/layout/TimeRangeToggle/TimeRangeToggle.types";

export type TopHeaderTimeUnit = TimeRangeUnit;

export interface TopHeaderProps {
  env: string;
  envOptions: string[];
  onEnvChange: (env: string) => void;
  pipeline: string;
  pipelineOptions: string[];
  onPipelineChange: (pipeline: string) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (v: boolean) => void;
  lastRefresh: string;
  cluster?: string;
  clusterOptions?: string[];
  onClusterChange?: (cluster: string) => void;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
  timeUnit?: TopHeaderTimeUnit;
  onTimeUnitChange?: (unit: TopHeaderTimeUnit) => void;
  systemResponseMs?: number;
  operatorName?: string;
}
