import type { Node, Edge } from "@xyflow/react";
import type { PipelineFlowNodeProps } from "@/components/flow/PipelineFlowNode/PipelineFlowNode.types";

export type PipelineFlowNodeType = Node<PipelineFlowNodeProps, "pipelineNode">;
export type PipelineFlowEdgeData = {
  isBottleneck?: boolean;
};
export type PipelineFlowEdgeType = Edge<PipelineFlowEdgeData>;

export interface PipelineFlowDiagramProps {
  nodes: PipelineFlowNodeType[];
  edges: PipelineFlowEdgeType[];
  height?: number;
  direction?: "vertical" | "horizontal";
  /** TopHeader 기간 선택과 연동된 구간. 각 노드의 미니 차트로 전달됨 */
  range?: { from: Date; to: Date };
}
