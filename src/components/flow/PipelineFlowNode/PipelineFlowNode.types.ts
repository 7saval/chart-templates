import type { StatusLevel } from "@/tokens/colors";

export type PipelineFlowNodeProps = {
  name: string;
  metrics?: { label: string; value: string | number }[];
  /** Single emphasized stat (big colored value + optional caption), replaces the metrics list when set */
  highlight?: { value: string; label?: string; caption?: string };
  sparklineData?: number[];
  status: StatusLevel;
  isLoading?: boolean;
};
