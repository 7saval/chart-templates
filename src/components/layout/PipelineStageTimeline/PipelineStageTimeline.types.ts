import type { ReactNode } from "react";
import type { StatusLevel } from "@/tokens/colors";

export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
  icon?: ReactNode;
  nodeStatuses?: StatusLevel[];
  /** 다음 스테이지로의 처리량(source 기준). 연결선 굵기/흐름 속도를 타임라인 내 상대(min-max) 스케일로 결정하는 데 사용. */
  volume?: { value: number; unit: string };
}

export interface PipelineStageTimelineProps {
  stages: PipelineStage[];
}
