import type { StatusLevel } from "@/tokens/colors";
import type { ChartDataPoint } from "@/tokens/base.types";

export type PipelineFlowNodeProps = {
  name: string;
  metrics?: { label: string; value: string | number }[];
  /** Single emphasized stat (big colored value + optional caption), replaces the metrics list when set */
  highlight?: { value: string; label?: string; caption?: string };
  sparklineData?: ChartDataPoint[];
  status: StatusLevel;
  isLoading?: boolean;
};
