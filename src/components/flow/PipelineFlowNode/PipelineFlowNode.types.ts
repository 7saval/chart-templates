import type { StatusLevel } from "@/tokens/colors";

export type PipelineFlowNodeProps = {
  name: string;
  metrics: { label: string; value: string | number }[];
  sparklineData?: number[];
  status: StatusLevel;
  isLoading?: boolean;
};
