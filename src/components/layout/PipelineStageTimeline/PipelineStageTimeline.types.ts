import type { StatusLevel } from "@/tokens/colors";

export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
}

export interface PipelineStageTimelineProps {
  stages: PipelineStage[];
}
