import type { StatusLevel } from "@/tokens/colors";
import type { ChartDataPoint } from "@/tokens/base.types";

export type PipelineFlowNodeProps = {
  name: string;
  /** 이름 아래 표시되는 설명 한 줄 (예: "실시간 변경 캡쳐", "Oracle · CDC") */
  subtitle?: string;
  /** subtitle과 함께 쓰는 한 줄 인라인 스탯 (예: "9개 노드", "4.2K rec/s"). 지정 시 metrics/highlight 대신 렌더링됨 */
  stats?: string[];
  metrics?: { label: string; value: string | number }[];
  /** Single emphasized stat (big colored value + optional caption), replaces the metrics list when set */
  highlight?: { value: string; label?: string; caption?: string };
  sparklineData?: ChartDataPoint[];
  /** 미니 차트 종류. 기본값 "line" */
  chartVariant?: "line" | "bar";
  status: StatusLevel;
  isLoading?: boolean;
  /** TopHeader 기간 선택과 연동된 구간 (SparklineChart로 그대로 전달) */
  range?: { from: Date; to: Date };
};
